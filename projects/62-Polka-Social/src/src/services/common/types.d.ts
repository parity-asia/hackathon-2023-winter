import { Hash } from '@polkadot/types/interfaces'
import { UseMutationOptions, UseQueryOptions } from 'react-query'

export type QueryConfig<T = any, V = any> = Omit<
  UseQueryOptions<T, unknown, T, (string | V | null)[]>,
  'queryFn' | 'queryKey'
>
export type MutationConfig<Param> = UseMutationOptions<
  Hash,
  Error,
  Param,
  unknown
> & { onTxSuccess?: (data: Param, address: string) => void }
