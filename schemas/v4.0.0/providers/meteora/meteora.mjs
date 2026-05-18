// Migrated from v1.2.0 -> v3.0.0

export const main = {
    namespace: 'meteora',
    name: 'Meteora DLMM API',
    description: 'Fetches dynamic liquidity market maker pool data, token pair groups, OHLCV candles, volume history, and protocol metrics from Meteora on Solana',
    version: '4.0.0',
    docs: ['https://docs.meteora.ag/api-reference/dlmm/overview'],
    tags: ['defi', 'solana', 'amm', 'dlmm', 'cacheTtlFrequent'],
    root: 'https://dlmm.datapi.meteora.ag',
    requiredServerParams: [],
    headers: {},
    tools: {
        getPools: {
            method: 'GET',
            path: '/pools',
            description: 'List all Meteora DLMM pools with TVL, volume, APR, fee rates, and token pair information. Supports pagination, search, sorting, and filtering. Use getPoolByAddress for detailed data on a specific pool.',
            parameters: [
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'default(1)', 'optional()'] } },
                { position: { key: 'page_size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(1000)', 'default(10)', 'optional()'] } },
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)', 'max(200)', 'optional()'] } },
                { position: { key: 'sort_by', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(volume_24h:desc)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get first page of DLMM pools sorted by 24h volume', page: 1, page_size: 5 },
                { _description: 'Search for SOL pools', query: 'SOL', page_size: 5 },
                { _description: 'Search for USDC pools sorted by TVL', query: 'USDC', page_size: 5, sort_by: 'tvl:desc' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of Meteora DLMM pools with trading metrics',
                    properties: {
                        total: { type: 'number', description: 'Total number of pools matching the query' },
                        pages: { type: 'number', description: 'Total number of pages available' },
                        current_page: { type: 'number', description: 'Current page number' },
                        data: {
                            type: 'array',
                            description: 'Array of pool objects with trading data',
                            items: {
                                type: 'object',
                                properties: {
                                    address: { type: 'string', description: 'On-chain pool address (Solana public key)' },
                                    name: { type: 'string', description: 'Pool display name (e.g., SOL-USDC)' },
                                    tvl: { type: 'number', description: 'Total value locked in USD' },
                                    current_price: { type: 'number', description: 'Current token price ratio in the pool' },
                                    apr: { type: 'number', description: 'Annual percentage rate from trading fees' },
                                    farm_apr: { type: 'number', description: 'Additional APR from farming rewards' },
                                    volume: { type: 'object', description: 'Trading volume data with 24h field in USD' },
                                    fees: { type: 'object', description: 'Fee data with 24h field in USD' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getPoolByAddress: {
            method: 'GET',
            path: '/pools/:address',
            description: 'Get detailed metadata and current state for a single Meteora DLMM pool by its on-chain address including price, TVL, volume, APR, fee configuration, and token details. Use getPools to discover pool addresses.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(32)', 'max(44)'] } }
            ],
            tests: [
                { _description: 'Get TRUMP-USDC pool details', address: '9d9mb8kooFfaD3SctgZtkxQypkshx6ezhbKio89ixyy2' },
                { _description: 'Get SOL-USDC pool details', address: 'ARwi1S4DaiTG5DX7S4M4ZsrXqpMD1MrTmbu9ue2tpmEq' },
                { _description: 'Get JUP-USDC pool details', address: 'FoSDw2L5DmTuQTFe55gWPDXf88euaxAEKFre74CnkQps' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Full pool details including token info, fee config, and real-time trading metrics',
                    properties: {
                        address: { type: 'string', description: 'On-chain pool address' },
                        name: { type: 'string', description: 'Pool display name' },
                        token_x: { type: 'object', description: 'First token in the pair with symbol, address, and decimals' },
                        token_y: { type: 'object', description: 'Second token in the pair with symbol, address, and decimals' },
                        tvl: { type: 'number', description: 'Total value locked in USD' },
                        current_price: { type: 'number', description: 'Current price ratio (token_x per token_y)' },
                        apr: { type: 'number', description: 'Annual percentage rate from trading fees' },
                        farm_apr: { type: 'number', description: 'Additional APR from farming incentives' },
                        pool_config: { type: 'object', description: 'Pool configuration including bin_step and fee parameters' }
                    }
                }
            }
        },
        getPoolGroups: {
            method: 'GET',
            path: '/pools/groups',
            description: 'List pool groups aggregated by token pair with total TVL, volume, fee-to-TVL ratio, and pool count per group. Use getPoolGroupByMints for pools within a specific pair.',
            parameters: [
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'default(1)', 'optional()'] } },
                { position: { key: 'page_size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(10)', 'optional()'] } },
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)', 'max(200)', 'optional()'] } },
                { position: { key: 'sort_by', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(volume_24h:desc)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get top pool groups by volume', page: 1, page_size: 5 },
                { _description: 'Search for USDC pool groups', query: 'USDC', page_size: 5 },
                { _description: 'Search for SOL pool groups', query: 'SOL', page_size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of token pair groups aggregating multiple pools',
                    properties: {
                        total: { type: 'number', description: 'Total number of pool groups matching the query' },
                        pages: { type: 'number', description: 'Total number of pages' },
                        current_page: { type: 'number', description: 'Current page number' },
                        data: {
                            type: 'array',
                            description: 'Array of pool group objects with aggregated metrics',
                            items: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', description: 'Token pair name (e.g., SOL-USDC)' },
                                    pool_count: { type: 'number', description: 'Number of individual pools in this group' },
                                    tvl: { type: 'number', description: 'Aggregate TVL across all pools in the group' },
                                    volume_24h: { type: 'number', description: 'Combined 24-hour trading volume in USD' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getPoolGroupByMints: {
            method: 'GET',
            path: '/pools/groups/:lexical_order_mints',
            description: 'Get all pools belonging to a specific token pair group identified by lexically ordered mint addresses. Use getPoolGroups to discover available token pairs first.',
            parameters: [
                { position: { key: 'lexical_order_mints', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(32)'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'default(1)', 'optional()'] } },
                { position: { key: 'page_size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(10)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get pools for SOL-USDC group', lexical_order_mints: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v-So11111111111111111111111111111111111111112' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of individual pools within the specified token pair group',
                    properties: {
                        total: { type: 'number', description: 'Total number of pools in this pair group' },
                        pages: { type: 'number', description: 'Total number of pages' },
                        current_page: { type: 'number', description: 'Current page number' },
                        data: {
                            type: 'array',
                            description: 'Array of pool objects belonging to this token pair',
                            items: {
                                type: 'object',
                                properties: {
                                    address: { type: 'string', description: 'Pool on-chain address' },
                                    name: { type: 'string', description: 'Pool display name' },
                                    tvl: { type: 'number', description: 'Total value locked in USD' },
                                    apr: { type: 'number', description: 'Annual percentage rate from fees' },
                                    bin_step: { type: 'number', description: 'DLMM bin step configuration' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getPoolOhlcv: {
            method: 'GET',
            path: '/pools/:address/ohlcv',
            description: 'Get OHLCV price candles for a single Meteora DLMM pool over a configurable time range and interval. Use getPools to find pool addresses.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(32)', 'max(44)'] } },
                { position: { key: 'timeframe', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(5m,30m,1h,2h,4h,12h,24h)', options: ['default(24h)', 'optional()'] } },
                { position: { key: 'start_time', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'] } },
                { position: { key: 'end_time', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get 24h OHLCV candles for TRUMP-USDC pool', address: '9d9mb8kooFfaD3SctgZtkxQypkshx6ezhbKio89ixyy2' },
                { _description: 'Get 1h OHLCV candles for TRUMP-USDC pool', address: '9d9mb8kooFfaD3SctgZtkxQypkshx6ezhbKio89ixyy2', timeframe: '1h' },
                { _description: 'Get 4h candles for TRUMP-USDC pool', address: '9d9mb8kooFfaD3SctgZtkxQypkshx6ezhbKio89ixyy2', timeframe: '4h' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of OHLCV candle data points for the requested pool and timeframe',
                    items: {
                        type: 'object',
                        description: 'A single OHLCV candle',
                        properties: {
                            open: { type: 'number', description: 'Opening price for the candle period' },
                            high: { type: 'number', description: 'Highest price during the candle period' },
                            low: { type: 'number', description: 'Lowest price during the candle period' },
                            close: { type: 'number', description: 'Closing price for the candle period' },
                            volume: { type: 'number', description: 'Trading volume during the candle period in USD' },
                            timestamp: { type: 'number', description: 'Unix timestamp marking the start of the candle period' }
                        }
                    }
                }
            }
        },
        getPoolVolumeHistory: {
            method: 'GET',
            path: '/pools/:address/volume/history',
            description: 'Get historical trading volume for a single Meteora DLMM pool aggregated into configurable time buckets. Use getPoolOhlcv for price data alongside volume.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(32)', 'max(44)'] } },
                { position: { key: 'timeframe', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(5m,30m,1h,2h,4h,12h,24h)', options: ['default(24h)', 'optional()'] } },
                { position: { key: 'start_time', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'] } },
                { position: { key: 'end_time', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get 24h volume history for TRUMP-USDC pool', address: '9d9mb8kooFfaD3SctgZtkxQypkshx6ezhbKio89ixyy2' },
                { _description: 'Get 1h volume buckets for TRUMP-USDC pool', address: '9d9mb8kooFfaD3SctgZtkxQypkshx6ezhbKio89ixyy2', timeframe: '1h' },
                { _description: 'Get 4h volume history', address: '9d9mb8kooFfaD3SctgZtkxQypkshx6ezhbKio89ixyy2', timeframe: '4h' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of historical volume data points for the requested pool',
                    items: {
                        type: 'object',
                        description: 'Volume data for a single time bucket',
                        properties: {
                            volume: { type: 'number', description: 'Trading volume in USD for this time bucket' },
                            timestamp: { type: 'number', description: 'Unix timestamp marking the start of the time bucket' }
                        }
                    }
                }
            }
        },
        getProtocolMetrics: {
            method: 'GET',
            path: '/stats/protocol_metrics',
            description: 'Get aggregated protocol-level metrics across all Meteora DLMM pools including total TVL, 24h volume, 24h fees, and cumulative totals.',
            parameters: [],
            tests: [
                { _description: 'Get Meteora DLMM protocol overview metrics' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Aggregated protocol-level metrics for all Meteora DLMM pools combined',
                    properties: {
                        total_tvl: { type: 'number', description: 'Total value locked across all DLMM pools in USD' },
                        volume_24h: { type: 'number', description: 'Total 24-hour trading volume across all pools in USD' },
                        fees_24h: { type: 'number', description: 'Total 24-hour fees collected across all pools in USD' },
                        total_pools: { type: 'number', description: 'Total number of active DLMM pools' }
                    }
                }
            }
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getPools: {
        postRequest: async ( { response, struct, payload } ) => {
            if( !response ) {
                return { response }
            }

            const { data: pools, total, pages, current_page } = response
            if( !Array.isArray( pools ) ) {
                return { response }
            }

            const topPools = pools
                .map( ( pool ) => {
                    const result = {
                        address: pool['address'],
                        name: pool['name'],
                        tokenX: pool['token_x'] ? pool['token_x']['symbol'] : null,
                        tokenY: pool['token_y'] ? pool['token_y']['symbol'] : null,
                        tvl: pool['tvl'],
                        currentPrice: pool['current_price'],
                        apr: pool['apr'],
                        farmApr: pool['farm_apr'],
                        volume24h: pool['volume'] ? pool['volume']['24h'] : null,
                        fees24h: pool['fees'] ? pool['fees']['24h'] : null,
                        binStep: pool['pool_config'] ? pool['pool_config']['bin_step'] : null
                    }

                    return result
                } )

            response = {
                total,
                pages,
                currentPage: current_page,
                pools: topPools
            }

            return { response }
        }
    }
} )
