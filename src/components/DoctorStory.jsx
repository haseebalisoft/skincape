import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';

const DoctorStory = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section className="section-container bg-cream">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                {/* Left: Doctor Image */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, x: -30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <div className="relative aspect-[3/4] rounded-card overflow-hidden shadow-luxury">
                        <img
                            src="/team/doctor.png"
                            alt="Dr. SkinScape"
                            className="w-full h-full object-cover"
                        />
                        {/* Decorative Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent" />
                    </div>

                    {/* Floating Credential Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="absolute -bottom-6 -left-6 glass-card"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-sage-dark"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-forest text-sm">Board Certified</p>
                                <p className="text-xs text-forest/60">Dermatologist</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right: Story Content */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="inline-block">
                        <Quote className="w-12 h-12 text-sage/30" />
                    </div>

                    <h2 className="heading-secondary">
                        We Don't Chase Trends. We Focus on{' '}
                        <span className="text-sage-dark">Safe, Ethical & Long-Term Skin Health.</span>
                    </h2>

                    <div className="space-y-4 text-body">
                        <p>
                            At SkinScape PK, we believe that true beauty comes from healthy, well-cared-for skin.
                            Our approach is rooted in medical science, not fleeting trends.
                        </p>

                        <p>
                            Every treatment we offer is FDA-approved, evidence-based, and tailored to your unique
                            skin type and concerns. We take the time to understand your goals and create a
                            personalized treatment plan that delivers natural, lasting results.
                        </p>

                        <p className="font-medium text-forest">
                            Your safety, comfort, and confidence are our highest priorities.
                        </p>
                    </div>

                    {/* Credentials */}
                    <div className="grid grid-cols-2 gap-4 pt-6">
                        <div className="bg-white rounded-luxury p-4 shadow-soft">
                            <p className="text-2xl font-serif font-bold text-sage-dark mb-1">15+</p>
                            <p className="text-sm text-forest/70">Years Experience</p>
                        </div>
                        <div className="bg-white rounded-luxury p-4 shadow-soft">
                            <p className="text-2xl font-serif font-bold text-sage-dark mb-1">10K+</p>
                            <p className="text-sm text-forest/70">Happy Patients</p>
                        </div>
                    </div>

                    <div className="pt-6">
                        <a href="#appointment" className="btn-primary inline-block">
                            Meet Our Team
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DoctorStory;
