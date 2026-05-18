// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "luksoNetwork" -> "luksonetwork"

export const main = {
    namespace: 'luksonetwork',
    name: 'LUKSO BlockScout Tokens',
    description: 'LUKSO token data via BlockScout — list tokens, get token details by address, transfer history, holder lists, and token counter statistics.',
    version: '4.0.0',
    docs: ['https://explorer.execution.mainnet.lukso.network/api-docs', 'https://explorer.execution.testnet.lukso.network/api-docs'],
    tags: ['lukso', 'tokens', 'balances', 'cacheTtlDaily'],
    root: 'https://explorer.execution.--chain--.lukso.network/api/v2',
    tools: {
        listTokens: {
            method: 'GET',
            path: '/tokens',
            description: 'List all tokens registered on the LUKSO blockchain via BlockScout. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } }
            ],
            tests: [
                { _description: 'List tokens on mainnet', chainName: 'LUKSO_MAINNET' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { address_hash: { type: 'string' }, circulating_market_cap: { type: 'number', nullable: true }, decimals: { type: 'string' }, exchange_rate: { type: 'number', nullable: true }, holders_count: { type: 'string' }, icon_url: { type: 'string', nullable: true }, name: { type: 'string' }, reputation: { type: 'string' }, symbol: { type: 'string' }, total_supply: { type: 'string' }, type: { type: 'string' }, volume_24h: { type: 'number', nullable: true } } } },
                        next_page_params: { type: 'object', properties: { name: { type: 'string' }, fiat_value: { type: 'number', nullable: true }, contract_address_hash: { type: 'string' }, market_cap: { type: 'number', nullable: true }, holders_count: { type: 'number' }, is_name_null: { type: 'boolean' }, items_count: { type: 'number' } } }
                    }
                }
            },
        },
        getTokenByAddress: {
            method: 'GET',
            path: '/tokens/:address_hash',
            description: 'Get token metadata via LUKSO BlockScout — query by address hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Token metadata (LYX)',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x6E55472109E6aBE4054a8E8b8d9EdFfCb31032C5'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        address_hash: { type: 'string' },
                        circulating_market_cap: { type: 'number', nullable: true },
                        decimals: { type: 'string' },
                        exchange_rate: { type: 'number', nullable: true },
                        holders_count: { type: 'string' },
                        icon_url: { type: 'string', nullable: true },
                        name: { type: 'string' },
                        reputation: { type: 'string' },
                        symbol: { type: 'string' },
                        total_supply: { type: 'string' },
                        type: { type: 'string' },
                        volume_24h: { type: 'number', nullable: true }
                    }
                }
            },
        },
        getTokenTransfersByAddress: {
            method: 'GET',
            path: '/tokens/:address_hash/transfers',
            description: 'Token transfer history via LUKSO BlockScout — query by address hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Token transfers (LYX)',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x6E55472109E6aBE4054a8E8b8d9EdFfCb31032C5'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { block_hash: { type: 'string' }, block_number: { type: 'number' }, from: { type: 'object' }, log_index: { type: 'number' }, method: { type: 'string' }, timestamp: { type: 'string' }, to: { type: 'object' }, token: { type: 'object' }, token_type: { type: 'string' }, total: { type: 'object' }, transaction_hash: { type: 'string' }, type: { type: 'string' } } } },
                        next_page_params: { type: 'object', properties: { index: { type: 'number' }, block_number: { type: 'number' } } }
                    }
                }
            },
        },
        getTokenHolders: {
            method: 'GET',
            path: '/tokens/:address_hash/holders',
            description: 'List token holders via LUKSO BlockScout — query by address hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Token holders (LYX)',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x6E55472109E6aBE4054a8E8b8d9EdFfCb31032C5'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { address: { type: 'object' }, token_id: { type: 'string', nullable: true }, value: { type: 'string' } } } },
                        next_page_params: { type: 'object', properties: { value: { type: 'string' }, address_hash: { type: 'string' }, items_count: { type: 'number' } } }
                    }
                }
            },
        },
        getTokenCounters: {
            method: 'GET',
            path: '/tokens/:address_hash/counters',
            description: 'Token analytics counters via LUKSO BlockScout — query by address hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Token counters (LYX)',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x6E55472109E6aBE4054a8E8b8d9EdFfCb31032C5'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        token_holders_count: { type: 'string' },
                        transfers_count: { type: 'string' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    listTokens: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    },
    getTokenByAddress: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    },
    getTokenTransfersByAddress: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    },
    getTokenHolders: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    },
    getTokenCounters: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    }
} )
