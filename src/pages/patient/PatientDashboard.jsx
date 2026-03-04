import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../../context/PatientContext';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    Calendar,
    Camera,
    MessageCircle,
    LogOut,
    Upload,
    Activity,
    Sparkles,
} from 'lucide-react';

const PatientDashboard = () => {
    const { patient, token, logout } = usePatient();
    const navigate = useNavigate();
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/patient/login');
            return;
        }

        fetchProgressData();
    }, [token, navigate]);

    const fetchProgressData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/skin-analysis/progress', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                setProgressData(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const hasData = progressData?.hasData;
    const latestAnalysis = progressData?.latestAnalysis;
    const improvement = progressData?.improvement;
    const trendData = progressData?.trendData;

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-playfair font-bold text-forest">
                                Welcome back, {patient?.name}!
                            </h1>
                            <p className="text-sm text-gray-600">Your Skin Journey Dashboard</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-forest transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!hasData ? (
                    /* No Data State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="bg-white rounded-2xl shadow-sm p-12 max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Camera className="w-10 h-10 text-sage" />
                            </div>
                            <h2 className="text-2xl font-bold text-forest mb-4">
                                Start Your Skin Journey
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Upload your first skin photo to get AI-powered analysis and start
                                tracking your progress over time.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => navigate('/patient/consultation')}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-sage text-sage rounded-lg hover:bg-sage/5 transition-colors"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Start Consultation
                                </button>
                                <button
                                    onClick={() => navigate('/patient/upload')}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-forest text-white rounded-lg hover:bg-forest-dark transition-colors"
                                >
                                    <Upload className="w-5 h-5" />
                                    Upload First Photo
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* Dashboard with Data */
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Overall Health Score */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600">
                                        Skin Health Score
                                    </h3>
                                    <Activity className="w-5 h-5 text-sage" />
                                </div>
                                <div className="text-4xl font-bold text-forest mb-2">
                                    {latestAnalysis?.aiAnalysis?.overallHealthScore}
                                    <span className="text-lg text-gray-400">/100</span>
                                </div>
                                {improvement?.hasComparison && (
                                    <div
                                        className={`flex items-center gap-1 text-sm ${improvement.healthImprovement > 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}
                                    >
                                        {improvement.healthImprovement > 0 ? (
                                            <TrendingUp className="w-4 h-4" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4" />
                                        )}
                                        {Math.abs(improvement.healthImprovement)}% vs last upload
                                    </div>
                                )}
                            </motion.div>

                            {/* Acne Score */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600">Acne Level</h3>
                                    <Sparkles className="w-5 h-5 text-orange-500" />
                                </div>
                                <div className="text-4xl font-bold text-forest mb-2">
                                    {latestAnalysis?.aiAnalysis?.acneScore}
                                    <span className="text-lg text-gray-400">/100</span>
                                </div>
                                {improvement?.hasComparison && (
                                    <div
                                        className={`flex items-center gap-1 text-sm ${improvement.acneImprovement > 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}
                                    >
                                        {improvement.acneImprovement > 0 ? (
                                            <TrendingUp className="w-4 h-4" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4" />
                                        )}
                                        {Math.abs(improvement.acneImprovement)}% improvement
                                    </div>
                                )}
                            </motion.div>

                            {/* Pigmentation Score */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600">
                                        Pigmentation
                                    </h3>
                                    <Sparkles className="w-5 h-5 text-purple-500" />
                                </div>
                                <div className="text-4xl font-bold text-forest mb-2">
                                    {latestAnalysis?.aiAnalysis?.pigmentationScore}
                                    <span className="text-lg text-gray-400">/100</span>
                                </div>
                                {improvement?.hasComparison && (
                                    <div
                                        className={`flex items-center gap-1 text-sm ${improvement.pigmentationImprovement > 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}
                                    >
                                        {improvement.pigmentationImprovement > 0 ? (
                                            <TrendingUp className="w-4 h-4" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4" />
                                        )}
                                        {Math.abs(improvement.pigmentationImprovement)}% improvement
                                    </div>
                                )}
                            </motion.div>

                            {/* Total Uploads */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600">
                                        Total Uploads
                                    </h3>
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="text-4xl font-bold text-forest mb-2">
                                    {progressData?.totalUploads}
                                </div>
                                <p className="text-sm text-gray-500">
                                    Last upload:{' '}
                                    {new Date(progressData?.lastUploadDate).toLocaleDateString()}
                                </p>
                            </motion.div>
                        </div>

                        {/* Progress Graph */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <h3 className="text-lg font-semibold text-forest mb-6">
                                Progress Over Time
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) =>
                                            new Date(date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })
                                        }
                                        stroke="#9ca3af"
                                    />
                                    <YAxis domain={[0, 100]} stroke="#9ca3af" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="health"
                                        stroke="#2d5f4f"
                                        strokeWidth={2}
                                        name="Overall Health"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="acne"
                                        stroke="#f97316"
                                        strokeWidth={2}
                                        name="Acne"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="pigmentation"
                                        stroke="#a855f7"
                                        strokeWidth={2}
                                        name="Pigmentation"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="wrinkles"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        name="Wrinkles"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button
                                onClick={() => navigate('/patient/upload')}
                                className="bg-forest text-white rounded-xl p-6 hover:bg-forest-dark transition-colors text-left"
                            >
                                <Upload className="w-8 h-8 mb-3" />
                                <h3 className="font-semibold mb-1">Upload New Photo</h3>
                                <p className="text-sm text-white/80">
                                    Track your progress with a new analysis
                                </p>
                            </button>

                            <button
                                onClick={() => navigate('/patient/history')}
                                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-sage transition-colors text-left"
                            >
                                <Calendar className="w-8 h-8 mb-3 text-sage" />
                                <h3 className="font-semibold mb-1 text-forest">View History</h3>
                                <p className="text-sm text-gray-600">
                                    See all your past analyses
                                </p>
                            </button>

                            <button
                                onClick={() => navigate('/#appointment')}
                                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-sage transition-colors text-left"
                            >
                                <MessageCircle className="w-8 h-8 mb-3 text-sage" />
                                <h3 className="font-semibold mb-1 text-forest">Book Appointment</h3>
                                <p className="text-sm text-gray-600">
                                    Schedule an in-person consultation
                                </p>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
