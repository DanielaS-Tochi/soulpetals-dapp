import React, { useEffect, useState } from 'react';

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

  return (
    <div className="petal-rain">
      {[...Array(10)].map((_, i) => (
        <div className="petal" key={i}></div>
      ))}
    </div>
  );
};

export default PetalRain; 