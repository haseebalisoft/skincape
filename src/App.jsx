import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { PatientProvider } from './context/PatientContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import TestimonialsAdmin from './pages/admin/Testimonials';
import AppointmentsAdmin from './pages/admin/Appointments';
import PatientAuth from './pages/patient/PatientAuth';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientUpload from './pages/patient/PatientUpload';
import PatientConsultation from './pages/patient/PatientConsultation';
import PatientHistory from './pages/patient/PatientHistory';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PatientProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Public Route */}
              <Route path="/" element={<LandingPage />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />

              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="appointments" element={<AppointmentsAdmin />} />
                <Route path="testimonials" element={<TestimonialsAdmin />} />
              </Route>

              {/* Patient Routes */}
              <Route path="/patient/login" element={<PatientAuth />} />
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/upload" element={<PatientUpload />} />
              <Route path="/patient/consultation" element={<PatientConsultation />} />
              <Route path="/patient/history" element={<PatientHistory />} />
            </Routes>
          </Router>
        </PatientProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
