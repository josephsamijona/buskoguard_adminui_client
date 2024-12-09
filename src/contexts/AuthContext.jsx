// src/contexts/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification au chargement
    const token = localStorage.getItem('token');
    const user = authService.getCurrentUser();
    if (token && user) {
      setIsAuthenticated(true);
      setUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      setIsAuthenticated(true);
      setUser(response.user);
      navigate('/');
      return response;
    } catch (error) {
      toast.error(error.toString());
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};