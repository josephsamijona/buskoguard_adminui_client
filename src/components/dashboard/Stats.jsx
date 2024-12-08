import  'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Clock, AlertCircle, Calendar } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, percentageChange }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold mt-2">{value}</p>
        {percentageChange && (
          <p className={`text-sm mt-2 ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentageChange >= 0 ? '+' : ''}{percentageChange}% vs hier
          </p>
        )}
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

// Validation des props pour StatCard
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  percentageChange: PropTypes.number,
};

// Valeurs par défaut
StatCard.defaultProps = {
  percentageChange: null,
};

const Stats = () => {
  const attendanceData = [
    { name: 'Lun', présents: 45, absents: 5 },
    { name: 'Mar', présents: 42, absents: 8 },
    { name: 'Mer', présents: 47, absents: 3 },
    { name: 'Jeu', présents: 44, absents: 6 },
    { name: 'Ven', présents: 46, absents: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Employés Présents"
          value="45/50"
          icon={Users}
          color="bg-blue-500"
          percentageChange={2.5}
        />
        <StatCard
          title="Retards"
          value="3"
          icon={Clock}
          color="bg-yellow-500"
          percentageChange={-1.2}
        />
        <StatCard
          title="Absents"
          value="5"
          icon={AlertCircle}
          color="bg-red-500"
          percentageChange={0.8}
        />
        <StatCard
          title="En Congés"
          value="2"
          icon={Calendar}
          color="bg-green-500"
          percentageChange={0}
        />
      </div>

      {/* Graphique de présence */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Présences de la semaine</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="présents" fill="#3B82F6" />
              <Bar dataKey="absents" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertes récentes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Alertes récentes</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <div>
              <p className="font-medium text-red-800">3 absences non justifiées</p>
              <p className="text-sm text-red-600">Département IT - Aujourd&apos;hui</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
            <Clock className="w-5 h-5 text-yellow-500 mr-3" />
            <div>
              <p className="font-medium text-yellow-800">5 retards signalés</p>
              <p className="text-sm text-yellow-600">Département Marketing - Aujourd&apos;hui</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;