import axios from 'axios';
import { ethers } from 'ethers';

const providerUrl = 'https://polygon-mumbai.infura.io/v3/' + process.env.INFURA_API_KEY; // Replace with your Infura project ID or provider URL
const privateKey = process.env.PRIVATE_KEY; // Replace with your private key

const provider = new ethers.JsonRpcProvider(providerUrl);
const wallet =  new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractAddress = 'your-smart-module-address'; // Replace with your smart module contract address
const abi = ['event SwapTokenRequest(address sender, address tokenToSwap, address desiredToken, uint256 amountToSwap)'];

const smartModule = new ethers.Contract(contractAddress, abi, wallet);

// Listen for the SwapTokenRequest event
smartModule.on('SwapTokenRequest', async (sender, tokenToSwap, desiredToken, amountToSwap) => {
    try {
        console.log(`Received a request to swap ${amountToSwap} ${tokenToSwap} to ${desiredToken}`);

        // Fetch the exchange rate from 1inch API
        const apiUrl = `https://api.1inch.exchange/v3.0/1/quote?fromTokenAddress=${tokenToSwap}&toTokenAddress=${desiredToken}&amount=${amountToSwap}`;
        const response = await axios.get(apiUrl);
        const { toTokenAmount } = response.data;

        // Perform the token swap
        const oneInchAddress = '0x11111112542D85B3EF69AE05771c2dCCff4fAa26'; // 1inch contract address
        const oneInchContract = new ethers.Contract(oneInchAddress, ['function swap(address, address, uint256, uint256, uint256, uint256, address, bytes) external'], wallet);

        const minReturn = toTokenAmount;
        const flags = 0;
        const permit = '0x';
        const referral = 'your-1inch-referral-code'; // Replace with your 1inch referral code or leave it empty

        const tx = await oneInchContract.(
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
