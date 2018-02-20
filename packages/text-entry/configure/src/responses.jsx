import React from 'react';
import PropTypes from 'prop-types';
import { InputCheckbox, TagsInput } from '@pie-libs/config-ui';
import { withStyles } from 'material-ui/styles';
import Box from './box';
import debug from 'debug';
import { Typography } from 'material-ui';

const log = debug('pie-elements:text-entry:configure');

const SubHeader = withStyles(theme => ({
  subHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    fontSize: '0.7rem'
  }
}))(({ classes, children }) => <Typography className={classes.subHeader}>{children}</Typography>);

class RawResponses extends React.Component {

  onAnswersChange = (answers) => {
    const { feedback, feedbackType } = this.props;

    const valueFeedback = feedbackType === 'custom' ? feedback : (feedbackType === 'default' ? 'DEFAULT' : undefined);
    this.props.responses.values = answers.map(a => ({ lang: 'en-US', value: a, feedback: valueFeedback }));
    this.props.onChange(this.props.responses);
  }

  onIgnoreCaseChange = (event) => {
    this.props.responses.ignoreCase = event.target.checked;
    this.props.onChange(this.props.responses);
  }

  onIgnoreWhitespaceChange = (event) => {
    this.props.responses.ignoreWhitespace = event.target.checked;
    this.props.onChange(this.props.responses);
  }

  render() {
    const { responses, label, subHeader, children, classes, onChange } = this.props;
    log('[responses]: ', responses);

    const values = responses.values.map(v => v.value);
    log('[values]: ', values);
    return (
      <Box>
        <Typography type="body1">{label}</Typography>
        <SubHeader>{subHeader}</SubHeader>
        <TagsInput onChange={this.onAnswersChange} tags={values} />
        <div className={classes.checkboxHolder}>
          <InputCheckbox
            label="Ignore Case"
            checked={responses.ignoreCase}
            onChange={this.onIgnoreCaseChange}
          />
          <InputCheckbox
            label="Ignore Whitespace"
            checked={responses.ignoreWhitespace}
            onChange={this.onIgnoreWhitespaceChange} />
        </div>
        {children ? children : <div />}
      </Box >
    );
  }
}

RawResponses.propTypes = {
  onChange: PropTypes.func.isRequired,
  responses: PropTypes.object.isRequired,
  feedback: PropTypes.string,
  feedbackType: PropTypes.string
}

const Responses = withStyles(theme => ({
  checkboxHolder: {
    display: 'flex',
    paddingTop: theme.spacing.unit
  },
  responses: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  subHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    fontSize: '0.7rem'
  }
}))(RawResponses);

export default Responses;
