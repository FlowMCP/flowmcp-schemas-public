// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// requiredLibraries: indicatorts
// Import: import { max } from "indicatorts"
// Import: import { EVM_CHAINS } from '../_shared/evmChains.mjs'
// Module-level code: 22 lines

export const main = {
    namespace: 'simdune',
    name: 'Sim by Dune - Activity Feed',
    description: 'Access decoded activity feed with realtime onchain activity including transfers, swaps, mints, burns, and approvals across EVM chains.',
    version: '4.0.0',
    docs: ['https://docs.sim.dune.com/evm/activity'],
    tags: ['production', 'activity', 'analytics', 'feed', 'cacheTtlDaily'],
    sharedLists: [
        { ref: 'evmChains', version: '3.1.0' }
    ],
    root: 'https://api.sim.dune.com/v1',
    requiredServerParams: ['DUNE_SIM_API_KEY'],
    headers: {
        'X-Sim-Api-Key': '{{DUNE_SIM_API_KEY}}'
    },
    tools: {
        getActivityEVM: {
            method: 'GET',
            path: '/evm/activity/:walletAddress?limit=100&maxPages=10&requestDelay=500',
            description: 'Get decoded activity feed for a wallet address including transfers, swaps, mints, burns, approvals, and contract interactions. Supported chains: ETHEREUM_MAINNET,POLYGON_MAINNET,ARBITRUM_ONE,OPTIMISM_MAINNET,BASE_MAINNET,BNB_CHAIN,AVALANCHE_CCHAIN,LINEA_MAINNET,SCROLL,ZKSYNC_ERA,MANTLE,CELO_MAINNET,GNOSIS_CHAIN,FANTOM,ARBITRUM_NOVA,BLAST_MAINNET,SONIC,BERACHAIN,UNICHAIN,ZKEVM,FRAXTAL,APE_CHAIN,ABSTRACT,WORLD,SWELLCHAIN,WEMIX,XAI,RONIN,LISK,MODE,METIS,ZORA_NETWORK,BOBA_NETWORK,MINT_MAINNET,DEGEN_CHAIN,ANCIENT8,KAIA,OPBNB,BOB,FLARE,CYBER,PROOF_OF_PLAY,PROOF_OF_PLAY_BOSS,HYPER_EVM,INK,SEI,SONEIUM,SHAPE,REDSTONE,RARI,OMNI,CORN,B3,HAM_CHAIN,HYCHAIN,FUNKICHAIN,FORMA,SUPERPOSITION,SUPERSEED,ZERO_NETWORK,ETHEREUM_SEPOLIA,BASE_SEPOLIA,AVALANCHE_FUJI',
            parameters: [
                { position: { key: 'walletAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{40}$)'] } }
            ],
            tests: [
                {
                    _description: 'Get Vitalik\'s activity feed on all supported chains',
                    walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
                }
            ],
            output: { mimeType: 'application/json', description: 'Sim.Dune EVM activity response for getActivityEVM', schema: { type: 'object', properties: { data: { type: 'object', description: 'Response data' } } } },
        },
        getActivityDetailedEVM: {
            method: 'GET',
            path: '/evm/activity/:walletAddress',
            description: 'Get decoded activity feed for a wallet address including transfers, swaps, mints, burns, approvals, and contract interactions. Supported chains: ETHEREUM_MAINNET,POLYGON_MAINNET,ARBITRUM_ONE,OPTIMISM_MAINNET,BASE_MAINNET,BNB_CHAIN,AVALANCHE_CCHAIN,LINEA_MAINNET,SCROLL,ZKSYNC_ERA,MANTLE,CELO_MAINNET,GNOSIS_CHAIN,FANTOM,ARBITRUM_NOVA,BLAST_MAINNET,SONIC,BERACHAIN,UNICHAIN,ZKEVM,FRAXTAL,APE_CHAIN,ABSTRACT,WORLD,SWELLCHAIN,WEMIX,XAI,RONIN,LISK,MODE,METIS,ZORA_NETWORK,BOBA_NETWORK,MINT_MAINNET,DEGEN_CHAIN,ANCIENT8,KAIA,OPBNB,BOB,FLARE,CYBER,PROOF_OF_PLAY,PROOF_OF_PLAY_BOSS,HYPER_EVM,INK,SEI,SONEIUM,SHAPE,REDSTONE,RARI,OMNI,CORN,B3,HAM_CHAIN,HYCHAIN,FUNKICHAIN,FORMA,SUPERPOSITION,SUPERSEED,ZERO_NETWORK,ETHEREUM_SEPOLIA,BASE_SEPOLIA,AVALANCHE_FUJI',
            parameters: [
                { position: { key: 'walletAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{40}$)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)'] } }
            ],
            output: {mimeType:'application/json',schema:{type:'object',properties:{result:{type:'object',properties:{rows:{type:'array',items:{type:'object'}},metadata:{type:'object'}}}}}},
            tests: [
                {
                    _description: 'Get Vitalik\'s activity feed on all supported chains',
                    walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
                    limit: '10'
                },
                { _description: 'Get Vitalik activity with small limit', walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', limit: '5' }
            ],
        }
    },
    requiredLibraries: ['indicatorts']
}


export const handlers = ( { sharedLists, libraries } ) => {
    const max = libraries['indicatorts']
    const EVM_CHAINS = sharedLists['evmChains']

    const routeAliases = [
        'ABSTRACT', 'ANCIENT8', 'APE_CHAIN', 'ARBITRUM_ONE', 'ARBITRUM_NOVA',
        'AVALANCHE_CCHAIN', 'AVALANCHE_FUJI', 'B3', 'BASE_MAINNET', 'BASE_SEPOLIA',
        'BERACHAIN', 'BLAST_MAINNET', 'BNB_CHAIN', 'BOB', 'BOBA_NETWORK',
        'CELO_MAINNET', 'CORN', 'CYBER', 'DEGEN_CHAIN', 'ETHEREUM_MAINNET',
        'FANTOM', 'FLARE', 'FORMA', 'FRAXTAL', 'FUNKICHAIN', 'GNOSIS_CHAIN',
        'HAM_CHAIN', 'HYCHAIN', 'HYPER_EVM', 'INK', 'KAIA', 'LINEA_MAINNET',
        'LISK', 'MANTLE', 'METIS', 'MINT_MAINNET', 'MODE', 'OMNI', 'OPBNB',
        'OPTIMISM_MAINNET', 'POLYGON_MAINNET', 'PROOF_OF_PLAY',
        'PROOF_OF_PLAY_BOSS', 'RARI', 'REDSTONE', 'RONIN', 'SCROLL', 'SEI',
        'ETHEREUM_SEPOLIA', 'SHAPE', 'SONEIUM', 'SONIC', 'SUPERPOSITION',
        'SUPERSEED', 'SWELLCHAIN', 'UNICHAIN', 'WEMIX', 'WORLD', 'XAI',
        'ZERO_NETWORK', 'ZKEVM', 'ZKSYNC_ERA', 'ZORA_NETWORK'
    ]
    const SUPPORTED_CHAINS = EVM_CHAINS
        .filter( ( c ) => c.simduneAlias !== undefined && routeAliases.includes( c.simduneAlias ) )
        .map( ( c ) => ( { alias: c.simduneAlias, id: c.simduneChainId, name: c.simduneChainSlug } ) )
    const supportedChainsStr = SUPPORTED_CHAINS.map( ( { alias } ) => alias ).join( ',' )
    function getChainAlias( { chainId } ) {
        const chain = SUPPORTED_CHAINS.find( ( c ) => c.id === chainId )
        return chain ? chain.alias : `UNKNOWN_${chainId}`
    }

    return {
        getActivityEVM: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                try {
                const allActivities = []
                let nextOffset = null
                let pageCount = 0
                const maxPages = parseInt( userParams._allParams.maxPages )
                const limit = parseInt( userParams._allParams.limit )
                const { url } = payload

                const initialUrl = new URL( url )
                initialUrl.searchParams.set( 'limit', limit )
                const firstResponse = await fetch(
                initialUrl.toString(),
                { method: 'GET', headers: payload.headers }
                )

                if( !firstResponse.ok ) {
                struct['status'] = false
                struct['messages'].push( `Initial API call failed: ${firstResponse.status} ${firstResponse.statusText}` )
                return { struct }}

                const firstData = await firstResponse.json()

                if( firstData.activity && Array.isArray( firstData.activity ) ) {
                allActivities.push( ...firstData.activity )
                }
                nextOffset = firstData.next_offset || null

                while( nextOffset && pageCount < maxPages - 1 ) {
                const nextUrl = new URL( url )
                nextUrl.searchParams.set( 'offset', nextOffset )
                nextUrl.searchParams.set( 'limit', limit )

                const response = await fetch(
                nextUrl.toString(),
                { method: 'GET', headers: payload.headers }
                )

                if( !response.ok ) {
                struct['status'] = false
                struct['messages'].push( `API call failed: ${response.status} ${response.statusText}` )
                return { struct }
                }

                const data = await response.json()

                if( data.activity && Array.isArray( data.activity ) ) {
                allActivities.push( ...data.activity )
                }

                nextOffset = data.next_offset || null
                pageCount++

                // Wenn keine weiteren Activities, beende die Schleife
                if( !data.activity || data.activity.length === 0 ) {
                break
                }
                }

                const isComplete = !nextOffset
                const chains = allActivities
                .reduce( ( acc, activity ) => {
                const chainId = activity.chain_id
                const chainAlias = getChainAlias( { chainId } )
                if( !acc[ chainAlias ] ) { acc[ chainAlias ] = {} }
                const key = `summary_${activity.asset_type}_${activity.type}`
                acc[ chainAlias ][ key ] = ( acc[ chainAlias ][ key ] || 0 ) + 1
                return acc
                }, {} )

                const metadata = {
                totalActivities: allActivities.length,
                pagesLoaded: pageCount + 1,
                maxPagesReached: pageCount >= maxPages - 1,
                uniqueChains: Object.keys( chains ).length
                }

                struct['data'] = { isComplete, chains, metadata }
                struct['status'] = true

                return { struct }} catch( error ) {
                struct['status'] = false
                struct['messages'].push( `Handler error: ${error.message}` )
                struct.data = {}
                return { struct }}
            }
        }
    }
}
