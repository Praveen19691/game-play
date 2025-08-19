// Calculate total scores for each player
export function calculateTotals(scores, numberOfPlayers) {
  // Reduce scores array to get total for each player
  return scores.reduce(
    // For each round, add each player's score to their total
    (acc, round) => acc.map((sum, idx) => sum + (round[idx] || 0)),
    // Start with an array of zeros for each player
    Array(numberOfPlayers).fill(0)
  );
}

// Determine the round each player finishes
export function calculateFinishRounds(scores, gameEndsAfterOrGameEnds) {
  // Get the number of players from the first round
  const numberOfPlayers = scores[0].length;
  // Initialize finishRounds array with nulls
  const finishRounds = Array(numberOfPlayers).fill(null);
  // Initialize totals array with zeros
  const totals = Array(numberOfPlayers).fill(0);

  // Loop through each round
  for (let roundIdx = 0; roundIdx < scores.length; roundIdx++) {
    // Loop through each player
    for (let playerIdx = 0; playerIdx < numberOfPlayers; playerIdx++) {
      // Add player's score for this round to their total
      totals[playerIdx] += scores[roundIdx][playerIdx] || 0;
      // If player's total reaches or exceeds the threshold and hasn't finished yet
      if (
        totals[playerIdx] >= gameEndsAfterOrGameEnds &&
        finishRounds[playerIdx] === null
      ) {
        // Record the round index when the player finished
        finishRounds[playerIdx] = roundIdx;
      }
    }
  }
  // Return array of finish rounds for each player
  return finishRounds;
}

// Group finished players by the round they finished
function groupByFinishRound(finishRounds) {
  // Create an empty object to hold groups
  const groups = {};
  // Loop through each player's finish round
  finishRounds.forEach((round, idx) => {
    // If player has finished (round is not null)
    if (round !== null) {
      // If this round doesn't exist in groups, create an array for it
      if (!groups[round]) groups[round] = [];
      // Add player index to the group for this round
      groups[round].push(idx);
    }
  });
  // Return object mapping round numbers to arrays of player indices
  return groups;
}

// Assign ranks to finished players using standard competition ranking
function getFinishedRanks(groups, numberOfPlayers, scores) {
  // Get all round numbers and sort them in ascending order
  const sortedRounds = Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b);

  let ranks = {};
  let currentRank = numberOfPlayers;
  // Calculate totals for all players
  const totals = calculateTotals(scores, numberOfPlayers);

  sortedRounds.forEach((round) => {
    const group = groups[round];
    if (group.length === 1) {
      // Only one player finished in this round
      ranks[group[0]] = currentRank;
      currentRank -= 1;
    } else {
      // Multiple players finished in this round, sort by total descending
      const sortedGroup = group
        .map((idx) => ({ idx, total: totals[idx] }))
        .sort((a, b) => b.total - a.total);

      let i = 0;
      while (i < sortedGroup.length) {
        const thisTotal = sortedGroup[i].total;
        // Find all players with the same total
        const sameTotalPlayers = sortedGroup.filter(
          (p) => p.total === thisTotal
        );
        const rankToAssign = currentRank;
        sameTotalPlayers.forEach((p) => {
          ranks[p.idx] = rankToAssign;
        });
        i += sameTotalPlayers.length;
        currentRank -= sameTotalPlayers.length;
      }
    }
  });
  return ranks;
}

// If only one player remains, assign them rank 1
function assignLastRankIfGameOver(ranks, numberOfPlayers) {
  // Count how many players have finished
  const finishedCount = Object.keys(ranks).length;
  // Check if all but one player have finished
  const gameOver = finishedCount === numberOfPlayers - 1;
  if (gameOver) {
    // Find the index of the unfinished player
    const unfinishedIdx = Array.from(
      { length: numberOfPlayers },
      (_, idx) => idx
    ).find((idx) => ranks[idx] === undefined);
    // If there is an unfinished player, assign them rank 1
    if (unfinishedIdx !== undefined) {
      ranks[unfinishedIdx] = 1;
    }
  }
  // Return whether the game is over
  return gameOver;
}

// Assign ranks to unfinished players based on their scores
function getUnfinishedRanks(scores, finishedRanks, numberOfPlayers) {
  // Calculate total scores for each player
  const totals = calculateTotals(scores, numberOfPlayers);
  // Create an array to hold ranks for each player
  const ranks = Array(numberOfPlayers).fill(null);

  // Find unfinished players and their scores
  let unfinished = ranks
    .map((_, idx) => ({ idx, score: totals[idx] }))
    .filter((player) => finishedRanks[player.idx] === undefined);

  // Sort unfinished players by score (ascending)
  unfinished.sort((a, b) => a.score - b.score);

  // Assign ranks, ties get same rank
  let currentRank = 1;
  for (let i = 0; i < unfinished.length; ) {
    // Get the score of the current player
    const score = unfinished[i].score;
    // Find all players with the same score (tie)
    const sameScorePlayers = unfinished.filter((p) => p.score === score);
    // Assign currentRank to all players with the same score
    const rankToAssign = currentRank;
    sameScorePlayers.forEach((p) => {
      ranks[p.idx] = rankToAssign;
    });
    // Move to the next group of players
    i += sameScorePlayers.length;
    // Increment currentRank by the number of tied players
    currentRank += sameScorePlayers.length;
  }
  // Return ranks and totals for unfinished players
  return { ranks, totals };
}

// Main function to calculate all ranks
export function calculateRanks({ scores, finishRounds, numberOfPlayers }) {
  // Group finished players by their finish round
  const groups = groupByFinishRound(finishRounds);
  // Assign ranks to finished players
  const finishedRanks = getFinishedRanks(groups, numberOfPlayers, scores);
  // Assign rank 1 to last unfinished player if game is over
  const gameOver = assignLastRankIfGameOver(finishedRanks, numberOfPlayers);
  // Assign ranks to unfinished players based on scores
  const { ranks, totals } = getUnfinishedRanks(
    scores,
    finishedRanks,
    numberOfPlayers
  );

  // Merge finished and unfinished ranks into one array
  for (let idx = 0; idx < numberOfPlayers; idx++) {
    if (finishedRanks[idx] !== undefined) {
      ranks[idx] = finishedRanks[idx];
    }
  }

  // Return all rank info and totals
  return { ranks, finishedRanks, gameOver, totals };
}
