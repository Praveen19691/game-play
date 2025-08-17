import React, { useState } from "react";
import "./form.css";
import TableList from "../table/tableList";

function FormData() {
  const [form, setForm] = useState({
    numberOfPlayers: 3,
    gameEndsAfterOrGameEnds: 200,
    maxPointCanEnter: 25,
  });
  const [submittedForm, setSubmittedForm] = useState(null);
  const [playerNames, setPlayerNames] = useState([]);
  const [namesSubmitted, setNamesSubmitted] = useState(false);
  const [nameError, setNameError] = useState("");
  const [playerCountError, setPlayerCountError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "numberOfPlayers" && Number(value) > 8) {
      setPlayerCountError("Maximum 8 players are allowed.");
      setForm({ ...form, [name]: 8 });
      return;
    } else {
      setPlayerCountError("");
    }
    setForm({ ...form, [name]: Number(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedForm(form);
    setPlayerNames(Array(form.numberOfPlayers).fill(""));
  };

  const handleNameChange = (idx, value) => {
    const newNames = [...playerNames];
    newNames[idx] = value;
    setPlayerNames(newNames);
  };

  const handleNamesSubmit = (e) => {
    e.preventDefault();
    // Check for duplicate names
    const trimmedNames = playerNames.map((name) => name.trim().toLowerCase());
    const nameSet = new Set(trimmedNames);
    if (nameSet.size !== trimmedNames.length) {
      setNameError("Player names must be unique.");
      return;
    }
    setNameError("");
    setNamesSubmitted(true);
  };

  // Helper to find duplicate name indices
  const getDuplicateIndices = () => {
    const trimmedNames = playerNames.map((name) => name.trim().toLowerCase());
    const counts = {};
    trimmedNames.forEach((name) => {
      if (name) counts[name] = (counts[name] || 0) + 1;
    });
    // Mark all indices where the name occurs more than once
    return trimmedNames
      .map((name, idx) => (name && counts[name] > 1 ? idx : null))
      .filter((idx) => idx !== null);
  };

  // Helper to find valid name indices
  const getValidIndices = () => {
    const trimmedNames = playerNames.map((name) => name.trim().toLowerCase());
    const counts = {};
    trimmedNames.forEach((name) => {
      if (name) counts[name] = (counts[name] || 0) + 1;
    });
    return trimmedNames
      .map((name, idx) => (name && counts[name] === 1 ? idx : null))
      .filter((idx) => idx !== null);
  };

  const duplicateIndices = getDuplicateIndices();
  const validIndices = getValidIndices();

  return (
    <>
      {!submittedForm && (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="label" htmlFor="numberOfPlayers">
                Number of players:
              </label>
              <input
                type="number"
                className="number"
                id="numberOfPlayers"
                name="numberOfPlayers"
                value={form.numberOfPlayers}
                onChange={handleChange}
                min={2}
                max={8}
              />
              {playerCountError && (
                <div className="error-message">{playerCountError}</div>
              )}
            </div>
            <div>
              <label className="label" htmlFor="gameEndsAfterOrGameEnds">
                Game ends after:
              </label>
              <input
                type="number"
                className="number"
                id="gameEndsAfterOrGameEnds"
                name="gameEndsAfterOrGameEnds"
                value={form.gameEndsAfterOrGameEnds}
                onChange={handleChange}
                min={1}
              />
            </div>
            <div>
              <label className="label" htmlFor="maxPointCanEnter">
                Maximum points in a round:
              </label>
              <input
                type="number"
                className="number"
                id="maxPointCanEnter"
                name="maxPointCanEnter"
                value={form.maxPointCanEnter}
                onChange={handleChange}
                min={1}
              />
            </div>
            <button type="submit" className="button">
              Submit
            </button>
          </form>
        </div>
      )}

      {submittedForm && !namesSubmitted && (
        <div className="card">
          <form onSubmit={handleNamesSubmit}>
            <div className="player-names-title">Enter Player Names</div>
            <div className="player-names-grid">
              {playerNames.map((name, idx) => (
                <div className="player-name-grid-item" key={idx}>
                  <label
                    className="label player-name-label"
                    htmlFor={`playerName${idx}`}
                  >
                    Player {idx + 1} Name:
                  </label>
                  <input
                    id={`playerName${idx}`}
                    type="text"
                    className={`number${
                      duplicateIndices.includes(idx)
                        ? " duplicate-name"
                        : validIndices.includes(idx)
                        ? " valid-name"
                        : ""
                    }`}
                    value={name}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
            {nameError && <div className="error-message">{nameError}</div>}
            <button type="submit" className="button">
              Start Game
            </button>
          </form>
        </div>
      )}

      {submittedForm && namesSubmitted && (
        <TableList
          numberOfPlayers={submittedForm.numberOfPlayers}
          gameEndsAfterOrGameEnds={submittedForm.gameEndsAfterOrGameEnds}
          maxPointCanEnter={submittedForm.maxPointCanEnter}
          playerNames={playerNames}
        />
      )}
    </>
  );
}

export default FormData;
