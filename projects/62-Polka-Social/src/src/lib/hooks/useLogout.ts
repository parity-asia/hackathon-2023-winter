import { useWalletContext } from '#/contexts/WalletContext'
import { useCallback } from 'react'

export default function useLogout() {
  const [, setWallet] = useWalletContext()
  return useCallback(() => {
    return setWallet(null)
  }, [setWallet])
}
