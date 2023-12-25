import { TokenTickers } from '#/lib/constants/chains'

// Common
export type AllChainsCommonParams = {
  network: TokenTickers
}

// Queries
export interface GetTokenParams extends AllChainsCommonParams {
  address: string
}

// Mutations
export interface TransferPayload extends AllChainsCommonParams {
  dest: string
  value: number
}
