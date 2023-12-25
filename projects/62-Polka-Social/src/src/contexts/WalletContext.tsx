import { WalletAccount } from '@talisman-connect/wallets'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { defaultContextValue, StateContext } from './common'

type WalletState = WalletAccount | null | undefined
export const WalletContext = createContext<StateContext<WalletState>>(
  defaultContextValue(undefined)
)

const STORAGE_NAME = 'selected-wallet'

export const WalletContextProvider = ({ children }: { children: any }) => {
  const walletState = useState<WalletState>()
  const firstRender = useRef(true)

  const [wallet, setWallet] = walletState
  useEffect(() => {
    const selectedWallet = localStorage.getItem(STORAGE_NAME)
    if (selectedWallet) setWallet(JSON.parse(selectedWallet))
    else setWallet(null)
  }, [setWallet])

  useEffect(() => {
    if (wallet) localStorage.setItem(STORAGE_NAME, JSON.stringify(wallet))
    else {
      if (firstRender.current) {
        firstRender.current = false
        return
      }
      localStorage.removeItem(STORAGE_NAME)
    }
  }, [wallet])

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWalletContext() {
  return useContext(WalletContext)
}
