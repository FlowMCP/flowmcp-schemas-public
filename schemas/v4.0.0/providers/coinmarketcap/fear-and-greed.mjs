// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'coinmarketcap',
    name: 'CMCCryptoFearAndGreed',
    description: 'Retrieve the CoinMarketCap Crypto Fear and Greed Index — latest sentiment reading plus historical time-series data for market psychology tracking. Use getFearAndGreedLatest for current sentiment and getFearAndGreedHistorical for paginated historical values.',
    version: '4.0.0',
    docs: ['https://coinmarketcap.com/api/documentation/v1/'],
    tags: ['crypto', 'sentiment', 'index', 'cacheTtlFrequent'],
    root: 'https://pro-api.coinmarketcap.com',
    requiredServerParams: ['CMC_API_KEY'],
    headers: {
        'X-CMC_PRO_API_KEY': '{{CMC_API_KEY}}'
    },
    tools: {
        getFearAndGreedHistorical: {
            method: 'GET',
            path: '/v3/fear-and-greed/historical',
            description: 'Fetch historical CMC Crypto Fear and Greed values via CoinMarketCap. Supports start, limit filters. Returns paginated time series of sentiment readings — each with a numeric value (0-100) and classification label.',
            parameters: [
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'optional()'], description: 'Pagination offset (1-based index of the first result)' } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(500)', 'optional()'], description: 'Maximum number of historical data points to return (1-500)' } }
            ],
            tests: [
                { _description: 'Fetch first 5 historical Fear and Greed values.', start: 1, limit: 5 },
                { _description: 'Fetch historical values without pagination parameters.', start: 1, limit: 5 },
                { _description: 'Fetch 10 historical values starting at offset 20', start: 20, limit: 10 }
            ],
            output: {
                description: 'Paginated time series of Fear and Greed index readings with numeric values and sentiment classifications',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CMC API response containing historical Fear and Greed data points and request status',
                    properties: {
                        data: { type: 'array', description: 'Array of historical Fear and Greed readings ordered by time', items: { type: 'object', properties: { timestamp: { type: 'string', description: 'ISO 8601 timestamp for this sentiment reading' }, value: { type: 'number', description: 'Fear and Greed index value from 0 (extreme fear) to 100 (extreme greed)' }, value_classification: { type: 'string', description: 'Sentiment label: Extreme Fear, Fear, Neutral, Greed, or Extreme Greed' } } } },
                        status: { type: 'object', description: 'API request metadata including error state and credit usage', properties: { timestamp: { type: 'string', description: 'ISO 8601 timestamp when request was processed' }, error_code: { type: 'number', description: 'Error code (0 = success, non-zero = error)' }, error_message: { type: 'string', nullable: true, description: 'Error message, null on success' }, elapsed: { type: 'number', description: 'Processing time in milliseconds' }, credit_count: { type: 'number', description: 'API credits consumed by this request' } } }
                    }
                }
            },
        },
        getFearAndGreedLatest: {
            method: 'GET',
            path: '/v3/fear-and-greed/latest',
            description: 'Fetch the latest CMC Crypto Fear and Greed value via CoinMarketCap. Returns a single current sentiment reading with numeric value (0-100) and classification label. No parameters needed.',
            parameters: [],
            tests: [
                { _description: 'Fetch latest Fear and Greed value.' },
                { _description: 'Verify latest Fear and Greed response structure' },
                { _description: 'Fetch current market sentiment index' }
            ],
            output: {
                description: 'Current Fear and Greed index reading with numeric value and sentiment classification',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CMC API response containing the latest Fear and Greed reading and request status',
                    properties: {
                        data: { type: 'object', description: 'Current Fear and Greed index data', properties: { value: { type: 'number', description: 'Current Fear and Greed index value from 0 (extreme fear) to 100 (extreme greed)' }, update_time: { type: 'string', description: 'ISO 8601 timestamp of the most recent index calculation' }, value_classification: { type: 'string', description: 'Sentiment label: Extreme Fear, Fear, Neutral, Greed, or Extreme Greed' } } },
                        status: { type: 'object', description: 'API request metadata including error state and credit usage', properties: { timestamp: { type: 'string', description: 'ISO 8601 timestamp when request was processed' }, error_code: { type: 'number', description: 'Error code (0 = success, non-zero = error)' }, error_message: { type: 'string', nullable: true, description: 'Error message, null on success' }, elapsed: { type: 'number', description: 'Processing time in milliseconds' }, credit_count: { type: 'number', description: 'API credits consumed by this request' } } }
                    }
                }
            },
        }
    }
}
