import { Dispatch, SetStateAction } from 'react'

export type StateContext<T> = [T, Dispatch<SetStateAction<T>>]
export const defaultContextValue = <T>(defaultValue: T): [T, () => void] => [
  defaultValue,
  () => {
    throw new Error('Context Provider not set')
  },
]
