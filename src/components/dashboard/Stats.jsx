// src/components/dashboard/Stats.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Users, Clock, AlertCircle, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_BASE_URL, DASHBOARD_ENDPOINTS } from '../../config/constants';

// Composant pour les cartes de statistiques
const StatCard = ({ title, value, icon: Icon, color, percentageChange }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
        {percentageChange !== undefined && (
          <p className={`text-sm mt-1 ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(1)}%
          </p>
        )}
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  percentageChange: PropTypes.number,
};

StatCard.defaultProps = {
  percentageChange: undefined,
};

// Type pour les alertes
const AlertItem = PropTypes.shape({
  type: PropTypes.oneOf(['absence', 'late']).isRequired,
  message: PropTypes.string.isRequired,
  department: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
});

const Stats = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    weeklyAttendance: [],
    alerts: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, weeklyRes, alertsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}${DASHBOARD_ENDPOINTS.STATS}`, { headers }),
        axios.get(`${API_BASE_URL}${DASHBOARD_ENDPOINTS.WEEKLY_ATTENDANCE}`, { headers }),
        axios.get(`${API_BASE_URL}${DASHBOARD_ENDPOINTS.ALERTS}`, { headers })
      ]);

      setDashboardData({
        stats: statsRes.data,
        weeklyAttendance: weeklyRes.data,
        alerts: alertsRes.data
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données du dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Chargement des statistiques...</div>
      </div>
    );
  }

  const { stats, weeklyAttendance, alerts } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Employés Présents"
          value={`${stats?.present_today || 0}/${stats?.total_employees || 0}`}
          icon={Users}
          color="bg-blue-500"
          percentageChange={stats?.present_percentage}
        />
        <StatCard
          title="Retards"
          value={stats?.total_late || 0}
          icon={Clock}
          color="bg-yellow-500"
          percentageChange={stats?.late_percentage}
        />
        <StatCard
          title="Absents"
          value={stats?.total_absent || 0}
          icon={AlertCircle}
          color="bg-red-500"
          percentageChange={stats?.absent_percentage}
        />
        <StatCard
          title="En Congés"
          value={stats?.on_leave || 0}
          icon={Calendar}
          color="bg-purple-500"
          percentageChange={stats?.leave_percentage}
        />
      </div>

      {/* Graphique de présence */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Présences de la semaine</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyAttendance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#3B82F6" name="Présents" />
              <Bar dataKey="absent" fill="#EF4444" name="Absents" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertes récentes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Alertes récentes</h2>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`flex items-center p-4 ${
                alert.type === 'absence' ? 'bg-red-50' : 'bg-yellow-50'
              } rounded-lg`}
            >
              <AlertCircle 
                className={`w-5 h-5 mr-3 ${
                  alert.type === 'absence' ? 'text-red-500' : 'text-yellow-500'
                }`}
              />
              <div>
                <p className={`font-medium ${
                  alert.type === 'absence' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {alert.message}
                </p>
                <p className={`text-sm ${
                  alert.type === 'absence' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  Département {alert.department} - {new Date(alert.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="text-center text-gray-500">
              Aucune alerte pour le moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Validation des props pour le composant Stats
Stats.propTypes = {
  weeklyAttendance: PropTypes.arrayOf(PropTypes.shape({
    day: PropTypes.string.isRequired,
    present: PropTypes.number.isRequired,
    absent: PropTypes.number.isRequired,
  })),
  alerts: PropTypes.arrayOf(AlertItem),
};

Stats.defaultProps = {
  weeklyAttendance: [],
  alerts: [],
};

export default Stats;