import getPlayablePieces from "./options";

export default function isGameDone(G) {
  const { board, players } = G;
  if (!board.root) {
    return false;
  }
  const possibles = getPlayablePieces(board);
  if (Object.values(players).find(p => p.hand.length === 0)) {
    console.log('SOMEBODY WON');
    return true;
  }
  for (const player of Object.values(players)) {
    if (player.hand.find(p => possibles.includes(p.values[0]) || possibles.includes(p.values[1]))) {
      return false;
    }
  }
  console.log('GAME IS CLOSED');
  return true;
}