import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const patientSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
        // Initial Consultation Data
        consultationData: {
            skinType: {
                type: String,
                enum: ['oily', 'dry', 'combination', 'sensitive', 'normal'],
            },
            primaryConcerns: [String],
            medicalHistory: String,
            allergies: String,
            currentMedications: String,
            previousTreatments: String,
            lifestyle: {
                sunExposure: String,
                smoking: Boolean,
                alcohol: Boolean,
                sleepHours: Number,
                waterIntake: String,
            },
            consultationResponses: [{
                question: String,
                answer: String,
                timestamp: {
                    type: Date,
                    default: Date.now,
                }
            }],
        },
        // Progress Tracking
        skinAnalysis: [{
            date: {
                type: Date,
                default: Date.now,
            },
            imageUrl: String,
            aiAnalysis: {
                acneScore: Number,
                pigmentationScore: Number,
                wrinkleScore: Number,
                overallHealthScore: Number,
                detectedIssues: [String],
                recommendations: [String],
            },
            notes: String,
        }],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
patientSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
patientSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
