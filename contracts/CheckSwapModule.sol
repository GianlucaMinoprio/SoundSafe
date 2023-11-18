// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CheckSwap {
    address public owner;
    IERC20 public ownerToken;
    IERC20 public receiverToken;

    event SwapRequired(bool swapNeeded);

    constructor(address _ownerTokenAddress) {
        owner = msg.sender;
        ownerToken = IERC20(_ownerTokenAddress);
        receiverToken = IERC20(address(receiverToken));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function checkSwapRequired() external onlyOwner {
        bool swapNeeded = ownerToken != receiverToken;

        emit SwapRequired(swapNeeded);
    }

    function changeReceiverToken(address _newReceiverTokenAddress) external onlyOwner {
        require(_newReceiverTokenAddress != address(0), "Invalid receiver token address");
        receiverToken = IERC20(_newReceiverTokenAddress);
    }

}
