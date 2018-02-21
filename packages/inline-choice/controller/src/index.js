export function model(question, session, env) {
  return new Promise((resolve, reject) => {

    const getResult = () => {
      if (!session || !session.selectedChoice) {
        return { correct: false, nothingSubmitted: true }
      }

      const c = question.choices.find(c => c.value === session.selectedChoice);
      const correct = c && !!c.correct;

      const feedback = (() => {
        if (!c || !c.feedback) {
          return undefined;
        }

        const fb = c.feedback || {};

        if (fb.type === 'custom') {
          return fb.value;
        } else {
          return correct ? 'Correct' : 'Incorrect';
        }
      })();

      return { correct, feedback }
    }

    resolve({
      choices: question.choices
        .map(c => Object.assign({}, c, { correct: undefined })),
      disabled: env.mode !== 'gather',
      result: env.mode === 'evaluate' ? getResult() : undefined
    });
  });
}