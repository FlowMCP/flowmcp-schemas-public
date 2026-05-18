// Split from moralis-com/eth/nftApi.mjs
// Part 1 of 3
// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// 20 routes (v2 max: 8) — needs splitting
// Import: import { EVM_CHAINS } from '../../_shared/evmChains.mjs'
// Module-level code: 26 lines

export const main = {
    namespace: 'moralis',
    name: 'Moralis nftApi API (Part 1)',
    description: 'Comprehensive NFT data via Moralis — collection stats, metadata, ownership, transfers, trades, traits, and market rankings across 30+ EVM chains.',
    version: '4.0.0',
    docs: ['https://docs.moralis.com'],
    tags: ['evm', 'nft', 'collectibles', 'cacheTtlFrequent'],
    sharedLists: [
        { ref: 'evmChains', version: '3.1.0', filter: { key: 'moralisChainSlug', exists: true } }
    ],
    root: 'https://deep-index.moralis.io/api/v2.2',
    requiredServerParams: ['MORALIS_API_KEY'],
    headers: {
        'X-API-Key': '{{MORALIS_API_KEY}}'
    },
    tools: {
        '/market-data/nfts/top-collections': {
            method: 'GET',
            path: '/market-data/nfts/top-collections',
            description: 'Get the top NFT collections by market cap via Moralis. Returns structured JSON response data.',
            parameters: [],
            tests: [{"_description":"Get the top NFT collections by market cap via Moralis. Retur"}]
        },
        '/market-data/nfts/hottest-collections': {
            method: 'GET',
            path: '/market-data/nfts/hottest-collections',
            description: 'Get the top NFT collections by trading volume via Moralis. Returns structured JSON response data.',
            parameters: [],
            tests: [{"_description":"Get the top NFT collections by trading volume via Moralis. R"}]
        },
        '/nft/:address': {
            method: 'GET',
            path: '/nft/:address',
            description: 'Get NFTs for a given contract address, including metadata for all NFTs (where available).',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'format', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'totalRanges', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'range', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'normalizeMetadata', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(false,true)', options: ['optional()'] } },
                { position: { key: 'media_items', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(false,true)', options: ['optional()'] } },
                { position: { key: 'include_prices', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(false,true)', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get NFTs for a given contract address, including metadata fo","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/nft/:address/stats': {
            method: 'GET',
            path: '/nft/:address/stats',
            description: 'Get the stats for a nft collection address via Moralis — query by address. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get the stats for a nft collection address via Moralis — que","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/nft/:address/metadata': {
            method: 'GET',
            path: '/nft/:address/metadata',
            description: 'Get the collection / contract level metadata for a given contract (name, symbol, base token URI).',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'include_prices', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(false,true)', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get the collection / contract level metadata for a given con","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/nft/:address/transfers': {
            method: 'GET',
            path: '/nft/:address/transfers',
            description: 'Get transfers of NFTs for a given contract and other parameters. Required: chain, address. Optional filters: from_block, to_block, from_date, to_date, format, limit, order, cursor, include_prices.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'from_block', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'to_block', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'from_date', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'to_date', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'format', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'order', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(ASC,DESC)', options: ['optional()'] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'include_prices', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(false,true)', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get transfers of NFTs for a given contract and other paramet","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/nft/:address/:token_id': {
            method: 'GET',
            path: '/nft/:address/:token_id',
            description: 'Get NFT data, including metadata (where available), for the given NFT token ID and contract address.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'format', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(decimal,hex)', options: ['optional()'] } },
                { position: { key: 'normalizeMetadata', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(false,true)', options: ['optional()'] } },
                { position: { key: 'media_items', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(false,true)', options: ['optional()'] } },
                { position: { key: 'include_prices', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(false,true)', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'token_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get NFT data, including metadata (where available), for the ","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045","token_id":"1"}]
        },
        '/nft/:address/owners': {
            method: 'GET',
            path: '/nft/:address/owners',
            description: 'Get owners of NFTs for a given contract via Moralis — query by address. Supports format, limit, cursor filters.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'format', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'normalizeMetadata', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(false,true)', options: ['optional()'] } },
                { position: { key: 'media_items', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(false,true)', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get owners of NFTs for a given contract via Moralis — query ","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        }
    }
}
