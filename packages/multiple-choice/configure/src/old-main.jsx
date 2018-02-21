import { ChoiceType, KeyType } from './choice-type';
import { FormControl, FormControlLabel, FormLabel } from 'material-ui/Form';
import { LanguageControls, MultiLangInput } from '@pie-libs/config-ui';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Tabs, { Tab } from 'material-ui/Tabs';

import Button from 'material-ui/Button';
import ChoiceConfig from './choice-config';
import { Langs } from '@pie-libs/config-ui';
import PartialScoringConfig from '@pie-libs/scoring-config/src/index.jsx';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';
import { createMuiTheme, withStyles, MuiThemeProvider } from 'material-ui/styles';

const theme = createMuiTheme({});

export class Main extends React.Component {

  constructor(props) {
    super(props);
    this.onTabsChange = this.onTabsChange.bind(this);
    this.state = {
      activeLang: props.model.defaultLang,
      index: 0
    }
  }

  onTabsChange(event, index) {
    this.setState({ index });
  }

  render() {

    const {
      onChoiceChanged,
      onRemoveChoice,
      onChoiceModeChanged,
      onKeyModeChanged,
      onPromptChanged,
      onAddChoice,
      model,
      onDefaultLangChanged,
      onPartialScoringChanged,
      onInsertImage,
      onDeleteImage,
      classes
    } = this.props;

    const { index } = this.state;

    const design = <div className={classes.root}>
      <div className={classes.baseTypes}>
        <ChoiceType value={model.choiceMode} onChange={onChoiceModeChanged} />
        <KeyType value={model.keyMode} onChange={onKeyModeChanged} />
      </div>

      <hr className={classes.divider} />

      <LanguageControls
        langs={model.langs}
        activeLang={this.state.activeLang}
        defaultLang={model.defaultLang}
        onActiveLangChange={activeLang => this.setState({ activeLang })}
        onDefaultLangChange={onDefaultLangChanged} />

      <br />
      <br />
      <MultiLangInput
        label="Prompt"
        value={model.prompt}
        lang={this.state.activeLang}
        onChange={onPromptChanged}
        imageSupport={{
          add: onInsertImage,
          delete: onDeleteImage
        }} />


      {model.choices.map((choice, index) => {
        const choiceProps = {
          choice,
          index,
          choiceMode: model.choiceMode,
          keyMode: model.keyMode,
          activeLang: this.state.activeLang,
          defaultLang: model.defaultLang,
          onChoiceChanged: onChoiceChanged.bind(null, index),
          onRemoveChoice: onRemoveChoice.bind(null, index),
          onInsertImage,
          onDeleteImage
        }
        return <ChoiceConfig key={index} {...choiceProps} />;
      })
      }

      <br />
      <Button
        raised
        color="primary"
        onClick={() => onAddChoice(this.state.activeLang)} >Add a choice</Button>
    </div >;

    return <div>
      <Tabs onChange={this.onTabsChange} value={index}>
        <Tab label="Design"></Tab>
        <Tab label="Scoring"></Tab>
      </Tabs>
      {index === 0 && design}
      {index === 1 && <PartialScoringConfig
        partialScoring={model.partialScoring}
        numberOfCorrectResponses={model.choices.filter(choice => choice.correct).length}
        onChange={onPartialScoringChanged} />}
    </div>;
  }
}

const main = {
  root: {
    paddingTop: '10px',
    paddingBottom: '10px'
  },
  languageControls: {
    display: 'flex'
  },
  baseTypes: {
    display: 'flex'
  },
  divider: {
    paddingTop: '5px',
    paddingBottom: '1px',
    border: 'none',
    borderBottom: 'solid 1px rgba(0, 0, 0, 0.128039)'
  }
};

const StyledMain = withStyles(main, { name: 'Main' })(Main);

export default (props) => <MuiThemeProvider theme={theme}><StyledMain {...props} /></MuiThemeProvider>;