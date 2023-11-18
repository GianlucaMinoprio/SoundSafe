import axios from 'axios';
import { ethers } from 'ethers';
import {EIP712TypedData, FusionSDK, NetworkEnum} from '@1inch/fusion-sdk'

// const providerUrl = 'https://polygon-mumbai.infura.io/v3/' + process.env.INFURA_API_KEY; // Replace with your Infura project ID or provider URL
const privateKey = process.env.PRIVATE_KEY // Replace with your private key

//const provider = new ethers.JsonRpcProvider(providerUrl);
//const wallet = new ethers.Wallet(privateKey, provider);
async function main()
{

}


interface HttpProviderConnector {
    get<T>(url: string): Promise<T>

    post<T>(url: string, data: unknown): Promise<T>
}

interface BlockchainProviderConnector {
    signTypedData(
        walletAddress: string,
        typedData: EIP712TypedData
    ): Promise<string>

    ethCall(contractAddress: string, callData: string): Promise<string>
}

type FusionSDKConfigParams = {
    url: string
    network: NetworkEnum
    blockchainProvider?: BlockchainProviderConnector
    httpProvider?: HttpProviderConnector // by default we are using axios
}
interface HttpProviderConnector {
    get<T>(url: string): Promise<T>

    post<T>(url: string, data: unknown): Promise<T>
}

interface BlockchainProviderConnector {
    signTypedData(
        walletAddress: string,
        typedData: EIP712TypedData
    ): Promise<string>

    ethCall(contractAddress: string, callData: string): Promise<string>
}

type FusionSDKConfigParams = {
    url: string
    network: NetworkEnum
    blockchainProvider?: BlockchainProviderConnector
    httpProvider?: HttpProviderConnector // by default we are using axios
}