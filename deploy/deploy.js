import { ethers } from 'ethers';

// Import the compiled ABI and bytecode of your contracts
import GnosisSafeArtifact from './artifacts/GnosisSafe.json';
import ModuleManagerArtifact from './artifacts/ModuleManager.json';
import EnumArtifact from './artifacts/Enum.json';
import CustomModuleArtifact from './artifacts/CustomModule.json';

// Ethereum RPC endpoint
const rpcEndpoint = 'https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY';

// Replace YOUR_INFURA_API_KEY with your Infura API key or your Ethereum node URL

async function deployContracts() {
  // Connect to Ethereum using ethers.js
  const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);
  const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider); // Replace YOUR_PRIVATE_KEY with your private key

  // Deploy Enum contract
  const EnumFactory = new ethers.ContractFactory(EnumArtifact.abi, EnumArtifact.bytecode, wallet);
  const enumContract = await EnumFactory.deploy();
  await enumContract.deployed();

  // Deploy ModuleManager contract
  const ModuleManagerFactory = new ethers.ContractFactory(
      ModuleManagerArtifact.abi,
      ModuleManagerArtifact.bytecode,
      wallet
  );
  const moduleManagerContract = await ModuleManagerFactory.deploy();
  await moduleManagerContract.deployed();

  // Deploy CustomModule contract
  const CustomModuleFactory = new ethers.ContractFactory(
      CustomModuleArtifact.abi,
      CustomModuleArtifact.bytecode,
      wallet
  );
  const customModuleContract = await CustomModuleFactory.deploy();
  await customModuleContract.deployed();

  // Deploy GnosisSafe contract with the deployed ModuleManager contract address
  const GnosisSafeFactory = new ethers.ContractFactory(
      GnosisSafeArtifact.abi,
      GnosisSafeArtifact.bytecode,
      wallet
  );
  const gnosisSafeContract = await GnosisSafeFactory.deploy(moduleManagerContract.address);
  await gnosisSafeContract.deployed();

  console.log('Contracts deployed:');
  console.log('Enum:', enumContract.address);
  console.log('ModuleManager:', moduleManagerContract.address);
  console.log('CustomModule:', customModuleContract.address);
  console.log('GnosisSafe:', gnosisSafeContract.address);
}

// Example interaction with GnosisSafe and ERC-4337 token
async function interactWithContracts() {
  // Connect to Ethereum using ethers.js
  const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);
  const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider); // Replace YOUR_PRIVATE_KEY with your private key

  // Replace the following with the actual addresses of your deployed contracts
  const gnosisSafeAddress = '0xYourGnosisSafeAddress';
  const customModuleAddress = '0xYourCustomModuleAddress';

  // Connect to the deployed contracts
  const gnosisSafeContract = new ethers.Contract(gnosisSafeAddress, GnosisSafeArtifact.abi, wallet);
  const customModuleContract = new ethers.Contract(customModuleAddress, CustomModuleArtifact.abi, wallet);

  // Example: Execute a transaction using the CustomModule
  const to = '0xRecipientAddress';
  const value = ethers.utils.parseEther('1'); // 1 ETH
  const data = '0x'; // Replace with the actual transaction data
  const operation = 0; // 0: Call, 1: DelegateCall, 2: Create

  // Execute the transaction from the GnosisSafe using the CustomModule
  const transaction = await gnosisSafeContract.execTransactionFromModule(to, value, data, operation);

  console.log('Transaction executed:', transaction.hash);
}

// Uncomment the following line to deploy contracts
// deployContracts();

// Uncomment the following line to interact with contracts
// interactWithContracts();
