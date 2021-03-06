import { Game, INVALID_MOVE } from '@djmax/boardgame.io/core';
import isGameDone from './done';
import { scoreHand } from './scoreHand';
import LogicalBoard from '../model/LogicalBoard';
import { TurnOrder } from '@djmax/boardgame.io/dist/core';

function isSamePiece(p1, p2) {
  if (p1.values[0] === p2.values[0] && p1.values[1] === p2.values[1]) {
    return true;
  }
  if (p1.values[1] === p2.values[0] && p1.values[0] === p2.values[1]) {
    return true;
  }
  return false;
}

export const Dominos = Game({
  name: 'Dominos',
  playerView(G, ctx, playerID) {
    let r = { ...G };

    if (r.secret !== undefined) {
      delete r.secret;
    }

    if (r.players && ctx.phase !== 'score') {
      r.players = {
        [playerID]: r.players[playerID],
      };
    }

    return r;
  },

  setup(ctx, { players } = {}) {
    return {
      secret: {
      },
      scores: {
        ns: 0,
        ew: 0,
      },
      playerTypes: players || ['human', 'ai', 'ai', 'ai'],
      players: {},
      pieces: [0, 0, 0, 0],
    };
  },

  flow: {
    startingPhase: 'play',
    movesPerTurn: 1,

    phases: {
      play: {
        allowedMoves: ['playDomino', 'pass'],
        turnOrder: {
          first(G, ctx) {
            if (ctx.phase === 'score') {
              return 0;
            }

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
            return 0;
          },
          next(G, ctx) {
            console.log('Next player', (ctx.playOrderPos + 1) % ctx.playOrder.length);
            return (ctx.playOrderPos + 1) % ctx.playOrder.length;
          },
        },
        onPhaseBegin(G, ctx) {
          console.log('Allocating dominos');
          const pieces = ctx.random.Shuffle(LogicalBoard.allDominos.slice(0));
          G.players = {
            0: { hand: pieces.slice(0, 7) },
            1: { hand: pieces.slice(7, 14) },
            2: { hand: pieces.slice(14, 21) },
            3: { hand: pieces.slice(21) },
          };
          G.pieces = [7, 7, 7, 7];
          G.board = { root: null, left: [], right: [], playCount: 0 };
        },
        endPhaseIf: isGameDone,
        next: 'score',
      },

      score: {
        allowedMoves: ['continue'],
        next: 'play',
        turnOrder: TurnOrder.ANY_ONCE,
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
          } else {
            winner = winner[0];
          }
          if (["0","2"].includes(String(winner))) {
            G.completed = {
              winner,
              points: pointTotals[1] + pointTotals[3],
              hands: [...players[1].hand, ...players[3].hand],
            };
            G.scores.ns += G.completed.points;
          } else {
            G.completed = {
              winner,
              points: pointTotals[0] + pointTotals[2],
              hands: [...players[0].hand, ...players[2].hand],
            };
            G.scores.ew += G.completed.points;
          }
        },
        endPhaseIf(G) {
          console.log('Check for score phase end');
          return G.board.ack === G.playerTypes.filter(p => p.startsWith('human')).length;
        },
      },
    },
  },

  moves: {
    playDomino(G, ctx, piece, placeLeft) {
      const { scores, board } = G;
      if (scores.ns === 0 && scores.ew === 0 && !board.root
        && (piece.values[0] !== 6 || piece.values[1] !== 6)) {
        return INVALID_MOVE;
      }
      const player = Number(ctx.currentPlayer);
      console.log(`Player ${player + 1} is playing ${piece.values}`);
      try {
        G.board = LogicalBoard.getNewBoard(G.board, player, piece, placeLeft);
      } catch (error) {
        if (error.invalidMove) {
          return INVALID_MOVE;
        }
        throw error;
      }
      G.pieces[player] = G.pieces[player] - 1;
      G.players[player].hand = G.players[player].hand.filter(p => !isSamePiece(p, piece));
    },

    pass(G, ctx) {
      // TODO make sure they really pass
    },

    deferStart(G, ctx) {

    },

    continue(G, ctx) {
      console.log('Continue called');
      G.board.ack = (G.board.ack || 0) + 1;
    }
  },
});