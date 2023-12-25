import Link from '#/components/Link'
import Loading from '#/components/Loading'
import Modal, { ModalProps } from '#/components/Modal'
import { FAST_TRANSITION, NORMAL_TRANSITION } from '#/lib/constants/transition'
import clsx from 'clsx'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { BsArrowUpCircle, BsExclamationTriangle } from 'react-icons/bs'

type OmittedModalProps = Omit<
  ModalProps,
  'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'ref'
>

export interface TransactionModalProps extends OmittedModalProps {
  isLoading: boolean
  action: string
  errorMsg?: string
  hash?: string
}

const MotionModal = motion<OmittedModalProps>(Modal)

export default function TransactionModal({
  hash,
  isLoading,
  errorMsg,
  action,
  ...props
}: TransactionModalProps) {
  return (
    <LayoutGroup>
      <MotionModal
        {...props}
        transition={FAST_TRANSITION}
        layout='size'
        size='xs'
        ringColor={errorMsg ? 'error' : 'default'}
        className={clsx('py-12 px-8')}
      >
        <AnimatePresence exitBeforeEnter>
          {(() => {
            if (isLoading) {
              return <LoadingModalContent key='loading' action={action} />
            } else if (errorMsg) {
              return <ErrorModalContent key='error' errorMsg={errorMsg ?? ''} />
            } else {
              return <SuccesssModalContent key='success' hash={hash} />
            }
          })()}
        </AnimatePresence>
      </MotionModal>
    </LayoutGroup>
  )
}

const exitAnimation = { opacity: 0 }
const inAnimation = { opacity: 1 }
const initialAnimation = { opacity: 0 }

function LoadingModalContent({ action }: { action: string }) {
  return (
    <motion.div
      exit={exitAnimation}
      animate={inAnimation}
      initial={initialAnimation}
      transition={NORMAL_TRANSITION}
      className={clsx('flex flex-col')}
    >
      <Loading className={clsx('w-32 h-32', 'text-brand')} />
      <p className={clsx('text-center', 'mt-4', 'font-bold text-xl')}>
        {action}
      </p>
      <p className={clsx('text-center text-sm', 'mt-2', 'text-text-secondary')}>
        Waiting for Confirmation...
      </p>
      <p className={clsx('text-center text-sm', 'mt-6', 'text-text-disabled')}>
        Confirm this transaction in your wallet
      </p>
    </motion.div>
  )
}

function ErrorModalContent({ errorMsg }: { errorMsg: string }) {
  return (
    <motion.div
      exit={exitAnimation}
      animate={inAnimation}
      initial={initialAnimation}
      transition={NORMAL_TRANSITION}
      className={clsx('flex flex-col')}
    >
      <BsExclamationTriangle
        className={clsx('w-24 h-24', 'text-red-500', 'mx-auto')}
      />
      <p className={clsx('text-center', 'mt-6', 'font-bold text-xl')}>
        Transaction Failed
      </p>
      <p className={clsx('text-center text-text-secondary text-sm', 'mt-2')}>
        {errorMsg}
      </p>
    </motion.div>
  )
}

function SuccesssModalContent({ hash }: { hash: string | undefined }) {
  return (
    <motion.div
      exit={exitAnimation}
      animate={inAnimation}
      initial={initialAnimation}
      transition={NORMAL_TRANSITION}
      className={clsx('flex flex-col')}
    >
      <BsArrowUpCircle className={clsx('w-24 h-24', 'text-brand', 'mx-auto')} />
      <p className={clsx('text-center', 'mt-6', 'font-bold text-xl')}>
        Transaction Submitted
      </p>
      <Link variant='primary' className={clsx('text-center', 'mt-2')}>
        {/* TODO: link to explorer */}
        View on Explorer
      </Link>
    </motion.div>
  )
}
