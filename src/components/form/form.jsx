import React, { useState } from "react";
import PlayerSetupForm from "./playerSetupForm/PlayerSetupForm.jsx";
import PlayerNamesForm from "./playerNamesForm/PlayerNamesForm.jsx";
import GameTable from "./gameTable/GameTable.jsx";

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
        <PlayerSetupForm
          form={form}
          playerCountError={playerCountError}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}

      {submittedForm && !namesSubmitted && (
        <PlayerNamesForm
          playerNames={playerNames}
          nameError={nameError}
          handleNameChange={handleNameChange}
          handleNamesSubmit={handleNamesSubmit}
          duplicateIndices={duplicateIndices}
          validIndices={validIndices}
        />
      )}

      {submittedForm && namesSubmitted && (
        <GameTable submittedForm={submittedForm} playerNames={playerNames} />
      )}
    </>
  );
}

export default FormData;
