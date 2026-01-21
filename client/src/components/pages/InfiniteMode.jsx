import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Skeleton.css";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const InfiniteMode = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    console.log("Updated guesses:", guesses);
  }, [guesses]);

  const handleSubmit = () => {
    console.log("guess: " + guess);
    const guessChars = guess.split("");
    console.log("guessChars: " + guessChars);
    let guessCorrects = [];
    setGuesses([...guesses, guess]);
    setGuess("");
    console.log("guess: " + guess);
  };

  return (
    <div className="input-section">
      <input
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Guess the MIT building..."
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default InfiniteMode;
