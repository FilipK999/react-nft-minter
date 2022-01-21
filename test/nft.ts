import { ethers } from "hardhat";
import { expect } from "chai";

describe("NFT", () => {
  it("Should mint and transfer the NFT", async () => {
    const NFTMinter = await ethers.getContractFactory("NFTMinter");
    const minter = await NFTMinter.deploy(10);
    await minter.deployed();

    const recipient = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
    const metadataURI = "cid/test.png";
    let balance = await minter.balanceOf(recipient);
    expect(balance).to.eq(0);

    const mintedToken = await minter.mintToken(1, metadataURI, {
      value: ethers.utils.parseEther("0.1"),
    });

    await mintedToken.wait();

    balance = await minter.balanceOf(recipient);
    expect(balance).to.eq(1);
  });
});
