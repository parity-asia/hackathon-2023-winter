import { chains } from '../constants/chains'
import { getUseTestnet } from '../helpers/env'

export type SubsocialConfig = {
  substrateNodeUrl: string
  ipfsNodeUrl: string
  authHeader?: string
}

const CRUST_TESTNET_AUTH =
  'c3ViLTVGQTluUURWZzI2N0RFZDhtMVp5cFhMQm52TjdTRnhZd1Y3bmRxU1lHaU45VFRwdToweDEwMmQ3ZmJhYWQwZGUwNzFjNDFmM2NjYzQzYmQ0NzIxNzFkZGFiYWM0MzEzZTc5YTY3ZWExOWM0OWFlNjgyZjY0YWUxMmRlY2YyNzhjNTEwZGY4YzZjZTZhYzdlZTEwNzY2N2YzYTBjZjM5OGUxN2VhMzAyMmRkNmEyYjc1OTBi'
const testnetSubsocialConfig: SubsocialConfig = {
  substrateNodeUrl: 'wss://rco-para.subsocial.network',
  ipfsNodeUrl: 'https://gw.crustfiles.app',
  authHeader: CRUST_TESTNET_AUTH,
}

const mainnetSubsocialConfig: SubsocialConfig = {
  substrateNodeUrl: 'wss://para.subsocial.network',
  ipfsNodeUrl: 'https://ipfs.subsocial.network',
}

const useTestnet = getUseTestnet()

export const mainTokenTicker: keyof typeof chains = useTestnet ? 'SOON' : 'SUB'

const subsocialConfig: SubsocialConfig = useTestnet
  ? testnetSubsocialConfig
  : mainnetSubsocialConfig
export default subsocialConfig
