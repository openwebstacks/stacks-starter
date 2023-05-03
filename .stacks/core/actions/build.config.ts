import { defineBuildConfig } from '@stacksjs/development'

// eslint-disable-next-line no-console
console.log('Building core... ?')

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: './src/',
      outDir: './dist/',
    },
  ],

  declaration: true,
})
