// Enhancement for #159 — CoinGecko Search + OHLC

export const main = {
    namespace: 'coingecko',
    name: 'CoinGecko Search & OHLC',
    description: 'Search coins by keyword and fetch OHLC candlestick data for technical analysis via CoinGecko free API',
    version: '4.0.0',
    docs: ['https://docs.coingecko.com/reference/search-data', 'https://docs.coingecko.com/reference/coins-id-ohlc'],
    tags: ['crypto', 'prices', 'marketdata', 'cacheTtlFrequent'],
    root: 'https://api.coingecko.com/api/v3',
    tools: {
        searchCoins: {
            method: 'GET',
            path: '/search',
            description: 'Search across CoinGecko for coins, exchanges, categories, and NFTs by keyword. Returns matching results with CoinGecko ID, name, ticker symbol, market cap rank, and thumbnail image. Use the returned coin id with getCoinOhlc for price chart data.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Search keyword to match against coin names, symbols, exchange names, category names, and NFT collections' }
            ],
            tests: [
                { _description: 'Search for Bitcoin coins and related exchanges', query: 'bitcoin' },
                { _description: 'Search for Solana ecosystem entries', query: 'solana' },
                { _description: 'Search for Ethereum-related results', query: 'ethereum' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        coins: { type: 'array', description: 'Matching cryptocurrency coins', items: { type: 'object', properties: { id: { type: 'string', description: 'CoinGecko coin ID used in other API calls' }, name: { type: 'string', description: 'Full coin name' }, api_symbol: { type: 'string', description: 'API-level ticker symbol' }, symbol: { type: 'string', description: 'Trading ticker symbol (e.g. BTC, ETH)' }, market_cap_rank: { type: 'number', description: 'Current market cap rank, null if unranked' }, thumb: { type: 'string', description: 'Small thumbnail image URL' }, large: { type: 'string', description: 'Large image URL' } } } },
                        exchanges: { type: 'array', description: 'Matching cryptocurrency exchanges', items: { type: 'object', properties: { id: { type: 'string', description: 'CoinGecko exchange ID' }, name: { type: 'string', description: 'Exchange display name' }, market_type: { type: 'string', description: 'Exchange type (e.g. spot, derivatives)' }, thumb: { type: 'string', description: 'Small thumbnail image URL' }, large: { type: 'string', description: 'Large image URL' } } } },
                        categories: { type: 'array', description: 'Matching market categories', items: { type: 'object', properties: { id: { type: 'number', description: 'Category numeric ID' }, name: { type: 'string', description: 'Category display name' } } } },
                        nfts: { type: 'array', description: 'Matching NFT collections', items: { type: 'object', properties: { id: { type: 'string', description: 'CoinGecko NFT collection ID' }, name: { type: 'string', description: 'NFT collection name' }, symbol: { type: 'string', description: 'NFT collection symbol' }, thumb: { type: 'string', description: 'Small thumbnail image URL' } } } }
                    }
                }
            },
        },
        getCoinOhlc: {
            method: 'GET',
            path: '/coins/:id/ohlc',
            description: 'Get OHLC (Open-High-Low-Close) candlestick chart data for a specific coin. Returns arrays of [timestamp_ms, open, high, low, close]. Candle granularity depends on the days parameter: 1-2 days gives 30-minute candles, 3-30 days gives 4-hour candles, 31+ days gives daily candles.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'CoinGecko coin ID (e.g. bitcoin, ethereum, solana). Use searchCoins to find the correct ID.' },
                { position: { key: 'vs_currency', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(usd)'] }, description: 'Target currency for price data (e.g. usd, eur, btc). Default: usd' },
                { position: { key: 'days', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(7)'] }, description: 'Number of days of data. Affects candle size: 1-2 = 30min, 3-30 = 4h, 31+ = daily. Valid: 1, 7, 14, 30, 90, 180, 365' }
            ],
            tests: [
                { _description: 'Bitcoin 7-day OHLC candles in USD (4h granularity)', id: 'bitcoin', vs_currency: 'usd', days: '7' },
                { _description: 'Ethereum 30-day OHLC candles in USD (4h granularity)', id: 'ethereum', vs_currency: 'usd', days: '30' },
                { _description: 'Solana 1-day OHLC candles in USD (30min granularity)', id: 'solana', vs_currency: 'usd', days: '1' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of OHLC candles, each candle is [timestamp_ms, open, high, low, close]',
                    items: {
                        type: 'array',
                        description: 'Single candle: [unix_timestamp_ms, open_price, high_price, low_price, close_price]',
                        items: { type: 'number' }
                    }
                }
            },
        }
    }
}
