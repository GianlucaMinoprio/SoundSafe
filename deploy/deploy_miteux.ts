import { ethers } from "hardhat";
import {address} from "hardhat/internal/core/config/config-validation";
import {randomAddress} from "hardhat/internal/hardhat-network/provider/utils/random";
import {makeFakeSignature} from "hardhat/internal/hardhat-network/provider/utils/makeFakeSignature";


async function main() {
    const [deployer] = await ethers.getSigners();

    // example de fonction
    const storage_ = await ethers.getContractAt("SimpleStorage",randomAddress())
    const simpleStorage = await ethers.deployContract("SimpleStorage");
    console.log(simpleStorage);

    console.log("MyContract deployed to:", simpleStorage.my_getAddress());


    console.log("Deploying contracts with the account:", deployer.address);


    const Factory = await ethers.deployContract("GnosisSafeProxyFactory");
    console.log("Factory deployed to:", Factory.getAddress);
    const simpleStorageABI = require("../artifacts/contracts/logic_contract_for_proxy-testing.sol/SimpleStorage.json").abi;

    const simpleStorageInterface = new ethers.Interface(simpleStorageABI);

// Encodez les données pour l'appel de la fonction initialize avec une valeur initiale
    const initialValue = 42; // Remplacez par la valeur initiale souhaitée
    const initData = simpleStorageInterface.encodeFunctionData("initialize", [initialValue]);

    const proxy = await Factory.createProxy(simpleStorage.getAddress, initData);
    // Ici, vous devez attendre l'événement ou obtenir l'adresse du proxy autrement
    console.log("Proxy deployed to:", ); // Cette ligne nécessite une correction en fonction de votre implémentation
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
