import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    displayname: 'SkinScape PK',
    service: 'gmail', // You can use other services like SendGrid, Outlook, etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email app password
    },
});

export const sendEmail = async (to, subject, html) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('⚠️ Email credentials not found in .env. Email sending skipped.');
            console.log(`[Mock Email] To: ${to}, Subject: ${subject}`);
            return;
        }

        const info = await transporter.sendMail({
            from: `"SkinScape PK" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw error to prevent blocking main flow
    }
};

export const getAppointmentEmailTemplate = (appointment) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #1a1a1a;">Appointment Confirmation</h1>
                <p style="color: #666;">Thank you for choosing SkinScape PK</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; color: #333;">Appointment Details</h3>
                <p><strong>Patient Name:</strong> ${appointment.name}</p>
                <p><strong>Treatment:</strong> ${appointment.treatment}</p>
                <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
                <p><strong>Status:</strong> <span style="color: ${appointment.status === 'confirmed' ? 'green' : 'orange'}">${appointment.status.toUpperCase()}</span></p>
            </div>

            <p style="color: #666; font-size: 14px;">
                Please arrive 10 minutes before your scheduled time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.
            </p>
            
            <div style="text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                <p style="color: #999; font-size: 12px;">SkinScape PK • DHA Phase 6 • Lahore</p>
            </div>
        </div>
    `;
};
