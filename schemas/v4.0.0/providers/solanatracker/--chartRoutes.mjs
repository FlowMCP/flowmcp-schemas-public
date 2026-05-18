// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Module-level code: 85 lines

export const main = {
    namespace: 'solanatracker',
    name: 'TokenChartAPI',
    description: 'Retrieve OHLCV candlestick and holder distribution chart data from Solana Tracker for specific tokens and pools on the Solana blockchain.',
    version: '4.0.0',
    docs: ['https://docs.solanatracker.io'],
    tags: ['solana', 'charts', 'ohlcv', 'cacheTtlFrequent'],
    root: 'https://data.solanatracker.io',
    requiredServerParams: ['SOLANA_TRACKER_API_KEY'],
    headers: {
        'x-api-key': '{{SOLANA_TRACKER_API_KEY}}',
        'Content-Type': 'application/json'
    },
    tools: {
        chartData: {
            method: 'GET',
            path: '/chart/:token',
            description: 'Get OHLCV (Open, High, Low, Close, Volume) chart data for a token.',
            parameters: [
                { position: { key: 'token', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'time_from', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'time_to', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'marketCap', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'removeOutliers', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(true)'] } }
            ],
            tests: [
                { _description: 'Test chartData', token: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        oclhv: { type: 'array', items: { type: 'object', properties: { open: { type: 'number' }, close: { type: 'number' }, low: { type: 'number' }, high: { type: 'number' }, volume: { type: 'number' }, time: { type: 'number' } } } }
                    }
                }
            },
        },
        chartDataByPool: {
            method: 'GET',
            path: '/chart/:token/:pool',
            description: 'Get OHLCV chart data for a specific token in a specific pool. Required: token, pool. Optional filters: type, time_from, time_to, marketCap, removeOutliers.',
            parameters: [
                { position: { key: 'token', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'pool', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'time_from', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'time_to', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'marketCap', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'removeOutliers', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(true)'] } }
            ],
            tests: [
                {
                    _description: 'Test chartDataByPool',
                    token: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
                    pool: '9Tb2ohu5P16BpBarqd3N27WnkF51Ukfs8Z1GzzLDxVZW'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        oclhv: { type: 'array', items: { type: 'object', properties: { open: { type: 'number' }, close: { type: 'number' }, low: { type: 'number' }, high: { type: 'number' }, volume: { type: 'number' }, time: { type: 'number' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {

    const chartRoutes = {
        getOHLCV: {
          method: "GET",
          path: "/chart/{token}",
          description: "Get OHLCV (Open, High, Low, Close, Volume) chart data for a token.",
          queryParams: [
            "type (optional): Time interval (e.g., '1m', '1h', '1d')",
            "time_from (optional): Start time (Unix timestamp in seconds)",
            "time_to (optional): End time (Unix timestamp in seconds)",
            "marketCap (optional): Return market cap chart instead of price",
            "removeOutliers (optional): true by default"
          ],
          matchesSchemaRoute: "chartData", // → schema.routes.chartData
          chartData: {
            requestMethod: "GET",
            description: "Get chartdata",
            route: "/chart/:token",
            parameters: [
              {
                position: { key: "token", value: "{{USER_PARAM}}", location: "insert" },
                z: { primitive: "string()", options: [] }
              }
            ],
            tests: [
              { _description: "Test chartData", token: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump" }
            ],
            modifiers: [ { 'phase': 'post', 'handlerName': 'parseExecute' } ]
          },
        },
        getOHLCVByPool: {
          method: "GET",
          path: "/chart/{token}/{pool}",
          description: "Same as /chart/{token}, but scoped to a specific pool.",
          queryParams: [
            "type (optional)",
            "time_from (optional)",
            "time_to (optional)",
            "marketCap (optional)",
            "removeOutliers (optional)"
          ],
          matchesSchemaRoute: "chartDataByPool", // → schema.routes.chartDataByPool
          chartDataByPool: {
            requestMethod: "GET",
            description: "Get OLCVH (Open, Low, Close, Volume, High) data for charts.",
            route: "/chart/:token/:pool",
            parameters: [
              {
                position: { key: "token", value: "{{USER_PARAM}}", location: "insert" },
                z: { primitive: "string()", options: [] }
              },
              {
                position: { key: "pool", value: "{{USER_PARAM}}", location: "insert" },
                z: { primitive: "string()", options: [] }
              },
              {
                position: { key: "type", value: "{{USER_PARAM}}", location: "query" },
                z: { primitive: "string()", options: ["optional()"] }
              },
              {
                position: { key: "time_from", value: "{{USER_PARAM}}", location: "query" },
                z: { primitive: "number()", options: ["optional()"] }
              },
              {
                position: { key: "time_to", value: "{{USER_PARAM}}", location: "query" },
                z: { primitive: "number()", options: ["optional()"] }
              }
            ],
            tests: [
              { _description: "Test chartDataByPool", token: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump", pool: "9Tb2ohu5P16BpBarqd3N27WnkF51Ukfs8Z1GzzLDxVZW" }
            ],
            modifiers: [ { 'phase': 'post', 'handlerName': 'parseExecute' } ]
          }
        },
        getHoldersChart: {
          method: "GET",
          path: "/holders/chart/{token}",
          description: "Get historical holder count data for a token.",
          queryParams: [
            "type (optional): Defaults to '1d'",
            "time_from (optional)",
            "time_to (optional)"
          ],
          matchesSchemaRoute: null // ❌ nicht im schema.mjs vorhanden
        }
      };

    return {
        chartData: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }

                return { response }
            }
        },
        chartDataByPool: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }

                return { response }
            }
        }
    }
}
