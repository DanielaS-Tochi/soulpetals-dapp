import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

type NetworkState = 
  | { isCorrectNetwork: true; chainId: number }
  | { isCorrectNetwork: false; chainId: null };

export const useNetwork = (): NetworkState => {
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          const currentChainId = Number(network.chainId);
          // 11155111 es el chainId de Sepolia
          // 31337 es el chainId de Hardhat local
          const isCorrect = currentChainId === 11155111 || currentChainId === 31337;
          setIsCorrectNetwork(isCorrect);
          setChainId(isCorrect ? currentChainId : null);
        } catch (error) {
          console.error('Error checking network:', error);
          setChainId(null);
          setIsCorrectNetwork(false);
        }
      }
    };

    checkNetwork();

    // Escuchar cambios de red
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        checkNetwork();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', checkNetwork);
      }
    };
  }, []);

  return isCorrectNetwork 
    ? { isCorrectNetwork: true, chainId: chainId! }
    : { isCorrectNetwork: false, chainId: null };
}; 