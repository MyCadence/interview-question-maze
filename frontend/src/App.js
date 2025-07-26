import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Question from "./Question";
import GameStatus from "./GameStatus";
import GameWon from "./pages/GameWon";
import GameOver from "./pages/GameOver";
import Home from "./pages/Home"; // Make sure this exists

function GameLayout() {
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Question />} />
        <Route path="/game-won" element={<GameWon />} />
        <Route path="/game-over" element={<GameOver />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
