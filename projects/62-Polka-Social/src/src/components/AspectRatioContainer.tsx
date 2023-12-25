import clsx from 'clsx'
import React, { HTMLProps } from 'react'

const aspectRatios = {
  '16:9': clsx('pt-[56.25%]'),
  '3:4': clsx('pt-[133.33%]'),
  '4:3': clsx('pt-[80%]'),
  '5:3': clsx('pt-[60%]'),
  '3:2': clsx('pt-[66.67%]'),
  '1:1': clsx('pt-[100%]'),
}

export interface AspectRatioContainerProps extends HTMLProps<HTMLDivElement> {
  aspectRatio: keyof typeof aspectRatios
}

const AspectRatioContainer = React.forwardRef<
  HTMLDivElement,
  AspectRatioContainerProps
>(function AspectRatioContainer(
  { aspectRatio, className, children, ...props },
  ref
) {
  return (
    <div
      {...props}
      ref={ref}
      className={clsx(
        'w-full relative overflow-hidden',
        aspectRatios[aspectRatio],
        className
      )}
    >
      <div className={clsx('w-full h-full', 'top-0 left-0', 'absolute')}>
        {children}
      </div>
    </div>
  )
})

export default AspectRatioContainer
