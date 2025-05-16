// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import './App.css';
// import { usePrivy, useWallets } from '@privy-io/react-auth';
// import petalTokenAbi from './abi/petalTokenAbi.json';
// import gardenNftAbi from './abi/gardenNftAbi.json';
// import moodGardenAbi from './abi/moodGardenAbi.json';
// import { generateGardenImageHF } from './utils/huggingface';
// // Actualiza estas direcciones según tu despliegue
// const moodGardenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// const petalTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const gardenNftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 

// const App: React.FC = () => {
//   const { ready, authenticated, login, logout } = usePrivy();
//   const { wallets } = useWallets();

//   const [signer, setSigner] = useState<ethers.Signer | null>(null);
//   const [userAddress, setUserAddress] = useState<string | null>(null);
//   const [moodGarden, setMoodGarden] = useState<ethers.Contract | null>(null);
//   const [petalToken, setPetalToken] = useState<ethers.Contract | null>(null);
//   const [gardenNFT, setGardenNFT] = useState<ethers.Contract | null>(null);
//   const [gardenId, setGardenId] = useState<number | null>(null);
//   const [mood, setMood] = useState<string>('');
//   const [currentMood, setCurrentMood] = useState<string>('');
//   const [level, setLevel] = useState<number>(0);
//   const [aiMoodSuggestion, setAiMoodSuggestion] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [prompt, setPrompt] = useState('');
//   const [gardenImage, setGardenImage] = useState<string | null>(null);
//   const [generating, setGenerating] = useState(false);

//   // Obtener signer y dirección desde Privy
//   useEffect(() => {
//     console.log("authenticated:", authenticated, "wallets:", wallets);
//     if (!authenticated || !wallets.length) {
//       setSigner(null);
//       setUserAddress(null);
//       setMoodGarden(null);
//       setPetalToken(null);
//       setGardenNFT(null);
//       return;
//     }

//     // Usa la primera wallet disponible
//     const wallet = wallets[0];
//     console.log("Selected wallet:", wallet);

//     if (wallet && wallet.address) {
//       setUserAddress(wallet.address);
//       wallet.getEthereumProvider().then((ethProvider) => {
//         console.log("ethProvider:", ethProvider);
//         if (!ethProvider) {
//           setSigner(null);
//           setMoodGarden(null);
//           setPetalToken(null);
//           setGardenNFT(null);
//           return;
//         }
//         const provider = new ethers.BrowserProvider(ethProvider);
//         provider.getSigner().then((sgn) => {
//           setSigner(sgn);
//           setMoodGarden(new ethers.Contract(moodGardenAddress, moodGardenAbi, sgn));
//           setPetalToken(new ethers.Contract(petalTokenAddress, petalTokenAbi, sgn));
//           setGardenNFT(new ethers.Contract(gardenNftAddress, gardenNftAbi, sgn));
//         });
//       });
//     }
//   }, [authenticated, wallets]);

//   // Sugerencia IA de mood
//   useEffect(() => {
//     const generateAiMoodSuggestion = async (): Promise<string> => {
//       const moods = ['peaceful', 'joyful', 'serene', 'vibrant', 'mystical'];
//       return moods[Math.floor(Math.random() * moods.length)];
//     };
//     generateAiMoodSuggestion().then(setAiMoodSuggestion);
//   }, []);

//   const approveTokens = async () => {
//     if (!petalToken || !signer || !moodGarden || loading) return;
//     setLoading(true);
//     try {
//       const amount = ethers.parseEther("100");
//       const tx = await petalToken.approve(await moodGarden.getAddress(), amount);
//       await tx.wait();
//       alert("Tokens approved successfully!");
//     } catch {
//       alert("Error approving tokens");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const mintGarden = async () => {
//     if (!moodGarden || !signer || !gardenNFT || loading) return;
//     setLoading(true);
//     try {
//       const tx = await moodGarden.mintGarden(await signer.getAddress(), { gasLimit: 300000 });
//       const receipt = await tx.wait();

//       // Busca el evento Transfer para obtener el tokenId
//       let mintedTokenId: number | null = null;
//       for (const log of receipt.logs) {
//         try {
//           const parsed = gardenNFT.interface.parseLog(log);
//           if (parsed && parsed.name === "Transfer") {
//             mintedTokenId = parsed.args.tokenId.toNumber();
//             break;
//           }
//         } catch {
//           // Ignore parsing errors for unrelated logs
//         }
//       }
//       setGardenId(mintedTokenId ?? 0);
//       setLevel(0);
//       alert(`Garden minted with AI mood suggestion: ${aiMoodSuggestion}`);
//     } catch (err) {
//       console.error("Error minting garden:", err);
//       alert('Error minting garden');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setGardenMood = async () => {
//     if (!moodGarden || !gardenId || !mood || loading) return;
//     setLoading(true);
//     try {
//       const tx = await moodGarden.setMood(gardenId, mood);
//       await tx.wait();
//       const newMood = await moodGarden.getMood(gardenId);
//       setCurrentMood(newMood);
//       alert('Mood set successfully!');
//     } catch {
//       alert('Error setting mood');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const upgradeGarden = async () => {
//     if (!moodGarden || !gardenId || loading) return;
//     setLoading(true);
//     try {
//       const tx = await moodGarden.upgradeGarden(gardenId);
//       await tx.wait();
//       const newLevel = await moodGarden.getGardenLevel(gardenId);
//       setLevel(newLevel);
//       alert(`Garden upgraded to level ${newLevel}!`);
//     } catch {
//       alert('Error upgrading garden (check token balance)');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerateImage = async () => {
//     setGenerating(true);
//     try {
//       const imageUrl = await generateGardenImageHF(
//         prompt || `a beautiful garden, mood: ${mood || aiMoodSuggestion}`
//       );
//       setGardenImage(imageUrl);
//     } catch (_err) {
//       console.error("Error generating image:", _err);
//       alert("Error generando imagen IA");
//     }
//     setGenerating(false);
//   };

//   console.log({
//     authenticated,
//     signer,
//     moodGarden,
//     petalToken,
//     userAddress,
//     loading
//   });

//   console.log("Prompt:", prompt);

//   return (
//     <div className="container">
//       <h1 className="title">SoulPetals 🌸</h1>
//       <div style={{ marginBottom: 20 }}>
//         {!ready ? (
//           <span>Cargando...</span>
//         ) : !authenticated ? (
//           <button className="button" onClick={login}>
//             Conectar Wallet / Ingresar
//           </button>
//         ) : (
//           <div>
//             <span>Conectado: {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}</span>
//             <button className="button" onClick={logout} style={{ marginLeft: 16 }}>
//               Salir
//             </button>
//           </div>
//         )}
//       </div>
//       {authenticated && (
//         <>
//           <button className="button" onClick={mintGarden} disabled={loading}>
//             {loading ? 'Minting...' : 'Mint a Magical Garden'}
//           </button>
//           {gardenId !== null && (
//             <div className="garden-section">
//               <div className="garden-controls">
//                 <h2>Your Garden (ID: {gardenId})</h2>
//                 <p className="garden-info">Level: {level}</p>
//                 <p className="garden-info">Current Mood: {currentMood || 'Not set'}</p>
//                 <div className="mood-input">
//                   <input
//                     type="text"
//                     value={mood}
//                     onChange={(e) => setMood(e.target.value)}
//                     placeholder={`AI Suggestion: ${aiMoodSuggestion}`}
//                     className="input"
//                     disabled={loading}
//                   />
//                   <button className="button" onClick={setGardenMood} disabled={loading}>
//                     {loading ? 'Setting...' : 'Set Mood'}
//                   </button>
//                 </div>
//                 <button className="button" onClick={approveTokens} disabled={loading}>
//                   {loading ? 'Approving...' : 'Approve Tokens'}
//                 </button>
//                 <button className="button" onClick={upgradeGarden} disabled={loading}>
//                   {loading ? 'Upgrading...' : 'Upgrade Garden'}
//                 </button>
//               </div>
//               <div className="garden-visual">
//                 <div style={{ margin: "20px 0" }}>
//                   <input
//                     className="input"
//                     type="text"
//                     placeholder="Describe tu jardín ideal (opcional)"
//                     value={prompt}
//                     onChange={e => setPrompt(e.target.value)}
//                     disabled={loading || generating}
//                     style={{ width: 300, marginRight: 8 }}
//                   />
//                   <button
//                     className="button"
//                     onClick={handleGenerateImage}
//                     disabled={loading || generating}
//                   >
//                     {generating ? "Generando..." : "Generar Jardín IA"}
//                   </button>
//                 </div>
//                 {gardenImage && (
//                   <div style={{ margin: "20px 0" }}>
//                     <img src={gardenImage} alt="Jardín generado por IA" style={{ maxWidth: 400, borderRadius: 16, border: "4px solid #627eea" }} />
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import petalTokenAbi from './abi/petalTokenAbi.json';
import gardenNftAbi from './abi/gardenNftAbi.json';
import moodGardenAbi from './abi/moodGardenAbi.json';

// Función mock para imágenes fijas
function generateMockGardenImage(mood: string): string {
  const images: Record<string, string> = {
    peaceful: "/peaceful.jpg",
    // Puedes agregar más moods aquí
    default: "/peaceful.jpg",
  };
  return images[mood] || images.default;
}

// Actualiza estas direcciones según tu despliegue
const moodGardenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const petalTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const gardenNftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 

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
  const [level, setLevel] = useState<number>(0);
  const [aiMoodSuggestion, setAiMoodSuggestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState('');
  const [gardenImage, setGardenImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // Obtener signer y dirección desde Privy
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

  // Sugerencia IA de mood
  useEffect(() => {
    const generateAiMoodSuggestion = async (): Promise<string> => {
      const moods = ['peaceful', 'joyful', 'serene', 'vibrant', 'mystical'];
      return moods[Math.floor(Math.random() * moods.length)];
    };
    generateAiMoodSuggestion().then(setAiMoodSuggestion);
  }, []);

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

  const mintGarden = async () => {
    if (!moodGarden || !signer || !gardenNFT || loading) return;
    setLoading(true);
    try {
      const tx = await moodGarden.mintGarden(await signer.getAddress(), { gasLimit: 300000 });
      const receipt = await tx.wait();

      // Busca el evento Transfer para obtener el tokenId
      let mintedTokenId: number | null = null;
      for (const log of receipt.logs) {
        try {
          const parsed = gardenNFT.interface.parseLog(log);
          if (parsed && parsed.name === "Transfer") {
            mintedTokenId = parsed.args.tokenId.toNumber();
            break;
          }
        } catch {
          // Ignore parsing errors for unrelated logs
        }
      }
      setGardenId(mintedTokenId ?? 0);
      setLevel(0);
      alert(`Garden minted with AI mood suggestion: ${aiMoodSuggestion}`);
    } catch (err) {
      console.error("Error minting garden:", err);
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
    } catch {
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
    } catch {
      alert('Error upgrading garden (check token balance)');
    } finally {
      setLoading(false);
    }
  };

  // Usar imagen mock según el mood
  const handleGenerateImage = async () => {
    setGenerating(true);
    try {
      const imageUrl = generateMockGardenImage(mood || "default");
      setGardenImage(imageUrl);
    } catch (_err) {
      console.error("Error generating image:", _err);
      alert("Error generando imagen mock");
    }
    setGenerating(false);
  };

  return (
    <div className="container">
      <h1 className="title">SoulPetals 🌸</h1>
      <div style={{ marginBottom: 20 }}>
        {!ready ? (
          <span>Cargando...</span>
        ) : !authenticated ? (
          <button className="button" onClick={login}>
            Conectar Wallet / Ingresar
          </button>
        ) : (
          <div>
            <span>Conectado: {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}</span>
            <button className="button" onClick={logout} style={{ marginLeft: 16 }}>
              Salir
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
                <div style={{ margin: "20px 0" }}>
                  <input
                    className="input"
                    type="text"
                    placeholder="Describe tu jardín ideal (opcional)"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    disabled={loading || generating}
                    style={{ width: 300, marginRight: 8 }}
                  />
                  <button
                    className="button"
                    onClick={handleGenerateImage}
                    disabled={loading || generating}
                  >
                    {generating ? "Generando..." : "Generar Jardín IA"}
                  </button>
                </div>
                {gardenImage && (
                  <div style={{ margin: "20px 0" }}>
                    <img src={gardenImage} alt="Jardín generado por IA" style={{ maxWidth: 400, borderRadius: 16, border: "4px solid #627eea" }} />
                  </div>
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