// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {
    IUniswapV2Router02,
    IUniswapV2Factory,
    IUniswapV2Pair
} from "./interfaces/IUniswapV2.sol";

/// @title Tradeable governance token with configurable buy/sell tax.
/// @notice 1B fixed initial supply. 2% goes to the ecosystem wallet,
/// while 98% is held by this contract to seed liquidity.
/// @dev The tax wallet may permanently burn tokens held in its own wallet.
contract HRD is ERC20, ERC20Permit, Ownable {
    using SafeERC20 for IERC20;

    uint256 public constant MAX_SUPPLY = 1_000_000_000 ether;

    /// @notice Maximum buy or sell tax: 4%.
    uint256 public constant MAX_TAX_BPS = 400;

    /// @notice Swapback cannot exceed 10% of the token reserve in the pool.
    uint256 public constant MAX_SWAP_POOL_BPS = 1_000;

    /// @notice Early-buyer restriction window in seconds.
    uint256 public constant EW = 180;

    IUniswapV2Router02 public immutable router;
    address public immutable weth;

    address public pair;
    address public immutable ecosystemWallet;

    address public taxWallet;

    uint256 public buyTaxBps = 100;
    uint256 public sellTaxBps = 100;

    bool public tradingEnabled;
    bool public swapEnabled;

    uint256 public swapThreshold = MAX_SUPPLY / 10_000;
    uint256 public maxSwap = MAX_SUPPLY / 100;
    uint256 public swapPoolBps = 50;

    bool private inSwap;

    mapping(address => bool) public taxExempt;
    mapping(address => bool) public isAMMPair;
    mapping(address => bool) public earlyBuyerAllowed;

    uint256 public tradingOpenAt;

    error NotOpen();
    error OnlyTaxWallet();
    error ZeroBurnAmount();
    error InsufficientBurnBalance();

    event Launched(
        uint256 tokenAmount,
        uint256 ethAmount,
        address lpRecipient
    );

    event EarlyBuyerSet(
        address indexed account,
        bool allowed
    );

    event TaxSet(
        uint256 buyTaxBps,
        uint256 sellTaxBps
    );

    event TaxWalletSet(
        address indexed taxWallet
    );

    event TaxExemptSet(
        address indexed account,
        bool exempt
    );

    event AMMPairSet(
        address indexed pair,
        bool isPair
    );

    event SwapEnabledSet(
        bool enabled
    );

    event SwapSettingsSet(
        uint256 swapThreshold,
        uint256 maxSwap,
        uint256 swapPoolBps
    );

    event TokensBurned(
        address indexed taxWallet,
        uint256 amount
    );

    modifier lockSwap() {
        inSwap = true;
        _;
        inSwap = false;
    }

    modifier onlyTaxWallet() {
        if (msg.sender != taxWallet) {
            revert OnlyTaxWallet();
        }
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        address _router,
        address _taxWallet,
        address _ecosystemWallet,
        address[] memory _earlyBuyers
    )
        ERC20(name_, symbol_)
        ERC20Permit(name_)
    {
        require(
            _router != address(0) &&
                _taxWallet != address(0) &&
                _ecosystemWallet != address(0),
            "zero addr"
        );

        router = IUniswapV2Router02(_router);
        weth = router.WETH();

        taxWallet = _taxWallet;
        ecosystemWallet = _ecosystemWallet;

        taxExempt[owner()] = true;
        taxExempt[address(this)] = true;
        taxExempt[_taxWallet] = true;
        taxExempt[_ecosystemWallet] = true;

        for (uint256 i; i < _earlyBuyers.length; i++) {
            require(
                _earlyBuyers[i] != address(0),
                "zero early buyer"
            );

            earlyBuyerAllowed[_earlyBuyers[i]] = true;

            emit EarlyBuyerSet(
                _earlyBuyers[i],
                true
            );
        }

        uint256 ecosystemAllocation =
            (MAX_SUPPLY * 2) / 100;

        uint256 liquidityAllocation =
            MAX_SUPPLY -
            ecosystemAllocation;

        _mint(
            _ecosystemWallet,
            ecosystemAllocation
        );

        _mint(
            address(this),
            liquidityAllocation
        );
    }

    /// @notice Creates or retrieves the WETH pair and adds all tokens
    /// held by this contract as initial liquidity.
    /// @param lpRecipient Address that receives the LP tokens.
    function launch(
        address lpRecipient
    ) external payable onlyOwner {
        require(
            !tradingEnabled,
            "already launched"
        );

        require(
            msg.value > 0,
            "no ETH"
        );

        require(
            lpRecipient != address(0),
            "zero recipient"
        );

        IUniswapV2Factory factory =
            IUniswapV2Factory(
                router.factory()
            );

        address p =
            factory.getPair(
                address(this),
                weth
            );

        if (p == address(0)) {
            p = factory.createPair(
                address(this),
                weth
            );
        }

        require(
            balanceOf(p) == 0 &&
                IERC20(weth).balanceOf(p) == 0,
            "pair not empty"
        );

        pair = p;
        isAMMPair[p] = true;

        uint256 tokenAmount =
            balanceOf(address(this));

        require(
            tokenAmount > 0,
            "no tokens"
        );

        _approve(
            address(this),
            address(router),
            tokenAmount
        );

        router.addLiquidityETH{
            value: msg.value
        }(
            address(this),
            tokenAmount,
            0,
            0,
            lpRecipient,
            block.timestamp
        );

        tradingEnabled = true;
        swapEnabled = true;
        tradingOpenAt = block.timestamp;

        emit AMMPairSet(
            p,
            true
        );

        emit SwapEnabledSet(
            true
        );

        emit Launched(
            tokenAmount,
            msg.value,
            lpRecipient
        );
    }

    /// @notice Permanently burns tokens held by the tax wallet.
    /// @dev Only the current taxWallet can call this function.
    /// The function cannot burn tokens belonging to any other address.
    /// @param amount Token amount to burn, including 18 decimals.
    function burn(
        uint256 amount
    ) external onlyTaxWallet {
        if (amount == 0) {
            revert ZeroBurnAmount();
        }

        if (balanceOf(msg.sender) < amount) {
            revert InsufficientBurnBalance();
        }

        _burn(
            msg.sender,
            amount
        );

        emit TokensBurned(
            msg.sender,
            amount
        );
    }

    function setBuyTax(
        uint256 bps
    ) external onlyOwner {
        require(
            bps <= MAX_TAX_BPS,
            "max 4%"
        );

        buyTaxBps = bps;

        emit TaxSet(
            bps,
            sellTaxBps
        );
    }

    function setSellTax(
        uint256 bps
    ) external onlyOwner {
        require(
            bps <= MAX_TAX_BPS,
            "max 4%"
        );

        sellTaxBps = bps;

        emit TaxSet(
            buyTaxBps,
            bps
        );
    }

    function setTaxWallet(
        address w
    ) external onlyOwner {
        require(
            w != address(0),
            "zero addr"
        );

        address oldTaxWallet =
            taxWallet;

        if (
            oldTaxWallet != owner() &&
            oldTaxWallet != address(this) &&
            oldTaxWallet != ecosystemWallet
        ) {
            taxExempt[oldTaxWallet] = false;

            emit TaxExemptSet(
                oldTaxWallet,
                false
            );
        }

        taxWallet = w;
        taxExempt[w] = true;

        emit TaxExemptSet(
            w,
            true
        );

        emit TaxWalletSet(
            w
        );
    }

    function setTaxExempt(
        address account,
        bool exempt
    ) external onlyOwner {
        require(
            account != address(0),
            "zero addr"
        );

        taxExempt[account] = exempt;

        emit TaxExemptSet(
            account,
            exempt
        );
    }

    function setAMMPair(
        address p,
        bool isPair
    ) external onlyOwner {
        require(
            p != address(0),
            "zero addr"
        );

        isAMMPair[p] = isPair;

        emit AMMPairSet(
            p,
            isPair
        );
    }

    function setEarlyBuyer(
        address account,
        bool allowed
    ) external onlyOwner {
        require(
            !tradingEnabled,
            "already launched"
        );

        require(
            account != address(0),
            "zero addr"
        );

        earlyBuyerAllowed[account] =
            allowed;

        emit EarlyBuyerSet(
            account,
            allowed
        );
    }

    function setSwapEnabled(
        bool enabled
    ) external onlyOwner {
        swapEnabled = enabled;

        emit SwapEnabledSet(
            enabled
        );
    }

    function setSwapSettings(
        uint256 _swapThreshold,
        uint256 _maxSwap,
        uint256 _swapPoolBps
    ) external onlyOwner {
        require(
            _maxSwap > 0,
            "zero maxSwap"
        );

        require(
            _swapThreshold <= _maxSwap,
            "threshold > maxSwap"
        );

        require(
            _swapPoolBps > 0 &&
                _swapPoolBps <=
                MAX_SWAP_POOL_BPS,
            "bad poolBps"
        );

        swapThreshold =
            _swapThreshold;

        maxSwap =
            _maxSwap;

        swapPoolBps =
            _swapPoolBps;

        emit SwapSettingsSet(
            _swapThreshold,
            _maxSwap,
            _swapPoolBps
        );
    }

    function rescueETH()
        external
        onlyOwner
    {
        uint256 balance =
            address(this).balance;

        require(
            balance > 0,
            "no ETH"
        );

        (bool ok, ) = payable(owner()).call{
            value: balance
        }("");

        require(
            ok,
            "eth send failed"
        );
    }

    function rescueToken(
        address token,
        uint256 amount
    ) external onlyOwner {
        require(
            token != address(0),
            "zero token"
        );

        require(
            token != address(this),
            "no self"
        );

        IERC20(token).safeTransfer(
            owner(),
            amount
        );
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal {
        if (from == address(0)) {
            _mint(to, amount);
        } else if (to == address(0)) {
            _burn(from, amount);
        } else {
            _transfer(from, to, amount);
        }
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (
            from == address(0) ||
            to == address(0) ||
            inSwap ||
            taxExempt[from] ||
            taxExempt[to]
        ) {
            super._transfer(
                from,
                to,
                amount
            );

            return;
        }

        require(
            tradingEnabled,
            "trading not enabled"
        );

        bool isBuy =
            isAMMPair[from];

        bool isSell =
            isAMMPair[to];

        if (
            isBuy &&
            block.timestamp <
                tradingOpenAt + EW &&
            !earlyBuyerAllowed[to]
        ) {
            revert NotOpen();
        }

        if (
            isSell &&
            swapEnabled &&
            balanceOf(address(this)) >=
                swapThreshold
        ) {
            _swapBack();
        }

        uint256 tax;

        if (isBuy) {
            tax =
                (amount * buyTaxBps) /
                10_000;
        } else if (isSell) {
            tax =
                (amount * sellTaxBps) /
                10_000;
        }

        if (tax > 0) {
            super._transfer(
                from,
                address(this),
                tax
            );

            amount -= tax;
        }

        super._transfer(
            from,
            to,
            amount
        );
    }

    function _swapBack()
        private
        lockSwap
    {
        uint256 amount =
            balanceOf(address(this));

        if (amount > maxSwap) {
            amount = maxSwap;
        }

        uint256 poolCap =
            _poolSwapCap();

        if (amount > poolCap) {
            amount = poolCap;
        }

        if (amount == 0) {
            return;
        }

        address[] memory path =
            new address[](2);

        path[0] =
            address(this);

        path[1] =
            weth;

        _approve(
            address(this),
            address(router),
            amount
        );

        try
            router
                .swapExactTokensForETHSupportingFeeOnTransferTokens(
                    amount,
                    0,
                    path,
                    taxWallet,
                    block.timestamp
                )
        {
            // Swap succeeded.
        } catch {
            // Swap failure is intentionally ignored so sells are not blocked.
        }
    }

    function _poolSwapCap()
        private
        view
        returns (uint256)
    {
        address p = pair;

        if (p == address(0)) {
            return 0;
        }

        (
            uint112 reserve0,
            uint112 reserve1,

        ) = IUniswapV2Pair(p)
            .getReserves();

        uint256 tokenReserve;

        if (
            IUniswapV2Pair(p).token0() ==
            address(this)
        ) {
            tokenReserve =
                uint256(reserve0);
        } else {
            tokenReserve =
                uint256(reserve1);
        }

        return
            (
                tokenReserve *
                    swapPoolBps
            ) / 10_000;
    }

    function _transferOwnership(
        address newOwner
    ) internal override {
        super._transferOwnership(
            newOwner
        );

        if (newOwner != address(0)) {
            taxExempt[newOwner] = true;

            emit TaxExemptSet(
                newOwner,
                true
            );
        }
    }

    receive() external payable {}
}
