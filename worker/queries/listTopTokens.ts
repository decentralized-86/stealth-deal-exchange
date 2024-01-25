const query = `
query ListTopTokens($networkFilter: [Int!], $resolution: String, $limit: Int) {
  listTopTokens(
    networkFilter: $networkFilter
    resolution: $resolution
    limit: $limit
  ) {
    createdAt
    lastTransaction
    marketCap
    txnCount1
    txnCount4
    txnCount12
    txnCount24
    uniqueBuys1
    uniqueBuys4
    uniqueBuys12
    uniqueBuys24
    uniqueSells1
    uniqueSells4
    uniqueSells12
    uniqueSells24
    ...BaseTokenWithMetadata
    __typename
  }
}

fragment BaseTokenWithMetadata on TokenWithMetadata {
  address
  decimals
  exchanges {
    ...ExchangeModel
    __typename
  }
  id
  imageLargeUrl
  imageSmallUrl
  imageThumbUrl
  liquidity
  name
  networkId
  price
  priceChange
  priceChange1
  priceChange12
  priceChange24
  priceChange4
  quoteToken
  resolution
  symbol
  topPairId
  volume
  __typename
}

fragment ExchangeModel on Exchange {
  address
  color
  exchangeVersion
  id
  name
  networkId
  tradeUrl
  iconUrl
  enabled
  __typename
}
`;

export default query;
