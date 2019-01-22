import { AI } from '@djmax/boardgame.io/ai';
import getPlayablePieces from './options';

export function enumerate(G, ctx) {
  const { board, players } = G;
  const player = Object.values(players || {})[0];
  if (!player) {
    return [{ move: 'takeHand' }];
  }
  if (!board.root) {
    return player.hand
      .filter(p => p.values[0] === 6 && p.values[1] === 6)
      .map(p => ({ move: 'playDomino', args: [p] }));
  }
  const possibles = getPlayablePieces(board);
  const pieces = player.hand
    .filter(p => possibles.includes(p.values[0]) || possibles.includes(p.values[1]));
  if (pieces.length > 0) {
    return pieces.map(p => ({ move: 'playDomino', args: [p] }));
  }
  return [{ move: 'pass' }];
}

export default function ai() {
  return AI({ enumerate });
}
