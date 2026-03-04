import express from 'express';
import { body, validationResult } from 'express-validator';
import Appointment from '../models/Appointment.js';
import { sendEmail, getAppointmentEmailTemplate } from '../utils/emailService.js';
import { sendWhatsApp, getAppointmentWhatsAppMessage } from '../utils/whatsappService.js';

const router = express.Router();

// Validation middleware
const validateAppointment = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('treatment').notEmpty().withMessage('Treatment is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').notEmpty().withMessage('Time is required'),
];

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Appointment created
 *       400:
 *         description: Validation error or time slot booked
 */
router.post('/', validateAppointment, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, phone, treatment, date, time, concern, email } = req.body; // Added email

        // Check for double booking
        const existingAppointment = await Appointment.findOne({
            date: new Date(date),
            time,
            status: { $in: ['pending', 'confirmed'] },
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked. Please choose another time.',
            });
        }

        const appointment = await Appointment.create({
            name,
            phone,
            treatment,
            date: new Date(date),
            time,
            concern,
            email // Save email if schema supports it or just use for notification
        });

        // Send Notifications
        // 1. WhatsApp to User/Admin (Simulated)
        const waMessage = getAppointmentWhatsAppMessage(appointment);
        sendWhatsApp(phone, waMessage); // To Customer
        sendWhatsApp(process.env.ADMIN_PHONE_NUMBER || 'admin', `New Booking: ${waMessage}`); // To Admin

        // 2. Email (if provided)
        if (email) {
            const emailHtml = getAppointmentEmailTemplate(appointment);
            sendEmail(email, 'Appointment Confirmation - SkinScape PK', emailHtml);
        }

        // Notify Admin via Email as well
        if (process.env.ADMIN_EMAIL) {
            const adminHtml = getAppointmentEmailTemplate(appointment);
            sendEmail(process.env.ADMIN_EMAIL, 'New Appointment Booking', adminHtml);
        }

        res.status(201).json({
            success: true,
            message: 'Appointment request received. We will contact you within 24 hours.',
            data: appointment,
        });
    } catch (error) {
        console.error('Appointment creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create appointment. Please try again.',
        });
    }
});

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments (Admin)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get('/', async (req, res) => {
    try {
        const { status, date, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (date) query.date = new Date(date);

        const appointments = await Appointment.find(query)
            .sort({ date: -1, time: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Appointment.countDocuments(query);

        res.json({
            success: true,
            data: appointments,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
        });
    }
});

/**
 * @swagger
 * /appointments/available-slots:
 *   get:
 *     summary: Get available time slots
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Available slots
 */
router.get('/available-slots', async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required',
            });
        }

        const allSlots = [
            '10:00 AM', '11:00 AM', '12:00 PM',
            '02:00 PM', '03:00 PM', '04:00 PM',
            '05:00 PM', '06:00 PM',
        ];

        const bookedAppointments = await Appointment.find({
            date: new Date(date),
            status: { $in: ['pending', 'confirmed'] },
        }).select('time');

        const bookedSlots = bookedAppointments.map(apt => apt.time);
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

        res.json({
            success: true,
            data: {
                date,
                availableSlots,
                bookedSlots,
            },
        });
    } catch (error) {
        console.error('Get available slots error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch available slots',
        });
    }
});

/**
 * @swagger
 * /appointments/{id}:
 *   patch:
 *     summary: Update appointment status (Admin)
 *     tags: [Appointments]
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
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated
 */
router.patch('/:id', async (req, res) => {
    try {
        const { status, notes } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status, notes },
            { new: true, runValidators: true }
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        // Notify user about status change
        if (status === 'confirmed' || status === 'cancelled') {
            const waMessage = `Update: Your appointment at SkinScape PK is now ${status.toUpperCase()}.`;
            sendWhatsApp(appointment.phone, waMessage);
        }

        res.json({
            success: true,
            message: 'Appointment updated successfully',
            data: appointment,
        });
    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update appointment',
        });
    }
});

export default router;
