import clsx from 'clsx'
import { HTMLProps } from 'react'

export default function Container({
  className,
  ...props
}: HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={clsx(
        'xl:container relative 2xl:max-w-screen-xl',
        'mx-auto',
        'px-8',
        className
      )}
    />
  )
}
