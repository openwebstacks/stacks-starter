import consola from 'consola'
import { NpmScript } from '../../../core/types'
import { runNpmScript } from './run-npm-script'

export async function lint(debug: 'ignore' | 'inherit' = 'inherit') {
  consola.info('Linting your codebase...')
  await runNpmScript(NpmScript.Lint, debug)
  consola.success('Successfully linted your codebase.')
}

export async function lintFix(debug: 'ignore' | 'inherit' = 'inherit') {
  if (debug !== 'ignore')
    consola.info('Fixing lint errors...')

  await runNpmScript(NpmScript.LintFix, debug)

  if (debug !== 'ignore')
    consola.success('Fixed lint errors.')
}
