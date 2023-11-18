const {ethers} = require("hardhat");

describe("Test", function () {
   before(async function () {
      signers = await ethers.getSigners();
      cont = await ethers.getContractFactory("TokenSwap");
      erc = await cont.deploy("TokenSwap");
      // cont = await ethers.getContractFactory("TokenSwap");
      //
      // tokenswap = await cont.deploy( erc.address);
   });

   it ("Should deploy", async function () {
      console.log( await erc.getAddress());
   })
});