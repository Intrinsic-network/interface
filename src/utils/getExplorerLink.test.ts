import { ExplorerDataType, getExplorerLink } from './getExplorerLink'

describe('#getExplorerLink', () => {
  it('RSK mainnet transaction', () => {
    expect(getExplorerLink(30, 'abc', ExplorerDataType.TRANSACTION)).toEqual('https://explorer.rsk.co/tx/abc')
  })
  it('RSK mainnet token', () => {
    expect(getExplorerLink(30, 'abc', ExplorerDataType.TOKEN)).toEqual('https://explorer.rsk.co/token/abc')
  })
  it('RSK mainnet address', () => {
    expect(getExplorerLink(30, 'abc', ExplorerDataType.ADDRESS)).toEqual('https://explorer.rsk.co/address/abc')
  })
  it('RSK testnet transaction', () => {
    expect(getExplorerLink(31, 'abc', ExplorerDataType.TRANSACTION)).toEqual('https://explorer.testnet.rsk.co/tx/abc')
  })
  it('RSK testnet token', () => {
    expect(getExplorerLink(31, 'abc', ExplorerDataType.TOKEN)).toEqual('https://explorer.testnet.rsk.co/token/abc')
  })
  it('RSK testnet address', () => {
    expect(getExplorerLink(31, 'abc', ExplorerDataType.ADDRESS)).toEqual('https://explorer.testnet.rsk.co/address/abc')
  })
  it('unrecognized chain id defaults to RSK testnet', () => {
    expect(getExplorerLink(1, 'abc', ExplorerDataType.ADDRESS)).toEqual('https://explorer.testnet.rsk.co/address/abc')
  })
})
