// Enhancement for #156 — CoinMarketCap Exchange Data
// Note: Trending, Gainers/Losers, OHLCV and News require paid plan (Hobbyist $29+)

export const main = {
    namespace: 'coinmarketcap',
    name: 'CoinMarketCap Exchanges',
    description: 'Query cryptocurrency exchange data — list exchanges, get exchange metadata, and retrieve exchange market pairs via CoinMarketCap API',
    version: '4.0.0',
    docs: ['https://coinmarketcap.com/api/documentation/v1/#tag/exchange'],
    tags: ['crypto', 'exchanges', 'marketdata', 'cacheTtlFrequent'],
    root: 'https://pro-api.coinmarketcap.com',
    requiredServerParams: ['CMC_API_KEY'],
    headers: {
        'X-CMC_PRO_API_KEY': '{{CMC_API_KEY}}'
    },
    tools: {
        getExchangeMap: {
            method: 'GET',
            path: '/v1/exchange/map',
            description: 'Get a paginated list of all cryptocurrency exchanges with CoinMarketCap IDs. Useful for mapping exchange names to IDs for other endpoints.',
            parameters: [
                { position: { key: 'listing_status', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(active,inactive,untracked)', options: ['optional()', 'default(active)'], description: 'Filter by exchange listing status: active, inactive, or untracked' } },
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Filter by one or more comma-separated exchange slugs (e.g. binance,coinbase-exchange)' } },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'], description: 'Pagination offset (1-based index of the first result)' } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)', 'max(5000)'], description: 'Maximum number of exchanges to return (1-5000)' } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(id,volume_24h)', options: ['optional()'], description: 'Sort results by CoinMarketCap ID or 24-hour trading volume' } }
            ],
            tests: [
                { _description: 'Get first 5 active exchanges', limit: 5 },
                { _description: 'Get Binance by slug', slug: 'binance' },
                { _description: 'Get exchanges sorted by volume', sort: 'volume_24h', limit: 3 }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { data: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, slug: { type: 'string' }, is_active: { type: 'number' }, first_historical_data: { type: 'string' }, last_historical_data: { type: 'string' } } } }, status: { type: 'object', properties: { error_code: { type: 'number' }, error_message: { type: 'string', nullable: true } } } } } },
        },
        getExchangeInfo: {
            method: 'GET',
            path: '/v1/exchange/info',
            description: 'Get metadata for one or more exchanges including name, logo, description, URLs, and social links. Query by ID or slug.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'One or more comma-separated CoinMarketCap exchange IDs (e.g. 270)' } },
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'One or more comma-separated exchange slugs (e.g. binance)' } }
            ],
            tests: [
                { _description: 'Get Binance info by slug', slug: 'binance' },
                { _description: 'Get exchange info by ID', id: '270' },
                { _description: 'Get Coinbase info by slug', slug: 'coinbase-exchange' }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { data: { type: 'object' }, status: { type: 'object', properties: { error_code: { type: 'number' }, error_message: { type: 'string', nullable: true } } } } } },
        },
        getExchangeAssets: {
            method: 'GET',
            path: '/v1/exchange/assets',
            description: 'Get a list of assets and their amounts held by an exchange wallet. Returns token balances including USD valuation.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [], description: 'CoinMarketCap exchange ID to retrieve assets for (e.g. 270 for Binance)' } }
            ],
            tests: [
                { _description: 'Get Binance assets', id: '270' },
                { _description: 'Get Coinbase assets', id: '89' },
                { _description: 'Get Kraken assets', id: '24' }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { data: { type: 'array', items: { type: 'object', properties: { wallet_address: { type: 'string' }, balance: { type: 'number' }, platform: { type: 'object' } } } }, status: { type: 'object', properties: { error_code: { type: 'number' }, error_message: { type: 'string', nullable: true } } } } } },
        },
        getCryptoMap: {
            method: 'GET',
            path: '/v1/cryptocurrency/map',
            description: 'Get a mapping of all cryptocurrencies to CoinMarketCap IDs. Useful for resolving symbols and slugs to IDs.',
            parameters: [
                { position: { key: 'listing_status', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(active,inactive,untracked)', options: ['optional()', 'default(active)'], description: 'Filter by cryptocurrency listing status: active, inactive, or untracked' } },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'], description: 'Pagination offset (1-based index of the first result)' } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)'], description: 'Maximum number of results to return (default 100)' } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(cmc_rank,id)', options: ['optional()'], description: 'Sort results by CoinMarketCap rank or ID' } },
                { position: { key: 'symbol', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Filter by one or more comma-separated cryptocurrency symbols (e.g. BTC,ETH)' } }
            ],
            tests: [
                { _description: 'Map first 5 cryptos', limit: 5 },
                { _description: 'Find BTC by symbol', symbol: 'BTC' },
                { _description: 'Map top 10 by rank', sort: 'cmc_rank', limit: 10 }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { data: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, symbol: { type: 'string' }, slug: { type: 'string' }, rank: { type: 'number' }, is_active: { type: 'number' }, first_historical_data: { type: 'string' }, last_historical_data: { type: 'string' }, platform: { type: 'object', nullable: true } } } }, status: { type: 'object', properties: { error_code: { type: 'number' }, error_message: { type: 'string', nullable: true } } } } } },
        }
    }
}
