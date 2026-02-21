import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Play, Pause } from "lucide-react";

type Phase = "Inhale" | "Hold" | "Exhale";

const Breathing = () => {
  const { setActivePage, addXP } = useApp();

  const TOTAL_TIME = 60;

  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [cycleSecond, setCycleSecond] = useState(0); // 0 → 6
  const [phase, setPhase] = useState<Phase>("Inhale");
  const [lastPhase, setLastPhase] = useState<Phase>("Inhale");

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

  return (
    <div
      className="absolute inset-0 z-50
      bg-[linear-gradient(270deg,#2e1065,#6b21a8,#a855f7,#581c87,#2e1065)]
      bg-[length:600%_600%] animate-[gradientMove_20s_ease_infinite]
      flex flex-col items-center justify-center text-white overflow-hidden"
    >
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
              animationDuration: Math.random() * 3 + 2 + "s",
            }}
          />
        ))}
      </div>

      {/* ❌ Close */}
      <button
        onClick={() => setActivePage("DASHBOARD")}
        className="absolute top-6 right-6 p-2 bg-white/20 rounded-full backdrop-blur-md z-10"
      >
        ✕
      </button>

      {/* 🧘 Phase */}
      <div className="mb-12 text-center z-10">
        <h2 className="text-5xl font-light tracking-widest">{phase}</h2>
        <p className="opacity-80 mt-2">{timeLeft}s remaining</p>
      </div>

      {/* 🟣 Progress + Orb */}
      <div className="relative z-10">
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

        <div
          className={`w-64 h-64 bg-white/20 backdrop-blur-xl rounded-full
          border border-white/40 flex items-center justify-center shadow-2xl
          transition-all
          ${
            phase === "Inhale"
              ? "scale-125 duration-[3000ms]"
              : phase === "Hold"
              ? "scale-110 duration-[1000ms]"
              : "scale-75 duration-[3000ms]"
          }`}
        >
          <div className="w-6 h-6 bg-white rounded-full animate-pulse" />
        </div>
      </div>

      {/* ▶ Controls */}
      <div className="mt-16 z-10">
        <button
          onClick={() => setIsActive(!isActive)}
          className="bg-white/90 text-indigo-700 px-10 py-4 rounded-full
          font-bold text-lg flex items-center gap-3 shadow-2xl
          hover:scale-110 transition"
        >
          {isActive ? (
            <>
              <Pause size={22} /> Pause
            </>
          ) : (
            <>
              <Play size={22} /> Start
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Breathing;