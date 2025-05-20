export const CONTRACTS = {
  localhost: {
    moodGarden: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Dirección local
    petalToken: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",  // Dirección local
    gardenNft: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"   // Dirección local
  },
  sepolia: {
    moodGarden: "0x9b8DE92673277FBa50211d83374C59E98D242b1b", // Dirección de Sepolia
    petalToken: "0xDa6D5b6553afAf9718A2143734c3207E393BE726",  // Dirección de Sepolia
    gardenNft: "0x874DfFA18Ce364400ff70551E1d0098e59eCfCD1"  // Dirección de Sepolia
  }
};

export const getContractAddress = (contractName: 'moodGarden' | 'petalToken' | 'gardenNft', chainId: number) => {
  if (chainId === 11155111) { // Sepolia
    return CONTRACTS.sepolia[contractName];
  }
  return CONTRACTS.localhost[contractName]; // Localhost
}; 