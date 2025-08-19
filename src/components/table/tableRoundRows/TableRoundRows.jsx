import "./tableRoundRows.css";

export default function TableRoundRows({
  scores,
  playerHeaders,
  totals,
  gameEndsAfterOrGameEnds,
  maxPointCanEnter,
  gameOver,
  handleScoreChange,
}) {
  return (
    <>
      {scores.map((round, roundIdx) => (
        <tr className="table-list-round-row" key={roundIdx}>
          <th className="table-list-round-cell">{`Round ${roundIdx + 1}`}</th>
          {playerHeaders.map((_, playerIdx) => {
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
    </>
  );
}
