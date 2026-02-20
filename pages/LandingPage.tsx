import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Shield, Heart, Zap } from 'lucide-react';

const LandingPage = () => {
  const { setActivePage } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-2xl text-slate-800">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg"></div> MindBridge
        </div>
        <button 
           onClick={() => setActivePage('DASHBOARD')}
           className="text-sm font-semibold text-slate-600 hover:text-indigo-600"
        >
          Login
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm mb-6">
          For Higher Education Students
        </span>
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
          Accessible. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Confidential.</span> Supportive.
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed">
          Your digital mental health companion. Track your mood, chat with our compassionate AI, or book a counselor discreetly—all in one place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={() => setActivePage('DASHBOARD')}
            className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
          >
            Get Started <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => setActivePage('CHATBOT')}
            className="bg-white text-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm"
          >
            Talk to AI
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
           <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                 <Shield />
              </div>
              <h3 className="font-bold text-lg mb-2">100% Confidential</h3>
              <p className="text-sm text-slate-500">Your data is anonymous and secure. We prioritize your privacy above all else.</p>
           </div>
           <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 mb-4">
                 <Heart />
              </div>
              <h3 className="font-bold text-lg mb-2">Emotional Support</h3>
              <p className="text-sm text-slate-500">From AI journaling to peer forums, find the support system that works for you.</p>
           </div>
           <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                 <Zap />
              </div>
              <h3 className="font-bold text-lg mb-2">Wellness Gamified</h3>
              <p className="text-sm text-slate-500">Build healthy habits with our virtual pet, streaks, and XP rewards system.</p>
           </div>
        </div>
      </main>
    </div>
  );
};
export default LandingPage;