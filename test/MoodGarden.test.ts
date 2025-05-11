import { expect } from "chai";
import { ethers } from "hardhat";
import { PetalToken, GardenNFT, MoodGarden } from "../typechain-types";

describe("MoodGarden", function () {
  let petalToken: PetalToken;
  let gardenNFT: GardenNFT;
  let moodGarden: MoodGarden;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const PetalToken = await ethers.getContractFactory("PetalToken");
    petalToken = await PetalToken.deploy();
    await petalToken.waitForDeployment();

    await petalToken.mint(owner.address, ethers.parseEther("1000000"));
    await petalToken.mint(addr1.address, ethers.parseEther("1000"));

    const GardenNFT = await ethers.getContractFactory("GardenNFT");
    gardenNFT = await GardenNFT.deploy();
    await gardenNFT.waitForDeployment();

    const MoodGarden = await ethers.getContractFactory("MoodGarden");
    moodGarden = await MoodGarden.deploy(await petalToken.getAddress(), await gardenNFT.getAddress());
    await moodGarden.waitForDeployment();

    await petalToken.transferOwnership(await moodGarden.getAddress());
    await gardenNFT.transferOwnership(await moodGarden.getAddress());
  });

  it("Should set mood for a garden", async function () {
    await moodGarden.mintGarden(addr1.address);
    await moodGarden.connect(addr1).setMood(1, "happy");
    expect(await moodGarden.getMood(1)).to.equal("happy");
  });

  it("Should fail to set mood if not owner", async function () {
    await moodGarden.mintGarden(addr1.address);
    await expect(
      moodGarden.connect(owner).setMood(1, "sad")
    ).to.be.revertedWith("Not the owner of this garden");
  });

  it("Should upgrade garden level with tokens", async function () {
    await moodGarden.mintGarden(addr1.address);
    await petalToken.connect(addr1).approve(await moodGarden.getAddress(), ethers.parseEther("100"));
    await moodGarden.connect(addr1).upgradeGarden(1);
    expect(await moodGarden.getGardenLevel(1)).to.equal(1);
    expect(await petalToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("900"));
  });

  it("Should revert upgradeGarden with insufficient token balance", async function () {
    await moodGarden.mintGarden(addr2.address); // tokenId 1 para addr2
    await petalToken.connect(addr2).approve(await moodGarden.getAddress(), ethers.parseEther("100")); // Aprobamos tokens
    await expect(
      moodGarden.connect(addr2).upgradeGarden(1)
    ).to.be.revertedWith("Insufficient PETAL tokens"); // Cambiamos a esperar el mensaje correcto
  });

  it("Should emit events correctly", async function () {
    await moodGarden.mintGarden(addr1.address);
    await petalToken.connect(addr1).approve(await moodGarden.getAddress(), ethers.parseEther("100"));
    await expect(moodGarden.connect(addr1).setMood(1, "calm"))
      .to.emit(moodGarden, "MoodSet")
      .withArgs(1, "calm");

    await expect(moodGarden.connect(addr1).upgradeGarden(1))
      .to.emit(moodGarden, "GardenUpgraded")
      .withArgs(1, 1);
  });
});