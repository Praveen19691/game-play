/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./SkullkingForm.scss";

// Scoring function
function calculateBaseScore(bid, tricksWon, round) {
  bid = Number(bid);
  tricksWon = Number(tricksWon);
  round = Number(round);

  if (bid === 0) {
    return tricksWon === 0 ? round * 10 : round * -10;
  } else {
    return bid === tricksWon ? bid * 20 : Math.abs(bid - tricksWon) * -10;
  }
}

function GamePage() {
  const location = useLocation();
  const playerCount = location.state?.playerCount || 2;
  const TOTAL_ROUNDS = Math.max(
    2,
    Math.min(10, location.state?.roundCount || 2)
  );

  const [playerNames, setPlayerNames] = useState(Array(playerCount).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [currentRound, setCurrentRound] = useState(1);

  const [bids, setBids] = useState(
    Array(playerCount)
      .fill()
      .map(() => Array(TOTAL_ROUNDS).fill("0"))
  );
  const [tricksWon, setTricksWon] = useState(
    Array(playerCount)
      .fill()
      .map(() => Array(TOTAL_ROUNDS).fill("0"))
  );
  const [scores, setScores] = useState(
    Array(playerCount)
      .fill()
      .map(() => Array(TOTAL_ROUNDS).fill(0))
  );
  const [biddingDone, setBiddingDone] = useState(false);
  const [scoreDone, setScoreDone] = useState(false);
  const [tricksError, setTricksError] = useState("");

  const [gameFinished, setGameFinished] = useState(false);
  const [invalidNames, setInvalidNames] = useState(
    Array(playerCount).fill(false)
  );
  const [bidInputErrors, setBidInputErrors] = useState(
    Array(playerCount).fill(false)
  );
  const [tricksInputErrors, setTricksInputErrors] = useState(
    Array(playerCount).fill(false)
  );

  const handleNameChange = (index, value) => {
    const updatedNames = [...playerNames];
    updatedNames[index] = value;
    setPlayerNames(updatedNames);

    const updatedInvalids = [...invalidNames];
    updatedInvalids[index] = value.trim().length < 3;
    setInvalidNames(updatedInvalids);

    setError("");
  };

  const handleSubmitNames = (e) => {
    e.preventDefault();
    const trimmedNames = playerNames.map((n) => n.trim());
    const nameSet = new Set(trimmedNames);
    if (nameSet.size !== trimmedNames.length) {
      setError("Player names must be unique.");
      return;
    }
    if (trimmedNames.some((n) => n.length < 3)) {
      setError("Each player name must be at least 3 characters.");
      return;
    }
    setSubmitted(true);
  };

  const handleBidChange = (playerIdx, value) => {
    let val = value;
    let error = false;
    if (val === "") {
      error = false;
    } else if (!/^\d+$/.test(val)) {
      error = true;
    } else {
      val = Math.max(0, Math.min(currentRound, Number(val)));
      error = false;
    }
    const updatedBids = bids.map((arr, idx) =>
      idx === playerIdx
        ? arr.map((v, rIdx) => (rIdx === currentRound - 1 ? val : v))
        : arr
    );
    setBids(updatedBids);

    const updatedErrors = [...bidInputErrors];
    updatedErrors[playerIdx] = error;
    setBidInputErrors(updatedErrors);
  };

  const handleBiddingSubmit = (e) => {
    e.preventDefault();
    if (bidInputErrors.some(Boolean)) return;
    setBiddingDone(true);
  };

  const handleTricksWonChange = (playerIdx, value) => {
    let val = value;
    let error = false;
    if (val === "") {
      error = false;
    } else if (!/^\d+$/.test(val)) {
      error = true;
    } else {
      val = Math.max(0, Math.min(currentRound, Number(val)));
      error = false;
    }
    const updatedTricks = tricksWon.map((arr, idx) =>
      idx === playerIdx
        ? arr.map((v, rIdx) => (rIdx === currentRound - 1 ? val : v))
        : arr
    );
    setTricksWon(updatedTricks);

    const updatedErrors = [...tricksInputErrors];
    updatedErrors[playerIdx] = error;
    setTricksInputErrors(updatedErrors);
  };

  const handleScoreSubmit = (e) => {
    e.preventDefault();
    if (tricksInputErrors.some(Boolean)) return;
    const totalTricks = tricksWon.reduce(
      (sum, arr) => sum + Number(arr[currentRound - 1]),
      0
    );
    if (totalTricks !== currentRound) {
      setTricksError(
        `Total tricks won must be exactly ${currentRound} in round ${currentRound}.`
      );
      return;
    }
    setTricksError("");
    const updatedScores = scores.map((arr, idx) =>
      arr.map((v, rIdx) =>
        rIdx === currentRound - 1
          ? calculateBaseScore(
              bids[idx][currentRound - 1],
              tricksWon[idx][currentRound - 1],
              currentRound
            )
          : v
      )
    );
    setScores(updatedScores);
    setScoreDone(true);
  };

  const handleNextRound = () => {
    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(currentRound + 1);
      setBiddingDone(false);
      setScoreDone(false);
      setTricksError("");
    } else {
      setGameFinished(true);
    }
  };

  const totalScores = scores.map((arr) =>
    arr.reduce((sum, v) => sum + Number(v), 0)
  );

  const maxScore = Math.max(...totalScores);
  const winners = playerNames.filter((_, idx) => totalScores[idx] === maxScore);

  // DENSE RANKING LOGIC
  const getDenseRanks = (scoresArr) => {
    let sorted = scoresArr
      .map((score, idx) => ({ idx, score }))
      .sort((a, b) => b.score - a.score);
    let ranks = Array(scoresArr.length);
    let rank = 1;
    sorted.forEach((player, i) => {
      if (i > 0 && player.score === sorted[i - 1].score) {
        ranks[player.idx] = ranks[sorted[i - 1].idx];
      } else {
        ranks[player.idx] = rank;
      }
      rank++;
    });
    return ranks;
  };
  const denseRanks = getDenseRanks(totalScores);

  return (
    <div className="GamePage">
      <div className="header-title">Skull King Scoreboard</div>
      {submitted && !gameFinished && (
        <div className="round-indicator">
          Round {currentRound} of {TOTAL_ROUNDS}
        </div>
      )}
      {!submitted ? (
        <div className="card">
          <h2>Enter Player Names</h2>
          <form onSubmit={handleSubmitNames}>
            {playerNames.map((name, idx) => (
              <div key={idx} style={{ marginBottom: "1rem" }}>
                <label>
                  Player {idx + 1} Name:
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    required
                    style={{
                      marginLeft: "1rem",
                      border: invalidNames[idx]
                        ? "2px solid #e74c3c"
                        : undefined,
                      background: invalidNames[idx] ? "#ffeaea" : undefined,
                    }}
                  />
                </label>
                {invalidNames[idx] && (
                  <span style={{ color: "#e74c3c", fontSize: "0.95rem" }}>
                    Name must be at least 3 characters
                  </span>
                )}
              </div>
            ))}
            {error && (
              <div
                style={{
                  color: "#e74c3c",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                {error}
              </div>
            )}
            <button type="submit">Start Game</button>
          </form>
        </div>
      ) : gameFinished ? (
        <div className="card">
          <h3>Rankings</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>Medal</th>
                </tr>
              </thead>
              <tbody>
                {playerNames
                  .map((name, idx) => ({
                    name,
                    score: totalScores[idx],
                    rank: denseRanks[idx],
                  }))
                  .sort((a, b) => b.score - a.score)
                  .map((player) => {
                    let medal = "";
                    if (player.rank === 1) medal = "🥇 GOLD";
                    else if (player.rank === 2) medal = "🥈 SILVER";
                    else if (player.rank === 3) medal = "🥉 BRONZE";
                    return (
                      <tr key={player.name}>
                        <td>{player.rank}</td>
                        <td>{player.name}</td>
                        <td>{player.score}</td>
                        <td>
                          {player.rank === 1 && (
                            <span
                              style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                background:
                                  "linear-gradient(90deg, #FFD700 0%, #fdec4eff 100%)",
                                color: "#B8860B",
                                borderRadius: "1.5rem",
                                padding: "0.3rem 1.2rem",
                                boxShadow: "0 2px 8px #FFD70088",
                                display: "inline-block",
                              }}
                            >
                              🥇
                            </span>
                          )}
                          {player.rank === 2 && (
                            <span
                              style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                background:
                                  "linear-gradient(90deg, #b8b8b8ff 0%, #F5F5F5 100%)",
                                color: "#6e6e6e",
                                borderRadius: "1.5rem",
                                padding: "0.3rem 1.2rem",
                                boxShadow: "0 2px 8px #C0C0C088",
                                display: "inline-block",
                              }}
                            >
                              🥈
                            </span>
                          )}
                          {player.rank === 3 && (
                            <span
                              style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                background:
                                  "linear-gradient(90deg, #634221ff 0%, #b1611cff 100%)",
                                color: "#97480fff",
                                borderRadius: "1.5rem",
                                padding: "0.3rem 1.2rem",
                                boxShadow: "0 2px 8px #CD7F3288",
                                display: "inline-block",
                              }}
                            >
                              🥉
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div
            className="winner-highlight"
            style={{
              background:
                "linear-gradient(90deg, #22f10fff 0%, #c2ff5fff 100%)",
              color: "#232526",
              fontSize: "2rem",
              fontWeight: "bold",
              borderRadius: "2rem",
              padding: "2rem 3rem",
              marginTop: "2rem",
              boxShadow: "0 8px 32px 0 rgba(241,196,15,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
            }}
          >
            <span role="img" aria-label="trophy" style={{ fontSize: "2.5rem" }}>
              🏆
            </span>
            <span>
              Winner{winners.length > 1 ? "s" : ""}:{" "}
              <span
                style={{
                  color: "#232526",
                  fontWeight: "900",
                  borderRadius: "0.5rem",
                  padding: "0.2rem 0.7rem",
                }}
              >
                {winners.join(", ")}
              </span>
            </span>
          </div>
        </div>
      ) : (
        <>
          {!biddingDone ? (
            <div className="card">
              <h3>Round {currentRound} Bidding</h3>
              <div className="table-wrapper">
                <form onSubmit={handleBiddingSubmit}>
                  <table>
                    <thead>
                      <tr>
                        {playerNames.map((name, idx) => (
                          <th key={idx}>{name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {playerNames.map((_, idx) => (
                          <td key={idx}>
                            <input
                              type="text"
                              min={0}
                              max={currentRound}
                              value={bids[idx][currentRound - 1]}
                              onChange={(e) =>
                                handleBidChange(idx, e.target.value)
                              }
                              required
                              className={bidInputErrors[idx] ? "error" : ""}
                              style={{
                                width: "60px",
                                padding: "0.3rem",
                                borderRadius: "0.5rem",
                                border: bidInputErrors[idx]
                                  ? "2px solid #e74c3c"
                                  : "1px solid #f1c40f",
                                textAlign: "center",
                                background: bidInputErrors[idx]
                                  ? "#ffeaea"
                                  : undefined,
                                color: bidInputErrors[idx]
                                  ? "#e74c3c"
                                  : undefined,
                              }}
                            />
                            {bidInputErrors[idx] && (
                              <div
                                style={{
                                  color: "#e74c3c",
                                  fontSize: "0.9rem",
                                  marginTop: "0.3rem",
                                }}
                              >
                                Enter a valid number
                              </div>
                            )}
                            <div
                              style={{
                                fontSize: "0.9rem",
                                color: "#f1c40f",
                                marginTop: "0.3rem",
                              }}
                            >
                              Bidding (max {currentRound})
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                  <button type="submit" style={{ marginTop: "1rem" }}>
                    Submit Bids
                  </button>
                </form>
              </div>
            </div>
          ) : !scoreDone ? (
            <div className="card">
              <h3>Round {currentRound} - Tricks Won</h3>
              <div className="table-wrapper">
                <form onSubmit={handleScoreSubmit}>
                  <table>
                    <thead>
                      <tr>
                        {playerNames.map((name, idx) => (
                          <th key={idx}>{name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {playerNames.map((_, idx) => (
                          <td key={idx}>
                            <input
                              type="text"
                              min={0}
                              max={currentRound}
                              value={tricksWon[idx][currentRound - 1]}
                              onChange={(e) =>
                                handleTricksWonChange(idx, e.target.value)
                              }
                              required
                              className={tricksInputErrors[idx] ? "error" : ""}
                              style={{
                                width: "60px",
                                padding: "0.3rem",
                                borderRadius: "0.5rem",
                                border: tricksInputErrors[idx]
                                  ? "2px solid #e74c3c"
                                  : "1px solid #f1c40f",
                                textAlign: "center",
                                background: tricksInputErrors[idx]
                                  ? "#ffeaea"
                                  : undefined,
                                color: tricksInputErrors[idx]
                                  ? "#e74c3c"
                                  : undefined,
                              }}
                            />
                            {tricksInputErrors[idx] && (
                              <div
                                style={{
                                  color: "#e74c3c",
                                  fontSize: "0.9rem",
                                  marginTop: "0.3rem",
                                }}
                              >
                                Enter a valid number
                              </div>
                            )}
                            <div
                              style={{
                                fontSize: "0.9rem",
                                color: "#f1c40f",
                                marginTop: "0.3rem",
                              }}
                            >
                              Tricks Won
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                  {tricksError && (
                    <div className="error-message">{tricksError}</div>
                  )}
                  <button type="submit" style={{ marginTop: "1rem" }}>
                    Calculate Scores
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="card">
              <h3>Round {currentRound} - Scores</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      {playerNames.map((name, idx) => (
                        <th key={idx}>{name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {playerNames.map((_, idx) => (
                        <td key={idx}>{scores[idx][currentRound - 1]}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                style={{ marginTop: "1rem" }}
                onClick={handleNextRound}
              >
                {currentRound < TOTAL_ROUNDS ? "Next Round" : "Show Winner"}
              </button>
            </div>
          )}
          <div className="card">
            <h3 style={{ marginTop: "2rem" }}>Point Table</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Round</th>
                    {playerNames.map((name, idx) => (
                      <th key={idx}>{name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: currentRound }).map((_, roundIdx) => (
                    <tr key={roundIdx}>
                      <td>{roundIdx + 1}</td>
                      {playerNames.map((_, playerIdx) => (
                        <td key={playerIdx}>{scores[playerIdx][roundIdx]}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <strong>Total</strong>
                    </td>
                    {totalScores.map((score, idx) => (
                      <td key={idx}>
                        <strong>{score}</strong>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default GamePage;
