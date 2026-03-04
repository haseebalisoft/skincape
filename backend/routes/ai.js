import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

let groq;
try {
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_')) {
        groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
    } else {
        console.warn('⚠️ GROQ_API_KEY is missing or invalid. AI features will be disabled.');
    }
} catch (error) {
    console.error('Failed to initialize Groq client:', error);
}

router.post('/chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!groq) {
            return res.status(503).json({
                success: false,
                message: 'AI service is currently unavailable. Please contact the clinic directly.'
            });
        }

        const systemPrompt = `You are an expert aesthetic consultant for SkinScape PK. 
        The user is interested in the treatment: "${context?.title}".
        
        Treatment Details: 
        - Description: ${context?.description}
        - What it is: ${context?.details?.what}
        - Who is it for: ${context?.details?.whoFor}
        - Recovery: ${context?.details?.recovery}
        - Results: ${context?.details?.results}

        Your Goal:
        1. Answer the user's question accurately based on the treatment details.
        2. Be professional, empathetic, and encouraging.
        3. Keep answers concise (under 3 sentences if possible).
        4. If the user asks about pricing, say "Please book a consultation for a personalized quote."
        5. At the end of your answer, gently encourage them to book a consultation if they seem interested.

        User Question: ${message}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null
        });

        const reply = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

        res.json({
            success: true,
            reply: reply
        });

    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to communicate with AI',
            error: error.message
        });
    }
});

export default router;
