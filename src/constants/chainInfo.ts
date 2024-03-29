import rskLogoUrl from 'assets/images/rsk.png'
import { colorsDark } from 'theme/colors'

import { SupportedChainId, SupportedL1ChainId, SupportedL2ChainId } from './chains'

export enum NetworkType {
  L1,
  L2,
}

interface BaseChainInfo {
  readonly networkType: NetworkType
  readonly blockWaitMsBeforeWarning?: number
  readonly docs: string
  readonly bridge?: string
  readonly explorer: string
  readonly infoLink: string
  readonly logoUrl: string
  readonly circleLogoUrl?: string
  readonly label: string
  readonly helpCenterUrl?: string
  readonly nativeCurrency: {
    name: string // e.g. 'Goerli ETH',
    symbol: string // e.g. 'gorETH',
    decimals: number // e.g. 18,
  }
  readonly color?: string
  readonly backgroundColor?: string
}

export interface L1ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L1
  readonly defaultListUrl?: string
}

export interface L2ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L2
  readonly bridge: string
  readonly statusPage?: string
  readonly defaultListUrl: string
}

export type ChainInfoMap = { readonly [chainId: number]: L1ChainInfo | L2ChainInfo } & {
  readonly [chainId in SupportedL2ChainId]: L2ChainInfo
} & { readonly [chainId in SupportedL1ChainId]: L1ChainInfo }

const CHAIN_INFO: ChainInfoMap = {
  [SupportedChainId.RSK_MAINNET]: {
    networkType: NetworkType.L1,
    docs: 'https://developers.rsk.co/',
    explorer: 'https://explorer.rsk.co/',
    infoLink: 'https://developers.rsk.co/rsk/',
    label: 'RSK Mainnet',
    logoUrl: rskLogoUrl,
    nativeCurrency: { name: 'RBTC', symbol: 'RBTC', decimals: 18 },
    color: colorsDark.chain_1,
  },
  [SupportedChainId.RSK_TESTNET]: {
    networkType: NetworkType.L1,
    docs: 'https://developers.rsk.co/',
    explorer: 'https://explorer.testnet.rsk.co/',
    infoLink: 'https://developers.rsk.co/rsk/',
    label: 'RSK Testnet',
    logoUrl: rskLogoUrl,
    nativeCurrency: { name: 'RBTC', symbol: 'tRBTC', decimals: 18 },
    color: colorsDark.chain_1,
  },
}

export function getChainInfo(chainId: SupportedL1ChainId): L1ChainInfo
export function getChainInfo(chainId: SupportedL2ChainId): L2ChainInfo
export function getChainInfo(chainId: SupportedChainId): L1ChainInfo | L2ChainInfo
export function getChainInfo(
  chainId: SupportedChainId | SupportedL1ChainId | SupportedL2ChainId | number | undefined
): L1ChainInfo | L2ChainInfo | undefined

/**
 * Overloaded method for returning ChainInfo given a chainID
 * Return type varies depending on input type:
 * number | undefined -> returns chaininfo | undefined
 * SupportedChainId -> returns L1ChainInfo | L2ChainInfo
 * SupportedL1ChainId -> returns L1ChainInfo
 * SupportedL2ChainId -> returns L2ChainInfo
 */
export function getChainInfo(chainId: any): any {
  if (chainId) {
    return CHAIN_INFO[chainId] ?? undefined
  }
  return undefined
}

export const MAINNET_INFO = CHAIN_INFO[SupportedChainId.RSK_MAINNET]
export function getChainInfoOrDefault(chainId: number | undefined) {
  return getChainInfo(chainId) ?? MAINNET_INFO
}
