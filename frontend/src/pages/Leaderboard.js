import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/leaderboard");
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <ul className="divide-y divide-gray-200">
          {players.map((player, idx) => (
            <li
              key={idx}
              className="flex justify-between py-3 text-lg font-medium"
            >
              <span>{idx + 1}. {player.username}</span>
              <span className="text-blue-600">{player.score}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        ⬅ Back to Home
      </button>
    </div>
  );
}
