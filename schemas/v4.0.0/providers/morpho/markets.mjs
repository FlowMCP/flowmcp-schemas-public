// Morpho Blue — Market Data via GraphQL
// Free public API, no auth required
// Rate limit: 5,000 requests per 5 minutes

export const main = {
    namespace: 'morpho',
    name: 'Morpho Blue Markets',
    description: 'Query Morpho Blue lending markets via GraphQL — market listings, detailed market data, user positions, and supported chains across Ethereum, Base, Polygon, Arbitrum, and Optimism.',
    version: '4.0.0',
    docs: ['https://docs.morpho.org/tools/offchain/api/get-started/', 'https://docs.morpho.org/tools/offchain/api/morpho/'],
    tags: ['defi', 'lending', 'morpho', 'multichain', 'cacheTtlFrequent'],
    root: 'https://api.morpho.org',
    requiredServerParams: [],
    tools: {
        getMarkets: {
            method: 'POST',
            path: '/graphql',
            description: 'List Morpho Blue markets sorted by supply USD. Filter by chainId. Returns loan/collateral assets, APYs, utilization, and TVL.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum()', options: ['values(1,8453,137,10,42161)', 'default(1)'] } },
                { position: { key: 'first', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(20)'] } }
            ],
            tests: [
                { _description: 'Get top 20 markets on Ethereum', chainId: '1', first: 20 },
                { _description: 'Get top 10 markets on Base', chainId: '8453', first: 10 }
            ]
        },
        getMarketByKey: {
            method: 'POST',
            path: '/graphql',
            description: 'Get detailed data for a single Morpho Blue market by its unique key and chain. Returns full market state including APYs, oracle, and risk parameters.',
            parameters: [
                { position: { key: 'uniqueKey', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['min(10)'] } },
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum()', options: ['values(1,8453,137,10,42161)', 'default(1)'] } }
            ],
            tests: [
                { _description: 'Get USDC/cbBTC market on Ethereum', uniqueKey: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49', chainId: '1' }
            ]
        },
        getUserPositions: {
            method: 'POST',
            path: '/graphql',
            description: 'Get all Morpho Blue market positions for a user address on a specific chain. Returns supply, borrow, collateral, and health factor.',
            parameters: [
                { position: { key: 'userAddress', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{40}$)'] } },
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum()', options: ['values(1,8453,137,10,42161)', 'default(1)'] } },
                { position: { key: 'first', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(20)'] } }
            ],
            tests: [
                { _description: 'Get positions for address on Ethereum', userAddress: '0x0000000000000000000000000000000000000001', chainId: '1', first: 20 }
            ]
        },
        getChains: {
            method: 'POST',
            path: '/graphql',
            description: 'List all chains supported by Morpho Blue with chain IDs and network info.',
            parameters: [],
            tests: [
                { _description: 'Get all supported chains' }
            ]
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getMarkets: {
        preRequest: async ( { struct, payload } ) => {
            const { chainId, first } = payload

            const query = `
            query GetMarkets($chainId: Int!, $first: Int!) {
                markets(
                    first: $first
                    orderBy: SupplyAssetsUsd
                    orderDirection: Desc
                    where: { chainId_in: [$chainId] }
                ) {
                    items {
                        uniqueKey
                        lltv
                        loanAsset { address symbol decimals }
                        collateralAsset { address symbol decimals }
                        state {
                            supplyAssetsUsd
                            borrowAssetsUsd
                            supplyApy
                            borrowApy
                            utilization
                            liquidityAssetsUsd
                        }
                    }
                }
            }
            `

            struct.body = {
                query,
                variables: { chainId: Number( chainId ), first: Number( first ) }
            }

            return { struct }
        }
    },
    getMarketByKey: {
        preRequest: async ( { struct, payload } ) => {
            const { uniqueKey, chainId } = payload

            const query = `
            query GetMarket($uniqueKey: String!, $chainId: Int!) {
                marketByUniqueKey(uniqueKey: $uniqueKey, chainId: $chainId) {
                    uniqueKey
                    lltv
                    loanAsset { address symbol decimals }
                    collateralAsset { address symbol decimals }
                    oracle { address }
                    state {
                        supplyAssetsUsd
                        borrowAssetsUsd
                        supplyApy
                        borrowApy
                        netSupplyApy
                        netBorrowApy
                        utilization
                        liquidityAssetsUsd
                        supplyAssets
                        borrowAssets
                        fee
                    }
                    warnings { type level }
                }
            }
            `

            struct.body = {
                query,
                variables: { uniqueKey, chainId: Number( chainId ) }
            }

            return { struct }
        }
    },
    getUserPositions: {
        preRequest: async ( { struct, payload } ) => {
            const { userAddress, chainId, first } = payload

            const query = `
            query GetUserPositions($userAddress: String!, $chainId: Int!, $first: Int!) {
                marketPositions(
                    first: $first
                    where: {
                        userAddress_in: [$userAddress]
                        chainId_in: [$chainId]
                    }
                ) {
                    items {
                        market {
                            uniqueKey
                            loanAsset { symbol decimals }
                            collateralAsset { symbol decimals }
                            lltv
                        }
                        supplyAssets
                        supplyAssetsUsd
                        borrowAssets
                        borrowAssetsUsd
                        collateral
                        collateralUsd
                        healthFactor
                    }
                }
            }
            `

            struct.body = {
                query,
                variables: {
                    userAddress: userAddress.toLowerCase(),
                    chainId: Number( chainId ),
                    first: Number( first )
                }
            }

            return { struct }
        }
    },
    getChains: {
        preRequest: async ( { struct, payload } ) => {
            const query = `
            query GetChains {
                chains {
                    items {
                        id
                        network
                    }
                }
            }
            `

            struct.body = { query }

            return { struct }
        }
    }
} )
