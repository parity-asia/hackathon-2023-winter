import Button, { ButtonProps } from '#/components/Button'
import { useWalletContext } from '#/contexts/WalletContext'
import { encodeAddress } from '#/lib/helpers/chain'
import { SpaceData } from '@subsocial/api/types'
import clsx from 'clsx'
import { useState } from 'react'
import { BsCash } from 'react-icons/bs'
import TippingModal from './TippingModal'

export interface TippingButtonProps extends ButtonProps {
  dest: string
  profile: SpaceData | undefined
}

export default function TippingButton({
  className,
  dest,
  profile,
  ...props
}: TippingButtonProps) {
  const [openModal, setOpenModal] = useState(false)
  const [wallet] = useWalletContext()
  if (encodeAddress(dest) === encodeAddress(wallet?.address)) {
    return null
  }

  return (
    <>
      <Button
        variant='unstyled'
        size='icon-small'
        rounded
        className={clsx('text-brand', className)}
        onClick={() => setOpenModal((prev) => !prev)}
        {...props}
      >
        <BsCash />
      </Button>
      <TippingModal
        profile={profile}
        dest={dest}
        isOpen={openModal}
        handleClose={() => setOpenModal(false)}
      />
    </>
  )
}
