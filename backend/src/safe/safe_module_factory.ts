import {ethers} from "ethers";
import safeModuleFactoryAbi from './abi/SafeModuleFactory'

let safeModuleFactory: ethers.Contract | undefined = undefined;

export function initSafeModuleFactory(address: string,wallet: ethers.Wallet) {
  safeModuleFactory = new ethers.Contract(
      address,
      safeModuleFactoryAbi,
      wallet
  );
}

export async function deploySafeModule(hardware_public_key: string): Promise<string> {
  // Extract x and y coordinates from the public key
  const xHex: string = hardware_public_key.substring(2, 66); // Next 64 characters after '04' for x
  const yHex: string = hardware_public_key.substring(66); // Remaining characters for y

  // Convert to BigNumber
  const x: BigInt = BigInt("0x" + xHex);
  const y: BigInt = BigInt("0x" + yHex);

  if (!safeModuleFactory)
    throw new Error("SafeModuleFactory wasn't correctly initialized.");

  // Call the create function
  try {
    console.log("Deploying Safe Module Verifier contract...");

    const tx = await safeModuleFactory.create(x, y);
    console.log("Transaction hash:", tx.hash);

    // Wait for the transaction to be mined
    await tx.wait();
    console.log("Transaction confirmed");

    console.log(`With public key: ${hardware_public_key}\n`);
    return tx.data;
  } catch (error) {
    console.error("Error creating the signer:", error);
    throw error;
  }
}

// Function to listen to the NewSignerCreated event
export function listenForNewSafeModules(factoryAddress: string,provider: ethers.providers.JsonRpcProvider) {
  const p256SignerFactory: ethers.Contract = new ethers.Contract(
      factoryAddress,
      safeModuleFactoryAbi,
      provider
  );

  p256SignerFactory.on("NewSignerCreated", (x, y, signerAddress) => {
    console.log(
        `New signer created with x: ${x}, y: ${y}, at address: ${signerAddress}`
    );
  });
}