// src/GameStatus.js
import React, { useContext } from "react";
import { GameContext } from "./GameContext";

export default function GameStatus() {
  const { score, lives } = useContext(GameContext);

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 text-center z-50">
      <div className="text-lg font-semibold">Game Status</div>
      <div className="mt-2">
        <p>Score: <span className="font-bold">{score}</span></p>
        <p>Lives: <span className="font-bold">{lives}</span></p>
      </div>
    </div>
  );
}
