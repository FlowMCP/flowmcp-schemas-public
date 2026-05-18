// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'coincap',
    name: 'AssetsAPI',
    description: 'Retrieve cryptocurrency asset data from CoinCap — prices, market caps, supply, volume, and historical data for thousands of tokens.',
    version: '4.0.0',
    docs: ['https://pro.coincap.io/api-docs'],
    tags: ['crypto', 'prices', 'marketdata', 'cacheTtlRealtime'],
    root: 'https://rest.coincap.io/v3',
    requiredServerParams: ['COINCAP_API_KEY'],
    headers: {
        Authorization: 'Bearer {{COINCAP_API_KEY}}'
    },
    tools: {
        listAssets: {
            method: 'GET',
            path: '/assets',
            description: 'Retrieve a list of assets via CoinCap. Supports search, ids, limit filters. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Search query to filter assets by name or symbol' },
                { position: { key: 'ids', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Comma-separated list of asset IDs to retrieve, e.g. bitcoin,ethereum' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)'] }, description: 'Maximum number of assets to return' },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] }, description: 'Number of assets to skip for pagination' }
            ],
            tests: [
                { _description: 'Fetch first 10 assets', limit: 10 },
                { _description: 'Search for bitcoin', search: 'bitcoin' },
                { _description: 'Fetch specific assets by IDs', ids: 'bitcoin,ethereum', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        timestamp: { type: 'number' },
                        data: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, rank: { type: 'string' }, symbol: { type: 'string' }, name: { type: 'string' }, supply: { type: 'string' }, maxSupply: { type: 'string' }, marketCapUsd: { type: 'string' }, volumeUsd24Hr: { type: 'string' }, priceUsd: { type: 'string' }, changePercent24Hr: { type: 'string' }, vwap24Hr: { type: 'string' }, explorer: { type: 'string' }, tokens: { type: 'object' } } } }
                    }
                }
            },
        },
        singleAsset: {
            method: 'GET',
            path: '/assets/:slug',
            description: 'Retrieve details for a specific asset via CoinCap — query by slug. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Asset slug identifier, e.g. bitcoin, ethereum' }
            ],
            tests: [
                { _description: 'Fetch Bitcoin data', slug: 'bitcoin' },
                { _description: 'Fetch Ethereum data', slug: 'ethereum' },
                { _description: 'Fetch Solana data', slug: 'solana' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        timestamp: { type: 'number' },
                        data: { type: 'object', properties: { id: { type: 'string' }, rank: { type: 'string' }, symbol: { type: 'string' }, name: { type: 'string' }, supply: { type: 'string' }, maxSupply: { type: 'string' }, marketCapUsd: { type: 'string' }, volumeUsd24Hr: { type: 'string' }, priceUsd: { type: 'string' }, changePercent24Hr: { type: 'string' }, vwap24Hr: { type: 'string' }, explorer: { type: 'string' }, tokens: { type: 'object' } } }
                    }
                }
            },
        },
        assetMarkets: {
            method: 'GET',
            path: '/assets/:slug/markets',
            description: 'Retrieve market data for an asset via CoinCap — query by slug. Supports limit, offset filters.',
            parameters: [
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Asset slug identifier, e.g. bitcoin, ethereum' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)'] }, description: 'Maximum number of market pairs to return' },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] }, description: 'Number of market pairs to skip for pagination' }
            ],
            tests: [
                { _description: 'Markets for bitcoin', slug: 'bitcoin' },
                { _description: 'Markets for ethereum with limit', slug: 'ethereum', limit: 5 },
                { _description: 'Markets for solana', slug: 'solana' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        timestamp: { type: 'number' },
                        data: { type: 'array', items: { type: 'object', properties: { exchangeId: { type: 'string' }, baseId: { type: 'string' }, baseSymbol: { type: 'string' }, quoteId: { type: 'string' }, quoteSymbol: { type: 'string' }, priceUsd: { type: 'string' }, volumeUsd24Hr: { type: 'string' }, volumePercent: { type: 'string' } } } }
                    }
                }
            },
        },
        assetHistory: {
            method: 'GET',
            path: '/assets/:slug/history',
            description: 'Retrieve historical data for an asset via CoinCap — query by slug. Supports start, end filters.',
            parameters: [
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Asset slug identifier, e.g. bitcoin, ethereum' },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(m1,m5,m15,m30,h1,h2,h6,h12,d1)', options: [] }, description: 'Time interval for data points: m1/m5/m15/m30 (minutes), h1/h2/h6/h12 (hours), d1 (day)' },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Start time in UNIX milliseconds for filtering history range' },
                { position: { key: 'end', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'End time in UNIX milliseconds for filtering history range' }
            ],
            tests: [
                { _description: '1-day history for bitcoin', slug: 'bitcoin', interval: 'd1' },
                { _description: 'Hourly history for ethereum', slug: 'ethereum', interval: 'h1' },
                { _description: 'Daily history for solana', slug: 'solana', interval: 'd1' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        timestamp: { type: 'number' },
                        data: { type: 'array', items: { type: 'object', properties: { circulatingSupply: { type: 'number' }, priceUsd: { type: 'string' }, time: { type: 'number' }, date: { type: 'string' } } } }
                    }
                }
            },
        }
    }
}
