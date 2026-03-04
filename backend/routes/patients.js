import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Patient from '../models/Patient.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id, role: 'patient' }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d',
    });
};

/**
 * @route   POST /api/patients/register
 * @desc    Register a new patient
 * @access  Public
 */
router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('name').notEmpty().withMessage('Name is required'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const { email, password, name, phone } = req.body;

            // Check if patient already exists
            const existingPatient = await Patient.findOne({ email });
            if (existingPatient) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered',
                });
            }

            // Create patient
            const patient = await Patient.create({
                email,
                password,
                name,
                phone,
            });

            // Generate token
            const token = generateToken(patient._id);

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: {
                    id: patient._id,
                    name: patient.name,
                    email: patient.email,
                    token,
                },
            });
        } catch (error) {
            console.error('Patient registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Registration failed',
            });
        }
    }
);

/**
 * @route   POST /api/patients/login
 * @desc    Login patient
 * @access  Public
 */
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const { email, password } = req.body;

            // Find patient and include password
            const patient = await Patient.findOne({ email }).select('+password');
            if (!patient) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }

            // Check password
            const isPasswordValid = await patient.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }

            // Generate token
            const token = generateToken(patient._id);

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    id: patient._id,
                    name: patient.name,
                    email: patient.email,
                    token,
                },
            });
        } catch (error) {
            console.error('Patient login error:', error);
            res.status(500).json({
                success: false,
                message: 'Login failed',
            });
        }
    }
);

/**
 * @route   GET /api/patients/me
 * @desc    Get current patient profile
 * @access  Private
 */
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const patient = await Patient.findById(decoded.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        res.json({
            success: true,
            data: patient,
        });
    } catch (error) {
        console.error('Get patient profile error:', error);
        res.status(401).json({
            success: false,
            message: 'Not authorized',
        });
    }
});

/**
 * @route   PATCH /api/patients/consultation
 * @desc    Update consultation data
 * @access  Private
 */
router.patch('/consultation', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const patient = await Patient.findById(decoded.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        // Update consultation data
        patient.consultationData = {
            ...patient.consultationData,
            ...req.body,
        };

        await patient.save();

        res.json({
            success: true,
            message: 'Consultation data updated',
            data: patient,
        });
    } catch (error) {
        console.error('Update consultation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update consultation data',
        });
    }
});

/**
 * @route   GET /api/patients/search
 * @desc    Search patients (Admin only)
 * @access  Private/Admin
 */
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
            });
        }

        const patients = await Patient.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } },
            ],
        }).select('-password').limit(20);

        res.json({
            success: true,
            data: patients,
        });
    } catch (error) {
        console.error('Search patients error:', error);
        res.status(500).json({
            success: false,
            message: 'Search failed',
        });
    }
});

/**
 * @route   GET /api/patients/:id
 * @desc    Get patient by ID (Admin only)
 * @access  Private/Admin
 */
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        res.json({
            success: true,
            data: patient,
        });
    } catch (error) {
        console.error('Get patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch patient',
        });
    }
});

export default router;
