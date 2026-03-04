import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const PatientContext = createContext();

export const usePatient = () => {
    const context = useContext(PatientContext);
    if (!context) {
        throw new Error('usePatient must be used within PatientProvider');
    }
    return context;
};

export const PatientProvider = ({ children }) => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('patientToken'));

    // Check if patient is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('patientToken');
            if (storedToken) {
                try {
                    const response = await axios.get('http://localhost:5000/api/patients/me', {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    });
                    if (response.data.success) {
                        setPatient(response.data.data);
                        setToken(storedToken);
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('patientToken');
                    setToken(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const register = async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/patients/register', userData);
            if (response.data.success) {
                const { token: newToken, ...patientData } = response.data.data;
                setToken(newToken);
                setPatient(patientData);
                localStorage.setItem('patientToken', newToken);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/patients/login', {
                email,
                password
            });
            if (response.data.success) {
                const { token: newToken, ...patientData } = response.data.data;
                setToken(newToken);
                setPatient(patientData);
                localStorage.setItem('patientToken', newToken);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        setPatient(null);
        setToken(null);
        localStorage.removeItem('patientToken');
    };

    const updateConsultation = async (consultationData) => {
        try {
            const response = await axios.patch(
                'http://localhost:5000/api/patients/consultation',
                consultationData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (response.data.success) {
                setPatient(response.data.data);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Update failed'
            };
        }
    };

    const value = {
        patient,
        token,
        isAuthenticated: !!patient,
        loading,
        register,
        login,
        logout,
        updateConsultation,
    };

    return (
        <PatientContext.Provider value={value}>
            {children}
        </PatientContext.Provider>
    );
};

export default PatientContext;
