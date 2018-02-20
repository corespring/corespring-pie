import * as root from '@pie-elements/text-entry-controller';


const expandValues = (values, fb) => {

  return values.map(v => {

    const feedback = (() => {
      if (!fb) {
        return undefined;
      } else if (fb.type === 'none') {
        return undefined;
      } else if (fb.type === 'default') {
        return 'DEFAULT';
      } else if (fb.type === 'custom') {
        return fb.value;
      }
    })();

    return {
      lang: 'en-US',
      value: v,
      feedback
    }
  })
}

const expandResponses = r => ({
  value: expandValues(r.values, r.feedback),
  ignoreWhitespace: r.ignoreWhitespace,
  ignoreCase: r.ignoreCase
})

/**
 * @param {*} ifb 
 */
const expandIncorrectFeedback = ifb => {
  if (!ifb) {
    return {
      disabled: true
    }
  }

  if (ifb.type === 'none') {
    return { disabled: true }
  }

  if (ifb.type === 'custom') {
    return {
      fallback: {
        values: [
          { lang: 'en-US', feedback: ifb.value }
        ]
      }
    }
  }

  if (ifb.type === 'default') {
    return {
      fallback: {
        values: [
          { lang: 'en-US', feedback: 'Incorrect' }
        ]
      }
    }
  }
};


const expandModel = (q) => ({
  defaultLang: 'en-US'
  correctResponses: expandResponses(q.correctResponses),
  partialResponses: expandResponses(q.partialResponses),
  incorrectFeedback: expandIncorrectFeedback(q.incorrectFeedback)
  model: { ...q.model }
});

export function model(question, session, env) {
  const q = expandModel(question);
  return root.model(q, session, env);
}