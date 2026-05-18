// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'coinmarketcap',
    name: 'CoinMarketCap100',
    description: 'Retrieve the CoinMarketCap 100 Index — latest index value and historical time-series data for the CMC100 benchmark of top cryptocurrencies. Use getLatest for the current value and getHistorical for time-series data.',
    version: '4.0.0',
    docs: ['https://coinmarketcap.com/api/documentation/v1/'],
    tags: ['crypto', 'index', 'marketdata', 'cacheTtlDaily'],
    root: 'https://pro-api.coinmarketcap.com',
    requiredServerParams: ['CMC_API_KEY'],
    headers: {
        'X-CMC_PRO_API_KEY': '{{CMC_API_KEY}}'
    },
    tools: {
        getHistorical: {
            method: 'GET',
            path: '/v3/index/cmc100-historical',
            description: 'Fetch a historical range of CoinMarketCap 100 Index values. Supports time_start, time_end, count filters. Returns time-series data points that can be used to chart CMC100 performance over time.',
            parameters: [
                { position: { key: 'time_start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Start timestamp in ISO 8601 format (e.g. 2024-01-01T00:00:00Z)' } },
                { position: { key: 'time_end', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'End timestamp in ISO 8601 format (e.g. 2024-12-31T23:59:59Z)' } },
                { position: { key: 'count', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Number of data points to return as a string (limits result count)' } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(5m,15m,daily)', options: ['optional()'], description: 'Time interval between data points: 5m (5 minutes), 15m (15 minutes), or daily' } }
            ],
            tests: [
                { _description: 'Fetch historical data without specifying time.', count: '10', interval: 'daily' },
                { _description: 'Fetch last 10 daily data points', count: '10', interval: 'daily' },
                { _description: 'Fetch 5-minute interval data limited to 5', count: '5', interval: '5m' }
            ],
            output: {
                description: 'Historical CMC100 index time-series data with values and constituent breakdowns per data point',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CMC API response containing historical index data points and request status metadata',
                    properties: {
                        data: { type: 'array', description: 'Array of historical CMC100 index data points ordered by time', items: { type: 'object', properties: { value: { type: 'number', description: 'CMC100 index value at this point in time' }, update_time: { type: 'string', description: 'ISO 8601 timestamp for this data point' }, constituents: { type: 'array', description: 'List of top cryptocurrency constituents in the index at this time', items: { type: 'object' } } } } },
                        status: { type: 'object', description: 'API request metadata including error state and credit usage', properties: { timestamp: { type: 'string', description: 'ISO 8601 timestamp when request was processed' }, error_code: { type: 'number', description: 'Error code (0 = success, non-zero = error)' }, error_message: { type: 'string', nullable: true, description: 'Error message, null on success' }, elapsed: { type: 'number', description: 'Processing time in milliseconds' }, credit_count: { type: 'number', description: 'API credits consumed by this request' } } }
                    }
                }
            },
        },
        getLatest: {
            method: 'GET',
            path: '/v3/index/cmc100-latest',
            description: 'Fetch the latest CoinMarketCap 100 Index value. Returns the current index value, 24h percentage change, and constituent cryptocurrencies. No parameters needed.',
            parameters: [],
            tests: [
                { _description: 'Fetch latest data.' },
                { _description: 'Fetch latest CMC100 index value (no params)' },
                { _description: 'Verify latest index response structure' }
            ],
            output: {
                description: 'Current CMC100 index value with 24h change and next update schedule',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CMC API response containing the latest CMC100 index reading and request status',
                    properties: {
                        data: { type: 'object', description: 'Current CMC100 index data', properties: { value: { type: 'number', description: 'Current CMC100 index value (weighted composite of top 100 cryptocurrencies)' }, value_24h_percentage_change: { type: 'number', description: 'Percentage change in index value over the last 24 hours' }, last_update: { type: 'string', description: 'ISO 8601 timestamp of the most recent index calculation' }, next_update: { type: 'string', description: 'ISO 8601 timestamp when the next index update is expected' }, constituents: { type: 'array', description: 'List of top cryptocurrency constituents currently in the CMC100 index', items: { type: 'object' } } } },
                        status: { type: 'object', description: 'API request metadata including error state and credit usage', properties: { timestamp: { type: 'string', description: 'ISO 8601 timestamp when request was processed' }, error_code: { type: 'number', description: 'Error code (0 = success, non-zero = error)' }, error_message: { type: 'string', nullable: true, description: 'Error message, null on success' }, elapsed: { type: 'number', description: 'Processing time in milliseconds' }, credit_count: { type: 'number', description: 'API credits consumed by this request' } } }
                    }
                }
            },
        }
    }
}
