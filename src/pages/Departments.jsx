import  { useState } from 'react';
import { Plus, Search, Users, Edit2, Trash2, MoreVertical } from 'lucide-react';

const Departments = () => {
  const [departments] = useState([
    {
      id: 1,
      name: "Technologies de l'Information",
      shortName: "IT",
      head: "John Doe",
      employeeCount: 25,
      attendance: 95,
    },
    {
      id: 2,
      name: "Ressources Humaines",
      shortName: "RH",
      head: "Jane Smith",
      employeeCount: 12,
      attendance: 92,
    },
    // Ajoutez d'autres départements selon vos besoins
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        {/* En-tête avec actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Départements</h1>
            <p className="text-gray-600">Gérez vos départements et équipes</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Nouveau Département</span>
          </button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un département..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>Tous les départements</option>
            <option>Actifs</option>
            <option>Inactifs</option>
          </select>
        </div>

        {/* Liste des départements */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsable
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Présence
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{dept.name}</div>
                      <div className="text-sm text-gray-500">{dept.shortName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{dept.head}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      {dept.employeeCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{ width: `${dept.attendance}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{dept.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Departments;