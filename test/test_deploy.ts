import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("GnosisSafeProxyFactory Deployment", function () {
    let factory: Contract;

    before(async function () {
        // Déployer le contrat factory
        const Factory = await ethers.getContractFactory("GnosisSafeProxyFactory");
        factory = await Factory.deploy();
        await factory.deployed();
    });

    it("should deploy the factory successfully", async function () {
        expect(factory.address).to.properAddress;
    });

    it("should deploy a proxy contract", async function () {
        // Remplacez par l'adresse du contrat logique et les données d'initialisation
        const logicContractAddress = "0x..."; //FIXME
        const initData = "0x..."; //FIXME

        const tx = await factory.createProxy(logicContractAddress, initData);
        const receipt = await tx.wait();

        // Supposons que l'événement ProxyCreation émet l'adresse du nouveau proxy
        const event = receipt.events?.find(event => event.event === "ProxyCreation");
        expect(event).to.not.be.undefined;

        const proxyAddress = event?.args?.proxy;
        expect(proxyAddress).to.properAddress;
    });

    // Ajouter plus de tests au besoin
});
