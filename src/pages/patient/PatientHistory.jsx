import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../../context/PatientContext';
import axios from 'axios';
import {
    ArrowLeft,
    Calendar,
    TrendingUp,
    TrendingDown,
    Minus,
    Image as ImageIcon,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';

const PatientHistory = () => {
    const { token } = usePatient();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/patient/login');
            return;
        }

        fetchHistory();
    }, [token, navigate]);

    const fetchHistory = async () => {
        try {
            const response = await axios.get(
                'http://localhost:5000/api/skin-analysis/history',
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setHistory(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTrendIcon = (current, previous) => {
        if (!previous) return <Minus className="w-4 h-4 text-gray-400" />;
        if (current < previous) return <TrendingUp className="w-4 h-4 text-green-600" />;
        if (current > previous) return <TrendingDown className="w-4 h-4 text-red-600" />;
        return <Minus className="w-4 h-4 text-gray-400" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100 px-4 py-4">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate('/patient/dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-forest mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-2xl font-playfair font-bold text-forest">
                        Analysis History
                    </h1>
                    <p className="text-sm text-gray-600">
                        View all your skin analyses and track your progress
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {history.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No History Yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Upload your first skin photo to start tracking
                        </p>
                        <button
                            onClick={() => navigate('/patient/upload')}
                            className="px-6 py-3 bg-forest text-white rounded-lg hover:bg-forest-dark transition-colors"
                        >
                            Upload Photo
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Timeline */}
                        <div className="lg:col-span-2 space-y-6">
                            {history.map((analysis, index) => {
                                const previousAnalysis = history[index - 1];
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => setSelectedAnalysis(analysis)}
                                        className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Image */}
                                            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                <img
                                                    src={`http://localhost:5000${analysis.imageUrl}`}
                                                    alt="Skin analysis"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(
                                                            analysis.date
                                                        ).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </div>

                                                {/* Scores */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    <div className="bg-green-50 rounded-lg p-3">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs text-green-600 font-medium">
                                                                Health
                                                            </span>
                                                            {getTrendIcon(
                                                                analysis.aiAnalysis
                                                                    .overallHealthScore,
                                                                previousAnalysis?.aiAnalysis
                                                                    .overallHealthScore
                                                            )}
                                                        </div>
                                                        <div className="text-xl font-bold text-green-700">
                                                            {
                                                                analysis.aiAnalysis
                                                                    .overallHealthScore
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="bg-orange-50 rounded-lg p-3">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs text-orange-600 font-medium">
                                                                Acne
                                                            </span>
                                                            {getTrendIcon(
                                                                analysis.aiAnalysis.acneScore,
                                                                previousAnalysis?.aiAnalysis
                                                                    .acneScore
                                                            )}
                                                        </div>
                                                        <div className="text-xl font-bold text-orange-700">
                                                            {analysis.aiAnalysis.acneScore}
                                                        </div>
                                                    </div>

                                                    <div className="bg-purple-50 rounded-lg p-3">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs text-purple-600 font-medium">
                                                                Pigment
                                                            </span>
                                                            {getTrendIcon(
                                                                analysis.aiAnalysis
                                                                    .pigmentationScore,
                                                                previousAnalysis?.aiAnalysis
                                                                    .pigmentationScore
                                                            )}
                                                        </div>
                                                        <div className="text-xl font-bold text-purple-700">
                                                            {
                                                                analysis.aiAnalysis
                                                                    .pigmentationScore
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="bg-blue-50 rounded-lg p-3">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs text-blue-600 font-medium">
                                                                Wrinkles
                                                            </span>
                                                            {getTrendIcon(
                                                                analysis.aiAnalysis.wrinkleScore,
                                                                previousAnalysis?.aiAnalysis
                                                                    .wrinkleScore
                                                            )}
                                                        </div>
                                                        <div className="text-xl font-bold text-blue-700">
                                                            {analysis.aiAnalysis.wrinkleScore}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Detail Panel */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                                {selectedAnalysis ? (
                                    <>
                                        <h3 className="font-semibold text-forest mb-4">
                                            Analysis Details
                                        </h3>

                                        {/* Full Image */}
                                        <div className="rounded-lg overflow-hidden mb-4">
                                            <img
                                                src={`http://localhost:5000${selectedAnalysis.imageUrl}`}
                                                alt="Skin analysis"
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(
                                                selectedAnalysis.date
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </div>

                                        {/* Issues */}
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                                Detected Issues
                                            </h4>
                                            <ul className="space-y-2">
                                                {selectedAnalysis.aiAnalysis.detectedIssues.map(
                                                    (issue, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-start gap-2 text-sm text-gray-600"
                                                        >
                                                            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                                            {issue}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>

                                        {/* Recommendations */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                                Recommendations
                                            </h4>
                                            <ul className="space-y-2">
                                                {selectedAnalysis.aiAnalysis.recommendations.map(
                                                    (rec, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-start gap-2 text-sm text-gray-600"
                                                        >
                                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                            {rec}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm">
                                            Click on an analysis to view details
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientHistory;
