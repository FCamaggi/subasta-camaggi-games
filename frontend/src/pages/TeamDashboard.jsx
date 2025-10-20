import { useState, useEffect } from 'react';
import { getSocket } from '../services/socket';
import { roundsAPI, bidsAPI } from '../services/api';

const TeamDashboard = ({ user, onLogout }) => {
  const [rounds, setRounds] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeRound, setActiveRound] = useState(null);
  const [myTeam, setMyTeam] = useState(user.data);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);

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

    socket.on('round:priceUpdate', ({ roundId, currentPrice, stopped }) => {
      if (activeRound && activeRound.id === roundId) {
        setActiveRound((prev) => ({
          ...prev,
          currentPrice
        }));
      }
    });

    socket.on('teams:updated', (updatedTeams) => {
      setTeams(updatedTeams);
      const updated = updatedTeams.find((t) => t.id === myTeam.id);
      if (updated) {
        setMyTeam(updated);
      }
    });

    return () => {
      socket.off('round:started');
      socket.off('round:closed');
      socket.off('bid:new');
      socket.off('round:priceUpdate');
      socket.off('teams:updated');
    };
  }, [activeRound, myTeam.id]);

  const loadData = async () => {
    try {
      const [roundsRes, teamsRes] = await Promise.all([
        roundsAPI.getAll(),
        import('../services/api').then(m => m.teamsAPI.getAll())
      ]);
      setRounds(roundsRes.data);
      setTeams(teamsRes.data);
      
      const active = roundsRes.data.find((r) => r.status === 'active');
      if (active) {
        const fullRound = await roundsAPI.getById(active.id);
        setActiveRound(fullRound.data);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBid = () => {
    if (!bidAmount || !activeRound) return;

    const amount = parseFloat(bidAmount);
    const currentPrice = parseFloat(activeRound.currentPrice || activeRound.minPrice);
    const minIncrement = parseFloat(activeRound.minIncrement);
    const minimumBid = currentPrice + minIncrement;

    if (amount < minimumBid) {
      alert(`La puja mínima es $${minimumBid.toFixed(2)}`);
      return;
    }

    if (amount > myTeam.balance) {
      alert('Balance insuficiente');
      return;
    }

    const socket = getSocket();
    socket.emit('team:bid', {
      roundId: activeRound.id,
      teamId: myTeam.id,
      amount,
      clientTimestamp: new Date().toISOString()
    });

    setBidAmount('');
  };

  const handleStop = () => {
    if (!activeRound || activeRound.type !== 'special') return;

    const currentPrice = parseFloat(activeRound.currentPrice);
    if (currentPrice > myTeam.balance) {
      alert('Balance insuficiente para el precio actual');
      return;
    }

    const socket = getSocket();
    socket.emit('team:stop', {
      roundId: activeRound.id,
      teamId: myTeam.id,
      clientTimestamp: new Date().toISOString()
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl">Cargando...</div>
      </div>
    );
  }

  const teamColorClass = myTeam.color === 'blue' ? 'from-blue-500 to-blue-700' : 'from-red-500 to-red-700';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className={`bg-gradient-to-r ${teamColorClass} text-white shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{myTeam.name}</h1>
              <p className="text-xl mt-2">
                💰 Balance: <span className="font-bold">${parseFloat(myTeam.balance).toFixed(2)}</span>
              </p>
            </div>
            <button onClick={onLogout} className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Ronda Activa */}
        {activeRound ? (
          <div className="mb-8">
            <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-400">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-green-500 text-white rounded-full font-bold text-sm">
                  🔴 RONDA ACTIVA
                </span>
                <span className={`ml-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  activeRound.type === 'normal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {activeRound.type === 'normal' ? 'NORMAL' : 'ESPECIAL'}
                </span>
              </div>
              
              <h2 className="text-3xl font-bold mb-2">{activeRound.title}</h2>
              <p className="text-gray-700 mb-4">{activeRound.description}</p>
              
              <div className="bg-white rounded-lg p-6 mb-4">
                <p className="text-sm text-gray-600 mb-1">Precio Actual</p>
                <p className="text-5xl font-bold text-green-600">
                  ${activeRound.currentPrice ? parseFloat(activeRound.currentPrice).toFixed(2) : '0.00'}
                </p>
              </div>

              {activeRound.type === 'normal' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tu Puja</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Mínimo: $${(parseFloat(activeRound.currentPrice || activeRound.minPrice) + parseFloat(activeRound.minIncrement)).toFixed(2)}`}
                        className="input-field flex-1 text-lg"
                        min={parseFloat(activeRound.currentPrice || activeRound.minPrice) + parseFloat(activeRound.minIncrement)}
                        step="0.01"
                      />
                      <button
                        onClick={handleBid}
                        disabled={!bidAmount || parseFloat(bidAmount) < (parseFloat(activeRound.currentPrice || activeRound.minPrice) + parseFloat(activeRound.minIncrement))}
                        className="btn-primary px-8 text-lg"
                      >
                        💰 Pujar
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Incremento mínimo: ${parseFloat(activeRound.minIncrement).toFixed(2)}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg mb-4 text-gray-700">
                    ⏬ El precio desciende cada segundo. ¡Presiona STOP cuando quieras comprar!
                  </p>
                  <button
                    onClick={handleStop}
                    className="btn-danger text-2xl py-6 px-12"
                    disabled={parseFloat(activeRound.currentPrice) > parseFloat(myTeam.balance)}
                  >
                    🛑 STOP
                  </button>
                  {parseFloat(activeRound.currentPrice) > parseFloat(myTeam.balance) && (
                    <p className="text-red-600 mt-2">Balance insuficiente para el precio actual</p>
                  )}
                </div>
              )}

              {/* Historial de pujas */}
              {activeRound.bids && activeRound.bids.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold mb-2">Últimas Pujas:</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {activeRound.bids.slice(0, 5).map((bid, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded ${
                          bid.team.id === myTeam.id ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      >
                        <span className="font-semibold">{bid.team.name}</span> - $
                        {parseFloat(bid.amount).toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card text-center py-12 mb-8">
            <p className="text-2xl text-gray-600">⏳ Esperando que inicie una ronda...</p>
          </div>
        )}

        {/* Balances de equipos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {teams.map((team) => (
            <div
              key={team.id}
              className={`card ${
                team.color === 'blue' ? 'border-l-4 border-team-blue' : 'border-l-4 border-team-red'
              } ${team.id === myTeam.id ? 'ring-2 ring-yellow-400' : ''}`}
            >
              <h3 className="text-xl font-bold mb-2">{team.name}</h3>
              <p className="text-3xl font-bold">
                ${parseFloat(team.balance).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Historial de rondas */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Historial de Rondas</h2>
          <div className="space-y-4">
            {rounds
              .filter((r) => r.status === 'closed')
              .map((round) => (
                <div key={round.id} className="card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{round.title}</h3>
                      {round.winner && (
                        <p className={`mt-2 ${round.winner.id === myTeam.id ? 'text-green-600 font-bold' : 'text-gray-600'}`}>
                          {round.winner.id === myTeam.id ? '🏆 ¡Ganaste!' : `Ganador: ${round.winner.name}`}
                        </p>
                      )}
                    </div>
                    <p className="text-xl font-bold">${parseFloat(round.finalPrice || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
