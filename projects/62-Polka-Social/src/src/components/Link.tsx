import clsx from 'clsx'
import RouterLink from 'next/link'
import { forwardRef, HTMLProps } from 'react'

const variants = {
  default: clsx(),
  primary: clsx(
    'text-blue-400',
    'hover:text-blue-300 hover:underline focus:text-blue-300 focus:underline',
    'active:text-blue-500 visited:text-purple-400'
  ),
}

export interface LinkProps extends HTMLProps<HTMLAnchorElement> {
  ref?: any
  variant?: keyof typeof variants
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, href = '', variant = 'default', ...anchorProps },
  ref
) {
  const classes = clsx(
    'relative cursor-pointer',
    'transition duration-150',
    variants[variant],
    className
  )
  return href ? (
    <RouterLink href={href} passHref>
      <a {...anchorProps} ref={ref} className={classes} />
    </RouterLink>
  ) : (
    <span {...anchorProps} ref={ref} className={classes} />
  )
})
export default Link
