import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Calendar,
    Clock,
    User,
    Phone,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminCalendarGrid = ({ selectedDate, onDateSelect }) => {
    const [viewDate, setViewDate] = useState(new Date(selectedDate));

    useEffect(() => {
        setViewDate(new Date(selectedDate));
    }, [selectedDate]);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(viewDate);

    const handlePrevMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setViewDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setViewDate(newDate);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h4 className="font-serif font-bold text-lg text-gray-900">
                    {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-xs font-bold uppercase tracking-wider text-gray-400 py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: days }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    const isToday = date.toDateString() === new Date().toDateString();

                    return (
                        <button
                            key={day}
                            onClick={() => onDateSelect(date)}
                            className={`
                                h-14 w-full rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all relative
                                ${isSelected
                                    ? 'bg-[#1a1a1a] text-white shadow-md'
                                    : isToday
                                        ? 'bg-tan/10 text-tan border border-tan'
                                        : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                                }
                            `}
                        >
                            <span className={isSelected ? 'text-white' : isToday ? 'font-bold' : ''}>{day}</span>
                            {/* In a real app, dot indicators would go here based on appointment counts */}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const AppointmentsAdmin = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState('daily'); // 'daily' or 'list'
    const queryClient = useQueryClient();

    // Format selected date YYYY-MM-DD
    const dateStr = selectedDate.toISOString().split('T')[0];

    const { data: appointments, isLoading } = useQuery({
        queryKey: ['adminAppointments', dateStr],
        queryFn: async () => {
            const response = await fetch(`http://localhost:5000/api/appointments?date=${dateStr}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch');
            return response.json();
        }
    });

    const { data: slotsData } = useQuery({
        queryKey: ['availableSlots', dateStr],
        queryFn: async () => {
            const response = await fetch(`http://localhost:5000/api/appointments/available-slots?date=${dateStr}`);
            if (!response.ok) throw new Error('Failed to fetch');
            return response.json();
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status, notes }) => {
            const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status, notes })
            });
            if (!response.ok) throw new Error('Failed to update');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['adminAppointments']);
            queryClient.invalidateQueries(['availableSlots']);
        }
    });

    const allSlots = [
        '10:00 AM', '11:00 AM', '12:00 PM',
        '02:00 PM', '03:00 PM', '04:00 PM',
        '05:00 PM', '06:00 PM',
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const getAppointmentForSlot = (time) => {
        return appointments?.data?.find(apt => apt.time === time);
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-100px)]">
            {/* Left: Calendar Navigation */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-gray-900">Appointments</h1>
                    <p className="text-gray-500 mt-1">Select a date to manage schedule</p>
                </div>

                <AdminCalendarGrid selectedDate={selectedDate} onDateSelect={setSelectedDate} />

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Summary for {selectedDate.toLocaleDateString()}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="block text-2xl font-bold text-gray-900">{appointments?.data?.length || 0}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Total Bookings</span>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <span className="block text-2xl font-bold text-green-700">
                                {appointments?.data?.filter(a => a.status === 'confirmed').length || 0}
                            </span>
                            <span className="text-xs text-green-700 uppercase tracking-wider">Confirmed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Detailed View */}
            <div className="lg:col-span-8 flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Schedule: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h2>
                        <span className="text-sm text-gray-500">
                            {slotsData?.data?.availableSlots?.length || 0} slots available
                        </span>
                    </div>

                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setView('daily')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${view === 'daily' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            <Clock className="w-4 h-4 inline mr-1" />
                            Timeline
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${view === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            <Calendar className="w-4 h-4 inline mr-1" />
                            List
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {view === 'daily' ? (
                        <div className="space-y-4">
                            {allSlots.map((slot) => {
                                const appointment = getAppointmentForSlot(slot);
                                const isAvailable = !appointment;

                                return (
                                    <div key={slot} className="flex gap-4">
                                        <div className="w-24 text-right pt-4 text-sm font-medium text-gray-400">
                                            {slot}
                                        </div>
                                        <div className="flex-1">
                                            {appointment ? (
                                                <div className={`p-4 rounded-lg border-l-4 shadow-sm ${appointment.status === 'confirmed' ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200'}`}>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-bold text-gray-900">{appointment.name}</h4>
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(appointment.status)}`}>
                                                                    {appointment.status}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {appointment.treatment}</span>
                                                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {appointment.phone}</span>
                                                            </div>
                                                            {appointment.concern && (
                                                                <p className="text-sm text-gray-500 bg-white/50 p-2 rounded italic">
                                                                    "{appointment.concern}"
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {appointment.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => updateStatusMutation.mutate({ id: appointment._id, status: 'confirmed' })}
                                                                        className="p-1.5 bg-white text-green-600 rounded shadow hover:bg-green-50 transition-colors" title="Confirm"
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateStatusMutation.mutate({ id: appointment._id, status: 'cancelled' })}
                                                                        className="p-1.5 bg-white text-red-600 rounded shadow hover:bg-red-50 transition-colors" title="Cancel"
                                                                    >
                                                                        <XCircle className="w-4 h-4" />
                                                                    </button>
                                                                </>
                                                            )}
                                                            {appointment.status === 'confirmed' && (
                                                                <button
                                                                    onClick={() => updateStatusMutation.mutate({ id: appointment._id, status: 'completed' })}
                                                                    className="p-1.5 bg-white text-blue-600 rounded shadow hover:bg-blue-50 transition-colors" title="Complete"
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-14 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 text-sm">
                                                    Available
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* List View logic (fallback if empty) */}
                            {appointments?.data?.length === 0 && <p className="text-center text-gray-500 py-8">No appointments today.</p>}
                            {appointments?.data?.map(apt => (
                                <div key={apt._id} className="bg-white border p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{apt.time} - {apt.name}</p>
                                        <p className="text-sm text-gray-500">{apt.treatment}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(apt.status)}`}>{apt.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentsAdmin;
