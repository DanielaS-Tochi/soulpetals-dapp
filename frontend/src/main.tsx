import { createRoot } from 'react-dom/client';
import './App.css'; // O './index.css' si prefieres
import App from './App';
import { PrivyProvider } from '@privy-io/react-auth';

createRoot(document.getElementById('root')!).render(
  <PrivyProvider
    appId="cmapy7ymw00a4l80nx0nt82c5"
    config={{
      appearance: {
        theme: "light",
        accentColor: "#4A90E2", // Ethereum blue
      },
      embeddedWallets: {
        createOnLogin: "users-without-wallets",
      },
    }}
  >
    <App />
  </PrivyProvider>
);
