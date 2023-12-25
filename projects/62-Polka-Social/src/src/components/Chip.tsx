import clsx from 'clsx'
import { HTMLProps } from 'react'

interface Props extends HTMLProps<HTMLDivElement> {}

export default function Chip({ className, children, ...props }: Props) {
  return (
    <div className={clsx('flex', className)} {...props}>
      <div
        className={clsx(
          'px-2 py-0.5',
          'rounded-md',
          'bg-blue-200 text-blue-700',
          'hover:bg-blue-300 focus:bg-blue-300',
          'transition duration-100',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
