import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../../context/PatientContext';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
    Upload,
    Camera,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Loader2,
    Image as ImageIcon,
    TrendingUp,
} from 'lucide-react';

const PatientUpload = () => {
    const { token } = usePatient();
    const navigate = useNavigate();
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError('');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
        maxFiles: 1,
        maxSize: 5242880, // 5MB
    });

    const handleUpload = async () => {
        if (!file) {
            setError('Please select an image first');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(
                'http://localhost:5000/api/skin-analysis/upload',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                setResult(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (result) {
        return (
            <div className="min-h-screen bg-cream p-4">
                <div className="max-w-4xl mx-auto py-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-luxury p-8"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-forest mb-2">
                                Analysis Complete!
                            </h2>
                            <p className="text-gray-600">
                                Your skin has been analyzed by our AI
                            </p>
                        </div>

                        {/* Scores Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-green-700">
                                    {result.analysis.aiAnalysis.overallHealthScore}
                                </div>
                                <div className="text-sm text-green-600 font-medium">
                                    Health Score
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-orange-700">
                                    {result.analysis.aiAnalysis.acneScore}
                                </div>
                                <div className="text-sm text-orange-600 font-medium">
                                    Acne Level
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-purple-700">
                                    {result.analysis.aiAnalysis.pigmentationScore}
                                </div>
                                <div className="text-sm text-purple-600 font-medium">
                                    Pigmentation
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-blue-700">
                                    {result.analysis.aiAnalysis.wrinkleScore}
                                </div>
                                <div className="text-sm text-blue-600 font-medium">
                                    Wrinkles
                                </div>
                            </div>
                        </div>

                        {/* Improvement */}
                        {result.improvement?.hasComparison && (
                            <div className="bg-sage/10 rounded-xl p-6 mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <TrendingUp className="w-6 h-6 text-sage-dark" />
                                    <h3 className="font-semibold text-forest">
                                        Progress vs Last Upload
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-600">Overall Health</div>
                                        <div
                                            className={`text-2xl font-bold ${result.improvement.healthImprovement > 0
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                                }`}
                                        >
                                            {result.improvement.healthImprovement > 0 ? '+' : ''}
                                            {result.improvement.healthImprovement}%
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Acne</div>
                                        <div
                                            className={`text-2xl font-bold ${result.improvement.acneImprovement > 0
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                                }`}
                                        >
                                            {result.improvement.acneImprovement > 0 ? '+' : ''}
                                            {result.improvement.acneImprovement}%
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Pigmentation</div>
                                        <div
                                            className={`text-2xl font-bold ${result.improvement.pigmentationImprovement > 0
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                                }`}
                                        >
                                            {result.improvement.pigmentationImprovement > 0 ? '+' : ''}
                                            {result.improvement.pigmentationImprovement}%
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Wrinkles</div>
                                        <div
                                            className={`text-2xl font-bold ${result.improvement.wrinkleImprovement > 0
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                                }`}
                                        >
                                            {result.improvement.wrinkleImprovement > 0 ? '+' : ''}
                                            {result.improvement.wrinkleImprovement}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Detected Issues */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-forest mb-3">Detected Issues</h3>
                            <ul className="space-y-2">
                                {result.analysis.aiAnalysis.detectedIssues.map((issue, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2 text-gray-700"
                                    >
                                        <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                        {issue}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recommendations */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-forest mb-3">
                                AI Recommendations
                            </h3>
                            <ul className="space-y-2">
                                {result.analysis.aiAnalysis.recommendations.map((rec, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2 text-gray-700"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/patient/dashboard')}
                                className="flex-1 bg-forest text-white py-3 rounded-lg font-medium hover:bg-forest-dark transition-colors"
                            >
                                View Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    setResult(null);
                                    setFile(null);
                                    setPreview(null);
                                }}
                                className="flex-1 bg-white border-2 border-gray-200 text-forest py-3 rounded-lg font-medium hover:border-sage transition-colors"
                            >
                                Upload Another
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream p-4">
            <div className="max-w-2xl mx-auto py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/patient/dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-forest mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-playfair font-bold text-forest mb-2">
                        Upload Skin Photo
                    </h1>
                    <p className="text-gray-600">
                        Get AI-powered analysis and track your progress
                    </p>
                </div>

                {/* Guidelines */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-3">
                        📸 Photo Guidelines
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li>✓ Take photo in good natural lighting</li>
                        <li>✓ Face the camera directly</li>
                        <li>✓ Remove makeup if possible</li>
                        <li>✓ Keep a neutral expression</li>
                        <li>✓ Use the same angle each time for consistency</li>
                    </ul>
                </div>

                {/* Upload Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-luxury p-8"
                >
                    {!preview ? (
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive
                                    ? 'border-sage bg-sage/5'
                                    : 'border-gray-300 hover:border-sage'
                                }`}
                        >
                            <input {...getInputProps()} />
                            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                {isDragActive ? (
                                    <Upload className="w-8 h-8 text-sage" />
                                ) : (
                                    <Camera className="w-8 h-8 text-sage" />
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-forest mb-2">
                                {isDragActive
                                    ? 'Drop your photo here'
                                    : 'Click or drag to upload'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Supports JPG, JPEG, PNG (Max 5MB)
                            </p>
                            <button
                                type="button"
                                className="px-6 py-2 bg-forest text-white rounded-lg hover:bg-forest-dark transition-colors"
                            >
                                Choose File
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="relative mb-6">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-64 object-cover rounded-xl"
                                />
                                <button
                                    onClick={() => {
                                        setPreview(null);
                                        setFile(null);
                                    }}
                                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                                >
                                    <ImageIcon className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setPreview(null);
                                        setFile(null);
                                    }}
                                    className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-300 transition-colors"
                                >
                                    Change Photo
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="flex-1 bg-forest text-white py-3 rounded-lg font-medium hover:bg-forest-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5" />
                                            Upload & Analyze
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default PatientUpload;
