import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Minimize
} from "lucide-react";
import { useApp } from "../context/AppContext";

const Pomodoro = () => {
  const { addXP } = useApp();

  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"FOCUS" | "BREAK">("FOCUS");
  const [message, setMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 🔔 Load sound
  useEffect(() => {
    audioRef.current = new Audio(
      "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3"
    );
  }, []);

  // ⏱ TIMER LOGIC
  useEffect(() => {
    let interval: any;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    }

    if (timeLeft === 0 && isActive) {
      setIsActive(false);
      audioRef.current?.play();

      if (mode === "FOCUS") {
        addXP(100);

        if (focusMinutes > 25) {
          setMessage("🔥 You pushed beyond limits! Amazing focus!");
        } else {
          setMessage("🎉 Well done! Focus session complete!");
        }

        setMode("BREAK");
        setTimeLeft(breakMinutes * 60);
      } else {
        addXP(20);
        setMessage("💪 Break over! Ready for another deep focus?");
        setMode("FOCUS");
        setTimeLeft(focusMinutes * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, focusMinutes, breakMinutes, addXP]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "FOCUS" ? focusMinutes * 60 : breakMinutes * 60);
  };

  // ⭐ FULLSCREEN TOGGLE
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const progress =
    mode === "FOCUS"
      ? 1 - timeLeft / (focusMinutes * 60)
      : 1 - timeLeft / (breakMinutes * 60);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center
      bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900
      text-white p-6 relative"
    >

      {/* ⭐ FULLSCREEN BUTTON */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-6 right-6 bg-white/20 p-3 rounded-full hover:bg-white/30"
      >
        {isFullscreen ? <Minimize /> : <Maximize />}
      </button>

      {/* 🌟 TITLE */}
      <h1 className="text-3xl font-bold mb-8 tracking-wide">
        Focus Companion
      </h1>

      {/* ⭕ PROGRESS RING */}
      <div className="relative mb-8">

        <svg width="300" height="300">
          <circle
            cx="150"
            cy="150"
            r="130"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="150"
            cy="150"
            r="130"
            stroke="white"
            strokeWidth="10"
            fill="none"
            strokeDasharray={2 * Math.PI * 130}
            strokeDashoffset={(1 - progress) * 2 * Math.PI * 130}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        {/* TIME */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-mono font-bold">
            {formatTime(timeLeft)}
          </div>
          <p className="opacity-70 mt-2">
            {mode === "FOCUS" ? "Deep Work Mode" : "Relax & Recharge"}
          </p>
        </div>
      </div>

      {/* 🎮 CONTROLS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={toggleTimer}
          className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
        >
          {isActive ? <Pause /> : <Play />}
        </button>

        <button
          onClick={resetTimer}
          className="bg-white/20 px-6 py-3 rounded-xl hover:bg-white/30 transition"
        >
          <RotateCcw />
        </button>
      </div>

      {/* ⏳ CUSTOM TIME INPUT */}
      {!isActive && (
        <div className="bg-white/10 p-4 rounded-2xl flex gap-6 mb-8 backdrop-blur-md">
          <div>
            <label className="text-sm">Focus (min)</label>
            <input
              type="number"
              value={focusMinutes}
              onChange={(e) => setFocusMinutes(Number(e.target.value))}
              className="text-black p-2 rounded mt-1 w-20"
            />
          </div>

          <div>
            <label className="text-sm">Break (min)</label>
            <input
              type="number"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
              className="text-black p-2 rounded mt-1 w-20"
            />
          </div>
        </div>
      )}

      {/* 🌟 MOTIVATIONAL MESSAGE */}
      {message && (
        <div className="bg-white/20 px-6 py-4 rounded-2xl text-center max-w-md backdrop-blur-md animate-pulse">
          {message}
        </div>
      )}

      {/* 💬 QUOTE */}
      {mode === "FOCUS" && (
        <p className="mt-8 text-sm opacity-70 italic text-center max-w-sm">
          "Focus is the bridge between goals and achievement."
        </p>
      )}
    </div>
  );
};

export default Pomodoro;