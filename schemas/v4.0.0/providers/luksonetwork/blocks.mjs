// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "luksoNetwork" -> "luksonetwork"

export const main = {
    namespace: 'luksonetwork',
    name: 'LUKSO BlockScout Blocks',
    description: 'Retrieve block data from LUKSO BlockScout — list blocks, get block details by number or hash, view block transactions, and block withdrawals.',
    version: '4.0.0',
    docs: ['https://explorer.execution.mainnet.lukso.network/api-docs', 'https://explorer.execution.testnet.lukso.network/api-docs'],
    tags: ['lukso', 'blocks', 'explorer', 'cacheTtlFrequent'],
    root: 'https://explorer.execution.--chain--.lukso.network/api/v2',
    tools: {
        getBlocks: {
            method: 'GET',
            path: '/blocks',
            description: 'List recent blocks (optional filtering) via LUKSO BlockScout. Supports type filters.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'List all blocks on mainnet', chainName: 'LUKSO_MAINNET' },
                { _description: 'List uncle blocks on testnet', chainName: 'LUKSO_TESTNET', type: 'uncle' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { base_fee_per_gas: { type: 'string' }, burnt_fees: { type: 'string' }, burnt_fees_percentage: { type: 'number' }, difficulty: { type: 'string' }, gas_limit: { type: 'string' }, gas_target_percentage: { type: 'number' }, gas_used: { type: 'string' }, gas_used_percentage: { type: 'number' }, hash: { type: 'string' }, height: { type: 'number' }, internal_transactions_count: { type: 'number', nullable: true }, is_pending_update: { type: 'boolean' }, miner: { type: 'object' }, nonce: { type: 'string' }, parent_hash: { type: 'string' }, priority_fee: { type: 'string' }, rewards: { type: 'array', items: { type: 'string' } }, size: { type: 'number' }, timestamp: { type: 'string' }, total_difficulty: { type: 'number', nullable: true }, transaction_fees: { type: 'string' }, transactions_count: { type: 'number' }, type: { type: 'string' }, uncles_hashes: { type: 'array', items: { type: 'string' } }, withdrawals_count: { type: 'number', nullable: true } } } },
                        next_page_params: { type: 'object', properties: { block_number: { type: 'number' }, items_count: { type: 'number' } } }
                    }
                }
            },
        },
        getBlockById: {
            method: 'GET',
            path: '/blocks/:block_id',
            description: 'Get detailed info for a block via LUKSO BlockScout — query by block id. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'block_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Get block by hash', chainName: 'LUKSO_MAINNET', block_id: '345678' },
                { _description: 'Get block by number', chainName: 'LUKSO_TESTNET', block_id: '1234567' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        base_fee_per_gas: { type: 'string' },
                        burnt_fees: { type: 'string' },
                        burnt_fees_percentage: { type: 'number', nullable: true },
                        difficulty: { type: 'string' },
                        gas_limit: { type: 'string' },
                        gas_target_percentage: { type: 'number' },
                        gas_used: { type: 'string' },
                        gas_used_percentage: { type: 'number' },
                        hash: { type: 'string' },
                        height: { type: 'number' },
                        internal_transactions_count: { type: 'number' },
                        is_pending_update: { type: 'boolean' },
                        miner: { type: 'object', properties: { ens_domain_name: { type: 'string', nullable: true }, hash: { type: 'string' }, implementations: { type: 'array', items: { type: 'string' } }, is_contract: { type: 'boolean' }, is_scam: { type: 'boolean' }, is_verified: { type: 'boolean' }, metadata: { type: 'string', nullable: true }, name: { type: 'string', nullable: true }, private_tags: { type: 'array', items: { type: 'string' } }, proxy_type: { type: 'string', nullable: true }, public_tags: { type: 'array', items: { type: 'string' } }, reputation: { type: 'string' }, watchlist_names: { type: 'array', items: { type: 'string' } } } },
                        nonce: { type: 'string' },
                        parent_hash: { type: 'string' },
                        priority_fee: { type: 'string' },
                        rewards: { type: 'array', items: { type: 'string' } },
                        size: { type: 'number' },
                        timestamp: { type: 'string' },
                        total_difficulty: { type: 'number', nullable: true },
                        transaction_fees: { type: 'string' },
                        transactions_count: { type: 'number' },
                        type: { type: 'string' },
                        uncles_hashes: { type: 'array', items: { type: 'string' } },
                        withdrawals_count: { type: 'number' }
                    }
                }
            },
        },
        getBlockTransactions: {
            method: 'GET',
            path: '/blocks/:block_id/transactions',
            description: 'Get transactions within a block via LUKSO BlockScout — query by block id. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'block_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Get block txs by number', chainName: 'LUKSO_MAINNET', block_id: '1234567' }
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
        getBlockWithdrawals: {
            method: 'GET',
            path: '/blocks/:block_id/withdrawals',
            description: 'Get withdrawals from a block via LUKSO BlockScout — query by block id. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'block_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Get withdrawals from block', chainName: 'LUKSO_TESTNET', block_id: '1234567' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { amount: { type: 'string' }, index: { type: 'number' }, receiver: { type: 'object' }, validator_index: { type: 'number' } } } },
                        next_page_params: { type: 'string', nullable: true }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getBlocks: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            struct.url = struct.url.replace("--chain--", alias[payload.chainName]);
            return { struct }
        }
    },
    getBlockById: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            struct.url = struct.url.replace("--chain--", alias[payload.chainName]);
            return { struct }
        }
    },
    getBlockTransactions: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            struct.url = struct.url.replace("--chain--", alias[payload.chainName]);
            return { struct }
        }
    },
    getBlockWithdrawals: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            struct.url = struct.url.replace("--chain--", alias[payload.chainName]);
            return { struct }
        }
    }
} )
