import React from "react";
import "./HomePage.css";

export default function HomePage({ onSelectGame }) {
  return (
    <div className="home-container">
      <h1 className="home-title">Select a Game</h1>
      <div className="game-tiles">
        <div
          className="game-tile"
          onClick={() => onSelectGame("5cards")}
          tabIndex={0}
          role="button"
        >
          <div className="game-tile-title">5-Cards Game</div>
        </div>
        <div
          className="game-tile"
          onClick={() => onSelectGame("skullking")}
          tabIndex={0}
          role="button"
        >
          <div className="game-tile-title">Skull King</div>
        </div>
      </div>
    </div>
  );
}
