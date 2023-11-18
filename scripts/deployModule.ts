import {ethers} from "hardhat";

import {deployments} from "hardhat";
const deployModule = async (hre) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy('Module', {
        from: deployer,
        args: [],
        log: true,
    });
}

deployModule.tags = ['Module'];

async function main() {

    const contractABI = [

        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_ownerTokenAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_receiverTokenAddress",
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
    const bytecode = "0x608060405234801561001057600080fd5b50600436106100675760003560e01c80638da5cb5b116100505780638da5cb5b146100a557806391294dfc146100b85780639ee924c3146100cb57600080fd5b806325ba77241461006c5780636537188314610076575b600080fd5b6100746100de565b005b600154610089906001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f35b600054610089906001600160a01b031681565b6100746100c6366004610289565b610195565b600254610089906001600160a01b031681565b6000546001600160a01b031633146101475760405162461bcd60e51b815260206004820152602160248201527f4f6e6c79206f776e65722063616e2063616c6c20746869732066756e6374696f6044820152603760f91b60648201526084015b60405180910390fd5b6002546001546040516001600160a01b03918216919092161415808252907f68d9ca04b4316430e181931a9db630f52ce85192b0927864b9b9d1a8550a2c249060200160405180910390a150565b6000546001600160a01b031633146101f95760405162461bcd60e51b815260206004820152602160248201527f4f6e6c79206f776e65722063616e2063616c6c20746869732066756e6374696f6044820152603760f91b606482015260840161013e565b6001600160a01b03811661024f5760405162461bcd60e51b815260206004820152601e60248201527f496e76616c696420726563656976657220746f6b656e20616464726573730000604482015260640161013e565b600280547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0392909216919091179055565b60006020828403121561029b57600080fd5b81356001600160a01b03811681146102b257600080fd5b939250505056fea164736f6c6343000814000a";

    const providerUrl = 'https://polygon-mumbai.infura.io/v3/' + process.env.INFURA_API_KEY;
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const safeWalletAddress = await wallet.getAddress();


    const tokenSwapContractFactory = new ethers.ContractFactory(contractABI, bytecode, wallet);

    const tokenSwapContract = await tokenSwapContractFactory.deploy(safeWalletAddress);

    console.log('TokenSwap contract deployed to:', tokenSwapContract.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
