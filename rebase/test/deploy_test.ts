// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Charger le contrat factory
    const Factory = await ethers.getContractFactory("GnosisSafeProxyFactory");
    const factory = await Factory.deploy();
    await factory.deployed();

    console.log("Factory deployed to:", factory.address);

    // Déployer un proxy via la factory
    // Remplacer `GnosisSafeProxy` par le contrat que vous voulez déployer via la factory
    const proxy = await factory.createProxy("address_of_the_logic_contract", "0x");
    console.log("Proxy deployed to:", proxy.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
