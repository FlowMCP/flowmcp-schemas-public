export const main = {
    namespace: 'chainlink',
    name: 'Chainlink Price Feeds',
    description: 'Read individual Chainlink oracle price feeds on 13 EVM chains. Query available chains, discover trading pairs per chain, and fetch real-time prices from on-chain oracle contracts via Infura RPC.',
    version: '4.0.0',
    docs: [ 'https://docs.chain.link/data-feeds/price-feeds/addresses' ],
    tags: [ 'oracle', 'price', 'feeds', 'chainlink', 'onchain', 'cacheTtlRealtime' ],
    sharedLists: [
        { ref: 'evmChains', version: '3.1.0' },
        { ref: 'chainlinkPriceFeeds', version: '3.0.0' }
    ],
    root: 'https://--infura-subdomain--.infura.io/v3/{{INFURA_API_KEY}}',
    requiredServerParams: [ 'INFURA_API_KEY' ],
    tools: {
        getAvailableChains: {
            method: 'GET',
            path: '/',
            description: 'List all EVM chains with available Chainlink price feeds, including the number of supported trading pairs per chain.',
            parameters: [],
            tests: [
                { _description: 'List all supported Chainlink chains' }
            ]
        },
        getAvailableFeeds: {
            method: 'GET',
            path: '/',
            description: 'List all available Chainlink price feed trading pairs for a selected EVM chain. Use this to discover valid feedName values before calling getLatestPrice.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(ARBITRUM_MAINNET,AVALANCHE_MAINNET,BASE_MAINNET,BINANCE_MAINNET,CELO_MAINNET,ETHEREUM_MAINNET,LINEA_MAINNET,MANTLE_MAINNET,OPTIMISM_MAINNET,POLYGON_MAINNET,SCROLL_MAINNET,STARKNET_MAINNET,ZKSYNC_MAINNET)', options: [] } }
            ],
            tests: [
                { _description: 'List Chainlink feeds on Ethereum', chainName: 'ETHEREUM_MAINNET' },
                { _description: 'List Chainlink feeds on Polygon', chainName: 'POLYGON_MAINNET' }
            ]
        },
        getLatestPrice: {
            method: 'GET',
            path: '/',
            description: 'Fetch the latest Chainlink oracle price for a specific trading pair on a selected EVM chain. Returns price, decimals, round ID, timestamp and proxy contract address.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(ARBITRUM_MAINNET,AVALANCHE_MAINNET,BASE_MAINNET,BINANCE_MAINNET,CELO_MAINNET,ETHEREUM_MAINNET,LINEA_MAINNET,MANTLE_MAINNET,OPTIMISM_MAINNET,POLYGON_MAINNET,SCROLL_MAINNET,STARKNET_MAINNET,ZKSYNC_MAINNET)', options: [] } },
                { position: { key: 'feedName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [ 'min(3)', 'max(20)' ] } }
            ],
            tests: [
                { _description: 'Get ETH/USD price on Ethereum', chainName: 'ETHEREUM_MAINNET', feedName: 'ETH/USD' },
                { _description: 'Get BTC/USD price on Ethereum', chainName: 'ETHEREUM_MAINNET', feedName: 'BTC/USD' },
                { _description: 'Get ETH/USD price on Polygon', chainName: 'POLYGON_MAINNET', feedName: 'ETH/USD' }
            ]
        }
    },
    requiredLibraries: [ 'ethers' ]
}


export const handlers = ( { sharedLists, libraries } ) => {
    const ethers = libraries[ 'ethers' ]
    const EVM_CHAINS = sharedLists[ 'evmChains' ]
    const FEEDS = sharedLists[ 'chainlinkPriceFeeds' ]

    const infuraSubDomain = EVM_CHAINS
        .filter( ( c ) => c.infuraSubdomain !== undefined )
        .reduce( ( acc, c ) => {
            acc[ c.alias ] = c.infuraSubdomain
            return acc
        }, {} )

    const feedsByChain = FEEDS
        .reduce( ( acc, f ) => {
            if( !acc[ f.chain ] ) { acc[ f.chain ] = [] }
            acc[ f.chain ].push( f )
            return acc
        }, {} )

    const priceFeedAbi = [
        'function decimals() view returns (uint8)',
        'function description() view returns (string)',
        'function version() view returns (uint256)',
        'function getRoundData(uint80 _roundId) view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
        'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)'
    ]

    return {
        getAvailableChains: {
            executeRequest: async ( { struct } ) => {
                struct[ 'data' ] = {
                    chains: Object.keys( feedsByChain )
                        .map( ( chain ) => {
                            const feedCount = feedsByChain[ chain ].length

                            return { chain, feedCount }
                        } )
                }

                return { struct }
            }
        },


        getAvailableFeeds: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { _allParams: { chainName } } = userParams

                const chainFeeds = feedsByChain[ chainName ]
                if( !chainFeeds ) {
                    struct[ 'messages' ].push( `No feeds found for chain ${chainName}` )
                    struct[ 'status' ] = false

                    return { struct }
                }

                struct[ 'data' ] = {
                    chainName,
                    feedCount: chainFeeds.length,
                    feeds: chainFeeds.map( ( { name } ) => name )
                }

                return { struct }
            }
        },


        getLatestPrice: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { _allParams: { chainName, feedName } } = userParams
                let { url } = payload

                const subdomain = infuraSubDomain[ chainName ]
                if( !subdomain ) {
                    struct[ 'messages' ].push( `No Infura subdomain configured for chain ${chainName}` )
                    struct[ 'status' ] = false

                    return { struct }
                }

                url = url.replace( '--infura-subdomain--', subdomain )

                const chainFeeds = feedsByChain[ chainName ]
                if( !chainFeeds ) {
                    struct[ 'messages' ].push( `No feeds found for chain ${chainName}` )
                    struct[ 'status' ] = false

                    return { struct }
                }

                const feed = chainFeeds.find( ( f ) => f[ 'name' ] === feedName )
                if( !feed ) {
                    struct[ 'messages' ].push( `No feed found for ${feedName} on ${chainName}` )
                    struct[ 'status' ] = false

                    return { struct }
                }

                try {
                    const { proxyAddress } = feed
                    const provider = new ethers.JsonRpcProvider( url )
                    const contract = new ethers.Contract( proxyAddress, priceFeedAbi, provider )

                    let [ decimals, latestRound ] = await Promise.all( [
                        contract.decimals(),
                        contract.latestRoundData()
                    ] )

                    const { answer, updatedAt, roundId } = latestRound
                    const price = Number( ethers.formatUnits( answer, decimals ) )
                    const timestamp = Number( updatedAt ) * 1000
                    const timestampISO = new Date( timestamp ).toISOString()
                    decimals = Number( decimals )
                    const roundIdStr = roundId.toString()

                    struct[ 'data' ] = {
                        feedName,
                        price,
                        decimals,
                        chainName,
                        roundId: roundIdStr,
                        timestampISO,
                        proxyAddress
                    }
                } catch( e ) {
                    struct[ 'messages' ].push( e?.message )
                    struct[ 'status' ] = false
                }

                return { struct }
            }
        }
    }
}
