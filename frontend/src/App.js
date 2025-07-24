import React from "react";
import Question from "./Question";
import GameStatus from "./GameStatus";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Interview Question Maze
      </h1>
      <Question />
      <GameStatus />
    </div>
    
  );
}

export default App;