import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../services/socket';
import { roundsAPI, teamsAPI } from '../services/api';

const SpectatorView = () => {
  const [rounds, setRounds] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeRound, setActiveRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    const socket = getSocket();

    socket.on('round:started', (round) => {
      setActiveRound(round);
      setRounds((prev) => prev.map((r) => (r.id === round.id ? round : r)));
    });

    socket.on('round:closed', (round) => {
      if (activeRound && activeRound.id === round.id) {
        setActiveRound(null);
      }
      setRounds((prev) => prev.map((r) => (r.id === round.id ? round : r)));
    });

    socket.on('bid:new', (bid) => {
      if (activeRound && bid.roundId === activeRound.id) {
        setActiveRound((prev) => ({
          ...prev,
          currentPrice: bid.amount,
          bids: [bid, ...(prev.bids || [])]
        }));
      }
    });

    socket.on('round:priceUpdate', ({ roundId, currentPrice }) => {
      if (activeRound && activeRound.id === roundId) {
        setActiveRound((prev) => ({
          ...prev,
          currentPrice
        }));
      }
    });

    socket.on('teams:updated', (updatedTeams) => {
      setTeams(updatedTeams);
    });

    return () => {
      socket.off('round:started');
      socket.off('round:closed');
      socket.off('bid:new');
      socket.off('round:priceUpdate');
      socket.off('teams:updated');
    };
  }, [activeRound]);

  const loadData = async () => {
    try {
      const [roundsRes, teamsRes] = await Promise.all([
        roundsAPI.getAll(),
        teamsAPI.getAll()
      ]);
      
      // Validar que las respuestas sean arrays
      const roundsData = Array.isArray(roundsRes.data) ? roundsRes.data : [];
      const teamsData = Array.isArray(teamsRes.data) ? teamsRes.data : [];
      
      setRounds(roundsData);
      setTeams(teamsData);
      
      const active = roundsData.find((r) => r.status === 'active');
      if (active) {
        const fullRound = await roundsAPI.getById(active.id);
        setActiveRound(fullRound.data);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      // Asegurarse de que los estados siempre sean arrays
      setRounds([]);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-2xl text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      {/* Header */}
      <header className="bg-white bg-opacity-10 backdrop-blur-md text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">🎉 Subasta Camaggi - En Vivo</h1>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Balances de equipos - Destacado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {teams.map((team) => (
            <div
              key={team.id}
              className={`bg-white rounded-2xl shadow-2xl p-8 transform transition hover:scale-105 ${
                team.color === 'blue' ? 'border-4 border-team-blue' : 'border-4 border-team-red'
              }`}
            >
              <h3 className="text-2xl font-bold mb-4">{team.name}</h3>
              <p className="text-5xl font-bold">
                ${parseFloat(team.balance).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Ronda Activa */}
        {activeRound ? (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="mb-6">
                <span className="inline-block px-6 py-3 bg-green-500 text-white rounded-full font-bold text-lg animate-pulse">
                  🔴 EN VIVO
                </span>
                <span className={`ml-3 inline-block px-4 py-2 rounded-full text-base font-semibold ${
                  activeRound.type === 'normal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {activeRound.type === 'normal' ? 'SUBASTA NORMAL' : 'SUBASTA ESPECIAL'}
                </span>
              </div>
              
              <h2 className="text-4xl font-bold mb-4">{activeRound.title}</h2>
              <p className="text-xl text-gray-700 mb-6">{activeRound.description}</p>
              
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-8 mb-6 text-center">
                <p className="text-lg text-gray-700 mb-2">Precio Actual</p>
                <p className="text-7xl font-bold text-green-600">
                  ${activeRound.currentPrice ? parseFloat(activeRound.currentPrice).toFixed(2) : '0.00'}
                </p>
              </div>

              {activeRound.type === 'special' && (
                <div className="text-center mb-6">
                  <p className="text-2xl text-purple-600 font-bold animate-bounce">
                    ⏬ Precio descendiendo...
                  </p>
                </div>
              )}

              {/* Historial de pujas */}
              {activeRound.bids && activeRound.bids.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-2xl font-bold mb-4">📊 Últimas Pujas:</h3>
                  <div className="space-y-3">
                    {activeRound.bids.slice(0, 5).map((bid, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg text-lg ${
                          bid.team.color === 'blue' ? 'bg-blue-100' : 'bg-red-100'
                        }`}
                      >
                        <span className="font-bold">{bid.team.name}</span> -{' '}
                        <span className="text-2xl font-bold">
                          ${parseFloat(bid.amount).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center mb-8">
            <p className="text-3xl text-gray-600">⏳ Esperando próxima ronda...</p>
          </div>
        )}

        {/* Historial de rondas completadas */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">📜 Rondas Completadas</h2>
          <div className="space-y-4">
            {rounds
              .filter((r) => r.status === 'closed')
              .map((round) => (
                <div key={round.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold">{round.title}</h3>
                      {round.winner && (
                        <p className="mt-2 text-lg">
                          🏆 <span className="font-bold">{round.winner.name}</span>
                        </p>
                      )}
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                      ${parseFloat(round.finalPrice || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpectatorView;
