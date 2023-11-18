import axios from 'axios';
import { ethers } from 'ethers';

const providerUrl = 'https://polygon-mumbai.infura.io/v3/' + process.env.INFURA_API_KEY; // Replace with your Infura project ID or provider URL
const privateKey = process.env.PRIVATE_KEY // Replace with your private key

const provider = new ethers.JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = process.env.SAFE_WALLET_ADDRESS; // Replace with your smart module contract address
const abi = ['event SwapToken(address sender, address tokenToSwap, address desiredToken, uint256 amountToSwap)'];

const smartModule = new ethers.Contract(contractAddress, abi, wallet);

// Listen for the SwapTokenRequest event
smartModule.on('SwapTokenRequest', async (sender, tokenToSwap, desiredToken, amountToSwap) => {
    try {
        console.log(`SwapTokenRequest event received. Sender: ${sender}, tokenToSwap: ${tokenToSwap}, desiredToken: ${desiredToken}, amountToSwap: ${amountToSwap}`);

        // Fetch the exchange rate from 1inch API
        const apiUrl = `https://api.1inch.exchange/v3.0/56/quote?fromTokenAddress=${tokenToSwap}&toTokenAddress=${desiredToken}&amount=${amountToSwap}`;
        const response = await axios.get(apiUrl);
        const { toTokenAmount } = response.data;

        // Perform the token swap
        const oneInchAddress = '0x11111112542D85B3EF69AE05771c2dCCff4fAa26'; // 1inch contract address
        const oneInchContract = new ethers.Contract(oneInchAddress, ['function swap(address, address, uint256, uint256, uint256, uint256, address, bytes) external'], wallet);

        const minReturn = toTokenAmount;
        const flags = 0;
        const permit = '0x';
        const referral = '';

        const tx = await oneInchContract[0](
            tokenToSwap,
            desiredToken,
            amountToSwap,
            minReturn,
            0,
            flags,
            referral,
            permit
        );

        await tx.wait();
        console.log(`Token swap completed. Transaction hash: ${tx.hash}`);
    } catch (error) {
        console.error('Error:', error);
    }
});
