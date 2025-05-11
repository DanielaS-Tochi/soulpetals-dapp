import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const App: React.FC = () => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [moodGarden, setMoodGarden] = useState<ethers.Contract | null>(null);
  const [petalToken, setPetalToken] = useState<ethers.Contract | null>(null);
  const [gardenId, setGardenId] = useState<number | null>(null);
  const [mood, setMood] = useState<string>('');
  const [currentMood, setCurrentMood] = useState<string>('');
  const [level, setLevel] = useState<number>(0);
  const [aiMoodSuggestion, setAiMoodSuggestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      const signer = await provider.getSigner(0);
      setSigner(signer);
      console.log("Signer initialized:", await signer.getAddress());

      const moodGardenAbi = [
        "function mintGarden(address to) public",
        "function setMood(uint256 tokenId, string memory mood) public",
        "function getMood(uint256 tokenId) public view returns (string memory)",
        "function upgradeGarden(uint256 tokenId) public",
        "function getGardenLevel(uint256 tokenId) public view returns (uint256)"
      ] as const;

      const petalTokenAbi = [
        "function approve(address spender, uint256 amount) public returns (bool)",
        "function allowance(address owner, address spender) public view returns (uint256)"
      ] as const;

      const moodGardenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
      const moodGardenContract = new ethers.Contract(moodGardenAddress, moodGardenAbi, signer);
      setMoodGarden(moodGardenContract);
      console.log("MoodGarden contract initialized at:", moodGardenAddress);

      // Reemplaza con la dirección real de PetalToken
      const petalTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Actualiza con la dirección de PetalToken
      const petalTokenContract = new ethers.Contract(petalTokenAddress, petalTokenAbi, signer);
      setPetalToken(petalTokenContract);
      console.log("PetalToken contract initialized at:", petalTokenAddress);

      const aiSuggestion = await generateAiMoodSuggestion();
      setAiMoodSuggestion(aiSuggestion);
      console.log("AI Mood Suggestion:", aiSuggestion);
    };
    init();
  }, []);

  const generateAiMoodSuggestion = async (): Promise<string> => {
    const moods = ['peaceful', 'joyful', 'serene', 'vibrant', 'mystical'];
    return moods[Math.floor(Math.random() * moods.length)];
  };

  const approveTokens = async () => {
    if (!petalToken || !signer || !moodGarden || loading) return;
    setLoading(true);
    try {
      const amount = ethers.parseEther("100");
      console.log("Approving tokens:", ethers.formatEther(amount), "to", await moodGarden.getAddress());
      const tx = await petalToken.approve(await moodGarden.getAddress(), amount);
      const receipt = await tx.wait();
      console.log("Approval transaction confirmed:", receipt);
      alert("Tokens approved successfully!");
    } catch (error) {
      console.error("Error approving tokens:", error);
      alert("Error approving tokens");
    } finally {
      setLoading(false);
    }
  };

  const mintGarden = async () => {
    if (!moodGarden || !signer || loading) return;
    setLoading(true);
    try {
      console.log("Minting garden for:", await signer.getAddress());
      const tx = await moodGarden.mintGarden(await signer.getAddress());
      const receipt = await tx.wait();
      console.log("Mint transaction confirmed:", receipt);
      setGardenId(1);
      setLevel(0);
      alert(`Garden minted with AI mood suggestion: ${aiMoodSuggestion}`);
    } catch (error) {
      console.error("Error minting garden:", error);
      alert('Error minting garden');
    } finally {
      setLoading(false);
    }
  };

  const setGardenMood = async () => {
    if (!moodGarden || !gardenId || !mood || loading) return;
    setLoading(true);
    try {
      console.log("Setting mood for garden ID", gardenId, "to:", mood);
      const tx = await moodGarden.setMood(gardenId, mood);
      const receipt = await tx.wait();
      console.log("Set mood transaction confirmed:", receipt);
      const newMood = await moodGarden.getMood(gardenId);
      console.log("New mood retrieved:", newMood);
      setCurrentMood(newMood);
      alert('Mood set successfully!');
    } catch (error) {
      console.error("Error setting mood:", error);
      alert('Error setting mood');
    } finally {
      setLoading(false);
    }
  };

  const upgradeGarden = async () => {
    if (!moodGarden || !gardenId || loading) return;
    setLoading(true);
    try {
      console.log("Upgrading garden ID:", gardenId);
      const tx = await moodGarden.upgradeGarden(gardenId);
      const receipt = await tx.wait();
      console.log("Upgrade transaction confirmed:", receipt);
      const newLevel = await moodGarden.getGardenLevel(gardenId);
      console.log("New level retrieved:", newLevel);
      setLevel(newLevel);
      alert(`Garden upgraded to level ${newLevel}!`);
    } catch (error) {
      console.error("Error upgrading garden:", error);
      alert('Error upgrading garden (check token balance)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">SoulPetals 🌸</h1>
      <button className="button" onClick={mintGarden} disabled={loading}>
        {loading ? 'Minting...' : 'Mint a Magical Garden'}
      </button>
      {gardenId && (
        <div className="garden-section">
          <div className="garden-controls">
            <h2>Your Garden (ID: {gardenId})</h2>
            <p className="garden-info">Level: {level}</p>
            <p className="garden-info">Current Mood: {currentMood || 'Not set'}</p>
            <div className="mood-input">
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder={`AI Suggestion: ${aiMoodSuggestion}`}
                className="input"
                disabled={loading}
              />
              <button className="button" onClick={setGardenMood} disabled={loading}>
                {loading ? 'Setting...' : 'Set Mood'}
              </button>
            </div>
            <button className="button" onClick={approveTokens} disabled={loading}>
              {loading ? 'Approving...' : 'Approve Tokens'}
            </button>
            <button className="button" onClick={upgradeGarden} disabled={loading}>
              {loading ? 'Upgrading...' : 'Upgrade Garden'}
            </button>
          </div>
          <div className="garden-visual">
            <p>Visual Effect (IA Garden Placeholder)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;