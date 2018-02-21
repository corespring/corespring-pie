import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-libs/editable-html';
import { InputContainer } from '@pie-libs/config-ui';
import { withStyles } from 'material-ui/styles';
import Tabs, { Tab } from 'material-ui/Tabs';
import { ChoiceType, KeyType } from './choice-type';

const styles = theme => ({
  prompt: {
    paddingTop: theme.spacing.unit * 2
  },
  design: {
    paddingTop: theme.spacing.unit * 3
  }
});

const Design = withStyles(styles)((props) => {

  const { classes, model, onPromptChanged } = props;
  return (
    <div className={classes.design}>
      <Basics {...props} />
      <InputContainer label="Prompt" >
        <EditableHtml
          className={classes.prompt}
          markup={model.prompt}
          onChange={onPromptChanged} />
      </InputContainer>
    </div>
  );

});


const Basics = (props) => {
  const { classes, model, onChoiceModeChanged, onKeyModeChanged } = props;
  return (
    <div className={classes.baseTypes}>
      <ChoiceType value={model.choiceMode} onChange={onChoiceModeChanged} />
      <KeyType value={model.keyMode} onChange={onKeyModeChanged} />
    </div>
  );
}

export class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0
    }
  }

  onTabsChange(event, index) {
    this.setState({ index });
  }

  render() {

    const { model, onPromptChanged, classes } = this.props;
    const { index } = this.state;

    return (
      <div>
        <Tabs onChange={this.onTabsChange} value={index}>
          <Tab label="Design"></Tab>
          <Tab label="Scoring"></Tab>
        </Tabs>
        {index === 0 && <Design {...this.props} />}
        {index === 1 && <PartialScoringConfig
          partialScoring={model.partialScoring}
          numberOfCorrectResponses={model.choices.filter(choice => choice.correct).length}
          onChange={onPartialScoringChanged} />}
      </div>

    );
  }
}

Main.propTypes = {}


export default withStyles(styles)(Main);