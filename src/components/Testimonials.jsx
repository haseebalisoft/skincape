import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const testimonials = [
        {
            name: 'Ayesha K.',
            treatment: 'Pico Photofacial',
            rating: 5,
            text: 'I was hesitant at first, but the team at SkinScape made me feel so comfortable. My pigmentation has reduced significantly, and my skin looks brighter than ever. Highly recommend!',
            location: 'DHA, Lahore',
        },
        {
            name: 'Sara M.',
            treatment: 'PRP for Acne Scars',
            rating: 5,
            text: 'After years of struggling with acne scars, PRP therapy has been life-changing. The results are natural and my confidence has soared. Thank you, SkinScape!',
            location: 'Gulberg, Lahore',
        },
        {
            name: 'Fatima R.',
            treatment: 'Hydrafacial',
            rating: 5,
            text: 'The Hydrafacial is my monthly ritual now. My skin feels hydrated, glowing, and so smooth. The clinic is pristine and the staff is incredibly professional.',
            location: 'Cantt, Lahore',
        },
        {
            name: 'Hina A.',
            treatment: 'Botox',
            rating: 5,
            text: 'I wanted subtle results, not a frozen look. The doctor understood exactly what I needed. I look refreshed and natural - exactly what I hoped for.',
            location: 'Model Town, Lahore',
        },
        {
            name: 'Zainab S.',
            treatment: 'Chemical Peel',
            rating: 5,
            text: 'My skin texture has improved so much after the chemical peel series. The downtime was minimal and the results are worth it. Very happy with my experience!',
            location: 'Johar Town, Lahore',
        },
    ];

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-scroll
    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(timer);
    }, [currentIndex]);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    return (
        <section className="section-container bg-cream overflow-hidden">
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h2 className="heading-secondary mb-4">What Our Patients Say</h2>
                <p className="text-body max-w-2xl mx-auto">
                    Real stories from real people who trusted us with their skin
                </p>
            </motion.div>

            <div className="max-w-4xl mx-auto relative">
                {/* Testimonial Carousel */}
                <div className="relative h-[400px] md:h-[350px]">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                            className="absolute inset-0"
                        >
                            <div className="bg-white rounded-card p-8 md:p-12 shadow-soft h-full flex flex-col justify-between">
                                {/* Stars */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                                    ))}
                                </div>

                                {/* Testimonial Text */}
                                <blockquote className="text-lg md:text-xl text-forest/90 leading-relaxed mb-8 flex-grow">
                                    "{testimonials[currentIndex].text}"
                                </blockquote>

                                {/* Author Info */}
                                <div className="flex items-center gap-4">
                                    {/* Avatar Placeholder */}
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sage/30 to-forest/20 flex items-center justify-center">
                                        <span className="text-xl font-serif font-bold text-forest">
                                            {testimonials[currentIndex].name.charAt(0)}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="font-semibold text-forest">{testimonials[currentIndex].name}</p>
                                        <p className="text-sm text-forest/60">
                                            {testimonials[currentIndex].treatment} • {testimonials[currentIndex].location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                    <button
                        onClick={handlePrev}
                        className="w-12 h-12 rounded-full bg-white hover:bg-sage/10 shadow-soft flex items-center justify-center transition-all hover:scale-110"
                    >
                        <ChevronLeft className="w-6 h-6 text-forest" />
                    </button>

                    {/* Dots */}
                    <div className="flex gap-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setDirection(index > currentIndex ? 1 : -1);
                                    setCurrentIndex(index);
                                }}
                                className={`h-2 rounded-full transition-all ${index === currentIndex ? 'bg-sage w-8' : 'bg-sage/30 w-2'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        className="w-12 h-12 rounded-full bg-white hover:bg-sage/10 shadow-soft flex items-center justify-center transition-all hover:scale-110"
                    >
                        <ChevronRight className="w-6 h-6 text-forest" />
                    </button>
                </div>

                {/* Trust Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="mt-12 text-center"
                >
                    <div className="inline-flex items-center gap-3 bg-white rounded-luxury px-6 py-3 shadow-soft">
                        <div className="flex -space-x-2">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-sage/30 to-forest/20 border-2 border-white flex items-center justify-center"
                                >
                                    <span className="text-xs font-bold text-forest">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-forest">10,000+ Happy Patients</p>
                            <p className="text-sm text-forest/60">Join our satisfied community</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
