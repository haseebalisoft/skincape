import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        treatment: {
            type: String,
            required: [true, 'Treatment selection is required'],
        },
        date: {
            type: Date,
            required: [true, 'Appointment date is required'],
        },
        time: {
            type: String,
            required: [true, 'Appointment time is required'],
        },
        concern: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
appointmentSchema.index({ date: 1, time: 1 });
appointmentSchema.index({ status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
