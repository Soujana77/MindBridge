import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { PetDisplay } from "../components/PetDisplay";
import { Play, Activity, Brain, Moon } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const hasNotified = React.useRef(false);

  const {
    user,
    setActivePage,
    updateMood,
    addNotification,
    notifications,
  } = useApp();

  // 🔥 REAL 24-HOUR STREAK SYSTEM
  useEffect(() => {
    const now = Date.now();
    let streak = parseInt(localStorage.getItem("streak") || "0");
    let lastTime = parseInt(localStorage.getItem("lastStreakTime") || "0");

    if (!lastTime) {
      localStorage.setItem("lastStreakTime", now.toString());
      localStorage.setItem("streak", "1");
      return;
    }

    const diff = now - lastTime;
    if (diff >= 24 * 60 * 60 * 1000) {
      streak += 1;
      localStorage.setItem("streak", streak.toString());
      localStorage.setItem("lastStreakTime", now.toString());
    }
  }, []);

  // 🌸 EXAM REMINDER
  useEffect(() => {
    if (hasNotified.current) return;
    hasNotified.current = true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exam = new Date("2026-02-20");
    exam.setHours(0, 0, 0, 0);

    const diffDays =
      (exam.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);

    if (diffDays === 3) {
      addNotification("📚 Your exam is in 3 days — Stay calm 💜");
    }
    if (diffDays === 1) {
      addNotification("🔥 Exam tomorrow! Believe in yourself ✨");
    }
  }, [addNotification]);

  const streak = localStorage.getItem("streak") || 1;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 space-y-6 pb-24 md:pb-6 w-full"
    >
      {/* 🔔 Notifications */}
      <div className="fixed top-6 right-6 space-y-2 z-50">
        {notifications.map((note, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-500 text-white px-4 py-3 rounded-xl shadow-lg"
          >
            {note}
          </motion.div>
        ))}
      </div>

      {/* HEADER */}
      <motion.header variants={item} className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Hi, {user.name}
          </h2>
          <p className="text-slate-500">Ready for a mindful day?</p>
        </div>

        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border flex items-center gap-2">
          <span>🔥</span>
          <span className="font-bold text-slate-700">
            {streak} Day Streak
          </span>
        </div>
      </motion.header>

      {/* GRID */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* DAILY MOOD */}
          <motion.section
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-3xl shadow-sm border"
          >
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Activity className="text-indigo-500" size={20} />
              Daily Mood Quest
            </h3>

            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => updateMood(level)}
                  className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-indigo-100 text-xl flex items-center justify-center border"
                >
                  {["😢", "😕", "😐", "🙂", "😄"][level - 1]}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-400 mt-3 text-center">
              Check in to earn 20 XP
            </p>
          </motion.section>

          {/* PET */}
          <motion.section
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-3xl shadow-sm border"
          >
            <PetDisplay />
          </motion.section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-3 space-y-6">
          {/* CARDS */}
          <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              variants={item}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActivePage("BREATHE")}
              className="bg-gradient-to-br from-teal-400 to-emerald-500 p-6 rounded-3xl shadow-lg cursor-pointer text-white"
            >
              <h3 className="font-bold text-xl mb-1">60s Reset</h3>
              <p className="text-sm">Take a quick breath.</p>
              <div className="mt-4 bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">
                <Play size={20} fill="white" />
              </div>
            </motion.div>

            <motion.div
              variants={item}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActivePage("FOCUS")}
              className="bg-white p-6 rounded-3xl shadow-sm border cursor-pointer"
            >
              <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl mb-4">
                <Brain size={24} />
              </div>
              <h3 className="font-bold text-lg">Deep Focus</h3>
              <p className="text-slate-400 text-sm">
                Start a Pomodoro session.
              </p>
            </motion.div>

            <motion.div
              variants={item}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActivePage("JOURNAL")}
              className="bg-white p-6 rounded-3xl shadow-sm border cursor-pointer"
            >
              <div className="p-3 bg-pink-50 text-pink-500 rounded-2xl mb-4">
                <Activity size={24} />
              </div>
              <h3 className="font-bold text-lg">Mood Journal</h3>
              <p className="text-slate-400 text-sm">
                Reflect on your day.
              </p>
            </motion.div>

            <motion.div
              variants={item}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActivePage("SLEEP")}
              className="bg-slate-800 text-white p-6 rounded-3xl shadow-lg cursor-pointer"
            >
              <Moon size={24} />
              <h3 className="font-bold text-lg mt-2">Sleep Hygiene</h3>
              <p className="text-slate-400 text-sm">
                Track your rest.
              </p>
            </motion.div>
          </motion.div>

          {/* PROGRESS */}
          <motion.section
            variants={item}
            className="bg-white p-6 rounded-3xl shadow-sm border"
          >
            <h3 className="font-bold text-slate-700 mb-4">
              Your Progress
            </h3>

            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden mb-2">
              <div
                className="bg-indigo-500 h-full"
                style={{ width: `${user.xp % 100}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Level {user.level}</span>
              <span>{user.xp} XP</span>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;