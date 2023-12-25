import clsx from 'clsx'
import { forwardRef, HTMLProps } from 'react'

export interface CardProps extends HTMLProps<HTMLDivElement> {}

const Card = forwardRef(function Card({ className, ...props }: CardProps, ref) {
  return (
    <div
      className={clsx('rounded-md', 'p-2', className)}
      {...props}
      ref={ref as any}
    />
  )
})

export default Card
