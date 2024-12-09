// src/services/employee.service.js
import axios from 'axios';
import { API_BASE_URL, EMPLOYEE_MANAGEMENT, getAuthHeaders } from '../config/constants';

const employeeService = {
    // Récupérer la liste des employés avec filtres
    getEmployees: async (params = {}) => {
        const queryParams = new URLSearchParams({
            ...(params.search && { search: params.search }),
            ...(params.department && { department: params.department }),
            ...(params.status && { status: params.status }),
            ...(params.ordering && { ordering: params.ordering })
        }).toString();

        const url = `${API_BASE_URL}${EMPLOYEE_MANAGEMENT.LIST}${queryParams ? `?${queryParams}` : ''}`;
        const response = await axios.get(url, getAuthHeaders());
        return response.data;
    },

    // Récupérer un employé spécifique
    getEmployee: async (id) => {
        const response = await axios.get(
            `${API_BASE_URL}${EMPLOYEE_MANAGEMENT.LIST}${id}/`,
            getAuthHeaders()
        );
        return response.data;
    },

    // Créer un nouvel employé
    createEmployee: async (employeeData) => {
        const response = await axios.post(
            `${API_BASE_URL}${EMPLOYEE_MANAGEMENT.LIST}`,
            employeeData,
            getAuthHeaders()
        );
        return response.data;
    },

    // Mettre à jour un employé
    updateEmployee: async (id, employeeData) => {
        const response = await axios.put(
            `${API_BASE_URL}${EMPLOYEE_MANAGEMENT.LIST}${id}/`,
            employeeData,
            getAuthHeaders()
        );
        return response.data;
    },

    // Supprimer un employé
    deleteEmployee: async (id) => {
        await axios.delete(
            `${API_BASE_URL}${EMPLOYEE_MANAGEMENT.LIST}${id}/`,
            getAuthHeaders()
        );
    },

    // Activer un employé
    activateEmployee: async (id) => {
        const response = await axios.post(
            `${API_BASE_URL}${EMPLOYEE_MANAGEMENT.ACTIVATE(id)}`,
            {},
            getAuthHeaders()
        );
        return response.data;
    },

    // Désactiver un employé
    deactivateEmployee: async (id) => {
        const response = await axios.post(
            `${API_BASE_URL}${EMPLOYEE_MANAGEMENT.DEACTIVATE(id)}`,
            {},
            getAuthHeaders()
        );
        return response.data;
    },

    // Configurer le NFC
    setNFC: async (id, nfcId) => {
        const response = await axios.post(
            `${API_BASE_URL}${EMPLOYEE_MANAGEMENT.SET_NFC(id)}`,
            { nfc_id: nfcId },
            getAuthHeaders()
        );
        return response.data;
    },

    // Configurer le Face ID
    setFaceID: async (id, faceId) => {
        const response = await axios.post(
            `${API_BASE_URL}${EMPLOYEE_MANAGEMENT.SET_FACE_ID(id)}`,
            { face_id: faceId },
            getAuthHeaders()
        );
        return response.data;
    },

    // Récupérer la liste des départements
    getDepartments: async () => {
        const response = await axios.get(
            `${API_BASE_URL}${EMPLOYEE_MANAGEMENT.DEPARTMENTS}`,
            getAuthHeaders()
        );
        return response.data;
    }
};

export default employeeService;