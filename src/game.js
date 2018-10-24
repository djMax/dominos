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
  } else if (leftPiece && piece.values[1] === leftPiece.values[0]) {
    return {
      ...board,
      left: [...board.left, { values: [piece.values[1], piece.values[0]] }],
    }
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
    const pieces = ctx.random.Shuffle(allDominos);
    return {
      board: {
        root: null,
        left: [],
        right: [],
      },
      startingPlayer: parseInt(pieces.findIndex(p => (p.values[0] === 6 && p.values[1] === 6)) / 7),
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

  flow: {
    turnOrder: {
      first: (G) => G.startingPlayer,
      next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
    }
  },

  moves: {
    addDomino(G, ctx, piece) {
      const player = ctx.currentPlayer;
      const board = placePiece(G.board, piece);
      if (!board) {
        return;
      }
      const newState = {
        ...G,
        board,
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