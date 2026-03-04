import React from 'react';
import Hero from '../components/Hero';
import TrustIndicators from '../components/TrustIndicators';
import Services from '../components/Services';
import BeforeAfter from '../components/BeforeAfter';
import DoctorStory from '../components/DoctorStory';
import Appointment from '../components/Appointment';
import Testimonials from '../components/Testimonials';
import AISkinConsult from '../components/AISkinConsult';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

const LandingPage = () => {
    return (
        <>
            <div className="min-h-screen bg-cream overflow-x-hidden">
                <Hero />
                <TrustIndicators />
                <Services />
                <BeforeAfter />
                <DoctorStory />
                <Appointment />
                <AISkinConsult />
                <Testimonials />
                <Footer />
                <WhatsAppFloat />
            </div>
        </>
    );
};

export default LandingPage;
