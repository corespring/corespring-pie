import Main from './Main';
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

export default class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: props.model
    };
  }

  onChoiceModeChanged = (value) => {
    const { model } = this.state;
    model.choiceMode = value;
    if (value === 'radio') {
      let correctFound = false;
      model.choices = model.choices.map(c => {

        if (correctFound) {
          c.correct = false;
          return c;
        }

        if (c.correct) {
          correctFound = true;
        }
        return c;
      });
    }

    this.updateModel(model);
  }

  onRemoveChoice = (index) => {
    const { model } = this.state;
    model.choices.splice(index, 1);
    this.updateModel(model);
  }

  onPartialScoringChanged = (partialScoring) => {
    const { model } = this.state;
    model.partialScoring = partialScoring;
    this.updateModel(model);
  }

  modelChanged = () => {
    this.props.onModelChanged(this.state.model);
  }

  updateModel = (model) => {
    this.setState({ model }, () => {
      this.modelChanged();
    });
  }

  onAddChoice = () => {
    const { model } = this.state;
    model.choices.push({
      label: 'label',
      value: 'value',
      feedback: {
        type: 'none'
      }
    });
    this.updateModel(model);
  }

  onKeyModeChanged = (value) => {
    const { model } = this.state;
    model.keyMode = value;
    this.updateModel(model);
  }

  onChoiceChanged = (index, choice) => {

    const { model } = this.state;
    if (choice.correct && model.choiceMode === 'radio') {
      model.choices = model.choices.map(c => {
        return merge({}, c, { correct: false });
      });
    }

    model.choices.splice(index, 1, choice);
    this.updateModel(model);
  }

  onPromptChanged = (prompt) => {
    const update = cloneDeep(this.state.model);
    update.prompt = prompt;
    this.updateModel(update);
  }

  render() {
    const props = {
      model: this.state.model,
      onRemoveChoice: this.onRemoveChoice,
      onChoiceModeChanged: this.onChoiceModeChanged,
      onKeyModeChanged: this.onKeyModeChanged,
      onChoiceChanged: this.onChoiceChanged,
      onAddChoice: this.onAddChoice,
      onPromptChanged: this.onPromptChanged,
      onDefaultLangChanged: this.onDefaultLangChanged,
      onPartialScoringChanged: this.onPartialScoringChanged,
      imageSupport: this.props.imageSupport
    }

    return <Main {...props} />;
  }
}
