import { Action } from '@stacksjs/actions'
import { schema } from '@stacksjs/validation'
import { ask } from '@stacksjs/ai'

// TODO: this should have been auto-generated
type Request = {
  question: string
}

export default new Action({
  name: 'AiAskAction',
  description: 'Ask AI',
  method: 'POST',

  validations: {
    question: {
      rule: schema.string().minLength(3).maxLength(255),
      message: 'The question must be between 3 and 255 characters long.',
    },
  },

  async handle(request: Request) {
    try {
      const question = request.question
      console.log(`Question received: ${question}`)

      return {
        data: await ask(question),
      }
    } catch (error) {
      console.error('Error:', error)

      return {
        error: 'An error occurred while processing your request.',
      }
    }
  },
})