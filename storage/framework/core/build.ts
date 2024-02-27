import { path as p } from '@stacksjs/path'
import { fs, glob } from '@stacksjs/storage'
import { dim, log, runCommand } from '@stacksjs/cli'

const dirs = await glob(p.resolve('./', '*'), { onlyDirectories: true })
dirs.sort((a, b) => a.localeCompare(b))

const startTime = Date.now()

for (const dir of dirs) {
  // bun-create has only nested dirs, no need to build
  if (dir.includes('bun-create'))
    continue

  const pkgName = `@stacksjs/${p.basename(dir)}`
  log.info(`Building ${pkgName}...`)
  const startTime = Date.now()

  // rm the dist folder before building
  await $`rm -rf ${p.resolve(dir, 'dist')}`

  log.debug(`Cleaned dist folder`)

  // Run the build command in each directory
  await runCommand('bun run build', {
    cwd: dir,
  })

  const endTime = Date.now()
  const timeTaken = endTime - startTime

  // loop over all the files in the dist directory and log them and their size
  const files = await glob(p.resolve(dir, 'dist', '*'))
  for (const file of files) {
    const stats = await fs.stat(file)

    let sizeStr
    if (stats.size < 1024 * 1024) {
      const sizeInKb = stats.size / 1024
      sizeStr = `${sizeInKb.toFixed(2)}kb`
    }
    else {
      const sizeInMb = stats.size / 1024 / 1024
      sizeStr = `${sizeInMb.toFixed(2)}mb`
    }

    const relativeFilePath = p.relative(dir, file).replace('dist/', '')
    // eslint-disable-next-line no-console
    console.log(`${dim(`[${sizeStr}]`)} ${dim('dist/')}${relativeFilePath}`)
  }

  log.success(`${dim(`[${timeTaken}ms]`)} Built ${pkgName}`)
}

const endTime = Date.now()
const timeTaken = endTime - startTime

log.success(`Build took ${timeTaken}ms`)