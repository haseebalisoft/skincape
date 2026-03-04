import express from 'express';
import Groq from 'groq-sdk';
import jwt from 'jsonwebtoken';
import Patient from '../models/Patient.js';

const router = express.Router();

let groq;
try {
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_')) {
        groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
    } else {
        console.warn('⚠️ GROQ_API_KEY is missing or invalid. Consultation AI will be disabled.');
    }
} catch (error) {
    console.error('Failed to initialize Groq client for consultation:', error);
}

/**
 * @route   POST /api/consultation/chat
 * @desc    AI-powered consultation chat
 * @access  Private (Patient)
 */
router.post('/chat', async (req, res) => {
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

        if (!groq) {
            return res.status(503).json({
                success: false,
                message: 'AI consultation service is currently unavailable.',
            });
        }

        const { message, conversationHistory } = req.body;

        const systemPrompt = `You are Dr. AI, a professional dermatologist conducting a virtual skin consultation for SkinScape PK clinic.

Patient Information:
- Name: ${patient.name}
- Email: ${patient.email}

Your Role:
1. Ask relevant questions about the patient's facial skin concerns in a warm, professional manner
2. Focus ONLY on facial skin issues (acne, pigmentation, wrinkles, dryness, oiliness, sensitivity, etc.)
3. Gather information about:
   - Primary skin concerns
   - Skin type (oily, dry, combination, sensitive, normal)
   - Medical history related to skin
   - Current skincare routine
   - Lifestyle factors (sun exposure, sleep, diet, stress)
   - Allergies or sensitivities
   - Previous treatments tried

4. Ask ONE question at a time
5. Be empathetic and encouraging
6. After gathering sufficient information (5-7 questions), provide:
   - A summary of their concerns
   - Preliminary recommendations
   - Suggest booking an in-person consultation for treatment

Important:
- Keep responses concise (2-3 sentences)
- Be professional but friendly
- Do NOT diagnose serious medical conditions
- Always recommend professional in-person consultation for treatment plans

Previous Consultation Data: ${JSON.stringify(patient.consultationData || {})}`;

        const messages = [
            { role: "system", content: systemPrompt },
            ...(conversationHistory || []),
            { role: "user", content: message }
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 500,
            top_p: 1,
            stream: false,
        });

        const reply = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

        // Save conversation to patient record
        if (!patient.consultationData) {
            patient.consultationData = {};
        }
        if (!patient.consultationData.consultationResponses) {
            patient.consultationData.consultationResponses = [];
        }

        patient.consultationData.consultationResponses.push({
            question: message,
            answer: reply,
            timestamp: new Date(),
        });

        await patient.save();

        res.json({
            success: true,
            reply,
            conversationHistory: [...messages, { role: "assistant", content: reply }],
        });

    } catch (error) {
        console.error('Consultation chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process consultation',
            error: error.message,
        });
    }
});

/**
 * @route   POST /api/consultation/start
 * @desc    Start a new consultation session
 * @access  Private (Patient)
 */
router.post('/start', async (req, res) => {
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

        const welcomeMessage = `Hello ${patient.name}! 👋 I'm Dr. AI, your virtual dermatology consultant at SkinScape PK.

I'm here to understand your facial skin concerns and help guide you toward the right treatment. This consultation will take about 5-10 minutes.

Let's start: What is your primary facial skin concern that brought you here today?`;

        res.json({
            success: true,
            message: welcomeMessage,
        });

    } catch (error) {
        console.error('Start consultation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start consultation',
        });
    }
});

export default router;
