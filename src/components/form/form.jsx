import React, { useState } from "react";
import "./form.css";
import TableList from "../table/tableList";

function FormData() {
  const [form, setForm] = useState({
    numberOfPlayers: 3,
    gameEndsAfterOrGameEnds: 200,
    maxPointCanEnter: 25,
  });
  const [submittedForm, setSubmittedForm] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: Number(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedForm(form);
  };

  return (
    <>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label className="label">
            Number of players:
            <input
              type="number"
              className="number"
              name="numberOfPlayers"
              value={form.numberOfPlayers}
              onChange={handleChange}
            />
          </label>
          <label className="label">
            Game ends after:
            <input
              type="number"
              className="number"
              name="gameEndsAfterOrGameEnds"
              value={form.gameEndsAfterOrGameEnds}
              onChange={handleChange}
            />
          </label>
          <label className="label">
            Maximum points in a round:
            <input
              type="number"
              className="number"
              name="maxPointCanEnter"
              value={form.maxPointCanEnter}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
      <div>
        {submittedForm && submittedForm.numberOfPlayers > 2 ? (
          <TableList
            numberOfPlayers={submittedForm.numberOfPlayers}
            gameEndsAfterOrGameEnds={submittedForm.gameEndsAfterOrGameEnds}
            maxPointCanEnter={submittedForm.maxPointCanEnter}
          />
        ) : null}
      </div>
    </>
  );
}

export default FormData;
