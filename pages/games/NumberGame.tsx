import { useState, useEffect, useCallback } from "react";
import GameLayout from "../../components/games/GameLayout";
import { RotateCcw } from "lucide-react";
import { playClick, playWrong, playSuccess } from "../../lib/sounds";

function generateNumbers(count: number): number[] {
  const nums: number[] = [];
  while (nums.length < count) {
    const n = Math.floor(Math.random() * 99) + 1;
    if (!nums.includes(n)) nums.push(n);
  }
  return nums;
}

const NumberGame = () => {
  const [level, setLevel] = useState(1);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [nextTarget, setNextTarget] = useState(0);
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [wrongId, setWrongId] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);

  const gridSize = Math.min(4 + level, 9);

  const startLevel = useCallback((lvl: number) => {
    const nums = generateNumbers(gridSize);
    setNumbers(nums);
    setNextTarget(0);
    setTapped(new Set());
    setWrongId(null);
    setComplete(false);
    setLevel(lvl);
  }, [gridSize]);

  useEffect(() => {
    startLevel(1);
  }, []);

  const sorted = [...numbers].sort((a, b) => a - b);

  const handleTap = (num: number, idx: number) => {
    if (tapped.has(idx)) return;
    if (num === sorted[nextTarget]) {
      playClick();
      const newTapped = new Set(tapped);
      newTapped.add(idx);
      setTapped(newTapped);
      setWrongId(null);

      if (nextTarget + 1 >= numbers.length) {
        setComplete(true);
        playSuccess();
      } else {
        setNextTarget(nextTarget + 1);
      }
    } else {
      playWrong();
      setWrongId(idx);
      setTimeout(() => setWrongId(null), 400);
    }
  };

  const nextLevel = () => startLevel(level + 1);

  const cols = numbers.length <= 6 ? 3 : numbers.length <= 9 ? 3 : 4;

  return (
    <GameLayout title="Number Zen" description="Tap numbers in ascending order.">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Level: <span className="font-bold text-primary">{level}</span></span>
          <button onClick={() => startLevel(level)} className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>
        </div>

        {complete && (
          <div className="text-center animate-slide-up">
            <p className="text-2xl font-display font-bold text-foreground mb-2">🧘 Well done!</p>
            <button onClick={nextLevel} className="px-6 py-2.5 rounded-xl gradient-calm text-primary-foreground font-display font-semibold shadow-soft hover:scale-105 active:scale-95 transition-all">
              Next Level →
            </button>
          </div>
        )}

        <div
          className="grid gap-3 max-w-xs mx-auto"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {numbers.map((num, i) => {
            const isDone = tapped.has(i);
            const isWrong = wrongId === i;
            return (
              <button
                key={i}
                onClick={() => handleTap(num, i)}
                disabled={isDone}
                className={`w-16 h-16 rounded-xl font-display font-bold text-lg flex items-center justify-center transition-all duration-300 ${
                  isDone
                    ? "bg-primary/20 text-primary/40 scale-90"
                    : isWrong
                    ? "bg-red-100 text-red-500 animate-[pulse_0.3s_ease-in-out] border-2 border-red-300"
                    : "gradient-card shadow-card border border-border/50 text-foreground hover:scale-105 hover:shadow-glow cursor-pointer active:scale-95"
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          Find: <span className="font-bold text-primary">{!complete && sorted[nextTarget]}</span>
        </p>
      </div>
    </GameLayout>
  );
};

export default NumberGame;
