import getPlayablePieces from "./options";

function printPlayer([playerId, { hand }]) {
  return `Player ${playerId + 1}: ${hand.map(p => `${p.values[0]},${p.values[1]}`).join(' ')}`
}

export default function isGameDone(G) {
  const { board, players } = G;
  if (!board.root) {
    return false;
  }
  const possibles = getPlayablePieces(board);
  if (Object.values(players).find(p => p.hand.length === 0)) {
    return true;
  }
  for (const player of Object.values(players)) {
    if (player.hand.find(p => possibles.includes(p.values[0]) || possibles.includes(p.values[1]))) {
      return false;
    }
  }
  console.log(`The game is closed. Remaining:
  ${Object.entries(players).map(printPlayer).join('\n  ')}
  Board ends: ${possibles.join(' ')}`);
  return true;
}