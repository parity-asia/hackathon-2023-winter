import { breakpoints } from '#/lib/constants/theme'
import tailwindConfig from '#root/tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'
import { useBreakpoint } from 'use-breakpoint'

type BreakpointKeys = typeof breakpoints[number]

const config = resolveConfig(tailwindConfig)
const screens = Object.entries(config.theme.screens).reduce<{
  [key in BreakpointKeys]: number
}>(
  (acc, [key, value]) => {
    const val = value + ''
    acc[key as unknown as BreakpointKeys] = +val.substring(0, val.length - 2)
    return acc
  },
  {
    sm: 0,
    md: 0,
    lg: 0,
    xl: 0,
    '2xl': 0,
  }
)

export default function useTailwindBreakpoint() {
  return useBreakpoint(screens, 'sm').breakpoint
}
