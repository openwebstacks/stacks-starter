/**
 * The available npm scripts within the Stacks toolkit.
 */
export enum NpmScript {
  Build = 'build',
  BuildComponents = 'vite build --config ./src/vite-config/src/components.ts',
  BuildWebComponents = 'build:web-components',
  BuildFunctions = 'build:functions',
  BuildDocs = 'build:docs',
  BuildStacks = 'build:stacks',
  Clean = 'bunx --bun rimraf bun.lockb node_modules/ stacks/**/dist',
  Dev = 'dev',
  DevApi = 'dev:api',
  DevDocs = 'dev:docs',
  DevDesktop = 'dev:desktop',
  DevFunctions = 'dev:functions',
  Fresh = 'fresh',
  Lint = 'bunx --bun eslint .',
  LintFix = 'bunx --bun eslint . --fix',
  LintPackageJson = 'publint',
  MakeStack = 'make:stack',
  Test = 'bun test ./tests/feature/** ./tests/unit/**',
  TestUnit = 'bun test ./tests/unit/**',
  TestFeature = 'bun test ./tests/feature/**',
  TestUi = 'bun test 3',
  TestTypes = 'vue-tsc --noEmit',
  Generate = 'generate',
  GenerateTypes = 'generate:types',
  GenerateEntries = 'generate:entries',
  GenerateWebTypes = 'generate:web-types',
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
  UpgradeBun = './storage/framework/scripts/setup.sh +bun.sh',
  UpgradeDependencies = 'pkgx --update && bun install',
}

export enum Action {
  Bump = 'bump',
  BuildViews = 'build/views',
  BuildStacks = 'build/stacks',
  BuildComponentLibs = 'build/component-libs',
  BuildVueComponentLib = 'build-vue-component-lib',
  BuildWebComponentLib = 'build-web-component-lib',
  BuildFunctionLib = 'build-function-lib',
  BuildCli = 'build/cli',
  BuildCore = 'build/core',
  BuildDesktop = 'build/desktop',
  BuildDocs = 'build/docs',
  BuildServer = 'build/server',
  Changelog = 'changelog',
  CheckPorts = 'check/ports',
  Clean = 'clean',
  DevComponents = 'dev/components',
  DevDashboard = 'dev/dashboard',
  DevSystemTray = 'dev/system-tray',
  Dev = 'dev/views',
  DevApi = 'dev/api',
  DevDesktop = 'dev/desktop',
  DevDocs = 'dev/docs',
  Deploy = 'deploy/index',
  DomainsAdd = 'domains/add',
  DomainsPurchase = 'domains/purchase',
  DomainsRemove = 'domains/remove',
  FindProjects = 'find-projects',
  Fresh = 'fresh',
  GenerateLibraryEntries = 'generate/lib-entries',
  Inspire = 'inspire',
  KeyGenerate = 'key-generate',
  MakeNotification = 'make-notification',
  Migrate = 'migrate/database',
  MigrateFresh = 'migrate/fresh',
  MigrateDns = 'migrate/dns',
  Seed = 'database/seed',
  Lint = 'lint/index',
  LintFix = 'lint/fix',
  Prepublish = 'prepublish',
  QueueTable = 'queue/table',
  QueueWork = 'queue/work',
  Release = 'release', // ✅
  RouteList = 'route/list', // ✅
  StripeSetup = 'saas/setup',
  SearchEngineImport = 'search/import',
  SearchEngineFlush = 'search/flush',
  SearchEngineListSettings = 'search/settings-list',
  SearchEnginePushSettings = 'search/settings',
  ScheduleRun = 'schedule/run',
  Test = 'test/index',
  TestUi = 'test/ui',
  TestUnit = 'test/unit',
  TestFeature = 'test/feature',
  Typecheck = 'typecheck',
  Upgrade = 'upgrade/index',
  UpgradeBinary = 'upgrade/binary', // the `stacks` binary
  UpgradeBun = 'upgrade/bun',
  UpgradeDeps = 'upgrade/dependencies',
  UpgradeShell = 'upgrade/shell',
}
