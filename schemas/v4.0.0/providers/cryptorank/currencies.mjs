// Free-tier endpoints only (Memo 033 — funds.mjs moved to disabled/ on 2026-05-16)
// Premium endpoints (/v2/funds, /v2/currencies/:id/sparkline, /v2/currencies/:id/history) require paid plan.

export const main = {
    namespace: 'cryptorank',
    name: 'Cryptorank Currencies',
    description: 'Access cryptocurrency market data from Cryptorank free-tier API — list currencies, fetch single currency by ID, global market stats, and currency ID/slug/symbol mapping.',
    version: '4.0.0',
    docs: ['https://api.cryptorank.io'],
    tags: ['crypto', 'marketdata', 'free-tier', 'cacheTtlFrequent'],
    root: 'https://api.cryptorank.io/v2',
    requiredServerParams: ['CRYPTORANK_API_KEY'],
    headers: {
        'X-Api-Key': '{{CRYPTORANK_API_KEY}}'
    },
    tools: {
        listCurrencies: {
            method: 'GET',
            path: '/currencies',
            description: 'List all tracked currencies on Cryptorank with current price, market cap, and 24h volume. Returns the full currency list (no filter parameters supported on free tier).',
            parameters: [],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { data: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, key: { type: 'string' }, symbol: { type: 'string' }, name: { type: 'string' }, slug: { type: 'string' }, rank: { type: 'number' } } } }, status: { type: 'object' } } } },
            tests: [
                { _description: 'Get full currencies list (free-tier — no params)' }
            ]
        },
        getCurrencyById: {
            method: 'GET',
            path: '/currencies/:id',
            description: 'Fetch a single currency by its Cryptorank ID. Returns detailed market data including price, supply, and metadata. Use listCurrencies for related data.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)'] }, description: 'Cryptorank currency ID (e.g. 1 for Bitcoin)' }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { data: { type: 'object', properties: { id: { type: 'number' }, key: { type: 'string' }, symbol: { type: 'string' }, name: { type: 'string' }, slug: { type: 'string' } } }, status: { type: 'object' } } } },
            tests: [
                { _description: 'Get Bitcoin (id=1)', id: 1 },
                { _description: 'Get Ethereum (id=1027)', id: 1027 }
            ]
        },
        getGlobalStats: {
            method: 'GET',
            path: '/global',
            description: 'Fetch global cryptocurrency market statistics from Cryptorank — total market cap, 24h volume, BTC dominance, and total number of currencies tracked.',
            parameters: [],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { data: { type: 'object', properties: { totalMarketCap: { type: 'number' }, totalVolume24h: { type: 'number' }, btcDominance: { type: 'number' } } }, status: { type: 'object' } } } },
            tests: [
                { _description: 'Get current global market stats' }
            ]
        },
        getCurrencyMap: {
            method: 'GET',
            path: '/currencies/map',
            description: 'Fetch the Cryptorank currency ID-to-slug-and-symbol mapping. Use to translate between Cryptorank internal IDs and human-readable names. Lightweight metadata, no price data.',
            parameters: [],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { data: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, slug: { type: 'string' }, symbol: { type: 'string' }, name: { type: 'string' } } } }, status: { type: 'object' } } } },
            tests: [
                { _description: 'Get full ID-slug-symbol mapping' }
            ]
        }
    }
}

export const schema = main
