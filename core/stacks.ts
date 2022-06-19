import { resolve } from 'path'
import type { BuildOptions, UserConfig } from 'vite'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VUE_PACKAGE_NAME } from '../config/env'
import { alias } from '../config/alias'

function buildVueComponents(entry?: string): BuildOptions {
  if (!entry)
    entry = resolve(__dirname, '../packages/components/index.ts')

  // eslint-disable-next-line no-console
  console.log('buildVueComponents with entry of:', entry)

  return {
    lib: {
      entry,
      name: VUE_PACKAGE_NAME,
      formats: ['cjs', 'es'],
      fileName: (format: string) => {
        if (format === 'es')
          return `${VUE_PACKAGE_NAME}.mjs`

        if (format === 'cjs')
          return `${VUE_PACKAGE_NAME}.cjs`

        // if (format === 'iife')
        //     return `${VUE_PACKAGE_NAME}.global.js`

        return `${VUE_PACKAGE_NAME}.?.js`
      },
    },

    rollupOptions: {
      external: ['vue', '@vueuse/core'],
      output: {
        // exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },

    // sourcemap: true,
    // minify: false,
  }
}

// function buildWebComponents(entry: string): BuildOptions {
//   return {
//     lib: {
//       entry: resolve(__dirname, entry),
//       name: WEB_COMPONENTS_PACKAGE_NAME,
//       formats: ['cjs', 'es'],
//       fileName: (format: string) => {
//         if (format === 'es')
//           return `${WEB_COMPONENTS_PACKAGE_NAME}.mjs`

//         if (format === 'cjs')
//           return `${WEB_COMPONENTS_PACKAGE_NAME}.cjs`

//         // if (format === 'iife')
//         //   return 'hello-world-elements.global.js'

//         return `${WEB_COMPONENTS_PACKAGE_NAME}.?.js`
//       },
//       // sourcemap: true,
//       // minify: false,;
//     },
//   }
// }

const Stacks = (configFile = './unocss.config.ts') => [
  Vue({
    template: {
      compilerOptions: {
        // treat all tags with a dash as custom elements
        isCustomElement: tag => tag.includes('hello-world'),
      },
    },
  }),

  Inspect(),

  Unocss({
    configFile: resolve(__dirname, configFile),
    mode: 'vue-scoped', // or 'shadow-dom'
  }),

  // https://github.com/antfu/unplugin-auto-import
  AutoImport({
    imports: ['vue', '@vueuse/core', {
      '@ow3/hello-world-composable': ['count', 'increment', 'isDark', 'toggleDark'],
    }],
    dts: resolve(__dirname, './types/auto-imports.d.ts'),
    eslintrc: {
      enabled: true,
      filepath: resolve(__dirname, './.eslintrc-auto-import.json'),
    },
  }),

  // https://github.com/antfu/unplugin-vue-components
  Components({
    dirs: ['../../packages/components'],
    extensions: ['vue'],
    dts: resolve(__dirname, './types/components.d.ts'),
  }),
]

export {
  buildVueComponents,
  // buildWebComponents,
  Stacks,
  alias,
  resolve,
  defineConfig,
  UserConfig,
}
