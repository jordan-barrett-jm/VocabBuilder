// pages/quiz.js
import React, { useState, useEffect } from "react";

export default function QuizPage() {
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDueWords() {
      try {
        const res = await fetch("/api/getDueWords");
        const data = await res.json();
        setWords(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch due words", err);
        setLoading(false);
      }
    }
    fetchDueWords();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (words.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-semibold">No Words Due Today!</h1>
        <p>All caught up!</p>
      </div>
    );
  }

  const currentWord = words[index];

  async function handleMark(correct) {
    try {
      await fetch("/api/markWord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentWord.id, correct }),
      });
    } catch (error) {
      console.error("Error updating word:", error);
    }

    // Move to next
    setShowDefinition(false);
    setIndex((i) => i + 1);
  }

  if (index >= words.length) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-semibold">Done for now!</h1>
        <p>You have reviewed {words.length} words.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Daily Quiz</h1>

      <div className="border p-4 rounded shadow max-w-md w-full mb-4">
        <h2 className="text-xl font-semibold">Word:</h2>
        <p className="text-lg mt-1 mb-3">{currentWord.word}</p>

        {showDefinition ? (
          <>
            <h3 className="font-semibold">Definition:</h3>
            <p className="italic">
              {currentWord.definition || "(No definition)"}
            </p>
          </>
        ) : (
          <button
            className="mt-2 mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setShowDefinition(true)}
          >
            Reveal Definition
          </button>
        )}

        <div className="flex space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => handleMark(true)}
          >
            I Knew It
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={() => handleMark(false)}
          >
            I Forgot
          </button>
        </div>
      </div>

      <p className="text-gray-600">
        {index + 1} / {words.length} word{words.length > 1 ? "s" : ""}
      </p>
    </div>
  );
}
