import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
    return (
        <section className="landing-section">
            <div className="landing-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="landing-cta landing-text-center"
                >
                    <h2 className="landing-h2">Ready to find your balance?</h2>
                    <p className="landing-p" style={{ margin: '0 auto 2.5rem', maxWidth: '500px' }}>
                        Join MindEase today and start your journey towards a more mindful and resilient life.
                    </p>
                    <div className="landing-flex landing-items-center landing-justify-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                        <button className="landing-btn landing-btn-primary" style={{ gap: '0.5rem' }}>
                            Get Started for Free <ArrowRight size={18} />
                        </button>
                        <p className="landing-small" style={{ width: '100%', marginTop: '1rem' }}>
                            No credit card required. 7-day free trial.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
