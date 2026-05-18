// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'coincap',
    name: 'CoinCapMarkets',
    description: 'Access CoinCap market pair data — list trading pairs across exchanges with price, volume, spread, and exchange metadata. Supports filtering by exchange or asset.',
    version: '4.0.0',
    docs: ['https://pro.coincap.io/api-docs'],
    tags: ['crypto', 'markets', 'trading', 'cacheTtlFrequent'],
    root: 'https://rest.coincap.io/v3',
    requiredServerParams: ['COINCAP_API_KEY'],
    headers: {
        Authorization: 'Bearer {{COINCAP_API_KEY}}'
    },
    tools: {
        listMarkets: {
            method: 'GET',
            path: '/markets',
            description: 'Retrieve a list of markets with optional filters via CoinCap. Supports exchangeId, baseSymbol, baseId filters.',
            parameters: [
                { position: { key: 'exchangeId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Filter by exchange identifier, e.g. binanceus, kraken' },
                { position: { key: 'baseSymbol', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Filter by base asset ticker symbol, e.g. BTC, ETH' },
                { position: { key: 'baseId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Filter by base asset CoinCap ID, e.g. bitcoin, ethereum' },
                { position: { key: 'quoteSymbol', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Filter by quote asset ticker symbol, e.g. USDT, USD' },
                { position: { key: 'quoteId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Filter by quote asset CoinCap ID, e.g. tether, usd-coin' },
                { position: { key: 'assetSymbol', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Filter by asset ticker symbol appearing as base or quote' },
                { position: { key: 'assetId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Filter by asset CoinCap ID appearing as base or quote' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(10)', 'optional()'] }, description: 'Maximum number of market pairs to return' },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(0)', 'optional()'] }, description: 'Number of market pairs to skip for pagination' }
            ],
            tests: [
                { _description: 'Default market list', exchangeId: 'binanceus' },
                { _description: 'Markets from BinanceUS', exchangeId: 'binanceus' },
                { _description: 'Markets for base asset BTC', baseSymbol: 'BTC' },
                { _description: 'Limit results to 5', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        timestamp: { type: 'number' },
                        data: { type: 'array', items: { type: 'object', properties: { exchangeId: { type: 'string' }, rank: { type: 'string' }, baseSymbol: { type: 'string' }, baseId: { type: 'string' }, quoteSymbol: { type: 'string' }, quoteId: { type: 'string' }, priceQuote: { type: 'string' }, priceUsd: { type: 'string' }, volumeUsd24Hr: { type: 'string' }, percentExchangeVolume: { type: 'string' }, tradesCount24Hr: { type: 'number', nullable: true }, updated: { type: 'number' } } } }
                    }
                }
            },
        }
    }
}
