// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Import: import { EVM_CHAINS } from '../_shared/evmChains.mjs'
// Module-level code: 13 lines

export const main = {
    namespace: 'simdune',
    name: 'Sim by Dune - Token Balances',
    description: 'Access realtime token balances for native and ERC20 tokens with USD valuations across EVM chains.',
    version: '4.0.0',
    docs: ['https://docs.sim.dune.com/evm/balances'],
    tags: ['production', 'balances', 'analytics', 'portfolio', 'cacheTtlDaily'],
    sharedLists: [
        { ref: 'evmChains', version: '3.1.0' }
    ],
    root: 'https://api.sim.dune.com/v1',
    requiredServerParams: ['DUNE_SIM_API_KEY'],
    headers: {
        'X-Sim-Api-Key': '{{DUNE_SIM_API_KEY}}'
    },
    tools: {
        getBalancesEVM: {
            method: 'GET',
            path: '/evm/balances/:walletAddress',
            description: 'Get realtime token balances with USD valuations for native and ERC20 tokens across supported chains.',
            parameters: [
                { position: { key: 'walletAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{40}$)'] } },
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(ETHEREUM_MAINNET,POLYGON_MAINNET,ARBITRUM_ONE,OPTIMISM_MAINNET,BASE_MAINNET,BNB_CHAIN,AVALANCHE_CCHAIN,LINEA_MAINNET,SCROLL,ZKSYNC_ERA,MANTLE,CELO_MAINNET,GNOSIS_CHAIN,FANTOM,ARBITRUM_NOVA,BLAST_MAINNET,BERACHAIN,LISK,MODE,METIS,ZORA_NETWORK,BOBA_NETWORK,MINT_MAINNET,DEGEN_CHAIN,ANCIENT8,KAIA,OPBNB,BOB,FLARE,CYBER,PROOF_OF_PLAY,HYPER_EVM,BASE_SEPOLIA,AVALANCHE_FUJI)', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(1000)'] } }
            ],
            tests: [
                {
                    _description: 'Get Vitalik\'s token balances on Ethereum',
                    walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
                    chainName: 'ETHEREUM_MAINNET',
                    limit: '10'
                },
                {
                    _description: 'Get token balances on Base',
                    walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
                    chainName: 'BASE_MAINNET',
                    limit: '5'
                }
            ,
                { _description: 'Get token balances on Polygon', walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', chainName: 'POLYGON_MAINNET', limit: '10' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        request_time: { type: 'string' },
                        response_time: { type: 'string' },
                        wallet_address: { type: 'string' },
                        balances: { type: 'array', items: { type: 'object', properties: { chain: { type: 'string' }, chain_id: { type: 'number' }, address: { type: 'string' }, amount: { type: 'string' }, symbol: { type: 'string' }, decimals: { type: 'number' }, price_usd: { type: 'number' }, value_usd: { type: 'number' } } } },
                        next_offset: { type: 'string' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const EVM_CHAINS = sharedLists['evmChains']

    const routeAliases = [
        'ETHEREUM_MAINNET', 'BNB_CHAIN', 'POLYGON_MAINNET', 'ARBITRUM_ONE',
        'OPTIMISM_MAINNET', 'BASE_MAINNET', 'AVALANCHE_CCHAIN', 'GNOSIS_CHAIN',
        'CELO_MAINNET', 'ZKSYNC_ERA', 'ZORA_NETWORK', 'LINEA_MAINNET',
        'SCROLL', 'MODE', 'BLAST_MAINNET', 'ARBITRUM_NOVA', 'MANTLE', 'METIS',
        'FANTOM', 'BOBA_NETWORK', 'MINT_MAINNET', 'DEGEN_CHAIN', 'ANCIENT8',
        'KAIA', 'LISK', 'OPBNB', 'PROOF_OF_PLAY', 'CYBER', 'BOB', 'FLARE',
        'BERACHAIN', 'HYPER_EVM', 'BASE_SEPOLIA', 'AVALANCHE_FUJI'
    ]
    const SUPPORTED_CHAINS = EVM_CHAINS
        .filter( ( c ) => c.simduneAlias !== undefined && routeAliases.includes( c.simduneAlias ) )
        .map( ( c ) => ( { alias: c.simduneAlias, id: c.simduneChainId, name: c.simduneChainSlug } ) )
    const chainAliasEnum = 'enum(' + SUPPORTED_CHAINS.map( ( { alias } ) => alias ).join( ',' ) + ')'

    return {
        getBalancesEVM: {
            preRequest: async ( { struct, payload } ) => {
                const { chainName } = payload
                const chainId = SUPPORTED_CHAINS.find( ( { alias } ) => alias === chainName )?.id
                struct['url'] += `&chain_ids=${chainId}`

                return { struct }
            }
        }
    }
}
