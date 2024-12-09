// src/services/dashboard.service.js
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const dashboardService = {
  getStats: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/dashboard/stats/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getWeeklyAttendance: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/dashboard/weekly-attendance/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getAlerts: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/dashboard/alerts/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default dashboardService;