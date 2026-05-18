// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'dexpaprika',
    name: 'DexPaprika DeFi Prices',
    description: 'Query decentralized exchange data including token prices, pools, liquidity, and transactions via dexpaprika.com',
    version: '4.0.0',
    docs: ['https://api.dexpaprika.com/docs'],
    tags: ['defi', 'prices', 'liquidity', 'cacheTtlRealtime'],
    root: 'https://api.dexpaprika.com',
    tools: {
        getNetworks: {
            method: 'GET',
            path: '/networks',
            description: 'Get all supported blockchain networks via DexPaprika. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Fetch all supported networks' },
                { _description: 'List DexPaprika blockchain networks' },
                { _description: 'Get available DEX network list' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'Unique network identifier' },
                            display_name: { type: 'string', description: 'Human-readable network name' }
                        }
                    }
                }
            },
        },
        getToken: {
            method: 'GET',
            path: '/networks/:network_id/tokens/:token_address',
            description: 'Get detailed token information on a specific network via DexPaprika — query by network id and token address.',
            parameters: [
                { position: { key: 'network_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Network identifier from getNetworks, e.g. ethereum, bsc, polygon' },
                { position: { key: 'token_address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Token contract address on the network, e.g. 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 for WETH' }
            ],
            tests: [
                { _description: 'Get WETH token on Ethereum', network_id: 'ethereum', token_address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
                { _description: 'Get USDC token on Ethereum', network_id: 'ethereum', token_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
                { _description: 'Get USDT token on Ethereum', network_id: 'ethereum', token_address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Token contract address' },
                        name: { type: 'string', description: 'Token name' },
                        symbol: { type: 'string', description: 'Token ticker symbol' },
                        chain: { type: 'string', description: 'Blockchain network the token is on' },
                        decimals: { type: 'number', description: 'Token decimal precision' },
                        total_supply: { type: 'number', description: 'Total token supply' },
                        description: { type: 'string', description: 'Token description text' },
                        website: { type: 'string', description: 'Token project website URL' },
                        has_image: { type: 'boolean', description: 'Whether the token has an icon image' },
                        added_at: { type: 'string', description: 'Timestamp when token was added to DexPaprika' },
                        price_stats: { type: 'object', description: 'Price statistics including 24h range and all-time high', properties: { high_24h: { type: 'number', description: '24-hour price high in USD' }, low_24h: { type: 'number', description: '24-hour price low in USD' }, ath: { type: 'number', description: 'All-time high price in USD' }, ath_date: { type: 'string', description: 'Date of all-time high price' } } },
                        summary: { type: 'object', description: 'Token summary with price, FDV, liquidity, and pool count', properties: { chain: { type: 'string', description: 'Blockchain network' }, id: { type: 'string', description: 'Token identifier' }, price_usd: { type: 'number', description: 'Current price in USD' }, fdv: { type: 'number', description: 'Fully diluted valuation in USD' }, liquidity_usd: { type: 'number', description: 'Total liquidity across pools in USD' }, pools: { type: 'number', description: 'Number of liquidity pools containing this token' } } },
                        last_updated: { type: 'string', description: 'Timestamp of last data update' }
                    }
                }
            },
        },
        getMultiPrices: {
            method: 'GET',
            path: '/networks/:network_id/multi/prices',
            description: 'Get prices for multiple tokens on a network via DexPaprika — query by network id.',
            parameters: [
                { position: { key: 'network_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Network identifier from getNetworks, e.g. ethereum, bsc, polygon' },
                { position: { key: 'tokens', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Comma-separated token contract addresses to price' }
            ],
            tests: [
                { _description: 'Get multi prices on Ethereum', network_id: 'ethereum', tokens: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
                { _description: 'Get WETH and USDT prices on Ethereum', network_id: 'ethereum', tokens: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,0xdAC17F958D2ee523a2206206994597C13D831ec7' },
                { _description: 'Get USDC price on Ethereum', network_id: 'ethereum', tokens: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            chain: { type: 'string', description: 'Blockchain network identifier' },
                            id: { type: 'string', description: 'Token contract address' },
                            price_usd: { type: 'number', description: 'Current token price in USD' }
                        }
                    }
                }
            },
        },
        getPool: {
            method: 'GET',
            path: '/networks/:network_id/pools/:pool_address',
            description: 'Get detailed pool information on a specific network via DexPaprika — query by network id and pool address.',
            parameters: [
                { position: { key: 'network_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Network identifier from getNetworks, e.g. ethereum, bsc, polygon' },
                { position: { key: 'pool_address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Liquidity pool contract address on the network' }
            ],
            tests: [
                { _description: 'Get Uniswap V3 USDC/WETH pool', network_id: 'ethereum', pool_address: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640' },
                { _description: 'Get another Uniswap pool on Ethereum', network_id: 'ethereum', pool_address: '0x4585FE77225b41b697C938B018E2Ac67Ac5a20c0' },
                { _description: 'Get Uniswap V3 WBTC/WETH pool', network_id: 'ethereum', pool_address: '0xCBCdF9626bC03E24f779434178A73a0B4bad62eD' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Pool contract address' },
                        chain: { type: 'string', description: 'Blockchain network identifier' },
                        factory_id: { type: 'string', description: 'DEX factory contract address' },
                        dex_id: { type: 'string', description: 'DEX protocol identifier' },
                        dex_name: { type: 'string', description: 'DEX protocol name' },
                        created_at_block_number: { type: 'number', description: 'Block number when the pool was created' },
                        fee: { type: 'number', nullable: true, description: 'Pool trading fee percentage' },
                        created_at: { type: 'string', description: 'Timestamp when the pool was created' },
                        tokens: { type: 'array', description: 'Array of tokens in the pool', items: { type: 'object', properties: { id: { type: 'string', description: 'Token contract address' }, name: { type: 'string', description: 'Token name' }, symbol: { type: 'string', description: 'Token ticker symbol' }, chain: { type: 'string', description: 'Blockchain network' }, type: { type: 'string', description: 'Token type classification' }, status: { type: 'string', description: 'Token listing status' }, decimals: { type: 'number', description: 'Token decimal precision' }, total_supply: { type: 'number', description: 'Total token supply' }, description: { type: 'string', description: 'Token description text' }, website: { type: 'string', description: 'Token project website URL' }, has_image: { type: 'boolean', description: 'Whether the token has an icon image' }, added_at: { type: 'string', description: 'Timestamp when token was added' }, fdv: { type: 'string', nullable: true, description: 'Fully diluted valuation' } } } },
                        token_reserves: { type: 'array', description: 'Token reserve amounts in the pool', items: { type: 'object', properties: { token_id: { type: 'string', description: 'Token contract address' }, reserve: { type: 'number', description: 'Token reserve amount' }, reserve_usd: { type: 'string', nullable: true, description: 'Reserve value in USD' } } } },
                        last_price: { type: 'number', nullable: true, description: 'Last trade price in native token terms' },
                        last_price_usd: { type: 'number', nullable: true, description: 'Last trade price in USD' }
                    }
                }
            },
        },
        getTokenPools: {
            method: 'GET',
            path: '/networks/:network_id/tokens/:token_address/pools',
            description: 'Get all pools for a specific token on a network via DexPaprika — query by network id and token address.',
            parameters: [
                { position: { key: 'network_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Network identifier from getNetworks, e.g. ethereum, bsc, polygon' },
                { position: { key: 'token_address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Token contract address to find pools for' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'optional()'] }, description: 'Maximum number of pools to return (1-100)' }
            ],
            tests: [
                { _description: 'Get pools for WETH on Ethereum', network_id: 'ethereum', token_address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
                { _description: 'Get pools for USDC on Ethereum', network_id: 'ethereum', token_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', limit: 10 },
                { _description: 'Get pools for USDT on Ethereum', network_id: 'ethereum', token_address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        pools: { type: 'array', description: 'Array of pool identifiers for this token', items: { type: 'string' } },
                        page_info: { type: 'object', description: 'Pagination metadata', properties: { limit: { type: 'number', description: 'Items per page' }, page: { type: 'number', description: 'Current page number' }, total_items: { type: 'number', description: 'Total number of items' }, total_pages: { type: 'number', description: 'Total number of pages' } } }
                    }
                }
            },
        },
        getPoolTransactions: {
            method: 'GET',
            path: '/networks/:network_id/pools/:pool_address/transactions',
            description: 'Get recent transactions for a specific pool via DexPaprika — query by network id and pool address.',
            parameters: [
                { position: { key: 'network_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Network identifier from getNetworks, e.g. ethereum, bsc, polygon' },
                { position: { key: 'pool_address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Liquidity pool contract address to get transactions for' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'optional()'] }, description: 'Maximum number of transactions to return (1-100)' }
            ],
            tests: [
                { _description: 'Get transactions for USDC/WETH pool', network_id: 'ethereum', pool_address: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640' },
                { _description: 'Get recent swaps for UNI V3 pool', network_id: 'ethereum', pool_address: '0x4585FE77225b41b697C938B018E2Ac67Ac5a20c0', limit: 10 },
                { _description: 'Get transactions for WBTC/WETH pool', network_id: 'ethereum', pool_address: '0xCBCdF9626bC03E24f779434178A73a0B4bad62eD', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        transactions: { type: 'array', description: 'Array of swap transaction objects', items: { type: 'object', properties: { id: { type: 'string', description: 'Transaction hash' }, log_index: { type: 'number', description: 'Event log index within the transaction' }, transaction_index: { type: 'number', description: 'Transaction index within the block' }, factory_id: { type: 'string', description: 'DEX factory contract address' }, pool_id: { type: 'string', description: 'Pool contract address' }, chain: { type: 'string', description: 'Blockchain network' }, sender: { type: 'string', description: 'Transaction sender address' }, recipient: { type: 'string', description: 'Transaction recipient address' }, token_0: { type: 'string', description: 'First token contract address' }, token_0_symbol: { type: 'string', description: 'First token ticker symbol' }, token_1: { type: 'string', description: 'Second token contract address' }, token_1_symbol: { type: 'string', description: 'Second token ticker symbol' }, amount_0: { type: 'number', description: 'Amount of first token swapped' }, amount_1: { type: 'number', description: 'Amount of second token swapped' }, volume_0: { type: 'number', description: 'Volume of first token in native units' }, volume_1: { type: 'number', description: 'Volume of second token in native units' }, price_0: { type: 'number', description: 'Price of first token' }, price_1: { type: 'number', description: 'Price of second token' }, price_0_usd: { type: 'number', description: 'Price of first token in USD' }, price_1_usd: { type: 'number', description: 'Price of second token in USD' }, created_at_block_number: { type: 'number', description: 'Block number of the transaction' }, created_at_block_hash: { type: 'string', description: 'Block hash of the transaction' }, created_at: { type: 'string', description: 'Timestamp of the transaction' }, canonical_chain: { type: 'boolean', description: 'Whether the transaction is on the canonical chain' } } } },
                        page_info: { type: 'object', description: 'Pagination metadata', properties: { limit: { type: 'number', description: 'Items per page' }, page: { type: 'number', description: 'Current page number' }, total_items: { type: 'number', description: 'Total number of items' }, total_pages: { type: 'number', description: 'Total number of pages' } } }
                    }
                }
            },
        },
        searchTokens: {
            method: 'GET',
            path: '/search',
            description: 'Search for tokens across all networks via DexPaprika. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Token search query — name, symbol, or address, e.g. ethereum, USDC' }
            ],
            tests: [
                { _description: 'Search for Ethereum token', query: 'ethereum' },
                { _description: 'Search for USDC token', query: 'usdc' },
                { _description: 'Search for Chainlink token', query: 'chainlink' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        tokens: { type: 'array', description: 'Matching token results', items: { type: 'object', properties: { id: { type: 'string', description: 'Token contract address' }, name: { type: 'string', description: 'Token name' }, symbol: { type: 'string', description: 'Token ticker symbol' }, chain: { type: 'string', description: 'Blockchain network' }, type: { type: 'string', description: 'Token type classification' }, status: { type: 'string', description: 'Token listing status' }, decimals: { type: 'number', description: 'Token decimal precision' }, total_supply: { type: 'number', description: 'Total token supply' }, description: { type: 'string', description: 'Token description text' }, website: { type: 'string', description: 'Token project website URL' }, explorer: { type: 'string', description: 'Block explorer URL' }, price_usd: { type: 'number', description: 'Current price in USD' }, liquidity_usd: { type: 'number', description: 'Total liquidity in USD' }, volume_usd: { type: 'number', description: 'Trading volume in USD' }, price_usd_change: { type: 'number', description: 'Price change percentage' } } } },
                        pools: { type: 'array', description: 'Matching pool results', items: { type: 'object', properties: { id: { type: 'string', description: 'Pool contract address' }, dex_id: { type: 'string', description: 'DEX protocol identifier' }, dex_name: { type: 'string', description: 'DEX protocol name' }, chain: { type: 'string', description: 'Blockchain network' }, created_at_block_number: { type: 'number', description: 'Block number when pool was created' }, created_at: { type: 'string', description: 'Timestamp when pool was created' }, volume_usd: { type: 'number', description: 'Trading volume in USD' }, transactions: { type: 'number', description: 'Total number of transactions' }, price_usd: { type: 'number', description: 'Current price in USD' }, last_price_change_usd_5m: { type: 'number', description: 'Price change in last 5 minutes' }, last_price_change_usd_1h: { type: 'number', description: 'Price change in last 1 hour' }, last_price_change_usd_24h: { type: 'number', description: 'Price change in last 24 hours' }, tokens: { type: 'array', description: 'Tokens in the pool', items: { type: 'object' } } } } },
                        dexes: { type: 'array', description: 'Matching DEX protocol names', items: { type: 'string' } }
                    }
                }
            },
        }
    }
}
