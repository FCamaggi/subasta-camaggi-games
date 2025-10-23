import { useState, useEffect } from 'react';

const PresentationTimer = ({ roundId, presentationEndsAt }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!presentationEndsAt) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = presentationEndsAt - now;

      if (remaining <= 0) {
        setTimeLeft(0);
        return;
      }

      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [presentationEndsAt]);

  if (timeLeft === null || timeLeft === 0) return null;

  const totalSeconds = Math.ceil(timeLeft / 1000);

  return (
    <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mb-4 text-center animate-pulse">
      <div className="flex items-center justify-center gap-3">
        <span className="text-4xl">🎬</span>
        <div>
          <p className="text-lg font-bold text-yellow-800">
            Presentando el Item
          </p>
          <p className="text-2xl font-mono font-bold text-yellow-900">
            {totalSeconds}s
          </p>
          <p className="text-sm text-yellow-700">
            Las pujas estarán disponibles cuando termine la presentación
          </p>
        </div>
      </div>
    </div>
  );
};

export default PresentationTimer;
