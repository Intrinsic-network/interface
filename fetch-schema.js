/* eslint-disable */
require('dotenv').config({ path: '.env.production' })
const { exec } = require('child_process')
const dataConfig = require('./relay.config')
const thegraphConfig = require('./relay_thegraph.config')
/* eslint-enable */

// TODO: check for alternatives
// const THEGRAPH_API_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
// exec(`get-graphql-schema ${THEGRAPH_API_URL} > ${thegraphConfig.schema}`)
THE_GRAPH_API_KEY='8497beedb1d338d6f442d4a9bf3f3250';
const THEGRAPH_API_URL = `https://gateway.thegraph.com/api/${THE_GRAPH_API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`
exec(`get-graphql-schema ${THEGRAPH_API_URL} > ${thegraphConfig.schema}`)

console.log(process.env.REACT_APP_AWS_API_ENDPOINT)
exec(
  `get-graphql-schema --h Origin=https://app.uniswap.org ${process.env.REACT_APP_AWS_API_ENDPOINT} > ${dataConfig.schema}`
)