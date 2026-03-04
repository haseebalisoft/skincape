import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Camera, Search, AlertCircle, ChevronRight, Check } from 'lucide-react';

const AISkinConsult = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [step, setStep] = useState(1);
    const [concern, setConcern] = useState('');
    const [skinType, setSkinType] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [report, setReport] = useState(null);

    const concerns = [
        'Active Acne',
        'Acne Scars',
        'Pigmentation / Sun Damage',
        'Fine Lines & Wrinkles',
        'Dullness / Uneven Tone',
        'Large Pores',
        'Hair Loss',
        'Sagging Skin',
    ];

    const skinTypes = ['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive'];

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        // Simulate AI analysis
        setTimeout(() => {
            const recommendations = getRecommendations(concern);
            setReport(recommendations);
            setIsAnalyzing(false);
            setStep(3);
        }, 2000);
    };

    const getRecommendations = (userConcern) => {
        const data = {
            'Active Acne': {
                advice: 'Your concern suggests active inflammation. We recommend a combination of medical-grade topicals and gentle professional extractions.',
                treatments: ['Chemical Peels', 'Hydrafacial', 'Doctor Consultation'],
                disclaimer: 'Acne can be hormonal or lifestyle-related. Accurate diagnosis requires clinical examination.',
            },
            'Acne Scars': {
                advice: 'Scars require collagen remodeling. Our regenerative protocols are highly effective for deep texture improvement.',
                treatments: ['PRP Therapy', 'Pico Laser', 'Skin Boosters'],
                disclaimer: 'Deep scars may require a series of treatments for optimal results.',
            },
            'Pigmentation / Sun Damage': {
                advice: 'Melanin-related concerns respond excellently to targeted laser wavelengths.',
                treatments: ['Pico Photofacial', 'Chemical Peels', 'Whitening IV'],
                disclaimer: 'Sun protection is mandatory post-treatment to maintain results.',
            },
            'Fine Lines & Wrinkles': {
                advice: 'Early signs of aging can be addressed through volume restoration and muscle relaxation.',
                treatments: ['Botox', 'Skin Boosters', 'Exosomes'],
                disclaimer: 'Aging is a natural process; we focus on natural-looking rejuvenation.',
            },
            // Fallback for others
            default: {
                advice: 'Your unique skin profile suggests a multi-modal approach for optimal long-term health.',
                treatments: ['General Consultation', 'Hydrafacial', 'Personalized Plan'],
                disclaimer: 'Clinical consultation is the gold standard for clinical diagnosis.',
            }
        };

        return data[userConcern] || data.default;
    };

    return (
        <section className="section-container bg-forest text-cream overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-sage/5 transform skew-x-12 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage/20 rounded-full text-sage border border-sage/30 mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium uppercase tracking-wider">AI-Powered Experience</span>
                    </div>
                    <h2 className="heading-secondary !text-cream mb-4">Virtual Skin Consult</h2>
                    <p className="text-cream/70 max-w-2xl mx-auto">
                        Get instant, science-backed guidance tailored to your skin concerns.
                        Our AI analyzes your needs to suggest the most effective clinical protocols.
                    </p>
                </motion.div>

                <div className="bg-white/5 backdrop-blur-md rounded-card border border-white/10 p-8 md:p-12 shadow-luxury">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h3 className="text-xl font-serif mb-6 text-center">What is your primary skin concern?</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {concerns.map((item) => (
                                            <button
                                                key={item}
                                                onClick={() => setConcern(item)}
                                                className={`p-4 rounded-luxury text-sm font-medium transition-all text-center border ${concern === item
                                                        ? 'bg-sage text-forest border-sage shadow-glow'
                                                        : 'bg-white/5 text-cream/70 border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        disabled={!concern}
                                        onClick={() => setStep(2)}
                                        className="btn-primary !bg-sage !text-forest disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        Continue <ChevronRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h3 className="text-xl font-serif mb-6 text-center">Describe your skin type</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {skinTypes.map((item) => (
                                            <button
                                                key={item}
                                                onClick={() => setSkinType(item)}
                                                className={`p-4 rounded-luxury text-sm font-medium transition-all text-center border ${skinType === item
                                                        ? 'bg-sage text-forest border-sage shadow-glow'
                                                        : 'bg-white/5 text-cream/70 border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4">
                                    <button onClick={() => setStep(1)} className="text-cream/50 hover:text-cream transition-colors">
                                        Back
                                    </button>
                                    <button
                                        disabled={isAnalyzing || !skinType}
                                        onClick={handleAnalyze}
                                        className="btn-primary !bg-sage !text-forest px-12"
                                    >
                                        {isAnalyzing ? (
                                            <span className="flex items-center gap-2">
                                                <Search className="w-4 h-4 animate-pulse" />
                                                Analyzing...
                                            </span>
                                        ) : (
                                            'Get AI Recommendations'
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && report && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-8"
                            >
                                <div className="bg-white rounded-card p-8 text-forest shadow-luxury">
                                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-warmGray">
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold text-forest">Your AI Analysis Report</h3>
                                            <p className="text-sm text-forest/50 uppercase tracking-widest mt-1">Report ID: SS-PK-{Math.floor(Math.random() * 9000) + 1000}</p>
                                        </div>
                                        <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center">
                                            <Check className="w-8 h-8 text-sage-dark" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="font-bold uppercase text-xs tracking-widest text-sage-dark mb-2">Our Analysis</h4>
                                                <p className="text-forest/80 leading-relaxed">{report.advice}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold uppercase text-xs tracking-widest text-sage-dark mb-2">Suggested Clinical Protocols</h4>
                                                <ul className="space-y-3">
                                                    {report.treatments.map((t) => (
                                                        <li key={t} className="flex items-center gap-2 text-sm font-medium">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                                                            {t}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-cream rounded-luxury border border-warmGray space-y-4">
                                            <div className="flex items-start gap-3 mt-1 text-sage-dark">
                                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                                <p className="text-xs italic leading-relaxed text-forest/70">
                                                    {report.disclaimer}
                                                </p>
                                            </div>
                                            <button className="btn-primary w-full text-sm py-3" onClick={() => (window.location.hash = 'appointment')}>
                                                Lock-in Consultation
                                            </button>
                                            <p className="text-[10px] text-center text-forest/50 px-4 uppercase tracking-tighter">
                                                * This AI tool provides general guidance and is NOT a medical diagnosis.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button onClick={() => { setStep(1); setConcern(''); setSkinType(''); }} className="text-cream/50 hover:text-cream transition-colors text-sm underline underline-offset-4">
                                        Restart Consultation
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default AISkinConsult;
