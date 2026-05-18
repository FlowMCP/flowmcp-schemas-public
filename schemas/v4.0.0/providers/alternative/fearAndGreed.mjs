// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'alternative',
    name: 'FearGreedIndex',
    description: 'Fetch and analyze the Crypto Fear and Greed Index from alternative.me — current reading, historical data with configurable lookback, and trend analysis.',
    version: '4.0.0',
    docs: ['https://alternative.me/crypto/api/'],
    tags: ['crypto', 'sentiment', 'index', 'cacheTtlFrequent'],
    root: 'https://api.alternative.me/fng',
    tools: {
        getCurrentFng: {
            method: 'GET',
            path: '/',
            description: 'Retrieve the latest Fear & Greed Index via alternative.me. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Get current FNG value' },
                { _description: 'Fetch latest fear and greed reading' },
                { _description: 'Check current crypto sentiment index' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        data: { type: 'array', items: { type: 'object', properties: { value: { type: 'string' }, value_classification: { type: 'string' }, timestamp: { type: 'string' }, time_until_update: { type: 'string' } } } },
                        metadata: { type: 'object', properties: { error: { type: 'string' } } }
                    }
                }
            }
        },
        getHistoricalFng: {
            method: 'GET',
            path: '/',
            description: 'Get historical Fear & Greed Index values for past days via alternative.me. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'days', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(7)'] }, description: 'Number of past days to retrieve (1-100), e.g. 7 for one week of history' }
            ],
            tests: [
                { _description: 'Fetch FNG for past 5 days', days: 5 },
                { _description: 'Get last 30 days of FNG history', days: 30 },
                { _description: 'Get FNG for yesterday only', days: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        data: { type: 'array', items: { type: 'object', properties: { value: { type: 'string' }, value_classification: { type: 'string' }, timestamp: { type: 'string' }, time_until_update: { type: 'string' } } } },
                        metadata: { type: 'object', properties: { error: { type: 'string' } } }
                    }
                }
            }
        },
        analyzeFngTrend: {
            method: 'GET',
            path: '/',
            description: 'Analyze the trend of the Fear & Greed Index over a number of days. Required: days.',
            parameters: [
                { position: { key: 'days', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(7)'] }, description: 'Number of past days to analyze for trend (1-100), e.g. 10 for a short-term trend' }
            ],
            tests: [
                { _description: 'Analyze FNG trend for last 10 days', days: 10 },
                { _description: 'Analyze weekly FNG trend', days: 7 },
                { _description: 'Analyze monthly FNG trend', days: 30 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        data: { type: 'array', items: { type: 'object', properties: { value: { type: 'string' }, value_classification: { type: 'string' }, timestamp: { type: 'string' }, time_until_update: { type: 'string' } } } },
                        metadata: { type: 'object', properties: { error: { type: 'string' } } }
                    }
                }
            }
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getCurrentFng: {
        postRequest: async ( { response, struct, payload } ) => {
            struct.fng = payload?.content?.[0]?.text || "";
            return { response }
        }
    },
    getHistoricalFng: {
        postRequest: async ( { response, struct, payload } ) => {
            struct.history = payload?.content?.[0]?.text || "";
            return { response }
        }
    },
    analyzeFngTrend: {
        postRequest: async ( { response, struct, payload } ) => {
            struct.analysis = payload?.content?.[0]?.text || "";
            return { response }
        }
    }
} )
