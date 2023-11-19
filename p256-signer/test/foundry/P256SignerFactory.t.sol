pragma solidity ^0.8.0;

import {P256Signer} from "../../contracts/P256Signer.sol";
import {P256SignerFactory} from "../../contracts/P256SignerFactory.sol";
import {LibClone} from "solady/src/utils/LibClone.sol";

import "forge-std/Test.sol";

contract TestP256SignerFactory is Test {
    address signerImplementation;
    P256SignerFactory factory;

    /// @notice Emitted when a new P256Signer proxy contract is created
    event NewSignerCreated(uint256 indexed x, uint256 indexed y, address signer);

    function setUp() public {
    }

    function testDeploy() public {
    }

    function testFuzzCreate(uint256 x, uint256 y) public {

    }
}
