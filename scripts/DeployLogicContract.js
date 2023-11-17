// scripts/deploy_my_contract.js
const hre = require("hardhat");

async function main() {
// Récupère le contrat à déployer
const MyContract = await hre.ethers.getContractFactory("SimpleStorage");
const myContract = await MyContract.deploy();
console.log(myContract);
    console.log("MyContract deployed to:", myContract.runner.address);
}

main().catch((error) => {
console.error(error);
process.exitCode = 1;
});
