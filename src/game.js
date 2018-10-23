import { Game, PlayerView } from 'boardgame.io/core';

function isSamePiece(p1, p2) {
  if (p1.values[0] === p2.values[0] && p1.values[1] === p2.values[1]) {
    return true;
  }
  if (p1.values[1] === p2.values[0] && p1.values[0] === p2.values[1]) {
    return true;
  }
  return false;
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
    const pieces = ctx.random.Shuffle(allDominos);
    return {
      board: [],
      pieces: {
        0: 7,
        1: 7,
        2: 7,
        3: 7,
      },
      players: {
        0: { hand: pieces.slice(0, 7) },
        1: { hand: pieces.slice(7, 14) },
        2: { hand: pieces.slice(14, 21) },
        3: { hand: pieces.slice(21) },
      },
    };
  },

  moves: {
    addDomino(G, ctx, piece) {
      const player = ctx.currentPlayer;
      const newState = {
        ...G,
        board: [piece],
        pieces: {
          ...G.pieces,
          [player]: G.pieces[player] - 1,
        },
        players: {
          ...G.players,
        },
      };
      if (newState.players[player]) {
        newState.players[player] = {
          ...newState.players[player],
          hand: newState.players[player].hand
            .filter(p => !isSamePiece(p, piece)),
        };
      }
      return newState;
    },
    pass(G, ctx) {

    },
  }
});