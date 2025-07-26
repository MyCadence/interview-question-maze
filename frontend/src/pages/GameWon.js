import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../GameContext'; // adjust the path as needed

export default function GameWon() {
  const navigate = useNavigate();
  const { resetGame } = useGame(); // reset function from GameContext

  const handleRestart = () => {
    resetGame();       // clear lives, score, etc.
    navigate('/play'); // go to the first question
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100 text-center px-4">
      <h1 className="text-4xl font-bold text-green-700 mb-4">🎉 You Won!</h1>
      <p className="text-lg text-gray-800 mb-6">
        Great job! You completed the Interview Memory Maze.
      </p>
      <div className="space-x-4">
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
          onClick={() => navigate('/')}
        >
          Go to Home
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={handleRestart}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
