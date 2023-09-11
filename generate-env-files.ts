import { storage } from '@stacksjs/storage'
import { envKeys } from '~/storage/framework/stacks/env'

// generate ./storage/framework/types/env.d.ts file from .env
const envTypes = `
// This file is auto-generated by Stacks. Do not edit this file manually.
// If you want to change the environment variables, please edit the .env file.
//
// For more information, please visit: https://stacksjs.com/docs

declare module 'bun' {
  namespace env {
    ${envKeys.map((key) => {
      const value = Bun.env[key]
      let type = 'string'
      if (value === 'true' || value === 'false')
        type = 'boolean'
      else if (!Number.isNaN(Number(value)))
        type = 'number'

      return `const ${key}: ${type}`
    }).join('\n    ')}
  }
}
`

await storage.writeFile('framework/types/env.d.ts', envTypes)

// generate ./storage/framework/stacks/env.ts file based on Bun.env
const env = `
// This file is auto-generated by Stacks. Do not edit this file manually.
// If you want to change the environment variables, please edit the .env file.
//
// For more information, please visit: https://stacksjs.com/docs

export const envKeys = [
  ${envKeys.map(key => `'${key}'`).join(',\n  ')}
] as const

export type EnvKey = typeof envKeys[number]
`

await storage.writeFile('framework/stacks/env.ts', env)
