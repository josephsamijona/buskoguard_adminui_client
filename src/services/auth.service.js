// src/services/auth.service.js
import axios from 'axios';
import { API_BASE_URL, AUTH_ENDPOINTS, axiosConfig } from '../config/constants';

const authService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`,
        { username, password },
        axiosConfig
      );

      if (response.data.access) {
        // Stocker les tokens dans le localStorage
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (response.data.employee_id) {
          localStorage.setItem('employee_id', response.data.employee_id);
        }
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Échec de la connexion';
    }
  },

  logout: async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      await axios.post(
        `${API_BASE_URL}${AUTH_ENDPOINTS.LOGOUT}`,
        { refresh_token },
        {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le localStorage même en cas d'erreur
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('employee_id');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;