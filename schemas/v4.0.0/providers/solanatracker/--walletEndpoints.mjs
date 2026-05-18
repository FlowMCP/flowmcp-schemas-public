// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Module-level code: 61 lines

export const main = {
    namespace: 'solanatracker',
    name: 'WalletExplorer',
    description: 'Query Solana wallet data via Solana Tracker — token balances with USD values, recent trades, and paginated portfolio views for any wallet address.',
    version: '4.0.0',
    docs: ['https://docs.solanatracker.io'],
    tags: ['solana', 'wallet', 'portfolio', 'cacheTtlFrequent'],
    root: 'https://data.solanatracker.io',
    requiredServerParams: ['SOLANA_TRACKER_API_KEY'],
    headers: {
        'x-api-key': '{{SOLANA_TRACKER_API_KEY}}',
        'Content-Type': 'application/json'
    },
    tools: {
        walletInformation: {
            method: 'GET',
            path: '/wallet/:owner',
            description: 'Get all tokens in a wallet with current value in USD.',
            parameters: [
                { position: { key: 'owner', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Test walletInformation', owner: 'suqh5sHtr8HyJ7q8scBimULPkPpA557prMG47xCHQfK' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        tokens: { type: 'array', items: { type: 'object', properties: { token: { type: 'object' }, pools: { type: 'array', items: { type: 'object' } }, events: { type: 'object' }, risk: { type: 'object' }, buys: { type: 'number' }, sells: { type: 'number' }, txns: { type: 'number' }, holders: { type: 'number' }, balance: { type: 'number' }, value: { type: 'number' } } } },
                        total: { type: 'number' },
                        totalSol: { type: 'number' }
                    }
                }
            },
        },
        walletTokensBasic: {
            method: 'GET',
            path: '/wallet/:owner/basic',
            description: 'Lightweight version: token balances and values without full metadata. Required: owner.',
            parameters: [
                { position: { key: 'owner', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Test walletTokensBasic', owner: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        tokens: { type: 'array', items: { type: 'object', properties: { address: { type: 'string' }, balance: { type: 'number' }, value: { type: 'number' }, price: { type: 'object' }, marketCap: { type: 'object' }, liquidity: { type: 'object' } } } },
                        total: { type: 'number' },
                        totalSol: { type: 'number' }
                    }
                }
            },
        },
        walletTokensPaged: {
            method: 'GET',
            path: '/wallet/:owner/page/:page',
            description: 'Paginated version: fetch wallet tokens page by page (250 per page). Required: owner, page.',
            parameters: [
                { position: { key: 'owner', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Test walletTokensPaged', owner: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1', page: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        tokens: { type: 'array', items: { type: 'object', properties: { token: { type: 'object' }, pools: { type: 'array', items: { type: 'object' } }, events: { type: 'object' }, risk: { type: 'object' }, buys: { type: 'number' }, sells: { type: 'number' }, txns: { type: 'number' }, holders: { type: 'number' }, balance: { type: 'number' }, value: { type: 'number' } } } },
                        hasMore: { type: 'boolean' },
                        totalPages: { type: 'number' }
                    }
                }
            },
        },
        walletTrades: {
            method: 'GET',
            path: '/wallet/:owner/trades',
            description: 'Get the latest trades of a wallet.',
            parameters: [
                { position: { key: 'owner', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Test walletTrades', owner: 'suqh5sHtr8HyJ7q8scBimULPkPpA557prMG47xCHQfK' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        trades: { type: 'array', items: { type: 'object', properties: { tx: { type: 'string' }, from: { type: 'object' }, to: { type: 'object' }, price: { type: 'object' }, volume: { type: 'object' }, wallet: { type: 'string' }, program: { type: 'string' }, time: { type: 'number' } } } },
                        nextCursor: { type: 'number' },
                        hasNextPage: { type: 'boolean' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {

    const walletRoutes = {
        getWalletTokens: {
          method: "GET",
          path: "/wallet/{owner}",
          description: "Get all tokens in a wallet with value in USD and metadata.",
          matchesSchemaRoute: "walletInformation", // ✅ schema.routes.walletInformation
          walletInformation: {
            requestMethod: "GET",
            description: "Get all tokens in a wallet with current value in USD via Solana Tracker — query by owner.",
            route: "/wallet/:owner",
            parameters: [
              {
                position: { key: "owner", value: "{{USER_PARAM}}", location: "insert" },
                z: { primitive: "string()", options: [] }
              }
            ],
            tests: [
              { _description: "Test walletInformation", owner: "suqh5sHtr8HyJ7q8scBimULPkPpA557prMG47xCHQfK" }
            ],
            modifiers: [ { 'phase': 'post', 'handlerName': 'parseExecute' } ]
          },
        },
        getWalletTokensBasic: {
          method: "GET",
          path: "/wallet/{owner}/basic",
          description: "Lightweight version: token balances and values without full metadata.",
          matchesSchemaRoute: null // ❌ nicht im schema.mjs enthalten
        },
        getWalletTokensPaged: {
          method: "GET",
          path: "/wallet/{owner}/page/{page}",
          description: "Paginated version: fetch wallet tokens page by page (250 per page).",
          matchesSchemaRoute: null // ❌ nicht im schema.mjs enthalten
        },
        getWalletTrades: {
          method: "GET",
          path: "/wallet/{owner}/trades",
          description: "Get latest trades for a wallet. Supports pagination via cursor.",
          queryParams: ["cursor (optional)"],
          matchesSchemaRoute: "walletTrades", // ✅ schema.routes.walletTrades
          walletTrades: {
            requestMethod: "GET",
            description: "Get the latest trades of a wallet via Solana Tracker — query by owner. Supports cursor filters.",
            route: "/wallet/:owner/trades",
            parameters: [
              {
                position: { key: "owner", value: "{{USER_PARAM}}", location: "insert" },
                z: { primitive: "string()", options: [] }
              },
              {
                position: { key: "cursor", value: "{{USER_PARAM}}", location: "query" },
                z: { primitive: "string()", options: ["optional()"] }
              }
            ],
            tests: [
              { _description: "Test walletTrades", owner: "suqh5sHtr8HyJ7q8scBimULPkPpA557prMG47xCHQfK" }
            ],
            modifiers: [ { 'phase': 'post', 'handlerName': 'parseExecute' } ]
          },
        }
    }

    return {
        walletInformation: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }
                return { response }
            }
        },
        walletTokensBasic: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }
                return { response }
            }
        },
        walletTokensPaged: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }
                return { response }
            }
        },
        walletTrades: {
            postRequest: async ( { response, struct, payload } ) => {
                if( response.error ) {
                throw new Error( response.error )
                }
                return { response }
            }
        }
    }
}
