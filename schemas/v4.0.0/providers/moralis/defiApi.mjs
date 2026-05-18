// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Import: import { EVM_CHAINS } from '../../_shared/evmChains.mjs'
// Module-level code: 18 lines

export const main = {
    namespace: 'moralis',
    name: 'Moralis defiApi API',
    description: 'DeFi portfolio analysis via Moralis — wallet positions across protocols (Uniswap, Aave, Lido, MakerDAO, EigenLayer, etc.) with per-protocol detail and summary views across EVM chains.',
    version: '4.0.0',
    docs: ['https://docs.moralis.com'],
    tags: ['evm', 'defi', 'positions', 'cacheTtlFrequent'],
    sharedLists: [
        { ref: 'evmChains', version: '3.1.0', filter: { key: 'moralisChainSlug', exists: true } }
    ],
    root: 'https://deep-index.moralis.io/api/v2.2',
    requiredServerParams: ['MORALIS_API_KEY'],
    headers: {
        'X-API-Key': '{{MORALIS_API_KEY}}'
    },
    tools: {
        '/wallets/:address/defi/:protocol/positions': {
            method: 'GET',
            path: '/wallets/:address/defi/:protocol/positions',
            description: 'Get the detailed defi positions by protocol for a wallet address. Required: chain, address, protocol.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'protocol', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(uniswap-v2,uniswap-v3,pancakeswap-v2,pancakeswap-v3,quickswap-v2,sushiswap-v2,aave-v2,aave-v3,fraxswap-v1,fraxswap-v2,lido,makerdao,eigenlayer)', options: [] } }
            ],
            tests: [{"_description":"Get the detailed defi positions by protocol for a wallet add","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045","protocol":"uniswap-v2"}]
        },
        '/wallets/:address/defi/positions': {
            method: 'GET',
            path: '/wallets/:address/defi/positions',
            description: 'Get the positions summary of a wallet address via Moralis — query by address. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get the positions summary of a wallet address via Moralis — ","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/wallets/:address/defi/summary': {
            method: 'GET',
            path: '/wallets/:address/defi/summary',
            description: 'Get the defi summary of a wallet address via Moralis — query by address. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get the defi summary of a wallet address via Moralis — query","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const EVM_CHAINS = sharedLists['evmChains']

    const moralisChains = EVM_CHAINS
        .filter( ( c ) => c.moralisChainSlug !== undefined )
    const aliasToSlug = moralisChains
        .reduce( ( acc, c ) => {
            acc[ c.alias ] = c.moralisChainSlug
            return acc
        }, {} )
    const defiAliases = [
        'ETHEREUM_MAINNET', 'SEPOLIA_TESTNET', 'POLYGON_MAINNET',
        'BINANCE_MAINNET', 'BINANCE_TESTNET', 'AVALANCHE_MAINNET',
        'FANTOM_MAINNET', 'PALM_MAINNET', 'CRONOS_MAINNET',
        'ARBITRUM_ONE_MAINNET', 'CHILIZ_MAINNET', 'CHILIZ_TESTNET',
        'GNOSIS_MAINNET', 'GNOSIS_TESTNET', 'BASE_MAINNET',
        'BASE_SEPOLIA_TESTNET', 'OPTIMISM_MAINNET', 'HOLESKY_TESTNET',
        'POLYGON_AMOY_TESTNET', 'LINEA_MAINNET', 'MOONBEAM_MAINNET',
        'MOONRIVER_MAINNET', 'MOONBASE_ALPHA_TESTNET', 'LINEA_SEPOLIA_TESTNET'
    ]
    const defiChainEnum = 'enum(' + defiAliases.join( ',' ) + ')'

    return {
        '/wallets/:address/defi/:protocol/positions': {
            preRequest: async ( { struct, payload } ) => {
                const chainAlias = payload.chain
                if( !chainAlias ) { return { struct } }
                const slug = aliasToSlug[ chainAlias ]
                if( !slug ) {
                    throw new Error( `Unsupported chain: ${chainAlias}` )
                }
                struct['url'] = struct['url'].replace( `chain=${chainAlias}`, `chain=${slug}` )
                return { struct }
            }
        },
        '/wallets/:address/defi/positions': {
            preRequest: async ( { struct, payload } ) => {
                const chainAlias = payload.chain
                if( !chainAlias ) { return { struct } }
                const slug = aliasToSlug[ chainAlias ]
                if( !slug ) {
                    throw new Error( `Unsupported chain: ${chainAlias}` )
                }
                struct['url'] = struct['url'].replace( `chain=${chainAlias}`, `chain=${slug}` )
                return { struct }
            }
        },
        '/wallets/:address/defi/summary': {
            preRequest: async ( { struct, payload } ) => {
                const chainAlias = payload.chain
                if( !chainAlias ) { return { struct } }
                const slug = aliasToSlug[ chainAlias ]
                if( !slug ) {
                    throw new Error( `Unsupported chain: ${chainAlias}` )
                }
                struct['url'] = struct['url'].replace( `chain=${chainAlias}`, `chain=${slug}` )
                return { struct }
            }
        }
    }
}
