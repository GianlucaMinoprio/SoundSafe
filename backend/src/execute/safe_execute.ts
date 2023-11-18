import {ContractTransactionResponse,ethers,ZeroAddress} from "ethers";
import gnosisSafeL2Abi from "./abi/GnosisSafeL2";
import {OperationType,SafeTransactionDataPartial} from '@safe-global/safe-core-sdk-types';
import dotenv from "dotenv";

dotenv.config();

let gnosisSafeL2: ethers.Contract | undefined = undefined;

export function initSafeL2Contract(address: string, wallet: ethers.Wallet) {
  gnosisSafeL2 = new ethers.Contract(address, gnosisSafeL2Abi);
}

export async function executeTx(to: string, amount: number, verifier: string) {
    if (!gnosisSafeL2)
        throw Error('Contract not initialized.');

    verifier = verifier.substring(2, verifier.length - 2);

    if (verifier.length != 38)
        throw new Error(`Verifier address invalid '${verifier} (${verifier.length} bytes)'`);

    const signature: string = new Array(14).join("00") + verifier +
        new Array(33).join('00') + '00';

    const txData: SafeTransactionDataPartial = {
        to: to,
        data: "0x",
        value: ethers.parseUnits('0.005', 'ether').toString(),
        operation: OperationType.Call,
        baseGas: '0',
        gasPrice: '0',
        gasToken: ZeroAddress,
        refundReceiver: ZeroAddress,
    }

    const txHash =

    console.log('Initializing transaction:')
    console.log(txData);

    const tx: ContractTransactionResponse = await gnosisSafeL2.execTransaction(to, amount, OperationType.Call, '0', '0',
        ZeroAddress, ZeroAddress, signature);

    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log('Transaction confirmed.');

    console.log(tx);
    return tx;
}

/*
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

initGnosisSafeProxy(SAFE_FACTORY_ADDRESS, wallet);
createSafeWallet("0xB95Cc50F5f178251eF7e6b690d58cd62Cd37136c");
*/

