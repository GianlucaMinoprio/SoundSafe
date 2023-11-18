import { ethers } from 'ethers';
import dotenv from 'dotenv';
import GnosisSafeProxy from '../artifacts/contracts/GnosisSafeProxy.sol/GnosisSafeProxy.json';

// Load environment variables from .env file
dotenv.config();

async function deployContract() {
    // Connect to Ethereum using ethers.js
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_ENDPOINT); // Use the environment variable
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // Use the environment variable

    // Replace with the actual address of the GnosisSafeProxyFactory contract
    const factoryAddress = process.env.FACTORY_ADDRESS;

    // Deploy GnosisSafeProxy contract using the factory
    const factoryContract = new ethers.Contract(
        factoryAddress,
        GnosisSafeProxy.abi,
        wallet
    );

    // Specify the target contract (singleton) address for GnosisSafeProxy
    const targetContractAddress = 'YOUR_TARGET_CONTRACT_ADDRESS'; // Replace with the target contract address

    // Encode the constructor arguments for GnosisSafeProxy (target contract address)
    const initData = ethers.utils.defaultAbiCoder.encode(['address'], [targetContractAddress]);

    // Deploy the GnosisSafeProxy contract
    const deployTransaction = await factoryContract.deploymentTransaction(targetContractAddress, initData);

    // Wait for the deployment transaction to be mined
    const receipt = await deployTransaction.wait();

    console.log("factory:", factoryContract.address);

    if (receipt.status === 1) {
        // Transaction succeeded, get the deployed GnosisSafeProxy contract address
        const proxyAddress = receipt.logs[0].address;
        console.log('GnosisSafeProxy deployed at:', proxyAddress);
    } else {
        console.error('Failed to deploy GnosisSafeProxy.');
    }
}

// Uncomment the following line to deploy the contract
deployContract();