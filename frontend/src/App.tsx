import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import petalTokenAbi from './abi/petalTokenAbi.json';
import gardenNftAbi from './abi/gardenNftAbi.json';
import moodGardenAbi from './abi/moodGardenAbi.json';

// Function to get the image for a mood, with a default fallback
function generateMockGardenImage(mood: string): string {
  const images: Record<string, string> = {
    peaceful: "./images/moods/peaceful.jpeg",
    joyful: "/images/moods/joyful.jpeg",
    vibrant: "/images/moods/vibrant.jpeg",
    serene: "/images/moods/serene.jpeg",
    mystical: "/images/moods/mystical.jpeg",
    default: "/images/moods/default.jpeg",
  };
  const key = mood.trim().toLowerCase();
  return images[key] || images.default;
}

// Update these addresses for your deployment
const moodGardenAddress = import.meta.env.VITE_MOOD_GARDEN_ADDRESS;
const petalTokenAddress = import.meta.env.VITE_PETAL_TOKEN_ADDRESS;
const gardenNftAddress = import.meta.env.VITE_GARDEN_NFT_ADDRESS;

const moodSuggestions = ["peaceful", "joyful", "vibrant", "serene", "mystical"];

const App: React.FC = () => {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();

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

  // Wallet and contract setup
  useEffect(() => {
    if (!authenticated || !wallets.length) {
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
          setMoodGarden(new ethers.Contract(moodGardenAddress, moodGardenAbi, sgn));
          setPetalToken(new ethers.Contract(petalTokenAddress, petalTokenAbi, sgn));
          setGardenNFT(new ethers.Contract(gardenNftAddress, gardenNftAbi, sgn));
        });
      });
    }
  }, [authenticated, wallets]);

  // Approve tokens for upgrades (if needed)
  const approveTokens = async () => {
    if (!petalToken || !signer || !moodGarden || loading) return;
    setLoading(true);
    try {
      const amount = ethers.parseEther("100");
      const tx = await petalToken.approve(await moodGarden.getAddress(), amount);
      await tx.wait();
      alert("Tokens approved successfully!");
    } catch {
      alert("Error approving tokens");
    } finally {
      setLoading(false);
    }
  };

  // Mint a new garden NFT
  const mintGarden = async () => {
    if (!moodGarden || !signer || !gardenNFT || loading) return;
    setLoading(true);
    try {
      const tx = await moodGarden.mintGarden(await signer.getAddress(), { gasLimit: 300000 });
      const receipt = await tx.wait();
      let mintedTokenId: number | null = null;
      for (const log of receipt.logs) {
        try {
          const parsed = gardenNFT.interface.parseLog(log);
          if (parsed && parsed.name === "Transfer") {
            mintedTokenId = Number(parsed.args.tokenId);
            break;
          }
        } catch {
          // Ignore unrelated logs
        }
      }
      if (mintedTokenId === null) {
        alert("Could not find minted tokenId. Check contract events and ABI.");
      }
      setGardenId(mintedTokenId ?? 0);
      alert(`Garden minted!`);
    } catch (err) {
      console.error("Error minting garden:", err);
      alert('Error minting garden');
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
    if (!moodGarden || !gardenId || !mood || loading) return;
    setLoading(true);
    try {
      const tx = await moodGarden.setMood(gardenId, mood);
      await tx.wait();
      const newMood = await moodGarden.getMood(gardenId);
      setCurrentMood(newMood);
      alert('Mood set successfully!');
    } catch (err) {
      console.error("Error setting mood:", err);
      alert('Error setting mood');
    } finally {
      setLoading(false);
    }
  };

  // Generate the garden image (mock)
  const handleGenerateImage = async () => {
    setGenerating(true);
    try {
      const imageUrl = generateMockGardenImage(mood || "default");
      setGardenImage(imageUrl);
    } catch {
      alert("Error generating mock image");
    }
    setGenerating(false);
  };

  // Transfer NFT to another address
  const transferNFT = async () => {
    if (!gardenNFT || !userAddress || !gardenId || !transferTo) return;
    setLoading(true);
    try {
      const tx = await gardenNFT.transferFrom(userAddress, transferTo, gardenId);
      await tx.wait();
      alert("NFT transferred!");
      // Reset all relevant states
      setGardenId(null);
      setCurrentMood('');
      setGardenImage(null);
      setMood('');
      setTransferTo('');
    } catch {
      alert("Error transferring NFT");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <img
          src="/images/eth-logo.jpg"
          alt="Ethereum Logo"
          className="eth-logo"
          style={{
            width: 94,
            height: 94,
            borderRadius: "50%",
            boxShadow: "0 0 12px #4A90E2, 0 0 4px #f687b3",
            objectFit: "cover",
            marginRight: 8,
            background: "#fff"
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
            🌸 Jardines Emocionales en Blockchain 🌱
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
      {authenticated && (
        <>
          <button className="button" onClick={mintGarden} disabled={loading}>
            {loading ? 'Minting...' : 'Mint a Magical Garden'}
          </button>
          {gardenId !== null && (
            <div className="garden-section">
              <div className="garden-controls">
                <h2>Your Garden (ID: {gardenId})</h2>
                <p className="garden-info">
                  Current Mood: {currentMood ? currentMood : 'Not set'}
                </p>
                <div className="mood-input">
                  <select
                    className="input"
                    value={mood}
                    onChange={e => setMood(e.target.value)}
                    style={{ width: 110, fontSize: "1em" }}
                  >
                    <option value="">Mood</option>
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
                  <button className="button" onClick={setGardenMood} disabled={loading || !mood}>
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
                    <div className="garden-image-box">
                      <img
                        src={gardenImage}
                        alt="AI generated garden"
                      />
                    </div>
                    <div className="garden-actions">
                      <button
                        className="button"
                        onClick={() => {
                          setGardenImage(null);
                          setMood('');
                          setCurrentMood(''); // Borra el current mood hasta que se setee uno nuevo
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
  );
};

export default App;