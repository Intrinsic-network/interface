import { SupportedChainId } from 'constants/chains'
import useHttpLocations from 'hooks/useHttpLocations'
import { useMemo } from 'react'
import { isAddress } from 'utils'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import { NATIVE_CHAIN_ID } from '../../constants/tokens'

type Network = 'ethereum' | 'arbitrum' | 'optimism' | 'polygon'

function chainIdToNetworkName(chainId: SupportedChainId = SupportedChainId.RSK_MAINNET): Network {
  return 'ethereum'
}

export function getNativeLogoURI(chainId: SupportedChainId = SupportedChainId.RSK_MAINNET): string {
  return EthereumLogo
}

export function getTokenLogoURI(
  address: string,
  chainId: SupportedChainId = SupportedChainId.RSK_MAINNET
): string | void {
  const networkName = chainIdToNetworkName(chainId)
  const networksWithUrls = [SupportedChainId.RSK_MAINNET, SupportedChainId.RSK_TESTNET]
  if (networksWithUrls.includes(chainId)) {
    return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${networkName}/assets/${address}/logo.png`
  }
}

export default function useCurrencyLogoURIs(
  currency:
    | {
        isNative?: boolean
        isToken?: boolean
        address?: string
        chainId: number
        logoURI?: string
      }
    | null
    | undefined
): string[] {
  const locations = useHttpLocations(currency?.logoURI)
  return useMemo(() => {
    const logoURIs = [...locations]
    if (currency) {
      if (currency.isNative || currency.address === NATIVE_CHAIN_ID) {
        logoURIs.push(getNativeLogoURI(currency.chainId))
      } else if (currency.isToken || currency.address) {
        const checksummedAddress = isAddress(currency.address)
        const logoURI = checksummedAddress && getTokenLogoURI(checksummedAddress, currency.chainId)
        if (logoURI) {
          logoURIs.push(logoURI)
        }
      }
    }
    return logoURIs
  }, [currency, locations])
}
