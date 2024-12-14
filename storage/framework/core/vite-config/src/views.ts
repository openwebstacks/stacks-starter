import type { ViteConfig } from '@stacksjs/types'
import { alias } from '@stacksjs/alias'
import { path as p } from '@stacksjs/path'
import { server } from '@stacksjs/server'
import {
  autoImports,
  components,
  cssEngine,
  devtools,
  fonts,
  i18n,
  layouts,
  markdown,
  pwa,
  router,
  stacks,
  uiEngine,
} from '@stacksjs/vite-plugin'
import generateSitemap from 'vite-ssg-sitemap'
import Local from 'vite-plugin-local'


// import { fonts } from './plugin/fonts'

// const isMaintenanceMode = config.app.maintenanceMode
// const maintenancePath = isMaintenanceMode ? '' : './maintenance'

export const viewsConfig: ViteConfig = {
  build: {
    rollupOptions: {
      external: [
        '@iconify/utils',
        '@antfu/install-pkg',
      ],
    },
  },

  root: p.frameworkPath('views/web'),
  publicDir: p.publicPath(),
  envDir: p.projectPath(),
  envPrefix: 'FRONTEND_',
  assetsInclude: [p.publicPath('**'), p.resourcesPath('assets/*'), p.resourcesPath('assets/**/*')],

  optimizeDeps: {
    exclude: ['vue', 'bun'],
  },

  server: server({
    type: 'frontend',
  }),

  resolve: {
    alias,
  },

  plugins: [
    Local({
      domain: 'stacks.localhost', // default: stacks.localhost
      https: true, // Use default SSL config, pass TlsConfig options to customize
      cleanup: {
        hosts: true, // Clean up relating /etc/hosts entry
        certs: false, // Clean up relating SSL certificates
      },
      verbose: false, // Enable detailed logging
    }),

    uiEngine(),

    router({
      type: 'views',
    }),

    layouts({
      extensions: ['stx', 'vue'],
      layoutsDirs: p.layoutsPath('', { relative: true }),
    }),

    autoImports(),
    components(),
    cssEngine(),
    markdown(),
    pwa(),
    devtools(),
    i18n(),
    fonts(),
    stacks(),
  ],

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',

    // crittersOptions: {
    //   reduceInlineStyles: false,
    // },

    includedRoutes(paths) {
      // exclude all the route paths that contains 'errors', 'system-tray', or 'dashboard'
      return paths.filter(i => !i.includes('errors') && !i.includes('system-tray') && !i.includes('dashboard'))
    },

    onFinished() {
      generateSitemap()
    },
  },

  ssr: {
    // TODO: workaround until they support native ESM
    noExternal: ['workbox-window', /vue-i18n/],
  },
}

export default viewsConfig
