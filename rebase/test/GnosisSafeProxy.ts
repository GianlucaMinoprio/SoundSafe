import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { GnosisSafeProxy } from '../artifacts/contracts/GnosisSafeProxy.sol/GnosisSafeProxy.json';

// Load environment variables from .env file
dotenv.config();

async function deployContract() {
    // Connect to Ethereum using ethers.js
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_ENDPOINT); // Use the environment variable
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // Use the environment variable

    // Deploy GnosisSafeProxy contract
    const factoryContract = new ethers.ContractFactory(
        GnosisSafeProxy.abi,
        GnosisSafeProxy.bytecode,
        wallet
    );

    const factory = await factoryContract.deploy();

    console.log('GnosisSafeProxy deployed at:', factory.address);
}

// Uncomment the following line to deploy the contract
// deployContract();
