import { useState } from 'react';

const CoinFlipGame = ({ roundId, onClose }) => {
  const [selectedSide, setSelectedSide] = useState(null); // 'heads' o 'tails'
  const [betPoints, setBetPoints] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [hasFlipped, setHasFlipped] = useState(false);

  const handleFlip = () => {
    if (!selectedSide || betPoints <= 0 || betPoints > 15) {
      alert('Por favor selecciona cara o sello y apuesta entre 1 y 15 puntos');
      return;
    }

    setIsFlipping(true);
    
    // Simular el lanzamiento de la moneda
    setTimeout(() => {
      const coinResult = Math.random() < 0.5 ? 'heads' : 'tails';
      const won = coinResult === selectedSide;
      
      setResult({
        side: coinResult,
        won: won,
        pointsWon: won ? betPoints : -betPoints
      });
      setIsFlipping(false);
      setHasFlipped(true);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">🪙 Cara y Sello</h2>
          <p className="text-gray-600">Apuesta y duplica tus puntos</p>
        </div>

        {!hasFlipped ? (
          <>
            {/* Selector de lado */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Elige tu lado:
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedSide('heads')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    selectedSide === 'heads'
                      ? 'border-blue-500 bg-blue-50 scale-105'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="text-4xl mb-2">🙂</div>
                  <div className="font-semibold">CARA</div>
                </button>
                <button
                  onClick={() => setSelectedSide('tails')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    selectedSide === 'tails'
                      ? 'border-purple-500 bg-purple-50 scale-105'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <div className="text-4xl mb-2">🔢</div>
                  <div className="font-semibold">SELLO</div>
                </button>
              </div>
            </div>

            {/* Selector de puntos */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Puntos a apostar (0-15):
              </label>
              <input
                type="number"
                min="0"
                max="15"
                value={betPoints}
                onChange={(e) => setBetPoints(Math.min(15, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <div className="mt-2 text-sm text-gray-600 text-center">
                Si ganas: <span className="font-bold text-green-600">+{betPoints} puntos</span> | 
                Si pierdes: <span className="font-bold text-red-600">-{betPoints} puntos</span>
              </div>
            </div>

            {/* Botón de lanzar */}
            <button
              onClick={handleFlip}
              disabled={isFlipping || !selectedSide || betPoints <= 0}
              className={`w-full py-4 rounded-lg font-bold text-white text-lg transition-all ${
                isFlipping || !selectedSide || betPoints <= 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105'
              }`}
            >
              {isFlipping ? '🪙 Lanzando moneda...' : '🚀 ¡LANZAR MONEDA!'}
            </button>
          </>
        ) : (
          <>
            {/* Resultado */}
            <div className={`text-center p-6 rounded-lg mb-6 ${
              result.won ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <div className="text-6xl mb-4">
                {result.side === 'heads' ? '🙂' : '🔢'}
              </div>
              <div className="text-2xl font-bold mb-2">
                Salió: {result.side === 'heads' ? 'CARA' : 'SELLO'}
              </div>
              <div className={`text-3xl font-bold ${
                result.won ? 'text-green-600' : 'text-red-600'
              }`}>
                {result.won ? `¡GANASTE! +${result.pointsWon} puntos` : `Perdiste ${Math.abs(result.pointsWon)} puntos`}
              </div>
            </div>

            {/* Instrucciones */}
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-yellow-800 text-center">
                📸 Por favor toma una captura de pantalla o foto de este resultado y envíasela al host
              </p>
            </div>

            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
            >
              Cerrar
            </button>
          </>
        )}

        {!hasFlipped && (
          <button
            onClick={onClose}
            className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 font-semibold"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};

export default CoinFlipGame;
