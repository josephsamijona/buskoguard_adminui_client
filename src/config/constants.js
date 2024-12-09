// src/config/constants.jshttps://buskoguard.up.railway.app/api

// src/config/constants.js

// API Base URL
export const API_BASE_URL = 'https://buskoguard.up.railway.app/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login/',
    LOGOUT: '/auth/logout/',
    REFRESH_TOKEN: '/auth/refresh/'
};

// Employee Management endpoints
export const EMPLOYEE_MANAGEMENT = {
    LIST: '/employee-management/',
    DEPARTMENTS: '/department-management/',
    ACTIVATE: (id) => `/employee-management/${id}/activate/`,
    DEACTIVATE: (id) => `/employee-management/${id}/deactivate/`,
    SET_NFC: (id) => `/employee-management/${id}/set_nfc/`,
    SET_FACE_ID: (id) => `/employee-management/${id}/set_face_id/`
};

// Status des employés
export const EMPLOYEE_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    ON_LEAVE: 'ON_LEAVE'
};

// Headers avec token
export const getAuthHeaders = () => ({
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    }
});


export const CREATION_STEPS = {
    USER_INFO: 'user_info',
    EMPLOYEE_INFO: 'employee_info',
    NFC_SETUP: 'nfc_setup',
    FACE_SETUP: 'face_setup',
    REVIEW: 'review'
  };
  
  export const STEP_TITLES = {
    [CREATION_STEPS.USER_INFO]: {
      title: 'Informations de connexion',
      description: 'Créez le compte utilisateur pour l\'employé'
    },
    [CREATION_STEPS.EMPLOYEE_INFO]: {
      title: 'Informations professionnelles',
      description: 'Ajoutez les détails professionnels de l\'employé'
    },
    [CREATION_STEPS.NFC_SETUP]: {
      title: 'Configuration NFC',
      description: 'Configurez la carte NFC pour l\'employé'
    },
    [CREATION_STEPS.FACE_SETUP]: {
      title: 'Reconnaissance faciale',
      description: 'Configurez la reconnaissance faciale'
    },
    [CREATION_STEPS.REVIEW]: {
      title: 'Récapitulatif',
      description: 'Vérifiez les informations avant de finaliser'
    }
  };
  
  export const EMPLOYEE_POSITIONS = [
    'Développeur',
    'Designer',
    'Chef de projet',
    'Manager',
    'Ressources Humaines',
    'Commercial',
    'Support technique',
    'Administrateur système',
    'Comptable',
    'Assistant(e)',
  ];
  
  export const EMPLOYEE_CREATION_ENDPOINTS = {
    CREATE_USER: '/employees/create/user/',
    CREATE_BASIC_INFO: '/employees/create/basic-info/',
    UPDATE_NFC: (id) => `/employees/${id}/nfc/`,
    UPDATE_FACE: (id) => `/employees/${id}/face-id/`,
    VALIDATE_NFC: '/employees/validate-nfc/'
  };

// src/config/departmentEndpoints.js
export const DEPARTMENT_ENDPOINTS = {
    LIST: '/departments/',
    DETAIL: (id) => `/departments/${id}/`,
    STATS: (id) => `/departments/${id}/stats/`,
};

export const DEPARTMENT_ACTIONS = {
    CREATE: 'create',
    EDIT: 'edit',
    DELETE: 'delete'
};

export const SORT_OPTIONS = [
    { value: 'name', label: 'Nom (A-Z)' },
    { value: '-name', label: 'Nom (Z-A)' },
    { value: 'employee_count', label: 'Nombre d\'employés' },
    { value: '-employee_count', label: 'Nombre d\'employés (décroissant)' },
    { value: 'attendance_rate', label: 'Taux de présence' },
    { value: '-attendance_rate', label: 'Taux de présence (décroissant)' },
    { value: 'created_at', label: 'Date de création' },
    { value: '-created_at', label: 'Date de création (décroissant)' }
];