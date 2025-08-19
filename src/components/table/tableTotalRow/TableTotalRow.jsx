import "./tableTotalRow.css"; 

export default function TableTotalRow({ totals }) {
  return (
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
  );
}
