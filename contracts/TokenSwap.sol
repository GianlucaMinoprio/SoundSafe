// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Import your SafeModule contract here if needed

contract TokenSwap {
    address public owner;
    IERC20 public token;
    uint256 public tokenAmount;

    event TokenSwapped(address _token, uint256 amount);

    constructor(address _token) {
        owner = msg.sender;
        token = IERC20(_token);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "This is not the owner");
        _;
    }

    function depositToken(uint256 amount) external onlyOwner {
        require(amount > 0, "give a right amount");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed bc of parameters");
        tokenAmount += amount;
    }

    function swapToken(uint256 amount) external {
        require(amount > 0, "give a right amount");
        require(tokenAmount >= amount, "Insufficient balance");
        tokenAmount -= amount;
        require(token.transfer(msg.sender, amount), "Transfer Failed");
        emit TokenSwapped(msg.sender, amount);
    }

    function withdrawToken(address to, uint256 amount) external onlyOwner {
        require(amount <= tokenAmount, "Not enough funds");
        tokenAmount -= amount;
        require(token.transfer(to, amount), "Transfer failed");
    }

    // You have commented out the 'destroy' function, but you can uncomment it if needed.
    // function destroy() external onlyOwner {
    //     selfdestruct(payable(owner));
    // }
}
