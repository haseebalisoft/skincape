export const appointmentApi = {
    create: async (data) => {
        const response = await fetch('http://localhost:5000/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Booking failed');
        }
        return response.json();
    },
    getAvailableSlots: async (date) => {
        const response = await fetch(`http://localhost:5000/api/appointments/available-slots?date=${date}`);
        if (!response.ok) throw new Error('Failed to fetch slots');
        return response.json();
    },
};
