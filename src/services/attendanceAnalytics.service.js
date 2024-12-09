// src/services/attendanceAnalytics.service.js
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const getAuthHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  }
});

const attendanceAnalyticsService = {
  // Rapport journalier
  getDailyReport: async (params = {}) => {
    const queryParams = new URLSearchParams({
      ...(params.date && { date: params.date }),
      ...(params.department && { department: params.department }),
      ...(params.status && { status: params.status }),
      ...(params.search && { search: params.search })
    }).toString();

    const response = await axios.get(
      `${API_BASE_URL}/analytics/daily/${queryParams ? `?${queryParams}` : ''}`,
      getAuthHeaders()
    );
    return response.data;
  },

  // Rapport mensuel
  getMonthlyReport: async (params = {}) => {
    const queryParams = new URLSearchParams({
      ...(params.year && { year: params.year }),
      ...(params.month && { month: params.month }),
      ...(params.department && { department: params.department })
    }).toString();

    const response = await axios.get(
      `${API_BASE_URL}/analytics/monthly/${queryParams ? `?${queryParams}` : ''}`,
      getAuthHeaders()
    );
    return response.data;
  },

  // Tendances
  getTrends: async (params = {}) => {
    const queryParams = new URLSearchParams({
      ...(params.days && { days: params.days })
    }).toString();

    const response = await axios.get(
      `${API_BASE_URL}/analytics/trends/${queryParams ? `?${queryParams}` : ''}`,
      getAuthHeaders()
    );
    return response.data;
  }
};

export default attendanceAnalyticsService;