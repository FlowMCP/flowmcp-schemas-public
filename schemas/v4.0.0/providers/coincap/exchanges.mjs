// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'coincap',
    name: 'CoinCapExchanges',
    description: 'Access cryptocurrency exchange data from CoinCap — list all exchanges with volume rankings or retrieve detailed metadata for a specific exchange by ID.',
    version: '4.0.0',
    docs: ['https://pro.coincap.io/api-docs'],
    tags: ['crypto', 'exchanges', 'marketdata', 'cacheTtlFrequent'],
    root: 'https://rest.coincap.io/v3',
    requiredServerParams: ['COINCAP_API_KEY'],
    headers: {
        Authorization: 'Bearer {{COINCAP_API_KEY}}'
    },
    tools: {
        listExchanges: {
            method: 'GET',
            path: '/exchanges',
            description: 'Retrieve a list of exchanges via CoinCap. Supports limit, offset filters. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(10)', 'optional()'] }, description: 'Maximum number of exchanges to return' },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(0)', 'optional()'] }, description: 'Number of exchanges to skip for pagination' }
            ],
            tests: [
                { _description: 'List 5 exchanges', limit: 5 },
                { _description: 'List exchanges with offset', offset: 2 },
                { _description: 'List top 3 exchanges', limit: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        timestamp: { type: 'number' },
                        data: { type: 'array', items: { type: 'object', properties: { exchangeId: { type: 'string' }, name: { type: 'string' }, rank: { type: 'string' }, percentTotalVolume: { type: 'string' }, volumeUsd: { type: 'string' }, tradingPairs: { type: 'string' }, socket: { type: 'boolean' }, exchangeUrl: { type: 'string' }, updated: { type: 'number' } } } }
                    }
                }
            },
        },
        getExchangeById: {
            method: 'GET',
            path: '/exchanges/:exchange',
            description: 'Retrieve details for a specific exchange via CoinCap — query by exchange. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'exchange', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Exchange identifier slug, e.g. binanceus, kraken, coinbase-pro' }
            ],
            tests: [
                { _description: 'Fetch Binance.US exchange', exchange: 'binanceus' },
                { _description: 'Fetch Kraken exchange', exchange: 'kraken' },
                { _description: 'Fetch Bitstamp exchange', exchange: 'bitstamp' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        timestamp: { type: 'number' },
                        data: { type: 'object', properties: { exchangeId: { type: 'string' }, name: { type: 'string' }, rank: { type: 'string' }, percentTotalVolume: { type: 'string' }, volumeUsd: { type: 'string' }, tradingPairs: { type: 'string' }, socket: { type: 'boolean' }, exchangeUrl: { type: 'string' }, updated: { type: 'number' } } }
                    }
                }
            },
        }
    }
}
