import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Sparkles,
    Droplet,
    Syringe,
    Beaker,
    Scissors,
    Smile,
    X,
    MessageCircle,
    Send,
    Bot,
    User
} from 'lucide-react';

const Services = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [selectedService, setSelectedService] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, showChat]);

    // Reset chat when service changes
    useEffect(() => {
        if (selectedService) {
            setChatMessages([{
                role: 'assistant',
                content: `Hello! I'm Dr. AI. I can answer any questions you have about ${selectedService.title}. Ask me anything!`
            }]);
            setShowChat(false);
        }
    }, [selectedService]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    context: selectedService
                })
            });

            const data = await response.json();

            if (data.success) {
                setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            } else {
                setChatMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again." }]);
            }
        } catch (error) {
            setChatMessages(prev => [...prev, { role: 'assistant', content: "Sorry, something went wrong. Please try again later." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleBookNow = () => {
        const title = selectedService.title;
        setSelectedService(null);
        setTimeout(() => {
            const element = document.getElementById('appointment');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                window.dispatchEvent(new CustomEvent('book-treatment', { detail: title }));
            }
        }, 100);
    };

    const services = [
        {
            icon: Sparkles,
            title: 'Pico Photofacial',
            description: 'Advanced laser treatment for skin rejuvenation',
            image: '/treatments/pico-laser.png',
            details: {
                what: 'Ultra-short pulse laser technology that targets pigmentation, fine lines, and skin texture without damaging surrounding tissue.',
                whoFor: 'Ideal for those with sun damage, age spots, uneven skin tone, or early signs of aging.',
                recovery: '1-2 days of mild redness',
                results: 'Visible improvement in 2-3 weeks, optimal results after 3-4 sessions',
            },
        },
        {
            icon: Droplet,
            title: 'PRP Therapy',
            description: 'Platelet-Rich Plasma for natural healing',
            image: '/treatments/prp-therapy.png',
            details: {
                what: 'Your own blood platelets are concentrated and re-injected to stimulate collagen production and tissue regeneration.',
                whoFor: 'Perfect for acne scars, fine lines, hair loss, and overall skin rejuvenation.',
                recovery: '24-48 hours of mild swelling',
                results: 'Gradual improvement over 4-6 weeks, best results after 3 sessions',
            },
        },
        {
            icon: Sparkles,
            title: 'Ultraglow Hydrafacial',
            description: 'Deep cleansing & hydration treatment',
            image: '/treatments/hydrafacial.png',
            details: {
                what: 'Multi-step facial treatment that cleanses, exfoliates, extracts impurities, and infuses skin with intensive serums.',
                whoFor: 'Suitable for all skin types, especially dull, congested, or dehydrated skin.',
                recovery: 'No downtime - immediate glow',
                results: 'Instant radiance, best with monthly maintenance',
            },
        },
        {
            icon: Syringe,
            title: 'Skin Boosters & Exosomes',
            description: 'Next-gen skin hydration & repair',
            image: '/treatments/hydrafacial.png',
            details: {
                what: 'Injectable hyaluronic acid and exosome therapy to deeply hydrate and regenerate skin at cellular level.',
                whoFor: 'Those seeking deep hydration, improved elasticity, and cellular renewal.',
                recovery: 'Minimal - tiny injection marks for 1-2 days',
                results: 'Visible glow within 1 week, lasting 4-6 months',
            },
        },
        {
            icon: Beaker,
            title: 'Chemical Peels',
            description: 'Controlled exfoliation for fresh skin',
            image: '/treatments/pico-laser.png',
            details: {
                what: 'Medical-grade acids remove dead skin layers to reveal smoother, brighter skin underneath.',
                whoFor: 'Effective for acne, pigmentation, fine lines, and rough texture.',
                recovery: '3-7 days of peeling depending on depth',
                results: 'Smoother skin in 1-2 weeks, series recommended',
            },
        },
        {
            icon: Scissors,
            title: 'Wart Removal',
            description: 'Safe & effective wart treatment',
            image: '/treatments/pico-laser.png',
            details: {
                what: 'Medical removal of warts using cryotherapy, laser, or electrocautery.',
                whoFor: 'Anyone with common warts, plantar warts, or skin tags.',
                recovery: '1-2 weeks healing time',
                results: 'Immediate removal, may need follow-up',
            },
        },
        {
            icon: Smile,
            title: 'Botox',
            description: 'Wrinkle relaxation & prevention',
            image: '/treatments/prp-therapy.png',
            details: {
                what: 'FDA-approved neurotoxin that temporarily relaxes facial muscles to smooth wrinkles.',
                whoFor: 'Forehead lines, crow\'s feet, frown lines, and preventative aging.',
                recovery: 'No downtime - avoid lying down for 4 hours',
                results: 'Visible in 3-5 days, peaks at 2 weeks, lasts 3-4 months',
            },
        },
        {
            icon: Sparkles,
            title: 'Whitening Injections',
            description: 'Skin brightening therapy',
            image: '/treatments/hydrafacial.png',
            details: {
                what: 'Glutathione-based IV therapy to reduce melanin production and promote overall skin brightness.',
                whoFor: 'Those seeking overall skin tone improvement and antioxidant benefits.',
                recovery: 'No downtime',
                results: 'Gradual lightening over 4-8 weeks with regular sessions',
            },
        },
    ];

    return (
        <section id="services" className="section-container bg-cream">
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h2 className="heading-secondary mb-4">Our Treatments</h2>
                <p className="text-body max-w-2xl mx-auto">
                    Evidence-based aesthetic treatments tailored to your unique skin needs
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        onClick={() => setSelectedService(service)}
                        className="service-card group overflow-hidden"
                    >
                        <div className="relative h-48 -mx-8 -mt-8 mb-6 overflow-hidden">
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                        </div>
                        <div className="w-14 h-14 rounded-full bg-sage/10 flex items-center justify-center mb-4 group-hover:bg-sage/20 transition-colors duration-300">
                            <service.icon className="w-7 h-7 text-sage-dark" />
                        </div>
                        <h3 className="heading-tertiary !text-xl mb-2">{service.title}</h3>
                        <p className="text-sm text-forest/70 mb-4">{service.description}</p>
                        <div className="flex items-center justify-between">
                            <button className="text-sage-dark font-medium text-sm hover:text-forest transition-colors">
                                Learn More →
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const element = document.getElementById('appointment');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                        window.dispatchEvent(new CustomEvent('book-treatment', { detail: service.title }));
                                    }
                                }}
                                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-white border border-sage/20 text-forest hover:bg-sage/10 rounded-full transition-colors z-10"
                            >
                                Book Now
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Service Modal */}
            <AnimatePresence>
                {selectedService && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedService(null)}
                        className="fixed inset-0 bg-forest/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-card max-w-4xl w-full p-0 relative max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-luxury"
                        >
                            {/* Left: Image & Toggle (Mobile) */}
                            <div className="hidden md:block w-1/3 relative flex-shrink-0">
                                <img
                                    src={selectedService.image}
                                    alt={selectedService.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                                        <selectedService.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-serif font-bold mb-2">{selectedService.title}</h2>
                                    <button
                                        onClick={() => setShowChat(!showChat)}
                                        className="mt-4 flex items-center gap-2 text-sm font-medium bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full transition-colors w-full justify-center"
                                    >
                                        {showChat ? <><Sparkles className="w-4 h-4" /> View Details</> : <><MessageCircle className="w-4 h-4" /> Chat with Specialist AI</>}
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Header (Visible only on mobile) */}
                            <div className="md:hidden h-48 relative w-full flex-shrink-0">
                                <img
                                    src={selectedService.image}
                                    alt={selectedService.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30" />
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h2 className="text-xl font-bold">{selectedService.title}</h2>
                                    <button
                                        onClick={() => setShowChat(!showChat)}
                                        className="mt-2 text-xs flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full"
                                    >
                                        {showChat ? 'View Details' : 'Chat with AI'}
                                    </button>
                                </div>
                            </div>


                            {/* Right: Content */}
                            <div className="flex-1 flex flex-col relative bg-white h-[500px] md:h-[600px]">
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="hidden md:flex absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 items-center justify-center transition-colors z-20"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>

                                {showChat ? (
                                    /* Chat Interface */
                                    <div className="flex flex-col h-full">
                                        <div className="p-4 border-b border-gray-100 bg-sage/5 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center">
                                                <Bot className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-forest text-sm">SkinScape Specialist AI</h4>
                                                <p className="text-xs text-forest/60">Ask about {selectedService.title}</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                            {chatMessages.map((msg, i) => (
                                                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-forest' : 'bg-sage'}`}>
                                                        {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                                    </div>
                                                    <div className={`p-3 rounded-lg text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-forest text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            ))}
                                            {isTyping && (
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center">
                                                        <Bot className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                                        <div className="flex gap-1">
                                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={chatEndRef} />
                                        </div>

                                        <div className="p-4 pt-2 bg-white border-t border-gray-100">
                                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={chatInput}
                                                    onChange={(e) => setChatInput(e.target.value)}
                                                    placeholder="Ask a question..."
                                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-sage text-sm"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!chatInput.trim() || isTyping}
                                                    className="p-2 bg-forest text-white rounded-full hover:bg-forest-dark transition-colors disabled:opacity-50"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            </form>
                                            <button
                                                onClick={handleBookNow}
                                                className="w-full mt-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-sage hover:bg-sage-dark rounded-md transition-colors"
                                            >
                                                Book Consultation Now
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Details Interface */
                                    <div className="p-8 h-full overflow-y-auto">
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="font-semibold text-forest mb-2 flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-sage" /> What is it?
                                                </h4>
                                                <p className="text-body text-sm leading-relaxed">{selectedService.details.what}</p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-forest mb-2 flex items-center gap-2">
                                                    <User className="w-4 h-4 text-sage" /> Who is it for?
                                                </h4>
                                                <p className="text-body text-sm leading-relaxed">{selectedService.details.whoFor}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-sage/5 rounded-luxury p-4">
                                                    <h4 className="font-semibold text-forest mb-1 text-sm">Recovery Time</h4>
                                                    <p className="text-xs text-forest/70">{selectedService.details.recovery}</p>
                                                </div>
                                                <div className="bg-sage/5 rounded-luxury p-4">
                                                    <h4 className="font-semibold text-forest mb-1 text-sm">Results</h4>
                                                    <p className="text-xs text-forest/70">{selectedService.details.results}</p>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-warmGray mt-auto">
                                                <button
                                                    onClick={handleBookNow}
                                                    className="btn-primary w-full text-center block mb-3"
                                                >
                                                    Book This Treatment
                                                </button>
                                                <button
                                                    onClick={() => setShowChat(true)}
                                                    className="w-full py-2 text-xs font-bold uppercase tracking-wider text-sage-dark border border-sage/20 hover:bg-sage/5 rounded-md transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    Ask AI About This
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Services;
