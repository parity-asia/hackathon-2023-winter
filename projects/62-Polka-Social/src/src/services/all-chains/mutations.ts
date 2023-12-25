import { formatBalance } from '#/lib/helpers/chain'
import { MutationConfig } from '../common/types'
import { useAllChainsMutation } from './base'
import { invalidateGetTokenBalance } from './queries'
import { TransferPayload } from './types'

export function useTransfer(config?: MutationConfig<TransferPayload>) {
  return useAllChainsMutation(
    async (data, api) => {
      const { dest, value } = data
      const tx = api.tx.balances.transfer(dest, value)
      return { tx, summary: `Transferring ${formatBalance(value)} coins` }
    },
    config,
    {
      onTxSuccess: (data, address) => {
        invalidateGetTokenBalance({
          address,
          network: data.network,
        })
      },
    }
  )
}
