import { createRoot } from 'react-dom/client';
import './index.css'; // Nota: Cambia a App.css si usas ese archivo
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <App />
);
