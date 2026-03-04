import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            const response = await fetch('http://localhost:5000/api/dashboard/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch stats');
            return response.json();
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                Error loading dashboard stats: {error.message}
            </div>
        );
    }

    const { totalAppointments, pendingReviews, totalServices } = stats?.data || { totalAppointments: 0, pendingReviews: 0, totalServices: 0 };

    return (
        <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-500 mb-8">Welcome back, {user?.name}!</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link to="/admin/appointments" className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Total Appointments</h3>
                    <p className="text-4xl font-bold text-gray-900">{totalAppointments}</p>
                    <div className="mt-4 text-sm text-green-600 font-medium">View Schedule &rarr;</div>
                </Link>

                <Link to="/admin/testimonials" className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Pending Reviews</h3>
                    <p className={`text-4xl font-bold ${pendingReviews > 0 ? 'text-orange-500' : 'text-gray-900'}`}>{pendingReviews}</p>
                    <div className="mt-4 text-sm text-gray-500 font-medium">Manage Reviews &rarr;</div>
                </Link>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Active Services</h3>
                    <p className="text-4xl font-bold text-gray-900">{totalServices}</p>
                    <div className="mt-4 text-sm text-gray-400">Services listed on site</div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to="/admin/appointments" className="p-4 border rounded-lg hover:bg-gray-50 text-center text-gray-700 font-medium">
                        View Today's Schedule
                    </Link>
                    <Link to="/" target="_blank" className="p-4 border rounded-lg hover:bg-gray-50 text-center text-gray-700 font-medium">
                        Open Live Website
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
