import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const PetalToken = await ethers.getContractFactory("PetalToken");
  const petalToken = await PetalToken.deploy();
  await petalToken.waitForDeployment();
  console.log("PetalToken deployed to:", await petalToken.getAddress());

  const GardenNFT = await ethers.getContractFactory("GardenNFT");
  const gardenNFT = await GardenNFT.deploy();
  await gardenNFT.waitForDeployment();
  console.log("GardenNFT deployed to:", await gardenNFT.getAddress());

  const MoodGarden = await ethers.getContractFactory("MoodGarden");
  const moodGarden = await MoodGarden.deploy(await petalToken.getAddress(), await gardenNFT.getAddress());
  await moodGarden.waitForDeployment();
  console.log("MoodGarden deployed to:", await moodGarden.getAddress());

  await petalToken.transferOwnership(await moodGarden.getAddress());
  await gardenNFT.transferOwnership(await moodGarden.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});