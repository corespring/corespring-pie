import { withStyles } from 'material-ui/styles';
import React from 'react';
import { Typography, TextField } from 'material-ui';
import { FeedbackConfig } from '@pie-libs/config-ui';
import IconButton from 'material-ui/IconButton';
import debug from 'debug';
import Responses from './responses';
import PropTypes from 'prop-types';
import range from 'lodash/range';
import ModelConfig from './model-config';
import { modelToFeedbackConfig, feedbackConfigToModel } from './feedback-mapper';

const log = debug('@corespring-pie:text-entry:configure');

const styles = theme => ({
  award: {
    width: '100%'
  }
});

/**
 *
 * Note:
 * This ui will initially mirror the corespring configuration pane,
 * even though this text-entry component can do more than the corespring compoent.
 * Once this is done, pie will be updated such that this
 * 'corespring' like ui can be moved into a differet package.
 *
 * 1. configure pane mirrors corespring pane (remove langs etc)
 * 2. update pie to support external packages
 * 3. move configure pane to it's own cs package
 * 4. add more fleshed out configure package for the model.
 */
class Configure extends React.Component {

  updateResponses = (name) => (responses) => {
    const { model } = this.props;
    model[name] = responses;
    log('[updateResponses]', name, 'responses: ', responses);
    this.props.onModelChanged(model);
  }

  onCorrectResponsesChanged = this.updateResponses('correctResponses')

  onPartialResponsesChanged = this.updateResponses('partialResponses')

  onModelConfigChange = (cfg) => {
    this.props.model.model = cfg;
    this.props.onModelChanged(this.props.model);
  }

  onFeedbackChange = (feedbackConfig) => {
    const model = feedbackConfigToModel(feedbackConfig, this.props.model);
    this.props.onModelChanged(this.props.model);
  }

  render() {
    const { classes, model } = this.props;

    const feedbackConfig = modelToFeedbackConfig(model);

    log('[render] model', model);

    return (
      <div>
        <Typography>Students will respond to a prompt (e.g., calculate, identify, compute), and the answer will be evaluated.</Typography>
        <Responses
          label="Correct Answers"
          subHeader="Additional correct answers may be added by clicking enter/return between answers."
          responses={model.correctResponses}
          onChange={this.onCorrectResponsesChanged}
          feedbackType={feedbackConfig.correctFeedbackType}
          feedback={feedbackConfig.correctFeedback}
        />
        <Responses
          label="Partial Correct Answers (optional)"
          subHeader="Additional partially correct answers may be added by clicking enter/return between answers."
          responses={model.partialResponses}
          feedbackType={feedbackConfig.partialFeedbackType}
          feedback={feedbackConfig.partialFeedback}
          onChange={this.onPartialResponsesChanged}>
          <div>
            <TextField className={classes.award} placeholder="0" label="Award % for partially correct answer" />
          </div>
        </Responses>
        <ModelConfig config={model.model} onChange={this.onModelConfigChange} />
        <FeedbackConfig
          feedback={feedbackConfig}
          onChange={this.onFeedbackChange} />
      </div>
    )
  }
}

const ConfigureMain = withStyles(styles)(Configure);


class StateWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      model: props.model
    }

    this.onModelChanged = (m) => {
      this.setState({ model: m }, () => {
        this.props.onModelChanged(this.state.model);
      });
    }
  }


  render() {
    const { model } = this.state;
    return <ConfigureMain model={model} onModelChanged={this.onModelChanged} />
  }
}

export default StateWrapper;

