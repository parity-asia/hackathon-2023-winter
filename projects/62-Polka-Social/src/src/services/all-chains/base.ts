import { useWalletContext } from '#/contexts/WalletContext'
import { chains } from '#/lib/constants/chains'
import { ApiPromise } from '@polkadot/api'
import { Hash } from '@polkadot/types/interfaces'
import { useMutation, UseMutationResult, useQuery } from 'react-query'
import {
  createTxAndSend,
  generateQueryWrapper,
  makeCombinedCallback,
  mergeQueryConfig,
} from '../common/base'
import { MutationConfig, QueryConfig } from '../common/types'
import { Transaction } from '../subsocial/base'
import connections from './connections'
import { AllChainsCommonParams } from './types'

export const allChainsQueryWrapper = generateQueryWrapper(
  (data: AllChainsCommonParams) => connections.getConnection(data.network)
)

export function useAllChainsQuery<T, Params extends AllChainsCommonParams>(
  data: { key: string; params: Params | null },
  func: (data: { params: Params; preQueryData: ApiPromise }) => Promise<T>,
  config?: QueryConfig<any, any>,
  defaultConfig?: QueryConfig<T, Params>
) {
  const mergedConfig = mergeQueryConfig(config, defaultConfig)
  return useQuery(
    [data.key, data.params],
    allChainsQueryWrapper(func, null),
    mergedConfig as any
  )
}

export function useAllChainsMutation<Param extends AllChainsCommonParams>(
  transactionGenerator: (
    params: Param,
    api: ApiPromise
  ) => Promise<{ tx: Transaction; summary: string }>,
  config?: MutationConfig<Param>,
  defaultConfig?: MutationConfig<Param>
): UseMutationResult<Hash, Error, Param, unknown> {
  const [wallet, setWallet] = useWalletContext()

  const workerFunc = async (param: Param) => {
    if (!wallet) throw new Error('You need to connect your wallet first!')
    const api = await connections.getConnection(param.network)
    const chainInfo = chains[param.network]
    return createTxAndSend(
      transactionGenerator,
      param,
      wallet,
      setWallet,
      chainInfo.rpc,
      config,
      defaultConfig,
      api
    )
  }

  return useMutation(workerFunc, {
    ...(defaultConfig || {}),
    ...config,
    onSuccess: makeCombinedCallback(defaultConfig, config, 'onSuccess'),
    onError: makeCombinedCallback(defaultConfig, config, 'onError'),
  })
}
