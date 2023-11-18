import { ContractTransactionResponse, ethers } from "ethers";
import gnosisSafeProxyAbi from "./abi/GnosisSafeProxy";
import { sign } from "crypto";
import dotenv from "dotenv";

dotenv.config();

let gnosisSafeProxy: ethers.Contract | undefined = undefined;

export function initgnosisSafeProxy(address: string, wallet: ethers.Wallet) {
  gnosisSafeProxy = new ethers.Contract(address, gnosisSafeProxyAbi, wallet);
}

export async function createSafeWallet(
  signerVerifierAddress: string
): Promise<ContractTransactionResponse> {
  const saltNonce = 42;
  if (!gnosisSafeProxy)
    throw new Error("p256SignerFactory wasn't correctly initialized.");

  // Call the create function
  try {
    console.log("Deploying Safe contract...");
    const initCode = "0x";
    const tx = await gnosisSafeProxy.createProxyWithNonce(
      signerVerifierAddress,
      initCode,
      saltNonce
    );
    console.log("Transaction hash:", tx.hash);

    // Wait for the transaction to be mined
    await tx.wait();
    console.log("Transaction confirmed");

    console.log(
      `Safe Account Created with Owner as: ${signerVerifierAddress}\n`
    );
    return tx;
  } catch (error) {
    console.error("Error creating the signer:", error);
    throw error;
  }
}

const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(
  process.env.JSON_RPC_PROVIDER
);
const SAFE_FACTORY_ADDRESS = process.env.SAFE_FACTORY_ADDRESS!;
const wallet: ethers.Wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY!,
  provider
);

initgnosisSafeProxy(SAFE_FACTORY_ADDRESS, wallet);
createSafeWallet("0xB95Cc50F5f178251eF7e6b690d58cd62Cd37136c");
