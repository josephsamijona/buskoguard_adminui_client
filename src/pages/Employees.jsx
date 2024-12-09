// src/pages/Employees.jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  CreditCard, 
  Camera,
  Download,
  Check,
  X
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, EMPLOYEE_MANAGEMENT, getAuthHeaders } from '../config/constants';

const Employees = () => {
  // États
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: ''
  });

  // Charger les données initiales
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [filters]);

  // Récupérer la liste des employés
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...(filters.search && { search: filters.search }),
        ...(filters.department && { department: filters.department }),
        ...(filters.status && { status: filters.status })
      }).toString();

      const response = await axios.get(
        `${API_BASE_URL}${EMPLOYEE_MANAGEMENT.LIST}${queryParams ? `?${queryParams}` : ''}`,
        getAuthHeaders()
      );
      setEmployees(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des employés");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer la liste des départements
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${EMPLOYEE_MANAGEMENT.DEPARTMENTS}`,
        getAuthHeaders()
      );
      setDepartments(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des départements");
      console.error(error);
    }
  };

  // Gérer le changement de statut d'un employé
  const handleStatusChange = async (employeeId, action) => {
    try {
      const endpoint = action === 'activate' ? 
        EMPLOYEE_MANAGEMENT.ACTIVATE(employeeId) : 
        EMPLOYEE_MANAGEMENT.DEACTIVATE(employeeId);

      await axios.post(
        `${API_BASE_URL}${endpoint}`,
        {},
        getAuthHeaders()
      );

      toast.success(`Employé ${action === 'activate' ? 'activé' : 'désactivé'} avec succès`);
      fetchEmployees();
    } catch (error) {
      toast.error("Erreur lors du changement de statut");
      console.error(error);
    }
  };

  // Gérer la suppression d'un employé
  const handleDelete = async (employeeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      try {
        await axios.delete(
          `${API_BASE_URL}${EMPLOYEE_MANAGEMENT.LIST}${employeeId}/`,
          getAuthHeaders()
        );
        toast.success('Employé supprimé avec succès');
        fetchEmployees();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
        console.error(error);
      }
    }
  };

  // Gérer les changements de filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Rendu du composant
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="space-y-6">
        {/* En-tête avec actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employés</h1>
            <p className="text-gray-600">Gérez vos employés et leurs accès</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Download className="w-5 h-5 mr-2" />
              Exporter
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              Ajouter un Employé
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un employé..."
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les départements</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
                <option value="ON_LEAVE">En congé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tableau des employés */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-600">Chargement...</div>
            </div>
          ) : (
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
                            <div className="font-medium text-gray-900">{employee.full_name}</div>
                            <div className="text-sm text-gray-500">{employee.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.department_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${employee.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                            employee.status === 'ON_LEAVE' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {employee.nfc_id && (
                            <span className="text-green-600" title="NFC Activé">
                              <CreditCard className="w-5 h-5" />
                            </span>
                          )}
                          {employee.face_id && (
                            <span className="text-green-600" title="Face ID Activé">
                              <Camera className="w-5 h-5" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button onClick={() => handleStatusChange(employee.id, employee.status === 'ACTIVE' ? 'deactivate' : 'activate')}
                            className={`${
                              employee.status === 'ACTIVE' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                            }`}
                          >
                            {employee.status === 'ACTIVE' ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                          </button>
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(employee.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;