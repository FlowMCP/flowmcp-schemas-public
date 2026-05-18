// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'blockchaininfo',
    name: 'Bitcoin UTXO Analytics',
    description: 'Provides insights into Bitcoin UTXOs and block statistics using blockchain.info endpoints.',
    version: '4.0.0',
    docs: ['https://www.blockchain.com/api/blockchain_api'],
    tags: ['bitcoin', 'blockchain', 'utxo', 'cacheTtlDaily'],
    root: 'https://blockchain.info',
    tools: {
        getUTXO: {
            method: 'GET',
            path: '/unspent',
            description: 'Fetch UTXO summary for a Bitcoin address via blockchaininfo. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'active', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['regex(^([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})$)'] }, description: 'Bitcoin address to query UTXOs for (Legacy P2PKH, P2SH, or Bech32 format)' }
            ],
            tests: [
                { _description: 'Satoshi genesis address (P2PKH)', active: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
                { _description: 'Bitfinex cold wallet (P2SH)', active: '3D2oetdNuZUqQHPJmcMDDHYoqkyNVsFk9r' },
                { _description: 'Bech32 segwit address', active: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        notice: { type: 'string' },
                        unspent_outputs: { type: 'array', items: { type: 'object', properties: { tx_hash_big_endian: { type: 'string' }, tx_hash: { type: 'string' }, tx_output_n: { type: 'number' }, script: { type: 'string' }, value: { type: 'number' }, value_hex: { type: 'string' }, confirmations: { type: 'number' }, tx_index: { type: 'number' } } } }
                    }
                }
            },
        },
        getBlockStats: {
            method: 'GET',
            path: '/block-height/:block_height?format=json',
            description: 'Fetch block statistics for a given block height via blockchaininfo — query by block height.',
            parameters: [
                { position: { key: 'block_height', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(0)'] }, description: 'Bitcoin block height number (0 for genesis block, incrementing)' }
            ],
            tests: [
                { _description: 'Block 800000 stats', block_height: 800000 },
                { _description: 'Genesis block stats', block_height: 0 },
                { _description: 'Block 500000 stats', block_height: 500000 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        blocks: { type: 'array', items: { type: 'object', properties: { hash: { type: 'string' }, ver: { type: 'number' }, prev_block: { type: 'string' }, mrkl_root: { type: 'string' }, time: { type: 'number' }, bits: { type: 'number' }, next_block: { type: 'array', items: { type: 'string' } }, fee: { type: 'number' }, nonce: { type: 'number' }, n_tx: { type: 'number' }, size: { type: 'number' }, block_index: { type: 'number' }, main_chain: { type: 'boolean' }, height: { type: 'number' }, weight: { type: 'number' }, tx: { type: 'array', items: { type: 'object' } } } } }
                    }
                }
            },
        }
    }
}
