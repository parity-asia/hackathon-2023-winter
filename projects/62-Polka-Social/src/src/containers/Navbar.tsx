import Button from '#/components/Button'
import Container from '#/components/Container'
import Link from '#/components/Link'
import Brand from '#/containers/Brand'
import ConnectWalletButton from '#/containers/ConnectWalletButton'
import { NORMAL_TRANSITION } from '#/lib/constants/transition'
import clsx from 'clsx'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Props extends HTMLMotionProps<'nav'> {
  height: string | number
}

export default function Navbar({ height, className, style, ...props }: Props) {
  const lastScrollUp = useRef(0)
  const [isScrollingUp, setIsScrollingUp] = useState(true)
  const isShowingNav = isScrollingUp || window.scrollY === 0

  useEffect(() => {
    const scrollListener = () => {
      setIsScrollingUp(window.scrollY < lastScrollUp.current)
      lastScrollUp.current = window.scrollY
    }
    window.addEventListener('scroll', scrollListener)
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [])

  return (
    <motion.nav
      className={clsx(
        isShowingNav ? 'py-4' : '',
        'fixed w-full top-0 z-30',
        'backdrop-blur-sm',
        className
      )}
      style={{ ...style }}
      animate={{ height: isShowingNav ? height : 0 }}
      {...props}
    >
      <Container>
        <AnimatePresence initial={false}>
          {isShowingNav && (
            <motion.div
              className={clsx('flex items-center justify-between')}
              transition={NORMAL_TRANSITION}
              initial={{ opacity: 0, y: -25 }}
              exit={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href='/'>
                <Brand className='text-lg' />
              </Link>
              <div className={clsx('flex items-center space-x-6')}>
                <Link href='/ask'>
                  <Button
                    variant='outlined-brand'
                    className={clsx('text-sm font-bold')}
                  >
                    Ask a question
                  </Button>
                </Link>
                <ConnectWalletButton />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </motion.nav>
  )
}
