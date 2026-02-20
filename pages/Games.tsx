import React, { useState } from "react";

import BubbleBurst from "./games/BubbleBurst";
import NumberGame from "./games/NumberGame";
import PuzzleGame from "./games/PuzzleGame";
import QuizGame from "./games/QuizGame";
import BreathingGame from "./games/BreathingGame";
import AffirmationGame from "./games/AffirmationGame";

const Games = () => {

  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const renderGame = () => {

    switch(selectedGame){

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

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Stress Relief Games
      </h1>

      {!selectedGame && (

        <div className="grid grid-cols-2 gap-4">

          <GameButton title="Bubble Burst" onClick={()=>setSelectedGame("bubble")} />

          <GameButton title="Number Game" onClick={()=>setSelectedGame("number")} />

          <GameButton title="Puzzle Game" onClick={()=>setSelectedGame("puzzle")} />

          <GameButton title="Quiz Game" onClick={()=>setSelectedGame("quiz")} />

          <GameButton title="Breathing Game" onClick={()=>setSelectedGame("breathing")} />

          <GameButton title="Affirmations" onClick={()=>setSelectedGame("affirmation")} />

        </div>

      )}

      {selectedGame && (

        <div>

          <button
            onClick={()=>setSelectedGame(null)}
            className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded"
          >
            Back
          </button>

          {renderGame()}

        </div>

      )}

    </div>
  );
};

const GameButton = ({title,onClick}:any)=>{

  return(

    <button
      onClick={onClick}
      className="p-6 bg-indigo-100 hover:bg-indigo-200 rounded-xl font-semibold"
    >
      {title}
    </button>
  );
};

export default Games;