import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Play, Pause } from 'lucide-react';

const Breathing = () => {
  const { setActivePage, addXP } = useApp();

  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [lastPhase, setLastPhase] = useState("");

  const totalTime = 60;
  const progress = (totalTime - timeLeft) / totalTime;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 🎵 Ambient sound
  useEffect(() => {
    audioRef.current = new Audio(
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1f1c6e4b4e.mp3"
    );
    audioRef.current.loop = true;
  }, []);

  // 🔊 Voice guidance
  const speak = (text: string) => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    u.pitch = 1.1;
    speechSynthesis.speak(u);
  };

  // 💗 Haptic vibration
  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(200);
  };

  // 🌬️ Breathing logic
  useEffect(() => {
  let interval: any;

  if (isActive && timeLeft > 0) {
    audioRef.current?.play();

    interval = setInterval(() => {
      setTimeLeft(t => t - 1);

      const cycle = timeLeft % 14;
      // ⭐ Speak only when phase changes
      if (cycle > 10 && lastPhase !== "Inhale") {
  setPhase("Inhale");
  speak("Inhale");
  vibrate();
  setLastPhase("Inhale");
}
else if (cycle > 6 && lastPhase !== "Hold") {
  setPhase("Hold");
  speak("Hold");
  vibrate();
  setLastPhase("Hold");
}
else if (lastPhase !== "Exhale") {
  setPhase("Exhale");
  speak("Exhale");
  vibrate();
  setLastPhase("Exhale");
}


    }, 2000);

  } else {
    audioRef.current?.pause();
  }

  if (timeLeft === 0) {
    setIsActive(false);
    addXP(50);
  }

  return () => clearInterval(interval);

}, [isActive, timeLeft, lastPhase, addXP]);

  return (
    <div className="absolute inset-0 z-50 
    bg-[linear-gradient(270deg,#2e1065,#6b21a8,#a855f7,#581c87,#2e1065)]
    bg-[length:600%_600%] animate-[gradientMove_20s_ease_infinite] 
    flex flex-col items-center justify-center text-white overflow-hidden">

      {/* 🌌 Star background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-70 animate-pulse"
            style={{
              width: Math.random() * 3 + "px",
              height: Math.random() * 3 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDuration: Math.random() * 3 + 2 + "s"
            }}
          />
        ))}
      </div>

      {/* ❌ Close */}
      <button
        onClick={() => setActivePage('DASHBOARD')}
        className="absolute top-6 right-6 p-2 bg-white/20 rounded-full backdrop-blur-md z-10"
      >
        <X size={24} />
      </button>


      {/* 🧘 Phase text */}
      <div className="mb-12 text-center z-10">
        <h2 className="text-5xl font-light tracking-widest">{phase}</h2>
        <p className="opacity-80 mt-2">{timeLeft}s remaining</p>
      </div>

      {/* 🟣 PROGRESS RING + ORB */}
      <div className="relative z-10">

        {/* Progress Ring SVG */}
        <svg width="320" height="320" className="absolute -top-8 -left-8">
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="white"
            strokeWidth="6"
            fill="none"
            strokeDasharray={2 * Math.PI * 140}
            strokeDashoffset={(1 - progress) * 2 * Math.PI * 140}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        {/* Breathing Orb */}
        <div
          className={`w-64 h-64 bg-white/20 backdrop-blur-xl rounded-full border border-white/40 
          flex items-center justify-center shadow-2xl transition-all duration-[4000ms]
          ${phase === 'Inhale' ? 'scale-125' : phase === 'Exhale' ? 'scale-75' : 'scale-100'}`}
        >
          <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
        </div>

      </div>

      {/* ▶ Controls */}
      <div className="mt-16 z-10">
        <button
          onClick={() => setIsActive(!isActive)}
          className="bg-white/90 text-indigo-700 px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 shadow-2xl hover:scale-110 transition"
        >
          {isActive
            ? <><Pause size={22} /> Pause</>
            : <><Play size={22} /> Start</>}
        </button>
      </div>

    </div>
  );
};
export default Breathing;
