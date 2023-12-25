import Button from '#/components/Button'
import { useWalletContext } from '#/contexts/WalletContext'
import { APP_NAME } from '#/lib/constants/app'
import { WalletSelect } from '@talisman-connect/components'
import clsx from 'clsx'
import { HTMLProps } from 'react'
import WalletProfile from './WalletProfile'

export interface ConnectWalletButtonProps extends HTMLProps<HTMLDivElement> {}

export default function ConnectWalletButton(props: ConnectWalletButtonProps) {
  const [wallet, setWallet] = useWalletContext()

  if (wallet === undefined) {
    return null
  }

  return (
    <div {...props}>
      {wallet ? (
        <WalletProfile wallet={wallet} />
      ) : (
        <WalletSelect
          dappName={APP_NAME}
          showAccountsList
          onAccountSelected={(selectedAccount) => {
            setWallet(selectedAccount)
          }}
          triggerComponent={
            <Button className={clsx('text-sm')}>Connect to wallet</Button>
          }
        />
      )}
    </div>
  )
}
