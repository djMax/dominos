import { Game } from 'boardgame.io/core';

export const Dominos = Game({
  name: 'Dominos',

  setup(ctx) {
    let pieces = [];
    for (let firstHalf = 0; firstHalf <= 6; firstHalf += 1) {
      for (let secondHalf = firstHalf; secondHalf <= 6; secondHalf += 1) {
        pieces.push({
          values: [firstHalf, secondHalf],
          random: ctx.random.Number(),
        });
      }
    }
    pieces = pieces
      .sort((a,b) => (a.random - b.random))
      .map(p => ({ values: p.values }));
    return {
      board: [],
      hands: [
        pieces.slice(0, 7),
        pieces.slice(7, 14),
        pieces.slice(14, 21),
        pieces.slice(21),
      ],
    };
  },

  moves: {
    addDomino(G, ctx, id) {
      if (G.board.length === 0) {
        let board = [id];
        return { ...G, board };
      }
    },
    pass(G, ctx) {

    },
  }
});