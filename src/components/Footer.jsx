import React from 'react';
import { MapPin, Phone, Mail, Instagram, Clock } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-forest text-cream">
            {/* Main Footer */}
            <div className="section-container">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/logo.png" alt="SkinScape PK" className="w-12 h-12" />
                            <div>
                                <h3 className="text-xl font-serif font-bold">SkinScape PK</h3>
                                <p className="text-xs text-cream/60">Aesthetic Dermatology</p>
                            </div>
                        </div>
                        <p className="text-sm text-cream/80 leading-relaxed">
                            Where skin science meets timeless beauty. Advanced dermatology & aesthetic treatments
                            for natural, confident results.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-serif font-semibold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#services"
                                    className="text-sm text-cream/80 hover:text-sage transition-colors"
                                >
                                    Our Treatments
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#appointment"
                                    className="text-sm text-cream/80 hover:text-sage transition-colors"
                                >
                                    Book Consultation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-cream/80 hover:text-sage transition-colors">
                                    Before & After
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-cream/80 hover:text-sage transition-colors">
                                    About Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-serif font-semibold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-cream/80">
                                    <p className="font-medium text-cream mb-1">DHA Phase 6</p>
                                    <p>Lahore, Pakistan</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-sage flex-shrink-0" />
                                <a
                                    href="tel:+923001234567"
                                    className="text-sm text-cream/80 hover:text-sage transition-colors"
                                >
                                    +92 300 1234567
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-sage flex-shrink-0" />
                                <a
                                    href="mailto:info@skinscapepk.com"
                                    className="text-sm text-cream/80 hover:text-sage transition-colors"
                                >
                                    info@skinscapepk.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Hours & Social */}
                    <div>
                        <h4 className="font-serif font-semibold text-lg mb-6">Clinic Hours</h4>
                        <div className="flex items-start gap-3 mb-6">
                            <Clock className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-cream/80">
                                <p>Mon - Sat: 10:00 AM - 8:00 PM</p>
                                <p>Sunday: By Appointment</p>
                            </div>
                        </div>

                        <h4 className="font-serif font-semibold text-lg mb-4">Follow Us</h4>
                        <div className="flex gap-3">
                            <a
                                href="https://instagram.com/skinscapepk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-cream/10 hover:bg-sage/20 flex items-center justify-center transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            {/* Add more social icons as needed */}
                        </div>
                    </div>
                </div>

                {/* Google Maps Embed */}
                <div className="mt-12 rounded-card overflow-hidden shadow-luxury">
                    <div className="bg-warmGray/20 h-64 flex items-center justify-center">
                        <div className="text-center">
                            <MapPin className="w-12 h-12 text-sage/50 mx-auto mb-3" />
                            <p className="text-cream/60">Google Maps Embed</p>
                            <p className="text-sm text-cream/40">
                                Replace with actual Google Maps iframe
                            </p>
                        </div>
                        {/* Replace with actual Google Maps embed:
            <iframe
              src="YOUR_GOOGLE_MAPS_EMBED_URL"
              width="100%"
              height="256"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            */}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-cream/10 mt-12">
                <div className="section-container !py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-cream/60">
                        <p>© 2026 SkinScape PK. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-sage transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-sage transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="hover:text-sage transition-colors">
                                Medical Disclaimer
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="bg-forest-dark">
                <div className="section-container !py-6">
                    <p className="text-xs text-cream/50 text-center leading-relaxed">
                        <strong>Medical Disclaimer:</strong> The information provided on this website is for
                        educational purposes only and is not intended as medical advice. Individual results may
                        vary. All treatments are performed by licensed medical professionals. Please consult
                        with our specialists to determine the best treatment plan for your specific needs.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
