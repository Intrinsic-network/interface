/**
 * Helpful Resources
 * https://github.com/sibelius/create-react-app-relay-modern/blob/master/src/relay/fetchQuery.js
 * https://github.com/relay-tools/relay-compiler-language-typescript/blob/master/example/ts/app.tsx
 */

import { SupportedChainId } from 'constants/chains'
import { Variables } from 'react-relay'
import { GraphQLResponse, ObservableFromValue, RequestParameters } from 'relay-runtime'

import store, { AppState } from '../../state/index'

const API_KEY = '8497beedb1d338d6f442d4a9bf3f3250';
// const THEGRAPH_API_KEY = process.env.REACT_APP_THEGRAPH_API_KEY;

// if (!THEGRAPH_API_KEY) {
//   throw new Error('REACT_APP_THEGRAPH_API_KEY is not defined in environment variables');
// }

const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [SupportedChainId.RSK_MAINNET]: `https://gateway.thegraph.com/api/subgraphs/id/BYMVt5pKLd8ATPhHD25BdD2K9RTyCes5q7jjd3Z5rWXy`,
  [SupportedChainId.RSK_TESTNET]: `https://gateway.thegraph.com/api/subgraphs/id/BYMVt5pKLd8ATPhHD25BdD2K9RTyCes5q7jjd3Z5rWXy`,
}

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  Accept: 'application/json',
  'Content-type': 'application/json',
}

// Define a function that fetches the results of a request (query/mutation/etc)
// and returns its results as a Promise:
const fetchQuery = (params: RequestParameters, variables: Variables): ObservableFromValue<GraphQLResponse> => {
  const chainId = (store.getState() as AppState).application.chainId

  const subgraphUrl =
    chainId && CHAIN_SUBGRAPH_URL[chainId]
      ? CHAIN_SUBGRAPH_URL[chainId]
      : CHAIN_SUBGRAPH_URL[SupportedChainId.RSK_MAINNET]

  const body = JSON.stringify({
    query: params.text, // GraphQL text from input
    variables,
  })

  const response = fetch(subgraphUrl, {
    method: 'POST',
    headers,
    body,
  }).then((res) => res.json())

  return response
}

export default fetchQuery
