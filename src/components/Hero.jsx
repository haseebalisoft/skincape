import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Award, FlaskConical } from 'lucide-react';

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative min-h-screen gradient-sage overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-sage/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-forest/10 rounded-full blur-3xl"></div>

            <div className="section-container min-h-screen flex items-center">
                <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="space-y-8 z-10"
                    >
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="flex items-center gap-4"
                        >
                            <img src="/logo.png" alt="SkinScape PK" className="w-16 h-16 md:w-20 md:h-20" />
                            <div>
                                <h3 className="text-2xl md:text-3xl font-serif font-bold text-forest">SkinScape PK</h3>
                                <p className="text-sm text-forest/60">Aesthetic Dermatology</p>
                            </div>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="heading-primary text-balance"
                        >
                            Where Skin Science Meets{' '}
                            <span className="text-sage-dark">Timeless Beauty</span>
                        </motion.h1>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-body max-w-xl"
                        >
                            Advanced dermatology & aesthetic treatments designed for natural, confident results.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <a href="#appointment" className="btn-primary text-center">
                                Book Consultation
                            </a>
                            <a
                                href="/patient/login"
                                className="px-8 py-4 bg-sage text-white rounded-luxury font-medium hover:bg-sage-dark transition-all duration-300 shadow-md hover:shadow-lg text-center"
                            >
                                Virtual Skin Consult
                            </a>
                            <a
                                href="https://wa.me/923001234567"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary text-center"
                            >
                                WhatsApp Now
                            </a>
                        </motion.div>

                        {/* Floating Glassmorphism Trust Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="glass-card inline-block float-animation"
                        >
                            <div className="grid grid-cols-3 gap-6 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                                        <Star className="w-5 h-5 text-gold fill-gold" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-forest">4.9</p>
                                        <p className="text-xs text-forest/60">Rating</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-sage-dark" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-forest text-xs">Certified</p>
                                        <p className="text-xs text-forest/60">Experts</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center">
                                        <FlaskConical className="w-5 h-5 text-forest" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-forest text-xs">FDA</p>
                                        <p className="text-xs text-forest/60">Approved</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right: Abstract Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative w-full h-[600px]">
                            {/* Abstract Skin Layers Illustration */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-96 h-96">
                                    {/* Outer Glow */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            opacity: [0.3, 0.5, 0.3],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                        className="absolute inset-0 bg-sage/30 rounded-full blur-3xl"
                                    ></motion.div>

                                    {/* Middle Layer */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.05, 1],
                                            rotate: [0, 5, 0],
                                        }}
                                        transition={{
                                            duration: 6,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                        className="absolute inset-8 bg-gradient-to-br from-sage to-forest/20 rounded-full opacity-40"
                                    ></motion.div>

                                    {/* Inner Core */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.08, 1],
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                        className="absolute inset-16 bg-gradient-to-tr from-cream to-sage/50 rounded-full shadow-luxury"
                                    ></motion.div>

                                    {/* Floating Particles */}
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                y: [0, -20, 0],
                                                x: [0, Math.sin(i) * 10, 0],
                                                opacity: [0.5, 1, 0.5],
                                            }}
                                            transition={{
                                                duration: 3 + i * 0.5,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                                delay: i * 0.3,
                                            }}
                                            className="absolute w-3 h-3 bg-gold rounded-full"
                                            style={{
                                                top: `${20 + i * 12}%`,
                                                left: `${15 + i * 10}%`,
                                            }}
                                        ></motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 border-2 border-forest/30 rounded-full flex items-start justify-center p-2"
                >
                    <div className="w-1 h-2 bg-forest/50 rounded-full"></div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
