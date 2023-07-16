// import { log } from '@stacksjs/logging'
import { ExitCode } from '@stacksjs/types'

// bun build ./src/index.ts --target bun --external vite --external export-size --external @stacksjs/path --external @stacksjs/cli --external @stacksjs/types --external @stacksjs/logging --external @stacksjs/storage --external @stacksjs/utils --external markdown-it --external vue-component-meta --external @stacksjs/strings --external @stacksjs/config --external @stacksjs/error-handling --external @stacksjs/security --outdir ./dist
const result = await Bun.build({
  target: 'bun',
  entrypoints: [
    './src/index.ts',
    './src/build/component-libs.ts',
    './src/build/core.ts',
    './src/build/stacks.ts',
    './src/dev/index.ts',
    './src/dev/components.ts',
    './src/dev/docs.ts',
    './src/generate/index.ts',
    './src/generate/component-meta.ts',
    './src/generate/ide-helpers.ts',
    './src/generate/lib-entries.ts',
    './src/generate/vscode-custom-data.ts',
    './src/generate/vue-compat.ts',
    './src/helpers/index.ts',
    './src/helpers/component-meta.ts',
    './src/helpers/lib-entries.ts',
    './src/helpers/package-json.ts',
    './src/helpers/utils.ts',
    './src/helpers/vscode-custom-data.ts',
    './src/helpers/vue-compat.ts',
    './src/lint/index.ts',
    './src/lint/fix.ts',
    './src/test/coverage.ts',
    './src/test/ui.ts',
    './src/test/unit.ts',
    './src/upgrade/dependencies.ts',
    './src/upgrade/framework.ts',
    './src/upgrade/index.ts',
    './src/index.ts',
    './src/add.ts',
    './src/build.ts',
    './src/bump.ts',
    './src/changelog.ts',
    './src/clean.ts',
    './src/commit.ts',
    './src/copy-types.ts',
    './src/examples.ts',
    './src/fresh.ts',
    './src/key-generate.ts',
    './src/make.ts',
    './src/migrate.ts',
    './src/preinstall.ts',
    './src/prepublish.ts',
    './src/release.ts',
    './src/seed.ts',
    './src/test.ts',
    './src/tinker.ts',
    './src/typecheck.ts',
    './src/types.ts',
    './src/upgrade.ts',
  ],
  external: ['@stacksjs/path', '@stacksjs/cli', '@stacksjs/types', '@stacksjs/logging', '@stacksjs/storage', '@stacksjs/utils', 'markdown-it', 'vue-component-meta', '@stacksjs/strings', '@stacksjs/config', '@stacksjs/error-handling', '@stacksjs/security'],
  outdir: './dist',
  sourcemap: 'external',
  format: 'esm',
})

if (!result.success) {
  console.error("Build failed");

  for (const message of result.logs) {
    console.error(message);
  }

  process.exit(ExitCode.FatalError)
}

console.log("Build succeeded");
