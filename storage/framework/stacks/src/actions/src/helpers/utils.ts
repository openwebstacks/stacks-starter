import * as storage from 'src/storage/src'
import { italic, runCommand, runCommands, underline } from '@stacksjs/cli'
import { log } from '@stacksjs/logging'
import * as p from 'src/path/src'
import type { ActionOptions, StacksError, Subprocess } from 'src/types/src'
import { type Result, err, handleError } from '@stacksjs/error-handling'

function parseOptions(options?: ActionOptions) {
  if (!options)
    return ''

  const parsedOptions = Object.entries(options).map(([key, value]) => {
    if (key.length === 1)
      return `-${key}=${value}`

    if (typeof value === 'boolean' && value) // if the value is `true`, just return the key
      return `--${key}`

    return `--${key}=${typeof value === 'string' && value.includes(' ') ? `"${value}"` : value}`
  })

  // filter out undefined values and join the array
  return parsedOptions.filter(Boolean).join(' ').replace('----=', '')
}

// export type ActionResult = CommandResult

/**
 * Run an Action the Stacks way.
 *
 * @param action The action to invoke.
 * @param options The options to pass to the command.
 * @returns The result of the command.
 */
export async function runAction(action: string, options?: ActionOptions): Promise<Result<Subprocess, StacksError>> {
  if (!hasAction(action))
    return err(handleError(`The specified action "${action}" does not exist`))

  const opts = parseOptions(options)
  const path = p.relativeActionsPath(`${action}.ts`)
  const cmd = `bun --bun ${`${path} ${opts}`}`
  const o = {
    cwd: options?.cwd || p.projectPath(),
    ...options,
  }

  if (options?.verbose) {
    log.debug('Running cmd:', underline(italic(cmd)))
    log.debug('Running action:', underline(italic(`./actions/${action}.ts`)))
    log.debug('with action options of:', o)
  }

  return await runCommand(cmd, o)
}

/**
 * Run Actions the Stacks way.
 *
 * @param actions The actions to invoke.
 * @param options The options to pass to the command.
 * @returns The result of the command.
 */
export async function runActions(actions: string[], options?: ActionOptions) {
  if (!actions.length)
    return err('No actions were specified')

  for (const action of actions) {
    if (!hasAction(action))
      return err(`The specified action "${action}" does not exist`)
  }

  const commands = actions.map(action => `bun --bun ${p.relativeActionsPath(`${action}.ts`)}`)

  return await runCommands(commands, options)
}

export function hasAction(action: string) {
  if (storage.isFile(p.functionsPath(`actions/${action}.ts`)))
    return true

  return storage.isFile(p.actionsPath(`${action}.ts`))
}
