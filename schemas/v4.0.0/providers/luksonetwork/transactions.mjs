// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "luksoNetwork" -> "luksonetwork"

export const main = {
    namespace: 'luksonetwork',
    name: 'LUKSO BlockScout Transactions',
    description: 'Fetch transaction data from LUKSO BlockScout — list transactions, get details by hash, token transfers, internal txs, logs, raw traces, and state changes.',
    version: '4.0.0',
    docs: ['https://explorer.execution.mainnet.lukso.network/api-docs', 'https://explorer.execution.testnet.lukso.network/api-docs'],
    tags: ['lukso', 'transactions', 'explorer', 'cacheTtlFrequent'],
    root: 'https://explorer.execution.--chain--.lukso.network/api/v2',
    tools: {
        getTransactions: {
            method: 'GET',
            path: '/transactions',
            description: 'List transactions (filterable) via LUKSO BlockScout. Supports type filters. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get all transactions from mainnet', chainName: 'LUKSO_MAINNET' },
                { _description: 'Get token_transfer transactions from testnet', chainName: 'LUKSO_TESTNET', type: 'token_transfer' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { priority_fee: { type: 'string' }, raw_input: { type: 'string' }, is_pending_update: { type: 'boolean' }, result: { type: 'string' }, hash: { type: 'string' }, max_fee_per_gas: { type: 'string' }, revert_reason: { type: 'string', nullable: true }, confirmation_duration: { type: 'array', items: { type: 'number' } }, transaction_burnt_fee: { type: 'string' }, type: { type: 'number' }, token_transfers_overflow: { type: 'string', nullable: true }, confirmations: { type: 'number' }, position: { type: 'number' }, max_priority_fee_per_gas: { type: 'string' }, transaction_tag: { type: 'string', nullable: true }, created_contract: { type: 'string', nullable: true }, value: { type: 'string' }, from: { type: 'object' }, gas_used: { type: 'string' }, status: { type: 'string' }, to: { type: 'object' }, authorization_list: { type: 'array', items: { type: 'string' } }, method: { type: 'string' }, fee: { type: 'object' }, actions: { type: 'array', items: { type: 'string' } }, gas_limit: { type: 'string' }, gas_price: { type: 'string' }, decoded_input: { type: 'object' }, token_transfers: { type: 'string', nullable: true }, base_fee_per_gas: { type: 'string' }, timestamp: { type: 'string' }, nonce: { type: 'number' }, historic_exchange_rate: { type: 'number', nullable: true }, transaction_types: { type: 'array', items: { type: 'string' } }, exchange_rate: { type: 'number', nullable: true }, block_number: { type: 'number' }, has_error_in_internal_transactions: { type: 'boolean', nullable: true } } } },
                        next_page_params: { type: 'object', properties: { block_number: { type: 'number' }, index: { type: 'number' }, items_count: { type: 'number' } } }
                    }
                }
            },
        },
        getTransactionByHash: {
            method: 'GET',
            path: '/transactions/:transaction_hash',
            description: 'Details of a transaction via LUKSO BlockScout — query by transaction hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'transaction_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{64}$)'] } }
            ],
            tests: [
                {
                    _description: 'Get transaction on mainnet',
                    chainName: 'LUKSO_MAINNET',
                    transaction_hash: '0x4937ac5bc88a00d9037dcfeca0baf3de468d3983ff5755925956f004fca670f9'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        priority_fee: { type: 'number', nullable: true },
                        raw_input: { type: 'string' },
                        is_pending_update: { type: 'boolean' },
                        result: { type: 'string' },
                        hash: { type: 'string' },
                        max_fee_per_gas: { type: 'number', nullable: true },
                        revert_reason: { type: 'string', nullable: true },
                        confirmation_duration: { type: 'array', items: { type: 'number' } },
                        transaction_burnt_fee: { type: 'number', nullable: true },
                        type: { type: 'number' },
                        token_transfers_overflow: { type: 'boolean' },
                        confirmations: { type: 'number' },
                        position: { type: 'number' },
                        max_priority_fee_per_gas: { type: 'number', nullable: true },
                        transaction_tag: { type: 'string', nullable: true },
                        created_contract: { type: 'string', nullable: true },
                        value: { type: 'string' },
                        from: { type: 'object', properties: { ens_domain_name: { type: 'string', nullable: true }, hash: { type: 'string' }, implementations: { type: 'array', items: { type: 'string' } }, is_contract: { type: 'boolean' }, is_scam: { type: 'boolean' }, is_verified: { type: 'boolean' }, metadata: { type: 'string', nullable: true }, name: { type: 'string', nullable: true }, private_tags: { type: 'array', items: { type: 'string' } }, proxy_type: { type: 'string', nullable: true }, public_tags: { type: 'array', items: { type: 'string' } }, reputation: { type: 'string' }, watchlist_names: { type: 'array', items: { type: 'string' } } } },
                        gas_used: { type: 'string' },
                        status: { type: 'string' },
                        to: { type: 'object', properties: { ens_domain_name: { type: 'string', nullable: true }, hash: { type: 'string' }, implementations: { type: 'array', items: { type: 'string' } }, is_contract: { type: 'boolean' }, is_scam: { type: 'boolean' }, is_verified: { type: 'boolean' }, metadata: { type: 'string', nullable: true }, name: { type: 'string' }, private_tags: { type: 'array', items: { type: 'string' } }, proxy_type: { type: 'string', nullable: true }, public_tags: { type: 'array', items: { type: 'string' } }, reputation: { type: 'string' }, watchlist_names: { type: 'array', items: { type: 'string' } } } },
                        authorization_list: { type: 'array', items: { type: 'string' } },
                        method: { type: 'string' },
                        fee: { type: 'object', properties: { type: { type: 'string' }, value: { type: 'string' } } },
                        actions: { type: 'array', items: { type: 'string' } },
                        gas_limit: { type: 'string' },
                        gas_price: { type: 'string' },
                        decoded_input: { type: 'object', properties: { method_call: { type: 'string' }, method_id: { type: 'string' }, parameters: { type: 'array', items: { type: 'object' } } } },
                        token_transfers: { type: 'array', items: { type: 'string' } },
                        base_fee_per_gas: { type: 'string' },
                        timestamp: { type: 'string' },
                        nonce: { type: 'number' },
                        historic_exchange_rate: { type: 'number', nullable: true },
                        transaction_types: { type: 'array', items: { type: 'string' } },
                        exchange_rate: { type: 'number', nullable: true },
                        block_number: { type: 'number' },
                        has_error_in_internal_transactions: { type: 'boolean' }
                    }
                }
            },
        },
        getTokenTransfersByTransactionHash: {
            method: 'GET',
            path: '/transactions/:transaction_hash/token-transfers',
            description: 'Token transfers in transaction via LUKSO BlockScout — query by transaction hash.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'transaction_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{64}$)'] } }
            ],
            tests: [
                {
                    _description: 'Token transfers for transaction',
                    chainName: 'LUKSO_MAINNET',
                    transaction_hash: '0x4937ac5bc88a00d9037dcfeca0baf3de468d3983ff5755925956f004fca670f9'
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
        getInternalTransactions: {
            method: 'GET',
            path: '/transactions/:transaction_hash/internal-transactions',
            description: 'Internal txs in transaction via LUKSO BlockScout — query by transaction hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'transaction_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{64}$)'] } }
            ],
            tests: [
                {
                    _description: 'Internal txs for transaction',
                    chainName: 'LUKSO_MAINNET',
                    transaction_hash: '0x4937ac5bc88a00d9037dcfeca0baf3de468d3983ff5755925956f004fca670f9'
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
        getLogs: {
            method: 'GET',
            path: '/transactions/:transaction_hash/logs',
            description: 'Logs from transaction via LUKSO BlockScout — query by transaction hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'transaction_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{64}$)'] } }
            ],
            tests: [
                {
                    _description: 'Get logs for transaction',
                    chainName: 'LUKSO_MAINNET',
                    transaction_hash: '0x19a669843e97836b68b75327041e12d5ee91788430337ad0e8158e56fa824b61'
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
        getRawTrace: {
            method: 'GET',
            path: '/transactions/:transaction_hash/raw-trace',
            description: 'Raw trace of transaction via LUKSO BlockScout — query by transaction hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'transaction_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{64}$)'] } }
            ],
            tests: [
                {
                    _description: 'Get raw trace',
                    chainName: 'LUKSO_MAINNET',
                    transaction_hash: '0x4937ac5bc88a00d9037dcfeca0baf3de468d3983ff5755925956f004fca670f9'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        calls: { type: 'array', items: { type: 'object', properties: { calls: { type: 'array', items: { type: 'object' } }, from: { type: 'string' }, gas: { type: 'string' }, gasUsed: { type: 'string' }, input: { type: 'string' }, to: { type: 'string' }, type: { type: 'string' }, value: { type: 'string' } } } },
                        from: { type: 'string' },
                        gas: { type: 'string' },
                        gasUsed: { type: 'string' },
                        input: { type: 'string' },
                        to: { type: 'string' },
                        type: { type: 'string' },
                        value: { type: 'string' }
                    }
                }
            },
        },
        getStateChanges: {
            method: 'GET',
            path: '/transactions/:transaction_hash/state-changes',
            description: 'State changes in transaction via LUKSO BlockScout — query by transaction hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'transaction_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{64}$)'] } }
            ],
            tests: [
                {
                    _description: 'Get state changes',
                    chainName: 'LUKSO_MAINNET',
                    transaction_hash: '0x4937ac5bc88a00d9037dcfeca0baf3de468d3983ff5755925956f004fca670f9'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { address: { type: 'object' }, balance_after: { type: 'string' }, balance_before: { type: 'string' }, change: { type: 'string' }, is_miner: { type: 'boolean' }, token: { type: 'string', nullable: true }, token_id: { type: 'string', nullable: true }, type: { type: 'string' } } } },
                        next_page_params: { type: 'string', nullable: true }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getTransactions: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            const { chainName } = payload
            struct['url'] = struct['url']
            .replace( "--chain--", alias[ chainName ] )
            return { struct }
        }
    },
    getTransactionByHash: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            const { chainName } = payload
            struct['url'] = struct['url']
            .replace( "--chain--", alias[ chainName ] )
            return { struct }
        }
    },
    getTokenTransfersByTransactionHash: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            const { chainName } = payload
            struct['url'] = struct['url']
            .replace( "--chain--", alias[ chainName ] )
            return { struct }
        }
    },
    getInternalTransactions: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            const { chainName } = payload
            struct['url'] = struct['url']
            .replace( "--chain--", alias[ chainName ] )
            return { struct }
        }
    },
    getLogs: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            const { chainName } = payload
            struct['url'] = struct['url']
            .replace( "--chain--", alias[ chainName ] )
            return { struct }
        }
    },
    getRawTrace: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            const { chainName } = payload
            struct['url'] = struct['url']
            .replace( "--chain--", alias[ chainName ] )
            return { struct }
        }
    },
    getStateChanges: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            const { chainName } = payload
            struct['url'] = struct['url']
            .replace( "--chain--", alias[ chainName ] )
            return { struct }
        }
    }
} )
