
import { isResponseCorrect } from '@pie-elements/multiple-choice-controller';

const prepareChoice = (mode, defaultFeedback) => (choice) => {

  const out = {
    label: choice.label,
    value: choice.value
  }

  if (mode == 'evaluate') {
    out.correct = choice.correct;

    const feedbackType = (choice.feedback && choice.feedback.type) || 'none';

    if (feedbackType === 'default') {
      out.feedback = defaultFeedback[choice.correct ? 'correct' : 'incorrect'];
    } else if (feedbackType === 'custom') {
      out.feedback = choice.feedback.value;
    }
  }

  return out;
}


export function model(question, session, env) {
  return new Promise((resolve, reject) => {

    const defaultFeedback = Object.assign({ correct: 'Correct', incorrect: 'Incorrect' }, question.defaultFeedback);
    const choices = question.choices.map(prepareChoice(env.mode, defaultFeedback));

    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      prompt: question.prompt,
      choiceMode: question.choiceMode,
      keyMode: question.keyMode,
      choices,
      complete: {
        min: question.choices.filter(c => c.correct).length
      },
      responseCorrect: isResponseCorrect(question, session)
    };

    resolve(out);
  });
}