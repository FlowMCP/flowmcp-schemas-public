// Split from lukso-network/address.mjs
// Part 1 of 2
// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "luksoNetwork" -> "luksonetwork"
// 12 routes (v2 max: 8) — needs splitting

export const main = {
    namespace: 'luksonetwork',
    name: 'LUKSO BlockScout Addresses (Part 1)',
    description: 'Comprehensive address data on LUKSO via BlockScout — transactions, token transfers, internal txs, logs, balances, and coin balance history for any address.',
    version: '4.0.0',
    docs: ['https://explorer.execution.mainnet.lukso.network/api-docs', 'https://explorer.execution.testnet.lukso.network/api-docs'],
    tags: ['lukso', 'address', 'explorer', 'cacheTtlDaily'],
    root: 'https://explorer.execution.--chain--.lukso.network/api/v2',
    tools: {
        listAddresses: {
            method: 'GET',
            path: '/addresses',
            description: 'List native coin holders via LUKSO BlockScout. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } }
            ],
            tests: [
                { _description: 'List LUKSO mainnet coin holders', chainName: 'LUKSO_MAINNET' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { transactions_count: { type: 'string' }, coin_balance: { type: 'string' }, ens_domain_name: { type: 'string', nullable: true }, hash: { type: 'string' }, implementations: { type: 'array', items: { type: 'string' } }, is_contract: { type: 'boolean' }, is_scam: { type: 'boolean' }, is_verified: { type: 'boolean' }, metadata: { type: 'string', nullable: true }, name: { type: 'string' }, private_tags: { type: 'array', items: { type: 'string' } }, proxy_type: { type: 'string', nullable: true }, public_tags: { type: 'array', items: { type: 'string' } }, reputation: { type: 'string' }, watchlist_names: { type: 'array', items: { type: 'string' } } } } },
                        total_supply: { type: 'string' },
                        next_page_params: { type: 'object', properties: { hash: { type: 'string' }, transactions_count: { type: 'number' }, fetched_coin_balance: { type: 'string' }, items_count: { type: 'number' } } },
                        exchange_rate: { type: 'number', nullable: true }
                    }
                }
            },
        },
        getAddress: {
            method: 'GET',
            path: '/addresses/:address_hash',
            description: 'Basic address info via LUKSO BlockScout — query by address hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{40}$)'] } }
            ],
            tests: [
                {
                    _description: 'Get LUKSO Universal Profile info',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x7609bF8e9DE5446dBbD1C11ef7aBe00a17B4C5bB'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        block_number_balance_updated_at: { type: 'number', nullable: true },
                        coin_balance: { type: 'number', nullable: true },
                        creation_status: { type: 'string', nullable: true },
                        creation_transaction_hash: { type: 'string', nullable: true },
                        creator_address_hash: { type: 'string', nullable: true },
                        ens_domain_name: { type: 'string', nullable: true },
                        exchange_rate: { type: 'number', nullable: true },
                        has_beacon_chain_withdrawals: { type: 'boolean' },
                        has_logs: { type: 'boolean' },
                        has_token_transfers: { type: 'boolean' },
                        has_tokens: { type: 'boolean' },
                        has_validated_blocks: { type: 'boolean' },
                        hash: { type: 'string' },
                        implementations: { type: 'array', items: { type: 'string' } },
                        is_contract: { type: 'boolean' },
                        is_scam: { type: 'boolean' },
                        is_verified: { type: 'boolean' },
                        metadata: { type: 'string', nullable: true },
                        name: { type: 'string', nullable: true },
                        private_tags: { type: 'array', items: { type: 'string' } },
                        proxy_type: { type: 'string', nullable: true },
                        public_tags: { type: 'array', items: { type: 'string' } },
                        reputation: { type: 'string' },
                        token: { type: 'string', nullable: true },
                        watchlist_address_id: { type: 'string', nullable: true },
                        watchlist_names: { type: 'array', items: { type: 'string' } }
                    }
                }
            },
        },
        getAddressCounters: {
            method: 'GET',
            path: '/addresses/:address_hash/counters',
            description: 'Address usage counters via LUKSO BlockScout — query by address hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get address usage counters on LUKSO',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x7609bF8e9DE5446dBbD1C11ef7aBe00a17B4C5bB'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        transactions_count: { type: 'string' },
                        token_transfers_count: { type: 'string' },
                        gas_usage_count: { type: 'string' },
                        validations_count: { type: 'string' }
                    }
                }
            },
        },
        getAddressTransactions: {
            method: 'GET',
            path: '/addresses/:address_hash/transactions',
            description: 'Get transactions by address via LUKSO BlockScout — query by address hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get transactions for LUKSO address',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x7609bF8e9DE5446dBbD1C11ef7aBe00a17B4C5bB'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'string' } },
                        next_page_params: { type: 'string', nullable: true }
                    }
                }
            },
        },
        getAddressTokenTransfers: {
            method: 'GET',
            path: '/addresses/:address_hash/token-transfers',
            description: 'Token transfers for address via LUKSO BlockScout — query by address hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get token transfers for LUKSO address',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x7609bF8e9DE5446dBbD1C11ef7aBe00a17B4C5bB'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'string' } },
                        next_page_params: { type: 'string', nullable: true }
                    }
                }
            },
        },
        getAddressInternalTxs: {
            method: 'GET',
            path: '/addresses/:address_hash/internal-transactions',
            description: 'Internal txs for address via LUKSO BlockScout — query by address hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get internal txs for LUKSO address',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x7609bF8e9DE5446dBbD1C11ef7aBe00a17B4C5bB'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'string' } },
                        next_page_params: { type: 'string', nullable: true }
                    }
                }
            },
        },
        getAddressLogs: {
            method: 'GET',
            path: '/addresses/:address_hash/logs',
            description: 'Logs emitted to/from address via LUKSO BlockScout — query by address hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get logs for LUKSO address',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x7609bF8e9DE5446dBbD1C11ef7aBe00a17B4C5bB'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'string' } },
                        next_page_params: { type: 'string', nullable: true }
                    }
                }
            },
        },
        getBlocksValidated: {
            method: 'GET',
            path: '/addresses/:address_hash/blocks-validated',
            description: 'Blocks validated by address via LUKSO BlockScout — query by address hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get blocks validated by LUKSO address',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x7609bF8e9DE5446dBbD1C11ef7aBe00a17B4C5bB'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'string' } },
                        next_page_params: { type: 'string', nullable: true }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    listAddresses: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    },
    getAddress: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    },
    getAddressCounters: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    },
    getAddressTransactions: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    },
    getAddressTokenTransfers: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    },
    getAddressInternalTxs: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    },
    getAddressLogs: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    },
    getBlocksValidated: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        }
    }
} )
