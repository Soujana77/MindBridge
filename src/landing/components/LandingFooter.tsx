import React from 'react';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';

const LandingFooter: React.FC = () => {
    return (
        <footer className="landing-footer">
            <div className="landing-container">
                <div className="landing-grid landing-footer-grid">
                    <div>
                        <div className="landing-flex landing-items-center" style={{ gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <Heart className="landing-accent" size={20} />
                            <span className="landing-h2" style={{ margin: 0, fontSize: '1.125rem' }}>MindEase</span>
                        </div>
                        <p className="landing-small" style={{ maxWidth: '250px' }}>
                            Building the future of mental wellness with compassionate AI companions.
                        </p>
                    </div>

                    <div>
                        <h4 className="landing-text-primary" style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600 }}>Product</h4>
                        <a href="#features" className="landing-footer-link">Features</a>
                        <a href="#pricing" className="landing-footer-link">Pricing</a>
                        <a href="#security" className="landing-footer-link">Security</a>
                    </div>

                    <div>
                        <h4 className="landing-text-primary" style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600 }}>Company</h4>
                        <a href="#about" className="landing-footer-link">About Us</a>
                        <a href="#careers" className="landing-footer-link">Careers</a>
                        <a href="#contact" className="landing-footer-link">Contact</a>
                    </div>

                    <div>
                        <h4 className="landing-text-primary" style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600 }}>Connect</h4>
                        <div className="landing-flex" style={{ gap: '1rem' }}>
                            <a href="#" className="landing-nav-link"><Twitter size={20} /></a>
                            <a href="#" className="landing-nav-link"><Linkedin size={20} /></a>
                            <a href="#" className="landing-nav-link"><Github size={20} /></a>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }} className="landing-flex landing-justify-between landing-items-center">
                    <p className="landing-small">© {new Date().getFullYear()} MindEase AI. All rights reserved.</p>
                    <div className="landing-flex" style={{ gap: '2rem' }}>
                        <a href="#" className="landing-small landing-nav-link">Privacy Policy</a>
                        <a href="#" className="landing-small landing-nav-link">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
