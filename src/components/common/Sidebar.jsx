import  'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Clock, 
  Calendar, 
  Settings,
  Building2,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/',
      icon: Home,
      label: 'Dashboard',
    },
    {
      path: '/employees',
      icon: Users,
      label: 'Employés',
    },
    {
      path: '/departments',
      icon: Building2,
      label: 'Départements',
    },
    {
      path: '/attendance',
      icon: Clock,
      label: 'Présences',
    },
    {
      path: '/leaves',
      icon: Calendar,
      label: 'Congés',
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Paramètres',
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">AttendanceApp</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                transition-colors duration-150 
                ${isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 
                   hover:bg-gray-100 rounded-lg transition-colors duration-150"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;