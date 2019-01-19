export default function getPlayablePieces(board) {
  const possible = [
    board.left.length ? board.left[board.left.length - 1].values[1] : board.root.values[0],
    board.right.length ? board.right[board.right.length - 1].values[1] : board.root.values[1],
  ];
  if (possible[0] === possible[1]) {
    return [possible[0]];
  }
  return possible;
}