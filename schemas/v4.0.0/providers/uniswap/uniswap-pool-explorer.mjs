// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Import: import { EVM_CHAINS } from '../_shared/evmChains.mjs'
// Module-level code: 12 lines

export const main = {
    namespace: 'uniswap',
    name: 'Uniswap Pool Explorer',
    description: 'Query Uniswap V2, V3, and V4 pools for a given token address or pool ID using The Graph subgraphs.',
    version: '4.0.0',
    docs: ['https://thegraph.com/explorer/subgraphs?id=A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum', 'https://thegraph.com/explorer'],
    tags: ['production', 'cacheTtlDaily'],
    sharedLists: [
        { ref: 'evmChains', version: '3.1.0' }
    ],
    root: 'https://gateway.thegraph.com',
    requiredServerParams: ['THEGRAPH_API_KEY'],
    headers: {
        Authorization: 'Bearer {{THEGRAPH_API_KEY}}'
    },
    tools: {
        getTokenPools: {
            method: 'POST',
            path: '/api/{{THEGRAPH_API_KEY}}/subgraphs/id/--subgraph-id--',
            description: 'Returns Uniswap V3 pools for a given token address using TheGraph subgraph. Required: token_address, chain.',
            parameters: [
                { position: { key: 'token_address', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['length(42)'] } },
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(ETHEREUM_MAINNET,ARBITRUM_MAINNET,OPTIMISM_MAINNET,POLYGON_MAINNET,BASE_MAINNET,BINANCE_MAINNET,CELO_MAINNET)', options: ['default(ETHEREUM_MAINNET)'] } }
            ],
            output: {mimeType:'application/json',schema:{type:'object',properties:{data:{type:'object',properties:{pools:{type:'array',items:{type:'object',properties:{id:{type:'string'},token0:{type:'object'},token1:{type:'object'},volumeUSD:{type:'string'}}}}}}}}},
            tests: [
                {
                    _description: 'Query USDC pools on Ethereum',
                    token_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                    chain: 'ETHEREUM_MAINNET'
                }
            ],
        },
        getPoolData: {
            method: 'POST',
            path: '/api/{{THEGRAPH_API_KEY}}/subgraphs/id/--subgraph-id--',
            description: 'Fetch details for a specific Uniswap pool by ID using TheGraph subgraph. Required: pool_id, chain.',
            parameters: [
                { position: { key: 'pool_id', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['length(42)'] } },
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(ETHEREUM_MAINNET,ARBITRUM_MAINNET,OPTIMISM_MAINNET,POLYGON_MAINNET,BASE_MAINNET,BINANCE_MAINNET,CELO_MAINNET)', options: ['default(ETHEREUM_MAINNET)'] } }
            ],
            output: {mimeType:'application/json',schema:{type:'object',properties:{data:{type:'object',properties:{pool:{type:'object',properties:{id:{type:'string'},token0:{type:'object'},token1:{type:'object'},liquidity:{type:'string'},volumeUSD:{type:'string'},feeTier:{type:'string'}}}}}}}},
            tests: [
                {
                    _description: 'Get data for USDC/ETH pool',
                    pool_id: '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8',
                    chain: 'ETHEREUM_MAINNET'
                }
            ],
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const EVM_CHAINS = sharedLists['evmChains']

    const theGraphChains = EVM_CHAINS
        .filter( ( c ) => c.theGraphSlug !== undefined )
    const aliasToSlug = theGraphChains
        .reduce( ( acc, c ) => {
            acc[ c.alias ] = c.theGraphSlug
            return acc
        }, {} )
    const poolExplorerAliases = [
        'ETHEREUM_MAINNET', 'ARBITRUM_MAINNET', 'OPTIMISM_MAINNET',
        'POLYGON_MAINNET', 'BASE_MAINNET', 'BINANCE_MAINNET', 'CELO_MAINNET'
    ]
    const poolExplorerChainEnum = 'enum(' + poolExplorerAliases.join( ',' ) + ')'

    return {
        getTokenPools: {
            preRequest: async ( { struct, payload } ) => {
                const { token_address, chain } = payload;

                // Uniswap V3 subgraph IDs for different chains
                const SUBGRAPH_IDS = {
                ethereum: "5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV",
                arbitrum: "FbCGRftH4a3yZugY7TnbYgPJVEv2LvMT6oF1fxPe9aJM",
                optimism: "Cghf4LfVqPiFw6fp6Y5X5Ubc8UpmUhSfJL82zwiBFLaj",
                polygon: "3hCPRGf4z88VC5rsBKU5AA9FBBq5nF3jbKJG7VZCbhjm",
                base: "GqzP4Xaehti8KSfQmv3ZctFSjnSUYZ4En5NRsiTbvZpz",
                bsc: "A1fvJWQLBeUAggX2WQTMm3FKjXTekNXo77ZySun4YN2m",
                celo: "ESdrTJ3twMwWVoQ1hUE2u7PugEHX3QkenudD6aXCkDQ4"
                };

                struct.url = struct.url.replace('--subgraph-id--', SUBGRAPH_IDS[chain]);

                const query = `
                query GetTokenPools($tokenAddress: String!) {
                pools(
                where: {
                or: [
                { token0: $tokenAddress },
                { token1: $tokenAddress }
                ]
                }
                orderBy: volumeUSD
                orderDirection: desc
                first: 50
                ) {
                id
                token0 { symbol id }
                token1 { symbol id }
                feeTier
                volumeUSD
                totalValueLockedUSD
                txCount
                createdAtTimestamp
                }
                }
                `;

                struct.body = {
                query,
                variables: { tokenAddress: token_address.toLowerCase() }
                };

                return { struct }
            }
        },
        getPoolData: {
            preRequest: async ( { struct, payload } ) => {
                const { pool_id, chain } = payload;

                const SUBGRAPH_IDS = {
                ethereum: "5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV",
                arbitrum: "FbCGRftH4a3yZugY7TnbYgPJVEv2LvMT6oF1fxPe9aJM",
                optimism: "Cghf4LfVqPiFw6fp6Y5X5Ubc8UpmUhSfJL82zwiBFLaj",
                polygon: "3hCPRGf4z88VC5rsBKU5AA9FBBq5nF3jbKJG7VZCbhjm",
                base: "GqzP4Xaehti8KSfQmv3ZctFSjnSUYZ4En5NRsiTbvZpz",
                bsc: "A1fvJWQLBeUAggX2WQTMm3FKjXTekNXo77ZySun4YN2m",
                celo: "ESdrTJ3twMwWVoQ1hUE2u7PugEHX3QkenudD6aXCkDQ4"
                };

                struct.url = struct.url.replace('--subgraph-id--', SUBGRAPH_IDS[chain]);

                const query = `
                query GetPoolData($poolId: String!) {
                pool(id: $poolId) {
                id
                token0 {
                symbol
                id
                name
                decimals
                }
                token1 {
                symbol
                id
                name
                decimals
                }
                feeTier
                volumeUSD
                totalValueLockedUSD
                txCount
                createdAtTimestamp
                createdAtBlockNumber
                tick
                sqrtPrice
                liquidity
                }
                }
                `;

                struct.body = {
                query,
                variables: { poolId: pool_id.toLowerCase() }
                };

                return { struct }
            }
        }
    }
}
