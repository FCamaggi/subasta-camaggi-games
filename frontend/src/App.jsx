import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { initSocket } from './services/socket';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeamDashboard from './pages/TeamDashboard';
import SpectatorView from './pages/SpectatorView';

function App() {
  const { user, loading, login, logout } = useAuth();

  useEffect(() => {
    console.log('🚀 App - Inicializando aplicación');
    console.log('🌐 App - API_URL:', import.meta.env.VITE_API_URL);
    // Inicializar WebSocket al cargar la app
    initSocket();
  }, []);

  useEffect(() => {
    console.log('👤 App - Estado de usuario:', user);
    console.log('⏳ App - Loading:', loading);
  }, [user, loading]);

  if (loading) {
    console.log('⏳ App - Mostrando pantalla de carga');
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl">Cargando...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={login} />} />
        
        <Route
          path="/admin"
          element={
            user && user.type === 'admin' ? (
              <AdminDashboard user={user} onLogout={logout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        
        <Route
          path="/team"
          element={
            user && user.type === 'team' ? (
              <TeamDashboard user={user} onLogout={logout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        
        <Route path="/spectator" element={<SpectatorView />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
