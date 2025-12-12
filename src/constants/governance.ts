import { GOVERNANCE_BRAVO_ADDRESSES, INT_ADDRESS,TIMELOCK_ADDRESS } from './addresses'
import { SupportedChainId } from './chains'

export const COMMON_CONTRACT_NAMES: Record<number, { [address: string]: string }> = {
  [SupportedChainId.RSK_MAINNET]: {
    [INT_ADDRESS[SupportedChainId.RSK_MAINNET]]: 'INT',
    [TIMELOCK_ADDRESS[SupportedChainId.RSK_MAINNET]]: 'Timelock',
    [GOVERNANCE_BRAVO_ADDRESSES[SupportedChainId.RSK_MAINNET]]: 'Governance',
    // '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e': 'ENS Registry',
    // '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41': 'ENS Public Resolver',
    // '0xf754A7E347F81cFdc70AF9FbCCe9Df3D826360FA': 'Franchiser Factory',
  },
}

// RSK's average block time is 30 seconds
// https://dev.rootstock.io/rsk/architecture/mining/implementation-guide/
export const DEFAULT_AVERAGE_BLOCK_TIME_IN_SECS = 30

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS: { [chainId: number]: number } = {
  30: DEFAULT_AVERAGE_BLOCK_TIME_IN_SECS,
  31: DEFAULT_AVERAGE_BLOCK_TIME_IN_SECS,
}

export const LATEST_GOVERNOR_INDEX = 0
