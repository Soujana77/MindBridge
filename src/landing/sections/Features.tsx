import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ShieldCheck, HeartPulse, BrainCircuit } from 'lucide-react';

const features = [
    {
        icon: <MessageCircle className="landing-feature-icon" />,
        title: "24/7 Compassionate Support",
        description: "An AI companion that never sleeps, offering empathy and guidance whenever you need someone to talk to."
    },
    {
        icon: <ShieldCheck className="landing-feature-icon" />,
        title: "Complete Privacy",
        description: "Your data is yours alone. We use state-of-the-art encryption to ensure your conversations remain private."
    },
    {
        icon: <HeartPulse className="landing-feature-icon" />,
        title: "Personalized Wellness",
        description: "Adaptive journals and mood tracking that learn your patterns and provide tailored coping strategies."
    },
    {
        icon: <BrainCircuit className="landing-feature-icon" />,
        title: "Expert-Backed Frameworks",
        description: "Built on proven clinical methods like CBT and DBT to provide safe and effective mental support."
    }
];

const Features: React.FC = () => {
    return (
        <section id="features" className="landing-section">
            <div className="landing-container">
                <div className="landing-text-center" style={{ marginBottom: '4rem' }}>
                    <h2 className="landing-h2">Designed for Your Well-being</h2>
                    <p className="landing-p" style={{ margin: '0 auto', maxWidth: '600px' }}>
                        Powerful tools and compassionate AI designed to help you navigate life's challenges.
                    </p>
                </div>

                <div className="landing-grid landing-features-grid">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="landing-feature-card"
                        >
                            {feature.icon}
                            <h3 className="landing-text-primary" style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
                                {feature.title}
                            </h3>
                            <p className="landing-small">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
