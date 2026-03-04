import express from 'express';
import Appointment from '../models/Appointment.js';
import Testimonial from '../models/Testimonial.js';
import Service from '../models/Service.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Admin dashboard statistics
 */

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const totalAppointments = await Appointment.countDocuments();
        const pendingReviews = await Testimonial.countDocuments({ isApproved: false });
        const totalServices = await Service.countDocuments({ isActive: true });

        res.json({
            success: true,
            data: {
                totalAppointments,
                pendingReviews,
                totalServices,
            },
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard stats',
        });
    }
});

export default router;
