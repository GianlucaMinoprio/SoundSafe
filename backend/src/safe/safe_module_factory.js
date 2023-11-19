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
exports.listenForNewSafeModules = exports.deploySafeModule = exports.initSafeModuleFactory = void 0;
const ethers_1 = require("ethers");
const SafeModuleFactory_1 = __importDefault(require("./abi/SafeModuleFactory"));
let safeModuleFactory = undefined;
function initSafeModuleFactory(address, wallet) {
    safeModuleFactory = new ethers_1.ethers.Contract(address, SafeModuleFactory_1.default, wallet);
}
exports.initSafeModuleFactory = initSafeModuleFactory;
function deploySafeModule(hardware_public_key) {
    return __awaiter(this, void 0, void 0, function* () {
        // Extract x and y coordinates from the public key
        const xHex = hardware_public_key.substring(2, 66); // Next 64 characters after '04' for x
        const yHex = hardware_public_key.substring(66); // Remaining characters for y
        // Convert to BigNumber
        const x = BigInt("0x" + xHex);
        const y = BigInt("0x" + yHex);
        if (!safeModuleFactory)
            throw new Error("SafeModuleFactory wasn't correctly initialized.");
        // Call the create function
        try {
            console.log("Deploying Safe Module Verifier contract...");
            const tx = yield safeModuleFactory.create(x, y);
            console.log("Transaction hash:", tx.hash);
            // Wait for the transaction to be mined
            yield tx.wait();
            console.log("Transaction confirmed");
            console.log(`With public key: ${hardware_public_key}\n`);
            return tx.data;
        }
        catch (error) {
            console.error("Error creating the signer:", error);
            throw error;
        }
    });
}
exports.deploySafeModule = deploySafeModule;
// Function to listen to the NewSignerCreated event
function listenForNewSafeModules(factoryAddress, provider) {
    const p256SignerFactory = new ethers_1.ethers.Contract(factoryAddress, SafeModuleFactory_1.default, provider);
    p256SignerFactory.on("NewSignerCreated", (x, y, signerAddress) => {
        console.log(`New signer created with x: ${x}, y: ${y}, at address: ${signerAddress}`);
    });
}
exports.listenForNewSafeModules = listenForNewSafeModules;
