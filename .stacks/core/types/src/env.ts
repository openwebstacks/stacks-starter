import { Infer, validate } from '@stacksjs/validation'
import type { VineBoolean, VineEnum, VineNumber, VineString } from '@stacksjs/validation'
import env from '~/config/env'
import type { EnvKey } from '~/storage/framework/stacks/env'

export const envSchema = validate.object(env)
export type Env = Infer<typeof envSchema>

export type EnvValue = VineString | VineNumber | VineBoolean | VineEnum<readonly string[]>
export type EnvOptions = Env
export type EnvConfig = Partial<Record<EnvKey, EnvValue>>

export interface FrontendEnv {
  FRONTEND_APP_ENV: 'local' | 'development' | 'staging' | 'production'
  FRONTEND_APP_URL: string
}
export type FrontendEnvKeys = keyof FrontendEnv
