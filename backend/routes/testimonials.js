import express from 'express';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Testimonials
 *   description: Testimonial management
 */

/**
 * @swagger
 * /testimonials:
 *   get:
 *     summary: Get approved testimonials
 *     tags: [Testimonials]
 *     parameters:
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Testimonial'
 */
router.get('/', async (req, res) => {
    try {
        const { featured } = req.query;

        const query = { isApproved: true };
        if (featured === 'true') query.isFeatured = true;

        const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: testimonials,
        });
    } catch (error) {
        console.error('Get testimonials error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch testimonials',
        });
    }
});

/**
 * @swagger
 * /testimonials:
 *   post:
 *     summary: Submit a new testimonial
 *     tags: [Testimonials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               message:
 *                 type: string
 *               rating:
 *                 type: number
 *                 min: 1
 *                 max: 5
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Testimonial submitted
 */
router.post('/', async (req, res) => {
    try {
        const testimonial = await Testimonial.create({
            ...req.body,
            isApproved: false, // Requires admin approval
        });

        res.status(201).json({
            success: true,
            message: 'Thank you for your testimonial! It will be reviewed shortly.',
            data: testimonial,
        });
    } catch (error) {
        console.error('Create testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit testimonial',
        });
    }
});

/**
 * @swagger
 * /testimonials/{id}:
 *   patch:
 *     summary: Update testimonial (Admin)
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isApproved:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Testimonial updated
 */
router.patch('/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found',
            });
        }

        res.json({
            success: true,
            message: 'Testimonial updated successfully',
            data: testimonial,
        });
    } catch (error) {
        console.error('Update testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update testimonial',
        });
    }
});

export default router;
