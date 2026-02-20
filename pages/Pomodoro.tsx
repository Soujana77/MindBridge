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

  const containerRef = useRef<HTMLDivElement | null>(null);

  // 🔥 LOAD SAVED TIMER WHEN PAGE OPENS
  useEffect(() => {
    const savedEnd = localStorage.getItem("pomodoroEnd");
    const savedMode = localStorage.getItem("pomodoroMode");

    if (savedEnd) {
      const remaining = Math.floor(
        (Number(savedEnd) - Date.now()) / 1000
      );

      if (remaining > 0) {
        setTimeLeft(remaining);
        setIsActive(true);
        if (savedMode === "BREAK") setMode("BREAK");
      } else {
        localStorage.removeItem("pomodoroEnd");
      }
    }
  }, []);

  // ⏱ TIMER ENGINE
  useEffect(() => {
    let interval: any;

    if (isActive) {
      interval = setInterval(() => {
        const savedEnd = localStorage.getItem("pomodoroEnd");

        if (savedEnd) {
          const remaining = Math.floor(
            (Number(savedEnd) - Date.now()) / 1000
          );

          if (remaining <= 0) {
            clearInterval(interval);
            setIsActive(false);
            localStorage.removeItem("pomodoroEnd");

            if (mode === "FOCUS") {
              addXP(100);
              setMessage("🎉 Focus complete!");
              setMode("BREAK");
              setTimeLeft(breakMinutes * 60);
            } else {
              addXP(20);
              setMessage("💪 Break over! Ready again?");
              setMode("FOCUS");
              setTimeLeft(focusMinutes * 60);
            }
          } else {
            setTimeLeft(remaining);
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, mode, focusMinutes, breakMinutes, addXP]);

  // ▶ START / PAUSE
  const toggleTimer = () => {
    if (!isActive) {
      const endTime = Date.now() + timeLeft * 1000;
      localStorage.setItem("pomodoroEnd", endTime.toString());
      localStorage.setItem("pomodoroMode", mode);
    } else {
      localStorage.removeItem("pomodoroEnd");
    }

    setIsActive(!isActive);
  };

  // 🔄 RESET
  const resetTimer = () => {
    setIsActive(false);
    localStorage.removeItem("pomodoroEnd");

    setTimeLeft(
      mode === "FOCUS"
        ? focusMinutes * 60
        : breakMinutes * 60
    );
  };

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
      {/* 🖥 FULLSCREEN BUTTON */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-6 right-6 bg-white/20 p-3 rounded-full"
      >
        {isFullscreen ? <Minimize /> : <Maximize />}
      </button>

      <h1 className="text-3xl font-bold mb-8">
        Focus Companion
      </h1>

      {/* ⭕ PROGRESS RING TIMER */}
<div className="relative mb-8">

  <svg width="300" height="300">
    {/* Background circle */}
    <circle
      cx="150"
      cy="150"
      r="130"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="10"
      fill="none"
    />

    {/* Progress circle */}
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

  {/* TIME TEXT */}
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <div className="text-6xl font-mono font-bold">
      {formatTime(timeLeft)}
    </div>
    <p className="opacity-70 mt-2">
      {mode === "FOCUS"
        ? "Deep Work Mode"
        : "Relax & Recharge"}
    </p>
  </div>
</div>

      <p className="opacity-70 mb-8">
        {mode === "FOCUS"
          ? "Deep Work Mode"
          : "Relax & Recharge"}
      </p>

      {/* 🎮 CONTROLS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={toggleTimer}
          className="bg-white text-indigo-700 px-6 py-3 rounded-xl"
        >
          {isActive ? <Pause /> : <Play />}
        </button>

        <button
          onClick={resetTimer}
          className="bg-white/20 px-6 py-3 rounded-xl"
        >
          <RotateCcw />
        </button>
      </div>

      {/* ⏳ CUSTOM TIME */}
      {!isActive && (
        <div className="bg-white/10 p-4 rounded-2xl flex gap-6 backdrop-blur-md">
          <div>
            <label className="text-sm">Focus</label>
            <input
              type="number"
              value={focusMinutes}
              onChange={(e) =>
                setFocusMinutes(Number(e.target.value))
              }
              className="text-black p-2 rounded mt-1 w-20"
            />
          </div>

          <div>
            <label className="text-sm">Break</label>
            <input
              type="number"
              value={breakMinutes}
              onChange={(e) =>
                setBreakMinutes(Number(e.target.value))
              }
              className="text-black p-2 rounded mt-1 w-20"
            />
          </div>
        </div>
      )}

      {message && (
        <div className="mt-6 bg-white/20 px-6 py-4 rounded-2xl backdrop-blur-md">
          {message}
        </div>
      )}
    </div>
  );
};

export default Pomodoro;