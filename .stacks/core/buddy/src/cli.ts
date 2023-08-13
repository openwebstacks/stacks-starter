import process from 'node:process'
import { handleError } from '@stacksjs/error-handling'
import { command } from '@stacksjs/cli'
import { initProject, isProjectInitialized } from '@stacksjs/utils'
import pkg from '../package.json'
import * as cmd from './commands'

// setup global error handlers
process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)

async function main() {
  const cli = command.cli('buddy')
  const { version } = pkg

  // the following commands are not dependent on the project being initialized
  // await installIfVersionMismatch()
  cmd.setup(cli)
  cmd.key(cli)

  // before running any commands, check if the project is already initialized
  if (!await isProjectInitialized())
    await initProject()

  // cmd.preinstall(cli)
  // cmd.prepublish(cli)
  // cmd.upgrade(cli)
  // cmd.generate(cli)
  // cmd.dev(cli)
  // cmd.build(cli)
  // cmd.changelog(cli)
  // cmd.clean(cli)
  // cmd.commit(cli)
  // cmd.deploy(cli)
  // cmd.fresh(cli)
  // cmd.lint(cli)
  // cmd.release(cli)
  // cmd.make(cli)
  // cmd.migrate(cli)
  // cmd.seed(cli)
  // cmd.example(cli)
  // cmd.test(cli)
  // cmd.version(cli)

  cli.help()
  cli.version(version)

  cli.parse()
}

await main()
