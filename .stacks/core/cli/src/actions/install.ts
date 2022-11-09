import { installPackage as installPkg } from '@antfu/install-pkg'
import { runCommand } from './run'

/**
 * Install an npm package.
 *
 * @param pkg - The package name to install.
 * @returns The result of the install.
 */
export async function installPackage(pkg: string) {
  return await installPkg(pkg, { silent: true })
}

/**
 * Install a Stack into your project.
 *
 * @param pkg - The Stack name to install.
 * @returns The result of the install.
 */
export async function installStack(name: string) {
  return runCommand(`pnpm install @stacksjs/${name}`)
}
