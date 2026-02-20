import React, { useEffect, useState } from "react";

const FloatingTimer = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // 🔥 Read from localStorage every second
  useEffect(() => {
    const interval = setInterval(() => {
      const savedEnd = localStorage.getItem("pomodoroEnd");

      if (savedEnd) {
        const remaining = Math.floor(
          (Number(savedEnd) - Date.now()) / 1000
        );

        if (remaining > 0) {
          setTimeLeft(remaining);
        } else {
          setTimeLeft(null);
        }
      } else {
        setTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) return null;

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;

  return (
    <div
      onClick={() => window.location.hash = "#/pomodoro"}
      className="fixed bottom-6 right-6 z-[9999]
      bg-white text-indigo-700 px-6 py-3 rounded-2xl shadow-2xl
      cursor-pointer hover:scale-105 transition"
    >
      ⏱ {m}:{s.toString().padStart(2, "0")}
    </div>
  );
};

export default FloatingTimer;