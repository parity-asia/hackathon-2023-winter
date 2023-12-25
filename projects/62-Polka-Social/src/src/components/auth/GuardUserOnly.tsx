import { useWalletContext } from '#/contexts/WalletContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { CommonGuardProps } from './common/types'

export default function GuardUserOnly({
  children,
  guardRedirect = '/',
}: CommonGuardProps) {
  const [wallet] = useWalletContext()
  const router = useRouter()

  useEffect(() => {
    if (wallet === null) {
      router.push(guardRedirect)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, guardRedirect])

  return wallet && children
}
