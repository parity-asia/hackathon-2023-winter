import { FAST_TRANSITION } from '#/lib/constants/transition'
import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { forwardRef, Fragment } from 'react'
import { BsX } from 'react-icons/bs'
import Button from './Button'
import Card, { CardProps } from './Card'

const sizes = {
  xl: clsx('max-w-screen-xl'),
  lg: clsx('max-w-screen-lg'),
  md: clsx('max-w-2xl'),
  sm: clsx('max-w-md'),
  xs: clsx('max-w-sm'),
}

export interface ModalProps extends Omit<CardProps, 'size' | 'ref'> {
  isOpen: boolean
  handleClose: () => void
  size?: keyof typeof sizes
  withCloseButton?: boolean
  title?: string
  desc?: string
  children?: any
  ringColor?: 'default' | 'error'
  dialogProps?: Omit<Parameters<typeof Dialog>[0], 'onClose' | 'isOpen'>
}

const MotionDialogPanel = motion<any>(Dialog.Panel)

const Modal = forwardRef(function Modal(
  {
    handleClose,
    isOpen,
    withCloseButton = true,
    title,
    size = 'md',
    desc,
    children,
    ringColor = 'default',
    className,
    dialogProps,
    ...props
  }: ModalProps,
  ref
) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        onClose={handleClose}
        className={clsx('relative', 'z-40')}
        {...dialogProps}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div
            className={clsx(
              'fixed inset-0',
              'bg-black/30 backdrop-blur-sm',
              'z-40'
            )}
            aria-hidden='true'
          />
        </Transition.Child>

        <div className={clsx('fixed inset-0 top-0 overflow-y-auto', 'z-50')}>
          <div
            className={clsx(
              'flex items-center justify-center',
              'min-h-full p-8'
            )}
          >
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <MotionDialogPanel
                layout
                className={clsx('w-full transition', 'relative', sizes[size])}
                transition={FAST_TRANSITION}
              >
                <Card
                  {...props}
                  ref={ref as any}
                  className={clsx(
                    'bg-bg-100 ring-1',
                    'flex flex-col',
                    'p-4 min-h-[4em]',
                    ringColor === 'default' && 'ring-brand/40',
                    ringColor === 'error' && 'ring-red-500',
                    className
                  )}
                >
                  {withCloseButton && (
                    <Button
                      onClick={handleClose}
                      size='icon-small'
                      className={clsx('!absolute right-4 top-4')}
                      variant='unstyled'
                    >
                      <BsX className={clsx('text-xl')} />
                    </Button>
                  )}
                  {title && <Dialog.Title>{title}</Dialog.Title>}
                  {desc && <Dialog.Description>{desc}</Dialog.Description>}
                  {children}
                </Card>
              </MotionDialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
})

export default Modal
