import express, {Express} from 'express';
import mysql from 'mysql2/promise';
import {ContractTransactionResponse, ethers} from 'ethers';

import dotenv from 'dotenv';
import {createSigner, initP256SignerFactory, listenForNewSigner} from "./p256signer/p256signer";
import { initGnosisSafeProxyFactory } from './safe/safe_factory';
dotenv.config();

const app: Express = express();
const port: number = 3000;

app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'hackathon',
  password: 'hackathon',
  database: 'soundsafe',
};

let connection: mysql.Connection | undefined = undefined;

// CONNECTING TO THE BLOCKCHAIN --------------------------------------------------------------
if (!process.env.PRIVATE_KEY)
  throw new Error('No PRIVATE_KEY specified in the .env file !');
if (!process.env.JSON_RPC_PROVIDER)
  throw new Error('No JSON_RPC_PROVIDER specified in the .env file !');
if (!process.env.P256_SIGNER_FACTORY_ADDRESS)
  throw new Error('No P256_SIGNER_FACTORY_ADDRESS provided in the .env file !')
if (!process.env.SAFE_FACTORY_ADDRESS)
  throw new Error('No SAFE_FACTORY_ADDRESS provided in the .env file !')

console.log(`Connecting to provider: ${process.env.JSON_RPC_PROVIDER}...`);
const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
console.log('Successfully initialized provider.\n');

console.log('Creating the wallet...');
const wallet: ethers.Wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    provider
);
console.log(`Successfully created wallet ('${wallet.address}').\n`);

const P256_SIGNER_FACTORY_ADDRESS = process.env.P256_SIGNER_FACTORY_ADDRESS;
console.log(`P256 SIGNER FACTORY ADDRESS: ${P256_SIGNER_FACTORY_ADDRESS}`);

console.log('Initializing the P256 Signer Factory...');
initP256SignerFactory(P256_SIGNER_FACTORY_ADDRESS, wallet);
console.log('Successfully initialized the P256 Signer Factory.\n');

console.log('Initializing Safe Factory...');
const SAFE_FACTORY_ADDRESS = process.env.SAFE_FACTORY_ADDRESS;
console.log(`Safe Factory address: ${SAFE_FACTORY_ADDRESS}`);

console.log('Successfully initialized the Safe Factory.\n');

listenForNewSigner(P256_SIGNER_FACTORY_ADDRESS, provider);
console.log('\n');
// END  ----------------------------------------------------------------------------------------

async function connectToDatabase() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the MySQL database.');
  } catch (error) {
    console.error('Error connecting to the MySQL database:', error);
    throw error;
  }
}

app.get('/users', async (_, res) => {
  if (!connection)
    return res.status(500).send("Database wasn't correctly initialized.");

  const [users] = await connection.execute('SELECT * FROM user');

  res.status(200).json(users);
});

app.post('/account/create', async (req, res) => {
  if (!connection)
    return res.status(500).send("Database wasn't correctly initialized.");

  const { hardware_pub } = req.body;

  if (!hardware_pub)
    return res.status(400).send("Incorrect request parameters. Body should contain 'hardware_pub'.");

  let verifier_address: string;
  let safe_address: string = "SAFE ADDRESS";
  try {
    const ctx_res: ContractTransactionResponse = await createSigner(hardware_pub);
    verifier_address = ctx_res.data;
  }
  catch (err) {
    console.error(err);
    return res.status(500).send();
  }

  try {
    await connection.execute('INSERT INTO user (hardware_pub, safe_address, verifier_address) VALUES (?, ?, ?)',
        [hardware_pub, safe_address, verifier_address]);

    console.log(`Created new user:
    HARDWARE PUBLIC KEY: ${hardware_pub}
    VERIFIER ADDRESS   : ${verifier_address}
    SAFE     ADDRESS   : ${safe_address}
    `);
    return res.status(200)
        .json({
          verifier_address: verifier_address,
          safe_address: safe_address
        });
  }
  catch(err) {
    console.error(err);
    return res.status(401).send('User already exists.');
  }
});

app.delete('/users', async (_, res) => {
  try {
    await connection?.execute('DELETE FROM user;');
    res.status(200).send();
  }
  catch (err) {
    console.error(err);
    return res.status(500).send();
  }
})

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
  await connectToDatabase();
});
