import { runCommand } from '@stacksjs/cli'
import { handleError } from '@stacksjs/error-handling'

const result = await runCommand('bun build ./src/index.ts --outdir dist --format esm --external unplugin-auto-import/vite --external defu --external @stacksjs/types --external @stacksjs/path --external vite --external unplugin-vue-components/vite --external unocss/vite --external @stacksjs/config --external @stacksjs/cli --external vitepress --external vite-plugin-inspect --external vite-plugin-vue-layouts --external unplugin-vue-router --external unplugin-vue-router/vite --external vite-plugin-pwa --external @vitejs/plugin-vue --external @stacksjs/server --external @stacksjs/alias --target bun', {
  cwd: import.meta.dir,
})

if (result.isErr())
  handleError(result.error)
