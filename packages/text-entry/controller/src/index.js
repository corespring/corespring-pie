
import debug from 'debug';

const log = debug('@corespring-pie:text-entry:controller');
// const expandValues = (values, fb) => {

//   return values.map(v => {

//     const feedback = (() => {
//       if (!fb) {
//         return undefined;
//       } else if (fb.type === 'none') {
//         return undefined;
//       } else if (fb.type === 'default') {
//         return 'DEFAULT';
//       } else if (fb.type === 'custom') {
//         return fb.value;
//       }
//     })();

//     return {
//       lang: 'en-US',
//       value: v,
//       feedback
//     }
//   })
// }

// const expandResponses = (r = { values: [], feedback: {} }) => ({
//   values: expandValues(r.values, r.feedback),
//   ignoreWhitespace: r.ignoreWhitespace,
//   ignoreCase: r.ignoreCase
// });

// /**
//  * @param {*} ifb 
//  */
// const expandIncorrectFeedback = ifb => {
//   if (!ifb) {
//     return {
//       disabled: true
//     }
//   }

//   if (ifb.type === 'none') {
//     return { disabled: true }
//   }

//   if (ifb.type === 'custom') {
//     return {
//       fallback: {
//         values: [
//           { lang: 'en-US', feedback: ifb.value }
//         ]
//       }
//     }
//   }

//   if (ifb.type === 'default') {
//     return {
//       fallback: {
//         values: [
//           { lang: 'en-US', feedback: 'Incorrect' }
//         ]
//       }
//     }
//   }
// };


// const expandModel = (q) => ({
//   defaultLang: 'en-US',
//   correctResponses: expandResponses(q.correctResponses),
//   partialResponses: expandResponses(q.partialResponses),
//   incorrectFeedback: expandIncorrectFeedback(q.incorrectFeedback),
//   model: q.model
// });


const process = (v, ignoreCase, ignoreWhitespace) => {
  let out = v ? v.trim() : '';
  out = !ignoreCase ? out : out.toLowerCase();
  out = !ignoreWhitespace ? out : out.replace(/ /g, '');
  return out;
}

const inResponses = (responses, value) => {
  const processedValues = responses.values.map(c => process(c, responses.ignoreCase, responses.ignoreWhitespace));
  const v = process(value, responses.ignoreCase, responses.ignoreWhitespace);
  return processedValues.indexOf(v) !== -1;
}

export function model(question, session, env) {
  // const q = expandModel(question);
  // return root.model(q, session, env);
  log('[model] ...');
  return new Promise((resolve, reject) => {

    const { model, correctResponses } = question;

    const defaultFeedback = Object.assign({
      correct: 'Correct',
      incorrect: 'Incorrect',
      'partially-correct': 'Nearly',
      empty: 'The answer is empty'
    }, question.defaultFeedback);

    const getFeedback = (correctness) => {

      const fb = (config) => {
        config = config || {};
        if (config.type === 'custom') {
          return config.value;
        } else if (config.type === 'default') {
          return 'Correct';
        }
      }

      if (env.mode === 'evaluate') {

        if (correctness === 'correct') {
          return fb(question.correctResponses.feedback, defaultFeedback.correct);
        }

        if (correctness === 'partially-correct') {
          return fb(question.partialResponses.feedback, defaultFeedback['partially-correct']);
        }

        if (correctness === 'incorrect') {
          return fb(question.incorrectFeedback, defaultFeedback.incorrect);
        }

        if (correctness === 'empty') {
          return defaultFeedback.empty;
        }
      }
    }

    const getCorrectness = () => {
      if (env.mode === 'evaluate') {

        if (!session.value) {
          return 'empty';
        }

        const correct = inResponses(question.correctResponses, session.value);
        const partiallyCorrect = inResponses(question.partialResponses, session.value);

        if (correct) {
          return 'correct';
        } else if (partiallyCorrect) {
          return 'partially-correct';
        } else {
          return 'incorrect'
        }
      }
    }


    const correctness = getCorrectness();
    const base = {
      numbersOnlyWarning: undefined,
      colorContrast: 'black_on_white',
      correctness,
      feedback: getFeedback(correctness),
      disabled: env.mode !== 'gather'
    }

    const out = Object.assign(base, model);
    log('out: ', out);
    resolve(out);
  });
}