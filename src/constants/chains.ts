/**
 * List of all the networks supported by the Uniswap Interface
 */
export enum SupportedChainId {
  RSK_MAINNET = 30,
  RSK_TESTNET = 31,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.RSK_MAINNET]: 'rsk_mainnet',
  [SupportedChainId.RSK_TESTNET]: 'rsk_testnet',
}

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number'
) as SupportedChainId[]

export function isSupportedChain(chainId: number | null | undefined): chainId is SupportedChainId {
  return !!chainId && !!SupportedChainId[chainId]
}

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [SupportedChainId.RSK_MAINNET]

/**
 * Unsupported networks for V2 pool behavior.
 */
export const UNSUPPORTED_V2POOL_CHAIN_IDS = []

export const TESTNET_CHAIN_IDS = [SupportedChainId.RSK_TESTNET] as const

export type SupportedTestnetChainId = typeof TESTNET_CHAIN_IDS[number]

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [SupportedChainId.RSK_MAINNET, SupportedChainId.RSK_TESTNET] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [] as const

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number]
