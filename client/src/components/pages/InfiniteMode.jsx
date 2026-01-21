import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import GamePlay from "../modules/GamePlay";

const InfiniteMode = () => {
  const [building, setBuilding] = useState(null);

  const startGame = () => {
    console.log("startGame called");

    get("/api/random-building").then((b) => {
      console.log("New building:", b);
      setBuilding(b);
    });
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div>
      {!building && <div>Loading...</div>}
      {building && <GamePlay key={building._id} building={building} onGameEnd={startGame} />}
    </div>
  );
};

export default InfiniteMode;
