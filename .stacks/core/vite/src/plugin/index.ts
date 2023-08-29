import type { ConfigEnv, Plugin } from 'vite'
import type { UserConfig } from 'vitepress'

// import { autoImports, components, cssEngine, inspect, layouts, pages, uiEngine } from '@stacksjs/build'
// import type { ConfigEnv, Plugin, PluginOption } from 'vite'

export interface StacksPlugin extends Plugin {
  config: (config: UserConfig, env: ConfigEnv) => UserConfig
}

// export default function framework(config: any) {
//   return <PluginOption> [
//     inspect(config),
//     layouts(config),
//     components(config),
//     pages(config),
//     autoImports(config),
//     uiEngine(config),
//     cssEngine(config),
//   ]
// }
