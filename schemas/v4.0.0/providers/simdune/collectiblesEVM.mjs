// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Import: import { EVM_CHAINS } from '../_shared/evmChains.mjs'
// Module-level code: 18 lines

export const main = {
    namespace: 'simdune',
    name: 'Sim by Dune - NFT Collectibles',
    description: 'Access NFT collections including ERC721 and ERC1155 tokens with metadata, images, and collection details across EVM chains.',
    version: '4.0.0',
    docs: ['https://docs.sim.dune.com/evm/collectibles'],
    tags: ['production', 'nft', 'collectibles', 'metadata', 'cacheTtlDaily'],
    sharedLists: [
        { ref: 'evmChains', version: '3.1.0' }
    ],
    root: 'https://api.sim.dune.com/v1',
    requiredServerParams: ['DUNE_SIM_API_KEY'],
    headers: {
        'X-Sim-Api-Key': '{{DUNE_SIM_API_KEY}}'
    },
    tools: {
        getCollectiblesEVM: {
            method: 'GET',
            path: '/evm/collectibles/:walletAddress',
            description: 'Get NFT collectibles (ERC721/ERC1155) with metadata, images, and collection details for a wallet address.',
            parameters: [
                { position: { key: 'walletAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{40}$)'] } },
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(ETHEREUM_MAINNET,POLYGON_MAINNET,ARBITRUM_ONE,OPTIMISM_MAINNET,BASE_MAINNET,BNB_CHAIN,AVALANCHE_CCHAIN,LINEA_MAINNET,SCROLL,ZKSYNC_ERA,MANTLE,CELO_MAINNET,GNOSIS_CHAIN,FANTOM,ARBITRUM_NOVA,BLAST_MAINNET,SONIC,BERACHAIN,UNICHAIN,ZKEVM,FRAXTAL,APE_CHAIN,ABSTRACT,WORLD,SWELLCHAIN,WEMIX,XAI,RONIN,LISK,MODE,METIS,ZORA_NETWORK,BOBA_NETWORK,MINT_MAINNET,DEGEN_CHAIN,ANCIENT8,KAIA,OPBNB,BOB,FLARE,CYBER,PROOF_OF_PLAY,PROOF_OF_PLAY_BOSS,HYPER_EVM,INK,SEI,SONEIUM,SHAPE,REDSTONE,RARI,OMNI,CORN,B3,HAM_CHAIN,HYCHAIN,FUNKICHAIN,FORMA,SUPERPOSITION,SUPERSEED,ZERO_NETWORK,TRON,ETHEREUM_SEPOLIA,BASE_SEPOLIA,AVALANCHE_FUJI,MONAD_TESTNET)', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(2500)'] } }
            ],
            tests: [
                {
                    _description: 'Get Vitalik\'s NFT collectibles on Ethereum',
                    walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
                    limit: '10',
                    chainName: 'ETHEREUM_MAINNET'
                },
                {
                    _description: 'Get NFT collectibles on Base',
                    walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
                    limit: '5',
                    chainName: 'BASE_MAINNET'
                }
            ,
                { _description: 'Get NFT collectibles on Polygon', walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', limit: '10', chainName: 'POLYGON_MAINNET' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        address: { type: 'string' },
                        entries: { type: 'array', items: { type: 'object', properties: { contract_address: { type: 'string' }, token_standard: { type: 'string' }, token_id: { type: 'string' }, chain: { type: 'string' }, chain_id: { type: 'number' }, name: { type: 'string' }, description: { type: 'string' }, symbol: { type: 'string' }, last_sale_price: { type: 'string' }, metadata: { type: 'object' }, is_spam: { type: 'boolean' }, balance: { type: 'string' }, last_acquired: { type: 'string' } } } },
                        next_offset: { type: 'string' },
                        request_time: { type: 'string' },
                        response_time: { type: 'string' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const EVM_CHAINS = sharedLists['evmChains']

    const routeAliases = [
        'ABSTRACT', 'ANCIENT8', 'APE_CHAIN', 'ARBITRUM_ONE', 'ARBITRUM_NOVA',
        'AVALANCHE_CCHAIN', 'AVALANCHE_FUJI', 'B3', 'BASE_MAINNET', 'BASE_SEPOLIA',
        'BERACHAIN', 'BLAST_MAINNET', 'BNB_CHAIN', 'BOB', 'BOBA_NETWORK',
        'CELO_MAINNET', 'CORN', 'CYBER', 'DEGEN_CHAIN', 'ETHEREUM_MAINNET',
        'FANTOM', 'FLARE', 'FORMA', 'FRAXTAL', 'FUNKICHAIN', 'GNOSIS_CHAIN',
        'HAM_CHAIN', 'HYCHAIN', 'HYPER_EVM', 'INK', 'KAIA', 'LINEA_MAINNET',
        'LISK', 'MANTLE', 'METIS', 'MINT_MAINNET', 'MODE', 'MONAD_TESTNET',
        'OMNI', 'OPBNB', 'OPTIMISM_MAINNET', 'POLYGON_MAINNET', 'PROOF_OF_PLAY',
        'PROOF_OF_PLAY_BOSS', 'RARI', 'REDSTONE', 'RONIN', 'SCROLL', 'SEI',
        'ETHEREUM_SEPOLIA', 'SHAPE', 'SONEIUM', 'SONIC', 'SUPERPOSITION',
        'SUPERSEED', 'SWELLCHAIN', 'TRON', 'UNICHAIN', 'WEMIX', 'WORLD',
        'XAI', 'ZERO_NETWORK', 'ZKEVM', 'ZKSYNC_ERA', 'ZORA_NETWORK'
    ]
    const SUPPORTED_CHAINS = EVM_CHAINS
        .filter( ( c ) => c.simduneAlias !== undefined && routeAliases.includes( c.simduneAlias ) )
        .map( ( c ) => ( { alias: c.simduneAlias, id: c.simduneChainId, name: c.simduneChainSlug } ) )
    const chainAliasEnum = 'enum(' + SUPPORTED_CHAINS.map( ( { alias } ) => alias ).join( ',' ) + ')'

    return {
        getCollectiblesEVM: {
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
