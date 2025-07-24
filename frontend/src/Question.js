import React, { useState, useEffect, useContext } from "react";
import { GameContext } from "./GameContext";
import GameOver from "./GameOver";

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
    ["q2", "q4", "q6", "q8", "q10"].some((retryPrefix) =>
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
    
      // Game completed
      if (!nextQuestionId || nextQuestionId === "end" || nextQuestionId === "win") {
        if (chosenOption.isCorrect && !answeredCorrectly.has(question.id)) {
          setScore(prev => prev + 1);
          setAnsweredCorrectly(prev => new Set(prev).add(question.id));
        }
    
        alert("🎉 Congratulations! You've completed the game.");
        setTimeout(() => resetGame(), 50);
        return;
      }
    
      // Handle forced restart (like q9 Restart)
      if (question.id === "q9" && selectedOption === "Restart") {
        resetGame();
        return;
      }
    
      // Retry logic
      if (isRetryId(nextQuestionId)) {
        const projectedLives = lives - 1;
        decrementLives();
        if (projectedLives <= 0) {
          alert("💀 Game Over! Restarting...");
          resetGame();
          return;
        }
      } else {
        // Award point only if correct and not previously scored
        if (chosenOption.isCorrect && !answeredCorrectly.has(question.id)) {
          setScore(prev => prev + 1);
          setAnsweredCorrectly(prev => new Set(prev).add(question.id));
        }
      }
    
      fetchQuestion(nextQuestionId);

      console.log("Chosen option:", chosenOption);
      console.log("Is correct?", chosenOption.isCorrect);
      console.log("Question ID:", question.id);
    };
    

  if (loading) return <div>Loading question...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!question) return null;

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
