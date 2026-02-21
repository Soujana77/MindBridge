import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { Play, Pause, Maximize, Minimize, X } from "lucide-react";

type Phase = "Inhale" | "Hold" | "Exhale";

const Breathing = () => {
  const { setActivePage, addXP } = useApp();

  const TOTAL_TIME = 60;

  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [cycleSecond, setCycleSecond] = useState(0); // 0 → 6
  const [phase, setPhase] = useState<Phase>("Inhale");
  const [lastPhase, setLastPhase] = useState<Phase>("Inhale");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const progress = (TOTAL_TIME - timeLeft) / TOTAL_TIME;

  /* 🎵 Ambient sound */
  useEffect(() => {
    audioRef.current = new Audio(
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1f1c6e4b4e.mp3"
    );
    audioRef.current.loop = true;
  }, []);

  /* 🔊 Voice guidance */
  const speak = (text: string) => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    u.pitch = 1.1;
    speechSynthesis.speak(u);
  };

  /* 💗 Haptic */
  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(150);
  };

  /* 🌬️ TIMER ENGINE (1s REAL TIME) */
  useEffect(() => {
    let interval: any;

    if (isActive && timeLeft > 0) {
      audioRef.current?.play();

      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
        setCycleSecond((c) => (c + 1) % 7); // 7-second cycle
      }, 1000);
    } else {
      audioRef.current?.pause();
    }

    if (timeLeft === 0) {
      setIsActive(false);
      addXP(50);
      speechSynthesis.cancel();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, addXP]);

  /* 🧘 PHASE RESOLUTION */
  useEffect(() => {
    let newPhase: Phase;

    if (cycleSecond <= 2) newPhase = "Inhale"; // 3s
    else if (cycleSecond === 3) newPhase = "Hold"; // 1s
    else newPhase = "Exhale"; // 3s

    if (newPhase !== lastPhase) {
      setPhase(newPhase);
      speak(newPhase);
      vibrate();
      setLastPhase(newPhase);
    }
  }, [cycleSecond, lastPhase]);

  // 🖥 FULLSCREEN
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center
      bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900
      text-white p-6 relative rounded-[32px] overflow-hidden"
    >
      {/* 🌌 Star background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-30"
            animate={isActive ? {
              x: [0, Math.random() * 100 - 50, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 100 - 50, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.5, 0.2],
            } : {}}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      {/* 🖥 FULLSCREEN BUTTON */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-6 right-6 bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors z-20"
      >
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>

      {/* ❌ CLOSE BUTTON - matches Pomodoro style if needed, but here to allow dashboard exit */}
      <button
        onClick={() => setActivePage("DASHBOARD")}
        className="absolute top-6 left-6 bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors z-20"
      >
        <X size={20} />
      </button>

      <h1 className="text-3xl font-bold mb-12 z-10">
        Breath Companion
      </h1>

      {/* 🧘 Phase */}
      <div className="mb-12 text-center z-10">
        <h2 className="text-6xl font-extrabold tracking-[0.2em] uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          {phase}
        </h2>
        <p className="text-indigo-200 mt-4 font-medium tracking-wide">
          {timeLeft}s remaining
        </p>
      </div>

      {/* 🟣 Progress + Orb */}
      <div className="relative z-10">
        <svg width="340" height="340" className="absolute -top-10 -left-10">
          <circle
            cx="170"
            cy="170"
            r="150"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="170"
            cy="170"
            r="150"
            stroke="white"
            strokeWidth="8"
            fill="none"
            strokeDasharray={2 * Math.PI * 150}
            strokeDashoffset={(1 - progress) * 2 * Math.PI * 150}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        <div
          className={`w-64 h-64 bg-white/15 backdrop-blur-2xl rounded-full
          border border-white/30 flex items-center justify-center shadow-[0_0_80px_rgba(255,255,255,0.2)]
          transition-all duration-[3000ms] ease-in-out
          ${phase === "Inhale"
              ? "scale-[1.3] shadow-[0_0_120px_rgba(255,255,255,0.3)]"
              : phase === "Hold"
                ? "scale-[1.15]"
                : "scale-[0.8] opacity-60"
            }`}
        >
          <div className="w-10 h-10 bg-white rounded-full blur-[1px] shadow-[0_0_20px_white]" />
        </div>
      </div>

      {/* ▶ Controls */}
      <div className="mt-20 z-10">
        <button
          onClick={() => setIsActive(!isActive)}
          className="bg-white text-indigo-900 px-12 py-4 rounded-2xl
          font-black text-lg flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)]
          hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {isActive ? (
            <>
              <Pause size={24} fill="currentColor" /> PAUSE
            </>
          ) : (
            <>
              <Play size={24} fill="currentColor" /> START
            </>
          )}
        </button>
      </div>

      {/* 📜 QUOTE - matches Pomodoro footer style */}
      <p className="absolute bottom-8 text-white/40 text-sm italic font-medium tracking-wide z-10">
        "Just breathe. You are exactly where you need to be."
      </p>
    </div>
  );
};

export default Breathing;
