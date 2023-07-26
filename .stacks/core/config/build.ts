import { log, runCommand } from '@stacksjs/cli'

const result = await runCommand('bun build ./src/index.ts --outdir dist --format esm --external vite --external @stacksjs/validation --external @stacksjs/utils', {
  cwd: import.meta.dir,
})

if (result.isErr())
  log.error(result.error)

else
  log.success('Build complete')
