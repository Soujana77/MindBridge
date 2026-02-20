import { ArrowLeft } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface GameLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const GameLayout = ({ title, description, children }: GameLayoutProps) => {

  const { setActivePage } = useApp();

  return (
    <div className="min-h-screen gradient-soft">

      <div className="container max-w-4xl mx-auto px-4 py-6">

        

        <div className="text-center mb-8 animate-fade-up">

          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            {title}
          </h1>

          <p className="text-muted-foreground font-body text-lg">
            {description}
          </p>

        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>

          {children}

        </div>

      </div>

    </div>
  );
};

export default GameLayout;