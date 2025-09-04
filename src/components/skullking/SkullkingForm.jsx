import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SkullkingForm.scss";

function PlayerForm() {
  const [playerCount, setPlayerCount] = useState(3);
  const [roundCount, setRoundCount] = useState(10);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/game", { state: { playerCount, roundCount } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="page-heading">Skull King Setup</h1>
      <label>
        Player Count (3-8):
        <input
          type="number"
          min={3}
          max={8}
          value={playerCount}
          onChange={(e) => setPlayerCount(Number(e.target.value))}
          required
        />
      </label>
      <label>
        Round Count (2-10):
        <input
          type="number"
          min={2}
          max={10}
          value={roundCount}
          onChange={(e) => setRoundCount(Number(e.target.value))}
          required
        />
      </label>
      <button type="submit">Start Game</button>
    </form>
  );
}

export default PlayerForm;
