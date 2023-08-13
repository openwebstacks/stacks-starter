import { log, runCommand } from '@stacksjs/cli'

const result = await runCommand('bun build ./src/index.ts --outdir dist --external eslint-config-stacksjs --format esm --target bun', {
  cwd: import.meta.dir,
})

if (result.isErr())
  log.error(result.error)

// import { defineBuildConfig } from 'unbuild'

// export default defineBuildConfig({
//   entries: [
//     'src/index',
//   ],
//   declaration: true,
//   clean: true,
//   rollup: {
//     emitCJS: true,
//   },
// })
