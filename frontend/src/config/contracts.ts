export const CONTRACTS = {
  localhost: {
    moodGarden: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Dirección local
    petalToken: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",  // Dirección local
    gardenNft: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"   // Dirección local
  },
  sepolia: {
    moodGarden: import.meta.env.VITE_MOOD_GARDEN_ADDRESS || "0xA23eD114C568E49366AeC32eC1F9C2230087de25",
    petalToken: import.meta.env.VITE_PETAL_TOKEN_ADDRESS || "0x671Bf554C629D929C714D265bC8dD65066a0Ae5D",
    gardenNft: import.meta.env.VITE_GARDEN_NFT_ADDRESS || "0x812Fb854c4E98eCB8a16c4721C94d7C00D886dfC"
  }
};

export const getContractAddress = (contractName: 'moodGarden' | 'petalToken' | 'gardenNft', chainId: number) => {
  if (chainId === 11155111) { // Sepolia
    return CONTRACTS.sepolia[contractName];
  }
  return CONTRACTS.localhost[contractName]; // Localhost
}; 