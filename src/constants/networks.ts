import { SupportedChainId } from './chains'

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
if (typeof INFURA_KEY === 'undefined') {
  throw new Error(`REACT_APP_INFURA_KEY must be a defined environment variable`)
}

/**
 * Fallback JSON-RPC endpoints.
 * These are used if the integrator does not provide an endpoint, or if the endpoint does not work.
 *
 * MetaMask allows switching to any URL, but displays a warning if it is not on the "Safe" list:
 * https://github.com/MetaMask/metamask-mobile/blob/bdb7f37c90e4fc923881a07fca38d4e77c73a579/app/core/RPCMethods/wallet_addEthereumChain.js#L228-L235
 * https://chainid.network/chains.json
 *
 * These "Safe" URLs are listed first, followed by other fallback URLs, which are taken from chainlist.org.
 */
export const FALLBACK_URLS: { [key in SupportedChainId]: string[] } = {
  [SupportedChainId.RSK_MAINNET]: [
    // "Safe" URLs
    `https://public-node.rsk.co`,
  ],
  [SupportedChainId.RSK_TESTNET]: [
    // "Safe" URLs
    `https://public-node.testnet.rsk.co`,
  ],
}

/**
 * Known JSON-RPC endpoints.
 * These are the URLs used by the interface when there is not another available source of chain data.
 */
export const RPC_URLS: { [key in SupportedChainId]: string[] } = {
  [SupportedChainId.RSK_MAINNET]: ['https://public-node.rsk.co', ...FALLBACK_URLS[SupportedChainId.RSK_MAINNET]],
  [SupportedChainId.RSK_TESTNET]: ['https://34.227.23.224:4444', ...FALLBACK_URLS[SupportedChainId.RSK_TESTNET]],
  // [SupportedChainId.RSK_TESTNET]: [
  //   'https://public-node.testnet.rsk.co',
  //   ...FALLBACK_URLS[SupportedChainId.RSK_TESTNET],
  // ],
}
