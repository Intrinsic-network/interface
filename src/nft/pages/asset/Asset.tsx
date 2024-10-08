import { PageName } from 'analytics/constants'
import { Trace } from 'analytics/Trace'
import { NftGraphQlVariant, useNftGraphQlFlag } from 'featureFlags/flags/nftGraphQl'
import { useDetailsQuery } from 'graphql/data/nft/Details'
import { AssetDetails } from 'nft/components/details/AssetDetails'
import { AssetPriceDetails } from 'nft/components/details/AssetPriceDetails'
import { fetchSingleAsset } from 'nft/queries'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const AssetContainer = styled.div`
  display: flex;
  padding-right: 116px;
  padding-left: 116px;
`

const Asset = () => {
  const { tokenId = '', contractAddress = '' } = useParams()
  const isNftGraphQl = useNftGraphQlFlag() === NftGraphQlVariant.Enabled

  const { data } = useQuery(
    ['assetDetail', contractAddress, tokenId],
    () => fetchSingleAsset({ contractAddress, tokenId }),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  )
  const gqlData = useDetailsQuery(contractAddress, tokenId)

  const asset = useMemo(() => (isNftGraphQl ? gqlData && gqlData[0] : data && data[0]), [data, gqlData, isNftGraphQl])
  const collection = useMemo(
    () => (isNftGraphQl ? gqlData && gqlData[1] : data && data[1]),
    [data, gqlData, isNftGraphQl]
  )

  return (
    <>
      <Trace
        page={PageName.NFT_DETAILS_PAGE}
        properties={{ collection_address: contractAddress, token_id: tokenId }}
        shouldLogImpression
      >
        {asset && collection ? (
          <AssetContainer>
            <AssetDetails collection={collection} asset={asset} />
            <AssetPriceDetails collection={collection} asset={asset} />
          </AssetContainer>
        ) : (
          <div>Holder for loading ...</div>
        )}
      </Trace>
    </>
  )
}

export default Asset
