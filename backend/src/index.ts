import express, {Express} from 'express';
import mysql from 'mysql2/promise';
import {ethers} from 'ethers';

import dotenv from 'dotenv';
import {initSafeModuleFactory, listenForNewSafeModules, deploySafeModule} from "./safe/safe_module_factory";
import {createSafe,createSafeFactory} from "./safe/safe";
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
if (!process.env.SAFE_MODULE_FACTORY_ADDRESS)
  throw new Error('No SAFE_MODULE_FACTORY_ADDRESS provided in the .env file !')

console.log(`Connecting to provider: ${process.env.JSON_RPC_PROVIDER}...`);
const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
console.log('Successfully initialized provider.\n');

console.log('Creating the wallet...');
const wallet: ethers.Wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    provider
);
console.log(`Successfully created wallet ('${wallet.address}').\n`);

const SAFE_MODULE_FACTORY_ADDRESS = process.env.SAFE_MODULE_FACTORY_ADDRESS;
console.log(`Safe Module Factory Address: ${SAFE_MODULE_FACTORY_ADDRESS}`);

console.log('Initializing the Safe Module Factory...');
initSafeModuleFactory(SAFE_MODULE_FACTORY_ADDRESS, wallet);
console.log('Successfully initialized the Safe Module Factory.\n');

console.log('Initializing Safe Factory...');
createSafeFactory(wallet)
    .then(() => console.log('Successfully initialized the Safe Factory.\n'));

listenForNewSafeModules(SAFE_MODULE_FACTORY_ADDRESS, provider);
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

  let safe_address: string;
  let module_address: string;
  try {
    let { safe, module } = await createSafe(wallet, hardware_pub)
    safe_address = safe;
    module_address = module;
  }
  catch (err) {
    console.error(err);
    return res.status(500).send();
  }

  try {
    await connection.execute('INSERT INTO user (hardware_pub, safe_address, verifier_address) VALUES (?, ?, ?)',
        [hardware_pub, safe_address, module_address]);

    console.log(`Created new user:
    HARDWARE PUBLIC KEY: ${hardware_pub}
    VERIFIER ADDRESS   : ${module_address}
    SAFE     ADDRESS   : ${safe_address}
    `);
    return res.status(200)
        .json({
          verifier_address: module_address,
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