// SafeModule.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SafeModule {
    event SwapRequested(address indexed sender, address tokenToSwap, address desiredToken, uint256 amountToSwap);

    modifier onlyAuthorized() {
        require(isAuthorized(msg.sender), "Unauthorized");
        _;
    }

    // Mapping to store authorized addresses
    mapping(address => bool) private authorizedAddresses;

    // Function to add an authorized address
    function addAuthorizedAddress(address _address) external  {
        authorizedAddresses[_address] = true;
    }

    // Function to remove an authorized address
    function removeAuthorizedAddress(address _address) external  {
        authorizedAddresses[_address] = false;
    }

    // Function to check if an address is authorized
    function isAuthorized(address _address) public view returns (bool) {
        return authorizedAddresses[_address];
    }

    function requestSwap(address tokenToSwap, address desiredToken, uint256 amountToSwap) external onlyAuthorized {
        // Check if the desiredToken and tokenToSwap addresses are valid ERC20 tokens
        require(IERC20(desiredToken).totalSupply() > 0, "Invalid desiredToken");
        require(IERC20(tokenToSwap).totalSupply() > 0, "Invalid tokenToSwap");
        // Check if the sender has the required amount of tokenToSwap
        require(IERC20(tokenToSwap).balanceOf(msg.sender) >= amountToSwap, "Insufficient tokenToSwap balance");

        // Emit the SwapRequested event
        emit SwapRequested(msg.sender, tokenToSwap, desiredToken, amountToSwap);
    }
}
