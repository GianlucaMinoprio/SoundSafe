const secp256r1 = require('secp256r1')
const { ethers } = require('ethers');
const {EthersAdapter, SafeFactory} = require("@safe-global/protocol-kit");
require('dotenv').config();

const EC = require('elliptic').ec;
const ec = new EC('p256'); // p256 is an alias for secp256r1

function generateSecp256r1KeyPair() {
    //const key = ec.genKeyPair();
    const key = ec.keyFromPrivate("b44fce4772ac2d8906dc051e4bd5305722e7466cec0c79c59baa1d1b52d1704f");
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');

    return { publicKey, privateKey };
}

const keyPair = generateSecp256r1KeyPair();
console.log('Public Key:', keyPair.publicKey);
console.log('Private Key:', keyPair.privateKey);


let hardware_public_key = keyPair.publicKey;
const safeModuleFactoryAbi = require('./safe/abi/SafeModuleFactoryAbi.json');
const {OperationType} = require("@safe-global/safe-core-sdk-types");

//console.log(`Connecting to provider: ${process.env.JSON_RPC_PROVIDER}...`);
const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
//console.log('Successfully initialized provider.\n');

//console.log('Creating the wallet...');
const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    provider
);
//console.log(`Successfully created wallet ('${wallet.address}').\n`);

async function main() {
    //console.log('Initializing Safe Factory...');

    //console.log('Creating the EthersAdapter...');
    const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: wallet
    })

    //console.log('Deploying the SafeFactory...');
    let safeFactory = await SafeFactory.create({ethAdapter})
    console.log('Successfully deployed the SafeFactory.\n');

    const owners = [wallet];
    const safeAccountConfig = {
        owners: owners.map((w) => w.address),
        threshold: 1,
    }

    //console.log('Deploying the Safe with the SafeFactory...');
    const saltNonce = ethers.Wallet.createRandom().address;
    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig, saltNonce })
    const safe = await safeSdk.getAddress();
    console.log(`Safe deployed. Address: ${safe}`);

    //console.log('Adding the safe module...');
    const xHex = hardware_public_key.substring(2, 66); // Next 64 characters after '04' for x
    const yHex = hardware_public_key.substring(66); // Remaining characters for y

    const safeModuleFactory = new ethers.Contract(
      process.env.SAFE_MODULE_FACTORY_ADDRESS,
      safeModuleFactoryAbi,
      wallet
    );

    safeModuleFactory.on("NewSignerCreated", async (x, y, safe, module) => {
        const safeTransaction = await safeSdk.createEnableModuleTx(module);
        const txResponse  = await safeSdk.executeTransaction(safeTransaction)
        //console.log(`Transaction sent. Hash: ${txResponse.hash}`);
        console.log(`MODULE ADDRESS: ${module}`)
        await txResponse.transactionResponse?.wait()

        await callVerifier(module);
        console.log('YESSIRRRR')
    });

    // Convert to BigNumber
    const x = BigInt("0x" + xHex);
    const y = BigInt("0x" + yHex);

    if (!safeModuleFactory)
        throw new Error("SafeModuleFactory wasn't correctly initialized.");

    // Call the create function
    try {
        //console.log("Deploying Safe Module Verifier contract...");

        const tx = await safeModuleFactory.create(x, y);
        //console.log("Transaction hash:", tx.hash);

        // Wait for the transaction to be mined
        await tx.wait();
        //console.log("Transaction confirmed");
        console.log(`With public key: ${hardware_public_key}\n`);
    } catch (error) {
        //console.error("Error creating the signer:", error);
        throw error;
    }
}


async function callVerifier(module) {
    console.log();
    const to = process.env.TO;
    const value = ethers.utils.parseUnits('0.0001', 'ether');
    const data = '0x';
    const operation = OperationType.Call;
    const hash = ethers.utils.keccak256(data);
    const signature2 = hexlify(signData(data));

    const safeModuleAbi = require('./safe/abi/SafeModuleAbi.json');
    const safeModule = new ethers.Contract(
        module,
        safeModuleAbi,
        wallet
    );

    console.log('CALLING THE CONTRACT');
    console.log({
        to,
        value,
        data,
        operation,
        hash,
        signature: signature2
    })

    const tx = await safeModule.execute(
        to,
        value,
        data,
        operation,
        hash,
        signature
    );
    console.log(`Transaction hash: ${tx.hash}`)

    await tx.wait();
    console.log('CBQZHDBVQZHDJGVQZHJ DHZJG DVJHAZGVDHAJGZVDJHAVGZ DHJGAZV DJHGAZVDJHGAZV DJHGAZVDHGAVDZHG AZHDVGZJHGD HAZVG DJHGAVZ DHJGVAZDJGV AZ')
}

const verifier = "0x21DE47E9c3C5A32c9A2B4F3de3377eEA68CcD4f4";
const message = '0x1234';
const signature = signMessage(message, keyPair.privateKey)

function signMessage(message, privateKeyHex) {
    // Create a key pair from the private key
    const keyPair = ec.keyFromPrivate(privateKeyHex);

    // Hash the message using ethers.js keccak256
    const msgHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));

    // Sign the hash and return the signature
    const signature = keyPair.sign(msgHash.slice(2), 'hex');
    const sigSplit = {
        r: signature.r.toString('hex'),
        s: signature.s.toString('hex')
    };
    const combinedSignature = sigSplit.r + sigSplit.s;
    return ethers.utils.arrayify('0x' + combinedSignature);
}

function encodeSignature(signature) {
    return ethers.utils.defaultAbiCoder.encode(
            ['uint256', 'uint256'], [verifier, 65]
        ) +
        '00' +
        ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.utils.arrayify(signature).length), 32) +
        signature.slice(2);
}

const encodedSignature = encodeSignature(signature);

console.log(signMessage(message, keyPair.privateKey))
console.log(encodedSignature)
//callVerifier("0x21DE47E9c3C5A32c9A2B4F3de3377eEA68CcD4f4")
