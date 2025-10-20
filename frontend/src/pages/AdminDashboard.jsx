import { useState, useEffect } from 'react';
import { getSocket } from '../services/socket';
import { roundsAPI } from '../services/api';

const AdminDashboard = ({ user, onLogout }) => {
  const [rounds, setRounds] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const socket = getSocket();

    socket.on('round:started', (round) => {
      setRounds((prev) => prev.map((r) => (r.id === round.id ? round : r)));
    });

    socket.on('round:closed', (round) => {
      setRounds((prev) => prev.map((r) => (r.id === round.id ? round : r)));
    });

    socket.on('teams:updated', (updatedTeams) => {
      setTeams(updatedTeams);
    });

    return () => {
      socket.off('round:started');
      socket.off('round:closed');
      socket.off('teams:updated');
    };
  }, []);

  const loadData = async () => {
    try {
      const [roundsRes, teamsRes] = await Promise.all([
        roundsAPI.getAll(),
        import('../services/api').then(m => m.teamsAPI.getAll())
      ]);
      setRounds(roundsRes.data);
      setTeams(teamsRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartRound = (roundId) => {
    const socket = getSocket();
    socket.emit('admin:startRound', {
      roundId,
      token: user.token
    });
  };

  const handleCloseRound = (roundId) => {
    const socket = getSocket();
    socket.emit('admin:closeRound', { roundId });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            ⚙️ Panel de Administración
          </h1>
          <button onClick={onLogout} className="btn-secondary">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Balances de Equipos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {teams.map((team) => (
            <div
              key={team.id}
              className={`card ${
                team.color === 'blue' ? 'border-l-4 border-team-blue' : 'border-l-4 border-team-red'
              }`}
            >
              <h3 className="text-xl font-bold mb-2">{team.name}</h3>
              <p className="text-3xl font-bold">
                ${parseFloat(team.balance).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Botón crear ronda */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? 'Cancelar' : '+ Nueva Ronda'}
          </button>
        </div>

        {/* Formulario crear ronda */}
        {showCreateForm && <CreateRoundForm onCreated={loadData} onCancel={() => setShowCreateForm(false)} />}

        {/* Lista de rondas */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Rondas</h2>
          {rounds.map((round) => (
            <RoundCard
              key={round.id}
              round={round}
              onStart={handleStartRound}
              onClose={handleCloseRound}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const RoundCard = ({ round, onStart, onClose }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{round.title}</h3>
          <p className="text-gray-600">{round.description}</p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${statusColors[round.status]}`}>
            {round.status.toUpperCase()}
          </span>
          <span className={`ml-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
            round.type === 'normal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          }`}>
            {round.type === 'normal' ? 'NORMAL' : 'ESPECIAL'}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Precio Actual</p>
          <p className="text-2xl font-bold">
            ${round.currentPrice ? parseFloat(round.currentPrice).toFixed(2) : parseFloat(round.minPrice).toFixed(2)}
          </p>
        </div>
      </div>

      {round.winner && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="font-semibold">
            🏆 Ganador: {round.winner.name} - ${parseFloat(round.finalPrice).toFixed(2)}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {round.status === 'pending' && (
          <button
            onClick={() => onStart(round.id)}
            className="btn-success"
          >
            ▶️ Iniciar Ronda
          </button>
        )}
        {round.status === 'active' && (
          <button
            onClick={() => onClose(round.id)}
            className="btn-danger"
          >
            ⏹️ Cerrar Ronda
          </button>
        )}
      </div>
    </div>
  );
};

const CreateRoundForm = ({ onCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'normal',
    minPrice: 100,
    minIncrement: 50,
    startingPrice: 2000,
    priceDecrement: 50,
    decrementInterval: 1000,
    order: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await roundsAPI.create(formData);
      onCreated();
      onCancel();
    } catch (error) {
      alert('Error creando ronda: ' + error.message);
    }
  };

  return (
    <div className="card mb-6">
      <h3 className="text-xl font-bold mb-4">Nueva Ronda</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
            rows="3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="input-field"
          >
            <option value="normal">Normal</option>
            <option value="special">Especial</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio Mínimo</label>
            <input
              type="number"
              value={formData.minPrice}
              onChange={(e) => setFormData({ ...formData, minPrice: parseFloat(e.target.value) })}
              className="input-field"
              required
            />
          </div>
          {formData.type === 'normal' ? (
            <div>
              <label className="block text-sm font-medium mb-1">Incremento Mínimo</label>
              <input
                type="number"
                value={formData.minIncrement}
                onChange={(e) => setFormData({ ...formData, minIncrement: parseFloat(e.target.value) })}
                className="input-field"
                required
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Precio Inicial</label>
                <input
                  type="number"
                  value={formData.startingPrice}
                  onChange={(e) => setFormData({ ...formData, startingPrice: parseFloat(e.target.value) })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Decremento</label>
                <input
                  type="number"
                  value={formData.priceDecrement}
                  onChange={(e) => setFormData({ ...formData, priceDecrement: parseFloat(e.target.value) })}
                  className="input-field"
                  required
                />
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            Crear Ronda
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;
