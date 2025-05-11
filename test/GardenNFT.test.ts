import { expect } from "chai";
import { ethers } from "hardhat";
import { GardenNFT } from "../typechain-types";

describe("GardenNFT", function () {
  let gardenNFT: GardenNFT;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    const GardenNFT = await ethers.getContractFactory("GardenNFT");
    [owner, addr1, addr2] = await ethers.getSigners();
    gardenNFT = await GardenNFT.deploy();
    await gardenNFT.waitForDeployment();
  });

  it("Should have correct name and symbol", async function () {
    expect(await gardenNFT.name()).to.equal("GardenNFT");
    expect(await gardenNFT.symbol()).to.equal("GARDEN");
  });

  it("Should mint an NFT to an address", async function () {
    await gardenNFT.mint(addr1.address);
    expect(await gardenNFT.ownerOf(1)).to.equal(addr1.address);
    expect(await gardenNFT.getCurrentTokenId()).to.equal(1);
  });

  it("Should increment tokenId correctly", async function () {
    await gardenNFT.mint(addr1.address);
    await gardenNFT.mint(addr1.address);
    expect(await gardenNFT.ownerOf(2)).to.equal(addr1.address);
    expect(await gardenNFT.getCurrentTokenId()).to.equal(2);
  });

  it("Should fail to mint if not owner", async function () {
    await expect(
      gardenNFT.connect(addr1).mint(addr2.address)
    ).to.be.revertedWithCustomError(gardenNFT, "OwnableUnauthorizedAccount");
  });

  it("Should transfer NFT between accounts", async function () {
    await gardenNFT.mint(addr1.address);
    await gardenNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 1);
    expect(await gardenNFT.ownerOf(1)).to.equal(addr2.address);
  });
});