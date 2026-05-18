// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Module-level code: 100 lines

export const main = {
    namespace: 'solanatracker',
    name: 'TokenTradeTracker',
    description: 'Retrieve Solana DEX trade data via Solana Tracker — latest trades by token, pool, wallet, or combination. Supports pagination and Jupiter parse mode.',
    version: '4.0.0',
    docs: ['https://docs.solanatracker.io'],
    tags: ['solana', 'trading', 'swaps', 'cacheTtlRealtime'],
    root: 'https://data.solanatracker.io',
    requiredServerParams: ['SOLANA_TRACKER_API_KEY'],
    headers: {
        'x-api-key': '{{SOLANA_TRACKER_API_KEY}}',
        'Content-Type': 'application/json'
    },
    tools: {
        tokenTrades: {
            method: 'GET',
            path: '/trades/:tokenAddress',
            description: 'Get the latest trades for a token across all pools.',
            parameters: [
                { position: { key: 'tokenAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Test tokenTrades', tokenAddress: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        trades: { type: 'array', items: { type: 'object', properties: { tx: { type: 'string' }, amount: { type: 'number' }, priceUsd: { type: 'number' }, volume: { type: 'number' }, volumeSol: { type: 'number' }, type: { type: 'string' }, wallet: { type: 'string' }, time: { type: 'number' }, program: { type: 'string' }, pools: { type: 'array', items: { type: 'string' } } } } },
                        nextCursor: { type: 'number' },
                        hasNextPage: { type: 'boolean' },
                        sortDirection: { type: 'string' }
                    }
                }
            },
        },
        tradesByWallet: {
            method: 'GET',
            path: '/trades/:tokenAddress/by-wallet/:owner',
            description: 'Get the latest trades for a specific token and wallet address.',
            parameters: [
                { position: { key: 'tokenAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'owner', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'showMeta', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'parseJupiter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'hideArb', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } }
            ],
            tests: [
                {
                    _description: 'Test tradesByWallet',
                    tokenAddress: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
                    owner: 'suqh5sHtr8HyJ7q8scBimULPkPpA557prMG47xCHQfK'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        trades: { type: 'array', items: { type: 'string' } },
                        nextCursor: { type: 'string', nullable: true },
                        hasNextPage: { type: 'boolean' },
                        sortDirection: { type: 'string' }
                    }
                }
            },
        },
        tokenPoolTrades: {
            method: 'GET',
            path: '/trades/:tokenAddress/:poolAddress',
            description: 'Get the latest trades for a specific token and pool via Solana Tracker — query by tokenAddress and poolAddress.',
            parameters: [
                { position: { key: 'tokenAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'poolAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Test tokenPoolTrades', tokenAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', poolAddress: '8QaXeHBrShJTdtN1rWCccBxpSVvKEA1QXVc7sharBYUr' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        trades: { type: 'array', items: { type: 'string' } },
                        nextCursor: { type: 'string', nullable: true },
                        hasNextPage: { type: 'boolean' },
                        sortDirection: { type: 'string' }
                    }
                }
            },
        },
        userPoolTrades: {
            method: 'GET',
            path: '/trades/:tokenAddress/:poolAddress/:owner',
            description: 'Get the latest trades for a specific token, pool, and user via Solana Tracker — query by tokenAddress and poolAddress and owner.',
            parameters: [
                { position: { key: 'tokenAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'poolAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'owner', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Test userPoolTrades', tokenAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', poolAddress: '8QaXeHBrShJTdtN1rWCccBxpSVvKEA1QXVc7sharBYUr', owner: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        trades: { type: 'array', items: { type: 'string' } },
                        nextCursor: { type: 'string', nullable: true },
                        hasNextPage: { type: 'boolean' },
                        sortDirection: { type: 'string' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {

    const tradeRoutes = {
        getTokenTrades: {
          method: "GET",
          path: "/trades/{tokenAddress}",
          description: "Get the latest trades for a token across all pools.",
          queryParams: [
            "cursor (optional)",
            "showMeta (optional)",
            "parseJupiter (optional)",
            "hideArb (optional)",
            "sortDirection (optional)"
          ],
          matchesSchemaRoute: "tokenTrades", // ✅ schema.routes.tokenTrades
          tokenTrades: {
            requestMethod: "GET",
            description: "Get the latest trades for a token across all pools via Solana Tracker — query by tokenAddress.",
            route: "/trades/:tokenAddress",
            parameters: [
              {
                position: { key: "tokenAddress", value: "{{USER_PARAM}}", location: "insert" },
                z: { primitive: "string()", options: [] }
              }
            ],
            tests: [
              { _description: "Test tokenTrades", tokenAddress: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump" }
            ],
            modifiers: [ { 'phase': 'post', 'handlerName': 'parseExecute' } ]
          },
        },
        getTokenPoolTrades: {
          method: "GET",
          path: "/trades/{tokenAddress}/{poolAddress}",
          description: "Get the latest trades for a specific token and pool.",
          queryParams: [
            "cursor (optional)",
            "showMeta (optional)",
            "parseJupiter (optional)",
            "hideArb (optional)",
            "sortDirection (optional)"
          ],
          matchesSchemaRoute: null // ❌ nicht vorhanden im schema.mjs
        },
        getUserPoolTrades: {
          method: "GET",
          path: "/trades/{tokenAddress}/{poolAddress}/{owner}",
          description: "Get the latest trades for a specific token, pool, and user.",
          queryParams: [
            "cursor (optional)",
            "showMeta (optional)",
            "parseJupiter (optional)",
            "hideArb (optional)",
            "sortDirection (optional)"
          ],
          matchesSchemaRoute: null // ❌ nicht vorhanden im schema.mjs
        },
        getUserTokenTrades: {
          method: "GET",
          path: "/trades/{tokenAddress}/by-wallet/{owner}",
          description: "Get the latest trades for a token by a specific wallet.",
          queryParams: [
            "cursor (optional)",
            "showMeta (optional)",
            "parseJupiter (optional)",
            "hideArb (optional)",
            "sortDirection (optional)"
          ],
          matchesSchemaRoute: "tradesByWallet", // ✅ schema.routes.tradesByWallet
          tradesByWallet: {
            requestMethod: "GET",
            description: "Get the latest trades for a specific token and wallet address. Required: tokenAddress, owner. Optional filters: showMeta, parseJupiter, hideArb.",
            route: "/trades/:tokenAddress/by-wallet/:owner",
            parameters: [
              {
                position: { key: "tokenAddress", value: "{{USER_PARAM}}", location: "insert" },
                z: { primitive: "string()", options: [] }
              },
              {
                position: { key: "owner", value: "{{USER_PARAM}}", location: "insert" },
                z: { primitive: "string()", options: [] }
              },
              {
                position: { key: "showMeta", value: "{{USER_PARAM}}", location: "query" },
                z: { primitive: "boolean()", options: ["optional()"] }
              },
              {
                position: { key: "parseJupiter", value: "{{USER_PARAM}}", location: "query" },
                z: { primitive: "boolean()", options: ["optional()"] }
              },
              {
                position: { key: "hideArb", value: "{{USER_PARAM}}", location: "query" },
                z: { primitive: "boolean()", options: ["optional()"] }
              }
            ],
            tests: [
              { _description: "Test tradesByWallet", tokenAddress: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump", owner: "suqh5sHtr8HyJ7q8scBimULPkPpA557prMG47xCHQfK" }
            ],
            modifiers: [ { 'phase': 'post', 'handlerName': 'parseExecute' } ]
          },
        }
      };

    return {
        tokenTrades: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }
                return { response }
            }
        },
        tradesByWallet: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }
                return { response }
            }
        },
        tokenPoolTrades: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }
                return { response }
            }
        },
        userPoolTrades: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }
                return { response }
            }
        }
    }
}
