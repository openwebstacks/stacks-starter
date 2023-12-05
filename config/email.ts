import { env } from 'stacks:env'
import type { EmailConfig } from 'stacks:types'

/**
 * **Email Configuration**
 *
 * This configuration defines all of your email options. Because Stacks is fully-typed, you
 * may hover any of the options below and the definitions will be provided. In case you
 * have any questions, feel free to reach out via Discord or GitHub Discussions.
 */
export default {
  from: {
    name: env.MAIL_FROM_NAME || 'Stacks',
    address: env.MAIL_FROM_ADDRESS || 'no-reply@stacksjs.org',
  },

  mailboxes: ['chris@stacksjs.org'],

  server: {
    scan: true, // scans for spam and viruses
  },
} satisfies EmailConfig
