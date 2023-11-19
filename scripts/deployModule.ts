import {ethers} from "hardhat";
import {DeployFunction} from "hardhat-deploy/types";

import {deployments} from "hardhat";
import axios from "axios";
const deployFonction: DeployFunction = async ({deployments}) => {
    const { deploy } = deployments;
    const { deployer } = await ethers.getSigners();

    await deploy('Module', {
        from: deployer,
        args: [],
        log: true,
    });
}

async function main() {

    const contractABI = [

        {

            "inputs": [
                {
                    "internalType": "address",
                    "name": "_ownerTokenAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "swapNeeded",
                    "type": "bool"
                }
            ],
            "name": "SwapRequired",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_newReceiverTokenAddress",
                    "type": "address"
                }
            ],
            "name": "changeReceiverToken",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "checkSwapRequired",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "ownerToken",
            "outputs": [
                {
                    "internalType": "contract IERC20",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "receiverToken",
            "outputs": [
                {
                    "internalType": "contract IERC20",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    console.log("ABI",contractABI);
    const bytecode = "0x608060405234801561001057600080fd5b5060405161037138038061037183398101604081905261002f9161006c565b600080546001600160a01b03199081163317909155600180546001600160a01b03938416908316179055600280549182169190921617905561009c565b60006020828403121561007e57600080fd5b81516001600160a01b038116811461009557600080fd5b9392505050565b6102c6806100ab6000396000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c80638da5cb5b116100505780638da5cb5b146100a557806391294dfc146100b85780639ee924c3146100cb57600080fd5b806325ba77241461006c5780636537188314610076575b600080fd5b6100746100de565b005b600154610089906001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f35b600054610089906001600160a01b031681565b6100746100c6366004610289565b610195565b600254610089906001600160a01b031681565b6000546001600160a01b031633146101475760405162461bcd60e51b815260206004820152602160248201527f4f6e6c79206f776e65722063616e2063616c6c20746869732066756e6374696f6044820152603760f91b60648201526084015b60405180910390fd5b6002546001546040516001600160a01b03918216919092161415808252907f68d9ca04b4316430e181931a9db630f52ce85192b0927864b9b9d1a8550a2c249060200160405180910390a150565b6000546001600160a01b031633146101f95760405162461bcd60e51b815260206004820152602160248201527f4f6e6c79206f776e65722063616e2063616c6c20746869732066756e6374696f6044820152603760f91b606482015260840161013e565b6001600160a01b03811661024f5760405162461bcd60e51b815260206004820152601e60248201527f496e76616c696420726563656976657220746f6b656e20616464726573730000604482015260640161013e565b600280547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0392909216919091179055565b60006020828403121561029b57600080fd5b81356001600160a01b03811681146102b257600080fd5b939250505056fea164736f6c6343000814000a";

    const providerUrl = 'https://polygon-mumbai.infura.io/v3/' + process.env.INFURA_API_KEY;
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY.toLowerCase(), provider);

    const safeWalletAddress = await wallet.getAddress();

    const tokenSwapContractFactory = new ethers.ContractFactory(contractABI, bytecode, wallet);

    const tokenSwapContract = await tokenSwapContractFactory.deploy(safeWalletAddress);


    console.log('TokenSwap contract deployed to:', tokenSwapContract.address);

    const safeModuleAbi = ['event SwapRequested(address indexed sender, address tokenToSwap, address desiredToken, uint256 amountToSwap)'];
    const safeModule = new ethers.Contract(wallet.address, safeModuleAbi, wallet);


    safeModule.on('SwapRequested', async (sender, tokenToSwap, desiredToken, amountToSwap) => {
        try {
            console.log(`SwapRequested event received. Sender: ${sender}, tokenToSwap: ${tokenToSwap}, desiredToken: ${desiredToken}, amountToSwap: ${amountToSwap}`);

            const apiUrl = `https://api.1inch.exchange/v3.0/56/quote?fromTokenAddress=${tokenToSwap}&toTokenAddress=${desiredToken}&amount=${amountToSwap}`;
            const response = await axios.get(apiUrl);
            const { toTokenAmount } = response.data;

            const oneInchAddress = '0x11111112542D85B3EF69AE05771c2dCCff4fAa26'; // 1inch contract address
            const oneInchContract = new ethers.Contract(oneInchAddress, ['function swap(address, address, uint256, uint256, uint256, uint256, address, bytes) external'], wallet);

            const minReturn = toTokenAmount;
            const flags = 0;
            const permit = '0x'; // You can customize this if needed
            const referral = ''; // You can customize this if needed

            const tx = await oneInchContract.swap(
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

        } catch (error) {
            console.error('Error:', error);
        }
    });

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
