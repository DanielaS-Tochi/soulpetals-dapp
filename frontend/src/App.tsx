import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const App: React.FC = () => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [moodGarden, setMoodGarden] = useState<ethers.Contract | null>(null);
  const [gardenId, setGardenId] = useState<number | null>(null);
  const [mood, setMood] = useState<string>('');
  const [currentMood, setCurrentMood] = useState<string>('');
  const [level, setLevel] = useState<number>(0);
  const [aiMoodSuggestion, setAiMoodSuggestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      // Crear el provider directamente
      const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      // Usar await para resolver la promesa de getSigner
      const signer = await provider.getSigner(0);
      setSigner(signer);

      const moodGardenAbi = [
        "function mintGarden(address to) public",
        "function setMood(uint256 tokenId, string memory mood) public",
        "function getMood(uint256 tokenId) public view returns (string memory)",
        "function upgradeGarden(uint256 tokenId) public",
        "function getGardenLevel(uint256 tokenId) public view returns (uint256)"
      ] as const;

      const moodGardenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
      const moodGardenContract = new ethers.Contract(moodGardenAddress, moodGardenAbi, signer);
      setMoodGarden(moodGardenContract);

      const aiSuggestion = await generateAiMoodSuggestion();
      setAiMoodSuggestion(aiSuggestion);
    };
    init();
  }, []);

  const generateAiMoodSuggestion = async (): Promise<string> => {
    const moods = ['peaceful', 'joyful', 'serene', 'vibrant', 'mystical'];
    return moods[Math.floor(Math.random() * moods.length)];
  };

  const mintGarden = async () => {
    if (!moodGarden || !signer || loading) return;
    setLoading(true);
    try {
      const tx = await moodGarden.mintGarden(await signer.getAddress());
      await tx.wait();
      setGardenId(1);
      setLevel(0);
      alert(`Garden minted with AI mood suggestion: ${aiMoodSuggestion}`);
    } catch (error) {
      console.error(error);
      alert('Error minting garden');
    } finally {
      setLoading(false);
    }
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
    } catch (error) {
      console.error(error);
      alert('Error setting mood');
    } finally {
      setLoading(false);
    }
  };

  const upgradeGarden = async () => {
    if (!moodGarden || !gardenId || loading) return;
    setLoading(true);
    try {
      const tx = await moodGarden.upgradeGarden(gardenId);
      await tx.wait();
      const newLevel = await moodGarden.getGardenLevel(gardenId);
      setLevel(newLevel);
      alert(`Garden upgraded to level ${newLevel}!`);
    } catch (error) {
      console.error(error);
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
          <button className="button" onClick={upgradeGarden} disabled={loading}>
            {loading ? 'Upgrading...' : 'Upgrade Garden'}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;