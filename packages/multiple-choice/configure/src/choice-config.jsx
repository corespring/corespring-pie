import { InputContainer, MultiLangInput, InputCheckbox, InputRadio } from '@pie-libs/config-ui';
import React, { PropTypes } from 'react';

import ActionDelete from 'material-ui-icons/Delete';
import ActionFeedback from 'material-ui-icons/Feedback';
import Checkbox from 'material-ui/Checkbox';
import FeedbackMenu from './feedback-menu';
import IconButton from 'material-ui/IconButton';
import Radio from 'material-ui/Radio';
import TextField from 'material-ui/TextField';
import cloneDeep from 'lodash/cloneDeep';
import isString from 'lodash/isString';
import merge from 'lodash/merge';
import { withStyles } from 'material-ui/styles';

const defaultFeedback = (c) => c ? 'Correct!' : 'Incorrect';
export class ChoiceConfig extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.onLabelChanged = this.onLabelChanged.bind(this);
    this.onFeedbackTypeChanged = this.onFeedbackTypeChanged.bind(this);
    this.onFeedbackChanged = this.onFeedbackChanged.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  _indexToSymbol(index) {
    return ((this.props.keyMode === 'numbers') ? index + 1 : String.fromCharCode(97 + index).toUpperCase()).toString();
  }

  onValueChanged(event) {
    const update = event.target.value;
    this.props.onChoiceChanged(merge({}, this.props.choice, {
      value: update
    }));
  }

  onToggleCorrect() {
    const message = defaultFeedback(!this.props.choice.correct);
    let update = merge({}, this.props.choice, {
      correct: !this.props.choice.correct,
      feedback: {
        'default': message
      }
    });
    this.props.onChoiceChanged(update);
  }

  onLabelChanged(label) {
    let update = cloneDeep(this.props.choice);
    update.label = label;
    this.props.onChoiceChanged(update);
  }

  onFeedbackChanged(custom) {
    const { choice } = this.props;
    const update = cloneDeep(choice);
    update.feedback.custom = custom;
    this.props.onChoiceChanged(update);
  }

  onFeedbackTypeChanged(t) {
    const { choice, activeLang } = this.props;
    const update = cloneDeep(choice);

    update.feedback.type = t;

    if (t === 'default') {
      update.feedback['default'] = defaultFeedback(choice.correct);
    } else if (t === 'custom') {
      update.feedback.custom = update.feedback.custom || [];
      let t = update.feedback.custom.find(t => t.lang === activeLang);
      if (!t) {
        update.feedback.custom.push({ lang: activeLang, value: '' });
      }
    }
    this.props.onChoiceChanged(update);
  }

  render() {
    let {
      index,
      choice,
      choiceMode,
      onChoiceChanged,
      onRemoveChoice,
      activeLang,
      classes,
      onInsertImage,
      onDeleteImage } = this.props;

    const ChoiceModeTag = choiceMode === 'checkbox' ? InputCheckbox : InputRadio;

    const imageSupport = {
      add: onInsertImage,
      delete: onDeleteImage
    }

    return <div className={classes.root}>
      <div className={classes.main}>
        <div className={classes.indexAndModeTag}>
          <span className={classes.index}>{this._indexToSymbol(index)}</span>
          <ChoiceModeTag
            label="Correct"
            checked={choice.correct === true}
            style={{ width: 'auto', paddingLeft: '5px' }}
            onClick={() => this.onToggleCorrect()} />
        </div>
        <TextField
          label="Value"
          value={choice.value}
          onChange={this.onValueChanged}
          className={classes.valueField} />
        <MultiLangInput
          label="Label"
          className={classes.multiLangInput}
          value={choice.label}
          lang={activeLang}
          onChange={this.onLabelChanged}
          imageSupport={imageSupport} />
        <FeedbackMenu
          value={choice.feedback.type}
          onChange={this.onFeedbackTypeChanged} />

        <IconButton
          aria-label="delete"
          onClick={onRemoveChoice}><ActionDelete /></IconButton>
      </div>
      {choice.feedback.type === 'custom' &&
        <div className={classes.feedback}>
          <MultiLangInput
            label="Feedback"
            className={classes.multiLangInput}
            value={choice.feedback.custom}
            lang={activeLang}
            onChange={this.onFeedbackChanged}
            imageSupport={imageSupport} />
        </div>
      }

    </div >;
  }
}

ChoiceConfig.props = {
  index: PropTypes.number.isRequired,
  keyMode: PropTypes.oneOf(['letters', 'numbers']).isRequired,
  isCorrect: PropTypes.bool.isRequired,
  choice: PropTypes.object.isRequired,
  onChoiceChanged: PropTypes.func.isRequired,
  onToggleCorrect: PropTypes.func.isRequired,
  onRemoveChoice: PropTypes.func.isRequired,
  activeLang: PropTypes.string.isRequired
}

const styles = {
  multiLangInput: {
    marginBottom: 0,
    flex: 1
  },
  root: {
    paddingBottom: '10px',
    paddingTop: '10px',
  },
  main: {
    display: 'flex',
    alignItems: 'flex-end',
    paddingBottom: '8px'
  },
  feedback: {
    display: 'flex'
  },
  indexAndModeTag: {
    display: 'flex',
    alignItems: 'center'
  },
  index: {
    display: 'inline-block',
    position: 'relative',
    top: '0px',
    fontWeight: 'bold',
    fontSize: '18px',
    transform: 'translateY(20%)'
  },
  valueField: {
    width: '100px',
    maxWidth: '100px',
    marginRight: '10px',
    marginLeft: '10px',
    paddingBottom: '8px'
  }
};

export default withStyles(styles, { name: 'ChoiceConfig' })(ChoiceConfig);