import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Zap, Shield, Heart } from 'lucide-react';

const TrustIndicators = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const indicators = [
        {
            icon: Users,
            title: '10,000+',
            subtitle: 'Happy Patients',
        },
        {
            icon: Zap,
            title: 'Advanced',
            subtitle: 'Laser Technology',
        },
        {
            icon: Shield,
            title: 'Safe • Sterile',
            subtitle: 'Confidential',
        },
        {
            icon: Heart,
            title: 'Personalized',
            subtitle: 'Treatment Plans',
        },
    ];

    return (
        <section className="bg-white py-12 border-y border-warmGray">
            <div className="section-container !py-0">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    {indicators.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="flex flex-col items-center text-center gap-3 group"
                        >
                            <div className="w-14 h-14 rounded-full bg-sage/10 flex items-center justify-center group-hover:bg-sage/20 transition-all duration-300 group-hover:scale-110">
                                <item.icon className="w-7 h-7 text-sage-dark" />
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-lg text-forest">{item.title}</h3>
                                <p className="text-sm text-forest/60">{item.subtitle}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TrustIndicators;
