import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState('spectator'); // spectator, team, admin
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [teamToken, setTeamToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.loginAdmin(username, password);
      onLogin('admin', { username }, response.data.token);
      navigate('/admin');
    } catch (err) {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.loginTeam(teamToken);
      onLogin('team', response.data.team, response.data.token);
      navigate('/team');
    } catch (err) {
      setError('Token de equipo inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleSpectatorAccess = () => {
    navigate('/spectator');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          🎉 Subasta Camaggi
        </h1>
        <p className="text-center text-gray-600 mb-8">Bienvenido al evento</p>

        {/* Selector de modo */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('spectator')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              mode === 'spectator'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            👀 Espectador
          </button>
          <button
            onClick={() => setMode('team')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              mode === 'team'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🎯 Equipo
          </button>
          <button
            onClick={() => setMode('admin')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              mode === 'admin'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ⚙️ Admin
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Formulario de Espectador */}
        {mode === 'spectator' && (
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Visualiza las subastas en tiempo real sin necesidad de credenciales
            </p>
            <button
              onClick={handleSpectatorAccess}
              className="w-full btn-primary text-lg"
            >
              Entrar como Espectador
            </button>
          </div>
        )}

        {/* Formulario de Equipo */}
        {mode === 'team' && (
          <form onSubmit={handleTeamLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token del Equipo
              </label>
              <input
                type="text"
                value={teamToken}
                onChange={(e) => setTeamToken(e.target.value)}
                className="input-field"
                placeholder="Ingresa tu token de equipo"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-lg"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        )}

        {/* Formulario de Admin */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-lg"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
