import TableList from "../../table/tableList/TableList.jsx";

export default function GameTable({ submittedForm, playerNames }) {
  return (
    <TableList
      numberOfPlayers={submittedForm.numberOfPlayers}
      gameEndsAfterOrGameEnds={submittedForm.gameEndsAfterOrGameEnds}
      maxPointCanEnter={submittedForm.maxPointCanEnter}
      playerNames={playerNames}
    />
  );
}
