import every from 'lodash/every';
import uniq from 'lodash/uniq';

const applyFeedback = (responses, key) => {
  const out = {
    [`${key}Type`]: 'default'
  }

  if (!responses) {
    return out;
  }

  const feedback = (responses.values || []).map(v => v.feedback);
  if (every(feedback, fb => fb === 'DEFAULT')) {
    out[`${key}Type`] = 'default';
  } else if (every(feedback, fb => !fb)) {
    out[`${key}Type`] = 'none';
  } else {
    const deduped = uniq(feedback);
    if (deduped.length === 1) {
      out[`${key}Type`] = 'custom';
      out[key] = deduped[0];
    } else {
      //we're not sure what the feedback is just set it to default
      out[`${key}Type`] = 'default';
    }
  }
  return out;
}

const applyIncorrectFeedback = (incorrectFeedback) => {

  const out = {
    incorrectFeedbackType: 'default'
  }
  if (!incorrectFeedback) {
    return out;
  }

  if (incorrectFeedback.disabled) {
    out.incorrectFeedbackType = 'none';
  } else {
    //ignore matches
    if (incorrectFeedback.fallback && incorrectFeedback.fallback.values) {
      const fallback = incorrectFeedback.fallback.values.find(v => v.lang === 'en-US');
      if (fallback) {
        out.incorrectFeedbackType = 'custom';
        out.incorrectFeedback = fallback.feedback;
      }
    }
  }
  return out;
}

/**
 * map @pie-elements/text-entry --> FeedbackConfig model. 
 * @param {*} model 
 */
export const textEntryToFeedbackConfig = (model) => {
  return Object.assign(
    applyFeedback(model.correctResponses, 'correctFeedback'),
    applyFeedback(model.partialResponses, 'partialFeedback'),
    applyIncorrectFeedback(model.incorrectFeedback));
}


const configToResponse = (type, custom, responses) => {
  responses = responses || { values: [] };
  if (type === 'custom') {
    responses.values.forEach(v => v.feedback = custom || 'custom feedback');
  } else if (type === 'default') {
    responses.values.forEach(v => v.feedback = 'DEFAULT');
  } else if (type === 'none') {
    responses.values.forEach(v => delete v.feedback);
  }
}

const configToIncorrectFeedback = (type, value) => {
  if (type === 'none') {
    return {
      disabled: true
    }
  } else if (type === 'default') {
    return {}
  } else if (type === 'custom') {
    return {
      fallback: {
        values: [
          { lang: 'en-US', value }
        ]
      }
    }
  }
}

/**
 * old feedback config model to textEntry model.
 */

export const feedbackConfigToTextEntry = (fbConfig, model) => {
  configToResponse(fbConfig.correctFeedbackType, fbConfig.correctFeedback, model.correctResponses);
  configToResponse(fbConfig.partialFeedbackType, fbConfig.partialFeedback, model.partialResponses);
  model.incorrectFeedback = configToIncorrectFeedback(fbConfig.incorrectFeedbackType, fbConfig.incorrectFeedback);
  return model;
}