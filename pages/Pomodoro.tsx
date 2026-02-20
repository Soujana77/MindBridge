import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Pomodoro = () => {
  const { addXP } = useApp();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Timer finished
      if (mode === 'FOCUS') {
        addXP(100); // Reward
        if (confirm("Focus session complete! Take a break?")) {
           setMode('BREAK');
           setTimeLeft(5 * 60);
        }
      } else {
        addXP(20);
        setMode('FOCUS');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, addXP]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'FOCUS' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col items-center justify-center h-full">
      <div className="w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center relative overflow-hidden">
        
        {/* Decorative BG */}
        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${mode === 'FOCUS' ? 'from-indigo-500 to-purple-500' : 'from-emerald-400 to-teal-500'}`}></div>

        <div className="mb-8">
           <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${mode === 'FOCUS' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
             {mode === 'FOCUS' ? <Brain size={16} /> : <Coffee size={16} />}
             {mode === 'FOCUS' ? 'Deep Work Mode' : 'Mindful Break'}
           </div>
           
           <div className="text-8xl font-bold text-slate-800 tracking-tighter mb-2 font-mono">
             {formatTime(timeLeft)}
           </div>
           <p className="text-slate-400">
             {isActive ? 'Stay focused, you got this.' : 'Ready to start?'}
           </p>
        </div>

        <div className="flex items-center justify-center gap-4">
           <button 
             onClick={toggleTimer}
             className="w-16 h-16 rounded-2xl bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200"
            >
              {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
           </button>
           <button 
             onClick={resetTimer}
             className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <RotateCcw size={24} />
           </button>
        </div>
      </div>

      {mode === 'FOCUS' && (
        <div className="mt-8 text-center max-w-xs">
          <p className="text-sm text-slate-400 italic">"Focus is a muscle. The more you use it, the stronger it gets."</p>
        </div>
      )}
    </div>
  );
};
export default Pomodoro;