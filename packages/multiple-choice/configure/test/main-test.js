import { ChoiceType, KeyType } from '../src/choice-type';
import { assert, match, spy, stub } from 'sinon';

import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import ChoiceConfig from '../src/choice-config';
import FeedbackMenu from '../src/feedback-menu';
import MultiLangInput from '../src/multi-lang-input';
import React from 'react';
import TextField from 'material-ui/TextField';
import _ from 'lodash';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { shallow } from 'enzyme';

describe('main', () => {

  let mod, Main;

  beforeEach(() => {

    mod = proxyquire('../src/main', {
      '@pie-libs/scoring-config/src/index.jsx': {
        default: stub(),
        '@noCallThru': true
      }
    });

    Main = mod.Main;
  });

  let mkWrapperAndOpts = (opts = {}) => {
    opts = _.merge({
      onChoiceChanged: stub(),
      onChoiceModeChanged: stub(),
      onKeyModeChanged: stub(),
      onRemoveChoice: stub(),
      onDefaultLangChanged: stub(),
      onPromptChanged: stub(),
      onAddChoice: stub(),
      onPartialScoringChanged: stub(),
      model: {
        prompt: [
          { lang: 'en-US', value: 'What country is called the Emerald Isle?' }
        ],
        choiceMode: 'radio',
        keyMode: 'letters',
        defaultLang: 'en-US',
        langs: ['en-US', 'es-ES'],
        choices: [
          {
            correct: true,
            value: 'ireland',
            label: [
              { lang: 'en-US', value: 'Ireland' }
            ]
          }
        ]
      },
      classes: {
        root: 'root'
      }
    }, opts);
    return { wrapper: shallow(<Main {...opts} />), opts };
  }

  let mkWrapper = (opts = {}) => mkWrapperAndOpts(opts).wrapper;

  describe('render', () => {
    let wrapper, opts;

    beforeEach(() => {
      let wo = mkWrapperAndOpts();
      wrapper = wo.wrapper;
      opts = wo.opts;
    });

    it('sets the classname', () => {
      expect(wrapper.find('.root').length).to.eql(1);
    });

    describe('ChoiceType', () => {
      it('sets the value', () => {
        expect(wrapper.find(ChoiceType).prop('value')).to.eql('radio');
      });

      it('binds the callback', () => {
        let ct = wrapper.find(ChoiceType);
        ct.prop('onChange')('checkbox');
        assert.calledWith(opts.onChoiceModeChanged, 'checkbox');
      });
    });

    describe('KeyType', () => {

      it('sets the value', () => {
        expect(wrapper.find(KeyType).prop('value')).to.eql('letters');
      });

      it('binds the callback', () => {
        let ct = wrapper.find(KeyType);
        ct.prop('onChange')('numbers');
        assert.calledWith(opts.onKeyModeChanged, 'numbers');
      });
    });

    describe('Langs:activeLang', () => {
      let l,
        selector = '[label="Choose language to edit"]';

      beforeEach(() => {
        l = wrapper.find(selector);
      });
      it('sets the langs', () => {
        expect(l.prop('langs')).to.eql(opts.model.langs);
      });

      it('sets selected to default lang', () => {
        expect(l.prop('selected')).to.eql('en-US');
      });

      it('updating activeLang state updates selected', () => {
        wrapper.setState({ activeLang: 'es-ES' })
        l = wrapper.find(selector);
        expect(l.prop('selected')).to.eql('es-ES');
      });

      it('updates state onChange', () => {
        l.prop('onChange')({}, 0, 'es-ES');
        l = wrapper.find(selector);
        expect(l.prop('selected')).to.eql('es-ES');
      });
    });

    describe('Langs:defaultLang', () => {
      let l,
        selector = '[label="Default language"]';

      beforeEach(() => {
        l = wrapper.find(selector);
      });

      it('sets the langs', () => {
        expect(l.prop('langs')).to.eql(opts.model.langs);
      });

      it('sets selected', () => {
        expect(l.prop('selected')).to.eql(opts.model.defaultLang);
      });

      it('calls onDefaultLangChanged', () => {
        l.prop('onChange')({}, 0, 'es-ES');
        assert.calledWith(opts.onDefaultLangChanged, 'es-ES');
      });
    });

    describe('prompt', () => {
      let i;

      beforeEach(() => {
        i = wrapper.find(MultiLangInput);
      });

      it('sets the value', () => {
        expect(i.prop('value')).to.eql(opts.model.prompt);
      });

      it('sets the activeLang to the default', () => {
        expect(i.prop('lang')).to.eql(opts.model.defaultLang);
      });

      it('updates the activeLang to state.activeLang', () => {
        wrapper.setState({ activeLang: 'es-ES' })
        i = wrapper.find(MultiLangInput);
        expect(i.prop('lang')).to.eql('es-ES');
      });

      it('calls onPromptChanged', () => {
        i.prop('onChange')('new prompt', 'en-US');
        assert.calledWith(opts.onPromptChanged, 'new prompt', 'en-US');
      });
    });

    describe('choices', () => {
      let firstChoice;
      beforeEach(() => {
        firstChoice = wrapper.find(ChoiceConfig).get(0);
      });

      it('sets index', () => {
        expect(firstChoice.props.index).to.eql(0);
      });

      it('sets choiceMode', () => {
        expect(firstChoice.props.choiceMode).to.eql(opts.model.choiceMode);
      });

      it('sets keyMode', () => {
        expect(firstChoice.props.keyMode).to.eql(opts.model.keyMode);
      });

      it('sets activeLang', () => {
        expect(firstChoice.props.activeLang).to.eql(opts.model.defaultLang);
      });

      it('sets defaultLang', () => {
        expect(firstChoice.props.defaultLang).to.eql(opts.model.defaultLang);
      });

      it('handles onChoiceChanged', () => {
        firstChoice.props.onChoiceChanged();
        assert.calledWith(opts.onChoiceChanged, 0);
      });

      it('handles onRemoveChoice', () => {
        firstChoice.props.onRemoveChoice();
        assert.calledWith(opts.onRemoveChoice, 0);
      });
    });

    describe('Add a choice', () => {

      it('calls onAddChoice', () => {
        const button = wrapper.find(Button)
        button.simulate('click');
        assert.calledWith(opts.onAddChoice, opts.model.defaultLang);
      })
    });
  });
});