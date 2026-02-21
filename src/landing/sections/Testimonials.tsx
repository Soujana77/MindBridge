import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
    {
        quote: "MindEase has completely changed my mornings. Having someone to talk to without judgment is incredible.",
        author: "Sarah J.",
        role: "Verified Beta User"
    },
    {
        quote: "The personalized exercises are actually helpful. It doesn't feel like a robot; it feels like a support system.",
        author: "Michael R.",
        role: "Wellness Advocate"
    },
    {
        quote: "I was skeptical about AI, but the privacy focus and the quality of the interaction won me over.",
        author: "David L.",
        role: "Mental Health Professional"
    }
];

const Testimonials: React.FC = () => {
    return (
        <section id="testimonials" className="landing-section">
            <div className="landing-container">
                <div className="landing-text-center" style={{ marginBottom: '4rem' }}>
                    <h2 className="landing-h2">Real Stories, Real Impact</h2>
                    <div className="landing-flex landing-justify-center" style={{ gap: '0.25rem', marginBottom: '1rem' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={16} fill="var(--landing-accent)" color="var(--landing-accent)" />
                        ))}
                    </div>
                    <p className="landing-small">Trusted by over 10,000 early adopters</p>
                </div>

                <div className="landing-grid landing-testimonials-grid">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="landing-testimonial-card"
                        >
                            <p className="landing-p" style={{ fontSize: '1rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                                "{t.quote}"
                            </p>
                            <div>
                                <p className="landing-text-primary" style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.author}</p>
                                <p className="landing-small" style={{ fontSize: '0.75rem' }}>{t.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
