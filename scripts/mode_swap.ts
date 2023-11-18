import Web3 from 'web3';
import {PrivateKeyProviderConnector, FusionSDK, NetworkEnum} from "@1inch/fusion-sdk";
import {ethers} from "ethers";


const makerPrivateKey = process.env.PRIVATE_KEY; // Remplacez par votre clé privée

const nodeUrl = 'https://polygon-mumbai.infura.io/v3/' + process.env.INFURA_API_KEY; // Remplacez par votre URL de nœud

// Configuration du provider
const blockchainProvider = new PrivateKeyProviderConnector(
    makerPrivateKey,
    new Web3(nodeUrl)
)

// Initialisation du SDK Fusion
const sdk = new FusionSDK({
    url: 'https://api.1inch.dev/fusion',
    network: 1,
    blockchainProvider,
    authKey: process.env.INCH_API_KEY // Remplacez par votre clé d'authentification si nécessaire
});

/**t
 * Place un ordre de swap sur 1inch Fusion.
 * @param {string} amount Montant à échanger, en wei.
 */
function PlaceSwapOrder(amount : number,fromAddress : string,toAddress : string) {

    sdk.placeOrder({
        fromTokenAddress: fromAddress, //Adress d'origine
        toTokenAddress: toAddress, // Adresse cible
        amount: amount, // Utilisation du paramètre amount
        walletAddress: fromAddress,// Votre adresse de Safe Wallet
        fee: {
            takingFeeBps: 100, // 1% as we use bps format, 1% is equal to 100bps
    })
}

// Exemple d'utilisation de la fonction
const amountToSwap = '50000000000000000'; // 0.05 ETH, par exemple
PlaceSwapOrder(amountToSwap, '0x000000' /* ETH */, '0x000000' /* DAI */);
