import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Play,
  Waves,
  Trees,
  Flame,
  CloudRain,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";

/* ---------------- ANIMATION VARIANTS ---------------- */
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

const Sleep = () => {
  const { addXP, addNotification } = useApp();

  const [hours, setHours] = useState<number | "">("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const calculateSleep = () => {
    if (!hours || hours <= 0) return;

    let calculatedScore = 0;
    let message = "";

    if (hours >= 7 && hours <= 9) {
      calculatedScore = 95;
      message = "Perfect sleep! Your body will thank you.";
      addXP(30);
    } else if (hours >= 6) {
      calculatedScore = 75;
      message = "Not bad. Try sleeping a bit earlier.";
      addXP(20);
    } else {
      calculatedScore = 50;
      message = "You need more rest. Aim for 7–8 hours.";
      addXP(10);
    }

    setScore(calculatedScore);
    setFeedback(message);
    addNotification("Sleep logged successfully 🌙");
  };

  const stories = [
    { title: "Moonlight Forest", desc: "A peaceful journey through a glowing forest." },
    { title: "Ocean Drift", desc: "Relax with gentle ocean waves." },
    { title: "Starry Night", desc: "Drift into sleep under calming stars." },
  ];

  const music = [
    { title: "Deep Sleep Piano", desc: "Soft piano melodies for deep rest" },
    { title: "Calm Night", desc: "Ambient sleep tones" },
  ];

  const sounds = [
    { name: "Rain", icon: CloudRain },
    { name: "Ocean", icon: Waves },
    { name: "Forest", icon: Trees },
    { name: "Fireplace", icon: Flame },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 space-y-8"
    >
      {/* HEADER */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Moon /> Sleep Coach
        </h1>
        <p className="text-slate-500">
          Relax your mind, slow your thoughts, and drift into peaceful sleep.
        </p>
      </motion.div>

      {/* SLEEP TRACKER */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-xl shadow-sm p-6 space-y-4"
      >
        <h2 className="font-semibold text-slate-700">
          How many hours did you sleep?
        </h2>

        <div className="flex gap-4 items-center">
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            placeholder="Enter hours"
            className="border border-slate-200 rounded-lg p-2 w-40 focus:ring-2 focus:ring-indigo-400"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={calculateSleep}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Analyze
          </motion.button>
        </div>
      </motion.div>

      {/* SCORE */}
      {score && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-indigo-600 to-indigo-800
          text-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Moon />
            <h2 className="font-semibold text-lg">Sleep Score</h2>
          </div>

          <p className="text-4xl font-bold">{score}%</p>
          <p className="text-indigo-100 mt-2">{feedback}</p>
        </motion.div>
      )}

      {/* SLEEP STORIES */}
      <Section title="Sleep Stories">
        <motion.div variants={container} className="grid md:grid-cols-3 gap-4">
          {stories.map((story, i) => (
            <MotionCard key={i} title={story.title} desc={story.desc} />
          ))}
        </motion.div>
      </Section>

      {/* AMBIENT SOUNDS */}
      <Section title="Ambient Sounds">
        <motion.div variants={container} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sounds.map((sound, i) => {
            const Icon = sound.icon;
            return (
              <motion.button
                key={i}
                variants={item}
                whileHover={{ scale: 1.05 }}
                className="bg-white shadow-sm rounded-xl p-4 flex flex-col items-center gap-2"
              >
                <Icon />
                <span>{sound.name}</span>
              </motion.button>
            );
          })}
        </motion.div>
      </Section>

      {/* BREATHING */}
      <Section title="Guided Breathing">
        <motion.div
          variants={item}
          className="bg-white shadow-sm rounded-xl p-6 flex flex-col items-center"
        >
          <div className="w-32 h-32 bg-indigo-200 rounded-full animate-breathe mb-4"></div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Start Breathing Session
          </motion.button>
        </motion.div>
      </Section>

      {/* MUSIC */}
      <Section title="Sleep Music">
        <motion.div variants={container} className="grid md:grid-cols-2 gap-4">
          {music.map((m, i) => (
            <MotionCard key={i} title={m.title} desc={m.desc} />
          ))}
        </motion.div>
      </Section>

      {/* QUICK ACTIONS */}
      <Section title="Need Help Sleeping Right Now?">
        <motion.div variants={container} className="flex flex-wrap gap-4">
          <ActionButton text="Play Instant Sleep Story" />
          <ActionButton text="Play Rain Sounds" />
          <ActionButton text="Start Breathing Exercise" />
        </motion.div>
      </Section>
    </motion.div>
  );
};

export default Sleep;

/* ---------------- REUSABLE COMPONENTS ---------------- */

const Section = ({ title, children }: any) => (
  <motion.div variants={item}>
    <h2 className="font-semibold text-slate-700 mb-3">{title}</h2>
    {children}
  </motion.div>
);

const MotionCard = ({ title, desc }: any) => (
  <motion.div
    variants={item}
    whileHover={{ scale: 1.04 }}
    className="bg-white rounded-xl shadow-sm p-4 cursor-pointer"
  >
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
      <Play className="text-indigo-600" />
    </div>
  </motion.div>
);

const ActionButton = ({ text }: any) => (
  <motion.button
    variants={item}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
  >
    <Sparkles size={16} />
    {text}
  </motion.button>
);