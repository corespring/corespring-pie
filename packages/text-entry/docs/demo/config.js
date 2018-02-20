module.exports = {
  langs: ['en-US', 'es-ES'],
  elements: {
    'text-entry': '../..'
  },
  models: [
    {
      id: '1',
      element: 'text-entry',
      correctResponses: {
        values: ['mutt', 'hound'],
        ignoreWhitespace: false,
        ignoreCase: false,
        feedback: {
          type: 'custom',
          value: 'correct-o'
        }
      },
      partialResponses: {
        values: ['mutty'],
        ignoreWhitespace: true,
        ignoreCase: true,
        feedback: {
          type: 'custom',
          value: 'foo'
        }
      },
      incorrectFeedback: {
        type: 'custom',
        value: 'custom feedback'
      },
      model: {
        answerBlankSize: '10',
        answerAlignment: 'left',
        allowDecimal: true,
        allowIntegersOnly: false,
        allowThousandsSeparator: true
      }
    }
  ]
}