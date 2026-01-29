import React, { useState, useEffect } from "react";
import "./GamePlay.css";
import { post } from "../../utilities";

const HINT_TEXT = {
  q1: "Is it on east side?",
  q2: "Does it have a letter?",
  q3: "More than 6 floors?",
  q4: "Is it north of Vassar St?",
  q5: "Is it a dorm?",
};

const DIRECTIONS = ["", "E", "W", "NE", "NW"];

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

    const guessesThisGame = scoredGuesses.length + 1;

    if (guessString === answerString) {
      setGameState("won");
      post("/api/game/finish", { guessesThisGame });
      return;
    }

    if (guessesThisGame >= MAX_GUESSES) {
      setGameState("lost");
      post("/api/game/finish", { guessesThisGame });
      return;
    }

    setRevealedHints((prev) => prev + 1);
  };
  //deals with the pre-rendered grids
  const blankRow = ["", "", ""];
  return (
    <div className="gameplay-container">
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
      <div className="centered-content">
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

          {Array.from({ length: MAX_GUESSES - scoredGuesses.length }).map((_, i) => (
            <div key={`blank-${i}`} className="guess-row">
              {blankRow.map((_, j) => (
                <div key={j} className="tile blank"></div>
              ))}
            </div>
          ))}
        </div>

        {gameState === "playing" && (
          <div className="input-row">
            <select
              value={selectedDirection}
              onChange={(e) => setSelectedDirection(e.target.value)}
            >
              {DIRECTIONS.map((dir) => (
                <option key={dir} value={dir}>
                  {dir}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="guess-input"
              value={selectedNumber}
              onChange={(e) => setSelectedNumber(e.target.value)}
              placeholder="Guess the building number (2 digits)"
            />

            <button onClick={handleSubmit}>Submit</button>
          </div>
        )}

        {gameState === "won" && (
          <div className="end-screen">
            <div>
              You got it! The answer was {building.name} ({building.direction}
              {building.number})
            </div>
            <button onClick={onGameEnd}>Play Again</button>
          </div>
        )}

        {gameState === "lost" && (
          <div className="end-screen">
            <div>
              Out of guesses! The answer was {building.name} ({building.direction}
              {building.number})
            </div>
            <button onClick={onGameEnd}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePlay;
