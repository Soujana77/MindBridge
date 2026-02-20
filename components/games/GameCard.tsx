import { useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
  delay?: number;
}

const GameCard = ({ title, description, icon: Icon, path, color, delay = 0 }: GameCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="group relative w-full text-left rounded-2xl p-6 gradient-card backdrop-blur-sm border border-border/50 shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2 animate-fade-up overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${color}15, ${color}08)` }}
      />

      <div className="relative z-10">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{ background: `linear-gradient(135deg, ${color}30, ${color}15)` }}
        >
          <Icon className="w-7 h-7" style={{ color }} />
        </div>

        <h3 className="text-lg font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground font-body leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
};

export default GameCard;
