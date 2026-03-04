import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
    return (
        <a
            href="https://wa.me/923001234567?text=Hi! I'd like to book a consultation at SkinScape PK"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float group"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </a>
    );
};

export default WhatsAppFloat;
