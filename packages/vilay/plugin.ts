import type { PluginOption } from 'vite'
import reactplugin from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import relay from 'babel-plugin-relay'
import { transformSync } from '@babel/core'
import deepmerge from 'deepmerge'
import type { Config } from 'virtual:vilay:config'

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P]
}

const relayPlugin: PluginOption = {
  name: 'vilay:relay',
  transform(src, id) {
    let code = src
    if (/.(t|j)sx?/.test(id) && src.includes('graphql`')) {
      const out = transformSync(src, {
        plugins: [[relay, { eagerEsModules: true }]],
        code: true,
      })
      if (!out?.code) throw new Error('Vite Relay transpilation failed')
      code = out.code
    }
    return { code, map: null }
  },
}

const configPlugin = (config: RecursivePartial<Config>): PluginOption => {
  const virtualModuleId = 'virtual:vilay:config'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  const defaultConfig: Config = {}
  const merged = deepmerge(defaultConfig, config)

  return {
    name: 'vilay:config',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(merged)}`
      }
    },
  }
}

const viteConfigPlugin: PluginOption = {
  name: 'vilay:overrideConfig',
  config: (config) => ({
    ...config,
    optimizeDeps: {
      ...config.optimizeDeps,
      include: [...(config.optimizeDeps?.include ?? []), 'react-dom/client', 'react-relay', '@vilay/render'],
    },
  }),
}

const plugin = (config: RecursivePartial<Config> = {}): PluginOption[] => [
  reactplugin(),
  ssr({ pageFiles: { include: ['vilay'] } }),
  relayPlugin,
  configPlugin(config),
  viteConfigPlugin,
]

export default plugin
