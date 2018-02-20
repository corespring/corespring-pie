import { withStyles } from 'material-ui/styles';
import React from 'react';
import { Typography, TextField, FormControl, Select, MenuItem } from 'material-ui';
import { Checkbox, FeedbackConfig, TagsInput, NChoice, InputCheckbox } from '@pie-libs/config-ui';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { Cancel } from 'material-ui-icons';
import IconButton from 'material-ui/IconButton';
import debug from 'debug';
import Responses from './responses';
import PropTypes from 'prop-types';
import Box from './box';
import { feedbackConfigToTextEntry, textEntryToFeedbackConfig } from './feedback-mapper';
import range from 'lodash/range';

const log = debug('pie-elements:text-entry:configure');

class RawModelConfig extends React.Component {

  onChange = (key) => (event) => {
    this.props.config[key] = event.target.checked;
    this.props.onChange(this.props.config);
  }

  onAlignmentChange = (alignment) => {
    this.props.config.answerAlignment = alignment;
    this.props.onChange(this.props.config);
  }

  onAnswerSizeChange = (size) => {
    this.props.config.answerBlankSize = size;
    this.props.onChange(this.props.config);
  }

  render() {

    const { onChange, config, classes } = this.props;

    const { allowIntegersOnly } = config;

    const sizeOpts = range(2, 14, 2).map(v => ({ label: v.toString(), value: v.toString() }));

    return (
      <Box>
        <Typography>Options</Typography>
        <br />
        <div className={classes.numberOpts}>
          <InputCheckbox label="Numbers only"
            checked={allowIntegersOnly}
            onChange={this.onChange('allowIntegersOnly')} />

          {allowIntegersOnly && <InputCheckbox
            label="Decimals"
            checked={config.allowDecimal}
            onChange={this.onChange('allowDecimal')} />}
          {allowIntegersOnly && <InputCheckbox
            label="Thousands separator"
            checked={config.allowThousandsSeparator}
            onChange={this.onChange('allowThousandsSeparator')} />}
          {allowIntegersOnly && <InputCheckbox label="Negative"
            checked={config.allowNegative}
            onChange={this.onChange('allowNegative')} />}
        </div>
        <NChoice
          header={'Answer Size'}
          value={config.answerBlankSize}
          opts={sizeOpts}
          onChange={this.onAnswerSizeChange} />
        <NChoice
          header={'Answer Alignment'}
          value={config.answerAlignment}
          opts={[
            { label: 'left', value: 'left' },
            { label: 'center', value: 'center' },
            { label: 'right', value: 'right' }
          ]}
          onChange={this.onAlignmentChange} />
      </Box>
    )
  }
}

const ModelConfig = withStyles(theme => ({
  numberOpts: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
}))(RawModelConfig);


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
    const model = feedbackConfigToTextEntry(feedbackConfig, this.props.model);
    this.props.onModelChanged(this.props.model);
  }

  render() {
    const { classes, model } = this.props;

    const feedbackConfig = textEntryToFeedbackConfig(model);

    log('[render]: feedbackConfig', feedbackConfig);

    //This configure ui only supports 'en-US' for now.
    const onlyEnUs = (v => v.lang === 'en-US');
    model.correctResponses.values = model.correctResponses.values.filter(onlyEnUs);
    model.partialResponses.values = model.partialResponses.values.filter(onlyEnUs);

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

