import React from 'react';
import { useApp } from '../context/AppContext';

export const PetDisplay = () => {
  const { user } = useApp();
  const { pet } = user;

  // Simple visual representation changes based on happiness
  const getPetEmoji = () => {
    if (pet.happiness > 80) return "🌟";
    if (pet.happiness > 50) return "🙂";
    if (pet.happiness > 30) return "😐";
    return "🥀";
  };

  const getPetColor = () => {
     if (pet.happiness > 80) return "bg-yellow-400";
     if (pet.happiness > 50) return "bg-green-400";
     return "bg-slate-400";
  };

  return (
    <div className="relative w-full h-48 bg-gradient-to-b from-blue-50 to-indigo-50 rounded-2xl flex flex-col items-center justify-center overflow-hidden border border-blue-100">
      {/* Background Elements */}
      <div className="absolute top-4 right-4 text-yellow-400 animate-pulse">☀️</div>
      <div className="absolute bottom-0 w-full h-12 bg-green-100/50 rounded-b-2xl"></div>

      {/* The Pet */}
      <div className={`relative z-10 animate-float transition-all duration-500`}>
         <div className={`w-24 h-24 rounded-full ${getPetColor()} shadow-xl flex items-center justify-center text-4xl border-4 border-white`}>
            {getPetEmoji()}
         </div>
      </div>
      
      {/* Status */}
      <div className="absolute bottom-3 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-600">
        {pet.name} is {pet.status}
      </div>

      {/* Health Bar */}
      <div className="absolute top-4 left-4 w-24">
         <div className="text-[10px] text-slate-400 mb-1">Happiness</div>
         <div className="h-2 w-full bg-white rounded-full overflow-hidden">
            <div 
              className="h-full bg-pink-400 rounded-full transition-all duration-1000" 
              style={{ width: `${pet.happiness}%` }}
            ></div>
         </div>
      </div>
    </div>
  );
};
