import every from 'lodash/every';
import uniq from 'lodash/uniq';

export const modelToFeedbackConfig = model => {

  const correctFeedback = model.correctResponses.feedback || {};
  const incorrectFeedback = model.incorrectFeedback || {};
  const partialFeedback = model.partialFeedback || {};

  return {
    correctFeedback: correctFeedback.value,
    correctFeedbackType: correctFeedback.type || 'default',
    incorrectFeedback: incorrectFeedback.value,
    incorrectFeedbackType: incorrectFeedback.type || 'default',
    partialFeedback: partialFeedback.value,
    partialFeedbackType: partialFeedback.type || 'default'
  }
}

export const feedbackConfigToModel = (config, model) => {

  model.correctResponses.feedback = {
    type: config.correctFeedbackType,
    value: config.correctFeedback
  }

  model.partialResponses.feedback = {
    type: config.partialFeedbackType,
    value: config.partialFeedback
  }

  model.incorrectFeedback = {
    type: config.incorrectFeedbackType,
    value: config.incorrectFeedback
  }
  return model;
}