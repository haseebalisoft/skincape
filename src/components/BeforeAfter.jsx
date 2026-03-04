import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BeforeAfter = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [sliderPosition, setSliderPosition] = useState(50);

    // Real patient results
    const results = [
        {
            treatment: 'Pico Photofacial',
            description: 'Pigmentation & Sun Damage Treatment',
            beforeText: 'Before',
            afterText: 'After 3 Sessions',
            image: '/before-after/pigmentation.png',
        },
        {
            treatment: 'PRP Therapy',
            description: 'Acne Scar Reduction',
            beforeText: 'Before',
            afterText: 'After 4 Sessions',
            image: '/before-after/acne-scars.png',
        },
        {
            treatment: 'Chemical Peel',
            description: 'Skin Texture Improvement',
            beforeText: 'Before',
            afterText: 'After 6 Weeks',
            image: '/before-after/pigmentation.png', // Using pigmentation image as placeholder
        },
    ];

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? results.length - 1 : prev - 1));
        setSliderPosition(50);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === results.length - 1 ? 0 : prev + 1));
        setSliderPosition(50);
    };

    return (
        <section className="section-container bg-white">
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h2 className="heading-secondary mb-4">Real Results</h2>
                <p className="text-body max-w-2xl mx-auto">
                    See the transformative results our patients have achieved
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="max-w-4xl mx-auto"
            >
                <div className="bg-cream rounded-card p-8 shadow-soft">
                    {/* Treatment Info */}
                    <div className="text-center mb-8">
                        <h3 className="heading-tertiary mb-2">{results[currentIndex].treatment}</h3>
                        <p className="text-forest/70">{results[currentIndex].description}</p>
                    </div>

                    {/* Before/After Slider */}
                    <div className="relative aspect-[4/3] bg-warmGray rounded-luxury overflow-hidden mb-6 group">
                        {/* Before/After Image */}
                        <img
                            src={results[currentIndex].image}
                            alt={`${results[currentIndex].treatment} results`}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Slider Handle */}
                        <div
                            className="absolute top-0 bottom-0 w-1 bg-white shadow-luxury cursor-ew-resize z-10"
                            style={{ left: `${sliderPosition}%` }}
                            onMouseDown={(e) => {
                                const sliderContainer = e.currentTarget.parentElement;

                                const handleMouseMove = (moveEvent) => {
                                    if (!sliderContainer) return;
                                    const rect = sliderContainer.getBoundingClientRect();
                                    const x = moveEvent.clientX - rect.left;
                                    const percentage = (x / rect.width) * 100;
                                    setSliderPosition(Math.max(0, Math.min(100, percentage)));
                                };

                                const handleMouseUp = () => {
                                    document.removeEventListener('mousemove', handleMouseMove);
                                    document.removeEventListener('mouseup', handleMouseUp);
                                };

                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                            }}
                        >
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-luxury flex items-center justify-center">
                                <div className="flex gap-1">
                                    <ChevronLeft className="w-4 h-4 text-forest" />
                                    <ChevronRight className="w-4 h-4 text-forest" />
                                </div>
                            </div>
                        </div>

                        {/* Labels */}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-forest">
                            {results[currentIndex].beforeText}
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-forest">
                            {results[currentIndex].afterText}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePrevious}
                            className="w-12 h-12 rounded-full bg-sage/10 hover:bg-sage/20 flex items-center justify-center transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-forest" />
                        </button>

                        <div className="flex gap-2">
                            {results.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentIndex(index);
                                        setSliderPosition(50);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-sage w-8' : 'bg-sage/30'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-12 h-12 rounded-full bg-sage/10 hover:bg-sage/20 flex items-center justify-center transition-colors"
                        >
                            <ChevronRight className="w-6 h-6 text-forest" />
                        </button>
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-8 pt-6 border-t border-warmGray">
                        <p className="text-xs text-center text-forest/50 italic">
                            * Results may vary from person to person. Individual results depend on various factors
                            including skin type, age, lifestyle, and adherence to treatment protocols.
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default BeforeAfter;
