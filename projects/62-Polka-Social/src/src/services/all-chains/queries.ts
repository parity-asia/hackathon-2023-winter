import { createQueryInvalidation } from '../common/base'
import { QueryConfig } from '../common/types'
import { useAllChainsQuery } from './base'
import { GetTokenParams } from './types'

export const getTokenBalanceKey = 'getTokenBalance'
export const invalidateGetTokenBalance =
  createQueryInvalidation<GetTokenParams>(getTokenBalanceKey)
export function useGetTokenBalance(
  params: Partial<GetTokenParams>,
  config?: QueryConfig
) {
  const parsedParams: GetTokenParams = params as any
  return useAllChainsQuery(
    { params: parsedParams, key: getTokenBalanceKey },
    async ({ params: { address }, preQueryData: connection }) => {
      const result: any = await connection.query.system.account(address)
      return result?.data?.free?.toString()
    },
    config,
    { enabled: !!params.address && !!params.network }
  )
}
