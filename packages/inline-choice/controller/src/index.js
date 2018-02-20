import * as root from '@pie-elements/inline-choice-controller';

const expandFeedback = fb => {
  if (!fb) {
    return {
      type: 'default'
    }
  } else {
    return {
      type: fb.type || 'default',
      text: fb.type === 'custom' && fb.text ? [{ lang: 'en-US', value: fb.text }] : []
    }
  }
}

const expandChoice = c => {
  return {
    correct: c.correct,
    value: c.value,
    label: [{ lang: 'en-US', value: c.label }],
    feedback: expandFeedback(c.feedback)
  }
}

/**
 * Expand the simple corespring model into a @pie-elements/inline-choice-controller model. 
 * @param {*} model 
 */
const expandModel = (model) => {
  return {
    defaultLang: 'en-US',
    prompt: [
      { lang: 'en-US', value: model.propmpt }
    ],
    choices: model.choices.map(expandChoice)
  }
}

export function model(question, session, env) {
  const q = expandModel(question);
  return root.model(q, session, env);
}