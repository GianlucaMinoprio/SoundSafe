import { ethers } from 'ethers';
import { GnosisSafeProxyFactory } from './typechain/GnosisSafeProxyFactory'; // Update with the path to your typechain generated artifacts
import { INFURA_API_KEY } from './.env'; // Import your Infura API key

async function main() {
    const infuraApiKey = INFURA_API_KEY;
    const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${infuraApiKey}`);

    // Replace with your wallet's private key or use a mnemonic for a wallet
    const privateKey = 'your_private_key_here';
    const wallet = new ethers.Wallet(privateKey, provider);

    // Deploy your contract
    const gnosisSafeProxyFactory = new GnosisSafeProxyFactory(wallet);

    // Replace with the constructor arguments if needed
    const singletonAddress = 'your_singleton_address_here';
    const initializerData = 'your_initializer_data_here';
    const saltNonce = 0; // Update with your desired salt nonce

    const transaction = await gnosisSafeProxyFactory.createProxyWithCallback(
        singletonAddress,
        initializerData,
        saltNonce,
        'your_callback_address_here' // Update with your callback address or use the address(0) if not needed
    );

    await transaction.wait();

    console.log(`Gnosis Safe Proxy deployed at: ${transaction.hash}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
