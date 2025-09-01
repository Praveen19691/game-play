import "./tableRankRow.css";

export default function TableRankRow({ ranks, finishedRanks, gameOver }) {
  const lastRank = Math.min(...Object.values(finishedRanks));

  return (
    <tr className="table-list-rank-row">
      <th className="table-list-rank-label">
        <span role="img" aria-label="rank">
          🏆
        </span>{" "}
        Rank
      </th>
      {ranks.map((displayRank, idx) => {
        // Only show rank if player has finished or game is over
        if (finishedRanks[idx] === undefined && !gameOver) {
          return (
            <td className="table-list-rank-cell" key={idx}>
              <span className="rank-badge"></span>
            </td>
          );
        }
        let badgeClass = "rank-badge";
        // Assign color class based on rank (1-based)
        if (displayRank === 1) {
          badgeClass += " rank-green";
        } else if (displayRank === 2) {
          badgeClass += " rank-blue";
        } else if (displayRank === 3) {
          badgeClass += " rank-orange";
        } else if (displayRank === 4) {
          badgeClass += " rank-purple";
        }
        // Last rank (lowest) always red
        if (displayRank === lastRank && displayRank !== 1) {
          badgeClass += " rank-red";
        }
        return (
          <td className="table-list-rank-cell" key={idx}>
            <span className={badgeClass}>{displayRank}</span>
          </td>
        );
      })}
    </tr>
  );
}
