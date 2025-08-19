import "./playerNamesForm.css";

export default function PlayerNamesForm({
  playerNames,
  nameError,
  handleNameChange,
  handleNamesSubmit,
  duplicateIndices,
  validIndices,
}) {
  return (
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
  );
}
