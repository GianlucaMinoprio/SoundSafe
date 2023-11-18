import Web3 from 'web3';
import { PrivateKeyProviderConnector, FusionSDK } from "@1inch/fusion-sdk";

async function main() {
    const makerPrivateKey = process.env.PRIVATE_KEY; // Remplacez par votre clé privée
    const makerAddress = "0xb8a4Daa0aBF612547D63e7090B4d7ba516Cce262"; // Remplacez par votre adresse de test
    const nodeUrl = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`; // Remplacez par votre URL de nœud

    const blockchainProvider = new PrivateKeyProviderConnector(
        makerPrivateKey,
        new Web3(nodeUrl)
    );

    const sdk = new FusionSDK({
        url: 'https://api.1inch.dev/fusion',
        network: 1,
        blockchainProvider,
        authKey: 'your-auth-key' // Remplacez par votre clé d'authentification
    });

    async function placeSwapOrder(amount: string, fromAddress: string, toAddress: string) {
        try {
            const response = await sdk.placeOrder({
                fromTokenAddress: fromAddress,
                toTokenAddress: toAddress,
                amount: amount,
                walletAddress: makerAddress
            });
            return response;
        } catch (error) {
            console.error('Error placing swap order:', error);
            throw error;
        }
    }

    // Test de la fonction placeSwapOrder
    const amountToSwap = '50000000000000000'; // 0.05 ETH
    const fromAddress = '0xd878DD862649b949d5a70Ff255cbf3FFDD037bfB'; // Remplacez par l'adresse du token source
    const toAddress = ''; // Remplacez par l'adresse du token cible

    try {
        const response = await placeSwapOrder(amountToSwap, fromAddress, toAddress);
        console.log('Swap Order Response:', response);
    } catch (error) {
        console.error('Swap Order Failed:', error);
    }
}

main().then(() => process.exit(0)).catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
});
