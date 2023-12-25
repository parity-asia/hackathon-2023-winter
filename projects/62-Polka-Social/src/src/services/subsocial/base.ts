import { useSubsocialApiContext } from '#/contexts/SubsocialApiContext'
import { useWalletContext } from '#/contexts/WalletContext'
import subsocialConfig from '#/lib/config/subsocial-api'
import { ApiPromise } from '@polkadot/api'
import { Hash } from '@polkadot/types/interfaces'
import { SubsocialApi, SubsocialIpfsApi } from '@subsocial/api'
import { useEffect, useRef } from 'react'
import { useMutation, UseMutationResult, useQuery } from 'react-query'
import {
  createTxAndSend,
  generateQueryWrapper,
  makeCombinedCallback,
  mergeQueryConfig,
} from '../common/base'
import { MutationConfig, QueryConfig } from '../common/types'

export type SubstrateApi = Awaited<SubsocialApi['substrateApi']>
export type Transaction = ReturnType<ApiPromise['tx']['']['']>

export const subsocialQueryWrapper = generateQueryWrapper(async () => null)

export function useSubsocialQuery<ReturnValue, Params>(
  params: { key: string; data: Params | null },
  func: (data: {
    params: Params
    additionalData: SubsocialApi
  }) => Promise<ReturnValue>,
  config?: QueryConfig<any, any>,
  defaultConfig?: QueryConfig<ReturnValue, Params>
) {
  const subsocialApi = useSubsocialApiContext()
  const mergedConfig = mergeQueryConfig(
    mergeQueryConfig(config, defaultConfig),
    { enabled: !!subsocialApi }
  )
  return useQuery(
    [params.key, params.data],
    subsocialQueryWrapper(func, subsocialApi!),
    mergedConfig as any
  )
}

export function useSubsocialMutation<Param>(
  transactionGenerator: (
    params: Param,
    apis: {
      subsocialApi: SubsocialApi
      ipfsApi: SubsocialIpfsApi
      substrateApi: SubstrateApi
    }
  ) => Promise<{ tx: Transaction; summary: string }>,
  config?: MutationConfig<Param>,
  defaultConfig?: MutationConfig<Param>
): UseMutationResult<Hash, Error, Param, unknown> {
  const [wallet, setWallet] = useWalletContext()
  const subsocialApiContext = useSubsocialApiContext()
  const promiseRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (promiseRef.current && subsocialApiContext) {
      promiseRef.current()
    }
  }, [subsocialApiContext])

  const workerFunc = async (param: Param) => {
    if (!wallet) throw new Error('You need to connect your wallet first!')
    await new Promise<void>((resolve) => {
      promiseRef.current = resolve
      if (subsocialApiContext) resolve()
    })
    const subsocialApi = subsocialApiContext!
    const substrateApi = await subsocialApi.substrateApi
    const ipfsApi = subsocialApi.ipfs
    return createTxAndSend(
      transactionGenerator,
      param,
      wallet,
      setWallet,
      subsocialConfig.substrateNodeUrl,
      config,
      defaultConfig,
      {
        ipfsApi,
        subsocialApi,
        substrateApi,
      }
    )
  }

  return useMutation(workerFunc, {
    ...(defaultConfig || {}),
    ...config,
    onSuccess: makeCombinedCallback(defaultConfig, config, 'onSuccess'),
    onError: makeCombinedCallback(defaultConfig, config, 'onError'),
  })
}
