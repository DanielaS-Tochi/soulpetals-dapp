import { expect } from "chai";
import { ethers } from "hardhat";
import { PetalToken } from "../typechain-types";

describe("PetalToken", function () {
  let petalToken: PetalToken;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    const PetalToken = await ethers.getContractFactory("PetalToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    petalToken = await PetalToken.deploy();
    await petalToken.waitForDeployment();
  });

  it("Should have correct name and symbol", async function () {
    expect(await petalToken.name()).to.equal("PetalToken");
    expect(await petalToken.symbol()).to.equal("PETAL");
  });

  it("Should have correct initial supply", async function () {
    const totalSupply = await petalToken.totalSupply();
    expect(totalSupply).to.equal(ethers.parseEther("1000000"));
    expect(await petalToken.balanceOf(owner.address)).to.equal(ethers.parseEther("1000000"));
  });

  it("Should mint tokens to an address", async function () {
    await petalToken.mint(addr1.address, ethers.parseEther("1000"));
    const balance = await petalToken.balanceOf(addr1.address);
    expect(balance).to.equal(ethers.parseEther("1000"));
  });

  it("Should fail to mint if not owner", async function () {
    await expect(
      petalToken.connect(addr1).mint(addr2.address, ethers.parseEther("1000"))
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should transfer tokens between accounts", async function () {
    await petalToken.transfer(addr1.address, ethers.parseEther("500"));
    expect(await petalToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("500"));
    expect(await petalToken.balanceOf(owner.address)).to.equal(ethers.parseEther("999500"));
  });
});