// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "luksoNetwork" -> "luksonetwork"

export const main = {
    namespace: 'luksonetwork',
    name: 'LUKSO BlockScout Statistics',
    description: 'LUKSO blockchain statistics via BlockScout — network stats overview, transaction volume charts, and market price chart data for the LUKSO Mainnet.',
    version: '4.0.0',
    docs: ['https://explorer.execution.mainnet.lukso.network/api-docs', 'https://explorer.execution.testnet.lukso.network/api-docs'],
    tags: ['lukso', 'statistics', 'network', 'cacheTtlDaily'],
    root: 'https://explorer.execution.--chain--.lukso.network/api/v2',
    tools: {
        getStats: {
            method: 'GET',
            path: '/stats',
            description: 'General blockchain stats via LUKSO BlockScout. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } }
            ],
            tests: [
                { _description: 'Fetch general stats', chainName: 'LUKSO_MAINNET' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        average_block_time: { type: 'number' },
                        coin_image: { type: 'string', nullable: true },
                        coin_price: { type: 'number', nullable: true },
                        coin_price_change_percentage: { type: 'number', nullable: true },
                        gas_price_updated_at: { type: 'string' },
                        gas_prices: { type: 'object', properties: { slow: { type: 'number' }, average: { type: 'number' }, fast: { type: 'number' } } },
                        gas_prices_update_in: { type: 'number' },
                        gas_used_today: { type: 'string' },
                        market_cap: { type: 'string' },
                        network_utilization_percentage: { type: 'number' },
                        secondary_coin_image: { type: 'string', nullable: true },
                        secondary_coin_price: { type: 'number', nullable: true },
                        static_gas_price: { type: 'number', nullable: true },
                        total_addresses: { type: 'string' },
                        total_blocks: { type: 'string' },
                        total_gas_used: { type: 'string' },
                        total_transactions: { type: 'string' },
                        transactions_today: { type: 'string' },
                        tvl: { type: 'string', nullable: true }
                    }
                }
            },
        },
        getTransactionChart: {
            method: 'GET',
            path: '/stats/charts/transactions',
            description: 'Transaction activity chart via LUKSO BlockScout. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } }
            ],
            tests: [
                { _description: 'Get tx chart', chainName: 'LUKSO_TESTNET' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        chart_data: { type: 'array', items: { type: 'object', properties: { date: { type: 'string' }, transactions_count: { type: 'number' } } } }
                    }
                }
            },
        },
        getMarketChart: {
            method: 'GET',
            path: '/stats/charts/market',
            description: 'Token market stats (price, cap, etc.) via LUKSO BlockScout. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } }
            ],
            tests: [
                { _description: 'Get market chart', chainName: 'LUKSO_MAINNET' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        available_supply: { type: 'number' },
                        chart_data: { type: 'array', items: { type: 'string' } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getStats: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    },
    getTransactionChart: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    },
    getMarketChart: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    }
} )
