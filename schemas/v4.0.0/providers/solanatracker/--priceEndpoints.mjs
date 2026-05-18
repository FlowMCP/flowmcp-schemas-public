// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Module-level code: 104 lines

export const main = {
    namespace: 'solanatracker',
    name: 'TokenPriceAPI',
    description: 'Solana token price data via Solana Tracker — real-time prices, historical prices, price at specific timestamps, price ranges, and batch multi-token queries.',
    version: '4.0.0',
    docs: ['https://docs.solanatracker.io'],
    tags: ['solana', 'prices', 'tokens', 'cacheTtlRealtime'],
    root: 'https://data.solanatracker.io',
    requiredServerParams: ['SOLANA_TRACKER_API_KEY'],
    headers: {
        'x-api-key': '{{SOLANA_TRACKER_API_KEY}}',
        'Content-Type': 'application/json'
    },
    tools: {
        priceInformation: {
            method: 'GET',
            path: '/price',
            description: 'Get price information for a single token.',
            parameters: [
                { position: { key: 'token', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'priceChanges', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Test priceInformation', token: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        price: { type: 'number' },
                        priceQuote: { type: 'number' },
                        liquidity: { type: 'number' },
                        marketCap: { type: 'number' },
                        lastUpdated: { type: 'number' }
                    }
                }
            },
        },
        postPrice: {
            method: 'POST',
            path: '/price',
            description: 'Similar to GET /price, but accepts token address in the request body.',
            parameters: [
                { position: { key: 'token', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Test postPrice', token: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump: { type: 'object', properties: { price: { type: 'number' }, priceQuote: { type: 'number' }, liquidity: { type: 'number' }, marketCap: { type: 'number' }, lastUpdated: { type: 'number' } } }
                    }
                }
            },
        },
        multiPriceInformation: {
            method: 'GET',
            path: '/price/multi',
            description: 'Get price information for multiple tokens (up to 100).',
            parameters: [
                { position: { key: 'tokens', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'object()', options: [] } },
                { position: { key: 'priceChanges', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Test multiPriceInformation', tokens: ['CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump'] }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump: { type: 'object', properties: { price: { type: 'number' }, priceQuote: { type: 'number' }, liquidity: { type: 'number' }, marketCap: { type: 'number' }, lastUpdated: { type: 'number' } } }
                    }
                }
            },
        },
        getHistoricPrice: {
            method: 'GET',
            path: '/price/history',
            description: 'Get historic price points for a token (3d, 5d, 7d, 14d, 30d).',
            parameters: [
                { position: { key: 'token', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Test getHistoricPrice', token: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        current: { type: 'number' },
                        '1d': { type: 'number' },
                        '3d': { type: 'number' },
                        '5d': { type: 'number' },
                        '7d': { type: 'number' },
                        '14d': { type: 'number' },
                        '30d': { type: 'number' }
                    }
                }
            },
        },
        getPriceAtTimestamp: {
            method: 'GET',
            path: '/price/history/timestamp',
            description: 'Get price at a specific timestamp for a token.',
            parameters: [
                { position: { key: 'token', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'timestamp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Test getPriceAtTimestamp',
                    token: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
                    timestamp: 1713907200
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        timestamp: { type: 'number' },
                        price: { type: 'number', nullable: true },
                        closest_timestamp: { type: 'number', nullable: true },
                        closest_timestamp_unix: { type: 'number', nullable: true },
                        pool: { type: 'string', nullable: true }
                    }
                }
            },
        },
        getPriceRange: {
            method: 'GET',
            path: '/price/history/range',
            description: 'Get lowest and highest prices for a token within a time range.',
            parameters: [
                { position: { key: 'token', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'time_from', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'time_to', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Test getPriceRange',
                    token: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
                    time_from: 1738368000,
                    time_to: 1738540800
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                        price: { type: 'object', properties: { lowest: { type: 'object', properties: { price: { type: 'number' }, marketcap: { type: 'number' }, time: { type: 'number' } } }, highest: { type: 'object', properties: { price: { type: 'number' }, marketcap: { type: 'number' }, time: { type: 'number' } } } } }
                    }
                }
            },
        },
        postMultiPrice: {
            method: 'POST',
            path: '/price/multi',
            description: 'Get price info for multiple tokens (POST version).',
            parameters: [
                { position: { key: 'tokens', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'object()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Test postMultiPrice',
                    tokens: ['CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump', 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump']
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump: { type: 'object', properties: { price: { type: 'number' }, priceQuote: { type: 'number' }, liquidity: { type: 'number' }, marketCap: { type: 'number' }, lastUpdated: { type: 'number' } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {

    const priceRoutes = {
        getTokenPrice: {
          method: "GET",
          path: "/price",
          description: "Get price info for a single token. Supports optional price change data.",
          queryParams: ["token (required)", "priceChanges (optional)"],
          matchesSchemaRoute: "priceInformation", // ✅ schema.routes.priceInformation
          priceInformation: {
            requestMethod: "GET",
            description: "Get price information for a single token via Solana Tracker. Supports priceChanges filters.",
            route: "/price",
            parameters: [
              {
                position: { key: "token", value: "{{USER_PARAM}}", location: "query" },
                z: { primitive: "string()", options: [] }
              },
              {
                position: { key: "priceChanges", value: "{{USER_PARAM}}", location: "query" },
                z: { primitive: "boolean()", options: ["optional()"] }
              }
            ],
            tests: [
              { _description: "Test priceInformation", token: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump" }
            ],
            modifiers: [ { 'phase': 'post', 'handlerName': 'parseExecute' } ]
          },
        },
        postTokenPrice: {
          method: "POST",
          path: "/price",
          description: "Get price info for a single token (token passed in body).",
          bodyParams: ["token"],
          matchesSchemaRoute: "postPrice", // ✅ schema.routes.postPrice
          postPrice: {
            requestMethod: "POST",
            description: "Similar to GET /price, but accepts token address in the request body. Required: token.",
            route: "/price",
            parameters: [
              {
                position: { key: "token", value: "{{USER_PARAM}}", location: "body" },
                z: { primitive: "string()", options: [] }
              }
            ],
            tests: [
              { _description: "Test postPrice", token: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump" }
            ],
            modifiers: [ { 'phase': 'post', 'handlerName': 'parseExecute' } ]
          },
        },
        getHistoricPrice: {
          method: "GET",
          path: "/price/history",
          description: "Get historic price points for a token (3d, 5d, 7d, 14d, 30d). via Solana Tracker.",
          queryParams: ["token (required)"],
          matchesSchemaRoute: null // ❌ nicht im schema.mjs enthalten
        },
        getPriceAtTimestamp: {
          method: "GET",
          path: "/price/history/timestamp",
          description: "Get price at a specific timestamp for a token via Solana Tracker. Returns structured JSON response data.",
          queryParams: ["token (required)", "timestamp (required)"],
          matchesSchemaRoute: null // ❌ nicht im schema.mjs enthalten
        },
        getPriceRange: {
          method: "GET",
          path: "/price/history/range",
          description: "Get lowest and highest prices for a token within a time range. Required: token, time_from, time_to.",
          queryParams: ["token (required)", "time_from (required)", "time_to (required)"],
          matchesSchemaRoute: null // ❌ nicht im schema.mjs enthalten
        },
        getMultiPrice: {
          method: "GET",
          path: "/price/multi",
          description: "Get price info for multiple tokens (up to 100).",
          queryParams: ["tokens (required)", "priceChanges (optional)"],
          matchesSchemaRoute: "multiPriceInformation", // ✅ schema.routes.multiPriceInformation
          multiPriceInformation: {
            requestMethod: "GET",
            description: "Get price information for multiple tokens (up to 100) via Solana Tracker. Supports priceChanges filters.",
            route: "/price/multi",
            parameters: [
              {
                position: { key: "tokens", value: "{{USER_PARAM}}", location: "query" },
                z: { primitive: "object()", options: [] }
              },
              {
                position: { key: "priceChanges", value: "{{USER_PARAM}}", location: "query" },
                z: { primitive: "boolean()", options: ["optional()"] }
              }
            ],
            tests: [
              { _description: "Test multiPriceInformation", tokens: ["CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"] }
            ],
            modifiers: [ { 'phase': 'post', 'handlerName': 'parseExecute' } ]
          }
        },
        postMultiPrice: {
          method: "POST",
          path: "/price/multi",
          description: "Get price info for multiple tokens (POST version) via Solana Tracker. Returns structured JSON response data.",
          bodyParams: ["tokens"],
          matchesSchemaRoute: null // ❌ nicht im schema.mjs enthalten
        }
      }

    return {
        priceInformation: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }

                return { response }
            }
        },
        postPrice: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }

                return { response }
            }
        },
        multiPriceInformation: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }

                return { response }
            }
        },
        getHistoricPrice: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }

                return { response }
            }
        },
        getPriceAtTimestamp: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }

                return { response }
            }
        },
        getPriceRange: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }

                return { response }
            }
        },
        postMultiPrice: {
            preRequest: async ( { struct, payload } ) => {
                //

                return { struct }
            },
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }

                return { response }
            }
        }
    }
}
