// Leaves page
import  { useState } from 'react';
import { 
  Calendar,
  Plus,
  Search,
  Check,
  X,
  Clock,
  
  
  
} from 'lucide-react';

const Leaves = () => {
  const [leaveRequests] = useState([
    {
      id: 1,
      employee: "John Doe",
      department: "IT",
      type: "Congé annuel",
      startDate: "2024-02-15",
      endDate: "2024-02-20",
      days: 5,
      status: "pending",
      reason: "Vacances familiales"
    },
    {
      id: 2,
      employee: "Jane Smith",
      department: "RH",
      type: "Maladie",
      startDate: "2024-02-10",
      endDate: "2024-02-12",
      days: 2,
      status: "approved",
      reason: "Consultation médicale"
    },
    {
      id: 3,
      employee: "Mike Johnson",
      department: "Marketing",
      type: "Congé sans solde",
      startDate: "2024-03-01",
      endDate: "2024-03-05",
      days: 4,
      status: "rejected",
      reason: "Raisons personnelles"
    }
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        text: "En attente"
      },
      approved: {
        color: "bg-green-100 text-green-800",
        icon: Check,
        text: "Approuvé"
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        icon: X,
        text: "Refusé"
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Congés</h1>
            <p className="text-gray-600">Gérez et suivez les demandes de congés</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Calendar className="w-5 h-5 mr-2" />
              Vue Calendrier
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle Demande
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-yellow-600">À traiter</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approuvés</p>
                <p className="text-2xl font-bold text-gray-900">25</p>
                <p className="text-sm text-green-600">Ce mois</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Refusés</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-red-600">Ce mois</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Solde Moyen</p>
                <p className="text-2xl font-bold text-gray-900">15j</p>
                <p className="text-sm text-blue-600">Par employé</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une demande..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Tous les départements</option>
                <option>IT</option>
                <option>RH</option>
                <option>Marketing</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Tous les statuts</option>
                <option>En attente</option>
                <option>Approuvé</option>
                <option>Refusé</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Type de congé</option>
                <option>Congé annuel</option>
                <option>Maladie</option>
                <option>Sans solde</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Employé
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Département
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Période
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Jours
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.employee}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{request.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.days} jours</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3">
                        {request.status === 'pending' && (
                          <>
                            <button className="text-green-600 hover:text-green-900">
                              <Check className="w-5 h-5" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button className="text-blue-600 hover:text-blue-900">
                          Détails
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Précédent
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage <span className="font-medium">1</span> à <span className="font-medium">10</span> sur{' '}
                  <span className="font-medium">20</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Précédent
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Suivant
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaves;