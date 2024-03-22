/* // Todo: To calculate WPM function arguments required are:
 * user Input
 * time that has passed so far
 */

const calculateParagraphCompletion = (input, paragraph) => {
  const inputLength = input.length;
  const paragraphLength = paragraph.length;

  const percentage = Math.ceil((inputLength / paragraphLength) * 100);
  return Math.min(100, percentage);
};

const getValidInput = (input, paragraph) => {
  let counter = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === paragraph[i]) counter++;
    else break;
  }

  const completePercentage = calculateParagraphCompletion(input, paragraph);
  const wordsTyped = input.slice(0, counter);
  return [wordsTyped, completePercentage];
};
export function calculateWPM(input, timePassedSoFar, paragraph) {
  const [wordsTyped, completePercentage] = getValidInput(input, paragraph);
  const correctlyTyped = wordsTyped.length / 5;
  const timeTakenInMinutes = timePassedSoFar / 60;
  const wordsPerMinute = Math.round(correctlyTyped / timeTakenInMinutes);
  return [wordsPerMinute, completePercentage];
}
