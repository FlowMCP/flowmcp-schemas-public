// Schema for #181 -- Avnu Starknet DEX Aggregator
// No API key required -- fully public

export const main = {
    namespace: 'avnu',
    name: 'Avnu Starknet DEX',
    description: 'Get swap quotes, token listings and liquidity sources on Starknet via Avnu DEX aggregator. No API key required.',
    version: '4.0.0',
    docs: ['https://doc.avnu.fi/', 'https://starknet.api.avnu.fi/'],
    tags: ['starknet', 'defi', 'swap', 'cacheTtlRealtime'],
    root: 'https://starknet.api.avnu.fi',
    tools: {
        getSwapQuote: {
            method: 'GET',
            path: '/swap/v2/quotes',
            description: 'Get optimal swap quotes on Starknet. Amounts must be in hex format (e.g. 0xde0b6b3a7640000 for 1 ETH). Returns routes and buy amount.',
            parameters: [
                { position: { key: 'sellTokenAddress', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(3)'] }, description: 'Starknet contract address of the token to sell (hex format, e.g. 0x049d36...)' },
                { position: { key: 'buyTokenAddress', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(3)'] }, description: 'Starknet contract address of the token to buy (hex format, e.g. 0x053c91...)' },
                { position: { key: 'sellAmount', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(3)', 'regex(^0x[a-fA-F0-9]+$)'] }, description: 'Amount to sell in hex-encoded wei (e.g. 0xde0b6b3a7640000 for 1 ETH with 18 decimals)' }
            ],
            output: { mimeType: 'application/json', schema: { type: 'array', items: { type: 'object', properties: { quoteId: { type: 'string' }, sellTokenAddress: { type: 'string' }, buyTokenAddress: { type: 'string' }, sellAmount: { type: 'string' }, buyAmount: { type: 'string' }, buyAmountWithoutFees: { type: 'string' }, sellAmountInUsd: { type: 'number' }, buyAmountInUsd: { type: 'number' }, gasFeesInUsd: { type: 'number' }, avnuFeesInUsd: { type: 'number' }, integratorFeesInUsd: { type: 'number' }, priceRatioUsd: { type: 'number' }, estimatedAmount: { type: 'boolean' }, chainId: { type: 'string' }, blockNumber: { type: 'string' }, routes: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, address: { type: 'string' }, percent: { type: 'number' }, sellTokenAddress: { type: 'string' }, buyTokenAddress: { type: 'string' } } } } } } } },
            tests: [
                { _description: 'Quote 1 ETH to USDC on Starknet', sellTokenAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', buyTokenAddress: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', sellAmount: '0xde0b6b3a7640000' },
                { _description: 'Quote 0.5 ETH to USDC', sellTokenAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', buyTokenAddress: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', sellAmount: '0x6f05b59d3b20000' },
                { _description: 'Quote 0.1 ETH to USDC', sellTokenAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', buyTokenAddress: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', sellAmount: '0x16345785d8a0000' }
            ],
        },
        getTokens: {
            method: 'GET',
            path: '/swap/v2/tokens',
            description: 'List all tradable tokens on Avnu with name, symbol, decimals and address. Supports pagination.',
            parameters: [
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] }, description: 'Page number for pagination, starting at 0' },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(100)'] }, description: 'Number of tokens per page (1-100, default 20)' },
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Search query to filter tokens by name or symbol (e.g. USDC, ETH)' }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { content: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, symbol: { type: 'string' }, address: { type: 'string' }, decimals: { type: 'number' }, chainId: { type: 'string' }, logoUri: { type: 'string' } } } }, totalPages: { type: 'number' }, totalElements: { type: 'number' }, last: { type: 'boolean' }, first: { type: 'boolean' } } } },
            tests: [
                { _description: 'First 10 tokens', page: 0, size: 10 },
                { _description: 'Search for USDC', search: 'USDC', size: 5 },
                { _description: 'Second page of tokens', page: 1, size: 10 }
            ],
        },
        getSources: {
            method: 'GET',
            path: '/swap/v2/sources',
            description: 'List all available liquidity sources (DEXes) on Avnu. Returns name and type of each integrated protocol.',
            parameters: [],
            output: { mimeType: 'application/json', schema: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, address: { type: 'string' }, icon: { type: 'string' }, type: { type: 'string' } } } } },
            tests: [
                { _description: 'List all DEX sources' },
                { _description: 'Verify liquidity sources' },
                { _description: 'Check available DEX integrations' }
            ],
        }
    }
}
