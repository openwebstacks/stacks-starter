import { NpmScript } from '@stacksjs/enums'
import { runCommand } from '@stacksjs/cli'
import { frameworkPath } from '@stacksjs/path'

await runCommand(NpmScript.TestUnit, { verbose: true, cwd: frameworkPath() })
