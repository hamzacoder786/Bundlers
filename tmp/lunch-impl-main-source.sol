// SPDX-License-Identifier: MIT
//
//   ██╗     ██╗   ██╗███╗   ██╗ ██████╗██╗  ██╗
//   ██║     ██║   ██║████╗  ██║██╔════╝██║  ██║
//   ██║     ██║   ██║██╔██╗ ██║██║     ███████║
//   ██║     ██║   ██║██║╚██╗██║██║     ██╔══██║
//   ███████╗╚██████╔╝██║ ╚████║╚██████╗██║  ██║
//   ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝
//   fair-launch coins on Robinhood Chain
//
pragma solidity ^0.8.26;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

import {LunchTokenPlain} from "./LunchTokenPlain.sol";
// Round-35 fix: LunchTokenPlain's CREATE bytecode lives in this linked library instead of embedded here,
// to keep this contract under the EIP-170 24,576-byte limit. Delegatecalled → deterministic addresses
// unchanged; see the library's own doc.
import {LunchV3TokenDeployer} from "./LunchV3TokenDeployer.sol";
import {LunchV3FeeLocker} from "../launchpad/LunchV3FeeLocker.sol";
import {TickMath08} from "../launchpad/TickMath08.sol";
import {IV3Factory, IV3Pool, INPM, IWrappedNative} from "../launchpad/IV3.sol";

interface IReferralSplitterSetter {
    function setReferrer(address token, address referrer) external;
}

/**
 * @title LunchV3LauncherSingle
 * @notice UUPS-upgradeable factory that launches a token whose ENTIRE supply is placed as ONE
 *         single-sided Uniswap V3 concentrated-liquidity position spanning the full range
 *         (launchTick → the max/min usable tick), on a real DEX from block 0, with no migration.
 *         NOTE: this contract previously split supply across two bands ("curve" + "tail", the
 *         latter thinning to infinity) — see _launch's doc comment for why that was collapsed to a
 *         single full-range band. midBandTicks/band1DepthWei/initTwoBand/setMidBandTicks/
 *         setBand1Depth are retained ONLY as a non-zero initialization gate for ABI/storage-layout
 *         back-compat; none of them affect where the single band's boundaries fall.
 *         The single LP NFT (the two-band design's second NFT was retired along with the two-band
 *         split above) is sent to a rug-proof LunchV3FeeLocker (principal locked forever; only swap
 *         fees can ever be collected + split creator/platform). The per-launch ERC20 (LunchTokenPlain —
 *         LunchV3Token is the OLD, retired token type this factory no longer deploys, see _launch's own
 *         comment) is deployed fresh and is IMMUTABLE / non-upgradeable by design.
 *
 * @dev Single-sided math (project token deposited, 0 X_TOKEN):
 *      Uniswap prices are token1/token0. A position [tickLower, tickUpper] with current tick `tc`
 *      holds ONLY token0 when tc <= tickLower, and ONLY token1 when tc >= tickUpper.
 *        - If projectToken == token0 (token < X_TOKEN): range = [launchTick, maxUsableTick],
 *          initialize AT tickLower (tc == tickLower) -> deposits only token0 (project), 0 token1 (X).
 *          Buyers push tc UP into the range as they buy.
 *        - If projectToken == token1 (token > X_TOKEN): range = [minUsableTick, launchTick],
 *          initialize AT tickUpper (tc == tickUpper) -> deposits only token1 (project), 0 token0 (X).
 *          Buyers push tc DOWN into the range as they buy.
 *      (Matches Noxa's verified CELERIS position: token1=project initialized at its upper tick. The
 *      ordering-agnostic invariant asserted on-fork is simply "X_TOKEN pulled by mint == 0".)
 */
contract LunchV3LauncherSingle is OwnableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IERC20;

    // Retained for ABI/back-compat only — the initial buy is NO LONGER capped (spends the dev's ETH).
    uint256 public constant MAX_INITIAL_BUY_BPS = 2000;

    // 2**96 — Uniswap sqrtPriceX96 fixed-point scale. DEAD CODE (round-24 doc fix): never referenced
    // anywhere else in this file — all sqrt-price handling goes through TickMath08.getSqrtRatioAtTick and
    // the pool's own slot0()/swap() returns. Retained for ABI/back-compat only, same as MAX_INITIAL_BUY_BPS
    // above (unlike that constant this one is `private`, so purely inert — kept only so removing it isn't
    // itself a storage-layout-adjacent surprise for anyone diffing this file against an older version).
    uint256 private constant Q96 = 0x1000000000000000000000000;

    // Protocol addresses (Robinhood Chain 4663), set in initialize().
    IV3Factory public factory;
    INPM public npm;
    address public xToken; // == NPM.WETH9(); WETH-like wrapper of native ETH
    LunchV3FeeLocker public feeLocker;

    // Default distance (in ticks, magnitude) of the launch tick from parity. Mirrors Noxa (~204200).
    // Aligned to the fee tier's spacing at launch time. Owner-tunable, keeps launch() signature stable.
    int24 public launchTickMagnitude;

    // Optional flat platform launch fee in native ETH. The real revenue is the fee-locker's cut.
    uint256 public launchFeeWei;

    // Locked launch supply. When non-zero, every launch MUST use exactly this totalSupply. Combined
    // with launchTickMagnitude this pins the initial market cap (MC = price × supply × ethPrice) to a
    // fixed value across all launches. 0 = unlocked (any supply allowed). Owner-settable.
    uint256 public enforcedSupply;

    // Transient guard: the pool currently authorized to invoke our swap callback.
    address private _activePool;

    struct TokenInfo {
        address token;
        address creator;
        address pool;
        uint256 tokenId;   // the single full-range position NFT (was "band-1 (curve)" before the
                           // two-band design was collapsed — see the contract-level doc comment)
        uint24 fee;
        uint256 createdAt;
        uint256 tokenId2;  // always 0 in this version (no tail position exists anymore) — field kept
                           // for struct layout/ABI back-compat (append-only), not a live second NFT
    }

    mapping(address => TokenInfo) public tokenInfo;
    address[] public allTokens;

    event V3TokenLaunched(
        address indexed token,
        uint256 indexed tokenId,
        address indexed creator,
        address pool,
        uint24 fee
    );
    event LaunchTickMagnitudeSet(int24 magnitude);
    event LaunchFeeSet(uint256 amountWei);
    event EnforcedSupplySet(uint256 supply);
    event BaseTokenURISet(string base);
    /// @dev `tailTokenId` and `band2Tokens` are ALWAYS 0 in this version — no tail position exists
    /// anymore (see the contract-level @notice and TokenInfo.tokenId2's own comment for the same
    /// disclaimer). Field names kept for ABI/event-shape back-compat, not because curve/tail semantics
    /// are still live. Off-chain indexers should not surface these two as meaningful non-zero values.
    event V3BandsLaunched(address indexed token, uint256 curveTokenId, uint256 tailTokenId, int24 launchTick, int24 midTick, uint256 band1Tokens, uint256 band2Tokens);
    /// @notice Round-19 completeness fix: emitted only for the salted launch family (launchWithSalt/
    ///         launchWithMetaSalt/launchWithSaltRef/launchWithMetaSaltRef), so an indexer reconstructing
    ///         launch history purely from logs (the common pattern — no archival/trace access needed) can
    ///         recover which userSalt produced a given token, closing the audit-trail gap predictTokenAddress's
    ///         own extensive doc comments assume off-chain systems can already do.
    event V3SaltedLaunch(address indexed token, bytes32 userSalt);
    event MidBandTicksSet(int24 ticks);
    event Band1DepthSet(uint256 depthWei);
    // NOTE (round-28 doc fix): this file does NOT declare every event in one place — some (e.g.
    // FeeLockerSet, ReferralSplitterSet, FeeLockerRegisterGasSet, V3TokenMeta) are declared inline right
    // above their own setter/emit site instead. Two prior rounds (25, 27) each tried to enumerate the
    // out-of-block events here and each undercounted — the enumeration itself kept going stale as new
    // events were added elsewhere. Rather than maintain a hand-counted list that has now been wrong twice,
    // an indexer/integrator wanting the true, complete event ABI should generate it mechanically (e.g.
    // `forge inspect LunchV3LauncherSingle abi`) rather than trust any hand-written "N events live outside
    // this block" comment, including this one.

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address factory_,
        address npm_,
        address xToken_,
        address feeLocker_,
        address owner_
    ) external initializer {
        require(factory_ != address(0) && npm_ != address(0) && xToken_ != address(0), "zero addr");
        require(feeLocker_ != address(0), "locker=0");
        __Ownable_init(owner_);
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
        factory = IV3Factory(factory_);
        npm = INPM(npm_);
        xToken = xToken_;
        feeLocker = LunchV3FeeLocker(payable(feeLocker_));
        launchTickMagnitude = 204200; // default set here (proxy: no inline initializers)
        // VESTIGIAL (round-21 doc fix): these two values are retained ONLY as a non-zero "bands unset" init
        // gate for ABI/storage-layout back-compat — see the contract-level @notice and initTwoBand()'s
        // NatSpec below. They no longer configure any live curve/tail/graduation split; _launch only checks
        // them for non-zero.
        midBandTicks = 23026;
        band1DepthWei = 4 ether;
    }

    /// @notice One-time initializer for midBandTicks/band1DepthWei on an already-deployed (upgraded)
    ///         proxy whose initialize() ran before these vars existed. These two vars are VESTIGIAL —
    ///         _launch only uses them as a non-zero "bands unset" gate, not to compute any band split
    ///         (see the contract-level doc comment above) — this function exists purely to satisfy that
    ///         gate on upgraded proxies; the name/defaults are retained from the old two-band design.
    ///         Owner-only.
    function initTwoBand() external onlyOwner {
        require(midBandTicks == 0 && band1DepthWei == 0, "already set");
        midBandTicks = 23026;
        band1DepthWei = 4 ether;
        emit MidBandTicksSet(23026);
        emit Band1DepthSet(4 ether);
    }

    // -----------------------------------------------------------------------
    // Launch
    // -----------------------------------------------------------------------

    /// @dev Grouped band geometry + token split — avoids stack-too-deep in _launch() (the shared internal
    /// workhorse behind all 8 launch* entry points; the public launch() wrapper itself is a trivial 3-line
    /// forwarder with no stack pressure of its own — round-23 doc fix).
    struct Bands {
        int24 launchTick;   // pool init tick (pins initial mcap)
        int24 midTick;      // VESTIGIAL — unconditionally set equal to launchTick in _launch (see that
                             // assignment's own comment); no curve/tail boundary exists anymore. Kept
                             // for event/ABI shape only, same as midBandTicks/band1DepthWei.
        int24 b1Lower; int24 b1Upper;   // the single full-range band's bounds (the ONLY real band today)
        int24 b2Lower; int24 b2Upper;   // VESTIGIAL — never assigned (stay at the int24 zero default);
                                         // no second/tail band exists anymore. Kept for ABI shape only.
        uint256 band1; uint256 band2;   // band1 = the entire supply; band2 is always 0 (see above)
    }

    // Profile (logo/banner/socials) carried IN the launch tx so the frontend needs NO post-launch
    // signature — the indexer reads it straight from V3TokenMeta. Emit-only: no new storage var, so
    // this is a storage-layout-safe UUPS upgrade. Fields are just URLs/strings (images live in storage).
    struct Meta { string image; string banner; string description; string website; string twitter; string telegram; }
    event V3TokenMeta(address indexed token, address indexed creator, string image, string banner, string description, string website, string twitter, string telegram);

    /**
     * @notice Original launch — profile is set separately afterwards. Kept for compatibility.
     *         Deploys an immutable token and places its entire supply as a single-sided V3 position.
     * @param name Token name.
     * @param symbol Token symbol.
     * @param totalSupply Total supply (18 decimals, in wei).
     * @param fee MUST be 10000 (the 1% tier) — _launch hard-reverts ("1% pool only") on any other
     *        value. _tickSpacing still resolves 500/3000/10000 for historical reasons, but only 10000
     *        is actually reachable through any launch* entry point; the other two are not live options.
     * @param initialBuyMaxTokens A yes/no FLAG (>0 = do a dev buy), NOT a cap — its value is never
     *        read as a limit. The dev buy is UNCAPPED: _initialBuy does an exact-INPUT swap of the
     *        whole attached ETH (msg.value - launchFeeWei), so the creator gets whatever that ETH buys
     *        at the launch price; the only brake is price impact walking up the band. Requires
     *        msg.value > launchFeeWei to fund it. (MAX_INITIAL_BUY_BPS is a dead leftover constant —
     *        nothing references it. Do not describe it to users as a limit.)
     * @return token The deployed token address.
     * @return tokenId The V3 position NFT id (held by the fee locker).
     */
    function launch(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint24 fee,
        uint256 initialBuyMaxTokens
    ) external payable nonReentrant returns (address token, uint256 tokenId) {
        return _launch(name, symbol, totalSupply, fee, initialBuyMaxTokens, address(0), bytes32(0), false);
    }

    /// @notice One-tap launch: sets the coin's profile atomically in the SAME transaction, so no
    ///         signature is ever needed to save the logo/banner/socials.
    function launchWithMeta(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint24 fee,
        uint256 initialBuyMaxTokens,
        Meta calldata meta
    ) external payable nonReentrant returns (address token, uint256 tokenId) {
        (token, tokenId) = _launch(name, symbol, totalSupply, fee, initialBuyMaxTokens, address(0), bytes32(0), false);
        emit V3TokenMeta(token, msg.sender, meta.image, meta.banner, meta.description, meta.website, meta.twitter, meta.telegram);
    }

    /// @notice Referral launches: same as above but the coin's referrer is named on-chain IN THIS TX
    ///         (from the caller's ?ref= link). `referrer` = the wallet that referred the creator; 0 = none.
    function launchRef(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint24 fee,
        uint256 initialBuyMaxTokens,
        address referrer
    ) external payable nonReentrant returns (address token, uint256 tokenId) {
        return _launch(name, symbol, totalSupply, fee, initialBuyMaxTokens, referrer, bytes32(0), false);
    }

    /// @notice launchWithMeta() + referral attribution — combines launchWithMeta's atomic metadata with
    ///         launchRef's on-chain referrer naming (see launchRef's doc comment for the referrer param).
    function launchWithMetaRef(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint24 fee,
        uint256 initialBuyMaxTokens,
        Meta calldata meta,
        address referrer
    ) external payable nonReentrant returns (address token, uint256 tokenId) {
        (token, tokenId) = _launch(name, symbol, totalSupply, fee, initialBuyMaxTokens, referrer, bytes32(0), false);
        emit V3TokenMeta(token, msg.sender, meta.image, meta.banner, meta.description, meta.website, meta.twitter, meta.telegram);
    }

    /// @notice Deterministic-address launch: the token address derives from a caller-chosen `userSalt`
    ///         instead of the previous blockhash, so an atomic bundler can predict it BEFORE the tx via
    ///         predictTokenAddress(). `userSalt` is plaintext calldata: anyone who can SEE the pending
    ///         transaction can compute the resulting address with certainty. That is NOT equivalent
    ///         exposure to the default path: the default address depends on this launcher's shared,
    ///         monotonically-increasing `_launchNonce`, which shifts if any other unrelated NON-SALTED
    ///         launch (launch/launchWithMeta/launchRef/launchWithMetaRef) lands first — a salted launch
    ///         landing first does NOT move it, since `_launchNonce++` only executes on the useUserSalt==
    ///         false branch below — an attacker guessing the default-path address under concurrent
    ///         nonce-based launch traffic is often wrong by execution time. A
    ///         salted address depends only on the caller's OWN msg.sender + userSalt, unaffected by
    ///         anyone else's activity — an observer who can read the pending calldata computes it with
    ///         100% reliability regardless of how many other launches race in the same mempool/block.
    ///         To be precise about the actual attack this enables: nobody else can ever DEPLOY to that
    ///         predicted address themselves (CREATE2 binds it to YOUR msg.sender, so it can't be squatted
    ///         by a third party) — the risk is that an observer acts on a DIFFERENT, downstream contract
    ///         using the known future address before your tx lands, e.g. pre-initializing this token's
    ///         (token, X_TOKEN) pool at a skewed price, so your own launch's pool-init later in this same
    ///         call reverts against the require(livePrice==sqrtLaunch) backstop below. Both paths are
    ///         equally SAFE today only because this chain's private-mempool/single-sequencer design means
    ///         nobody EXTERNAL sees pending calldata to begin with — if that assumption is ever weakened
    ///         (e.g. a future public mempool), the salted path is the strictly more reliable target for
    ///         this specific pre-init-griefing attack, not an equally-exposed one. IMPORTANT — this
    ///         framing only covers external observers; it does NOT extend to the sequencer itself. The
    ///         single sequencer, by construction, sees full calldata of every pending tx before deciding
    ///         block contents/ordering, and already has synchronous read access to the exact state
    ///         (`_launchNonce`, and `blockhash(block.number-1)`, finalized and public the instant the
    ///         prior block lands) the DEFAULT path's salt depends on — so a malicious/MEV-extracting
    ///         sequencer can compute either path's resulting address with 100% certainty (not the
    ///         "often wrong by execution time" uncertainty an external guesser faces) and grief either
    ///         one equally. The salted path is only the "more reliable target" claim relative to an
    ///         EXTERNAL observer without ordering control; against the sequencer itself, both paths rest
    ///         on the exact same trust assumption (an honest, non-colluding sequencer) with no relative
    ///         advantage either way. The livePrice==sqrtLaunch backstop stays
    ///         as the funds-safe fallback either way. IMPORTANT — mempool privacy is NOT the only
    ///         relevant assumption: predictTokenAddress is a free `view` call, so anyone can compute a
    ///         future salted address off-chain (eth_call, zero gas, no on-chain trace, not observable by
    ///         the sequencer) for any (name, symbol, totalSupply, creator, userSalt) tuple — this
    ///         contract enforces NO minimum entropy or uniqueness on the caller-supplied userSalt. Unlike
    ///         the default path (unpredictable via blockhash(block.number-1) + the shared nonce, neither
    ///         of which a caller controls ahead of time), the salted path's entire unpredictability rests
    ///         on whatever entropy the OFF-CHAIN caller/bundler chose for userSalt. If that tooling ever
    ///         uses a low-entropy or guessable scheme (a fixed value, an incrementing counter, a
    ///         timestamp), the same pre-init-griefing attack above becomes reachable purely off-chain,
    ///         with no dependency on mempool visibility at all — callers of ALL FOUR salted entry points
    ///         (launchWithSalt/launchWithMetaSalt AND launchWithSaltRef/launchWithMetaSaltRef — the Ref
    ///         variants go through this exact same useUserSalt=true path in _launch and carry the
    ///         identical risk, not just the two named here) MUST use a genuinely random 256-bit userSalt
    ///         per launch, not merely a "not previously used" one. Use a fresh random userSalt per launch: reuse
    ///         collides on CREATE2 (and reverts) only if the ENTIRE deployment tuple matches a prior
    ///         successful launch — the same msg.sender, the same userSalt, AND the same name/symbol/
    ///         totalSupply; reusing a salt alone with different coin params produces a different
    ///         address, not a revert, so don't treat "no revert" as confirmation a salt was unique.
    /// KNOWN LIMITATION (round-31 completeness find, documented not fixed): the entropy discussion above
    /// only reasons about the value being GUESSABLE — it doesn't address the value being LEAKED off-chain
    /// before broadcast. predictTokenAddress is a free, zero-gas, off-chain-computable view call, and the
    /// realistic way a bundler uses this feature is to compute userSalt, predict/display the resulting
    /// address to a user or partner integration BEFORE broadcasting, and — per this doc's own mention of
    /// "a bundler's automatic retry after a timeout" — persist it somewhere as an idempotency key. None of
    /// that requires a public mempool or a guessable value: an insecure log line, a shared analytics
    /// pipeline, a compromised dependency in the bundler's own process, or a frontend that displays the
    /// predicted address pre-submission over an observable channel all expose the same pre-init-griefing
    /// capability the entropy discussion treats as requiring "a future public mempool". This is a whole-
    /// system (off-chain tooling) risk outside what this contract alone can mitigate — flagged for anyone
    /// building bundler/CLI tooling against these salted entrypoints to treat userSalt as sensitive
    /// pre-broadcast, not just as something to generate randomly.
    function launchWithSalt(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint24 fee,
        uint256 initialBuyMaxTokens,
        bytes32 userSalt
    ) external payable nonReentrant returns (address token, uint256 tokenId) {
        return _launch(name, symbol, totalSupply, fee, initialBuyMaxTokens, address(0), userSalt, true);
    }

    /// @notice launchWithSalt() + on-chain metadata (see launchWithSalt's doc comment for the full
    ///         deterministic-addressing/entropy discussion — it applies identically here).
    function launchWithMetaSalt(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint24 fee,
        uint256 initialBuyMaxTokens,
        Meta calldata meta,
        bytes32 userSalt
    ) external payable nonReentrant returns (address token, uint256 tokenId) {
        (token, tokenId) = _launch(name, symbol, totalSupply, fee, initialBuyMaxTokens, address(0), userSalt, true);
        emit V3TokenMeta(token, msg.sender, meta.image, meta.banner, meta.description, meta.website, meta.twitter, meta.telegram);
    }

    /// @notice Deterministic-address launch that ALSO names an on-chain referrer atomically — combines
    ///         launchWithSalt + launchRef, since _launch already accepts referrer and (userSalt,
    ///         useUserSalt) independently. Without this, an atomic bundler wanting both predictable
    ///         addressing AND referral attribution in one tx had no entry point.
    /// KNOWN LIMITATION (round-28 completeness find, documented not fixed; round-32 doc fix: corrected a
    /// mechanism-level inaccuracy below): the address half of this entrypoint is fully pre-flight-
    /// verifiable via predictTokenAddress; the referral half is not — referrer==0, referrer==msg.sender,
    /// and referralSplitter unset are filtered out by the if-guard BEFORE the try/catch is even reached
    /// (not "caught by" it, as this comment previously implied); only an unregistered registrar, gas
    /// exhaustion, or a reverting splitter are actually swallowed by the try/catch itself. Either way, no
    /// event or other on-chain signal distinguishes success from any of these six causes. A bundler that
    /// specifically picked this entry point for verifiable, atomic
    /// composition of address+referral gets full verifiability on the address half and none on the
    /// referral half, and cannot detect a silent referral-naming failure even after the fact. Not fixed
    /// (adding a success/failure event would be a straightforward addition, but is a feature change, not a
    /// targeted fix, and this exact silent-no-op tradeoff is already deliberately accepted elsewhere in
    /// this file — see the referral try/catch's own doc comment) — no funds/security impact, only referral
    /// revenue attribution visibility.
    function launchWithSaltRef(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint24 fee,
        uint256 initialBuyMaxTokens,
        bytes32 userSalt,
        address referrer
    ) external payable nonReentrant returns (address token, uint256 tokenId) {
        return _launch(name, symbol, totalSupply, fee, initialBuyMaxTokens, referrer, userSalt, true);
    }

    /// @notice launchWithMetaSalt + referral attribution — see launchWithSaltRef's doc comment.
    function launchWithMetaSaltRef(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint24 fee,
        uint256 initialBuyMaxTokens,
        Meta calldata meta,
        bytes32 userSalt,
        address referrer
    ) external payable nonReentrant returns (address token, uint256 tokenId) {
        (token, tokenId) = _launch(name, symbol, totalSupply, fee, initialBuyMaxTokens, referrer, userSalt, true);
        emit V3TokenMeta(token, msg.sender, meta.image, meta.banner, meta.description, meta.website, meta.twitter, meta.telegram);
    }

    /// @notice Off-chain address prediction for ALL FOUR salted entry points (launchWithSalt/
    ///         launchWithMetaSalt AND launchWithSaltRef/launchWithMetaSaltRef — `referrer` is never part
    ///         of the salt or init-code hash computed by _create2Address, only a post-mint try/catch call
    ///         to the referral splitter, so the predicted address is identical whether or not a referrer
    ///         is supplied). `creator` is the wallet that will call the launch. Returns the CREATE2
    ///         address the token will deploy to.
    /// KNOWN LIMITATION: this is a pure address computation over (name, symbol, totalSupply, creator,
    /// userSalt) only — it does NOT check any of _launch's other require gates. This list is NOT
    /// exhaustive; the ones most likely to drift out from under a caller between predicting and
    /// launching are: fee must be exactly 10000; enforcedSupply, if set, must equal totalSupply;
    /// msg.value must cover launchFeeWei; midBandTicks/band1DepthWei must both be non-zero;
    /// feeLocker (round-34 completeness fix: owner-settable via setFeeLocker at any time, no timelock —
    /// _launch's _mintSingle reads it LIVE at execution time, both as the LP-position-NFT recipient and via
    /// feeLocker.register(); a migration in the window between predicting and launching doesn't change the
    /// predicted ADDRESS, so nothing looks wrong, but the LP NFT and all future creator/platform fee-
    /// collection rights land at a different, possibly not-yet-fully-configured contract, with no revert or
    /// on-chain signal distinguishing this from a normal launch — see setFeeLocker's own doc on the
    /// "new locker must recognize this launcher" migration precondition);
    /// launchTickMagnitude (owner-settable via setLaunchTickMagnitude, whose only guard is `>0`, not
    /// that it stays in-range) must keep the derived tick STRICTLY within (0, maxUsable) — an
    /// open lower bound, NOT [0, ...): alignedMag == 0 itself still reverts "bad tick mag" — or _launch
    /// reverts; totalSupply must be non-zero ("supply=0" — caller-controlled, not admin state, but
    /// still an unlisted revert); the pool at the predicted address/tick must not already be initialized
    /// to a DIFFERENT price ("pool pre-initialized" — this is the funds-safe backstop that turns a griefed/
    /// pre-initialized pool into a clean revert instead of a mispriced launch, see that require's own
    /// comment, but it is still an unlisted precondition of a successful launch, not of this predictor);
    /// and — the gate most directly coupled to THIS function's own output —
    /// the predicted address must not already have code ("salt used"): calling this twice for the same
    /// (creator, userSalt, name, symbol, totalSupply) tuple, or re-predicting after that exact tuple was
    /// already launched (e.g. a bundler's auto-retry after a timeout), returns the same address as
    /// before, but the matching launchWithSalt/launchWithMetaSalt call will revert against the CREATE2
    /// collision guard. If any of that state changes (or the caller's own totalSupply=0
    /// typo) between calling this and actually submitting the matching launch call, the predicted
    /// address may never be reachable (the real call reverts) even though this function itself never
    /// signals that risk. Callers relying on a predicted address across any meaningful time gap should
    /// re-validate ALL of _launch's preconditions (or just re-call this immediately before submitting,
    /// which confirms the address but not the other gates).
    /// ALSO NOTE: `creator` here is a caller-supplied parameter to THIS view function only — the actual
    /// launch (_launch) always derives its CREATE2 salt from the real `msg.sender` of the launch call, not
    /// from any caller-asserted identity. If the address that calls this prediction differs from the
    /// address that ends up calling launchWithSalt/launchWithMetaSalt (a stale cached wallet, a smart-
    /// account address instead of the EOA that actually signs, a copy-paste mismatch between two
    /// integrated systems), this returns a confidently correct-looking address that the real launch will
    /// simply never produce — no revert, no error signal. Callers must ensure `creator` here is the exact
    /// address that will actually be msg.sender for the matching launch call.
    /// ALSO NOTE: bakes in `type(LunchTokenPlain).creationCode` (round-35: this now lives in the linked
    /// LunchV3TokenDeployer library, not in this impl — see _create2Address's own note). LunchTokenPlain
    /// itself is not upgradeable and carries no version marker, and nothing in storage records which bytecode
    /// a given deployment used. If the proxy is upgraded to a new implementation linked against a
    /// LunchV3TokenDeployer built from a modified LunchTokenPlain, every previously-computed prediction for a
    /// not-yet-submitted userSalt becomes silently wrong the moment the upgrade lands — no revert, no on-chain
    /// signal. Re-predict immediately before submitting if a meaningful time gap (that could span an upgrade)
    /// is possible.
    /// KNOWN LIMITATION (round-32 completeness find, documented not fixed): this function fixes the token
    /// ADDRESS, not the launch PRICE/tick. Every drift risk enumerated above (and elsewhere in this file's
    /// "predictions can go stale" doc) is framed as "or _launch reverts" — but launchTickMagnitude
    /// specifically can drift WITHOUT a revert: setLaunchTickMagnitude's only guard is `magnitude > 0`,
    /// and _launch's own guard only requires the resulting aligned tick stay within the (very wide) legal
    /// range. An owner change that stays within that range silently changes the launch tick — and
    /// therefore the initial price/market cap — for a launch whose ADDRESS an integrator already predicted
    /// and may have planned downstream operations around. Re-calling predictTokenAddress itself doesn't
    /// expose this value's current state, so its own re-validation advice above doesn't actually catch
    /// this specific drift. Not fixed here (would need either a price/tick parameter this view function
    /// could assert against, or a public getter callers know to separately re-check) — flagged for anyone
    /// treating "predictTokenAddress still returns the same address" as confirmation that launch economics
    /// haven't moved underneath it.
    function predictTokenAddress(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        address creator,
        bytes32 userSalt
    ) external view returns (address) {
        return _create2Address(name, symbol, totalSupply, creator, keccak256(abi.encode(creator, userSalt)));
    }

    /// @dev Single source of truth for the CREATE2 address this launcher's salted path derives — used by
    /// BOTH predictTokenAddress (the off-chain predictor) and _launch's collision guard (the on-chain
    /// check). Previously duplicated independently in both places: harmless while byte-for-byte identical,
    /// but a future edit to one (e.g. a constructor-arg reorder) without mirroring the other would have
    /// silently broken prediction accuracy with no compiler error, no revert, and no test inherently
    /// coupling the two. One shared formula makes THAT class of drift (the two call sites of this
    /// function disagreeing with each other) structurally impossible.
    /// ROUND-17 CORRECTION (updated round-36 after the round-35 library extraction): this does NOT make
    /// constructor-arg-reorder drift impossible in general — the actual token deployment independently
    /// re-states the exact same LunchTokenPlain constructor argument order a THIRD time, since Solidity's
    /// `new X{salt}(...)` syntax has no mechanism to delegate its own ABI-encoding to a helper. Round-35
    /// moved BOTH the predict math (this function now delegates to LunchV3TokenDeployer.predictPlain) AND the
    /// `new LunchTokenPlain{salt}(...)` deployment (now LunchV3TokenDeployer.deployPlain) INTO that linked
    /// library — so the two constructor-arg-order restatements that must stay mutually consistent both live
    /// in LunchV3TokenDeployer.sol (its `predictPlain`'s abi.encode and its `deployPlain`'s `new` call),
    /// NOT here and NOT in _launch anymore. A future LunchTokenPlain constructor reorder must update BOTH
    /// of those library call sites in lockstep, or predict==actual silently breaks. The predict==actual
    /// fork test is the guard that catches such a divergence before deploy.
    function _create2Address(string calldata name, string calldata symbol, uint256 totalSupply, address creator, bytes32 salt)
        internal
        view
        returns (address)
    {
        // Round-35 fix: the CREATE2 math (and the embedded type(LunchTokenPlain).creationCode it needs) lives
        // in the linked LunchV3TokenDeployer library to keep this contract under the EIP-170 size limit.
        // `launcher` is passed explicitly (== address(this)), so the result is byte-identical to the former
        // inline computation. See the library's own doc.
        return LunchV3TokenDeployer.predictPlain(name, symbol, totalSupply, address(this), creator, salt);
    }

    function _launch(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint24 fee,
        uint256 initialBuyMaxTokens,
        address referrer,
        bytes32 userSalt,
        bool useUserSalt
    ) internal returns (address token, uint256 tokenId) {
        require(totalSupply > 0, "supply=0");
        // KNOWN LIMITATION (round-27 completeness find, documented not fixed): this only checks non-zero,
        // not a practical minimum. The single-sided position below spans essentially the entire usable
        // tick range (~1,091,400 ticks at this tier's 200-tick spacing) — for an extremely small totalSupply
        // relative to that range, the liquidity NPM.mint computes for the deposit can round down to 0,
        // and the underlying UniswapV3Pool.mint call reverts on a zero-liquidity mint with an opaque,
        // low-level error instead of a clear guard message. Not a fund-loss or cross-user exploit (only
        // reverts the caller's own atomic launch), and the owner can already prevent it via enforcedSupply
        // — not fixed with an explicit require here since the exact liquidity-rounds-to-zero threshold
        // depends on the live pool's tick math, not a fixed constant this file could cheaply assert.
        // KNOWN LIMITATION (round-34 completeness find, documented not fixed): the opposite, large-supply
        // end is equally unbounded — totalSupply can approach type(uint256).max (fully caller-controlled
        // unless enforcedSupply is set), and the full totalSupply flows unmodified into the NPM single-
        // sided-position mint's amount0Desired/amount1Desired. A value near that extreme can overflow the
        // fixed-point liquidity math inside NPM/the pool before any library-level check trips, reverting
        // with an opaque low-level error instead of a clear guard message — the same self-DoS-only UX
        // problem as the small-supply case above, just at the other boundary. Not fixed here for the same
        // reason: an explicit upper bound risks being wrong for some legitimate large-but-valid supply/
        // decimals combination, and this is self-DoS only (no cross-user fund risk).
        require(fee == 10000, "1% pool only"); // lunch coins launch on the 1% tier (fee split assumes it)
        // When a launch supply is locked, enforce it so the initial market cap is consistent
        // (the tick pins price; a fixed supply pins MC = price × supply).
        if (enforcedSupply != 0) require(totalSupply == enforcedSupply, "supply locked");
        require(msg.value >= launchFeeWei, "fee");
        require(midBandTicks > 0 && band1DepthWei > 0, "bands unset");
        int24 spacing = _tickSpacing(fee);

        // (Duplicate names/symbols are allowed — no anti-vamp registry.)

        // 1. Deploy the immutable token; all supply minted to this launcher (CREATE2, salted).
        //    Default salt mixes a per-launcher nonce + the previous blockhash. Note this does NOT
        //    hide the resulting address from anyone who can SEE this transaction before it lands —
        //    all its inputs (msg.sender, name/symbol/totalSupply, the nonce, the prior blockhash) are
        //    either plaintext calldata or public chain state the instant it's available. What actually
        //    prevents an attacker from pre-initializing the (token, X_TOKEN) pool at a bad price in an
        //    EARLIER block is this chain's private-mempool/single-sequencer design, not any secrecy of
        //    the salt itself — same property (see launchWithSalt's doc comment) the userSalt path
        //    relies on. The livePrice==sqrtLaunch check below stays as the funds-safe backstop either
        //    way. (LunchTokenPlain itself has no anti-snipe transfer gate of any kind to exempt the
        //    launcher/creator from — see LunchTokenPlain.sol; that gate existed only on the retired
        //    LunchV3Token this factory no longer deploys.)
        bytes32 salt = useUserSalt
            ? keccak256(abi.encode(msg.sender, userSalt))
            : keccak256(abi.encode(msg.sender, name, symbol, totalSupply, _launchNonce++, blockhash(block.number - 1)));
        if (useUserSalt) {
            // The non-salted branch's nonce always increments, so a collision there is structurally
            // impossible — but a salted retry (same msg.sender/userSalt/name/symbol/totalSupply
            // resubmitted, e.g. a bundler's automatic retry after a timeout, or a UserOp replay before
            // the original confirms) hits CREATE2 at the EVM level with NO revert string at all, unlike
            // every other guard in this function. Give bundler/retry tooling a clean, actionable reason
            // to pattern-match on instead of a bare, unrecognizable low-level revert.
            // KNOWN LIMITATION: this "already used" guarantee is only as durable as the current
            // implementation's LunchTokenPlain bytecode (see _create2Address/predictTokenAddress's own
            // upgrade-drift caveat). A tuple that already successfully launched pre-upgrade is NOT
            // permanently "spent" across a UUPS upgrade that changes LunchTokenPlain's creationCode —
            // this same check would pass again post-upgrade (predicted.code.length reads 0 again, since
            // the address itself changed) and silently deploy a SECOND, unrelated token at a new address
            // for the identical (msg.sender, userSalt, name, symbol, totalSupply) tuple, with no revert
            // and no on-chain signal. Any off-chain system treating a used tuple as a permanent dedup/
            // idempotency key should account for this rather than assume it holds forever.
            address predicted = _create2Address(name, symbol, totalSupply, msg.sender, salt);
            require(predicted.code.length == 0, "salt used");
        }
        token = LunchV3TokenDeployer.deployPlain(name, symbol, totalSupply, address(this), msg.sender, salt);

        // 2. Ordering + SINGLE full-range band. The ENTIRE supply sits as ONE single-sided position
        //    on the far side of the launch tick, so the pool deposits only project token (0 X_TOKEN).
        //    No curve/tail split, no graduation: depth grows smoothly across the whole range instead
        //    of 93% of supply being trapped in a 10x band and starving everything above it.
        //    (This is the Noxa/CELERIS shape the header comment describes.)
        bool projectIsToken0 = token < xToken;
        address token0 = projectIsToken0 ? token : xToken;
        address token1 = projectIsToken0 ? xToken : token;

        int24 maxUsable = (TickMath08.MAX_TICK / spacing) * spacing;
        int24 minUsable = (TickMath08.MIN_TICK / spacing) * spacing;
        int24 alignedMag = (launchTickMagnitude / spacing) * spacing;
        require(alignedMag > 0 && alignedMag < maxUsable, "bad tick mag");

        Bands memory b;
        if (projectIsToken0) {
            // buyers push tick UP as they buy: one band = [launch, max]
            b.launchTick = -alignedMag;
            b.b1Lower = b.launchTick; b.b1Upper = maxUsable;
        } else {
            // buyers push tick DOWN as they buy: one band = [min, launch]
            b.launchTick = alignedMag;
            b.b1Lower = minUsable;    b.b1Upper = b.launchTick;
        }
        b.midTick = b.launchTick; // no curve/tail boundary any more (kept for event/ABI shape)

        // 3. No split — the whole supply goes into the single band.
        uint160 sqrtLaunch = TickMath08.getSqrtRatioAtTick(b.launchTick);
        b.band1 = totalSupply;
        b.band2 = 0;

        // 4. Create + initialize the pool at the launch price; reject a pre-initialized skewed pool.
        address pool = npm.createAndInitializePoolIfNecessary(token0, token1, fee, sqrtLaunch);
        (uint160 livePrice, , , , , , ) = IV3Pool(pool).slot0();
        require(livePrice == sqrtLaunch, "pool pre-initialized");

        // 5. Mint the ONE single-sided position; NFT goes straight to the fee locker; register it.
        IERC20(token).forceApprove(address(npm), totalSupply);
        uint256 tokenId2 = 0; // no tail position
        tokenId = _mintSingle(token0, token1, fee, projectIsToken0, b);
        // Gas-capped (round-19 completeness fix, same threat model as the referralSplitter call below,
        // just NOT wrapped in try/catch — unlike naming a referrer, registering the position is
        // load-bearing: silently swallowing a failure here would leave the just-minted LP NFT sitting at
        // feeLocker UNREGISTERED, permanently blocking the creator's own future setCreatorSplit calls for
        // this token with no on-chain signal anything's wrong — worse than a clean revert). feeLocker is
        // owner-mutable via setFeeLocker (routine migration to a new locker implementation is the
        // documented, expected use), so a future/buggy/compromised implementation whose register() burns
        // gas instead of reverting cleanly could otherwise consume ~63/64 of remaining gas (EIP-150)
        // before finally running out, wasting far more of the caller's gas than necessary on a failed
        // launch. Capping bounds that waste while still reverting the whole _launch cleanly on any real
        // failure, exactly as before — this only limits worst-case gas consumed by a griefing locker, it
        // does not change success-path behavior at all (register()'s real cost is a few storage writes +
        // one external ownerOf check, comfortably under this stipend). Round-25 fix: the stipend itself is
        // now owner-overridable (feeLockerRegisterGas, 0 = DEFAULT_FEE_LOCKER_REGISTER_GAS) — see that
        // variable's own doc for why a hardcoded compile-time-only value was a bricking risk against
        // setFeeLocker's own documented migration path to a heavier locker implementation.
        feeLocker.register{gas: feeLockerRegisterGas == 0 ? DEFAULT_FEE_LOCKER_REGISTER_GAS : feeLockerRegisterGas}(tokenId, msg.sender);
        // Name the referrer on-chain, atomically, from the caller's ?ref= link. try/catch so a bad
        // referrer or an unset/misconfigured splitter can never block a launch. The launcher must be the
        // splitter's registrar for this to take (splitter.setRegistrar(launcher)).
        // Gas-capped (round-15 completeness fix, mirrors LunchV4Launcher's REFERRER_NAME_GAS): referralSplitter
        // is an owner-configured-but-not-fully-trusted external contract, and try/catch alone doesn't protect
        // against a callee that just burns gas instead of cleanly reverting (EIP-150 forwards ~63/64 of
        // remaining gas by default) — without a cap, a buggy/malicious splitter could consume nearly all
        // remaining gas here, out-of-gassing the rest of _launch (dust sweep, tokenInfo write, event
        // emission) and bricking EVERY launch through this launcher until the owner repoints the splitter.
        // Round-22 doc fix: `referrer == msg.sender` (self-referral) is a SECOND implicit no-op case, silent
        // and indistinguishable on-chain from `referrer == address(0)` — no revert, no event, the try/catch
        // is simply skipped either way. None of launchRef/launchWithMetaRef/launchWithSaltRef/
        // launchWithMetaSaltRef's NatSpec mentions this; an integrator defaulting `referrer` to the
        // creator's own address when no upstream referral exists (a plausible convention, e.g. from a
        // self-populating `?ref=` link) gets every referral silently dropped with no way to detect it.
        if (referrer != address(0) && referrer != msg.sender && referralSplitter != address(0)) {
            try IReferralSplitterSetter(referralSplitter).setReferrer{gas: REFERRER_NAME_GAS}(token, referrer) {} catch {}
        }

        // (Plain token: no anti-snipe to arm — the initLimits step is gone entirely.)

        // 6. Optional initial buy for the creator — spends the attached ETH, no token cap.
        //    (initialBuyMaxTokens is kept in the signature only as the "do a dev buy" flag.)
        _maybeInitialBuy(pool, projectIsToken0, initialBuyMaxTokens, msg.sender);

        // 7. Sweep any project-token dust; registry.
        uint256 dust = IERC20(token).balanceOf(address(this));
        if (dust > 0) IERC20(token).safeTransfer(msg.sender, dust);

        tokenInfo[token] = TokenInfo({
            token: token,
            creator: msg.sender,
            pool: pool,
            tokenId: tokenId,
            fee: fee,
            createdAt: block.timestamp,
            tokenId2: tokenId2
        });
        allTokens.push(token);

        emit V3TokenLaunched(token, tokenId, msg.sender, pool, fee);
        emit V3BandsLaunched(token, tokenId, tokenId2, b.launchTick, b.midTick, b.band1, b.band2);
        if (useUserSalt) emit V3SaltedLaunch(token, userSalt);
    }

    /// @dev Mint the ONE full-range single-sided position holding the entire supply, to the fee locker.
    function _mintSingle(
        address token0,
        address token1,
        uint24 fee,
        bool projectIsToken0,
        Bands memory b
    ) internal returns (uint256 id1) {
        (id1, , , ) = npm.mint(
            INPM.MintParams({
                token0: token0,
                token1: token1,
                fee: fee,
                tickLower: b.b1Lower,
                tickUpper: b.b1Upper,
                amount0Desired: projectIsToken0 ? b.band1 : 0,
                amount1Desired: projectIsToken0 ? 0 : b.band1,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(feeLocker),
                deadline: block.timestamp
            })
        );
    }

    // -----------------------------------------------------------------------
    // Initial buy via direct pool.swap (no external SwapRouter dependency)
    // -----------------------------------------------------------------------

    /// @dev Optional dev buy: spend (msg.value - launchFeeWei) on the coin for the creator, or refund
    ///      it when no buy was requested. Split out of _launch() (round-23 doc fix: not the public launch()
    ///      wrapper, which has no stack pressure of its own) to relieve stack pressure.
    /// Round-29 correction: an earlier round claimed a cross-file interaction where this uncapped dev buy
    /// could walk the price out from under aa-bundle-launch.mjs's zero-slippage atomic-bundle buyer ops.
    /// Checked against that script's actual calldata and found NOT reachable via that tool specifically:
    /// aa-bundle-launch.mjs always hardcodes `initialBuyMaxTokens = 0n` in its V3 launch args, and
    /// `_maybeInitialBuy` immediately above no-ops the dev buy entirely at that value (refunds instead of
    /// swapping). The uncapped-swap behavior described is real for THIS function/for any OTHER caller that
    /// does pass a nonzero initialBuyMaxTokens — just not for that specific companion script's own bundles.
    /// KNOWN LIMITATION (round-31 completeness find, documented not fixed): the salted-launch family this
    /// function backs is documented throughout as general-purpose infrastructure for "an atomic bundler"
    /// to predict an address and compose additional operations around it — not scoped to that one script.
    /// ANY OTHER integrator that both uses predictTokenAddress to pre-plan a downstream same-bundle
    /// operation AND passes a nonzero initialBuyMaxTokens will have this dev buy consume liquidity and
    /// move price inside _launch itself, before their own downstream operation executes — silently
    /// invalidating any zero-slippage assumption based on the launch-tick price alone. Not fixed here
    /// (capping the dev buy would be a behavior change to a mechanism intentionally uncapped-by-design
    /// across many prior rounds) — flagged for any integrator building against these entrypoints.
    function _maybeInitialBuy(address pool, bool projectIsToken0, uint256 initialBuyMaxTokens, address creator) internal {
        uint256 buyEth = msg.value - launchFeeWei;
        if (buyEth == 0) return;
        if (initialBuyMaxTokens > 0) _initialBuy(pool, projectIsToken0, buyEth, creator);
        else _refundEth(creator, buyEth);
    }

    function _initialBuy(
        address pool,
        bool projectIsToken0,
        uint256 buyEth,
        address creator
    ) internal {
        // Snapshot any pre-existing X_TOKEN (e.g. a stray/donated WETH balance) so we only ever refund
        // the unused part of THIS buy — never someone else's donation (owner sweeps those via rescueToken).
        uint256 wethBefore = IWrappedNative(xToken).balanceOf(address(this));
        // Wrap ETH -> X_TOKEN to fund the swap input.
        IWrappedNative(xToken).deposit{value: buyEth}();

        // Buying the project token with X_TOKEN.
        //  - project == token0: zeroForOne = false (X=token1 in, project=token0 out).
        //  - project == token1: zeroForOne = true  (X=token0 in, project=token1 out).
        bool zeroForOne = !projectIsToken0;
        uint160 limit = zeroForOne ? TickMath08.MIN_SQRT_RATIO + 1 : TickMath08.MAX_SQRT_RATIO - 1;

        _activePool = pool;
        // Exact INPUT: positive amountSpecified == the exact X_TOKEN (dev-buy ETH) to spend. The pool
        // sends the project tokens to the creator and the callback pays exactly this input. No token
        // cap — the dev buys whatever their attached ETH buys at the launch price.
        IV3Pool(pool).swap(creator, zeroForOne, int256(buyEth), limit, abi.encode(pool));
        _activePool = address(0);

        // Refund the unused X_TOKEN of THIS buy (never any pre-existing/donated WETH), as ETH.
        uint256 bal = IWrappedNative(xToken).balanceOf(address(this));
        uint256 leftover = bal > wethBefore ? bal - wethBefore : 0;
        if (leftover > 0) {
            IWrappedNative(xToken).withdraw(leftover);
            _refundEth(creator, leftover);
        }
    }

    /// @dev Uniswap V3 swap callback: pay the pool the X_TOKEN input owed (the positive delta).
    function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata /* data */
    ) external {
        require(msg.sender == _activePool && _activePool != address(0), "unauth cb");
        // Exactly one delta is positive (the amount owed to the pool) — that is the X_TOKEN input.
        if (amount0Delta > 0) IERC20(xToken).safeTransfer(msg.sender, uint256(amount0Delta));
        if (amount1Delta > 0) IERC20(xToken).safeTransfer(msg.sender, uint256(amount1Delta));
    }

    // -----------------------------------------------------------------------
    // Admin
    // -----------------------------------------------------------------------
    // Round-25 doc fix: two more onlyOwner setters exist OUTSIDE this section — setReferralSplitter
    // (declared near the end of the file, appended alongside the referralSplitter storage variable for
    // UUPS layout reasons — function placement doesn't affect storage layout, only the variable's does, so
    // this was a locality choice, not a requirement) and setFeeLockerRegisterGas (appended right after it,
    // same reasoning). Both are functionally admin setters despite living outside this banner.

    function setLaunchTickMagnitude(int24 magnitude) external onlyOwner {
        require(magnitude > 0, "mag<=0");
        launchTickMagnitude = magnitude;
        emit LaunchTickMagnitudeSet(magnitude);
    }

    /// @notice VESTIGIAL: _launch no longer computes any band split from this value (see the
    ///         contract-level doc comment above — single full-range band only). Only effect today is keeping
    ///         midBandTicks non-zero so _launch's "bands unset" gate passes. Owner only.
    function setMidBandTicks(int24 ticks) external onlyOwner {
        require(ticks > 0, "ticks<=0");
        midBandTicks = ticks;
        emit MidBandTicksSet(ticks);
    }

    /// @notice VESTIGIAL: _launch no longer computes any band split from this value (see the
    ///         contract-level doc comment above — single full-range band only). Only effect today is keeping
    ///         band1DepthWei non-zero so _launch's "bands unset" gate passes. Owner only.
    function setBand1Depth(uint256 depthWei) external onlyOwner {
        require(depthWei > 0, "depth=0");
        band1DepthWei = depthWei;
        emit Band1DepthSet(depthWei);
    }

    /// @notice Lock the launch supply (0 = unlocked). When set, every launch must use exactly this
    ///         totalSupply, which — together with launchTickMagnitude — fixes the initial market cap.
    function setEnforcedSupply(uint256 supply) external onlyOwner {
        enforcedSupply = supply;
        emit EnforcedSupplySet(supply);
    }

    /// @notice Set the base every token's tokenURI() is built from. Include the trailing slash
    ///         ("https://www.lunch.fun/t/"). Read live, so it retroactively fixes every coin that has a
    ///         tokenURI() — those launched from this upgrade onward. Coins launched before it have no
    ///         tokenURI() in their bytecode and are only reachable via LunchV3FeeLocker.tokenURI().
    ///         Set it to "" to make tokens report no metadata.
    function setBaseTokenURI(string calldata base) external onlyOwner {
        baseTokenURI = base;
        emit BaseTokenURISet(base);
    }

    function setLaunchFee(uint256 amountWei) external onlyOwner {
        launchFeeWei = amountWei;
        emit LaunchFeeSet(amountWei);
    }

    /// @notice Repoint the fee locker that NEW launches register their LP position in. Used to migrate to
    ///         the attribution-aware LunchV3FeeLockerRef (referrals) without touching the old frozen locker
    ///         or any already-launched coin. The new locker must recognize this launcher (setLauncher).
    event FeeLockerSet(address indexed feeLocker);
    function setFeeLocker(address feeLocker_) external onlyOwner {
        require(feeLocker_ != address(0), "locker=0");
        feeLocker = LunchV3FeeLocker(payable(feeLocker_));
        emit FeeLockerSet(feeLocker_);
    }

    function withdrawFees() external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "no fees");
        _refundEth(owner(), bal);
    }

    /// @notice Sweep a stray ERC20 accidentally sent to the launcher (e.g. donated WETH) to the owner.
    ///         Launches are atomic + nonReentrant, so between them the launcher custodies no user
    ///         funds — this can only ever move genuinely stray tokens, never live-launch balances.
    function rescueToken(address token_) external onlyOwner {
        uint256 bal = IERC20(token_).balanceOf(address(this));
        require(bal > 0, "nothing");
        IERC20(token_).safeTransfer(owner(), bal);
    }

    function allTokensLength() external view returns (uint256) {
        return allTokens.length;
    }

    // -----------------------------------------------------------------------
    // Internals
    // -----------------------------------------------------------------------

    function _tickSpacing(uint24 fee) internal pure returns (int24) {
        if (fee == 500) return 10;
        if (fee == 3000) return 60;
        if (fee == 10000) return 200;
        revert("bad fee");
    }

    // Round-15 completeness finding, verified real, deliberately left as a hard require (not made
    // optional/best-effort): if `to` (== msg.sender of the launch — a real risk for the smart-contract/AA
    // callers this upgrade's salted family is explicitly built for, since not every SimpleAccount/AA
    // implementation accepts a plain ETH transfer) rejects this refund, the WHOLE launch reverts instead
    // of the leftover dust silently staying in this contract. That's the correct tradeoff, not a bug to
    // relax. Round-19 correction: this contract DOES have a rescue path for stray ETH — withdrawFees()
    // sweeps this contract's ENTIRE balance to the owner (not just accumulated launchFeeWei) — so the
    // real argument here isn't "no way back to anyone" (that claim was inaccurate); it's FAIRNESS to the
    // original sender: silently swallowing a failed refund would hand that ETH to the OWNER instead of
    // back to the rejected caller, an implicit appropriation neither party asked for. A clean atomic
    // revert (the caller keeps their own funds, just re-attempts differently) is still the right default
    // even though the ETH isn't technically unrecoverable. Callers whose smart account can't receive
    // plain ETH must ensure their init-code/execution path can (or route the launch through an
    // intermediary that can), same as any other contract-to-contract ETH transfer in this ecosystem.
    function _refundEth(address to, uint256 amount) internal {
        (bool ok, ) = payable(to).call{value: amount}("");
        require(ok, "eth refund");
    }

    // -----------------------------------------------------------------------
    // UUPS
    // -----------------------------------------------------------------------

    error UpgradesFrozen();
    /// FROZEN: upgradeability permanently revoked. All other owner powers retained.
    function _authorizeUpgrade(address) internal pure override { revert UpgradesFrozen(); }

    receive() external payable {}

    // ── VESTIGIAL two-band ("curve → infinity") launch shape (appended for UUPS storage safety) ──────
    // HISTORICAL — describes the ORIGINAL design, not current behavior. _launch today places the ENTIRE
    // supply as ONE single-sided full-range position (see the contract-level @notice and _launch's own
    // comments). These two vars are retained ONLY as a non-zero "bands unset" gate for ABI/storage-layout
    // back-compat — see setMidBandTicks/setBand1Depth's own NatSpec, which are already marked VESTIGIAL.
    // What this design ORIGINALLY was (kept for history, not as a description of live behavior): every
    // launch placed supply as TWO single-sided token positions (0 X_TOKEN seeded) — Band 1 ("curve"):
    // launchTick → midTick, sized so `band1DepthWei` of X_TOKEN bought through it; Band 2 ("tail"):
    // midTick → max/min usable tick, the rest of supply, thinning to infinity. midBandTicks was the
    // band-1 tick width (ticks = ln(multiple)/ln(1.0001); ~23026 ≈ 10x).
    int24 public midBandTicks;
    uint256 public band1DepthWei;

    // CREATE2 salt entropy (appended). NOTE: these two slots formerly held the never-enforced
    // anti-vamp usedName/usedSymbol mappings; they're kept in place (repurposed) so the UUPS storage
    // layout is byte-for-byte unchanged across the upgrade. One is now the launch nonce.
    uint256 private _launchNonce;

    // Base for LunchTokenPlain.tokenURI(), e.g. "https://www.lunch.fun/t/" (keep the trailing slash; www is canonical, the apex redirects).
    // Tokens read it from here instead of hardcoding a domain they could never change, so a rebrand
    // or a lapsed domain is one owner call rather than permanently-dead metadata on every coin.
    // Takes over the second dead anti-vamp slot noted above (a string is 1 slot, same as the uint256
    // it replaces, and slot 13 reads as 0 on the live proxy — round-30 doc fix: previously miscited as
    // slot 12, which is actually _launchNonce's slot per this contract's own declaration order) — so the
    // UUPS layout is unchanged.
    string public baseTokenURI;

    /// @notice Referral splitter (APPENDED — takes the first __gap slot, so the UUPS layout stays
    ///         append-only). When set + the launcher is the splitter's registrar, each launch names the
    ///         coin's referrer on-chain in the launch tx. 0 = referrals off.
    address public referralSplitter;
    // Gas stipend for the referralSplitter.setReferrer call in _launch — see that call site's comment.
    uint256 internal constant REFERRER_NAME_GAS = 100_000;
    // Default gas stipend for the feeLocker.register call in _launch — see that call site's comment. Named
    // (round-23 doc fix) for consistency with REFERRER_NAME_GAS above, which the register call site's own
    // comment says shares the identical griefing threat model; the two differ (150k vs 100k) because
    // register()'s real cost (storage writes + an external ownerOf check) is higher than setReferrer()'s.
    uint256 internal constant DEFAULT_FEE_LOCKER_REGISTER_GAS = 150_000;
    event ReferralSplitterSet(address indexed splitter);
    function setReferralSplitter(address s) external onlyOwner {
        referralSplitter = s;
        emit ReferralSplitterSet(s);
    }

    /// @notice Owner-settable override for the feeLocker.register gas stipend (round-25 completeness fix).
    /// APPENDED (takes another __gap slot, same pattern as referralSplitter above) so the UUPS layout stays
    /// append-only. 0 = use DEFAULT_FEE_LOCKER_REGISTER_GAS — the natural, upgrade-safe default for an
    /// already-live proxy whose storage reads 0 here until the owner explicitly sets it, exactly like
    /// referralSplitter's own "0 = off" convention. Was previously a hardcoded, compile-time-only constant:
    /// setFeeLocker is explicitly documented as the intended path to migrate to a DIFFERENT feeLocker
    /// implementation (e.g. an attribution-aware one) with a plausibly heavier register() cost — without
    /// this override, a legitimately-more-expensive future locker would revert this call (uncaught, no
    /// try/catch, by design — see that call site) and brick EVERY launch through this launcher until a
    /// whole new UUPS upgrade shipped, just to raise one number.
    uint256 public feeLockerRegisterGas;
    event FeeLockerRegisterGasSet(uint256 gas_);
    error FeeLockerRegisterGasTooLow();
    /// Round-29 fix (MEDIUM completeness find): this setter had no minimum-value guard — the whole point
    /// of making the stipend owner-settable was to let it be RAISED for a heavier future locker, but with
    /// no floor a mistaken low value (a typo, e.g. meaning 300_000 and setting 300) would brick EVERY
    /// launch through this launcher just as surely as the original hardcoded-too-low-constant risk this
    /// mechanism exists to prevent — the register() call is deliberately not try/catch-wrapped, so any
    /// value here that's insufficient reverts the whole launch, uncaught. Mirrors this ecosystem's own
    /// established pattern for gas-stipend config (aa-bundle-launch.mjs's buyCallGas/paymasterPostOpGasLimit
    /// floors): 0 still means "use the compile-time default", but a nonzero override must clear a floor
    /// that's comfortably below any plausible real register() cost, so it only ever catches a clear mistake.
    function setFeeLockerRegisterGas(uint256 gas_) external onlyOwner {
        if (gas_ != 0 && gas_ < 30_000) revert FeeLockerRegisterGasTooLow();
        feeLockerRegisterGas = gas_;
        emit FeeLockerRegisterGasSet(gas_);
    }

    /// @dev Storage gap for future upgrades (reduced by the vars appended above).
    uint256[44] private __gap;
}
