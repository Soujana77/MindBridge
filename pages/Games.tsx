import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  Puzzle,
  HelpCircle,
  Wind,
  Heart
} from "lucide-react";

import BubbleBurst from "./games/BubbleBurst";
import NumberGame from "./games/NumberGame";
import PuzzleGame from "./games/PuzzleGame";
import QuizGame from "./games/QuizGame";
import BreathingGame from "./games/BreathingGame";
import AffirmationGame from "./games/AffirmationGame";

/* ---------------- ANIMATION VARIANTS ---------------- */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

/* ---------------- GAME DATA ---------------- */
const gamesList = [
  {
    id: "bubble",
    title: "Bubble Burst",
    desc: "Pop bubbles to release stress",
    icon: Sparkles,
    component: BubbleBurst
  },
  {
    id: "number",
    title: "Number Game",
    desc: "Boost focus & memory",
    icon: Brain,
    component: NumberGame
  },
  {
    id: "puzzle",
    title: "Puzzle Game",
    desc: "Relax your mind",
    icon: Puzzle,
    component: PuzzleGame
  },
  {
    id: "quiz",
    title: "Quiz Game",
    desc: "Fun brain challenge",
    icon: HelpCircle,
    component: QuizGame
  },
  {
    id: "breathing",
    title: "Breathing Game",
    desc: "Calm your body",
    icon: Wind,
    component: BreathingGame
  },
  {
    id: "affirmation",
    title: "Affirmations",
    desc: "Positive thoughts",
    icon: Heart,
    component: AffirmationGame
  }
];

const Games = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const currentGame = gamesList.find(g => g.id === selectedGame);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 min-h-screen bg-slate-50 text-slate-800"
    >
      {/* HEADER */}
      <motion.h1
        variants={item}
        className="text-3xl font-bold mb-6"
      >
        🎮 Stress Relief Games
      </motion.h1>

      <motion.p
        variants={item}
        className="mb-10 text-slate-1000"
      >
        Take a short break and refresh your mind
      </motion.p>

      <AnimatePresence mode="wait">
        {!selectedGame ? (
          /* ---------------- GAME GRID ---------------- */
          <motion.div
            key="grid"
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {gamesList.map((game) => (
              <GameCard
                key={game.id}
                title={game.title}
                desc={game.desc}
                Icon={game.icon}
                onClick={() => setSelectedGame(game.id)}
              />
            ))}
          </motion.div>
        ) : (
          /* ---------------- SELECTED GAME ---------------- */
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* BACK BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedGame(null)}
              className="
              mb-6 px-5 py-2 rounded-xl
              bg-indigo-500 text-white font-semibold
              shadow-lg
              "
            >
              ← Back to Games
            </motion.button>

            {currentGame && <currentGame.component />}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ---------------- GAME CARD ---------------- */

const GameCard = ({ title, desc, Icon, onClick }: any) => {
  return (
    <motion.button
      variants={item}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="
      p-6 rounded-2xl text-left
      bg-white border border-slate-200
      shadow-md hover:shadow-xl
      transition-all
      "
    >
      <div className="flex items-center gap-4 mb-3">
        <Icon size={28} className="text-indigo-500" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <p className="text-sm text-slate-600">{desc}</p>
    </motion.button>
  );
};

export default Games;