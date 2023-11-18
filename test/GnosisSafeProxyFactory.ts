import {ethers, getAddress} from 'ethers';
import dotenv from 'dotenv';

import GnosisSafeProxyFactory  from '../artifacts/contracts/GnosisSafeProxyFactory.sol/GnosisSafeProxyFactory.json';
import {GnosisSafeProxyFactory__factory} from "../typechain-types"; // Replace with the actual path to your contract artifacts

async function deployContract() {
    // Connect to Ethereum using ethers.js
    const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_ENDPOINT'); // Replace with your Ethereum RPC endpoint
    const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider); // Replace with your private key

    // Deploy GnosisSafeProxyFactory contract
    const factoryContract = new ethers.ContractFactory(
        GnosisSafeProxyFactory.abi,
        GnosisSafeProxyFactory.bytecode,
        wallet
    );

    const factory = await factoryContract.deploy();

    console.log('GnosisSafeProxyFactory deployed at:', getAddress("GnosisSafeProxyFactory__factory"));
}

// Uncomment the following line to deploy the contract
deployContract();
