import React, { useState } from "react";
import { useEffect } from "react";

const HINT_TEXT = {
  q1: "Is it on east side?",
  q2: "Does it have a letter?",
  q3: "More than 6 floors?",
  q4: "Is it north of Vassar St?",
  q5: "Is it a dorm?",
};

const DIRECTIONS = ["", "E", "W", "NE", "NW", "SE", "SW"];

const GamePlay = ({ building, onGameEnd }) => {
  const [selectedDirection, setSelectedDirection] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [revealedHints, setRevealedHints] = useState(1); // first hint shown
  const [gameState, setGameState] = useState("playing");

  const MAX_GUESSES = 5;

  useEffect(() => {
    // Reset all state when a new building arrives
    setSelectedDirection("");
    setSelectedNumber("");
    setGuesses([]);
    setRevealedHints(1);
    setGameState("playing");
  }, [building]);

  const handleSubmit = () => {
    if (gameState !== "playing") return;

    const userGuess = `${selectedDirection}${selectedNumber}`.toLowerCase();
    const answer = `${building.direction}${building.number}`.toLowerCase();

    setGuesses((prev) => [...prev, userGuess]);

    if (userGuess === answer) {
      setGameState("won");
      return; // stop here, do NOT restart the game yet
    }

    // Wrong guess
    if (guesses.length + 1 >= MAX_GUESSES) {
      setGameState("lost");
      return;
    }

    // Reveal next hint
    setRevealedHints((prev) => prev + 1);
  };

  return (
    <div className="gameplay-container">
      {gameState === "playing" && (
        <>
          <select value={selectedDirection} onChange={(e) => setSelectedDirection(e.target.value)}>
            {DIRECTIONS.map((dir) => (
              <option key={dir} value={dir}>
                {dir}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(e.target.value)}
            placeholder="Building number"
          />

          <button onClick={handleSubmit}>Submit</button>
        </>
      )}

      {/* Hints Section */}
      <div className="hints">
        {Object.keys(HINT_TEXT).map((key, index) => {
          const hintNumber = index + 1;
          const isRevealed = hintNumber <= revealedHints;
          const isTrue = building.questions[key] === true;

          return (
            <p key={key}>
              Hint {hintNumber}: {HINT_TEXT[key]} → {isRevealed ? (isTrue ? "True" : "False") : "?"}
            </p>
          );
        })}
      </div>

      {gameState === "won" && (
        <div className="end-screen">
          <div>You got it!</div>
          <button
            onClick={() => {
              console.log("Play Again clicked");
              onGameEnd();
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {gameState === "lost" && (
        <div className="end-screen">
          <div>
            Out of guesses! The answer was {building.direction}
            {building.number}
          </div>
          <button onClick={onGameEnd}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default GamePlay;
