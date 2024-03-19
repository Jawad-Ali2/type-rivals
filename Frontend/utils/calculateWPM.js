/* // Todo: To calculate WPM function arguments required are:
 * user Input
 * time that has passed so far
 */

const getValidInput = (input, paragraph) => {
  let counter = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === paragraph[i]) counter++;
    else break;
  }
  return input.slice(0, counter);
};
export function calculateWPM(input, timePassedSoFar, paragraph, raceDuration) {
  const wordsTyped = getValidInput(input, paragraph);
  const correctlyTyped = wordsTyped.length / 5;
  const timeTakenInMinutes = timePassedSoFar / 60;
  const wordsPerMinute = Math.round(correctlyTyped / timeTakenInMinutes);
  return wordsPerMinute;
}
