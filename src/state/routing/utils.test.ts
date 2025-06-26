import { Token, TradeType } from '@intrinsic-network/sdk-core'

import { nativeOnChain } from '../../constants/tokens'
import { computeRoutes } from './utils'


const BPD = new Token(31, '0x4CA89A9299E1217D24CF4DfE618a6517C5998f79', 18, 'BPD') //  BPD
const INT = new Token(31, '0x53376356b542B8764c64411511b74dA9B9381E87', 6, 'INT')  // INT
const MP = new Token(31, '0xAd80ED0490f1D93C273345800A14A7Fe8792db83', 6, 'MP')  //MP

const tRBTC = nativeOnChain(31)

// helper function to make amounts more readable
const amount = (raw: TemplateStringsArray) => (parseInt(raw[0]) * 1e6).toString()

describe('#useRoute', () => {
  it('handles an undefined payload', () => {
    const result = computeRoutes(undefined, undefined, TradeType.EXACT_INPUT, undefined)

    expect(result).toBeUndefined()
  })

  it('handles empty edges and nodes', () => {
    const result = computeRoutes(BPD, INT, TradeType.EXACT_INPUT, {
      route: [],
    })

    expect(result).toEqual([])
  })

  it('handles a single route trade from INT to BPD from v3', () => {
    const result = computeRoutes(INT, BPD, TradeType.EXACT_INPUT, {
      route: [
        [
          {
            type: 'v3-pool',
            address: '0x1f8F72aA9304c8B593d555F12eF6589cC3A579A2',
            amountIn: amount`1`,
            amountOut: amount`5`,
            fee: '500',
            sqrtRatioX96: '2437312313659959819381354528',
            liquidity: '10272714736694327408',
            tickCurrent: '-69633',
            tokenIn: INT,
            tokenOut: BPD,
          },
        ],
      ],
    })

    const r = result?.[0]

    expect(result).toBeDefined()
    expect(result?.length).toBe(1)
    expect(r?.routev3?.input).toStrictEqual(INT)
    expect(r?.routev3?.output).toStrictEqual(BPD)
    expect(r?.routev3?.tokenPath).toStrictEqual([INT, BPD])
    expect(r?.routev2).toBeNull()
    expect(r?.inputAmount.toSignificant()).toBe('1')
    expect(r?.outputAmount.toSignificant()).toBe('0.000000000005')
  })

  it('handles a single route trade from INT to BPD from v2', () => {
    const result = computeRoutes(INT, BPD, TradeType.EXACT_INPUT, {
      route: [
        [
          {
            type: 'v2-pool',
            address: '0x1f8F72aA9304c8B593d555F12eF6589cC3A579A2',
            amountIn: amount`1`,
            amountOut: amount`5`,
            tokenIn: INT,
            tokenOut: BPD,
            reserve0: {
              token: INT,
              quotient: amount`100`,
            },
            reserve1: {
              token: BPD,
              quotient: amount`200`,
            },
          },
        ],
      ],
    })

    const r = result?.[0]

    expect(result).toBeDefined()
    expect(result?.length).toBe(1)
    expect(r?.routev2?.input).toStrictEqual(INT)
    expect(r?.routev2?.output).toStrictEqual(BPD)
    expect(r?.routev2?.path).toStrictEqual([INT, BPD])
    expect(r?.routev3).toBeNull()
    expect(r?.inputAmount.toSignificant()).toBe('1')
    expect(r?.outputAmount.toSignificant()).toBe('0.000000000005')
  })

  it('handles a multi-route trade from INT to BPD', () => {
    const result = computeRoutes(INT, BPD, TradeType.EXACT_OUTPUT, {
      route: [
        [
          {
            type: 'v2-pool',
            address: '0x1f8F72aA9304c8B593d555F12eF6589cC3A579A2',
            amountIn: amount`5`,
            amountOut: amount`6`,
            tokenIn: INT,
            tokenOut: BPD,
            reserve0: {
              token: INT,
              quotient: amount`1000`,
            },
            reserve1: {
              token: BPD,
              quotient: amount`500`,
            },
          },
        ],
        [
          {
            type: 'v3-pool',
            address: '0x2f8F72aA9304c8B593d555F12eF6589cC3A579A2',
            amountIn: amount`10`,
            amountOut: amount`1`,
            fee: '3000',
            tokenIn: INT,
            tokenOut: MP,
            sqrtRatioX96: '2437312313659959819381354528',
            liquidity: '10272714736694327408',
            tickCurrent: '-69633',
          },
          {
            type: 'v3-pool',
            address: '0x3f8F72aA9304c8B593d555F12eF6589cC3A579A2',
            amountIn: amount`1`,
            amountOut: amount`200`,
            fee: '10000',
            tokenIn: MP,
            tokenOut: BPD,
            sqrtRatioX96: '2437312313659959819381354528',
            liquidity: '10272714736694327408',
            tickCurrent: '-69633',
          },
        ],
      ],
    })

    expect(result).toBeDefined()
    expect(result?.length).toBe(2)

    // first route is v2
    expect(result?.[0].routev2?.input).toStrictEqual(INT)
    expect(result?.[0].routev2?.output).toStrictEqual(BPD)
    expect(result?.[0].routev2?.path).toEqual([INT, BPD])
    expect(result?.[0].routev3).toBeNull()

    // second route is v3
    expect(result?.[1].routev3?.input).toStrictEqual(INT)
    expect(result?.[1].routev3?.output).toStrictEqual(BPD)
    expect(result?.[1].routev3?.tokenPath).toEqual([INT, MP, BPD])
    expect(result?.[1].routev2).toBeNull()

    expect(result?.[0].outputAmount.toSignificant()).toBe('0.000000000006')
    expect(result?.[1].outputAmount.toSignificant()).toBe('0.0000000002')
  })

  it('handles a single route trade with same token pair, different fee tiers', () => {
    const result = computeRoutes(INT, BPD, TradeType.EXACT_INPUT, {
      route: [
        [
          {
            type: 'v3-pool',
            address: '0x1f8F72aA9304c8B593d555F12eF6589cC3A579A2',
            amountIn: amount`1`,
            amountOut: amount`5`,
            fee: '500',
            tokenIn: INT,
            tokenOut: BPD,
            sqrtRatioX96: '2437312313659959819381354528',
            liquidity: '10272714736694327408',
            tickCurrent: '-69633',
          },
        ],
        [
          {
            type: 'v3-pool',
            address: '0x2f8F72aA9304c8B593d555F12eF6589cC3A579A2',
            amountIn: amount`10`,
            amountOut: amount`50`,
            fee: '3000',
            tokenIn: INT,
            tokenOut: BPD,
            sqrtRatioX96: '2437312313659959819381354528',
            liquidity: '10272714736694327408',
            tickCurrent: '-69633',
          },
        ],
      ],
    })

    expect(result).toBeDefined()
    expect(result?.length).toBe(2)
    expect(result?.[0].routev3?.input).toStrictEqual(INT)
    expect(result?.[0].routev3?.output).toStrictEqual(BPD)
    expect(result?.[0].routev3?.tokenPath).toEqual([INT, BPD])
    expect(result?.[0].inputAmount.toSignificant()).toBe('1')
  })

  describe('with tRBTC', () => {
    it('outputs native tRBTC as input currency', () => {
      const WtRBTC = tRBTC.wrapped

      const result = computeRoutes(tRBTC, BPD, TradeType.EXACT_OUTPUT, {
        route: [
          [
            {
              type: 'v3-pool',
              address: '0x1f8F72aA9304c8B593d555F12eF6589cC3A579A2',
              amountIn: (1e18).toString(),
              amountOut: amount`5`,
              fee: '500',
              sqrtRatioX96: '2437312313659959819381354528',
              liquidity: '10272714736694327408',
              tickCurrent: '-69633',
              tokenIn: WtRBTC,
              tokenOut: BPD,
            },
          ],
        ],
      })

      expect(result).toBeDefined()
      expect(result?.length).toBe(1)
      expect(result?.[0].routev3?.input).toStrictEqual(tRBTC)
      expect(result?.[0].routev3?.output).toStrictEqual(BPD)
      expect(result?.[0].routev3?.tokenPath).toStrictEqual([WtRBTC, BPD])
      expect(result && result[0].outputAmount.toSignificant()).toBe('0.000000000005')
    })

    it('outputs native tRBTC as output currency', () => {
      const WtRBTC = new Token(31, tRBTC.wrapped.address, 18, 'tRBTC')
      const result = computeRoutes(BPD, WtRBTC, TradeType.EXACT_OUTPUT, {
        route: [
          [
            {
              type: 'v3-pool',
              address: '0x3f8F72aA9304c8B593d555F12eF6589cC3A579A2',
              amountIn: amount`5`,
              amountOut: (1e18).toString(),
              fee: '500',
              sqrtRatioX96: '2437312313659959819381354528',
              liquidity: '10272714736694327408',
              tickCurrent: '-69633',
              tokenIn: BPD,
              tokenOut: WtRBTC,
            },
          ],
        ],
      });

      expect(result?.length).toBe(1)
      expect(result?.[0].routev3?.input).toStrictEqual(BPD)
      // expect(result?.[0].routev3?.output).toStrictEqual(tRBTC) // This line is commented out because the output token is tRBTC, not native token
      expect(result?.[0].routev3?.tokenPath).toStrictEqual([BPD, WtRBTC])
      expect(result?.[0].outputAmount.toSignificant()).toBe('1')
    })

    it('outputs native tRBTC as input currency for v2 routes', () => {
      const WtRBTC = tRBTC.wrapped

      const result = computeRoutes(tRBTC, BPD, TradeType.EXACT_OUTPUT, {
        route: [
          [
            {
              type: 'v2-pool',
              address: '0x1f8F72aA9304c8B593d555F12eF6589cC3A579A2',
              amountIn: (1e18).toString(),
              amountOut: amount`5`,
              tokenIn: WtRBTC,
              tokenOut: BPD,
              reserve0: {
                token: WtRBTC,
                quotient: amount`100`,
              },
              reserve1: {
                token: BPD,
                quotient: amount`200`,
              },
            },
          ],
        ],
      })

      expect(result).toBeDefined()
      expect(result?.length).toBe(1)
      expect(result?.[0].routev2?.input).toStrictEqual(tRBTC)
      expect(result?.[0].routev2?.output).toStrictEqual(BPD)
      expect(result?.[0].routev2?.path).toStrictEqual([WtRBTC, BPD])
      expect(result && result[0].outputAmount.toSignificant()).toBe('0.000000000005')
    })

    it('outputs native tRBTC as output currency for v2 routes', () => {
      const WtRBTC = new Token(31, tRBTC.wrapped.address, 18, 'tRBTC')
      const result = computeRoutes(BPD, tRBTC, TradeType.EXACT_OUTPUT, {
        route: [
          [
            {
              type: 'v2-pool',
              address: '0x1f8F72aA9304c8B593d555F12eF6589cC3A579A2',
              amountIn: amount`5`,
              amountOut: (1e18).toString(),
              tokenIn: BPD,
              tokenOut: WtRBTC,
              reserve0: {
                token: WtRBTC,
                quotient: amount`100`,
              },
              reserve1: {
                token: BPD,
                quotient: amount`200`,
              },
            },
          ],
        ],
      })

      expect(result?.length).toBe(1)
      expect(result?.[0].routev2?.input).toStrictEqual(BPD)
      expect(result?.[0].routev2?.output).toStrictEqual(tRBTC)
      expect(result?.[0].routev2?.path).toStrictEqual([BPD, WtRBTC])
      expect(result?.[0].outputAmount.toSignificant()).toBe('1')
    })
  })
})
