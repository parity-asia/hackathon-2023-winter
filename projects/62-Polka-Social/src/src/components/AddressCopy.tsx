import { truncateMiddle } from '@talisman-connect/ui'
import clsx from 'clsx'
import { HTMLProps } from 'react'
import { BsFiles } from 'react-icons/bs'
import { toast } from 'react-toastify'
import Button from './Button'

export interface AddressCopyProps extends HTMLProps<HTMLDivElement> {
  children: string
  truncate?: boolean
}

export default function AddressCopy({
  children,
  truncate = true,
  className,
  ...props
}: AddressCopyProps) {
  const copyToClipboard = () => {
    window.navigator.clipboard.writeText(children)
    toast.info('Address copied to clipboard!')
  }
  return (
    <div className={clsx('flex', className)} {...props}>
      <div
        onClick={copyToClipboard}
        className={clsx('flex items-center', 'cursor-pointer')}
      >
        <p>{truncate ? truncateMiddle(children) : children}</p>
        <Button
          className={clsx('text-text-secondary', 'ml-1.5')}
          rounded
          variant='unstyled'
          size='icon-small'
        >
          <BsFiles className={clsx('w-3.5 h-3.5')} />
        </Button>
      </div>
    </div>
  )
}
