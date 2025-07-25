import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function GameOver() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-center px-4">
      <h1 className="text-4xl font-bold text-red-700 mb-4">💀 Game Over</h1>
      <p className="text-lg text-gray-800 mb-6">
        You ran out of lives! Don’t worry — try again and sharpen your skills.
      </p>
      <div className="space-x-4">
        <button
          className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          onClick={() => navigate('/')}
        >
          Go to Home
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={() => navigate('/game')}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
