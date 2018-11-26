export class PlayerHand {
  constructor(id, pieces) {
    this.id = id;
    this.hand = pieces;
    this.pipCount = [];
    pieces.forEach(({ values }) => {
      this.pipCount[values[0]] = (this.pipCount[values[0]] || 0) + 1;
      if (values[0] !== values[1]) {
          this.pipCount[values[1]] = (this.pipCount[values[1]] || 0) + 1;
      }
    });
    // Sort such that pieces with higher frequency are together
    pieces.forEach(({ values }) => {
      if (this.pipCount[values[0]] < this.pipCount[values[1]]) {
        // Flip the piece so we can sort by p[0]
        const pswap = values[1];
        values[1] = values[0];
        values[0] = pswap;
      }
    });
    this.hand.sort(({ values: p1 }, { values: p2 }) => {
      let cmp = (this.pipCount[p2[0]] - this.pipCount[p1[0]]);
      if (cmp === 0) {
        // most common pipCount is same, put the lower piece first
        cmp = p1[0] - p2[0];
      }
      if (cmp === 0) {
        // Same first number
        cmp = p1[1] - p2[1];
      }
      return cmp;
    });
  }

  toString() {
    return `Player ${this.id+1}: ${this.hand.map(p => `${p.values[0]}/${p.values[1]}`).join(' ')}`;
  }
}