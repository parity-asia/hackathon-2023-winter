import Link, { LinkProps } from '#/components/Link'
import { useWalletContext } from '#/contexts/WalletContext'
import { hoverRingClassName } from '#/lib/constants/common-classnames'
import { NORMAL_TRANSITION } from '#/lib/constants/transition'
import { TransitionVariants } from '#/lib/helpers/types'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import React, { HTMLProps, useState } from 'react'
import { BsChevronLeft } from 'react-icons/bs'

const WIDTH = 225

const containerVariants: TransitionVariants = {
  close: { opacity: 0 },
  open: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}
const contentVariants: TransitionVariants = {
  close: { opacity: 0, x: -25, transition: NORMAL_TRANSITION },
  open: { opacity: 1, x: 0, transition: NORMAL_TRANSITION },
}

interface Props extends HTMLProps<HTMLDivElement> {
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

type LinkAuthType = 'user' | undefined
type LinkData = { text: string; to: string; type?: LinkAuthType }
type NestedLinks = {
  title: string
  content: LinkData[]
  type?: LinkAuthType
}
const links: (NestedLinks | LinkData)[] = [
  { text: 'Home', to: '/' },
  {
    title: 'Questions',
    content: [
      { text: 'New', to: '/questions/new' },
      { text: 'Unanswered', to: '/questions/unanswered' },
      { text: 'Your Questions', to: '/profile', type: 'user' },
    ],
  },
  {
    title: 'Users',
    content: [
      // { text: 'All', to: '/users' },
      { text: 'Following', to: '/profile/following' },
      { text: 'Followers', to: '/profile/followers' },
    ],
    type: 'user',
  },
]

const checkAuthorization = (
  linkType: LinkAuthType,
  currentUserType: '' | LinkAuthType
) => {
  if (linkType === 'user') {
    return currentUserType === 'user'
  }
  return true
}

export default function Sidebar({
  className,
  isOpen,
  setIsOpen,
  ...props
}: Props) {
  const { pathname } = useRouter()
  const [localIsOpen, setLocalIsOpen] = useState(true)
  const usedIsOpen = isOpen ?? localIsOpen
  const usedSetIsOpen = setIsOpen ?? setLocalIsOpen

  const [wallet] = useWalletContext()
  const currentUserType: LinkAuthType | undefined = wallet?.address
    ? 'user'
    : undefined

  return (
    <div className={clsx(className)} {...props}>
      <button
        className={clsx(
          'p-2 bg-bg-100 text-lg',
          'absolute right-1 top-0 translate-x-full z-10',
          'rounded-r-md',
          hoverRingClassName
        )}
        onClick={() => usedSetIsOpen((prev) => !prev)}
      >
        <BsChevronLeft
          className={clsx(
            'transition duration-150',
            usedIsOpen ? '' : 'rotate-180'
          )}
        />
      </button>
      <motion.aside
        className={clsx(
          'flex flex-col',
          'p-4 h-full',
          'bg-bg-100',
          'rounded-md'
        )}
        initial={{
          width: WIDTH,
        }}
        animate={{
          width: usedIsOpen ? WIDTH : 0,
          opacity: usedIsOpen ? 1 : 0,
          paddingLeft: !usedIsOpen ? 0 : undefined,
          paddingRight: !usedIsOpen ? 0 : undefined,
        }}
      >
        <AnimatePresence exitBeforeEnter>
          {usedIsOpen && wallet !== undefined && (
            <motion.div
              key={currentUserType}
              variants={containerVariants}
              transition={NORMAL_TRANSITION}
              initial='close'
              animate='open'
              exit='close'
            >
              {links.map((data) => {
                if ('to' in data) {
                  if (!checkAuthorization(data.type, currentUserType))
                    return null
                  return (
                    <SidebarLink
                      key={data.to}
                      className={clsx('mb-2')}
                      {...data}
                      selected={data.to === pathname}
                    />
                  )
                }
                const { content, title, type } = data
                if (!checkAuthorization(type, currentUserType)) return null
                return (
                  <motion.div
                    className='pb-6 flex flex-col space-y-1'
                    key={title}
                  >
                    <motion.p
                      variants={contentVariants}
                      className='font-bold px-2 py-1.5'
                    >
                      {title}
                    </motion.p>
                    <div className={clsx('px-2 flex flex-col', 'space-y-1')}>
                      {content.map((link) => {
                        if (!checkAuthorization(link.type, currentUserType))
                          return null
                        return (
                          <SidebarLink
                            {...link}
                            className={clsx('!px-6')}
                            selected={link.to === pathname}
                            key={link.to}
                          />
                        )
                      })}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </div>
  )
}

function SidebarLink({
  text,
  to,
  selected,
  className,
  ...props
}: LinkData & { selected: boolean } & LinkProps) {
  return (
    <motion.div variants={contentVariants}>
      <Link
        className={clsx(
          'block',
          'px-2 py-1.5',
          'hover:bg-bg-200',
          selected ? 'bg-bg-200 font-bold text-brand' : '',
          'rounded-md',
          className
        )}
        href={to}
        key={text}
        {...props}
      >
        {text}
      </Link>
    </motion.div>
  )
}
