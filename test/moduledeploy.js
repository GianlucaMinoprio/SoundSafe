const {ethers} = require("hardhat");

describe("Test", function () {
   before(async function () {
      signers = await ethers.getSigners();
      cont = await ethers.getContractFactory("MockERC20");
      erc = await cont.deploy("Mock", "MCK", 18, "1000000000000000000000000000000000000");
      // cont = await ethers.getContractFactory("TokenSwap");
      //
      // tokenswap = await cont.deploy( erc.address);
   });

   it ("Should deploy", async function () {
      console.log( await erc.getAddress());
   })
});