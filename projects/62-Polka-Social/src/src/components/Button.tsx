import { hoverRingClassName } from '#/lib/constants/common-classnames'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { forwardRef, HTMLProps } from 'react'
import Loading from './Loading'

const variants = {
  'filled-brand': clsx(
    hoverRingClassName,
    'bg-brand text-white',
    'enabled:active:brightness-90 enabled:active:bg-brand'
  ),
  'outlined-red': clsx(
    hoverRingClassName,
    'border border-red-500 text-red-500'
  ),
  'outlined-brand': clsx(hoverRingClassName, 'border border-brand text-brand'),
  unstyled: clsx('hover:bg-gray-700', 'active:bg-gray-800'),
  'unstyled-border': clsx(
    'hover:bg-gray-700',
    'active:bg-gray-800',
    'border border-current'
  ),
  nothing: clsx(),
}

const sizes = {
  large: clsx('px-12 py-2'),
  medium: clsx('px-6 py-2'),
  small: clsx('px-3 py-1'),
  'icon-large': clsx('p-3'),
  'icon-medium': clsx('p-2'),
  'icon-small': clsx('p-1'),
  content: clsx(),
}

export interface ButtonProps
  extends Omit<Omit<HTMLProps<HTMLButtonElement>, 'size'>, 'ref'> {
  children?: any
  className?: string
  innerContainerClassName?: string
  size?: keyof typeof sizes
  variant?: keyof typeof variants
  loading?: boolean
  disabled?: boolean
  disabledCursor?: 'not-allowed' | 'loading'
  rounded?: boolean
  noClickEffect?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    innerContainerClassName,
    variant = 'filled-brand',
    size = 'medium',
    type,
    noClickEffect = false,
    loading,
    disabled,
    disabledCursor = 'not-allowed',
    rounded,
    ...buttonProps
  },
  ref
) {
  const classNames = clsx(
    'flex justify-center items-center',
    rounded ? 'rounded-full' : 'rounded-md',
    'cursor-pointer',
    disabledCursor === 'not-allowed' && 'disabled:cursor-not-allowed',
    disabledCursor === 'loading' && 'disabled:cursor-wait',
    'transition-colors ease-out',
    !noClickEffect && 'enabled:active:translate-y-px',
    'disabled:opacity-75',
    loading && 'overflow-hidden',
    sizes[size],
    variants[variant],
    className
  )

  return (
    <button
      type={type as any}
      {...buttonProps}
      disabled={disabled || loading}
      ref={ref}
      className={classNames}
    >
      <div className='w-full h-full relative'>
        <AnimatePresence key={loading ? 'loading' : 'children'}>
          {loading && (
            <motion.div
              animate={{ x: '-50%', y: '-50%', opacity: 1 }}
              initial={{ x: '100%', y: '-50%', opacity: 1 }}
              exit={{ x: '100%', y: '-50%', opacity: 1 }}
              className={clsx(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
              )}
            >
              <Loading className={clsx('text-2xl')} />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          animate={{ x: loading ? '-150%' : '0', opacity: loading ? 0 : 1 }}
          className={clsx(
            'flex justify-center items-center',
            'w-full h-full',
            innerContainerClassName
          )}
        >
          {children}
        </motion.div>
      </div>
    </button>
  )
})
export default Button
