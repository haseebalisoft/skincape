import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    AlertCircle,
    Mail
} from 'lucide-react';
import { appointmentApi } from '../utils/api';

const CalendarGrid = ({ selectedDate, onDateSelect }) => {
    const [viewDate, setViewDate] = useState(new Date(selectedDate));

    // Ensure we reset to the selected date if it changes externally
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handlePrevMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() - 1);
        // Don't allow going back past current month if in current year
        if (newDate.getMonth() < today.getMonth() && newDate.getFullYear() === today.getFullYear()) return;
        setViewDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setViewDate(newDate);
    };

    const isDateDisabled = (day) => {
        const checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        return checkDate < today;
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h4 className="font-serif font-bold text-lg text-forest">
                    {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevMonth}
                        disabled={viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear()}
                        className="p-1 rounded-full hover:bg-warmGray text-forest/40 hover:text-forest transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-1 rounded-full hover:bg-warmGray text-forest/40 hover:text-forest transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-[10px] font-bold uppercase tracking-wider text-forest/40 py-2">
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
                    const disabled = isDateDisabled(day);

                    return (
                        <button
                            key={day}
                            onClick={() => !disabled && onDateSelect(date)}
                            disabled={disabled}
                            className={`
                                h-10 w-full rounded-md flex items-center justify-center text-sm font-medium transition-all
                                ${isSelected
                                    ? 'bg-forest text-white shadow-md'
                                    : disabled
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'hover:bg-sage/20 text-forest hover:text-forest-dark'
                                }
                            `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const Appointment = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        treatment: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        concern: '',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { data: slotsData, isLoading: isLoadingSlots, error: slotsError } = useQuery({
        queryKey: ['availableSlots', formData.date],
        queryFn: () => appointmentApi.getAvailableSlots(formData.date),
        enabled: !!formData.date,
    });

    const appointmentsMutation = useMutation({
        mutationFn: (data) => appointmentApi.create(data),
        onSuccess: () => {
            setIsSubmitted(true);
            window.scrollTo({ top: document.getElementById('appointment').offsetTop - 100, behavior: 'smooth' });
        },
    });

    const treatments = [
        'Pico Photofacial', 'PRP Therapy', 'Ultraglow Hydrafacial',
        'Skin Boosters & Exosomes', 'Chemical Peels', 'Wart Removal',
        'Botox', 'Whitening Injections', 'General Consultation',
    ];

    useEffect(() => {
        const handleBookTreatment = (e) => {
            if (e.detail) {
                setFormData(prev => ({ ...prev, treatment: e.detail }));
            }
        };

        window.addEventListener('book-treatment', handleBookTreatment);
        return () => window.removeEventListener('book-treatment', handleBookTreatment);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.time) {
            alert('Please select a time slot');
            return;
        }
        appointmentsMutation.mutate(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        const dateStr = date.toISOString().split('T')[0];
        setFormData({ ...formData, date: dateStr, time: '' });
    };

    const allSlots = [
        '10:00 AM', '11:00 AM', '12:00 PM',
        '02:00 PM', '03:00 PM', '04:00 PM',
        '05:00 PM', '06:00 PM',
    ];

    return (
        <section id="appointment" className="section-container bg-white relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231f3d36' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
            </div>

            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-16 relative z-10"
            >
                <div className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest text-sage-dark uppercase bg-sage/10 rounded-full">
                    Clinic Booking System
                </div>
                <h2 className="heading-secondary mb-4">Secure Your Session</h2>
                <p className="text-body max-w-2xl mx-auto">
                    Experience world-class skin care. Select your preferred date and time.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="max-w-5xl mx-auto relative z-10"
            >
                {!isSubmitted ? (
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Booking Form (Left for proper hierarchy in desktop) */}
                        <div className="lg:col-span-4 order-2 lg:order-1">
                            <div className="bg-cream rounded-card p-6 lg:p-8 shadow-soft border border-warmGray/50 h-full">
                                <h3 className="text-xl font-serif font-bold text-forest mb-6 flex items-center gap-2 border-b border-warmGray pb-4">
                                    <User className="w-5 h-5 text-sage-dark" />
                                    Your Details
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-forest/60 mb-1 block">Full Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-warmGray rounded-lg focus:outline-none focus:ring-1 focus:ring-sage text-sm" placeholder="e.g. Hassan Ahmed" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-forest/60 mb-1 block">Phone</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-warmGray rounded-lg focus:outline-none focus:ring-1 focus:ring-sage text-sm" placeholder="+92 300 1234567" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-forest/60 mb-1 block">Email (Optional)</label>
                                        <div className="relative">
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-warmGray rounded-lg focus:outline-none focus:ring-1 focus:ring-sage text-sm" placeholder="hassan@example.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-forest/60 mb-1 block">Treatment</label>
                                        <select name="treatment" value={formData.treatment} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-warmGray rounded-lg focus:outline-none focus:ring-1 focus:ring-sage text-sm">
                                            <option value="">Select treatment</option>
                                            {treatments.map((t, i) => <option key={i} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-forest/60 mb-1 block">Concern</label>
                                        <textarea name="concern" value={formData.concern} onChange={handleChange} rows="2" className="w-full px-4 py-2 bg-white border border-warmGray rounded-lg focus:outline-none focus:ring-1 focus:ring-sage text-sm resize-none"></textarea>
                                    </div>
                                    <button type="submit" disabled={appointmentsMutation.isPending} className="btn-primary w-full mt-4 flex justify-center">{appointmentsMutation.isPending ? 'Processing...' : 'Confirm Booking'}</button>
                                </form>
                            </div>
                        </div>

                        {/* Calendar & Slots (Right) */}
                        <div className="lg:col-span-8 order-1 lg:order-2">
                            <div className="bg-white rounded-card p-6 lg:p-8 shadow-luxury border border-sage/10 h-full">
                                <div className="grid md:grid-cols-2 gap-8 h-full">
                                    {/* Monthly Calendar */}
                                    <div className="border-r border-gray-100 pr-0 md:pr-8">
                                        <CalendarGrid selectedDate={selectedDate} onDateSelect={handleDateSelect} />
                                        <div className="mt-6 p-4 bg-forest/5 rounded-luxury border border-forest/10">
                                            <p className="text-xs text-forest/60 leading-relaxed italic">
                                                Selected: <span className="font-bold text-forest">{selectedDate.toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Time Slots */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-6">
                                            <Clock className="w-4 h-4 text-sage-dark" />
                                            <h4 className="text-sm font-bold text-forest uppercase tracking-widest">Available Slots</h4>
                                        </div>

                                        <div className="flex-1">
                                            {isLoadingSlots ? (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-warmGray/30 animate-pulse rounded-md" />)}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-3 content-start">
                                                    {allSlots.map((slot) => {
                                                        const isBooked = slotsData?.data?.bookedSlots?.includes(slot);
                                                        const isSelected = formData.time === slot;
                                                        return (
                                                            <button
                                                                key={slot}
                                                                type="button"
                                                                disabled={isBooked}
                                                                onClick={() => setFormData({ ...formData, time: slot })}
                                                                className={`py-2 px-2 rounded-md border text-xs font-bold transition-all ${isBooked ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through' : isSelected ? 'bg-sage border-sage text-forest shadow-md' : 'bg-white border-warmGray text-forest/70 hover:border-sage hover:text-forest'}`}
                                                            >
                                                                {slot}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-cream rounded-card p-12 shadow-luxury text-center border-2 border-sage/20 relative overflow-hidden">
                        <CheckCircle className="w-16 h-16 text-sage mx-auto mb-6" />
                        <h3 className="text-3xl font-serif font-bold text-forest mb-4">Request Sent!</h3>
                        <p className="text-lg text-forest/70 mb-8 max-w-lg mx-auto">
                            Thank you, <span className="text-forest font-bold">{formData.name}</span>. Your request for <span className="text-forest font-bold">{formData.treatment}</span> has been received.
                        </p>
                        <p className="text-sm text-forest/50">
                            We have sent a confirmation to your phone.
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
};

export default Appointment;
