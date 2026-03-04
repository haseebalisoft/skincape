import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../../context/PatientContext';
import axios from 'axios';
import {
    Send,
    Bot,
    User,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Sparkles,
} from 'lucide-react';

const PatientConsultation = () => {
    const { patient, token } = usePatient();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [questionCount, setQuestionCount] = useState(0);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!token) {
            navigate('/patient/login');
            return;
        }

        startConsultation();
    }, [token, navigate]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const startConsultation = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/consultation/start',
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setMessages([
                    {
                        role: 'assistant',
                        content: response.data.message,
                    },
                ]);
            }
        } catch (error) {
            console.error('Failed to start consultation:', error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);
        setQuestionCount((prev) => prev + 1);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/consultation/chat',
                {
                    message: userMessage,
                    conversationHistory,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: response.data.reply },
                ]);
                setConversationHistory(response.data.conversationHistory);
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, something went wrong. Please try again.',
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100 px-4 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/patient/dashboard')}
                            className="text-gray-600 hover:text-forest transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-sage to-sage-dark rounded-full flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-forest">Dr. AI</h2>
                                <p className="text-xs text-gray-500">
                                    Virtual Dermatology Consultant
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">
                            Question {questionCount}
                        </div>
                        <div className="text-xs text-gray-500">of ~7</div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''
                                }`}
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user'
                                        ? 'bg-forest'
                                        : 'bg-gradient-to-br from-sage to-sage-dark'
                                    }`}
                            >
                                {msg.role === 'user' ? (
                                    <User className="w-5 h-5 text-white" />
                                ) : (
                                    <Bot className="w-5 h-5 text-white" />
                                )}
                            </div>
                            <div
                                className={`max-w-[70%] rounded-2xl p-4 ${msg.role === 'user'
                                        ? 'bg-forest text-white'
                                        : 'bg-white shadow-sm text-gray-800'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {msg.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-sage to-sage-dark rounded-full flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-white shadow-sm rounded-2xl p-4">
                                <div className="flex gap-1">
                                    <span
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: '0s' }}
                                    />
                                    <span
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: '0.2s' }}
                                    />
                                    <span
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: '0.4s' }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-100 px-4 py-4">
                <div className="max-w-4xl mx-auto">
                    {questionCount >= 7 && (
                        <div className="bg-sage/10 border border-sage/20 rounded-xl p-4 mb-4 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-sage-dark flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-forest mb-1">
                                    Consultation Complete!
                                </h4>
                                <p className="text-sm text-gray-700 mb-3">
                                    Thank you for sharing your skin concerns. Ready to track your
                                    progress?
                                </p>
                                <button
                                    onClick={() => navigate('/patient/upload')}
                                    className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-lg hover:bg-forest-dark transition-colors text-sm font-medium"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Upload Your First Photo
                                </button>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSend} className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your answer..."
                            disabled={isTyping}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="px-6 py-3 bg-forest text-white rounded-xl hover:bg-forest-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isTyping ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </form>

                    <p className="text-xs text-gray-500 text-center mt-3">
                        Your responses are saved and will help us provide personalized
                        recommendations
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PatientConsultation;
