import React, { useState, useEffect, useContext } from "react";
import { GameContext } from "./GameContext";
import GameOver from "./pages/GameOver";
import GameWon from "./pages/GameWon";

export default function Question() {
  const {
    score,
    setScore,
    incrementScore,
    decrementLives,
    addVisitedQuestion,
    lives,
    resetGame,
    gameResetId,
    answeredCorrectly,
    setAnsweredCorrectly,
  } = useContext(GameContext);

  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestion = async (questionId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/question/${questionId}`);
      if (!res.ok) throw new Error("Question not found");
      const data = await res.json();
      setQuestion(data);
      setSelectedOption("");
      addVisitedQuestion(questionId);
    } catch (err) {
      setError(err.message);
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  // Reset game triggers fetch of first question:
  useEffect(() => {
    fetchQuestion("q1");
  }, [gameResetId]); // run on mount and every resetGame()

  const isRetryId = (id) =>
    ["q2", "q4", "q6", "q8"].some((retryPrefix) =>
      id.startsWith(retryPrefix)
    );

    const handleSubmit = () => {
      if (!selectedOption) {
        alert("Please select an option!");
        return;
      }
    
      const chosenOption = question.options.find(opt => opt.text === selectedOption);
    
      if (!chosenOption) {
        setError("Selected option not found");
        return;
      }
    
      const nextQuestionId = chosenOption.next_id;
    
      // Handle correct answers and scoring
      if (chosenOption.isCorrect && !answeredCorrectly.has(question.id)) {
        setScore(prev => prev + 1);
        setAnsweredCorrectly(prev => new Set(prev).add(question.id));
      }
    
      // Handle win condition
      if (!nextQuestionId || nextQuestionId === "end" || nextQuestionId === "win") {
        console.log("Reached win condition");
        setQuestion({ id: "win" }); // This triggers GameWon
        return;
      }
    
      // Handle retry (incorrect path)
      if (isRetryId(nextQuestionId)) {
        console.log("Incorrect answer, reducing life...");
        decrementLives();
      }
    
      // Move to next question
      fetchQuestion(nextQuestionId);
    
      console.log("Chosen option:", chosenOption);
      console.log("Is correct?", chosenOption.isCorrect);
      console.log("Question ID:", question.id);
    };
    

  if (lives === 0) {
    return (
      <GameOver
        onRestart={() => {
          setTimeout(() => {
            resetGame();
          }, 50); // 50ms gives React time to reset context before re-render
        }}
      />
    );
  }

  // Add this guard:
if (loading || !question) {
  return <div>Loading...</div>;
}

  if (question.id === "win") {
    return (
      <GameWon
        onRestart={() => {
          setTimeout(() => {
            resetGame();
          }, 50);
        }}
      />
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
      <ul>
        {question.options.map((option, idx) => (
          <li key={idx}>
            <label className="block cursor-pointer">
              <input
                type="radio"
                name="answer"
                value={option.text}
                checked={selectedOption === option.text}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mr-2"
              />
              {option.text}
            </label>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        onClick={handleSubmit}
        disabled={loading || !selectedOption}
      >
        Next
      </button>
    </div>
  );
}
