"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promise_1 = __importDefault(require("mysql2/promise"));
const ethers_1 = require("ethers");
const dotenv_1 = __importDefault(require("dotenv"));
const safe_module_factory_1 = require("./safe/safe_module_factory");
const safe_1 = require("./safe/safe");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
const dbConfig = {
    host: 'localhost',
    user: 'hackathon',
    password: 'hackathon',
    database: 'soundsafe',
};
let connection = undefined;
// CONNECTING TO THE BLOCKCHAIN --------------------------------------------------------------
if (!process.env.PRIVATE_KEY)
    throw new Error('No PRIVATE_KEY specified in the .env file !');
if (!process.env.JSON_RPC_PROVIDER)
    throw new Error('No JSON_RPC_PROVIDER specified in the .env file !');
if (!process.env.SAFE_MODULE_FACTORY_ADDRESS)
    throw new Error('No SAFE_MODULE_FACTORY_ADDRESS provided in the .env file !');
console.log(`Connecting to provider: ${process.env.JSON_RPC_PROVIDER}...`);
const provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
console.log('Successfully initialized provider.\n');
console.log('Creating the wallet...');
const wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, provider);
console.log(`Successfully created wallet ('${wallet.address}').\n`);
const SAFE_MODULE_FACTORY_ADDRESS = process.env.SAFE_MODULE_FACTORY_ADDRESS;
console.log(`Safe Module Factory Address: ${SAFE_MODULE_FACTORY_ADDRESS}`);
console.log('Initializing the Safe Module Factory...');
(0, safe_module_factory_1.initSafeModuleFactory)(SAFE_MODULE_FACTORY_ADDRESS, wallet);
console.log('Successfully initialized the Safe Module Factory.\n');
console.log('Initializing Safe Factory...');
(0, safe_1.createSafeFactory)(wallet)
    .then(() => console.log('Successfully initialized the Safe Factory.\n'));
(0, safe_module_factory_1.listenForNewSafeModules)(SAFE_MODULE_FACTORY_ADDRESS, provider);
console.log('\n');
// END  ----------------------------------------------------------------------------------------
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            connection = yield promise_1.default.createConnection(dbConfig);
            console.log('Connected to the MySQL database.');
        }
        catch (error) {
            console.error('Error connecting to the MySQL database:', error);
            throw error;
        }
    });
}
app.get('/users', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!connection)
        return res.status(500).send("Database wasn't correctly initialized.");
    const [users] = yield connection.execute('SELECT * FROM user');
    res.status(200).json(users);
}));
app.post('/account/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!connection)
        return res.status(500).send("Database wasn't correctly initialized.");
    const { hardware_pub } = req.body;
    if (!hardware_pub)
        return res.status(400).send("Incorrect request parameters. Body should contain 'hardware_pub'.");
    let safe_address;
    let module_address;
    try {
        let { safe, module } = yield (0, safe_1.createSafe)(wallet, hardware_pub);
        safe_address = safe;
        module_address = module;
    }
    catch (err) {
        console.error(err);
        return res.status(500).send();
    }
    try {
        yield connection.execute('INSERT INTO user (hardware_pub, safe_address, verifier_address) VALUES (?, ?, ?)', [hardware_pub, safe_address, module_address]);
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
    catch (err) {
        console.error(err);
        return res.status(401).send('User already exists.');
    }
}));
app.delete('/users', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (connection === null || connection === void 0 ? void 0 : connection.execute('DELETE FROM user;'));
        res.status(200).send();
    }
    catch (err) {
        console.error(err);
        return res.status(500).send();
    }
}));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Example app listening at http://localhost:${port}`);
    yield connectToDatabase();
}));
