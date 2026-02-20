import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Games = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const renderGame = () => {
    switch (selectedGame) {
      case "bubble":
        return <BubbleBurst />;
      case "number":
        return <NumberGame />;
      case "puzzle":
        return <PuzzleGame />;
      case "quiz":
        return <QuizGame />;
      case "breathing":
        return <BreathingGame />;
      case "affirmation":
        return <AffirmationGame />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6"
    >
      {/* HEADER */}
      <motion.h1
        variants={item}
        className="text-2xl font-bold mb-6"
      >
        Stress Relief Games
      </motion.h1>

      <AnimatePresence mode="wait">
        {!selectedGame ? (
          /* GAME GRID */
          <motion.div
            key="grid"
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
            className="grid grid-cols-2 gap-4"
          >
            <GameButton
              title="Bubble Burst"
              onClick={() => setSelectedGame("bubble")}
            />
            <GameButton
              title="Number Game"
              onClick={() => setSelectedGame("number")}
            />
            <GameButton
              title="Puzzle Game"
              onClick={() => setSelectedGame("puzzle")}
            />
            <GameButton
              title="Quiz Game"
              onClick={() => setSelectedGame("quiz")}
            />
            <GameButton
              title="Breathing Game"
              onClick={() => setSelectedGame("breathing")}
            />
            <GameButton
              title="Affirmations"
              onClick={() => setSelectedGame("affirmation")}
            />
          </motion.div>
        ) : (
          /* SELECTED GAME */
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedGame(null)}
              className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded"
            >
              Back
            </motion.button>

            {renderGame()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ---------------- GAME BUTTON ---------------- */

const GameButton = ({ title, onClick }: any) => {
  return (
    <motion.button
      variants={item}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="p-6 bg-indigo-100 hover:bg-indigo-200 rounded-xl font-semibold"
    >
      {title}
    </motion.button>
  );
};

export default Games;