import { TargetAndTransition } from 'framer-motion'

export type TransitionVariants = { [key: string]: TargetAndTransition }
export type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (
  ...a: Parameters<T>
) => TNewReturn
