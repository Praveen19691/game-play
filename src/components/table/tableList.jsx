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
  // Removed unused finishOrder state
  const [finishRounds, setFinishRounds] = React.useState(
    Array(numberOfPlayers).fill(null)
  ); // Track the round in which each player finished

  // Add a new round when ENTER is clicked
  const handleEnter = () => {
    setScores((prevScores) => [...prevScores, Array(numberOfPlayers).fill(0)]);
  };

  // Update score for a specific round/player
  const handleScoreChange = (roundIdx, playerIdx, value) => {
    const newScores = scores.map((arr) => [...arr]);
    newScores[roundIdx][playerIdx] = Number(value);

    const newTotals = newScores.reduce((acc, round) => {
      return acc.map((sum, idx) => sum + (round[idx] || 0));
    }, Array(numberOfPlayers).fill(0));

    // If player reaches the end and hasn't finished, record their finish round
    if (
      newTotals[playerIdx] >= gameEndsAfterOrGameEnds &&
      finishRounds[playerIdx] === null
    ) {
      const updatedFinishRounds = [...finishRounds];
      updatedFinishRounds[playerIdx] = roundIdx;
      setFinishRounds(updatedFinishRounds);
    }

    setScores(newScores);
  };

  // Calculate totals for each player
  const totals = scores.reduce((acc, round) => {
    return acc.map((sum, idx) => sum + (round[idx] || 0));
  }, Array(numberOfPlayers).fill(0));

  // Calculate ranks: finished players get fixed ranks, unfinished players ranked by score
  const ranks = Array(numberOfPlayers).fill(null);

  // Find all finished players and their finish rounds
  const finishedPlayers = finishRounds
    .map((round, idx) => ({ idx, round }))
    .filter((p) => p.round !== null);

  // Sort by finish round (ascending)
  finishedPlayers.sort((a, b) => a.round - b.round);

  // Assign ranks: players finishing in the same round get the same last available rank
  let finishedRanks = {};
  let ranksAssigned = 0;
  for (let i = 0; i < finishedPlayers.length; ) {
    const thisRound = finishedPlayers[i].round;
    const sameRoundPlayers = finishedPlayers.filter(
      (p) => p.round === thisRound
    );
    const rankForThisRound =
      numberOfPlayers - ranksAssigned - sameRoundPlayers.length + 1;
    sameRoundPlayers.forEach((p) => {
      finishedRanks[p.idx] = rankForThisRound;
    });
    i += sameRoundPlayers.length;
    ranksAssigned += sameRoundPlayers.length;
  }

  // Assign ranks to unfinished players using standard competition ranking
  let unfinished = ranks
    .map((rank, idx) => ({ idx, score: totals[idx], rank }))
    .filter((player) => player.rank === null);
  // Standard competition ranking ("122" ranking)
  unfinished.sort((a, b) => a.score - b.score);
  let currentRankUnfinished = 1;
  for (let i = 0; i < unfinished.length; ) {
    const score = unfinished[i].score;
    const sameScoreCount = unfinished.filter((p) => p.score === score).length;
    for (let j = 0; j < unfinished.length; j++) {
      if (unfinished[j].score === score && ranks[unfinished[j].idx] === null) {
        ranks[unfinished[j].idx] = currentRankUnfinished;
      }
    }
    i += sameScoreCount;
    currentRankUnfinished += 1;
  }

  // Check if game is over (all but one player finished)
  const finishedCount = Object.keys(finishedRanks).length;
  const gameOver = finishedCount === numberOfPlayers - 1;

  // If game is over, assign rank 1 to the last unfinished player
  if (gameOver) {
    const unfinishedIdx = Array.from(
      { length: numberOfPlayers },
      (_, idx) => idx
    ).find((idx) => finishedRanks[idx] === undefined);
    if (unfinishedIdx !== undefined) {
      finishedRanks[unfinishedIdx] = 1;
    }
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
                  Rank
                </th>
                {playerHeaders.map((_, idx) => {
                  if (totals[idx] < gameEndsAfterOrGameEnds && !gameOver) {
                    return (
                      <td className="table-list-rank-cell" key={idx}>
                        <span className="rank-badge"></span>
                      </td>
                    );
                  }
                  const displayRank = finishedRanks[idx];
                  const lastRank = Math.min(...Object.values(finishedRanks));
                  let badgeClass = "rank-badge";
                  let icon = "";
                  if (displayRank === 1) {
                    badgeClass += " rank-green";
                    icon = "🥇";
                  }
                  if (displayRank === lastRank && displayRank !== 1) {
                    badgeClass += " rank-red";
                    icon = "🏅";
                  }
                  return (
                    <td className="table-list-rank-cell" key={idx}>
                      <span className={badgeClass}>
                        {icon} {displayRank}
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
                    // Disable all fields if game is over
                    const isDisabled =
                      gameOver || totals[playerIdx] >= gameEndsAfterOrGameEnds;
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
