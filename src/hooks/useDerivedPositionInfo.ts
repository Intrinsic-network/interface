import { Pool, Position } from '@intrinsic-network/intrinsic-sdk'
import { usePool } from 'hooks/usePools'
import { PositionDetails } from 'types/position'

import { useCurrency } from './Tokens'

export function useDerivedPositionInfo(positionDetails: PositionDetails | undefined): {
  position: Position | undefined
  pool: Pool | undefined
} {
  const currency0 = useCurrency(positionDetails?.token0)
  const currency1 = useCurrency(positionDetails?.token1)

  // construct pool data
  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, positionDetails?.fee)

  let position = undefined as any
  if (pool && positionDetails) {
    position = new Position({
      pool,
      liquidity: positionDetails.liquidity.toString(),
      tickLower: positionDetails.tickLower,
      tickUpper: positionDetails.tickUpper,
    })
  }

  return {
    position,
    pool: pool ?? undefined,
  }
}
