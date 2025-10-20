import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const userData = localStorage.getItem('userData');

    if (token && userType && userData) {
      setUser({
        type: userType,
        data: JSON.parse(userData),
        token
      });
    }
    setLoading(false);
  }, []);

  const login = (type, data, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', type);
    localStorage.setItem('userData', JSON.stringify(data));
    setUser({ type, data, token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    setUser(null);
  };

  return { user, loading, login, logout };
};
