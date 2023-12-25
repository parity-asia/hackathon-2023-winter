import clsx from 'clsx'

export const hoverRingClassName = clsx(
  'ring-offset-bg-0',
  'hover:ring-2 hover:ring-offset-2',
  'focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none',
  'disabled:hover:ring-0 disabled:ring-offset-0'
)
