import "@nomiclabs/hardhat-ethers";
import { task, types } from "hardhat/config";
import { getContract } from "../src/helpers/contract";
import { getWallet } from "../src/helpers/wallet";

const contract = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
task("deploy-contract", "Deploy the Contract").setAction(async (_, hre) => {
  const factory = await hre.ethers.getContractFactory("NFTMinter", getWallet());
  const minter = await factory.deploy(420);
  await minter.deployed();

  console.log("Minter deployed to:", minter.address, hre.network.name);
});

task("withdraw", "Withdraws ETH from the Contract")
  .addParam("address", "The contract address", contract, types.string, true)
  .setAction(async ({ address }, hre) => {
    const [owner] = await hre.ethers.getSigners();
    const factory = await hre.ethers.getContractFactory("NFTMinter");
    const minter = factory.attach(address);

    const tx = await minter.connect(owner).withdraw();
    await tx.wait();
  });

task("get-balance", "Gets the contract's balance")
  .addParam("address", "The contract address", contract, types.string, true)
  .setAction(async ({ address }, hre) => {
    const [owner] = await hre.ethers.getSigners();
    const factory = await hre.ethers.getContractFactory("NFTMinter");
    const minter = factory.attach(address);
    const contract = new hre.ethers.Contract(address, factory.interface, owner);

    console.log(await contract.getBalance());
  });
