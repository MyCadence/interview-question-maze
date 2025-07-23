import React from "react";
import Question from "./Question";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Interview Question Maze
      </h1>
      <Question />
    </div>
  );
}

export default App;