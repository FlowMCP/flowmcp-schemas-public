// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Import: import { EVM_CHAINS } from '../../_shared/evmChains.mjs'
// Module-level code: 40 lines

export const main = {
    namespace: 'moralis',
    name: 'Moralis priceApi API',
    description: 'Token and NFT price data via Moralis — ERC20 token prices, NFT floor prices (current and historical), NFT sale history, and DEX pair OHLCV candlestick data across EVM chains.',
    version: '4.0.0',
    docs: ['https://docs.moralis.com'],
    tags: ['evm', 'prices', 'tokens', 'cacheTtlRealtime'],
    sharedLists: [
        { ref: 'evmChains', version: '3.1.0', filter: { key: 'moralisChainSlug', exists: true } }
    ],
    root: 'https://deep-index.moralis.io/api/v2.2',
    requiredServerParams: ['MORALIS_API_KEY'],
    headers: {
        'X-API-Key': '{{MORALIS_API_KEY}}'
    },
    tools: {
        '/nft/:address/price': {
            method: 'GET',
            path: '/nft/:address/price',
            description: 'Get the sold price for an NFT contract for the last x days (only trades paid in ETH).',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'days', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get the sold price for an NFT contract for the last x days (","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/nft/:address/floor-price': {
            method: 'GET',
            path: '/nft/:address/floor-price',
            description: 'Get floor price for a given contract via Moralis — query by address. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get floor price for a given contract via Moralis — query by ","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/nft/:address/:token_id/floor-price': {
            method: 'GET',
            path: '/nft/:address/:token_id/floor-price',
            description: 'Get floor price for a given token via Moralis — query by address and token id. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'token_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get floor price for a given token via Moralis — query by add","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045","token_id":"1"}]
        },
        '/nft/:address/floor-price/historical': {
            method: 'GET',
            path: '/nft/:address/floor-price/historical',
            description: 'Get historical floor price for a given contract via Moralis — query by address. Supports cursor filters.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(1d,7d,30d,60d,90d,1y,all)', options: [] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get historical floor price for a given contract via Moralis ","chain":"ETHEREUM_MAINNET","interval":"1d","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/nft/:address/:token_id/price': {
            method: 'GET',
            path: '/nft/:address/:token_id/price',
            description: 'Get the sold price for an NFT token for the last x days (only trades paid in ETH).',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'days', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'token_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get the sold price for an NFT token for the last x days (onl","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045","token_id":"1"}]
        },
        '/pairs/:address/ohlcv': {
            method: 'GET',
            path: '/pairs/:address/ohlcv',
            description: 'Get the OHLCV candle stick by using pair address via Moralis — query by address. Supports limit, cursor filters.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'timeframe', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(1s,10s,30s,1min,5min,10min,30min,1h,4h,12h,1d,1w,1M)', options: [] } },
                { position: { key: 'currency', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(usd,native)', options: [] } },
                { position: { key: 'fromDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'toDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get the OHLCV candle stick by using pair address via Moralis","chain":"ETHEREUM_MAINNET","timeframe":"1s","currency":"usd","fromDate":"test","toDate":"test","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
        },
        '/erc20/:address/price': {
            method: 'GET',
            path: '/erc20/:address/price',
            description: 'Get the token price denominated in the blockchain\'s native token and USD. View supported exchanges here',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'include', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(percent_change)', options: ['optional()'] } },
                { position: { key: 'exchange', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(uniswapv2,uniswapv3,sushiswapv2,pancakeswapv1,pancakeswapv2,pancakeswapv3,quickswap,quickswapv2,traderjoe,pangolin,spookyswap,vvs,mm finance,crodex,camelotv2)', options: ['optional()'] } },
                { position: { key: 'to_block', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'max_token_inactivity', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'min_pair_side_liquidity_usd', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [{"_description":"Get the token price denominated in the blockchain's native t","chain":"ETHEREUM_MAINNET","address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}]
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
    const fullChainAliases = [
        'ETHEREUM_MAINNET', 'SEPOLIA_TESTNET', 'HOLESKY_TESTNET',
        'POLYGON_MAINNET', 'POLYGON_AMOY_TESTNET', 'BINANCE_MAINNET',
        'BINANCE_TESTNET', 'AVALANCHE_MAINNET', 'FANTOM_MAINNET',
        'PALM_MAINNET', 'CRONOS_MAINNET', 'ARBITRUM_ONE_MAINNET',
        'GNOSIS_MAINNET', 'GNOSIS_TESTNET', 'CHILIZ_MAINNET',
        'CHILIZ_TESTNET', 'BASE_MAINNET', 'BASE_SEPOLIA_TESTNET',
        'OPTIMISM_MAINNET', 'LINEA_MAINNET', 'LINEA_SEPOLIA_TESTNET',
        'MOONBEAM_MAINNET', 'MOONRIVER_MAINNET', 'MOONBASE_ALPHA_TESTNET',
        'FLOW_MAINNET', 'FLOW_TESTNET', 'RONIN_MAINNET', 'RONIN_TESTNET',
        'LISK_MAINNET', 'LISK_SEPOLIA_TESTNET', 'PULSECHAIN_MAINNET'
    ]
    const fullChainEnum = 'enum(' + fullChainAliases.join( ',' ) + ')'
    const nftPriceAliases = [
        'ETHEREUM_MAINNET', 'POLYGON_MAINNET', 'BINANCE_MAINNET',
        'AVALANCHE_MAINNET', 'ARBITRUM_ONE_MAINNET', 'BASE_MAINNET',
        'OPTIMISM_MAINNET'
    ]
    const nftPriceChainEnum = 'enum(' + nftPriceAliases.join( ',' ) + ')'
    const floorPriceAliases = [
        'ETHEREUM_MAINNET', 'BASE_MAINNET'
    ]
    const floorPriceChainEnum = 'enum(' + floorPriceAliases.join( ',' ) + ')'
    const erc20PriceAliases = [
        'ETHEREUM_MAINNET', 'POLYGON_MAINNET', 'BINANCE_MAINNET',
        'AVALANCHE_MAINNET', 'FANTOM_MAINNET', 'PALM_MAINNET',
        'CRONOS_MAINNET', 'ARBITRUM_ONE_MAINNET', 'GNOSIS_MAINNET',
        'CHILIZ_MAINNET', 'BASE_MAINNET', 'OPTIMISM_MAINNET',
        'LINEA_MAINNET', 'MOONBEAM_MAINNET', 'MOONRIVER_MAINNET',
        'MOONBASE_ALPHA_TESTNET', 'FLOW_MAINNET', 'RONIN_MAINNET',
        'LISK_MAINNET', 'PULSECHAIN_MAINNET'
    ]
    const erc20PriceChainEnum = 'enum(' + erc20PriceAliases.join( ',' ) + ')'

    return {
        '/nft/:address/price': {
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
        '/nft/:address/floor-price': {
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
        '/nft/:address/:token_id/floor-price': {
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
        '/nft/:address/floor-price/historical': {
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
        '/nft/:address/:token_id/price': {
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
        '/pairs/:address/ohlcv': {
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
        '/erc20/:address/price': {
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
