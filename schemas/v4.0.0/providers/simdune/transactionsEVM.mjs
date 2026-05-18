// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Import: import { EVM_CHAINS } from '../_shared/evmChains.mjs'
// Module-level code: 13 lines

export const main = {
    namespace: 'simdune',
    name: 'Sim by Dune - Transactions',
    description: 'Retrieve granular transaction details including block information, gas data, and raw values, ordered by descending block time.',
    version: '4.0.0',
    docs: ['https://docs.sim.dune.com/evm/transactions'],
    tags: ['production', 'transactions', 'analytics', 'history', 'cacheTtlDaily'],
    sharedLists: [
        { ref: 'evmChains', version: '3.1.0' }
    ],
    root: 'https://api.sim.dune.com/v1',
    requiredServerParams: ['DUNE_SIM_API_KEY'],
    headers: {
        'X-Sim-Api-Key': '{{DUNE_SIM_API_KEY}}'
    },
    tools: {
        getTransactionsEVM: {
            method: 'GET',
            path: '/evm/transactions/:walletAddress',
            description: 'Get detailed transaction history for an EVM address across supported chains, with block data and gas information.',
            parameters: [
                { position: { key: 'walletAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{40}$)'] } },
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(ETHEREUM_MAINNET,POLYGON_MAINNET,ARBITRUM_ONE,OPTIMISM_MAINNET,BASE_MAINNET,BNB_CHAIN,AVALANCHE_CCHAIN,LINEA_MAINNET,SCROLL,ZKSYNC_ERA,MANTLE,CELO_MAINNET,GNOSIS_CHAIN,FANTOM,ARBITRUM_NOVA,BLAST_MAINNET,BERACHAIN,LISK,MODE,METIS,ZORA_NETWORK,BOBA_NETWORK,MINT_MAINNET,DEGEN_CHAIN,ANCIENT8,KAIA,OPBNB,BOB,FLARE,CYBER,PROOF_OF_PLAY,HYPER_EVM,BASE_SEPOLIA,AVALANCHE_FUJI)', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)'] } }
            ],
            tests: [
                {
                    _description: 'Get Vitalik\'s transactions on Ethereum mainnet',
                    walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
                    limit: '5',
                    chainName: 'ETHEREUM_MAINNET'
                },
                {
                    _description: 'Get transactions on Base mainnet',
                    walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
                    limit: '3',
                    chainName: 'BASE_MAINNET'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        next_offset: { type: 'string' },
                        transactions: { type: 'array', items: { type: 'object', properties: { chain: { type: 'string' }, chain_id: { type: 'number' }, address: { type: 'string' }, block_time: { type: 'string' }, block_number: { type: 'number' }, index: { type: 'number' }, hash: { type: 'string' }, block_hash: { type: 'string' }, value: { type: 'string' }, transaction_type: { type: 'string' }, from: { type: 'string' }, to: { type: 'string' }, nonce: { type: 'string' }, gas_price: { type: 'string' }, gas_used: { type: 'string' }, effective_gas_price: { type: 'string' }, success: { type: 'boolean' }, data: { type: 'string' }, logs: { type: 'array', items: { type: 'string' } } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const EVM_CHAINS = sharedLists['evmChains']

    const routeAliases = [
        'ETHEREUM_MAINNET', 'ARBITRUM_ONE', 'ARBITRUM_NOVA', 'AVALANCHE_CCHAIN',
        'AVALANCHE_FUJI', 'BASE_MAINNET', 'BASE_SEPOLIA', 'BNB_CHAIN',
        'CELO_MAINNET', 'GNOSIS_CHAIN', 'OPTIMISM_MAINNET', 'POLYGON_MAINNET',
        'ZKSYNC_ERA', 'ZORA_NETWORK', 'LINEA_MAINNET', 'SCROLL', 'MODE',
        'BLAST_MAINNET', 'ANCIENT8', 'DEGEN_CHAIN', 'MANTLE', 'METIS',
        'FANTOM', 'BOBA_NETWORK', 'MINT_MAINNET', 'HYPER_EVM', 'KAIA',
        'LISK', 'OPBNB', 'PROOF_OF_PLAY', 'CYBER', 'BOB', 'FLARE', 'BERACHAIN'
    ]
    const SUPPORTED_CHAINS = EVM_CHAINS
        .filter( ( c ) => c.simduneAlias !== undefined && routeAliases.includes( c.simduneAlias ) )
        .map( ( c ) => ( { alias: c.simduneAlias, id: c.simduneChainId, name: c.simduneChainSlug } ) )
    const chainAliasEnum = 'enum(' + SUPPORTED_CHAINS.map( ( { alias } ) => alias ).join( ',' ) + ')'

    return {
        getTransactionsEVM: {
            preRequest: async ( { struct, payload } ) => {
                const { chainName } = payload
                const chainId = SUPPORTED_CHAINS.find( ( { alias } ) => alias === chainName )?.id
                const separator = struct['url'].includes('?') ? '&' : '?'
                struct['url'] += `${separator}chain_ids=${chainId}`

                return { struct }
            }
        }
    }
}
