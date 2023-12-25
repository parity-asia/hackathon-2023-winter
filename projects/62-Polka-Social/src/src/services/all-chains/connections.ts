import { chains, TokenTickers } from '#/lib/constants/chains'
import { ApiPromise, WsProvider } from '@polkadot/api'

export class Connections {
  savedConnections: {
    [key in TokenTickers]?: ApiPromise
  } = {}

  async getConnection(chain: TokenTickers) {
    const savedConnection = this.savedConnections[chain]
    if (savedConnection) {
      return savedConnection
    }

    const chainInfo = chains[chain]
    const wsProvider = new WsProvider(chainInfo.rpc)
    const connection = await ApiPromise.create({ provider: wsProvider })
    this.savedConnections[chain] = connection
    return connection
  }
}
const connections = new Connections()
export default connections
