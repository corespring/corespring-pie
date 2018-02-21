import { model as modelMock } from '@pie-elements/inline-choice-controller';

import { model } from '../index';


describe('model', () => {


  test('calls root model', async () => {

    const question = {
      choices: [
        { value: 'a', label: 'a', correct: true },
        { value: 'b', label: 'b', correct: false }
      ]
    }

    const session = {
      selectedChoice: 'a'
    }

    const env = {}
    await model(question, session, env);
    expect(modelMock.mock.calls.length).toBe(1);
    expect(modelMock.mock.calls[0][0]).toMatchObject({
      choices: [
        {
          value: 'a',
          label: [
            { lang: 'en-US', value: 'a' }
          ],
          correct: true
        },
        {
          value: 'b',
          label: [
            { lang: 'en-US', value: 'b' }
          ],
          correct: false
        }
      ]
    });
  });
})
