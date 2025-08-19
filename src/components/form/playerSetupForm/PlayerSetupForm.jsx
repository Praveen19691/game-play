import "./playerSetupForm.css";

export default function PlayerSetupForm({
  form,
  playerCountError,
  handleChange,
  handleSubmit,
}) {
  return (
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
  );
}
