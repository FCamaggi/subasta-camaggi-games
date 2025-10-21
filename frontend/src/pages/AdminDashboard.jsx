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
    console.log('⚙️ AdminDashboard - Configurando listeners de socket');
    loadData();
    const socket = getSocket();

    socket.on('round:started', (round) => {
      console.log('🎬 AdminDashboard - Ronda iniciada:', round);
      setRounds((prev) => prev.map((r) => (r.id === round.id ? round : r)));
    });

    socket.on('round:closed', (round) => {
      console.log('🏁 AdminDashboard - Ronda cerrada:', round);
      setRounds((prev) => prev.map((r) => (r.id === round.id ? round : r)));
    });

    socket.on('bid:new', (bid) => {
      console.log('💰 AdminDashboard - Nueva puja recibida:', bid);
      // Actualizar el precio actual de la ronda
      setRounds((prev) => prev.map((r) => 
        r.id === bid.roundId 
          ? { ...r, currentPrice: bid.amount }
          : r
      ));
    });

    socket.on('round:priceUpdate', ({ roundId, currentPrice }) => {
      console.log('💲 AdminDashboard - Actualización de precio:', { roundId, currentPrice });
      setRounds((prev) => prev.map((r) => 
        r.id === roundId 
          ? { ...r, currentPrice }
          : r
      ));
    });

    socket.on('teams:updated', (updatedTeams) => {
      console.log('🎯 AdminDashboard - Teams actualizados:', updatedTeams);
      setTeams(updatedTeams);
    });

    socket.on('round:autoCloseNotification', ({ roundId, reason, message }) => {
      console.log('⏰ AdminDashboard - Notificación de auto-cierre:', { roundId, reason, message });
      // Mostrar notificación visual (puedes agregar un toast aquí)
      alert(message);
    });

    return () => {
      console.log('⚙️ AdminDashboard - Limpiando listeners');
      socket.off('round:started');
      socket.off('round:closed');
      socket.off('bid:new');
      socket.off('round:priceUpdate');
      socket.off('teams:updated');
      socket.off('round:autoCloseNotification');
    };
  }, []);

  const loadData = async () => {
    try {
      const [roundsRes, teamsRes] = await Promise.all([
        roundsAPI.getAll(),
        import('../services/api').then(m => m.teamsAPI.getAll())
      ]);
      
      console.log('🔍 AdminDashboard - roundsRes:', roundsRes);
      console.log('🔍 AdminDashboard - teamsRes:', teamsRes);
      console.log('🔍 AdminDashboard - roundsRes.data:', roundsRes.data);
      console.log('🔍 AdminDashboard - teamsRes.data:', teamsRes.data);
      
      // Validar que las respuestas sean arrays
      const roundsData = Array.isArray(roundsRes.data) ? roundsRes.data : [];
      const teamsData = Array.isArray(teamsRes.data) ? teamsRes.data : [];
      
      console.log('✅ AdminDashboard - roundsData length:', roundsData.length);
      console.log('✅ AdminDashboard - teamsData length:', teamsData.length);
      
      setRounds(roundsData);
      setTeams(teamsData);
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      setRounds([]);
      setTeams([]);
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
              onEdit={loadData}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const RoundCard = ({ round, onStart, onClose, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  if (isEditing) {
    return <EditRoundForm round={round} onSaved={() => { setIsEditing(false); onEdit(); }} onCancel={() => setIsEditing(false)} />;
  }

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
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ✏️ Editar
            </button>
            <button
              onClick={() => onStart(round.id)}
              className="btn-success"
            >
              ▶️ Iniciar Ronda
            </button>
          </>
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

const EditRoundForm = ({ round, onSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    title: round.title || '',
    description: round.description || '',
    type: round.type || 'normal',
    minPrice: round.minPrice || 100,
    minIncrement: round.minIncrement || 50,
    startingPrice: round.startingPrice || 1000,
    priceDecrement: round.priceDecrement || 50,
    decrementInterval: round.decrementInterval || 1000
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await roundsAPI.update(round.id, formData);
      onSaved();
    } catch (error) {
      alert('Error actualizando ronda: ' + error.message);
    }
  };

  return (
    <div className="card mb-6 border-2 border-blue-500">
      <h3 className="text-xl font-bold mb-4">✏️ Editar Ronda</h3>
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
            disabled
          >
            <option value="normal">Normal</option>
            <option value="special">Especial</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">El tipo no se puede cambiar después de crear la ronda</p>
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
                <label className="block text-sm font-medium mb-1">Decremento por segundo</label>
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
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            💾 Guardar Cambios
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;
