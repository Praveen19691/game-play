import "./tableHeader.css";

export default function TableHeader({ playerHeaders }) {
  return (
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
  );
}
