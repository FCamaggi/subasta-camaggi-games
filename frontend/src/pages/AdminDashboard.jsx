import { useState, useEffect } from 'react';
import { getSocket } from '../services/socket';
import { roundsAPI } from '../services/api';
import InactivityTimer from '../components/InactivityTimer';
import PresentationTimer from '../components/PresentationTimer';
import CoinFlipGame from '../components/CoinFlipGame';
import RouletteGame from '../components/RouletteGame';

const AdminDashboard = ({ user, onLogout }) => {
  const [rounds, setRounds] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roundTimers, setRoundTimers] = useState({}); // { roundId: expiresAt }
  const [presentationTimers, setPresentationTimers] = useState({}); // { roundId: presentationEndsAt }
  const [showTimeoutConfig, setShowTimeoutConfig] = useState(false);
  const [newTimeout, setNewTimeout] = useState(5); // minutos
  const [showPreviewGame, setShowPreviewGame] = useState(null); // 'coinflip' o 'roulette'

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

    socket.on('round:timerUpdate', ({ roundId, expiresAt }) => {
      console.log('⏱️ AdminDashboard - Timer actualizado:', { roundId, expiresAt });
      setRoundTimers((prev) => ({ ...prev, [roundId]: expiresAt }));
    });

    socket.on('round:timerCancelled', ({ roundId }) => {
      console.log('⏱️ AdminDashboard - Timer cancelado:', { roundId });
      setRoundTimers((prev) => {
        const newTimers = { ...prev };
        delete newTimers[roundId];
        return newTimers;
      });
    });

    socket.on('round:presentationStarted', ({ roundId, presentationEndsAt }) => {
      console.log('🎬 AdminDashboard - Presentación iniciada:', { roundId, presentationEndsAt });
      setPresentationTimers((prev) => ({ ...prev, [roundId]: presentationEndsAt }));
    });

    socket.on('round:presentationEnded', ({ roundId }) => {
      console.log('🎬 AdminDashboard - Presentación finalizada:', { roundId });
      setPresentationTimers((prev) => {
        const newTimers = { ...prev };
        delete newTimers[roundId];
        return newTimers;
      });
    });

    socket.on('config:timeoutUpdated', ({ minutes }) => {
      console.log('⚙️ AdminDashboard - Timeout actualizado:', minutes);
      setNewTimeout(minutes);
      alert(`Timeout de auto-cierre actualizado a ${minutes} minutos`);
    });

    socket.on('round:stealMoney', (data) => {
      console.log('💰 AdminDashboard - Robo de dinero ejecutado:', data);
      alert(`🎯 Automatización: ${data.message}`);
    });

    return () => {
      console.log('⚙️ AdminDashboard - Limpiando listeners');
      socket.off('round:started');
      socket.off('round:closed');
      socket.off('bid:new');
      socket.off('round:priceUpdate');
      socket.off('teams:updated');
      socket.off('round:autoCloseNotification');
      socket.off('round:timerUpdate');
      socket.off('round:timerCancelled');
      socket.off('round:presentationStarted');
      socket.off('round:presentationEnded');
      socket.off('config:timeoutUpdated');
      socket.off('round:stealMoney');
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

  const handleUpdateBalance = async (teamId) => {
    const input = document.getElementById(`balance-${teamId}`);
    const newBalance = parseFloat(input.value);
    
    if (isNaN(newBalance) || newBalance < 0) {
      alert('Por favor ingresa un valor válido');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teams/${teamId}/balance`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ balance: newBalance })
      });

      if (response.ok) {
        input.value = '';
        loadData(); // Recargar datos
        alert(`Balance actualizado a $${newBalance.toFixed(2)}`);
      } else {
        alert('Error al actualizar balance');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar balance');
    }
  };

  const handleAdjustBalance = async (teamId, amount) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const newBalance = Math.max(0, parseFloat(team.balance) + amount);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teams/${teamId}/balance`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ balance: newBalance })
      });

      if (response.ok) {
        loadData(); // Recargar datos
      } else {
        alert('Error al ajustar balance');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al ajustar balance');
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

  const handleChangeTimeout = () => {
    const socket = getSocket();
    socket.emit('admin:setInactivityTimeout', {
      minutes: parseFloat(newTimeout),
      token: user.token
    });
    setShowTimeoutConfig(false);
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
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              ⚙️ Panel de Administración
            </h1>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowTimeoutConfig(!showTimeoutConfig)} 
                className="btn-secondary"
              >
                ⚙️ Configurar Tiempo
              </button>
              <button onClick={onLogout} className="btn-secondary">
                Cerrar Sesión
              </button>
            </div>
          </div>
          
          {/* Configuración de timeout */}
          {showTimeoutConfig && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-lg mb-3">⏱️ Configurar Tiempo de Auto-Cierre</h3>
              <p className="text-sm text-gray-600 mb-3">
                Las rondas se cerrarán automáticamente después de este tiempo sin pujas.
              </p>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  min="0.5"
                  max="30"
                  step="0.5"
                  value={newTimeout}
                  onChange={(e) => setNewTimeout(e.target.value)}
                  className="input-field w-32"
                  placeholder="Minutos"
                />
                <span className="text-sm font-semibold">minutos</span>
                <button onClick={handleChangeTimeout} className="btn-primary">
                  Aplicar
                </button>
                <button onClick={() => setShowTimeoutConfig(false)} className="btn-secondary">
                  Cancelar
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Mínimo: 0.5 minutos (30 segundos) | Máximo: 30 minutos
              </p>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Botones de prueba de minijuegos */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">🎮 Probar Minijuegos</h3>
          <p className="text-sm text-gray-600 mb-4">
            Prueba los minijuegos como los verían los jugadores. Puedes usarlos las veces que quieras en modo de prueba.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowPreviewGame('coinflip')}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all"
            >
              🪙 Probar Cara y Sello
            </button>
            <button
              onClick={() => setShowPreviewGame('roulette')}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all"
            >
              🎡 Probar Ruleta de Items
            </button>
          </div>
        </div>

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
              <p className="text-3xl font-bold mb-4">
                ${parseFloat(team.balance).toFixed(2)}
              </p>
              
              {/* Controles de balance */}
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  step="50"
                  placeholder="Nuevo balance"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  id={`balance-${team.id}`}
                />
                <button
                  onClick={() => handleUpdateBalance(team.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  💰 Actualizar
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleAdjustBalance(team.id, -500)}
                  className="flex-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  -$500
                </button>
                <button
                  onClick={() => handleAdjustBalance(team.id, -100)}
                  className="flex-1 px-3 py-1 bg-red-400 text-white rounded text-sm hover:bg-red-500"
                >
                  -$100
                </button>
                <button
                  onClick={() => handleAdjustBalance(team.id, 100)}
                  className="flex-1 px-3 py-1 bg-green-400 text-white rounded text-sm hover:bg-green-500"
                >
                  +$100
                </button>
                <button
                  onClick={() => handleAdjustBalance(team.id, 500)}
                  className="flex-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  +$500
                </button>
              </div>
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
              timerExpiresAt={roundTimers[round.id]}
            />
          ))}
        </div>
      </div>

      {/* Minijuegos de prueba */}
      {showPreviewGame === 'coinflip' && (
        <CoinFlipGame 
          isPreview={true}
          onClose={() => setShowPreviewGame(null)} 
        />
      )}
      
      {showPreviewGame === 'roulette' && (
        <RouletteGame 
          isPreview={true}
          onClose={() => setShowPreviewGame(null)} 
        />
      )}
    </div>
  );
};

const RoundCard = ({ round, onStart, onClose, onEdit, timerExpiresAt }) => {
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
        <div className="flex-1">
          <h3 className="text-xl font-bold">Ronda {round.order} - {round.title}</h3>
          <p className="text-gray-600">{round.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[round.status]}`}>
              {round.status.toUpperCase()}
            </span>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              round.type === 'normal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {round.type === 'normal' ? 'NORMAL' : 'ESPECIAL'}
            </span>
            {round.status === 'active' && presentationTimers[round.id] && (
              <PresentationTimer roundId={round.id} endsAt={presentationTimers[round.id]} />
            )}
            {round.status === 'active' && !presentationTimers[round.id] && timerExpiresAt && (
              <InactivityTimer roundId={round.id} expiresAt={timerExpiresAt} />
            )}
          </div>
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
