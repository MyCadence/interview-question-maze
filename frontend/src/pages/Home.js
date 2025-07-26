import React from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";

function Home() {
  const navigate = useNavigate();
  const { resetGame } = useGame();

  const handlePlay = () => {
    resetGame(); // Reset score, lives, and current question
    navigate("/play"); // Go to the first question
  };

  const handleLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Interview Question Maze
      </h1>
      <p className="mb-8 text-lg text-center max-w-xl">
        Test your knowledge, make it through the maze of interview questions,
        and see how far you can go!
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={handlePlay}
          className="bg-blue-600 text-white py-3 px-6 rounded-2xl shadow hover:bg-blue-700 transition"
        >
          Play
        </button>
        <button
          onClick={handleLeaderboard}
          className="bg-gray-300 text-black py-3 px-6 rounded-2xl shadow hover:bg-gray-400 transition"
        >
          View Leaderboard
        </button>
      </div>
    </div>
  );
}

export default Home;
