import { useState, useEffect } from 'react';

const InactivityTimer = ({ roundId, expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = expiresAt - now;

      if (remaining <= 0) {
        setTimeLeft(0);
        return;
      }

      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100); // Actualizar cada 100ms para suavidad

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (timeLeft === null) return null;

  const totalSeconds = Math.ceil(timeLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Colores según el tiempo restante
  let colorClass = 'bg-green-100 text-green-800 border-green-300';
  if (totalSeconds <= 60) {
    colorClass = 'bg-red-100 text-red-800 border-red-300 animate-pulse';
  } else if (totalSeconds <= 120) {
    colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
  }

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${colorClass} font-mono text-lg font-bold`}>
      <span className="text-2xl">⏱️</span>
      <span>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default InactivityTimer;
