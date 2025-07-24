import { createContext, useState } from "react";

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [gameResetId, setGameResetId] = useState(0); // Added to trigger resets

  const incrementScore = () => {
    setScore((prev) => {
      console.log("[GameContext] incrementScore called. New score:", prev + 1);
      return prev + 1;
    });
  };
  const decrementLives = () => {
    setLives((prev) => {
      const newLives = Math.max(prev - 1, 0);
      console.log("[GameContext] decrementLives called. New lives:", newLives);
      return newLives;
    });
  };
  const addVisitedQuestion = (id) => {
    setVisitedQuestions((prev) => {
      const newSet = new Set([...prev, id]);
      console.log("[GameContext] addVisitedQuestion called. Visited questions:", Array.from(newSet));
      return newSet;
    });
  };

  const resetGame = () => {
    console.log("[GameContext] resetGame called. Resetting score to 0, lives to 3, visitedQuestions cleared.");
    setScore(0);
    setLives(3);
    setVisitedQuestions(new Set());
    setGameResetId((prev) => prev + 1); // Increment to signal reset
  };

  return (
    <GameContext.Provider
      value={{
        score,
        lives,
        visitedQuestions,
        incrementScore,
        decrementLives,
        addVisitedQuestion,
        resetGame,
        gameResetId, // expose this so consumers can watch for reset
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
