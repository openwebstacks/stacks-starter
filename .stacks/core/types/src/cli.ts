/**
 * The parsed command-line arguments
 */

export type { Subprocess, SyncSubprocess } from 'node:bun'

export interface OutroOptions extends CliOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
  startTime?: number
  useSeconds?: boolean
  isError?: boolean
  quiet?: boolean
  successMessage?: string
}

export interface IntroOptions {
  /**
   * @default true
   */
  showPerformance?: boolean

  /**
   * @default false
   */
  quiet: boolean
}

// type SpinnerOptions = Ora

export type CliOptionsKeys = keyof CliOptions

/**
 * The options to pass to the CLI.
 */
export interface CliOptions {
  /**
   * **Verbose Output**
   *
   * When your application is in "verbose"-mode, a different level of,
   * information like useful outputs for debugging reasons, will be
   * shown. When disabled, it defaults to the "normal experience."
   *
   * @default false
   */
  verbose?: boolean

  /**
   * **Current Work Directory**
  *
  * Based on the `cwd` value, that's where the command...
  *
  * @default projectPath()
  */
  cwd?: string

  stdout?: 'inherit' | 'pipe' | 'ignore' | number
}

export type CliConfig = CliOptions

// export type { Ora as SpinnerOptions } from 'ora'

// the `domains` option is only available for the `deploy` command
// the `count` option is only available for the `seed` command
export type ActionOption = 'types' | 'domains' | 'count'

/**
 * The options to pass to the Action.
 */
export type ActionOptions = {
  [key in ActionOption]?: boolean | number;
} & CliOptions

export type BuildOption = 'components' | 'vueComponents' | 'webComponents' | 'elements' | 'functions' | 'docs' | 'pages' | 'stacks' | 'all'
export type BuildOptions = {
  [key in BuildOption]: boolean;
} & CliOptions

export type AddOption = 'table' | 'calendar' | 'all'
export type AddOptions = {
  [key in AddOption]?: boolean;
} & CliOptions

export type CreateStringOption = 'name'
export type CreateBooleanOption = 'ui' | 'components' | 'web-components' | 'vue' | 'pages' | 'functions' | 'api' | 'database'
export type CreateOptions = {
  [key in CreateBooleanOption]: boolean
} & {
  [key in CreateStringOption]: string
} & CliOptions

export type DevOption = 'components' | 'docs' | 'pages' | 'api' | 'desktop' | 'all'
export type DevOptions = {
  [key in DevOption]: boolean;
} & CliOptions

export type GeneratorOption = 'types' | 'entries' | 'webTypes' | 'customData' | 'ideHelpers' | 'vueCompatibility' | 'componentMeta'
export type GeneratorOptions = {
  [key in GeneratorOption]?: boolean;
} & CliOptions

export type LintOption = 'fix'
export type LintOptions = {
  [key in LintOption]: boolean;
} & CliOptions

export type MakeStringOption = 'name' | 'chat' | 'sms' | 'env'
export type MakeBooleanOption = 'component' | 'page' | 'function' | 'language' | 'database' | 'migration' | 'factory' | 'notification' | 'stack'
export type MakeOptions = {
  [key in MakeBooleanOption]: boolean
} & {
  [key in MakeStringOption]: string
} & CliOptions

export type UpgradeBoolean = 'framework' | 'dependencies' | 'packageManager' | 'node' | 'all' | 'force'
export type UpgradeString = 'version'

export type UpgradeOptions = {
  [key in UpgradeBoolean]: boolean;
} & {
  [key in UpgradeString]: string;
} & CliOptions

export type ExamplesString = 'version'
export type ExamplesBoolean = 'components' | 'vue' | 'webComponents' | 'elements' | 'all' | 'force'
export type ExamplesOption = ExamplesString & ExamplesBoolean | void
export type ExamplesOptions = {
  [key in ExamplesString]: string;
} & {
  [key in ExamplesBoolean]: boolean;
} & CliOptions
export type TestOptions = CliOptions & {
  showReport?: boolean
}

export interface CleanOptions extends CliOptions { }
export interface CommitOptions extends CliOptions { }
export interface KeyOptions extends CliOptions { }
export interface FreshOptions extends CliOptions { }
export interface InspireOptions extends CliOptions { }
export interface ReleaseOptions extends CliOptions { }
export interface PreinstallOptions extends CliOptions { }
export interface PrepublishOptions extends CliOptions { }
export interface TinkerOptions extends CliOptions { }
export interface TypesOptions extends CliOptions { }

export type LibEntryType = 'vue-components' | 'web-components' | 'functions' | 'all'

/**
 * The available npm scripts within the Stacks toolkit.
 */
export enum NpmScript {
  Build = 'build',
  BuildComponents = 'vite build --config ./core/vite/src/vue-components.ts',
  BuildWebComponents = 'build:web-components',
  BuildFunctions = 'build:functions',
  BuildDocs = 'build:docs',
  BuildStacks = 'build:stacks',
  Clean = 'rimraf bun.lockb node_modules/ .stacks/**/dist',
  Dev = 'dev',
  DevDocs = 'bunx vitepress dev ./docs/src',
  DevDesktop = 'dev:desktop',
  DevPages = 'dev:pages',
  DevFunctions = 'dev:functions',
  Fresh = 'fresh',
  Lint = 'eslint .',
  LintFix = 'eslint . --fix',
  LintPackageJson = 'bunx publint',
  MakeStack = 'make:stack',
  Test = 'bun test',
  TestUnit = 'bun test 2',
  TestFeature = 'playwright test --config playwright.config.ts',
  TestUi = 'bun test 3',
  TestCoverage = 'bun test 4',
  TestTypes = 'vue-tsx bun --bun tsc --noEmit',
  Generate = 'generate',
  GenerateTypes = 'generate:types',
  GenerateEntries = 'generate:entries',
  GenerateVueCompat = 'generate:vue-compatibility',
  GenerateWebTypes = 'generate:web-types',
  GenerateVsCodeCustomData = 'generate:vscode-custom-data',
  GenerateIdeHelpers = 'generate:ide-helpers',
  GenerateComponentMeta = 'generate:component-meta',
  Release = 'release',
  Commit = 'commit',
  Example = 'example',
  ExampleVue = 'example:vue',
  ExampleWebComponents = 'example:web-components',
  KeyGenerate = 'key:generate',
  TypesFix = 'types:fix',
  TypesGenerate = 'types:generate',
  Preinstall = 'preinstall',
  Prepublish = 'prepublish',
  UpgradeBun = './.stacks/scripts/setup.sh +bun.sh',
  UpgradeDependencies = 'pnpm up',
}

export enum Action {
  Bump = 'bump',
  BuildStacks = 'build/stacks',
  BuildComponentLibs = 'build/component-libs',
  BuildVueComponentLib = 'build-vue-component-lib',
  BuildWebComponentLib = 'build-web-component-lib',
  BuildCli = 'build-cli',
  BuildCore = 'build/core',
  BuildDocs = 'build-docs',
  BuildFunctionLib = 'build-function-lib',
  Changelog = 'changelog',
  Clean = 'clean',
  DevComponents = 'dev/components',
  Dev = 'dev/index',
  DevDocs = 'dev/docs',
  Deploy = 'deploy/index',
  Fresh = 'fresh',
  GenerateLibraryEntries = 'generate/lib-entries',
  Inspire = 'inspire',
  KeyGenerate = 'key-generate',
  MakeNotification = 'make-notification',
  Migrate = 'migrate',
  Seed = 'seed',
  Lint = 'lint/index',
  LintFix = 'lint/fix',
  Prepublish = 'prepublish',
  Release = 'release', // ✅
  ShowFeatureTestReport = 'show-feature-test-report',
  Test = 'test',
  TestUi = 'test-ui',
  TestUnit = 'test-unit',
  TestFeature = 'test-feature',
  TestCoverage = 'test-coverage',
  Tinker = 'tinker',
  Typecheck = 'typecheck',
  Upgrade = 'upgrade/index',
  UpgradeBun = 'upgrade/bun',
}

export type { CAC as CLI } from 'cac'
