// src/services/department.service.js
import axios from 'axios';
import { API_BASE_URL, getAuthHeaders } from '../config/constants';
import { DEPARTMENT_ENDPOINTS } from '../config/departmentEndpoints';

const departmentService = {
    // Récupérer la liste des départements avec filtres
    getDepartments: async (params = {}) => {
        const queryParams = new URLSearchParams({
            ...(params.search && { search: params.search }),
            ...(params.ordering && { ordering: params.ordering })
        }).toString();

        const url = `${API_BASE_URL}${DEPARTMENT_ENDPOINTS.LIST}${queryParams ? `?${queryParams}` : ''}`;
        const response = await axios.get(url, getAuthHeaders());
        return response.data;
    },

    // Récupérer un département
    getDepartment: async (id) => {
        const response = await axios.get(
            `${API_BASE_URL}${DEPARTMENT_ENDPOINTS.DETAIL(id)}`,
            getAuthHeaders()
        );
        return response.data;
    },

    // Créer un département
    createDepartment: async (data) => {
        const response = await axios.post(
            `${API_BASE_URL}${DEPARTMENT_ENDPOINTS.LIST}`,
            data,
            getAuthHeaders()
        );
        return response.data;
    },

    // Mettre à jour un département
    updateDepartment: async (id, data) => {
        const response = await axios.put(
            `${API_BASE_URL}${DEPARTMENT_ENDPOINTS.DETAIL(id)}`,
            data,
            getAuthHeaders()
        );
        return response.data;
    },

    // Supprimer un département
    deleteDepartment: async (id) => {
        await axios.delete(
            `${API_BASE_URL}${DEPARTMENT_ENDPOINTS.DETAIL(id)}`,
            getAuthHeaders()
        );
    },

    // Récupérer les statistiques d'un département
    getDepartmentStats: async (id) => {
        const response = await axios.get(
            `${API_BASE_URL}${DEPARTMENT_ENDPOINTS.STATS(id)}`,
            getAuthHeaders()
        );
        return response.data;
    }
};

export default departmentService;