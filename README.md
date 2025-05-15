# SoulPetals 🌸 - Jardines Emocionales en Blockchain

<div align="center">
  
![SoulPetals Logo](https://img.shields.io/badge/SoulPetals-Jardines%20Emocionales-brightgreen?style=for-the-badge&logo=ethereum)

[![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-F9DC3E?style=for-the-badge&logo=ethereum&logoColor=black)](https://hardhat.org/)

</div>

## 📝 Descripción

SoulPetals es una aplicación descentralizada (dApp) que permite a los usuarios crear y nutrir jardines digitales mágicos en la blockchain. Cada jardín refleja las emociones del usuario a través de estados de ánimo personalizables, creciendo y evolucionando a medida que interactúan con él. Construido con Solidity, React, TypeScript y Hardhat, SoulPetals combina la expresión emocional con la tecnología blockchain para crear una experiencia única e inmersiva.

## ✨ Características

- **🌱 Crea tu Jardín**: Mintea tu propio jardín mágico como un NFT usando el contrato MoodGarden.
- **😊 Establece tu Estado de Ánimo**: Elige un estado (alegre, sereno, vibrante) para influir en la apariencia y descripción de tu jardín.
- **🔄 Tokens PETAL**: Utiliza PetalToken para interactuar con tu jardín, aprobando tokens para mejoras.
- **⬆️ Mejora tu Jardín**: Sube de nivel tu jardín, mejorando su crecimiento y apariencia visual.
- **🤖 Descripciones Dinámicas**: El jardín genera descripciones dinámicamente basadas en el estado de ánimo y la entrada del usuario.
- **📱 Diseño Responsivo**: Estilizado con la paleta de colores de Ethereum, toques florales y un diseño adaptable a dispositivos móviles.

## 🛠️ Stack Tecnológico

- **Smart Contracts**: Solidity (Hardhat)
- **Frontend**: React, TypeScript, Viem
- **Estilos**: CSS personalizado con colores inspirados en Ethereum y elementos florales
- **Testing**: Hardhat 
- **Wallet**: MetaMask 

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Hardhat
- Extensión de navegador MetaMask
- Cuenta de Infura 

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

### 6. Desplegar en Sepolia (Opcional)

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

## 📱 Uso

1. **Conectar Wallet**: Haz clic en "Connect Wallet" para vincular MetaMask (local o Sepolia).
2. **Mintear un Jardín**: Crea tu jardín mágico con un estado de ánimo sugerido.
3. **Establecer Estado de Ánimo**: Elige o introduce un estado para ver cómo cambia la descripción y color de tu jardín.
4. **Personalizar Jardín**: Añade una descripción personal para hacer tu jardín único.
5. **Aprobar Tokens**: Aprueba PetalToken para habilitar mejoras.
6. **Mejorar Jardín**: Sube de nivel tu jardín, mejorando su descripción y crecimiento.

## 🎨 Aspectos Destacados del Diseño

- **Paleta Ethereum**: Utiliza colores de Ethereum (#1A2536, #4A90E2, #A0AEC0, etc.) para una estética blockchain.
- **Toques Florales**: Incorpora verde (#2F855A) y rosa floral (#F687B3) para una vibrante sensación de jardín.
- **Visuales Dinámicos**: El fondo del jardín cambia según el estado de ánimo, con descripciones generadas para inmersión.
- **Diseño Responsivo**: Optimizado tanto para dispositivos de escritorio como móviles.

## 🔮 Mejoras Futuras

- **Integración con Chainlink**: Usar Chainlink VRF para sugerencias de estado de ánimo descentralizadas.
- **Visuales Mejorados**: Añadir imágenes dinámicas o animaciones canvas para el jardín.
- **Animaciones**: Introducir transiciones para cambios de estado de ánimo y nivel.

## 🤝 Contribuciones

¡Siéntete libre de hacer fork de este repositorio, enviar issues o crear pull requests! Hagamos florecer SoulPetals juntos 🌸

## 📄 Licencia

MIT License

## 📬 Contacto

Para preguntas o feedback, contactame: danielastochi@gmail.com <img src="../soulpetals-dapp/frontend/public/favicon-16x16.png" /> 
