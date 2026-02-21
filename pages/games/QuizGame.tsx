import { useState, useCallback } from "react";
import GameLayout from "../../components/games/GameLayout";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { playSuccess, playWrong, playClick } from "../../src/lib/sounds";

const questions = [
  { q: "What is the happiest animal on Earth?", options: ["Dolphin", "Quokka", "Golden Retriever", "Penguin"], answer: 1 },
  { q: "How many times does the average person laugh per day?", options: ["5", "17", "50", "100"], answer: 1 },
  { q: "What is a group of flamingos called?", options: ["A flock", "A flamboyance", "A squad", "A parade"], answer: 1 },
  { q: "Which fruit is technically a berry?", options: ["Strawberry", "Banana", "Raspberry", "Cherry"], answer: 1 },
  { q: "How long is a goldfish's memory?", options: ["3 seconds", "3 minutes", "Months", "1 hour"], answer: 2 },
  { q: "What color is a hippo's sweat?", options: ["Clear", "Red", "Yellow", "Blue"], answer: 1 },
  { q: "What do you call a sleeping dinosaur?", options: ["A dino-snore", "A rest-o-saurus", "A nap-tor", "A sleep-a-don"], answer: 0 },
  { q: "Which planet has the shortest day?", options: ["Mercury", "Mars", "Jupiter", "Saturn"], answer: 2 },
];

const QuizGame = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[current];
  const isCorrect = selected === question.answer;

  const handleSelect = useCallback((i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === question.answer) {
      setScore((s) => s + 1);
      playSuccess();
    } else {
      playWrong();
    }
  }, [selected, question.answer]);

  const handleNext = () => {
    playClick();
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <GameLayout title="Funny Quiz" description="Lighthearted fun questions!">
        <div className="flex flex-col items-center gap-6 animate-slide-up">
          <div className="text-6xl mb-2">🎉</div>
          <h2 className="text-2xl font-display font-bold text-foreground">Great job!</h2>
          <p className="text-lg text-muted-foreground">You scored <span className="text-primary font-bold">{score}</span> out of {questions.length}</p>
          <button onClick={restart} className="px-8 py-3 rounded-xl gradient-calm text-primary-foreground font-display font-semibold shadow-soft hover:shadow-glow transition-all hover:scale-105 active:scale-95">
            Play Again
          </button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Funny Quiz" description="Lighthearted fun questions!">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
          <span>Question {current + 1}/{questions.length}</span>
          <span>Score: {score}</span>
        </div>

        <div className="gradient-card rounded-2xl p-6 shadow-card border border-border/50 mb-4 animate-slide-up" key={current}>
          <p className="text-xl font-display font-bold text-foreground mb-6">{question.q}</p>

          <div className="grid gap-3">
            {question.options.map((opt, i) => {
              let styles = "border-border/50 hover:border-primary/30 hover:bg-primary/5";
              if (selected !== null) {
                if (i === question.answer) styles = "border-[hsl(var(--success))] bg-[hsl(var(--success-light))] text-[hsl(var(--success))]";
                else if (i === selected) styles = "border-[hsl(var(--error))] bg-[hsl(var(--error-light))] text-[hsl(var(--error))]";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border-2 font-body transition-all ${styles} disabled:cursor-default`}
                >
                  <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {selected !== null && i === question.answer && <CheckCircle2 className="w-5 h-5 ml-auto text-[hsl(var(--success))]" />}
                  {selected !== null && i === selected && i !== question.answer && <XCircle className="w-5 h-5 ml-auto text-[hsl(var(--error))]" />}
                </button>
              );
            })}
          </div>
        </div>

        {selected !== null && (
          <div className="flex justify-between items-center animate-fade-up">
            <p className="text-sm font-medium">{isCorrect ? "🎉 Correct!" : "😄 Good try!"}</p>
            <button onClick={handleNext} className="inline-flex items-center gap-1 px-5 py-2 rounded-xl gradient-calm text-primary-foreground font-display font-semibold shadow-soft hover:scale-105 active:scale-95 transition-all">
              {current + 1 >= questions.length ? "Results" : "Next"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </GameLayout>
  );
};

export default QuizGame;
