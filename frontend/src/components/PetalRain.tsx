import React, { useEffect, useState } from 'react';
import { IoFlowerSharp } from "react-icons/io5";

interface PetalRainProps {
  duration?: number; // duración en milisegundos
}

const PetalRain: React.FC<PetalRainProps> = ({ duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  // Función para generar colores más variados
  const getRandomColor = () => {
    const colors = [
      `hsl(${Math.random() * 60 + 300}, 70%, 60%)`, // Rosas/Púrpuras
      `hsl(${Math.random() * 60 + 120}, 70%, 60%)`, // Verdes
      `hsl(${Math.random() * 60 + 180}, 70%, 60%)`, // Azules
      `hsl(${Math.random() * 60 + 0}, 70%, 60%)`,   // Rojos/Naranjas
      `hsl(${Math.random() * 60 + 60}, 70%, 60%)`,  // Amarillos
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="petal-rain">
      {[...Array(60)].map((_, i) => (
        <div 
          className="petal" 
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            color: getRandomColor(),
            fontSize: `${Math.random() * 20 + 20}px`, // Tamaño entre 20px y 40px
            opacity: 0.7,
            animationDuration: `${Math.random() * 3 + 7}s` // Duración entre 7s y 10s
          }}
        >
          <IoFlowerSharp />
        </div>
      ))}
    </div>
  );
};

export default PetalRain; 