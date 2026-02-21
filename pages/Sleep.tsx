import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../services/supabaseClient";
import { useApp } from "../context/AppContext";

/* ================= ANIMATION VARIANTS ================= */

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

/* ================= SIMPLE SVG CHART ================= */

const SleepChart = ({ data }: { data: { date: string; hours: number }[] }) => {
  const width = 600;
  const height = 300;
  const padding = 40;
  const maxHours = 10;

  const points = data.map((d, i) => {
    const x =
      padding +
      (i * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y =
      height - padding - (d.hours / maxHours) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      width={width}
      height={height}
      className="border border-slate-200 rounded-2xl bg-white shadow-sm"
    >
      <line x1={40} y1={40} x2={40} y2={260} stroke="#999" />
      <line x1={40} y1={260} x2={560} y2={260} stroke="#999" />

      <polyline
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="3"
        points={points.join(" ")}
      />

      {data.map((d, i) => {
        const x =
          padding +
          (i * (width - padding * 2)) / Math.max(data.length - 1, 1);
        const y =
          height - padding - (d.hours / maxHours) * (height - padding * 2);
        return <circle key={i} cx={x} cy={y} r={5} fill="#8b5cf6" />;
      })}

      {data.map((d, i) => {
        const x =
          padding +
          (i * (width - padding * 2)) / Math.max(data.length - 1, 1);
        return (
          <text
            key={i}
            x={x}
            y={290}
            textAnchor="middle"
            fontSize="12"
            fill="#475569"
          >
            {d.date}
          </text>
        );
      })}
    </motion.svg>
  );
};

/* ================= MAIN PAGE ================= */

const Sleep = () => {
  const { addXP, addNotification } = useApp();

  const [hours, setHours] = useState<number | "">("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [weeklyData, setWeeklyData] = useState<
    { date: string; hours: number }[]
  >([]);

  const fetchSleepData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("sleep_logs")
      .select("sleep_hours, logged_at")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: true })
      .limit(7);

    if (data) {
      setWeeklyData(
        data.map((d) => ({
          date: new Date(d.logged_at).toLocaleDateString("en-IN", {
            weekday: "short",
          }),
          hours: d.sleep_hours,
        }))
      );
    }
  };

  useEffect(() => {
    fetchSleepData();
  }, []);

  const calculateSleep = async () => {
    if (hours === "" || hours <= 0 || hours > 24) {
      addNotification("Please enter valid sleep hours (1–24)");
      return;
    }

    let sleepScore = 0;
    let msg = "";
    let xp = 10;

    if (hours >= 7 && hours <= 9) {
      // Optimal range
      sleepScore = 100;
      msg = "Perfect sleep! Your body and mind are well-rested. ✨";
      xp = 30;
    } else if (hours > 9) {
      // Oversleeping penalty
      sleepScore = Math.max(30, Math.round(100 - (hours - 9) * 15));
      msg = "You overslept! While it feels good, too much sleep can cause grogginess and low energy.";
      xp = 15;
    } else if (hours >= 5) {
      // Slightly under
      sleepScore = Math.round((hours / 7) * 90);
      msg = "Decent sleep, but a bit short. Aim for 7-9 hours for peak focus.";
      xp = 20;
    } else {
      // Very under
      sleepScore = Math.round((hours / 7) * 100);
      msg = "You need more rest. Lack of sleep can impact your mood and memory.";
      xp = 10;
    }

    // ✅ UPDATE UI IMMEDIATELY (Responsiveness)
    setScore(sleepScore);
    setFeedback(msg);
    addXP(xp);
    addNotification("Sleep analyzed successfully 🌙");

    // THEN do Supabase work (if available)
    if (!supabase) return;

    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (user) {
        await supabase.from("sleep_logs").insert([
          {
            user_id: user.id,
            sleep_hours: hours,
            sleep_score: sleepScore,
          },
        ]);
        fetchSleepData();
      }
    } catch (err) {
      console.warn("Supabase background sync failed", err);
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 max-w-4xl mx-auto pb-24 md:pb-6 space-y-8"
    >
      {/* HEADER */}
      <motion.header variants={item} className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Sleep Coach
        </h1>
        <p className="text-slate-500">
          Build better sleep habits, one night at a time 🌙
        </p>
      </motion.header>

      {/* PRIMARY INPUT CARD */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.01 }}
        className="bg-white p-6 rounded-3xl shadow-xl
                   border border-slate-100"
      >
        <h2 className="font-semibold text-slate-700 mb-4">
          How many hours did you sleep?
        </h2>

        <div className="flex items-center gap-4">
          <input
            type="number"
            min={1}
            max={24}
            step={0.5}
            value={hours}
            onChange={(e) =>
              setHours(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Enter hours"
            className="border border-slate-300 rounded-xl px-4 py-2 w-40
                       focus:ring-4 focus:ring-violet-100 focus:outline-none"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={calculateSleep}
            className="bg-violet-600 text-white px-6 py-2 rounded-xl
                       font-medium shadow-lg hover:bg-violet-700 transition"
          >
            Analyze
          </motion.button>
        </div>
      </motion.div>

      {/* SCORE CARD */}
      <AnimatePresence>
        {score !== null && (
          <motion.div
            key="score-card"
            variants={item}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="bg-gradient-to-r from-violet-500 to-fuchsia-600
                       text-white p-8 rounded-[32px] shadow-xl shadow-violet-200/50"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-xl text-violet-50 opacity-90">Analysis Result</h2>
                <p className="text-5xl font-black mt-3 tracking-tight">{score}%</p>
                <p className="text-violet-50/90 font-medium mt-4 text-lg leading-relaxed max-w-md">
                  {feedback}
                </p>
              </div>
              <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                <span className="text-3xl">✨</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ANALYTICS */}
      <motion.div variants={item} className="mt-8 space-y-4">
        <h2 className="font-bold text-slate-700">
          Weekly Sleep Overview
        </h2>

        {weeklyData.length > 0 ? (
          <SleepChart data={weeklyData} />
        ) : (
          <p className="text-slate-400 text-sm">
            Log your sleep to see weekly trends.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Sleep;