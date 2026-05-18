// Schema for #183 — Starknet Token Balance Queries via Public RPC
// No API key required — uses Lava public RPC
// requiredLibraries: (none — raw JSON-RPC calls)

export const main = {
    namespace: 'starknet',
    name: 'Starknet Token Balances',
    description: 'Query ERC20 token balances and block info on Starknet via public RPC. No API key required.',
    version: '4.0.0',
    docs: ['https://docs.starknet.io/documentation/', 'https://www.starknet.io/'],
    tags: ['starknet', 'defi', 'tokens', 'cacheTtlFrequent'],
    root: 'https://rpc.starknet.lava.build',
    tools: {
        getTokenBalance: {
            method: 'POST',
            path: '/',
            description: 'Get ERC20 token balance for an account on Starknet. Returns balance as hex (u256 = low + high). Common tokens: ETH (0x049d36...), USDC (0x053c91...), STRK (0x04718f...).',
            parameters: [
                { position: { key: 'tokenAddress', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['min(3)'] } },
                { position: { key: 'accountAddress', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['min(3)'] } }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { tokenAddress: { type: 'string' }, accountAddress: { type: 'string' }, balanceLow: { type: 'string' }, balanceHigh: { type: 'string' } } } },
            tests: [
                { _description: 'ETH balance on Starknet', tokenAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', accountAddress: '0x04270219d365d6b017231b52e92b3fb5d7c8378b05e9abc97724537a80e93b0f' }
            ],
        },
        getBlockNumber: {
            method: 'POST',
            path: '/',
            description: 'Get the current Starknet block number via public RPC.',
            parameters: [],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { blockNumber: { type: 'number' } } } },
            tests: [
                { _description: 'Current Starknet block number' }
            ],
        },
        getBlockInfo: {
            method: 'POST',
            path: '/',
            description: 'Get block details by block number. Returns timestamp, transaction count and status.',
            parameters: [
                { position: { key: 'blockNumber', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: [] } }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { blockNumber: { type: 'number' }, blockHash: { type: 'string' }, timestamp: { type: 'number' }, transactionCount: { type: 'number' }, status: { type: 'string' }, sequencerAddress: { type: 'string' } } } },
            tests: [
                { _description: 'Get block 6935000', blockNumber: 6935000 }
            ],
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const RPC_URL = 'https://rpc.starknet.lava.build'
    const BALANCE_OF_SELECTOR = '0x02e4263afad30923c891518314c3c95dbe830a16874e8abc5777a9a20b54c76e'

    async function rpcCall( { method, params } ) {
        const response = await fetch( RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { jsonrpc: '2.0', method, params, id: 1 } )
        } )
        const data = await response.json()
        if( data.error ) {
            throw new Error( data.error.message || 'RPC error' )
        }

        return data.result
    }

    return {
        getTokenBalance: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { tokenAddress, accountAddress } = userParams
                try {
                    const result = await rpcCall( {
                        method: 'starknet_call',
                        params: [{
                            contract_address: tokenAddress,
                            entry_point_selector: BALANCE_OF_SELECTOR,
                            calldata: [accountAddress]
                        }, 'latest']
                    } )
                    struct.data = {
                        tokenAddress,
                        accountAddress,
                        balanceLow: result[0] || '0x0',
                        balanceHigh: result[1] || '0x0'
                    }
                    struct.status = true
                } catch( e ) {
                    struct.status = false
                    struct.messages.push( e?.message || 'Failed to query token balance.' )
                }
                return { struct }
            }
        },
        getBlockNumber: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const result = await rpcCall( { method: 'starknet_blockNumber', params: [] } )
                    struct.data = { blockNumber: result }
                    struct.status = true
                } catch( e ) {
                    struct.status = false
                    struct.messages.push( e?.message || 'Failed to get block number.' )
                }
                return { struct }
            }
        },
        getBlockInfo: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { blockNumber } = userParams
                try {
                    const result = await rpcCall( {
                        method: 'starknet_getBlockWithTxHashes',
                        params: [{ block_number: blockNumber }]
                    } )
                    struct.data = {
                        blockNumber: result.block_number,
                        blockHash: result.block_hash,
                        timestamp: result.timestamp,
                        transactionCount: result.transactions?.length || 0,
                        status: result.status,
                        sequencerAddress: result.sequencer_address
                    }
                    struct.status = true
                } catch( e ) {
                    struct.status = false
                    struct.messages.push( e?.message || 'Failed to get block info.' )
                }
                return { struct }
            }
        }
    }
}
