import process from 'node:process'
import { log } from '@stacksjs/logging'
import { projectPath } from '@stacksjs/path'
import type { CLI, CliOptions } from '@stacksjs/types'
import { $ } from 'bun'

export function outdated(buddy: CLI) {
  const descriptions = {
    outdated: 'List all the outdated project dependencies',
    project: 'Target a specific project',
    verbose: 'Enable verbose output',
  }

  buddy
    .command('outdated', descriptions.outdated)
    .option('-p, --project [project]', descriptions.project, { default: false })
    .option('--verbose', descriptions.verbose, { default: false })
    .action(async (options: CliOptions) => {
      log.debug('Running `buddy outdated` ...')

      $.cwd(projectPath())

      const response = await $`bun outdated`.text()
      console.log(response)
    })

  buddy.on('outdated:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', buddy.args.join(' '))
    process.exit(1)
  })
}