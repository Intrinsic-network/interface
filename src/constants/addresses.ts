import { constructSameAddressMap } from '../utils/constructSameAddressMap'
import { SupportedChainId } from './chains'
import { ZERO_ADDRESS } from './misc'

type AddressMap = { [chainId: number]: string }

export const INT_ADDRESS: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: '0xfF7F0e50fE50136f538afcDd41742D92eD7DcBD7',
}

export const V2_FACTORY_ADDRESSES: AddressMap = constructSameAddressMap(ZERO_ADDRESS)
export const V2_ROUTER_ADDRESS: AddressMap = constructSameAddressMap(ZERO_ADDRESS)

// rsk testnet v3 addresses
const RSK_TESTNET_V3_CORE_FACTORY_ADDRESSES = '0x372E5a6341C0aAa80adc70Eb261727c3DD74515d'
const RSK_TESTNET_V3_MIGRATOR_ADDRESSES = '0xE9fC71df19e82A3D9614b788dE3bF87DFc31374D'
const RSK_TESTNET_MULTICALL_ADDRESSES = '0x65c42d287AA98219E6b60B11284c1cC51F0F4bcE'
const RSK_TESTNET_ROUTER_ADDRESSES = '0x9a293d20e1f070Ea8C4DfeC287246164636844e3'
const RSK_TESTNET_QUOTER_ADDRESSES = '0xbDcEae2E7B9D40879406Bd701ac974eeCa823A55'
const RSK_TESTNET_NONFUNGIBLE_POSITION_MANAGER_ADDRESSES = '0xE65072F94460C1F14cD86C7B5079f101F719b20f'
const RSK_TESTNET_TICK_LENS_ADDRESSES = '0x0b01E5D78C0E9466E5F19E64352bC53899e8c759'

/* V3 Contract Addresses */
export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: RSK_TESTNET_V3_CORE_FACTORY_ADDRESSES,
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: RSK_TESTNET_V3_MIGRATOR_ADDRESSES,
}

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: RSK_TESTNET_MULTICALL_ADDRESSES,
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: RSK_TESTNET_ROUTER_ADDRESSES,
}

/**
 * The latest governor bravo that is currently admin of timelock
 */
export const GOVERNANCE_BRAVO_ADDRESSES: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: '0x17358F70c21722B4bC666c5e0A23033fE07d6da0',
}

export const TIMELOCK_ADDRESS: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: '0x7DA7daab743661D6327b21405FBaa21Af35CA971',
}

export const MERKLE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [SupportedChainId.RSK_MAINNET]: ZERO_ADDRESS,
}

export const ARGENT_WALLET_DETECTOR_ADDRESS: AddressMap = {
  [SupportedChainId.RSK_MAINNET]: ZERO_ADDRESS,
}

export const QUOTER_ADDRESSES: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: RSK_TESTNET_QUOTER_ADDRESSES,
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: RSK_TESTNET_NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.RSK_MAINNET]: ZERO_ADDRESS,
}

export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {
  [SupportedChainId.RSK_MAINNET]: ZERO_ADDRESS,
}

export const TICK_LENS_ADDRESSES: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: RSK_TESTNET_TICK_LENS_ADDRESSES,
}
