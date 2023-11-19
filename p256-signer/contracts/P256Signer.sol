// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ISafe} from "./interfaces/Safe.sol";
import {secp256r1} from "./FCL/secp256r1.sol";

/// @title P256Signer
/// @notice A contract used to verify ECDSA signatures over secp256r1.sol through
///         EIP-1271 of Webauthn payloads.
/// @dev This contract is the implementation. It is meant to be used through
///      proxy clone.
contract P256Signer {
    /// @notice Whether the contract has been initialized
    bool public initialized;

    /// @notice The x coordinate of the secp256r1.sol public key
    uint256 public x;

    /// @notice The y coordinate of the secp256r1.sol public key
    uint256 public y;

    /// @notice Error message when the signature is invalid
    error InvalidSignature();

    /// @notice Error message when the hash is invalid
    error InvalidHash();

    /// @notice Error message when the contract is already initialized
    error AlreadyInitialized();

    constructor() {
        initialized = true;
    }

    function execute(address _to, uint256 _value, bytes32 _data, uint8 _operation, uint256[2] calldata rs) public {
        require(secp256r1.ecdsa_verify(_data, rs, [x, y]), "Verification failed.");

        bytes memory data = new bytes(32);
        assembly {
            mstore(add(data, 32), _data)
        }

        require(ISafe(msg.sender).execTransactionFromModule(_to, _value, data, _operation), "Execution failed");
    }

    /// @dev This function is only callable once and needs to be called immediately
    ///      after deployment by the factory in the same transaction.
    /// @param x_ The x coordinate of the public key
    /// @param y_ The y coordinate of the public key
    function initialize(uint256 x_, uint256 y_) external {
        if (initialized) revert AlreadyInitialized();
        initialized = true;
        x = x_;
        y = y_;
    }
}
