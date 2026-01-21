import React, { useState, useEffect } from "react";
import "./GamePlay.css";

const HINT_TEXT = {
  q1: "Is it on east side?",
  q2: "Does it have a letter?",
  q3: "More than 6 floors?",
  q4: "Is it north of Vassar St?",
  q5: "Is it a dorm?",
};

const DIRECTIONS = ["", "E", "W", "NE", "NW", "SE", "SW"];

const scoreGuess = (guessParts, answerParts) => {
  return guessParts.map((part, i) => {
    if (part === answerParts[i]) {
      return { char: part, status: "correct" };
    }
    if (answerParts.includes(part)) {
      return { char: part, status: "present" };
    }
    return { char: part, status: "absent" };
  });
};

const GamePlay = ({ building, onGameEnd }) => {
  const [selectedDirection, setSelectedDirection] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [scoredGuesses, setScoredGuesses] = useState([]);
  const [revealedHints, setRevealedHints] = useState(1);
  const [gameState, setGameState] = useState("playing");

  const MAX_GUESSES = 5;

  useEffect(() => {
    setSelectedDirection("");
    setSelectedNumber("");
    setScoredGuesses([]);
    setRevealedHints(1);
    setGameState("playing");
  }, [building]);

  const handleSubmit = () => {
    if (gameState !== "playing") return;
    if (!selectedNumber || selectedNumber.length < 2) return;

    const guessParts = [
      selectedDirection.toUpperCase(),
      selectedNumber[0].toUpperCase(),
      selectedNumber[1].toUpperCase(),
    ];

    const answerParts = [
      building.direction.toUpperCase(),
      String(building.number)[0].toUpperCase(),
      String(building.number)[1].toUpperCase(),
    ];

    const scored = scoreGuess(guessParts, answerParts);
    setScoredGuesses((prev) => [...prev, scored]);

    const guessString = guessParts.join("");
    const answerString = answerParts.join("");

    if (guessString === answerString) {
      setGameState("won");
      return;
    }

    if (scoredGuesses.length + 1 >= MAX_GUESSES) {
      setGameState("lost");
      return;
    }

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

      <div className="guess-grid">
        {scoredGuesses.map((row, rowIndex) => (
          <div key={rowIndex} className="guess-row">
            {row.map((tile, tileIndex) => (
              <div key={tileIndex} className={`tile ${tile.status}`}>
                {tile.char}
              </div>
            ))}
          </div>
        ))}
      </div>

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
          <button onClick={onGameEnd}>Play Again</button>
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
