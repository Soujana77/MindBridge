import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    {
        number: "01",
        title: "Connect Securely",
        description: "Create your private account and set up your wellness preferences in minutes."
    },
    {
        number: "02",
        title: "Daily Check-ins",
        description: "Engage in meaningful conversations with your AI companion to track your mood and thoughts."
    },
    {
        number: "03",
        title: "Grow Together",
        description: "Receive personalized insights and exercises to help you build resilience and mindfulness."
    }
];

const HowItWorks: React.FC = () => {
    return (
        <section id="how-it-works" className="landing-section">
            <div className="landing-container">
                <div className="landing-text-center" style={{ marginBottom: '4rem' }}>
                    <h2 className="landing-h2">How It Works</h2>
                    <p className="landing-p" style={{ margin: '0 auto', maxWidth: '600px' }}>
                        A simple, intuitive path to better mental health, powered by advanced AI.
                    </p>
                </div>

                <div className="landing-flex landing-hiw-steps" style={{ flexWrap: 'wrap' }}>
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="landing-hiw-step"
                        >
                            <span className="landing-hiw-number">{step.number}</span>
                            <div style={{ position: 'relative', zIndex: 1, paddingTop: '1.5rem' }}>
                                <h3 className="landing-text-primary" style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
                                    {step.title}
                                </h3>
                                <p className="landing-small">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
