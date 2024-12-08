import  'react';
import Stats from '../components/dashboard/Stats';
import { Users, Clock, Ban, Calendar } from 'lucide-react';

const Dashboard = () => {
  const quickStats = [
    { 
      title: "Total Employés", 
      count: "150", 
      status: "+12%", 
      icon: Users, 
      color: "bg-blue-500" 
    },
    { 
      title: "Présents Aujourd'hui", 
      count: "142", 
      status: "95%", 
      icon: Clock, 
      color: "bg-green-500" 
    },
    { 
      title: "Absents", 
      count: "8", 
      status: "5%", 
      icon: Ban, 
      color: "bg-red-500" 
    },
    { 
      title: "En Congé", 
      count: "3", 
      status: "2%", 
      icon: Calendar, 
      color: "bg-purple-500" 
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Vue d&apos;ensemble de l&apos;activité du jour</p>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.count}</p>
                    <p className={`text-sm mt-1 ${
                      stat.status.includes('+') ? 'text-green-500' : 'text-gray-500'
                    }`}>
                      {stat.status}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Composant Stats pour les graphiques et alertes */}
        <Stats />

        {/* Activités Récentes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Activités Récentes</h2>
          <div className="space-y-4">
            {[
              { time: "09:00", event: "John Doe a pointé son arrivée", type: "arrival" },
              { time: "09:15", event: "Sarah Wilson a demandé un congé", type: "leave" },
              { time: "09:30", event: "Mike Johnson est absent", type: "absent" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 py-3 border-b">
                <div className="text-sm font-medium text-gray-500 w-16">{activity.time}</div>
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'arrival' ? 'bg-green-500' :
                  activity.type === 'leave' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div className="text-gray-700">{activity.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;