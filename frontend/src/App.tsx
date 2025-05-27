import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import petalTokenAbi from './abi/petalTokenAbi.json';
import gardenNftAbi from './abi/gardenNftAbi.json';
import moodGardenAbi from './abi/moodGardenAbi.json';
import PetalRain from './components/PetalRain';
import Footer from './components/Footer';
import { useNetwork } from './hooks/useNetwork';
import { getContractAddress } from './config/contracts';

// Function to get the image for a mood, with a default fallback
function generateMockGardenImage(mood: string): string {
  const baseUrl = 'https://soulpetals-dapp.vercel.app';
  const images: Record<string, string> = {
    peaceful: `${baseUrl}/images/moods/peaceful.jpeg`,
    joyful: `${baseUrl}/images/moods/joyful.jpeg`,
    vibrant: `${baseUrl}/images/moods/vibrant.jpeg`,
    serene: `${baseUrl}/images/moods/serene.jpeg`,
    mystical: `${baseUrl}/images/moods/mystical.jpeg`,
    default: `${baseUrl}/images/moods/default.jpeg`,
  };
  const key = mood.trim().toLowerCase();
  return images[key] || images.default;
}

// Add notification component
const Notification = ({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error'; onClose: () => void }) => (
  <div 
    className={`notification ${type}`}
    style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 24px',
      borderRadius: '8px',
      backgroundColor: type === 'success' ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${type === 'success' ? '#86efac' : '#fecaca'}`,
      color: type === 'success' ? '#166534' : '#991b1b',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out'
    }}
  >
    {message}
    <button 
      onClick={onClose}
      style={{
        marginLeft: '12px',
        background: 'none',
        border: 'none',
        color: 'inherit',
        cursor: 'pointer',
        fontSize: '1.2em'
      }}
    >
      ×
    </button>
  </div>
);

const App: React.FC = () => {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const { isCorrectNetwork, chainId } = useNetwork();

  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [moodGarden, setMoodGarden] = useState<ethers.Contract | null>(null);
  const [petalToken, setPetalToken] = useState<ethers.Contract | null>(null);
  const [gardenNFT, setGardenNFT] = useState<ethers.Contract | null>(null);
  const [gardenId, setGardenId] = useState<number | null>(null);
  const [mood, setMood] = useState<string>('');
  const [currentMood, setCurrentMood] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState('');
  const [gardenImage, setGardenImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [transferTo, setTransferTo] = useState('');
  const [showPetalRain, setShowPetalRain] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Obtener las direcciones de los contratos según la red
  const moodGardenAddress = isCorrectNetwork && chainId ? getContractAddress('moodGarden', chainId) : null;
  const petalTokenAddress = isCorrectNetwork && chainId ? getContractAddress('petalToken', chainId) : null;
  const gardenNftAddress = isCorrectNetwork && chainId ? getContractAddress('gardenNft', chainId) : null;

  const moodSuggestions = ["peaceful", "joyful", "vibrant", "serene", "mystical"];

  // Wallet and contract setup
  useEffect(() => {
    if (!authenticated || !wallets.length || !isCorrectNetwork || !chainId) {
      setSigner(null);
      setUserAddress(null);
      setMoodGarden(null);
      setPetalToken(null);
      setGardenNFT(null);
      return;
    }

    const wallet = wallets[0];
    if (wallet && wallet.address) {
      setUserAddress(wallet.address);
      wallet.getEthereumProvider().then((ethProvider) => {
        if (!ethProvider) {
          setSigner(null);
          setMoodGarden(null);
          setPetalToken(null);
          setGardenNFT(null);
          return;
        }
        const provider = new ethers.BrowserProvider(ethProvider);
        provider.getSigner().then((sgn) => {
          setSigner(sgn);
          if (moodGardenAddress) {
            setMoodGarden(new ethers.Contract(moodGardenAddress, moodGardenAbi, sgn));
          }
          if (petalTokenAddress) {
            setPetalToken(new ethers.Contract(petalTokenAddress, petalTokenAbi, sgn));
          }
          if (gardenNftAddress) {
            setGardenNFT(new ethers.Contract(gardenNftAddress, gardenNftAbi, sgn));
          }
        });
      });
    }
  }, [authenticated, wallets, isCorrectNetwork, chainId, moodGardenAddress, petalTokenAddress, gardenNftAddress]);

  // Approve tokens for upgrades (if needed)
  const approveTokens = async () => {
    if (!petalToken || !signer || !moodGarden || loading) return;
    setLoading(true);
    try {
      const amount = ethers.parseEther("100");
      const tx = await petalToken.approve(await moodGarden.getAddress(), amount);
      await tx.wait();
      showNotification("Tokens approved successfully!");
    } catch {
      showNotification("Error approving tokens", 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to show notifications
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Mint a new garden NFT
  const mintGarden = async () => {
    if (!moodGarden || !signer || !gardenNFT || loading) {
      console.error("Missing requirements for minting:", {
        hasMoodGarden: !!moodGarden,
        hasSigner: !!signer,
        hasGardenNFT: !!gardenNFT,
        isLoading: loading
      });
      return;
    }
    setLoading(true);
    try {
      console.log("Starting mint process...");
      
      // Verify contract addresses
      const moodGardenAddr = await moodGarden.getAddress();
      const gardenNFTAddr = await gardenNFT.getAddress();
      const petalTokenAddr = await petalToken?.getAddress();
      
      console.log("Contract addresses:", {
        moodGarden: moodGardenAddr,
        gardenNFT: gardenNFTAddr,
        petalToken: petalTokenAddr
      });

      // Get current token ID before minting
      const currentTokenId = await gardenNFT.getCurrentTokenId();
      console.log("Current token ID before minting:", currentTokenId);

      const tx = await moodGarden.mintGarden(await signer.getAddress(), { 
        gasLimit: 500000
      });
      console.log("Mint transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);
      
      // Get the new token ID after minting
      const newTokenId = await gardenNFT.getCurrentTokenId();
      console.log("New token ID after minting:", newTokenId);
      
      // Set the garden ID to the new token ID
      setGardenId(Number(newTokenId) - 1); // Subtract 1 because getCurrentTokenId returns the next ID
      console.log("Garden ID set to:", Number(newTokenId) - 1);
      
      showNotification(`Garden minted successfully! ID: ${Number(newTokenId) - 1}`);
    } catch (err) {
      console.error("Error minting garden:", err);
      showNotification('Error minting garden: ' + (err instanceof Error ? err.message : String(err)), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Set the mood for the garden
  const handleMoodInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only letters, no spaces or special chars, max 16
    const value = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 25);
    setMood(value);
  };

  const setGardenMood = async () => {
    if (!moodGarden || !gardenId || !mood || loading || !gardenNFT || !signer) {
      console.error("Missing requirements for setting mood:", {
        hasMoodGarden: !!moodGarden,
        gardenId,
        mood,
        isLoading: loading,
        hasGardenNFT: !!gardenNFT,
        hasSigner: !!signer
      });
      return;
    }
    setLoading(true);
    try {
      console.log("Setting mood for garden:", gardenId, "mood:", mood);
      
      // Verify garden ownership
      const signerAddress = await signer.getAddress();
      console.log("Checking ownership for address:", signerAddress);
      
      const gardenOwner = await gardenNFT.ownerOf(gardenId);
      console.log("Garden owner:", gardenOwner);
      
      if (gardenOwner.toLowerCase() !== signerAddress.toLowerCase()) {
        throw new Error(`You are not the owner of this garden. Owner: ${gardenOwner}, Your address: ${signerAddress}`);
      }

      // Verificar si el mood ya está seteado
      const currentMood = await moodGarden.getMood(gardenId);
      if (currentMood.toLowerCase() === mood.toLowerCase()) {
        console.log("Mood already set to:", mood);
        setCurrentMood(mood);
        showNotification('Mood already set. You can now describe your garden and generate the image.');
        return;
      }

      console.log("Ownership verified, proceeding with setMood...");
      const tx = await moodGarden.setMood(gardenId, mood);
      console.log("Set mood transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Set mood transaction receipt:", receipt);
      
      const newMood = await moodGarden.getMood(gardenId);
      console.log("Retrieved new mood:", newMood);
      setCurrentMood(newMood);
      
      // No actualizamos la imagen aquí, solo el mood
      showNotification('Mood set successfully! Now you can describe your garden and generate the image.');
    } catch (err) {
      console.error("Error setting mood:", err);
      showNotification('Error setting mood: ' + (err instanceof Error ? err.message : String(err)), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Generate the garden image (mock)
  const handleGenerateImage = async () => {
    if (!currentMood) {
      showNotification("Please set a mood first", 'error');
      return;
    }
    setGenerating(true);
    try {
      const imageUrl = generateMockGardenImage(currentMood);
      setGardenImage(imageUrl);
      
      // Verificar que la imagen se cargue correctamente
      const img = new Image();
      img.onload = () => {
        console.log("Image loaded successfully");
        setShowPetalRain(true);
        setTimeout(() => setShowPetalRain(false), 5000);
      };
      img.onerror = (err) => {
        console.error("Error loading image:", err);
        showNotification("Error loading garden image", 'error');
      };
      img.src = imageUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      showNotification("Error generating mock image: " + (error instanceof Error ? error.message : String(error)), 'error');
    }
    setGenerating(false);
  };

  // Memoize loadGardenData function
  const loadGardenData = useCallback(async (gardenId: number) => {
    if (!moodGarden || !gardenNFT || !signer) return;
    
    try {
      const currentMood = await moodGarden.getMood(gardenId);
      setCurrentMood(currentMood);
      
      if (currentMood) {
        const imageUrl = generateMockGardenImage(currentMood);
        setGardenImage(imageUrl);
      }
      
      // También podríamos intentar cargar el tokenURI para verificar que está funcionando correctamente
      try {
        const tokenURI = await gardenNFT.tokenURI(gardenId);
        console.log("Token URI for garden", gardenId, ":", tokenURI);
      } catch (uriError) {
        console.warn("Could not load tokenURI:", uriError);
      }
    } catch (error) {
      console.error("Error loading garden data:", error);
    }
  }, [moodGarden, gardenNFT, signer]);

  // Load garden data when gardenId changes
  useEffect(() => {
    if (gardenId !== null) {
      loadGardenData(gardenId);
    }
  }, [gardenId, loadGardenData]);

  // Update transferNFT function to verify tokenURI
  const transferNFT = async () => {
    if (!gardenNFT || !userAddress || !gardenId || !transferTo) return;
    setLoading(true);
    try {
      const tx = await gardenNFT.transferFrom(userAddress, transferTo, gardenId);
      await tx.wait();
      
      console.log("NFT transferred successfully. The recipient will be able to see the garden image.");
      
      // Show PetalRain effect on successful transfer
      setShowPetalRain(true);
      setTimeout(() => setShowPetalRain(false), 5000);
      
      showNotification("NFT transferred successfully!");
      
      // Reset all states to initial
      setGardenId(null);
      setCurrentMood('');
      setGardenImage(null);
      setMood('');
      setTransferTo('');
      setPrompt('');
      setGenerating(false);
    } catch (error) {
      console.error("Error transferring NFT:", error);
      showNotification("Error transferring NFT: " + (error instanceof Error ? error.message : String(error)), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showPetalRain && <PetalRain />}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <img
            src="/images/sp-logo.jpeg"
            alt="SoulPetals Logo"
            className="eth-logo"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              boxShadow: "0 0 12px #4A90E2, 0 0 4px #f687b3",
              objectFit: "cover",
              marginRight: 8,
              background: "#fff",
              border: "2px solid #f687b3"
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <h1 className="title" style={{ margin: 0 }}>SoulPetals</h1>
            <span
              className="subtitle"
              style={{
                fontSize: "1.15em",
                color: "#2F855A",
                marginTop: 4,
                fontWeight: 600,
                letterSpacing: "0.5px",
                textShadow: "0 1px 8px #ffe0f0, 0 0 2px #4A90E2"
              }}
            >
              🌸 Jardines Emocionales en Blockchain
            </span>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          {!ready ? (
            <span>Loading...</span>
          ) : !authenticated ? (
            <button className="button" onClick={login}>
              Connect Wallet / Sign In
            </button>
          ) : (
            <div>
              <span>Connected: {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}</span>
              <button className="button" onClick={logout} style={{ marginLeft: 16 }}>
                Sign Out
              </button>
            </div>
          )}
        </div>
        {authenticated && !isCorrectNetwork && (
          <div className="network-warning">
            Por favor, conecta a la red Sepolia o Localhost
          </div>
        )}
        {authenticated && isCorrectNetwork && (
          <>
            <button className="button" onClick={mintGarden} disabled={loading}>
              {loading ? 'Minting...' : 'Mint a Magical Garden'}
            </button>
            {gardenId !== null && (
              <div className="garden-section">
                <div className="garden-controls">
                  <h2>Your Garden</h2>
                  <div className="garden-info" style={{ 
                    padding: '12px', 
                    backgroundColor: '#f0f9ff', 
                    borderRadius: '8px',
                    marginBottom: '16px',
                    border: '1px solid #bae6fd'
                  }}>
                    <p style={{ margin: 0, fontSize: '1.1em', color: '#0369a1' }}>
                      Garden ID: <strong>{gardenId}</strong>
                    </p>
                    <p style={{ margin: '8px 0 0 0', color: '#0c4a6e' }}>
                      Current Mood: {currentMood ? currentMood : 'Not set'}
                    </p>
                  </div>
                  <div className="mood-input">
                    <select
                      className="input"
                      value={mood}
                      onChange={e => setMood(e.target.value)}
                      style={{ width: 110, fontSize: "1em" }}
                    >
                      <option value="">Select Mood</option>
                      {moodSuggestions.map(m => (
                        <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                      ))}
                    </select>
                    <input
                      className="input"
                      type="text"
                      placeholder="Or type mood"
                      value={mood}
                      onChange={handleMoodInput}
                      style={{ width: 90, fontSize: "1em" }}
                      maxLength={16}
                      pattern="[A-Za-z]+"
                    />
                    <button 
                      className="button" 
                      onClick={setGardenMood} 
                      disabled={loading || !mood}
                      style={{
                        backgroundColor: mood ? '#4A90E2' : '#ccc',
                        cursor: mood ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {loading ? 'Setting...' : 'Set Mood'}
                    </button>
                  </div>
                  <div className="centered-btn">
                    <button className="button" onClick={approveTokens} disabled={loading}>
                      {loading ? 'Approving...' : 'Approve Tokens'}
                    </button>
                  </div>
                </div>
                <div className="garden-visual">
                  {!gardenImage ? (
                    <div style={{ width: "100%" }}>
                      {currentMood && (
                        <>
                          <input
                            className="input"
                            type="text"
                            placeholder="Describe your garden (optional)"
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            disabled={loading || generating}
                            style={{ width: "100%", maxWidth: 400, marginRight: 8 }}
                          />
                          <button
                            className="button"
                            onClick={handleGenerateImage}
                            disabled={!currentMood || loading || generating}
                            style={{ marginTop: 12 }}
                          >
                            {generating ? "Generating..." : "Generate Garden IA"}
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="garden-image-box" style={{
                        transition: 'transform 0.3s ease-in-out',
                        cursor: 'pointer'
                      }}>
                        <img
                          src={gardenImage}
                          alt="AI generated garden"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease-in-out'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        />
                      </div>
                      <div className="garden-actions">
                        <button
                          className="button"
                          onClick={() => {
                            setGardenImage(null);
                            setMood('');
                            setCurrentMood(''); 
                          }}
                        >
                          Change Mood
                        </button>
                        <input
                          className="input"
                          type="text"
                          placeholder="Recipient address"
                          value={transferTo}
                          onChange={e => setTransferTo(e.target.value)}
                          style={{ width: 180, marginBottom: 8 }}
                          disabled={loading}
                        />
                        <button
                          className="button"
                          onClick={transferNFT}
                          disabled={loading || !transferTo}
                        >
                          {loading ? "Transferring..." : "Transfer NFT"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;