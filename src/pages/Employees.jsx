import  { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  CreditCard, 
  Camera,
  
  Download
} from 'lucide-react';

const Employees = () => {
  const [employees] = useState([
    {
      id: 1,
      name: "John Doe",
      employeeId: "EMP001",
      department: "IT",
      position: "Développeur Senior",
      status: "Actif",
      email: "john.doe@company.com",
      joinDate: "2023-01-15",
      hasNFC: true,
      hasFaceId: true
    },
    // Plus d'employés...
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        {/* Header avec actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employés</h1>
            <p className="text-gray-600">Gérez vos employés et leurs accès</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-lg flex items-center space-x-2 border">
              <Download className="w-5 h-5" />
              <span>Exporter</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Ajouter un Employé</span>
            </button>
          </div>
        </div>

        {/* Filtres et Recherche */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un employé..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <select className="border rounded-lg px-4 py-2 min-w-[150px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Tous les départements</option>
                <option>IT</option>
                <option>RH</option>
                <option>Marketing</option>
              </select>
              <select className="border rounded-lg px-4 py-2 min-w-[150px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Tous les statuts</option>
                <option>Actif</option>
                <option>Inactif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des employés */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accès
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${employee.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {employee.hasNFC && (
                          <span className="text-green-600" title="NFC Activé">
                            <CreditCard className="w-5 h-5" />
                          </span>
                        )}
                        {employee.hasFaceId && (
                          <span className="text-green-600" title="Face ID Activé">
                            <Camera className="w-5 h-5" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">10</span> sur <span className="font-medium">20</span> résultats
            </span>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Précédent</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;