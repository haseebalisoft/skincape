import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

console.log('--- Email Configuration Debug ---');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Missing');
console.log('---------------------------------');

const runTest = async () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ Error: EMAIL_USER or EMAIL_PASS is missing in .env file.');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        console.log('Attempting to send test email...');
        const info = await transporter.sendMail({
            from: `"SkinScape Debug" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: 'SkinScape Email Configuration Test',
            text: 'If you are reading this, your email configuration is working perfectly! ✅',
        });

        console.log('✅ Success! Test email sent.');
        console.log('Message ID:', info.messageId);
        console.log('Check your inbox (and spam folder) for the email.');
    } catch (error) {
        console.error('❌ Failed to send email.');
        console.error('Error Details:', error.message);

        if (error.code === 'EAUTH') {
            console.log('\n💡 Tip: This is usually an authentication error.');
            console.log('1. Make sure "2-Step Verification" is ON in Google Account.');
            console.log('2. Make sure you are using an "App Password", NOT your login password.');
            console.log('3. Check for extra spaces in your .env file.');
        }
    }
};

runTest();
