export function rollDice() {
  return Math.floor(Math.random() * 6 + 1);
}

export function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}