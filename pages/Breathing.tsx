import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { X, Play, Pause } from "lucide-react";

const Breathing = () => {
  const { setActivePage, addXP } = useApp();

  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");

  const totalTime = 60;
  const progress = (totalTime - timeLeft) / totalTime;

  // 🌬️ Breathing logic (slower cycle)
  useEffect(() => {
    let interval: any;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);

        const cycle = timeLeft % 12;

        if (cycle > 8) setPhase("Inhale");
        else if (cycle > 4) setPhase("Hold");
        else setPhase("Exhale");

      }, 1000);
    }

    if (timeLeft === 0) {
      setIsActive(false);
      addXP(50);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, addXP]);

  return (
    <div
      className="
      fixed inset-0 z-[999]
      flex flex-col items-center justify-center
      text-white overflow-hidden
      bg-[linear-gradient(270deg,#2e1065,#6b21a8,#a855f7,#581c87,#2e1065)]
      bg-[length:600%_600%]
      animate-[gradientMove_20s_ease_infinite]
      "
    >
      {/* ⭐ Floating stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 120 }).map((_, i) => (
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

      {/* ❌ Close button */}
      <button
        onClick={() => setActivePage("DASHBOARD")}
        className="absolute top-6 right-6 p-3 bg-white/20 rounded-full backdrop-blur-md z-10 hover:bg-white/30"
      >
        <X size={26} />
      </button>

      {/* 🌬️ Phase text */}
      <div className="mb-12 text-center z-10">
        <h2 className="text-6xl font-light tracking-widest">{phase}</h2>
        <p className="opacity-80 mt-2">{timeLeft}s remaining</p>
      </div>

      {/* 🟣 Progress Ring + Orb */}
      <div className="relative z-10">
        {/* Progress ring */}
        <svg width="360" height="360" className="absolute -top-10 -left-10">
          <circle
            cx="180"
            cy="180"
            r="160"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="180"
            cy="180"
            r="160"
            stroke="white"
            strokeWidth="6"
            fill="none"
            strokeDasharray={2 * Math.PI * 160}
            strokeDashoffset={(1 - progress) * 2 * Math.PI * 160}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        {/* Breathing Orb */}
        <div
          className={`w-72 h-72 bg-white/20 backdrop-blur-xl rounded-full border border-white/40
          flex items-center justify-center shadow-2xl transition-all duration-[4000ms]
          ${
            phase === "Inhale"
              ? "scale-125"
              : phase === "Exhale"
              ? "scale-75"
              : "scale-100"
          }`}
        >
          <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* ▶ Start / Pause */}
      <div className="mt-16 z-10">
        <button
          onClick={() => setIsActive(!isActive)}
          className="bg-white/90 text-indigo-700 px-12 py-4 rounded-full font-bold text-lg flex items-center gap-3 shadow-2xl hover:scale-110 transition"
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