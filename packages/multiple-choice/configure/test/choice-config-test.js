import { assert, match, spy, stub } from 'sinon';

import Checkbox from 'material-ui/Checkbox';
import FeedbackMenu from '../src/feedback-menu';
import Radio from 'material-ui/Radio';
import React from 'react';
import TextField from 'material-ui/TextField';
import _ from 'lodash';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { shallow } from 'enzyme';

describe('choice-config', () => {

  let mod, ChoiceConfig;

  beforeEach(() => {

    mod = proxyquire('../src/choice-config', {});

    ChoiceConfig = mod.ChoiceConfig;
  });

  let mkWrapperAndOpts = (opts = {}) => {
    opts = _.merge({
      index: 0,
      activeLang: 'en-US',
      choice: {
        correct: true,
        feedback: {
          type: 'none'
        }
      },
      classes: {
        index: 'index'
      }
    }, opts);
    return { wrapper: shallow(<ChoiceConfig {...opts} />), opts };
  }

  let mkWrapper = (opts = {}) => mkWrapperAndOpts(opts).wrapper;


  describe('render', () => {
    let w;
    beforeEach(() => {
      w = mkWrapper();
    });

    describe('index', () => {
      it('sets the index to A', () => {
        console.log('w: ', w, w.debug());
        expect(w.find('.index').text()).to.eql('A');
      });

      it('sets the index to B', () => {
        expect(mkWrapper({ index: 1 }).find('.index').text()).to.eql('B');
      });

      it('sets the index to 1', () => {
        expect(mkWrapper({ index: 0, keyMode: 'numbers' }).find('.index').text()).to.eql('1');
      });
    });

    describe('ChoiceModeTag', () => {
      it('renders Radio for radio', () => {
        let w = mkWrapper({ choiceMode: 'radio' });
        expect(w.find(Radio).length).to.eql(1);
        expect(w.find(Checkbox).length).to.eql(0);
      });

      it('renders Checkbox for checkbox', () => {
        let w = mkWrapper({ choiceMode: 'checkbox' });
        expect(w.find(Radio).length).to.eql(0);
        expect(w.find(Checkbox).length).to.eql(1);
      });
    });

    describe('TextField', () => {
      it('sets the value to choice.value', () => {
        let w = mkWrapper({ choice: { value: 'hi' } });
        expect(w.find(TextField).first().prop('value')).to.eql('hi');
      })
    });

    describe('MultiLangInput:label', () => {
      it('sets the label', () => {
        let label = [{ lang: 'en-US', value: 'label' }];
        let w = mkWrapper({ choice: { label } });
        expect(w.find('[textFieldLabel="label"]').prop('value')).to.eql(label);
      });
    });

    describe('FeedbackMenu', () => {
      let assert = (type, expected) => {
        return () => {
          let w = mkWrapper({
            choice: {
              feedback: { type }
            }
          });
          expect(w.find(FeedbackMenu).prop('value')).to.eql(type);

        }
      }

      it('sets the feedback.type to custom', assert('custom'));
      it('sets the feedback.type to none', assert('none'));
      it('sets the feedback.type to default', assert('default'));
    });

    describe('custom feedback MultiLangInput', () => {
      let assert = (type, length, custom) => {
        return () => {
          let w = mkWrapper({
            choice: {
              feedback: { type, custom }
            }
          });
          let fb = w.find('[textFieldLabel="feedback"]');
          expect(fb.length).to.eql(length);
          if (fb.length === 1) {
            expect(fb.prop('value')).to.eql(custom);
          }
        }
      }

      it('does not render feedback input if type is none', assert('none', 0));
      it('does not render feedback input if type is default', assert('default', 0));
      it('does render feedback input if type is custom', assert('custom', 1, [{ lang: 'en-US', value: 'feedback' }]));
    });
  });

  describe('methods', () => {
    let onChoiceChanged;

    beforeEach(() => {
      onChoiceChanged = stub();
    });

    let assertChoiceChanged = (instanceFn, updateFn) => {
      return () => {
        let { wrapper, opts } = mkWrapperAndOpts({ onChoiceChanged });
        let i = wrapper.instance();
        instanceFn(i);
        let update = updateFn(_.cloneDeep(opts));
        assert.calledWith(onChoiceChanged, update);
      }
    }

    describe('onValueChanged', () => {

      it('calls onChoiceChanged with update', assertChoiceChanged(
        i => i.onValueChanged({ target: { value: 'new_value' } }),
        o => _.merge(o.choice, { value: 'new_value' })
      ));
    });



    describe('onToggleCorrect', () => {

      it('calls onChoiceChanged with update', assertChoiceChanged(
        i => i.onToggleCorrect(),
        o => {
          let correct = o.choice.correct;
          return _.merge({}, o.choice, {
            correct: !correct, feedback: {
              default: 'Incorrect'
            }
          });
        }
      ));
    });



    describe('onLabelChanged', () => {
      let assert = (lang) => assertChoiceChanged(
        i => i.onLabelChanged('hihi', lang),
        o => _.merge({}, o.choice, {
          label: [
            { lang, value: 'hihi' }
          ]
        })
      );

      it('calls onChoiceChanged with update en-US', assert('en-US'));
      it('calls onChoiceChanged with update es-ES', assert('es-ES'));
    });

    describe('onFeedbackChanged', () => {
      let assert = (lang) => assertChoiceChanged(
        i => i.onFeedbackChanged('fb', lang),
        o => _.merge({}, o.choice, {
          feedback: {
            custom: [
              { lang, value: 'fb' }
            ]
          }
        })
      );

      it('calls onChoiceChanged with update en-US', assert('en-US'));
      it('calls onChoiceChanged with update es-ES', assert('es-ES'));
    });

    describe('onFeedbackTypeChanged', () => {

      let assertType = (type, expected) => {
        return assertChoiceChanged(
          i => i.onFeedbackTypeChanged(type),
          o => _.merge({}, o.choice, expected));
      }

      it('calls onChoiceChanged with feedback.type: none', assertType('none', {
        feedback: { type: 'none' }
      }));

      it('calls onChoiceChanged with feedback.type: custom',
        assertType('custom', {
          feedback: {
            type: 'custom',
            custom: [
              { lang: 'en-US', value: '' }
            ]
          }
        }));

      it('calls onChoiceChanged with feedback.type: default', assertType('default', {
        feedback: {
          type: 'default',
          default: 'Correct!'
        }
      }));
    });

  });
});