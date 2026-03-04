import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Service title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Service description is required'],
        },
        icon: {
            type: String,
            default: 'Sparkles',
        },
        details: {
            what: {
                type: String,
                required: true,
            },
            whoFor: {
                type: String,
                required: true,
            },
            recovery: {
                type: String,
                required: true,
            },
            results: {
                type: String,
                required: true,
            },
        },
        price: {
            type: Number,
            min: 0,
        },
        duration: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;
