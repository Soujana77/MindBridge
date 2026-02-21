import { useState, useCallback } from "react";
import GameLayout from "../../components/games/GameLayout";
import { Heart, RefreshCw } from "lucide-react";
import { playChime } from "../../src/lib/sounds";

const affirmations = [
  "You are worthy of love and kindness. 💜",
  "This moment will pass, and brighter days are coming. 🌅",
  "You are stronger than you think. 💪",
  "It's okay to take a break. You deserve rest. 🌿",
  "You are enough, exactly as you are. ✨",
  "Your feelings are valid and important. 💙",
  "Every small step counts. Keep going. 🌱",
  "You bring light to the people around you. 🌟",
  "Be gentle with yourself today. 🦋",
  "You are doing better than you think. 🌸",
  "Your presence makes the world a better place. 🌍",
  "It's okay to not be okay sometimes. 🤗",
  "You have the power to create positive change. 🔥",
  "Breathe. You've got this. 🌬️",
  "Happiness is not a destination, it's a journey. 🛤️",
];

const AffirmationGame = () => {
  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const next = useCallback(() => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * affirmations.length);
    } while (newIndex === index && affirmations.length > 1);
    setIndex(newIndex);
    setAnimKey((k) => k + 1);
    playChime();
  }, [index]);

  return (
    <GameLayout title="Affirmations" description="Receive gentle words of encouragement.">
      <div className="flex flex-col items-center gap-8 min-h-[300px] justify-center">
        <div className="flex items-center gap-2 text-accent">
          <Heart className="w-5 h-5 fill-current" />
          <Heart className="w-4 h-4 fill-current opacity-60" />
          <Heart className="w-3 h-3 fill-current opacity-40" />
        </div>

        <div
          key={animKey}
          className="max-w-md text-center animate-slide-up"
        >
          <p className="text-2xl md:text-3xl font-display font-bold text-foreground leading-relaxed">
            {affirmations[index]}
          </p>
        </div>

        <button
          onClick={next}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-calm text-primary-foreground font-display font-semibold shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          New Affirmation
        </button>
      </div>
    </GameLayout>
  );
};

export default AffirmationGame;
