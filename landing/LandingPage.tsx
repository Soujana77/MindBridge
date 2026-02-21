import React from 'react';
import './landing.css';
import LandingNavbar from './components/LandingNavbar';
import LandingFooter from './components/LandingFooter';
import Hero from './sections/Hero';
import Features from './sections/Features';
import HowItWorks from './sections/HowItWorks';
import Testimonials from './sections/Testimonials';
import CTA from './sections/CTA';

interface LandingPageProps {
    onGetStarted?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const handleGetStarted = () => {
        if (onGetStarted) {
            onGetStarted();
        }
    };

    const handleLearnMore = () => {
        document.getElementById('landing-footer')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="landing-page-root">
            <LandingNavbar onGetStarted={handleGetStarted} />

            <main>
                <Hero onGetStarted={handleGetStarted} onLearnMore={handleLearnMore} />

                <div style={{ backgroundColor: 'var(--landing-bg-secondary)' }}>
                    <Features />
                </div>

                <HowItWorks />

                <div style={{ backgroundColor: 'var(--landing-bg-secondary)' }}>
                    <Testimonials />
                </div>

                <section id="cta-section">
                    <CTA onGetStarted={handleGetStarted} />
                </section>
            </main>

            <div id="landing-footer">
                <LandingFooter />
            </div>
        </div>
    );
};

export default LandingPage;
export {
    LandingNavbar,
    LandingFooter,
    Hero,
    Features,
    HowItWorks,
    Testimonials,
    CTA
};
