export default class LogicalBoard {
  constructor({ root = null, left = [], right = [], playCount = 0 }) {
    this.root = root;
    this.left = left;
    this.right = right;
    this.playCount = playCount;
  }

  // The convention is that the second values element is the "outward facing"
  // set of pips, the exception being the root piece where 0 is left and 1 is
  // right, arbitrarily
  get leftOption() {
    const { left, root } = this;
    return left.length ? left[left.length - 1].values[1]: root.values[0];
  }

  get rightOption() {
    const { right, root } = this;
    return right.length ? right[right.length - 1].values[1]: root.values[1];
  }

  place(player, piece, placeLeft = null) {
    const newPiece = {
      values: [...piece.values],
      by: player,
      sequence: this.playCount + 1,
    };
    if (!this.root) {
      this.root = newPiece;
      this.playCount += 1;
      return this;
    }

    let leftExposed = this.leftOption;
    let rightExposed = this.rightOption;
    const { left, right } = this;
    const existing = left.length + right.length;

    if (placeLeft === true || placeLeft !== false) {
      // See if the piece fits on the left
      if (leftExposed === newPiece.values[0]) {
        this.left.push(newPiece);
      } else if (leftExposed === newPiece.values[1]) {
        newPiece.values.reverse();
        this.left.push(newPiece);
      }
    }
    if ((existing === left.length + right.length)
      && (placeLeft !== true || placeLeft === false)) {
      // See if the piece fits on the right
      if (rightExposed === newPiece.values[0]) {
        this.right.push(newPiece);
      } else if (rightExposed === newPiece.values[1]) {
        newPiece.values.reverse();
        this.right.push(newPiece);
      }
    }

    if (existing === left.length + right.length) {
      const error = new Error('Invalid move');
      error.invalidMove = true;
      throw error;
    }
    this.playCount += 1;
    return this;
  }

  get validPieces() {
    const { left, right, root } = this;
    if (!root) { return [0, 1, 2, 3, 4, 5, 6]; }
    const possible = [
      left.length ? left[left.length - 1].values[1] : root.values[0],
      right.length ? right[right.length - 1].values[1] : root.values[1],
    ];
    if (possible[0] === possible[1]) {
      return [possible[0]];
    }
    return possible;
  }

  get playedPieces() {
    const { left, right, root } = this;
    if (!root) {
      return [];
    }
    return [root, ...left, ...right];
  }

  toState() {
    return {
      root: this.root,
      left: this.left,
      right: this.right,
      playCount: this.playCount,
    };
  }

  static getNewBoard(board, player, piece, placeLeft) {
    return new LogicalBoard(board).place(player, piece, placeLeft).toState();
  }
}

LogicalBoard.allDominos = [];
for (let firstHalf = 0; firstHalf <= 6; firstHalf += 1) {
  for (let secondHalf = firstHalf; secondHalf <= 6; secondHalf += 1) {
    LogicalBoard.allDominos.push({
      values: [firstHalf, secondHalf],
    });
  }
}
