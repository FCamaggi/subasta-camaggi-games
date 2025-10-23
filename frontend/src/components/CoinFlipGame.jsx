import { useState, useEffect } from 'react';
import { getSocket } from '../services/socket';

const CoinFlipGame = ({ roundId, teamId, onClose, isPreview = false }) => {
  const [selectedSide, setSelectedSide] = useState(null); // 'heads' o 'tails'
  const [betPoints, setBetPoints] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [hasFlipped, setHasFlipped] = useState(false);
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [checkingUsage, setCheckingUsage] = useState(!isPreview);

  useEffect(() => {
    if (isPreview || !teamId || !roundId) {
      setCheckingUsage(false);
      return;
    }

    const socket = getSocket();

    // Verificar si ya se usó este minijuego
    socket.emit('minigame:checkUsage', { roundId, teamId });

    socket.on('minigame:usageStatus', (data) => {
      if (data.roundId === roundId && data.teamId === teamId) {
        setAlreadyUsed(data.hasUsed);
        setCheckingUsage(false);
      }
    });

    return () => {
      socket.off('minigame:usageStatus');
    };
  }, [roundId, teamId, isPreview]);

  const handleFlip = () => {
    if (!selectedSide || betPoints <= 0 || betPoints > 15) {
      alert('Por favor selecciona cara o sello y apuesta entre 1 y 15 puntos');
      return;
    }

    setIsFlipping(true);
    
    // Simular el lanzamiento de la moneda con animación más larga
    setTimeout(() => {
      const coinResult = Math.random() < 0.5 ? 'heads' : 'tails';
      const won = coinResult === selectedSide;
      
      const resultData = {
        side: coinResult,
        won: won,
        pointsWon: won ? betPoints : -betPoints,
        selectedSide,
        betPoints
      };
      
      setResult(resultData);
      setIsFlipping(false);
      setHasFlipped(true);

      // Registrar el uso del minijuego (solo si no es preview)
      if (!isPreview && teamId && roundId) {
        const socket = getSocket();
        socket.emit('minigame:registerUsage', {
          roundId,
          teamId,
          minigameType: 'coinflip',
          result: resultData
        });
      }
    }, 3000); // 3 segundos de animación
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">🪙 Cara y Sello</h2>
          <p className="text-gray-600">{isPreview ? 'Vista Previa - Modo de Prueba' : 'Apuesta y duplica tus puntos'}</p>
        </div>

        {checkingUsage ? (
          <div className="text-center py-8">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Verificando...</p>
          </div>
        ) : alreadyUsed && !isPreview ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🚫</div>
            <p className="text-xl font-bold text-red-600 mb-4">Ya usaste este minijuego</p>
            <p className="text-gray-600 mb-6">Solo puedes usar el Cara y Sello una vez por ronda ganada</p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
            >
              Cerrar
            </button>
          </div>
        ) : !hasFlipped ? (
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

            {/* Animación de moneda girando */}
            {isFlipping && (
              <div className="mb-6 flex justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '0.5s' }}>
                    <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-6xl shadow-2xl">
                      🪙
                    </div>
                  </div>
                </div>
              </div>
            )}

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
            {!isPreview && (
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-yellow-800 text-center">
                  📸 Por favor toma una captura de pantalla o foto de este resultado y envíasela al host
                </p>
              </div>
            )}

            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
            >
              Cerrar
            </button>
          </>
        )}

        {!hasFlipped && !checkingUsage && (!alreadyUsed || isPreview) && (
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
