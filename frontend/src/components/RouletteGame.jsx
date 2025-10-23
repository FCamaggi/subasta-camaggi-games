import { useState } from 'react';

const RouletteGame = ({ roundId, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);

    // Items de las rondas 1-7 (normales anteriores)
  const items = [
    { id: 1, title: 'Mano de Host', emoji: '🤝', color: 'bg-blue-400' },
    { id: 2, title: 'Doble [Filo]', emoji: '⚔️', color: 'bg-purple-400' },
    { id: 3, title: 'Mistery Box', emoji: '🎁', color: 'bg-pink-400' },
    { id: 4, title: 'Roba turno', emoji: '🔄', color: 'bg-green-400' },
    { id: 6, title: '"7"', emoji: '7️⃣', color: 'bg-yellow-400' },
    { id: 7, title: 'Attention Pickpocket', emoji: '💰', color: 'bg-red-400' }
  ];

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    
    // Seleccionar item aleatorio después de 3 segundos
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * items.length);
      setResult(items[randomIndex]);
      setIsSpinning(false);
      setHasSpun(true);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">🎡 Ruleta de Items</h2>
          <p className="text-gray-600">Gira la ruleta y gana un item</p>
        </div>

        {!hasSpun ? (
          <>
            {/* Items disponibles */}
            <div className="mb-8">
              <p className="text-center text-sm text-gray-600 mb-4">Items disponibles:</p>
              <div className="grid grid-cols-5 gap-3">
                {items.map((item) => (
                  <div key={item.id} className={`text-center p-3 rounded-lg border-2 transition-all ${
                    isSpinning ? 'animate-pulse border-purple-400 bg-purple-50' : 'border-gray-300'
                  }`}>
                    <div className="text-3xl mb-1">{item.emoji}</div>
                    <div className="text-xs font-semibold">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Animación de ruleta */}
            {isSpinning && (
              <div className="mb-6 text-center">
                <div className="inline-block text-8xl animate-spin">🎯</div>
                <p className="mt-4 text-xl font-bold text-purple-600 animate-pulse">
                  Girando la ruleta...
                </p>
              </div>
            )}

            {/* Botón de girar */}
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full py-4 rounded-lg font-bold text-white text-lg transition-all ${
                isSpinning
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105'
              }`}
            >
              {isSpinning ? '🎡 Girando...' : '🚀 ¡GIRAR RULETA!'}
            </button>
          </>
        ) : (
          <>
            {/* Resultado */}
            <div className="text-center p-8 rounded-lg mb-6 bg-gradient-to-r from-green-400 to-blue-400">
              <div className="text-8xl mb-4">{result.emoji}</div>
              <div className="text-3xl font-bold text-white mb-2">
                ¡GANASTE!
              </div>
              <div className="text-2xl font-bold text-white">
                {result.title}
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

        {!hasSpun && !isSpinning && (
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

export default RouletteGame;
