import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import Patient from '../models/Patient.js';
import Groq from 'groq-sdk';

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const patientId = req.patientId;
        const uploadPath = path.join('uploads', 'patients', patientId);

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `skin-analysis-${timestamp}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
    }
});

// Middleware to verify patient token
const verifyPatientToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.patientId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
};

// AI Vision Analysis using Groq (or fallback to mock)
const analyzeSkinImage = async (imagePath) => {
    try {
        // For now, we'll use a mock analysis since Groq Vision might not be available
        // In production, you would integrate with OpenAI Vision or Google Cloud Vision

        // Mock AI analysis with realistic scores
        const mockAnalysis = {
            acneScore: Math.floor(Math.random() * 40) + 30, // 30-70
            pigmentationScore: Math.floor(Math.random() * 30) + 40, // 40-70
            wrinkleScore: Math.floor(Math.random() * 35) + 25, // 25-60
            overallHealthScore: Math.floor(Math.random() * 25) + 60, // 60-85
            detectedIssues: [
                'Mild acne on forehead',
                'Minor pigmentation on cheeks',
                'Fine lines around eyes'
            ],
            recommendations: [
                'Use a gentle cleanser twice daily',
                'Apply sunscreen SPF 30+ every morning',
                'Consider retinol treatment for fine lines',
                'Stay hydrated (8 glasses of water daily)',
                'Book a consultation for personalized treatment plan'
            ]
        };

        // TODO: Replace with actual AI vision API call
        // Example with OpenAI Vision:
        /*
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [{
                role: "user",
                content: [
                    { type: "text", text: "Analyze this facial skin image for acne, pigmentation, wrinkles, and overall health. Provide scores 0-100 and recommendations." },
                    { type: "image_url", image_url: { url: imagePath } }
                ]
            }],
            max_tokens: 500
        });
        */

        return mockAnalysis;
    } catch (error) {
        console.error('Skin analysis error:', error);
        throw error;
    }
};

/**
 * @route   POST /api/skin-analysis/upload
 * @desc    Upload skin image and get AI analysis
 * @access  Private (Patient)
 */
router.post('/upload', verifyPatientToken, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided',
            });
        }

        const patient = await Patient.findById(req.patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        // Get AI analysis
        const aiAnalysis = await analyzeSkinImage(req.file.path);

        // Create analysis record
        const analysisRecord = {
            date: new Date(),
            imageUrl: `/uploads/patients/${req.patientId}/${req.file.filename}`,
            aiAnalysis,
            notes: req.body.notes || '',
        };

        // Add to patient's skin analysis array
        if (!patient.skinAnalysis) {
            patient.skinAnalysis = [];
        }
        patient.skinAnalysis.push(analysisRecord);

        await patient.save();

        res.status(201).json({
            success: true,
            message: 'Image uploaded and analyzed successfully',
            data: {
                analysis: analysisRecord,
                improvement: calculateImprovement(patient.skinAnalysis),
            },
        });

    } catch (error) {
        console.error('Upload and analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload and analyze image',
            error: error.message,
        });
    }
});

/**
 * @route   GET /api/skin-analysis/progress
 * @desc    Get patient's progress data
 * @access  Private (Patient)
 */
router.get('/progress', verifyPatientToken, async (req, res) => {
    try {
        const patient = await Patient.findById(req.patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        const analyses = patient.skinAnalysis || [];

        if (analyses.length === 0) {
            return res.json({
                success: true,
                data: {
                    hasData: false,
                    message: 'No skin analysis data yet. Upload your first image to start tracking!',
                },
            });
        }

        // Calculate progress metrics
        const latestAnalysis = analyses[analyses.length - 1];
        const improvement = calculateImprovement(analyses);
        const trendData = generateTrendData(analyses);

        res.json({
            success: true,
            data: {
                hasData: true,
                latestAnalysis,
                improvement,
                trendData,
                totalUploads: analyses.length,
                firstUploadDate: analyses[0].date,
                lastUploadDate: latestAnalysis.date,
            },
        });

    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch progress data',
        });
    }
});

/**
 * @route   GET /api/skin-analysis/history
 * @desc    Get all skin analyses for patient
 * @access  Private (Patient)
 */
router.get('/history', verifyPatientToken, async (req, res) => {
    try {
        const patient = await Patient.findById(req.patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        res.json({
            success: true,
            data: patient.skinAnalysis || [],
        });

    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch history',
        });
    }
});

// Helper function to calculate improvement
function calculateImprovement(analyses) {
    if (analyses.length < 2) {
        return {
            hasComparison: false,
            message: 'Upload more images to track improvement',
        };
    }

    const latest = analyses[analyses.length - 1].aiAnalysis;
    const previous = analyses[analyses.length - 2].aiAnalysis;

    // Lower scores are better for acne, pigmentation, wrinkles
    // Higher score is better for overall health
    const acneImprovement = ((previous.acneScore - latest.acneScore) / previous.acneScore) * 100;
    const pigmentationImprovement = ((previous.pigmentationScore - latest.pigmentationScore) / previous.pigmentationScore) * 100;
    const wrinkleImprovement = ((previous.wrinkleScore - latest.wrinkleScore) / previous.wrinkleScore) * 100;
    const healthImprovement = ((latest.overallHealthScore - previous.overallHealthScore) / previous.overallHealthScore) * 100;

    const averageImprovement = (acneImprovement + pigmentationImprovement + wrinkleImprovement + healthImprovement) / 4;

    return {
        hasComparison: true,
        acneImprovement: Math.round(acneImprovement),
        pigmentationImprovement: Math.round(pigmentationImprovement),
        wrinkleImprovement: Math.round(wrinkleImprovement),
        healthImprovement: Math.round(healthImprovement),
        averageImprovement: Math.round(averageImprovement),
        trend: averageImprovement > 0 ? 'improving' : averageImprovement < 0 ? 'declining' : 'stable',
    };
}

// Helper function to generate trend data for graphs
function generateTrendData(analyses) {
    return analyses.map(analysis => ({
        date: analysis.date,
        acne: analysis.aiAnalysis.acneScore,
        pigmentation: analysis.aiAnalysis.pigmentationScore,
        wrinkles: analysis.aiAnalysis.wrinkleScore,
        health: analysis.aiAnalysis.overallHealthScore,
    }));
}

export default router;
