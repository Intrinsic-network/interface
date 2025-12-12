import { Currency, NativeCurrency, RBTC, Token, WRBTC } from '@intrinsic-network/sdk-core'
import invariant from 'tiny-invariant'

import { INT_ADDRESS } from './addresses'
import { SupportedChainId } from './chains'

export const NATIVE_CHAIN_ID = 'NATIVE'

// When decimals are not specified for an ERC20 token
// use default ERC20 token decimals as specified here:
// https://docs.openzeppelin.com/contracts/3.x/erc20
export const DEFAULT_ERC20_DECIMALS = 18

// eslint-disable-next-line import/no-unused-modules
export const USDC_MAINNET = new Token(
  SupportedChainId.RSK_TESTNET,
  '0x0000000000000000000000000000000000000000',
  6,
  'USDC',
  'USD//C'
)

export const USDT = new Token(
  SupportedChainId.RSK_MAINNET,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'rUSDT',
  'Tether USD'
)

export const WBTC = new Token(
  SupportedChainId.RSK_MAINNET,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC'
)

// eslint-disable-next-line import/no-unused-modules
export const DAI = new Token(
  SupportedChainId.RSK_TESTNET,
  '0x0000000000000000000000000000000000000000',
  18,
  'DAI',
  'Dai Stablecoin'
)

// eslint-disable-next-line import/no-unused-modules
export const renBTC = new Token(
  SupportedChainId.RSK_TESTNET,
  '0x0000000000000000000000000000000000000000',
  8,
  'renBTC',
  'renBTC'
)

export const BPD: { [chainId: number]: Token } = {
  [SupportedChainId.RSK_TESTNET]: new Token(
    SupportedChainId.RSK_TESTNET,
    '0x4CA89A9299E1217D24CF4DfE618a6517C5998f79',
    18,
    'BPD',
    'BPD Stablecoin'
  ),
  [SupportedChainId.RSK_MAINNET]:
    new Token(
    SupportedChainId.RSK_MAINNET,
    '0x1fe2F558E2120C4BdF4217248d2940043a8E1208',
    18,
    'BPD',
    'BPD Stablecoin'
  ),
};

export const MP: { [chainId: number]: Token } = {
  [SupportedChainId.RSK_TESTNET]: new Token(
    SupportedChainId.RSK_TESTNET,
    '0xAd80ED0490f1D93C273345800A14A7Fe8792db83',
    18,
    'MP',
    'MP'
  ),
  [SupportedChainId.RSK_MAINNET]:
    new Token(
    SupportedChainId.RSK_MAINNET,
    '0xB41e9fc16D23c554C390636e43D5Eaa69f99fF43',
    18,
    'MP',
    'MP'
  ),
};

export const INT: { [chainId: number]: Token } = {
  [SupportedChainId.RSK_TESTNET]: new Token(
    SupportedChainId.RSK_TESTNET,
    INT_ADDRESS[SupportedChainId.RSK_TESTNET],
    18,
    'INT',
    'INT'
  ),
  [SupportedChainId.RSK_MAINNET]: new Token(
    SupportedChainId.RSK_MAINNET,
    INT_ADDRESS[SupportedChainId.RSK_MAINNET],
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
  [SupportedChainId.RSK_MAINNET]: new Token(
    SupportedChainId.RSK_MAINNET,
    '0x542fda317318ebf1d3deaf76e0b632741a7e677d',
    18,
    'WRBTC',
    'Wrapped RBTC'
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

class ExtendedEther extends RBTC {
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
