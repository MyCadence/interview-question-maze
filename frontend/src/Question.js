import React, { useState, useEffect } from "react";

export default function Question() {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch question by id from backend
  const fetchQuestion = async (questionId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/question/${questionId}`);
      if (!res.ok) throw new Error("Question not found");
      const data = await res.json();
      setQuestion(data);
      setSelectedOption("");
    } catch (err) {
      setError(err.message);
      setQuestion(null);
    }
    setLoading(false);
  };

  // On mount, load first question (q1)
  useEffect(() => {
    fetchQuestion("q1");
  }, []);

  // Handle answer submission, load next question via selected option's next_id
  const handleSubmit = () => {
    if (!selectedOption) return alert("Please select an option!");
    const nextQuestionId = question.options.find(
      (opt) => opt.text === selectedOption
    )?.next_id;
    if (nextQuestionId) {
      fetchQuestion(nextQuestionId);
    } else {
      setError("No next question found.");
    }
  };

  if (loading) return <div>Loading question...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!question) return null;

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
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSubmit}
      >
        Next
      </button>
    </div>
  );
}
