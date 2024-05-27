function buildArguments(input) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return input.map((_, index) => alphabet[index]);
}
function getFunctionBody(stringFn) {
  return stringFn.match(/function\s+.+\(.*\)\s*\{(.+)\}/);
}
function judger(problemResult, userResult) {
  const isCorrect = problemResult === userResult;

  return {
    isCorrect,
  };
}
// input data
const inputs = process.env.INPUT.split('\n');
const result = inputs.map((input) => {
  const problemContext = input.split(' ').map((input) => eval(input));
  console.log({ problemContext });

  // Initialize
  const problemAlgorithm = new Function(
    ...buildArguments(problemContext),
    getFunctionBody(process.env.PROBLEM_ALGORITHM)[1],
  );
  const userAlgorithm = new Function(
    ...buildArguments(problemContext),
    getFunctionBody(process.env.EXECUTABLE)[1],
  );
  return judger(
    problemAlgorithm(...problemContext),
    userAlgorithm(...problemContext),
  );
});

console.log(JSON.stringify({ execution_result: result }));
