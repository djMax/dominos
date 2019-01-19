import { Game, PlayerView, INVALID_MOVE } from 'boardgame.io/core';
import isGameDone from './done';
import { scoreHand } from './scoreHand';

function isSamePiece(p1, p2) {
  if (p1.values[0] === p2.values[0] && p1.values[1] === p2.values[1]) {
    return true;
  }
  if (p1.values[1] === p2.values[0] && p1.values[0] === p2.values[1]) {
    return true;
  }
  return false;
}

function placePiece(board, piece, placeLeft) {
  if (!board.root) {
    return {
      ...board,
      root: piece,
    };
  }
  let leftPiece = board.left.length ? board.left[board.left.length - 1] : board.root;
  let rightPiece = board.right.length ? board.right[board.right.length - 1] : board.root;

  if (placeLeft === true) {
    rightPiece = null;
  } else if (placeLeft === false) {
    leftPiece = null;
  }

  if (leftPiece && piece.values[0] === leftPiece.values[1]) {
    return {
      ...board,
      left: [...board.left, { values: [piece.values[0], piece.values[1]] }],
    }
  } else if (leftPiece && piece.values[1] === leftPiece.values[1]) {
    return {
      ...board,
      left: [...board.left, { values: [piece.values[1], piece.values[0]] }],
    };
  } else if (rightPiece && piece.values[0] === rightPiece.values[1]) {
    return {
      ...board,
      right: [...board.right, { values: [piece.values[0], piece.values[1]] }],
    };
  } else if (rightPiece && piece.values[1] === rightPiece.values[1]) {
    return {
      ...board,
      right: [...board.right, { values: [piece.values[1], piece.values[0]] }],
    };
  }
}

const allDominos = [];
for (let firstHalf = 0; firstHalf <= 6; firstHalf += 1) {
  for (let secondHalf = firstHalf; secondHalf <= 6; secondHalf += 1) {
    allDominos.push({
      values: [firstHalf, secondHalf],
    });
  }
}

export const Dominos = Game({
  name: 'Dominos',
  playerView: PlayerView.STRIP_SECRETS,

  setup(ctx) {
    return {
      secret: {
        pieces: ctx.random.Shuffle(allDominos.slice(0)),
      },
      board: {
        root: null,
        left: [],
        right: [],
      },
      scores: {
        '0and2': 0,
        '1and3': 0,
      },
      playerTypes: ['human', 'ai', 'ai', 'ai'],
      players: {},
      pieces: [0, 0, 0, 0],
    };
  },

  flow: {
    startingPhase: 'draw',
    movesPerTurn: 1,

    optimisticUpdate(G, ctx, move) {
      return ctx.phase !== 'draw';
    },

    turnOrder: {
      first(G) {
        console.log('First player?');
        return 0;
      },
      next(G, ctx) {
        if (ctx.phase === 'play' && !G.pieces.find(ct => ct !== 7)) {
          // TODO if some team won, let them start
          // Find the double six...
          const owner = Object.entries(G.players)
            .find(([playerId, pieces]) => {
              return pieces.hand.find(p => p.values[0] === 6 && p.values[1] === 6);
            });
          if (owner) {
            console.log('Double six starts, which is player', Number(owner[0]) + 1);
            return Number(owner[0]);
          }
        }
        console.log('Next player', (ctx.playOrderPos + 1) % ctx.playOrder.length);
        return (ctx.playOrderPos + 1) % ctx.playOrder.length;
      },
    },

    phases: {
      draw: {
        allowedMoves: ['takeHand'],
        endPhaseIf(G) {
          return G.secret && G.secret.pieces.length === 0;
        },
        next: 'play',
      },

      play: {
        allowedMoves: ['playDomino', 'pass'],
        endPhaseIf: isGameDone,
        next: 'score',
      },

      score: {
        allowedMoves: ['continue'],
        next: 'draw',
        onPhaseBegin(G, ctx) {
          const { players } = G;
          const pointTotals = [
            scoreHand(players[0]),
            scoreHand(players[1]),
            scoreHand(players[2]),
            scoreHand(players[3]),
          ];
          let winner = Object.entries(players).find(([pid, { hand }]) => hand.length === 0);
          if (!winner) {
            let minScore = Number.MAX_SAFE_INTEGER;
            for (let i = 0; i < 4; i += 1) {
              const thisPlayer = (Number(ctx.currentPlayer) + i) % ctx.playOrder.length;
              if (pointTotals[thisPlayer] < minScore) {
                winner = thisPlayer;
              }
            }
            debugger;
          }
          if (["0","2"].includes(String(winner))) {
            G.completed = {
              winner,
              points: pointTotals[1] + pointTotals[3],
              hands: [...players[1].hand, ...players[3].hand],
            };
          } else {
            G.completed = {
              winner,
              points: pointTotals[0] + pointTotals[2],
              hands: [...players[0].hand, ...players[2].hand],
            };
          }
        }
      },
    },
  },

  moves: {
    takeHand(G, ctx) {
      if (G.secret) {
        console.log('Allocating dominos');
        const { pieces } = G.secret;
        G.players = {
          0: { hand: pieces.slice(0, 7) },
          1: { hand: pieces.slice(7, 14) },
          2: { hand: pieces.slice(14, 21) },
          3: { hand: pieces.slice(21) },
        };
        G.pieces = [7, 7, 7, 7];
        G.secret.pieces = [];
      }
    },

    playDomino(G, ctx, piece) {
      const player = ctx.currentPlayer;
      console.log(`Player ${player} is playing ${piece.values}`);
      const board = placePiece(G.board, piece);
      if (!board) {
        return INVALID_MOVE;
      }
      G.board = board;
      G.pieces[player] = G.pieces[player] - 1;
      G.players[player].hand = G.players[player].hand.filter(p => !isSamePiece(p, piece));
    },

    pass(G, ctx) {
      // TODO make sure they really pass
    },

    deferStart(G, ctx) {

    }
  },
});