import openSocket from 'socket.io-client';
import { AI } from '@djmax/boardgame.io/ai';
import LogicalBoard from '../model/LogicalBoard';

export function enumerate(G, ctx) {
  const { board, players } = G;
  const player = Object.values(players || {})[0];
  if (!board.root) {
    return player.hand
      .filter(p => p.values[0] === 6 && p.values[1] === 6)
      .map(p => ({ move: 'playDomino', args: [p] }));
  }
  const possibles = new LogicalBoard(board).validPieces;
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

function chooseRandom(pieces) {
  const ix = parseInt(Math.random() * pieces.length);
  return pieces[ix];
}

function chooseHighest(pieces) {
  let maxPiece;
  let maxPips = -1;
  pieces.forEach((p) => {
    const pv = p[0] + p[1];
    if (pv === maxPips) {
      if (Math.max(maxPiece[0], maxPiece[1]) < Math.max(p[0], p[1])) {
        maxPiece = p;
      }
    } else if (pv > maxPips) {
      maxPiece = p;
      maxPips = pv;
    }
  });
  return maxPiece;
}

export function sendMove({ action, players, credentials, hand, gameID }) {
  const { currentPlayer, phase } = action.state.ctx;
  const { board } = action.state.G;

  const message = {
    type: 'MAKE_MOVE',
    payload: {
      type: 'playDomino',
      args: [],
      playerID: currentPlayer,
      credentials,
    }
  };

  if (phase === 'score') {
    message.payload = 'continue';
  } else {
    const possibles = new LogicalBoard(board).validPieces;
    const pieces = hand.filter(p => possibles.includes(p[0]) || possibles.includes(p[1]));
    if (pieces.length > 0) {
      let piece;
      if (players[currentPlayer] === 'random') {
        piece = chooseRandom(pieces);
      } else if (players[currentPlayer] === 'highest') {
        piece = chooseHighest(pieces);
      } else {
        piece = pieces[0];
      }
      message.payload.args.push({ values: piece });
      console.log(currentPlayer, 'will play', message.payload.args[0]);
    } else {
      message.payload.type = 'pass';
      console.log(currentPlayer, 'will pass');
    }
  }
  const socket = openSocket('/Dominos');
  socket.once('connect', () => {
    setTimeout(() => {
      socket.emit('update', message, action.state._stateID || 0, `Dominos:${gameID}`, currentPlayer);
      socket.disconnect();
    }, 500);
  });
}
