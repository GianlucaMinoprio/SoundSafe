// scripts/deploy.ts
import ethers from "ethers";

const INFURA_PROJECT_ID = process.env.INFURA_API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const provider = new ethers.JsonRpcProvider(
  `https://polygon-mumbai.infura.io/v3/${INFURA_PROJECT_ID}`
);

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

console.log(`Wallet address: ${wallet.address}`);
