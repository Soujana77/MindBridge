import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles } from 'lucide-react';

interface HeroProps {
    onGetStarted?: () => void;
    onLearnMore?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted, onLearnMore }) => {
    return (
        <section className="landing-hero">
            <div className="landing-container landing-text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="landing-hero-content"
                >
                    <div className="landing-flex landing-items-center landing-justify-center" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <span style={{
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            color: 'var(--landing-accent)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <Sparkles size={14} /> AI-Powered Wellness
                        </span>
                    </div>

                    <h1 className="landing-h1">
                        Mindful AI for a <span className="landing-accent">Balanced Life.</span>
                    </h1>

                    <p className="landing-p" style={{ margin: '0 auto 2.5rem', maxWidth: '600px' }}>
                        Your companion in the journey towards mental wellness. Personalized, private, and always here for you when you need it most.
                    </p>

                    <div className="landing-flex landing-items-center landing-justify-center" style={{ gap: '1rem' }}>
                        <button className="landing-btn landing-btn-primary" onClick={onGetStarted}>
                            Get Started
                        </button>
                        <button className="landing-btn landing-btn-outline" onClick={onLearnMore}>
                            Learn More
                        </button>
                    </div>

                    <div className="landing-flex landing-items-center landing-justify-center" style={{ gap: '2rem', marginTop: '4rem', opacity: 0.6 }}>
                        <div className="landing-flex landing-items-center" style={{ gap: '0.5rem' }}>
                            <Shield size={16} />
                            <span className="landing-small">Secure & Confidential</span>
                        </div>
                        <div className="landing-flex landing-items-center" style={{ gap: '0.5rem' }}>
                            <Shield size={16} />
                            <span className="landing-small">End-to-End Encrypted</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
