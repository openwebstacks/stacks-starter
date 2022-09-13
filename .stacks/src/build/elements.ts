import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'pathe'
import type { BuildOptions as ViteBuildOptions } from 'vite'
import type { ViteConfig } from '../types'
import alias from '../core/alias'
import { atomicCssEngine, autoImports, components, defineConfig, envPrefix, i18n, inspect, uiEngine } from '../core'
import { webComponentLibraryName } from '../../../config/library'

const isWebComponent = true

const _dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(import.meta.url))

const config: ViteConfig = {
  root: resolve(_dirname, '../../../components'),

  envPrefix,

  server: {
    port: 3333,
    open: true,
  },

  resolve: {
    dedupe: ['vue'],
    alias,
  },

  optimizeDeps: {
    exclude: ['vue', '@vueuse/core'],
  },

  plugins: [
    inspect,

    uiEngine(isWebComponent),

    atomicCssEngine(isWebComponent),

    autoImports,

    components,

    i18n,
  ],

  build: webComponentsBuildOptions(),
}

export function webComponentsBuildOptions(): ViteBuildOptions {
  return {
    outDir: resolve(_dirname, '../../elements/dist'),

    emptyOutDir: true,

    lib: {
      entry: resolve(_dirname, '../components/index.ts'),
      name: webComponentLibraryName,
      formats: ['cjs', 'es'],
      fileName: (format: string) => {
        if (format === 'es')
          return 'index.js'

        if (format === 'cjs')
          return 'index.cjs'

        return 'index.?.js'
      },
    },
  }
}

export default defineConfig(({ command }) => {
  if (command === 'serve')
    return config

  // command === 'build'
  return config
})
