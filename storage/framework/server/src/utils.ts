import process from 'node:process'
import { log } from '@stacksjs/cli'
import { app, cloud as cloudConfig } from '@stacksjs/config'
import { frameworkCloudPath, frameworkPath, projectPath } from '@stacksjs/path'
import { hasFiles } from '@stacksjs/storage'
import { $ } from 'bun'

export async function cleanAndCopy(sourcePath: string, targetPath: string) {
  $.cwd(frameworkPath('server'))

  await $`rm -rf ${targetPath}`
  await $`cp -r ${sourcePath} ${targetPath}`
}

export async function useCustomOrDefaultServerConfig() {
  if (hasFiles(projectPath('server'))) {
    $.cwd(frameworkPath('server'))

    // if we have a custom server configuration, use it by copying it to the server directory
    await $`cp -r ../../../server .`

    return log.info('Using custom server configuration')
  }

  log.info('Using default server configuration')
}

export async function buildServer() {
  log.info('Preparing server...')

  await cleanAndCopy(frameworkPath('core'), frameworkCloudPath('core'))
  await cleanAndCopy(projectPath('config'), frameworkCloudPath('config'))
  await cleanAndCopy(projectPath('routes'), frameworkCloudPath('routes'))
  await cleanAndCopy(projectPath('app'), frameworkCloudPath('app'))
  await cleanAndCopy(projectPath('docs'), frameworkCloudPath('docs'))
  await cleanAndCopy(projectPath('storage'), frameworkCloudPath('storage'))

  if (!app.name) {
    log.error('Please provide a name for your app in your config file')
    process.exit(1)
  }

  // TODO: need to build index.ts into index.js and then run that from within the Dockerfile

  // TODO: also allow for a custom container name via a config option
  // this currently does not need to be enabled because our CDK deployment handles the docker build process
  // await runCommand(`docker build --pull -t ${slug(app.name)} .`, {
  //   cwd: frameworkPath('cloud'),
  // })

  log.success('Server ready to be built')
}