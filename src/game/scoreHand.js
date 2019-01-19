export function scoreHand({ hand }) {
  return hand.reduce((prev, cur) => {
    return prev + cur.values[0] + cur.values[1];
  }, 0);
}