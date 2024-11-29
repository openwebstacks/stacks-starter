import type { RequestInstance } from '@stacksjs/types'
import { Action } from '@stacksjs/actions'
import User from '../../../storage/framework/orm/src/models/User.ts'

export default new Action({
  name: 'CancelSubscriptionAction',
  description: 'Cancel Subscription for stripe',
  method: 'POST',
  async handle(request: RequestInstance) {
    const providerId = request.get('providerId') as string

    const user = await User.find(1)

    const subscription = await user?.cancelSubscription(providerId)

    return subscription?.paymentIntent
  },
})