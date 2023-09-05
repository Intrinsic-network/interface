import { FeeAmount } from '@intrinsic-network/intrinsic-sdk'
import { Trans } from '@lingui/macro'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from 'constants/chains'
import type { ReactNode } from 'react'

export const FEE_AMOUNT_DETAIL: Record<
  FeeAmount,
  { label: string; description: ReactNode; supportedChains: SupportedChainId[] }
> = {
  [FeeAmount.LOWEST]: {
    label: '0.01',
    description: <Trans>Best for very stable pairs.</Trans>,
    supportedChains: [SupportedChainId.RSK_MAINNET, SupportedChainId.RSK_TESTNET],
  },
  [FeeAmount.LOW]: {
    label: '0.05',
    description: <Trans>Best for stable pairs.</Trans>,
    supportedChains: ALL_SUPPORTED_CHAIN_IDS,
  },
  [FeeAmount.MEDIUM]: {
    label: '0.3',
    description: <Trans>Best for most pairs.</Trans>,
    supportedChains: ALL_SUPPORTED_CHAIN_IDS,
  },
  [FeeAmount.HIGH]: {
    label: '1',
    description: <Trans>Best for exotic pairs.</Trans>,
    supportedChains: ALL_SUPPORTED_CHAIN_IDS,
  },
}
