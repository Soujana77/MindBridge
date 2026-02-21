import { useState, useEffect, useRef } from "react";
import GameLayout from "../../components/games/GameLayout";
import { playBreathTone } from "../../src/lib/sounds";

const INHALE_DURATION = 4000;
const HOLD_DURATION = 4000;
const EXHALE_DURATION = 4000;

type Phase = "inhale" | "hold" | "exhale";

const phaseConfig: Record<Phase, { label: string; next: Phase; duration: number }> = {
  inhale: { label: "Inhale...", next: "hold", duration: INHALE_DURATION },
  hold: { label: "Hold...", next: "exhale", duration: HOLD_DURATION },
  exhale: { label: "Exhale...", next: "inhale", duration: EXHALE_DURATION },
};

const BreathingGame = () => {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!isActive) return;

    const config = phaseConfig[phase];
    if (phase === "inhale") playBreathTone(true);
    else if (phase === "exhale") playBreathTone(false);
    timerRef.current = setTimeout(() => {
      if (phase === "exhale") setCycles((c) => c + 1);
      setPhase(config.next);
    }, config.duration);

    return () => clearTimeout(timerRef.current);
  }, [phase, isActive]);

  const toggle = () => {
    setIsActive(!isActive);
    if (!isActive) setPhase("inhale");
  };

  const scale = phase === "inhale" ? "scale-100" : phase === "hold" ? "scale-100" : "scale-[0.6]";
  const glowIntensity = phase === "inhale" ? "shadow-glow" : phase === "hold" ? "animate-glow" : "";

  return (
    <GameLayout title="Breathing Relaxation" description="Follow the circle to calm your mind.">
      <div className="flex flex-col items-center gap-8">
        <p className="text-muted-foreground">Completed cycles: <span className="font-bold text-primary">{cycles}</span></p>

        <div className="relative flex items-center justify-center w-64 h-64">
          {/* Outer glow ring */}
          <div
            className={`absolute w-52 h-52 rounded-full transition-all duration-[4000ms] ease-in-out ${isActive ? scale : "scale-[0.6]"} ${glowIntensity}`}
            style={{
              background: "radial-gradient(circle, hsl(220 60% 65% / 0.15), transparent)",
            }}
          />

          {/* Main breathing circle */}
          <div
            className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${isActive ? scale : "scale-[0.6]"}`}
            style={{
              background: "radial-gradient(circle at 40% 35%, hsl(220 60% 70%), hsl(258 60% 55%))",
              boxShadow: "0 0 60px hsl(258 60% 55% / 0.3)",
            }}
          >
            <span className="text-primary-foreground font-display font-bold text-lg text-center select-none">
              {isActive ? phaseConfig[phase].label : "Ready"}
            </span>
          </div>
        </div>

        <button
          onClick={toggle}
          className="px-8 py-3 rounded-xl gradient-calm text-primary-foreground font-display font-semibold shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {isActive ? "Stop" : "Start Breathing"}
        </button>
      </div>
    </GameLayout>
  );
};

export default BreathingGame;
