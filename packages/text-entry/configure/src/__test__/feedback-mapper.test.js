import * as feedbackMapper from '../feedback-mapper';
import _ from 'lodash';

describe('feedback-mapper', () => {

  const _assertToFeedbackConfig = (only) => (msg, input, assertion) => {

    const fn = only ? it.only : it;
    fn(msg, () => {
      const out = feedbackMapper.textEntryToFeedbackConfig(input);
      if (_.isFunction(assertion)) {
        assertion(out);
      } else {
        expect(out).to.eql(assertion);
      }
    });
  }

  const assertFeedbackConfig = _assertToFeedbackConfig(false);
  assertFeedbackConfig.only = _assertToFeedbackConfig(true);

  describe('textEntryToFeedbackConfig', () => {

    const assertFb = (key) => {
      describe(`${key}FeedbackType`, () => {

        assertFeedbackConfig('returns default', {
          [`${key}Responses`]: {
            values: [{ lang: 'en-US', value: 'a', feedback: 'DEFAULT' }]
          }
        }, out => expect(out[`${key}FeedbackType`]).toEqual('default'));

        assertFeedbackConfig('returns none', {
          [`${key}Responses`]: {
            values: [{ lang: 'en-US', value: 'a' }]
          }
        }, out => {
          expect(out[`${key}FeedbackType`]).toEqual('none');
        });

        assertFeedbackConfig('returns custom', {
          [`${key}Responses`]: {
            values: [{ lang: 'en-US', value: 'a', feedback: 'custom' }]
          }
        }, out => {
          expect(out[`${key}FeedbackType`]).toEqual('custom');
        });

        assertFeedbackConfig('returns default if mixed feedback', {
          [`${key}Responses`]: {
            values: [
              { lang: 'en-US', value: 'a', feedback: 'custom' },
              { lang: 'en-US', value: 'a', feedback: 'DEFAULT' },
            ]
          }
        }, out => {
          expect(out[`${key}FeedbackType`]).toEqual('default');
        });
      });
    }
    assertFb('correct');
    assertFb('partial');

    describe('incorrectFeedback', () => {

      assertFeedbackConfig('returns none when disabled is true', {
        incorrectFeedback: {
          disabled: true
        }
      }, out => {
        expect(out.incorrectFeedbackType).toEqual('none');
      });

      assertFeedbackConfig('returns custom when there\'s a fallback option for en-US', {
        incorrectFeedback: {
          fallback: {
            values: [
              { lang: 'en-US', feedback: 'Fallback en-US' }
            ]
          }
        }
      }, out => {
        expect(out.incorrectFeedbackType).toEqual('custom');
        expect(out.incorrectFeedback).toEqual('Fallback en-US');
      });

      assertFeedbackConfig('returns default if it can not find a fallback', {
        incorrectFeedback: {}
      }, out => {
        expect(out.incorrectFeedbackType).toEqual('default');
      });
    })
  });



  describe('feedbackConfigToTextEntry', () => {


    const _assertTextEntryConfig = only => (msg, model, fb, expected) => {

      it(msg, () => {

        const out = feedbackMapper.feedbackConfigToTextEntry(fb, model);
        if (_.isFunction(expected)) {
          expected(out);
        } else {
          expect(out).toEqual(expected);
        }
      });
    };

    const assertTextEntryConfig = _assertTextEntryConfig(false);
    assertTextEntryConfig.only = _assertTextEntryConfig(true);


    const model = (fb) => ({
      correctResponses: {
        values: [
          { lang: 'en-US', value: 'hi', feedback: fb },
          { lang: 'en-US', value: 'there', feedback: fb }
        ]
      },
      partialResponses: {
        values: [
          { lang: 'en-US', value: 'hi', feedback: fb },
          { lang: 'en-US', value: 'there', feedback: fb }
        ]
      }
    });

    const assertFb = (key) => {
      describe(key, () => {

        const feedbackType = `${key}FeedbackType`;
        const responses = `${key}Responses`;

        assertTextEntryConfig('none - sets values feedback to undefined', model('foo'), {
          [feedbackType]: 'none'
        }, out => {
          expect(_.every(out[responses].values, f => typeof (f.feedback) === 'undefined'));
        });

        assertTextEntryConfig('default - sets values feedback to default', model(), {
          [feedbackType]: 'default'
        }, out => {
          expect(_.every(out[responses].values, f => f.feedback === 'DEFAULT'));
        });

        assertTextEntryConfig('custom - sets custom', model(), {
          [feedbackType]: 'custom',
          [`${key}Feedback`]: 'custom'
        }, out => {
          expect(_.every(out[responses].values, f => f.feedback === 'custom'));
        })
      });
    }

    assertFb('correct');
    assertFb('partial');

    describe('incorrectFeedback', () => {

      assertTextEntryConfig('type custom adds fallback', {
        incorrectFeedback: {}
      }, {
          incorrectFeedbackType: 'custom',
          incorrectFeedback: 'hi'
        }, out => {
          expect(out.incorrectFeedback.fallback.values).toEqual([
            { lang: 'en-US', value: 'hi' }
          ]);
        });

      assertTextEntryConfig('type default returns {}', {
        incorrectFeedback: {}
      }, {
          incorrectFeedbackType: 'default'
        }, out => {
          expect(out.incorrectFeedback).toEqual({});
        });

      assertTextEntryConfig('type none disables incorrectFeedback', {
        incorrectFeedback: {}
      }, {
          incorrectFeedbackType: 'none'
        }, out => {
          expect(out.incorrectFeedback.disabled).toEqual(true);
        })
    })
  });
});