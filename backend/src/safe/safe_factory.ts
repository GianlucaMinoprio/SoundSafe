import {ContractTransactionResponse, ethers} from "ethers";
import gnosisSafeProxyFactoryAbi from './abi/GnosisSafeProxyFactory'

let gnosisSafeProxyFactory: ethers.Contract | undefined = undefined;

export function initGnosisSafeProxyFactory(address: string, wallet: ethers.Wallet) {
    gnosisSafeProxyFactory = new ethers.Contract(
        address,
        gnosisSafeProxyFactoryAbi,
        wallet
    );
}

export async function createSigner(hardware_public_key: string): Promise<ContractTransactionResponse> {
    // Extract x and y coordinates from the public key
    const xHex: string = hardware_public_key.substring(2, 66); // Next 64 characters after '04' for x
    const yHex: string = hardware_public_key.substring(66); // Remaining characters for y

    // Convert to BigNumber
    const x: BigInt = BigInt("0x" + xHex);
    const y: BigInt = BigInt("0x" + yHex);

    if (!gnosisSafeProxyFactory)
        throw new Error("p256SignerFactory wasn't correctly initialized.");

    // Call the create function
    try {
        console.log("sDeploying P256 Signer contract...");

        const tx = await gnosisSafeProxyFactory.create(x, y);
        console.log("Transaction hash:", tx.hash);

        // Wait for the transaction to be mined
        await tx.wait();
        console.log("Transaction confirmed");

        console.log(`With public key: ${hardware_public_key}\n`);
        return tx;
    } catch (error) {
        console.error("Error creating the signer:", error);
        throw error;
    }
}

// Function to listen to the NewSignerCreated event
export function listenForNewSigner(factoryAddress: string, provider: ethers.JsonRpcProvider) {
    const p256SignerFactory: ethers.Contract = new ethers.Contract(
        factoryAddress,
        gnosisSafeProxyFactoryAbi,
        provider
    );

    p256SignerFactory.on("NewSignerCreated", (x, y, signerAddress) => {
        console.log(
            `New signer created with x: ${x}, y: ${y}, at address: ${signerAddress}`
        );
    });
}