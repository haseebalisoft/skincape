
// This is a placeholder for WhatsApp Business API integration
// To use real WhatsApp messaging, you would typically use a provider like Twilio, MessageBird, or Meta Cloud API

export const sendWhatsApp = async (to, message) => {
    try {
        // Normalize phone number (remove spaces, ensure country code)
        // This is where you would integrate your actual API call

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

        if (accountSid && authToken && fromNumber) {
            // const client = require('twilio')(accountSid, authToken);
            // await client.messages.create({
            //     body: message,
            //     from: `whatsapp:${fromNumber}`,
            //     to: `whatsapp:${to}`
            // });
            // console.log(`✅ WhatsApp sent to ${to}`);
        } else {
            // Mock output for development
            console.log('---------------------------------------------------');
            console.log('📱 [MOCK WHATSAPP] Message would be sent here');
            console.log(`To: ${to}`);
            console.log(`Body: ${message}`);
            console.log('---------------------------------------------------');
        }
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
    }
};

export const getAppointmentWhatsAppMessage = (appointment) => {
    return `Hello ${appointment.name}, your appointment for ${appointment.treatment} at SkinScape PK is scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}. Status: ${appointment.status.toUpperCase()}. See you soon!`;
};
