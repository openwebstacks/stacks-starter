import { log } from '@stacksjs/cli'
import { Middleware } from '@stacksjs/router'

export default new Middleware({
  name: 'API Authentication',
  priority: 1,
  async handle() {
    log.info('success')
  },
})