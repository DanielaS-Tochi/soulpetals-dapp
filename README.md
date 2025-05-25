<div align="center">
  <img src="frontend/public/images/sp-logo.jpeg" alt="SoulPetals Logo" width="80" height="80" style="border-radius: 50%; object-fit: cover; display: block; margin: 0 auto;" />
</div>

<div align="center">
  <h1>SoulPetals</h1> 
  <h2>Jardines Emocionales en Blockchain</h2>
</div>

<div align="center">
  
![SoulPetals Logo](https://img.shields.io/badge/SoulPetals-Jardines%20Emocionales-brightgreen?style=for-the-badge&logo=ethereum)

[![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-F9DC3E?style=for-the-badge&logo=ethereum&logoColor=black)](https://hardhat.org/)
[![ethers.js](https://img.shields.io/badge/ethers.js-5C6BC0?style=for-the-badge&logo=ethereum&logoColor=white)](https://docs.ethers.org/)
[![Privy](https://img.shields.io/badge/Privy-4A90E2?style=for-the-badge)](https://privy.io/)
</div>


## 📝 Descripción

SoulPetals es una aplicación descentralizada (dApp) que permite a los usuarios crear y nutrir jardines digitales mágicos en la blockchain.
Cada jardín refleja las emociones del usuario a través de estados de ánimo personalizables y una imagen creativa generada para cada mood.
Construido con Solidity, React, TypeScript, ethers.js, Hardhat y Privy, SoulPetals combina la expresión emocional con la tecnología blockchain para crear una experiencia única e inmersiva.

Actualmente, los jardines pueden ser minteados como NFT, personalizados con un estado de ánimo y compartidos o transferidos a otros usuarios.
En futuras versiones, los jardines podrán crecer y evolucionar, y la generación de imágenes será potenciada por IA real.

## ✨ Características

- **🌱 Crea tu Jardín**: Mintea tu propio jardín mágico como un NFT usando el contrato MoodGarden.
- **😊 Establece tu Estado de Ánimo**: Elige un estado de ánimo (mood: peaceful, serene, vibrant, etc.) para influir en la apariencia y descripción de tu jardín.
- **🖼️ Visualización de Jardín**: Actualmente, la visualización del jardín se realiza mediante imágenes fijas precargadas según el estado de ánimo seleccionado.
- **Tokens PETAL**: Recibe tokens PETAL como recompensa diaria por interactuar con tu jardín.
- **📱 Diseño Responsivo**: Estilizado con la paleta de colores de Ethereum, toques florales y un diseño adaptable a dispositivos móviles.

> **Nota:** La integración con IA para generación dinámica de imágenes está planificada como mejora futura. Por ahora, las imágenes se muestran según el mood elegido y las imágenes precargadas.

## 🛠️ Stack Tecnológico

- **Smart Contracts**: Solidity (Hardhat) - ERC721 - ERC20 (OpenZepellin)
  - GardenNFT.sol: Implementa ERC721URIStorage para manejar metadatos de NFTs
  - MoodGarden.sol: Gestiona estados de ánimo, recompensas diarias y URIs para diferentes niveles
  - PetalToken.sol: Token ERC20 para recompensas y futuras interacciones
- **Frontend**: React, TypeScript, ethers.js
- **Estilos**: CSS personalizado con colores inspirados en Ethereum y elementos florales
- **Testing**: Hardhat 
- **Wallet**: MetaMask y Privy

## Acceso y autenticación

Puedes acceder a SoulPetals de dos maneras:
- **Email o Google**: Privy te crea automáticamente una wallet embebida segura si no tienes una.
- **Wallet externa**: También puedes conectar MetaMask u otra wallet compatible si lo prefieres.

No es obligatorio tener MetaMask para usar la dApp: puedes operar solo con tu email y la wallet generada por Privy.

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Hardhat
- Extensión de navegador MetaMask
- Cuenta de Infura (solo para despliegue en testnet)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/danielas-tochi/soulpetals-dapp.git
cd soulpetals-dapp
```

### 2. Instalar Dependencias

```bash
npm install
cd frontend
npm install
```

### 3. Ejecutar Nodo Hardhat (Pruebas Locales)

En el directorio raíz:

```bash
npx hardhat node
```

### 4. Desplegar Contratos Localmente

En una nueva terminal:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

Anota las direcciones de PetalToken y MoodGarden de la salida de la consola.
Actualiza `frontend/src/App.tsx` con estas direcciones:

```typescript
const moodGardenAddress = "TU_DIRECCIÓN_MOODGARDEN";
const petalTokenAddress = "TU_DIRECCIÓN_PETALTOKEN";
```

### 5. Ejecutar el Frontend

```bash
cd frontend
npm run dev
```

Abre http://localhost:5173 en tu navegador para interactuar con la dApp.

### 6. Ejecutar Tests de Contratos

Desde la raíz del proyecto:

```bash
npx hardhat test
```

Esto ejecutará los tests ubicados en la carpeta `test/`.

### 7. Desplegar en Sepolia (Opcional)

Para desplegar en la testnet Sepolia para integración con MetaMask:

Configura `hardhat.config.ts` con tu URL de Infura y clave privada:

```typescript
networks: {
  sepolia: {
    url: "https://sepolia.infura.io/v3/TU_ID_PROYECTO_INFURA",
    accounts: ["TU_CLAVE_PRIVADA"],
  },
}
```

Obtén ETH de Sepolia desde un faucet (ej. https://sepoliafaucet.com/).

Despliega:
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

Actualiza `App.tsx` con las nuevas direcciones de contratos.
Asegúrate de que MetaMask esté configurado en la red Sepolia y conecta tu wallet.

## Contratos Desplegados

### Sepolia Testnet
- MoodGarden: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- GardenNFT: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- PetalToken: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`

### Mainnet
- Pendiente de despliegue

## Verificación en Etherscan

1. Busca los contratos en [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. Verifica las transacciones con tu dirección
3. Revisa el historial de NFTs en MetaMask

##  Uso

1. **Conectar Wallet**: Haz clic en "Connect Wallet" para vincular MetaMask (local o Sepolia).
2. **Mintear un Jardín**: Crea tu jardín mágico como NFT.
3. **Setear Mood**: Elige un mood sugerido o escribe el tuyo.
4. **Generar Jardín**: (Opcional) Describe tu jardín ideal y genera la imagen (en este momento, se muestra una imagen precargada).
5. **Cambiar mood**: Comienza desde cero con un mood nuevo.
6. **Transferir tu Jardín como NFT**: Comparte tu jardín transfiriendo tu NFT a otra dirección.

## 🎨 Aspectos Destacados del Diseño

- **Paleta Ethereum**: Utiliza colores de Ethereum (#1A2536, #4A90E2, #A0AEC0, etc.) para una estética blockchain.
- **Toques Florales**: Incorpora verde (#2F855A) y rosa floral (#F687B3) para una vibrante sensación de jardín.
- **Diseño Responsivo**: Optimizado tanto para dispositivos de escritorio como móviles.

## 🔮 Mejoras Futuras

- **Integración con Chainlink**: Usar Chainlink VRF para sugerencias de estado de ánimo descentralizadas.
- **Imágenes**: Integrar generación de imágenes IA real.
- **Tokens PETAL**: Utiliza PetalToken para interactuar con tu jardín, aprobando tokens para mejoras.
- **Mejora tu Jardín**: Sube de nivel tu jardín, mejorando su crecimiento y apariencia visual.
- **UX/UI**: Mejorar la experiencia móvil.
- **Funcionalidades sociales**: Agregar perfil de usuario y galería de jardines.
- **Red social de jardines:** Permitir a los usuarios compartir, explorar, dar "like" y comentar jardines en un feed público.

## 🤝 Contribuciones

¡Siéntete libre de hacer fork de este repositorio, enviar issues o crear pull requests! Hagamos florecer SoulPetals juntos 🌸

## 📄 Licencia

MIT License

## 📬 Contacto

Para preguntas o feedback, contactame: danielastochi@gmail.com <img src="images/daniela-silvana-tochi.jpg" alt="Daniela logo" width="30"/>

## 🔗 Enlaces

- [Despliegue en Vercel](PROXIMAMENTE)
- [Presentación del Proyecto](./presentation/SoulPetals_Presentacion.pptx)
- [Pitch Deck](http://bit.ly/3GZq8cs)

## 🤖 Contribuidores y Asistentes de IA

- **Daniela Silvana Tochi** - Desarrollo principal y diseño
- **Claude 3.7 Sonnet** - Asistencia en desarrollo, debugging y documentación
- **VSC GitHub Copilot** - Soporte en desarrollo de código y optimización
- **Cursor IDE** - Asistencia en desarrollo y refactorización
- **Grok** - Contribuciones en análisis de código y sugerencias de mejora
- **Windsurf** - IDE and ChatGPT 4.1

## 🌟 Agradecimientos Especiales

Este proyecto fue desarrollado como parte del programa Núcleo. Agradezco especialmente a:
- **Profesor Rafa** - Por su guía y mentoría en el desarrollo de proyectos blockchain
- **Solange** - Por su apoyo y coordinación en el programa
- **Programa Núcleo Odisea** - Por brindar las herramientas y el espacio para desarrollar este proyecto
