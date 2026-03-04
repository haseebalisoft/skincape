import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        treatment: {
            type: String,
            required: [true, 'Treatment is required'],
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: 1,
            max: 5,
            default: 5,
        },
        text: {
            type: String,
            required: [true, 'Testimonial text is required'],
        },
        location: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
