export function calculateContributions(peerEvaluations) {
  let contributions = {};

  // Collect scores for each student
  peerEvaluations.forEach(evaluation => {
      let evaluator = Object.keys(evaluation)[0];
      let scores = evaluation[evaluator];

      Object.entries(scores).forEach(([student, score]) => {
          if (!contributions[student]) {
              contributions[student] = { scores: [], evaluators: [] };
          }
          contributions[student].scores.push(score);
          contributions[student].evaluators.push(evaluator);
      });
  });

  // Process and flag outliers
  let flaggedContributions = {};
  let meanContribution = {};

  Object.entries(contributions).forEach(([person, { scores, evaluators }]) => {
    let mean = Math.round(calculateMean(scores));
    meanContribution[person] = mean;
    let stdDev = Math.round(calculateStandardDeviation(scores, mean));

    let flaggedEntries = scores
      .map((score, index) => Math.abs(score - mean) > stdDev ? { evaluator: evaluators[index], score } : null)
      .filter(entry => entry !== null);

    if (flaggedEntries.length > 0) {
      flaggedContributions[person] = Object.fromEntries(flaggedEntries.map(({ evaluator, score }) => [evaluator, score]));
    }
  });

  // Transform contributions to the required format
  let transformed = {};

  Object.entries(flaggedContributions).forEach(([student, evaluations]) => {
    Object.entries(evaluations).forEach(([evaluator, score]) => {
      if (!transformed[evaluator]) {
        transformed[evaluator] = {};
      }
      transformed[evaluator][student] = score;
    });
  });

  return {
    outliers: transformed,
    overallContributions: meanContribution,
  };
}

export function calculateMean(scores) {
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export function calculateStandardDeviation(scores, mean) {
  let variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  return Math.sqrt(variance);
}