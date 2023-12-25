import urlJoin from 'url-join'
import subsocialConfig from '../config/subsocial-api'

export function getImageUrlFromIPFS(cid: string | undefined) {
  if (!cid) return ''
  return urlJoin(subsocialConfig.ipfsNodeUrl, '/ipfs', cid)
}
