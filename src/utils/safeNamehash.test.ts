import { namehash } from '@ethersproject/hash'

import { safeNamehash } from './safeNamehash'

describe('#safeNamehash', () => {
  const emoji = '🤔'

  it('#namehash works with emoji', () => {
    const result = namehash(emoji)
    expect(typeof result).toBe('string')
    expect(result).toHaveLength(66) // 0x + 64 hex characters
  })

  // suppress console.debug for the next test
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, 'debug').mockImplementation(() => {})
  })

  it('works', () => {
    const result = safeNamehash(emoji)
    expect(typeof result).toBe('string')
    expect(result).toHaveLength(66) // 0x + 64 hex characters
  })
})
