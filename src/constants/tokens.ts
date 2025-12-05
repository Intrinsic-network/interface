import { Currency, NativeCurrency, RBTC, Token, WRBTC } from '@intrinsic-network/sdk-core'
import invariant from 'tiny-invariant'

import { INT_ADDRESS } from './addresses'
import { SupportedChainId } from './chains'

export const NATIVE_CHAIN_ID = 'NATIVE'

// When decimals are not specified for an ERC20 token
// use default ERC20 token decimals as specified here:
// https://docs.openzeppelin.com/contracts/3.x/erc20
export const DEFAULT_ERC20_DECIMALS = 18

export const USDC_MAINNET = new Token(
  SupportedChainId.RSK_MAINNET,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
)
export const USDC_TESTNET = new Token(
  SupportedChainId.RSK_TESTNET,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
)

export const USDT = new Token(
  SupportedChainId.RSK_MAINNET,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD'
)

export const WBTC = new Token(
  SupportedChainId.RSK_MAINNET,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC'
)

export const DAI = new Token(
  SupportedChainId.RSK_MAINNET,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
)

export const renBTC = new Token(
  SupportedChainId.RSK_MAINNET,
  '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
  8,
  'renBTC',
  'renBTC'
)

export const USDC: { [chainId in SupportedChainId]: Token } = {
  [SupportedChainId.RSK_MAINNET]: USDC_MAINNET,
  [SupportedChainId.RSK_TESTNET]: USDC_TESTNET,
}

export const BPD = new Token(
  SupportedChainId.RSK_TESTNET,
  '0x4CA89A9299E1217D24CF4DfE618a6517C5998f79',
  18,
  'BPD',
  'BPD Stablecoin'
)

export const MP = new Token(SupportedChainId.RSK_TESTNET, '0xAd80ED0490f1D93C273345800A14A7Fe8792db83', 18, 'MP', 'MP')

export const INT: { [chainId: number]: Token } = {
  [SupportedChainId.RSK_TESTNET]: new Token(
    SupportedChainId.RSK_TESTNET,
    INT_ADDRESS[SupportedChainId.RSK_TESTNET],
    18,
    'INT',
    'INT'
  ),
}

export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token | undefined } = {
  ...(WRBTC as Record<SupportedChainId, Token>),
  [SupportedChainId.RSK_TESTNET]: new Token(
    SupportedChainId.RSK_TESTNET,
    '0x09b6ca5e4496238a1f176aea6bb607db96c2286e',
    18,
    'WtRBTC',
    'Wrapped tRBTC'
  ),
}

function isRskTestnet(chainId: number): chainId is SupportedChainId.RSK_TESTNET {
  return chainId === SupportedChainId.RSK_TESTNET
}

class RskTestnetNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  get wrapped(): Token {
    if (!isRskTestnet(this.chainId)) throw new Error('Not RSK Testnet')
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    invariant(wrapped instanceof Token)
    return wrapped
  }

  public constructor(chainId: number) {
    if (!isRskTestnet(chainId)) throw new Error('Not RSK Testnet')
    super(chainId, 18, 'tRBTC', 'Test RBTC')
  }
}

export class ExtendedEther extends RBTC {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped) return wrapped
    throw new Error('Unsupported chain ID')
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } = {}

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedExtendedEther[chainId] ?? (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId))
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {}
export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) return cachedNativeCurrency[chainId]
  let nativeCurrency: NativeCurrency | Token
  if (isRskTestnet(chainId)) {
    nativeCurrency = new RskTestnetNativeCurrency(chainId)
  } else {
    nativeCurrency = ExtendedEther.onChain(chainId)
  }
  return (cachedNativeCurrency[chainId] = nativeCurrency)
}

export const TOKEN_SHORTHANDS: { [shorthand: string]: { [chainId in SupportedChainId]?: string } } = {
  USDC: {},
}
