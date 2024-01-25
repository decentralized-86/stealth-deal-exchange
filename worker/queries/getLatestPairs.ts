const query = `
query GetLatestPairs($networkFilter: [Int!], $exchangeFilter: [String!], $limit: Int, $minLiquidityFilter: Int, $cursor: String) {
  getLatestPairs(
    networkFilter: $networkFilter
    exchangeFilter: $exchangeFilter
    limit: $limit
    minLiquidityFilter: $minLiquidityFilter
    cursor: $cursor
  ) {
    cursor
    items {
      address
      exchangeHash
      id
      initialPriceUsd
      liquidAt
      liquidity
      liquidityToken
      networkId
      newToken
      nonLiquidityToken
      oldToken
      priceChange
      priceUsd
      transactionHash
      token0 {
        address
        currentPoolAmount
        decimals
        id
        initialPoolAmount
        name
        networkId
        pairId
        poolVariation
        symbol
        __typename
      }
      token1 {
        address
        currentPoolAmount
        decimals
        id
        initialPoolAmount
        name
        networkId
        pairId
        poolVariation
        symbol
        __typename
      }
      __typename
    }
    __typename
  }
}
`;

export default query;
