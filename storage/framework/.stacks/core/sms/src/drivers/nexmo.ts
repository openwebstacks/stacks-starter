import { NexmoSmsProvider } from '@novu/nexmo'
import { italic } from 'stacks:cli'
import type { SmsOptions } from 'stacks:types'
import { ResultAsync } from 'stacks:error-handling'
import { notification } from 'stacks:config'

const from = notification.sms?.from
const env = notification.sms?.drivers.nexmo

const provider = new NexmoSmsProvider({
  apiKey: env?.key || '',
  apiSecret: env?.secret || '',
  from: from || '',
})

function send(options: SmsOptions) {
  return ResultAsync.fromPromise(
    provider.sendMessage(options),
    () => new Error(`Failed to send message using provider: ${italic('Nexmo')}`),
  )
}

export { send as Send, send }
