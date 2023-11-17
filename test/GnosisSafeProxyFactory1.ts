import { ethers } from 'ethers';
import { GnosisSafeProxyFactoryFactory } from './typechain/GnosisSafeProxyFactoryFactory'; // Update with the path to your typechain generated artifacts
import { INFURA_API_KEY } from './.env'; // Import your Infura API key

async function main() {
    const infuraApiKey = INFURA_API_KEY;
    const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${infuraApiKey}`);

    // Replace with your wallet's private key or use a mnemonic for a wallet
    const privateKey = 'your_private_key_here';
    const wallet = new ethers.Wallet(privateKey, provider);

    // Deploy the GnosisSafeProxyFactory contract
    const factory = new GnosisSafeProxyFactoryFactory(wallet);
    const contract = await factory.deploy();

    await contract.deployed();
    console.log(`GnosisSafeProxyFactory deployed at: ${contract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
