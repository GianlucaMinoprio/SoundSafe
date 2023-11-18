import {ethers,Wallet} from "ethers";
import Safe,{EthersAdapter,SafeAccountConfig,SafeFactory} from "@safe-global/protocol-kit";
import {SafeTransaction,TransactionResult} from "@safe-global/safe-core-sdk-types";
import {deploySafeModule} from "./safe_module_factory";

let safeFactory: SafeFactory | undefined;
export async function createSafeFactory(wallet: Wallet) {
    console.log('Initializing Safe Factory...');

    console.log('Creating the EthersAdapter...');
    const ethAdapter: EthersAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: wallet
    })

    console.log('Deploying the SafeFactory...');
    safeFactory = await SafeFactory.create({ ethAdapter })

    console.log('Successfully deployed the SafeFactory.\n');
}

export async function createSafe(wallet: Wallet, hardware_pub: string)
    :Promise<{
        safe: string,
        module: string
    }> {
    console.log('Creating a new Safe...');
    if (!safeFactory)
        throw new Error('Safe factory is not initialized.');

    const owners: Wallet[] = [wallet];
    const safeAccountConfig: SafeAccountConfig = {
        owners: owners.map((w: Wallet) => w.address),
        threshold: 1,
    }

    console.log('Deploying the Safe with the SafeFactory...');
    const saltNonce: "42" = '42';
    const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig, saltNonce })
    const safe: string = await safeSdk.getAddress();
    console.log(`Safe deployed. Address: ${safe}`);

    console.log('Adding the safe module...');
    const module: string = await addSafeModule(hardware_pub)
    console.log(`Module successfully deployed. Address: ${module}`);

    console.log('Adding the module to the Safe...');
    const safeTransaction: SafeTransaction = await safeSdk.createEnableModuleTx(module);
    const txResponse: TransactionResult = await safeSdk.executeTransaction(safeTransaction)
    console.log(`Transaction sent. Hash: ${txResponse.hash}`);
    await txResponse.transactionResponse?.wait()

    console.log(`Module successfully deployed:
    SAFE  : ${safe}
    MODULE: ${module}
    `);

    // Returns address of the module and of Safe
    return {
        safe,
        module
    };
}

export async function addSafeModule(hardware_pub: string): Promise<string> {
    return await deploySafeModule(hardware_pub);
}