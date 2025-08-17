import React from "react";
import "./tablelist.css";

export default function TableList({
  numberOfPlayers,
  gameEndsAfterOrGameEnds,
  maxPointCanEnter,
  playerNames = [],
}) {
  const playerHeaders = playerNames.length
    ? playerNames
    : Array.from({ length: numberOfPlayers }, (_, i) => `Player ${i + 1}`);
  const [scores, setScores] = React.useState([Array(numberOfPlayers).fill(0)]);
  const [finishOrder, setFinishOrder] = React.useState([]); // Track finish order

  // Add a new round when ENTER is clicked
  const handleEnter = () => {
    setScores((prevScores) => [...prevScores, Array(numberOfPlayers).fill(0)]);
  };

  // Update score for a specific round/player
  const handleScoreChange = (roundIdx, playerIdx, value) => {
    const newScores = scores.map((arr) => [...arr]);
    newScores[roundIdx][playerIdx] = Number(value);

    // Calculate new totals
    const newTotals = newScores.reduce((acc, round) => {
      return acc.map((sum, idx) => sum + (round[idx] || 0));
    }, Array(numberOfPlayers).fill(0));

    // If player reaches the end and is not already in finishOrder, add them
    if (
      newTotals[playerIdx] >= gameEndsAfterOrGameEnds &&
      !finishOrder.includes(playerIdx)
    ) {
      setFinishOrder((prevOrder) => [...prevOrder, playerIdx]);
    }

    setScores(newScores);
  };

  // Calculate totals for each player
  const totals = scores.reduce((acc, round) => {
    return acc.map((sum, idx) => sum + (round[idx] || 0));
  }, Array(numberOfPlayers).fill(0));

  // Calculate ranks: finished players get fixed ranks, unfinished players ranked by score
  const ranks = Array(numberOfPlayers).fill(null);

  // Assign fixed ranks to finished players in the order they finished
  finishOrder.forEach((playerIdx, orderIdx) => {
    ranks[playerIdx] = numberOfPlayers - finishOrder.length + orderIdx + 1;
  });

  // Assign ranks to unfinished players using standard competition ranking
  let unfinished = ranks
    .map((rank, idx) => ({ idx, score: totals[idx], rank }))
    .filter((player) => player.rank === null);
  // Standard competition ranking ("122" ranking)
  unfinished.sort((a, b) => a.score - b.score);
  let currentRank = 1;
  for (let i = 0; i < unfinished.length; ) {
    const score = unfinished[i].score;
    const sameScoreCount = unfinished.filter((p) => p.score === score).length;
    for (let j = 0; j < unfinished.length; j++) {
      if (unfinished[j].score === score && ranks[unfinished[j].idx] === null) {
        ranks[unfinished[j].idx] = currentRank;
      }
    }
    i += sameScoreCount;
    currentRank += 1;
  }

  return (
    <div className="table-list-container">
      <button className="table-list-btn" onClick={handleEnter}>
        ENTER
      </button>
      <div className="table-list-wrapper">
        <div className="table-list-scroller">
          <table className="table-list">
            <thead>
              <tr className="table-list-header-row">
                <th className="table-list-player-header">
                  <span role="img" aria-label="player">
                    🧑‍🤝‍🧑
                  </span>{" "}
                  Player
                </th>
                {playerHeaders.map((name, idx) => (
                  <th className="table-list-header-cell" key={idx}>
                    <span className="player-name">{name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="table-list-rank-row">
                <th className="table-list-rank-label">
                  <span role="img" aria-label="rank">
                    🏆
                  </span>{" "}
                  Current Rank
                </th>
                {ranks.map((rank, idx) => {
                  const allZero = scores.every((round) =>
                    round.every((score) => score === 0)
                  );
                  if (allZero) {
                    return (
                      <td className="table-list-rank-cell" key={idx}>
                        <span className="rank-badge"></span>
                      </td>
                    );
                  }
                  const minRank = Math.min(...ranks);
                  const maxRank = Math.max(...ranks);
                  let badgeClass = "rank-badge";
                  let icon = "";
                  if (rank === minRank) {
                    badgeClass += " rank-top";
                    icon = "🥇";
                  }
                  if (rank === maxRank) {
                    badgeClass += " rank-danger";
                    icon = "";
                  }
                  return (
                    <td className="table-list-rank-cell" key={idx}>
                      <span className={badgeClass}>
                        {icon} {rank}
                      </span>
                    </td>
                  );
                })}
              </tr>
              <tr className="table-list-total-row">
                <th className="table-list-total-label">
                  <span role="img" aria-label="total">
                    🧮
                  </span>{" "}
                  Total
                </th>
                {totals.map((total, idx) => (
                  <td className="table-list-total-cell" key={idx}>
                    <span className="total-badge">{total}</span>
                  </td>
                ))}
              </tr>
              {scores.map((round, roundIdx) => (
                <tr className="table-list-round-row" key={roundIdx}>
                  <th className="table-list-round-cell">{`Round ${
                    roundIdx + 1
                  }`}</th>
                  {playerHeaders.map((_, playerIdx) => {
                    const isDisabled =
                      totals[playerIdx] >= gameEndsAfterOrGameEnds;
                    return (
                      <td className="table-list-round-cell" key={playerIdx}>
                        <input
                          type="number"
                          value={scores[roundIdx][playerIdx]}
                          max={maxPointCanEnter}
                          min={0}
                          className={
                            isDisabled
                              ? "table-list-input-disabled"
                              : "table-list-input"
                          }
                          disabled={isDisabled}
                          onChange={(e) =>
                            handleScoreChange(
                              roundIdx,
                              playerIdx,
                              Math.min(Number(e.target.value), maxPointCanEnter)
                            )
                          }
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
