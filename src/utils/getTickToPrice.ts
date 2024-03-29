import { tickToPrice } from '@intrinsic-network/intrinsic-sdk'
import { Price, Token } from '@intrinsic-network/sdk-core'

export function getTickToPrice(baseToken?: Token, quoteToken?: Token, tick?: number): Price<Token, Token> | undefined {
  if (!baseToken || !quoteToken || typeof tick !== 'number') {
    return undefined
  }
  return tickToPrice(baseToken, quoteToken, tick) as any
}
