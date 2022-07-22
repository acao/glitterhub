import type { UserConfig } from 'vite'
import vilay from 'vilay/plugin'
import { presetUno, presetTypography } from 'unocss'
import unocss from 'unocss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: UserConfig = {
  plugins: [
    tsconfigPaths(),
    vilay(),
    unocss({ presets: [presetUno(), presetTypography()] }),
  ]
}

export default config
