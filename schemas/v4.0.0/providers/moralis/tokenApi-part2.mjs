// Split from moralis-com/eth/tokenApi.mjs
// Part 2 of 2
// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// 16 routes (v2 max: 8) — needs splitting
// Import: import { EVM_CHAINS } from '../../_shared/evmChains.mjs'
// Module-level code: 49 lines

export const main = {
    namespace: 'moralis',
    name: 'Moralis tokenApi API (Part 2)',
    description: 'ERC20 token analytics via Moralis — metadata, holder analysis, transfer history, DEX swap transactions, sniper detection, liquidity reserves, wallet balances, approvals, and market rankings across EVM chains.',
    version: '4.0.0',
    docs: ['https://docs.moralis.com'],
    tags: ['evm', 'tokens', 'balances', 'cacheTtlFrequent'],
    sharedLists: [
        { ref: 'evmChains', version: '3.1.0', filter: { key: 'moralisChainSlug', exists: true } }
    ],
    root: 'https://deep-index.moralis.io/api/v2.2',
    requiredServerParams: ['MORALIS_API_KEY'],
    headers: {
        'X-API-Key': '{{MORALIS_API_KEY}}'
    },
    tools: {
        '/erc20/:address/stats': {
            method: 'GET',
            path: '/erc20/:address/stats',
            description: 'Get the stats for a erc20 token via Moralis — query by address. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get the stats for a erc20 token via Moralis — query by addre","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/erc20/:address/transfers': {
            method: 'GET',
            path: '/erc20/:address/transfers',
            description: 'Get ERC20 token transactions from a contract ordered by block number in descending order.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'from_block', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'to_block', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'from_date', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'to_date', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'order', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(ASC,DESC)', options: ['optional()'] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get ERC20 token transactions from a contract ordered by bloc","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/market-data/erc20s/top-tokens': {
            method: 'GET',
            path: '/market-data/erc20s/top-tokens',
            description: 'Get the top ERC20 tokens by market cap via Moralis. Returns structured JSON response data.',
            parameters: [],
            tests: [{"_description":"Get the top ERC20 tokens by market cap via Moralis. Returns "}]
        },
        '/erc20/:address/top-gainers': {
            method: 'GET',
            path: '/erc20/:address/top-gainers',
            description: 'Retrieves a list of the top profitable wallets for a specific ERC20 token. Required: chain, address. Optional filters: days.',
            parameters: [
                { position: { key: 'days', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Retrieves a list of the top profitable wallets for a specifi","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/wallets/:address/approvals': {
            method: 'GET',
            path: '/wallets/:address/approvals',
            description: 'Retrieve active ERC20 token approvals for the specified wallet address. Required: chain, address. Optional filters: cursor, limit.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Retrieve active ERC20 token approvals for the specified wall","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/wallets/:address/tokens': {
            method: 'GET',
            path: '/wallets/:address/tokens',
            description: 'Get token balances for a specific wallet address and their token prices in USD. via Moralis.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'to_block', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'token_addresses', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'array()', options: ['optional()'] } },
                { position: { key: 'exclude_spam', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(false,true)', options: ['optional()'] } },
                { position: { key: 'exclude_unverified_contracts', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(false,true)', options: ['optional()'] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'exclude_native', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(false,true)', options: ['optional()'] } },
                { position: { key: 'max_token_inactivity', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'min_pair_side_liquidity_usd', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get token balances for a specific wallet address and their t","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/:address/erc20': {
            method: 'GET',
            path: '/:address/erc20',
            description: 'Get token balances for a specific wallet address via Moralis — query by address. Supports to_block, token_addresses, exclude_spam filters.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'to_block', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'token_addresses', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'array()', options: ['optional()'] } },
                { position: { key: 'exclude_spam', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(false,true)', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get token balances for a specific wallet address via Moralis","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/:address/erc20/transfers': {
            method: 'GET',
            path: '/:address/erc20/transfers',
            description: 'Get ERC20 token transactions ordered by block number in descending order. via Moralis.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'contract_addresses', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'array()', options: ['optional()'] } },
                { position: { key: 'from_block', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'to_block', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'from_date', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'to_date', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'order', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(ASC,DESC)', options: ['optional()'] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get ERC20 token transactions ordered by block number in desc","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        }
    }
}
