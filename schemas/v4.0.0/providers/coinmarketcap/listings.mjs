// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'coinmarketcap',
    name: 'CoinMarketCapListingsLatest',
    description: 'Returns a paginated list of all active cryptocurrencies with latest market data. Supports extensive filtering by price, market cap, volume, and supply ranges. Sort by any major metric. Use convert parameter for non-USD pricing.',
    version: '4.0.0',
    docs: ['https://coinmarketcap.com/api/documentation/v1/'],
    tags: ['crypto', 'listings', 'marketdata', 'cacheTtlFrequent'],
    root: 'https://pro-api.coinmarketcap.com/v1',
    requiredServerParams: ['CMC_API_KEY'],
    headers: {
        'X-CMC_PRO_API_KEY': '{{CMC_API_KEY}}'
    },
    tools: {
        listingsLatest: {
            method: 'GET',
            path: '/cryptocurrency/listings/latest',
            description: 'Get latest listings of cryptocurrencies sorted and paginated via CoinMarketCap. Supports filtering by price range, market cap, volume, supply, and 24h change. The sort enum values correspond to sortable fields in the response data.',
            parameters: [
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'optional()'], description: 'Pagination offset (1-based index of the first result)' } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(5000)', 'optional()'], description: 'Maximum number of results to return (1-5000)' } },
                { position: { key: 'price_min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'], description: 'Minimum price filter in USD' } },
                { position: { key: 'price_max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'], description: 'Maximum price filter in USD' } },
                { position: { key: 'market_cap_min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'], description: 'Minimum market capitalization filter in USD' } },
                { position: { key: 'market_cap_max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'], description: 'Maximum market capitalization filter in USD' } },
                { position: { key: 'volume_24h_min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'], description: 'Minimum 24-hour trading volume filter in USD' } },
                { position: { key: 'volume_24h_max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'], description: 'Maximum 24-hour trading volume filter in USD' } },
                { position: { key: 'circulating_supply_min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'], description: 'Minimum circulating supply filter' } },
                { position: { key: 'circulating_supply_max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'], description: 'Maximum circulating supply filter' } },
                { position: { key: 'percent_change_24h_min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(-100)', 'optional()'], description: 'Minimum 24-hour percentage price change filter' } },
                { position: { key: 'percent_change_24h_max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(-100)', 'optional()'], description: 'Maximum 24-hour percentage price change filter' } },
                { position: { key: 'convert', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Fiat or cryptocurrency to convert prices into (e.g. USD, EUR, BTC)' } },
                { position: { key: 'convert_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'CoinMarketCap currency ID for price conversion (alternative to convert)' } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(market_cap,market_cap_strict,name,symbol,date_added,price,circulating_supply,total_supply,max_supply,num_market_pairs,market_cap_by_total_supply_strict,volume_24h,percent_change_1h,percent_change_24h,percent_change_7d,volume_7d,volume_30d)', options: ['optional()'], description: 'Field to sort results by (e.g. market_cap, price, volume_24h)' } },
                { position: { key: 'sort_dir', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(asc,desc)', options: ['optional()'], description: 'Sort direction: ascending or descending' } },
                { position: { key: 'cryptocurrency_type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(all,coins,tokens)', options: ['optional()'], description: 'Filter by cryptocurrency type: all, coins only, or tokens only' } },
                { position: { key: 'tag', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Filter by tag (e.g. defi, filesharing)' } },
                { position: { key: 'aux', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Comma-separated supplemental fields: num_market_pairs, cmc_rank, date_added, tags, platform, max_supply, circulating_supply, total_supply' } }
            ],
            tests: [
                { _description: 'Basic call without parameters', start: 10, limit: 50 },
                { _description: 'Paginated call with start=10 and limit=50', start: 10, limit: 50 },
                {
                    _description: 'Filter by market cap and sort descending by price',
                    market_cap_min: 10000000,
                    sort: 'price',
                    sort_dir: 'desc'
                },
                { _description: 'Filter using convert with USD', convert: 'USD' }
            ],
            output: {
                description: 'Paginated list of active cryptocurrencies with latest market data including price, volume, market cap, and supply info',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CMC API response with cryptocurrency listing data array and request status including total_count for pagination',
                    properties: {
                        status: { type: 'object', description: 'API request metadata including total result count for pagination', properties: { timestamp: { type: 'string', description: 'ISO 8601 timestamp when request was processed' }, error_code: { type: 'number', description: 'Error code (0 = success, non-zero = error)' }, error_message: { type: 'string', nullable: true, description: 'Error message, null on success' }, elapsed: { type: 'number', description: 'Processing time in milliseconds' }, credit_count: { type: 'number', description: 'API credits consumed by this request' }, notice: { type: 'string', nullable: true, description: 'Optional notice from CMC' }, total_count: { type: 'number', description: 'Total number of cryptocurrencies matching the filter criteria (for pagination)' } } },
                        data: { type: 'array', description: 'Array of cryptocurrency listing objects with market data', items: { type: 'object', properties: { id: { type: 'number', description: 'Unique CMC cryptocurrency ID' }, name: { type: 'string', description: 'Full cryptocurrency name (e.g. Bitcoin)' }, symbol: { type: 'string', description: 'Ticker symbol (e.g. BTC)' }, slug: { type: 'string', description: 'URL-friendly identifier (e.g. bitcoin)' }, num_market_pairs: { type: 'number', description: 'Number of active trading pairs across exchanges' }, date_added: { type: 'string', description: 'ISO 8601 date when added to CMC' }, tags: { type: 'array', description: 'Array of tag strings categorizing the cryptocurrency (e.g. defi, pow)', items: { type: 'string' } }, max_supply: { type: 'number', description: 'Maximum possible supply (e.g. 21M for BTC, null if unlimited)' }, circulating_supply: { type: 'number', description: 'Currently circulating coin supply' }, total_supply: { type: 'number', description: 'Total minted supply including locked/reserved' }, infinite_supply: { type: 'boolean', description: 'Whether the token has no maximum supply cap' }, minted_market_cap: { type: 'number', description: 'Market cap calculated from total minted supply' }, platform: { type: 'string', nullable: true, description: 'Platform blockchain for tokens (null for native coins like BTC)' }, cmc_rank: { type: 'number', description: 'Current CMC market cap rank' }, self_reported_circulating_supply: { type: 'number', nullable: true, description: 'Self-reported circulating supply (may differ from CMC calculation)' }, self_reported_market_cap: { type: 'number', nullable: true, description: 'Self-reported market cap in USD' }, tvl_ratio: { type: 'string', nullable: true, description: 'Market cap to TVL ratio (for DeFi tokens)' }, last_updated: { type: 'string', description: 'ISO 8601 timestamp of last price update' }, quote: { type: 'object', description: 'Map of currency codes to quote objects containing price, volume_24h, percent_change_1h/24h/7d, and market_cap' } } } }
                    }
                }
            },
        }
    }
}
