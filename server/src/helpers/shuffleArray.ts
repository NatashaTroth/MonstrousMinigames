//modified from https://stackoverflow.com/a/12646864
export function shuffleArray(inputArray: Array<any>) {
  const array = [...inputArray];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
