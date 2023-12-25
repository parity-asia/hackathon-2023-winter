import { useWalletContext } from '#/contexts/WalletContext'
import { encodeAddress } from '../helpers/chain'

export default function useIsCurrentUser(profileId?: string) {
  const [wallet] = useWalletContext()
  return encodeAddress(wallet?.address) === encodeAddress(profileId)
}
