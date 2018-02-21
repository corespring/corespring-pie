import { model as modelMock } from '@pie-elements/text-entry-controller';

import { model } from '../index';


describe('model', () => {

  test('it calls model with expanded data', async () => {
    const question = {
      correctResponses: {
        values: ['apple', 'banana']
      }
    }

    const session = {
      value: ['apple']
    }
    const env = {}
    await model(question, session, env);
    expect(modelMock.mock.calls.length).toBe(1);
    expect(modelMock.mock.calls[0][0]).toMatchObject({
      correctResponses: {
        values: [
          { lang: 'en-US', value: 'apple' },
          { lang: 'en-US', value: 'banana' }
        ]
      }
    });
  });
});