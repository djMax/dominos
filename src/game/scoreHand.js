export function scoreHand({ hand }) {
  return hand.reduce((prev, cur) => {
    return prev + Number(cur.values[0]) + Number(cur.values[1]);
  }, 0);
}