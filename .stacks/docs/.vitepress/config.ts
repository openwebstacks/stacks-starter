import { default as userConfig} from '../../../config/docs'
import { path as p } from '@stacksjs/path'
import { server } from '@stacksjs/server'
import { alias } from '@stacksjs/alias'
import { kolorist as c } from '@stacksjs/cli'
import { version } from '../../package.json'
// import { frameworkDefaults } from '../../core/docs/src'
import type { UserConfig } from 'vitepress'

// this is the resolved user config
export default {
  // ...frameworkDefaults,
  base: '/docs/',
  cleanUrls: true,
  srcDir: p.projectPath('docs'),
  outDir: p.projectStoragePath('framework/docs'),
  cacheDir: p.projectStoragePath('framework/cache/docs'),
  assetsDir: p.resourcesPath('assets'),
  // @ts-expect-error
  lastUpdated: true,

  // sitemap: {
  //   hostname: 'stacks.test',
  // },

  vite: {
    envDir: p.projectPath(),
    envPrefix: 'FRONTEND_',

    server: server({
      type: 'docs',
    }),

    resolve: {
      alias,
    },

    plugins: [
      {
        name: 'stacks-plugin',
        configureServer(server) {
          // const base = server.config.base || '/'
          // const _print = server.printUrls
          server.printUrls = () => { // eslint-disable-next-line no-console
            console.log(`  ${c.blue(c.bold('STACKS'))} ${c.blue(version)}`)
            // eslint-disable-next-line no-console
            // console.log(`  ${c.green('➜')}  ${c.bold('Docs')}: ${c.green('http://stacks.test:3333/docs')}`)
            console.log(`  ${c.green('➜')}  ${c.bold('Docs')}: ${c.green('https://stacks.localhost/docs')}`)
          }
        },
      },
    ],
  },

  ...userConfig,
} satisfies UserConfig
