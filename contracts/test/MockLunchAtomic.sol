// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ILunchV3Launcher, ILunchV3Router} from "../LunchAtomicExecutor.sol";

contract MockLunchToken is ERC20 {
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {}
    function mint(address to, uint256 amount) external { _mint(to, amount); }
}

contract MockLunchLauncher is ILunchV3Launcher {
    uint256 public constant override launchFeeWei = 0.01 ether;
    address public lastCreator;
    address public lastToken;

    function launchWithMetaSalt(
        string calldata name,
        string calldata symbol,
        uint256,
        uint24,
        uint256 initialBuyMaxTokens,
        Meta calldata,
        bytes32
    ) external payable returns (address token, uint256 tokenId) {
        require(msg.value >= launchFeeWei, "fee");
        MockLunchToken created = new MockLunchToken(name, symbol);
        token = address(created);
        tokenId = 1;
        lastCreator = msg.sender;
        lastToken = token;
        if (initialBuyMaxTokens != 0) created.mint(msg.sender, (msg.value - launchFeeWei) * 1_000);
    }
}

contract MockLunchRouter is ILunchV3Router {
    mapping(address => uint256) public spendByCaller;
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut) {
        require(msg.value == params.amountIn, "value");
        spendByCaller[msg.sender] += msg.value;
        amountOut = params.amountIn * 500;
        require(amountOut >= params.amountOutMinimum, "minimum");
        MockLunchToken(params.tokenOut).mint(params.recipient, amountOut);
    }
}
