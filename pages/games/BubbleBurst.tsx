import { useState, useCallback } from "react";
import GameLayout from "../../components/games/GameLayout";
import { playPop } from "../../lib/sounds";

interface Particle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
  size: number;
}

const colors = [
  "hsl(258, 60%, 55%)",
  "hsl(220, 60%, 65%)",
  "hsl(280, 50%, 70%)",
  "hsl(200, 65%, 55%)",
  "hsl(330, 60%, 60%)",
  "hsl(45, 80%, 55%)",
];

const BubbleBurst = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [bubbleKey, setBubbleKey] = useState(0);
  const [isBursting, setIsBursting] = useState(false);
  const [score, setScore] = useState(0);

  const burst = useCallback(() => {
    if (isBursting) return;
    playPop();
    setIsBursting(true);
    setScore((s) => s + 1);

    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 20 + Math.random() * 0.5;
      const dist = 80 + Math.random() * 120;
      return {
        id: Date.now() + i,
        x: 0,
        y: 0,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 16,
      };
    });

    setParticles(newParticles);

    setTimeout(() => {
      setParticles([]);
      setIsBursting(false);
      setBubbleKey((k) => k + 1);
    }, 800);
  }, [isBursting]);

  return (
    <GameLayout title="Bubble Burst" description="Click the bubble for a satisfying pop!">
      <div className="flex flex-col items-center gap-6">
        <p className="text-muted-foreground font-body">Bubbles popped: <span className="font-bold text-primary">{score}</span></p>

        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Main Bubble */}
          {!isBursting && (
            <button
              key={bubbleKey}
              onClick={burst}
              className="w-40 h-40 rounded-full cursor-pointer animate-float transition-transform active:scale-90"
              style={{
                background: "radial-gradient(circle at 35% 35%, hsl(258 60% 75% / 0.8), hsl(220 60% 55% / 0.6))",
                boxShadow: "0 0 40px hsl(258 60% 55% / 0.3), inset 0 -10px 20px hsl(220 60% 65% / 0.3), inset 0 10px 20px hsl(0 0% 100% / 0.4)",
              }}
            >
              <div className="w-10 h-6 bg-white/40 rounded-full absolute top-8 left-10 rotate-[-30deg] blur-[1px]" />
            </button>
          )}

          {/* Particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                left: "50%",
                top: "50%",
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
                "--tx": `${p.tx}px`,
                "--ty": `${p.ty}px`,
                animation: "scatter 0.7s ease-out forwards",
                opacity: 0.9,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <p className="text-sm text-muted-foreground">Click the bubble to release stress ✨</p>
      </div>
    </GameLayout>
  );
};

export default BubbleBurst;
