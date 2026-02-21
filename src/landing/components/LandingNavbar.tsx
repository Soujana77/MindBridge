import React from 'react';
import { Heart } from 'lucide-react';

interface NavbarProps {
    onGetStarted?: () => void;
}

const LandingNavbar: React.FC<NavbarProps> = ({ onGetStarted }) => {
    return (
        <nav className="landing-navbar">
            <div className="landing-container landing-flex landing-items-center landing-justify-between">
                <div className="landing-flex landing-items-center" style={{ gap: '0.5rem' }}>
                    <Heart className="landing-accent" size={24} />
                    <span className="landing-h2" style={{ margin: 0, fontSize: '1.25rem' }}>MindEase</span>
                </div>

                <div className="landing-flex landing-items-center landing-nav-links">
                    <a href="#features" className="landing-nav-link">Features</a>
                    <a href="#how-it-works" className="landing-nav-link">How it Works</a>
                    <a href="#testimonials" className="landing-nav-link">Stories</a>
                    <button
                        className="landing-btn landing-btn-primary"
                        onClick={onGetStarted}
                        style={{ marginLeft: '1rem' }}
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default LandingNavbar;
