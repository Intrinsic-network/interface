import { FACTORY_ADDRESS as V2_FACTORY_ADDRESS } from '@uniswap/v2-sdk'

import { constructSameAddressMap } from '../utils/constructSameAddressMap'
import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const UNI_ADDRESS: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: '0x53376356b542B8764c64411511b74dA9B9381E87',
}

export const V2_FACTORY_ADDRESSES: AddressMap = constructSameAddressMap(V2_FACTORY_ADDRESS)
export const V2_ROUTER_ADDRESS: AddressMap = constructSameAddressMap('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D')

// rsk testnet v3 addresses
const RSK_TESTNET_V3_CORE_FACTORY_ADDRESSES = '0x1059AB9E612Fe31c04890756dC0DAC6A12f017e7'
const RSK_TESTNET_V3_MIGRATOR_ADDRESSES = '0xc9dF7c5091c844a927c6b3413BfdAc66FcC94B2c'
const RSK_TESTNET_MULTICALL_ADDRESSES = '0x8Af423e6465f90A62081784ae8d1A1253cc3461A'
const RSK_TESTNET_ROUTER_ADDRESSES = '0xa9CBAeCA4176F89D30105f2FB9113c202122744b'
const RSK_TESTNET_QUOTER_ADDRESSES = '0xE0934D8C295Eb014589e28a225A9E77e52DD5a1c'
const RSK_TESTNET_NONFUNGIBLE_POSITION_MANAGER_ADDRESSES = '0x3C23130FB24b40242E63d038D251050Eec5EEF87'
const RSK_TESTNET_TICK_LENS_ADDRESSES = '0x336C892d04239042c8d1b58e28a15FE99EED82df'

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
  [SupportedChainId.RSK_TESTNET]: '0xeB99700A796ab5E9c0f7781dB44E6251FC051D04',
}

export const TIMELOCK_ADDRESS: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: '0xDbd1883002028754d02BAc863Ec3761659FF35a5',
}

export const MERKLE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [SupportedChainId.RSK_MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e',
}

export const ARGENT_WALLET_DETECTOR_ADDRESS: AddressMap = {
  [SupportedChainId.RSK_MAINNET]: '0xeca4B0bDBf7c55E9b7925919d03CbF8Dc82537E8',
}

export const QUOTER_ADDRESSES: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: RSK_TESTNET_QUOTER_ADDRESSES,
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: RSK_TESTNET_NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.RSK_MAINNET]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
}

export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {
  [SupportedChainId.RSK_MAINNET]: '0x65770b5283117639760beA3F867b69b3697a91dd',
}

export const TICK_LENS_ADDRESSES: AddressMap = {
  [SupportedChainId.RSK_TESTNET]: RSK_TESTNET_TICK_LENS_ADDRESSES,
}
