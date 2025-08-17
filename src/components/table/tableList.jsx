import React from "react";
import "./tablelist.css";

export default function TableList({
  numberOfPlayers,
  gameEndsAfterOrGameEnds,
  maxPointCanEnter,
}) {
  const playerHeaders = Array.from(
    { length: numberOfPlayers },
    (_, i) => `Player ${i + 1}`
  );
  const [scores, setScores] = React.useState([Array(numberOfPlayers).fill(0)]);

  // Add a new round when ENTER is clicked
  const handleEnter = () => {
    setScores((prevScores) => [...prevScores, Array(numberOfPlayers).fill(0)]);
  };

  // Update score for a specific round/player
  const handleScoreChange = (roundIdx, playerIdx, value) => {
    const newScores = scores.map((arr) => [...arr]);
    newScores[roundIdx][playerIdx] = Number(value);
    setScores(newScores);
  };

  // Calculate totals for each player
  const totals = scores.reduce((acc, round) => {
    return acc.map((sum, idx) => sum + (round[idx] || 0));
  }, Array(numberOfPlayers).fill(0));

  return (
    <>
      <button onClick={handleEnter}>ENTER</button>
      <table className="table-list">
        <thead>
          <tr>
            <th></th>
            {playerHeaders.map((name, idx) => (
              <th key={idx}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Total</th>
            {totals.map((total, idx) => (
              <td key={idx}>
                <input type="number" value={total} readOnly />
              </td>
            ))}
          </tr>
          {scores.map((round, roundIdx) => (
            <tr key={roundIdx}>
              <th>{`Round ${roundIdx + 1}`}</th>
              {playerHeaders.map((_, playerIdx) => (
                <td key={playerIdx}>
                  <input
                    type="number"
                    value={scores[roundIdx][playerIdx]}
                    max={maxPointCanEnter}
                    min={0}
                    disabled={totals[playerIdx] >= gameEndsAfterOrGameEnds}
                    onChange={(e) =>
                      handleScoreChange(
                        roundIdx,
                        playerIdx,
                        Math.min(Number(e.target.value), maxPointCanEnter)
                      )
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
