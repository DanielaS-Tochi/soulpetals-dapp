import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      width: '100%',
      padding: '20px',
      backgroundColor: 'rgba(230, 230, 250, 0.95)',
      backdropFilter: 'blur(6px)',
      borderTop: '1px solid rgba(98, 126, 234, 0.15)',
      marginTop: 'auto',
      textAlign: 'center',
      fontSize: '0.9em',
      color: '#2D3748'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          {/* Contracts details will be added in future updates */}
          {/* <a 
            href="https://etherscan.io/address/0x..." 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#372944', textDecoration: 'none' }}
          >
            View Contract
          </a> */}
          <a 
            href="https://github.com/danielas-tochi/soulpetals-dapp" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#372944', textDecoration: 'none' }}
          >
            GitHub
          </a>
          {/* Terms and Privacy will be added in future updates */}
          {/* <a href="/terms" style={{ color: '#4A5568', textDecoration: 'none' }}>Terms</a> */}
          {/* <a href="/privacy" style={{ color: '#4A5568', textDecoration: 'none' }}>Privacy</a> */}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px',
          flexWrap: 'wrap',
          marginTop: '10px'
        }}>
          <a 
            href="mailto:danielastochi@gmail.com"
            style={{ color: '#372944', textDecoration: 'none' }}
          >
            danielastochi@gmail.com
          </a>
          <a 
            href="https://www.linkedin.com/in/daniela-silvana-tochi/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#372944', textDecoration: 'none' }}
          >
            LinkedIn
          </a>
        </div>
        
        <div style={{ color: '#372944', fontSize: '1em' }}>
          © 2025 SoulPetals. Developed by Daniela Silvana Tochi. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 