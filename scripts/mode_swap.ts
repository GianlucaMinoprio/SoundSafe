import Web3 from 'web3';
import { PrivateKeyProviderConnector, FusionSDK } from "@1inch/fusion-sdk";

const makerPrivateKey = process.env.PRIVATE_KEY; // Remplacez par votre clé privée
const makerAddress = "0x1A0cc861E781753D5bbC0FC11542c44b324b5927"; // Remplacez par votre adresse

const nodeUrl = 'https://mainnet.infura.io/v3/' + process.env.INFURA_API_KEY; // Remplacez par votre URL de nœud

// Configuration du provider
const blockchainProvider = new PrivateKeyProviderConnector(
    makerPrivateKey,
    new Web3(nodeUrl)
);

// Initialisation du SDK Fusion
const sdk = new FusionSDK({
    url: 'https://api.1inch.dev/fusion',
    network: 1,
    blockchainProvider,
    authKey: 'your-auth-key' // Remplacez par votre clé d'authentification si nécessaire
});
/**
 * Place un ordre de swap sur 1inch Fusion.
 * @param {string} amount Montant à échanger, en wei.
 */
function placeSwapOrder(amount,fromAddress,toAddress) {
    sdk.placeOrder({
        fromTokenAddress: fromAddress, //Adress d'origine
        toTokenAddress: toAddress, // Adresse cible
        amount: amount, // Utilisation du paramètre amount
        walletAddress: makerAddress // Votre adresse de Safe Wallet
    }).then(response => {
        console.log(response); // Gérer la réponse
    }).catch(error => {
        console.error(error); // Gérer les erreurs
    });
}

// Exemple d'utilisation de la fonction
const amountToSwap = '50000000000000000'; // 0.05 ETH, par exemple
placeSwapOrder(amountToSwap, '0x000000' /* ETH */, '0x000000' /* DAI */);
