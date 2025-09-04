import React from "react";
import TableHeader from "../tableHeader/TableHeader";
import TableRankRow from "../tableRankRow/TableRankRow";
import TableTotalRow from "../tableTotalRow/TableTotalRow";
import "../tableRoundRows/tableRoundRows.scss";
import "./tableContainer.scss";
import { calculateFinishRounds, calculateRanks } from "../gameLogic";

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
  const [pendingScores, setPendingScores] = React.useState(
    Array(numberOfPlayers).fill(0)
  );
  const [currentRoundIdx, setCurrentRoundIdx] = React.useState(0);

  // Add a new round when ENTER is clicked
  const handleEnter = () => {
    const newScores = scores.map((arr) => [...arr]);
    newScores[currentRoundIdx] = [...pendingScores];
    setScores(newScores);
    setPendingScores(Array(numberOfPlayers).fill(0));
    setScores((prevScores) => [...newScores, Array(numberOfPlayers).fill(0)]);
    setCurrentRoundIdx(currentRoundIdx + 1);
  };

  // Update pending score for a specific player in the current round
  const handleScoreChange = (roundIdx, playerIdx, value) => {
    if (roundIdx !== currentRoundIdx) return;
    const newPendingScores = [...pendingScores];
    newPendingScores[playerIdx] = Number(value);
    setPendingScores(newPendingScores);
  };

  // Calculate finish rounds and ranks using utility
  const finishRounds = calculateFinishRounds(scores, gameEndsAfterOrGameEnds);
  const { ranks, finishedRanks, gameOver, totals } = calculateRanks({
    scores,
    finishRounds,
    numberOfPlayers,
    gameEndsAfterOrGameEnds,
  });

  return (
    <div className="table-list-container">
      <button className="table-list-btn" onClick={handleEnter}>
        ENTER
      </button>
      <div className="table-list-wrapper">
        <div className="table-list-scroller">
          <table className="table-list">
            <TableHeader playerHeaders={playerHeaders} />
            <tbody>
              <TableRankRow
                ranks={ranks}
                finishedRanks={finishedRanks}
                gameOver={gameOver}
              />
              <TableTotalRow totals={totals} />
              {scores.map((round, roundIdx) => (
                <tr
                  className={
                    "table-list-round-row" +
                    (roundIdx === currentRoundIdx ? " active-round" : "")
                  }
                  key={roundIdx}
                >
                  <th className="table-list-round-cell">{`Round ${
                    roundIdx + 1
                  }`}</th>
                  {playerHeaders.map((_, playerIdx) => {
                    const isDisabled =
                      gameOver ||
                      totals[playerIdx] >= gameEndsAfterOrGameEnds ||
                      roundIdx !== currentRoundIdx;
                    return (
                      <td className="table-list-round-cell" key={playerIdx}>
                        <input
                          type="number"
                          value={
                            roundIdx === currentRoundIdx
                              ? pendingScores[playerIdx]
                              : scores[roundIdx][playerIdx]
                          }
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
