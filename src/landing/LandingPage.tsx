import React from 'react';
import './landing.css';
import LandingNavbar from './components/LandingNavbar';
import LandingFooter from './components/LandingFooter';
import Hero from './sections/Hero';
import Features from './sections/Features';
import HowItWorks from './sections/HowItWorks';
import Testimonials from './sections/Testimonials';
import CTA from './sections/CTA';

const LandingPage: React.FC = () => {
    const handleGetStarted = () => {
        document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="landing-page-root">
            <LandingNavbar onGetStarted={handleGetStarted} />

            <main>
                <Hero />

                <div style={{ backgroundColor: 'var(--landing-bg-secondary)' }}>
                    <Features />
                </div>

                <HowItWorks />

                <div style={{ backgroundColor: 'var(--landing-bg-secondary)' }}>
                    <Testimonials />
                </div>

                <section id="cta-section">
                    <CTA />
                </section>
            </main>

            <LandingFooter />
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
