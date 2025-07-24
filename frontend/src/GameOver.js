// src/GameOver.js
import React from "react";

export default function GameOver({ onRestart }) {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Game Over</h2>
      <p className="mb-4">You’ve run out of lives. Better luck next time!</p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={onRestart}
      >
        Restart
      </button>
    </div>
  );
}
