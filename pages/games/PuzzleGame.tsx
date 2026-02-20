import { useState, useEffect, useCallback } from "react";
import GameLayout from "../../components/games/GameLayout";
import { RotateCcw } from "lucide-react";
import { playClick, playSuccess, playChime } from "../../lib/sounds";

const emojis = ["🌸", "🌊", "🌿", "🦋", "🌙", "✨", "🌈", "🍃"];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards(): Card[] {
  const pairs = emojis.flatMap((emoji, i) => [
    { id: i * 2, emoji, flipped: false, matched: false },
    { id: i * 2 + 1, emoji, flipped: false, matched: false },
  ]);
  return shuffle(pairs);
}

const PuzzleGame = () => {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const handleFlip = useCallback((id: number) => {
    if (flipped.length === 2) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    playClick();
    const newCards = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setCards(newCards);
    setFlipped((f) => [...f, id]);
  }, [cards, flipped]);

  useEffect(() => {
    if (flipped.length !== 2) return;

    setMoves((m) => m + 1);
    const [a, b] = flipped;
    const cardA = cards.find((c) => c.id === a)!;
    const cardB = cards.find((c) => c.id === b)!;

    if (cardA.emoji === cardB.emoji) {
      const newCards = cards.map((c) =>
        c.id === a || c.id === b ? { ...c, matched: true } : c
      );
      setCards(newCards);
      setFlipped([]);
      playSuccess();
      if (newCards.every((c) => c.matched)) { setWon(true); playChime(); }
    } else {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c))
        );
        setFlipped([]);
      }, 700);
    }
  }, [flipped, cards]);

  const restart = () => {
    setCards(createCards());
    setFlipped([]);
    setMoves(0);
    setWon(false);
  };

  return (
    <GameLayout title="Puzzle Match" description="Find all matching pairs!">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Moves: <span className="font-bold text-primary">{moves}</span></span>
          <button onClick={restart} className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        {won && (
          <div className="text-center animate-slide-up">
            <p className="text-2xl font-display font-bold text-foreground">🎉 You did it!</p>
            <p className="text-muted-foreground">Completed in {moves} moves</p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl text-2xl font-bold flex items-center justify-center transition-all duration-300 ${
                card.flipped || card.matched
                  ? "gradient-card shadow-card border border-border/50 scale-100"
                  : "bg-primary/10 hover:bg-primary/20 hover:scale-105 border-2 border-transparent"
              } ${card.matched ? "opacity-60" : ""}`}
            >
              {card.flipped || card.matched ? card.emoji : "?"}
            </button>
          ))}
        </div>
      </div>
    </GameLayout>
  );
};

export default PuzzleGame;
