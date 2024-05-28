import { expect } from 'chai';

function buildArguments(input) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return input.map((_, index) => alphabet[index]);
}
function judger(problemResult, userResult) {
  try {
    expect(problemResult).deep.eq(userResult);
    return {
      isCorrect: true,
    };
  } catch (e) {
    return {
      isCorrect: false,
      expected: e.expected,
      actual: e.actual,
    };
  }
}
// input data
const inputs = process.env.INPUT.split('\n');
const result = inputs.map((input) => {
  const problemContext = input.split(' ').map((input) => eval(input));
  console.log({ problemContext });

  // Initialize
  const problemArguments = buildArguments(problemContext);
  const problemAlgorithm = new Function(
    ...problemArguments,
    `return (${process.env.PROBLEM_ALGORITHM})(${problemArguments.join(',')})`,
  );
  const userAlgorithm = new Function(
    ...problemArguments,
    `return (${process.env.USER_ALGORITHM})(${problemArguments.join(',')})`,
  );
  return judger(
    problemAlgorithm(...problemContext),
    userAlgorithm(...problemContext),
  );
});

console.log(JSON.stringify({ execution_result: result }));
