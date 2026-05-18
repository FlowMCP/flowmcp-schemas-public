export const main = {
    namespace: 'chainlinkmulticall',
    name: 'Chainlink Price Feeds Multicall',
    description: 'Batch-read all Chainlink oracle price feeds for a selected EVM chain in a single Multicall3 call. Returns all trading pair prices at once instead of querying individual feeds.',
    version: '4.0.0',
    docs: [ 'https://docs.chain.link/data-feeds/price-feeds/addresses' ],
    tags: [ 'oracle', 'price', 'feeds', 'chainlink', 'multicall', 'batch', 'onchain', 'cacheTtlRealtime' ],
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
            description: 'List all available Chainlink price feed trading pairs for a selected EVM chain.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(ARBITRUM_MAINNET,AVALANCHE_MAINNET,BASE_MAINNET,BINANCE_MAINNET,CELO_MAINNET,ETHEREUM_MAINNET,LINEA_MAINNET,MANTLE_MAINNET,OPTIMISM_MAINNET,POLYGON_MAINNET,SCROLL_MAINNET,STARKNET_MAINNET,ZKSYNC_MAINNET)', options: [] } }
            ],
            tests: [
                { _description: 'List Chainlink feeds on Ethereum', chainName: 'ETHEREUM_MAINNET' },
                { _description: 'List Chainlink feeds on Polygon', chainName: 'POLYGON_MAINNET' }
            ]
        },
        getAllLatestPrices: {
            method: 'GET',
            path: '/',
            description: 'Fetch all latest Chainlink oracle prices for every trading pair on a selected EVM chain using a single Multicall3 batch call. Returns an array of [feedName, price, decimals, timestampISO, proxyAddress] for each feed.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(ARBITRUM_MAINNET,AVALANCHE_MAINNET,BASE_MAINNET,BINANCE_MAINNET,CELO_MAINNET,ETHEREUM_MAINNET,LINEA_MAINNET,MANTLE_MAINNET,OPTIMISM_MAINNET,POLYGON_MAINNET,SCROLL_MAINNET,STARKNET_MAINNET,ZKSYNC_MAINNET)', options: [] } }
            ],
            tests: [
                { _description: 'Get all latest Chainlink prices on Ethereum', chainName: 'ETHEREUM_MAINNET' },
                { _description: 'Get all latest Chainlink prices on Base', chainName: 'BASE_MAINNET' }
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

    const multicall3Abi = [ {
        name: 'aggregate3',
        inputs: [ {
            components: [
                { name: 'target', type: 'address' },
                { name: 'allowFailure', type: 'bool' },
                { name: 'callData', type: 'bytes' }
            ],
            name: 'calls',
            type: 'tuple[]'
        } ],
        outputs: [ {
            components: [
                { name: 'success', type: 'bool' },
                { name: 'returnData', type: 'bytes' }
            ],
            name: 'returnData',
            type: 'tuple[]'
        } ],
        stateMutability: 'view',
        type: 'function'
    } ]

    const MULTICALL3_ADDRESS = '0xca11bde05977b3631167028862be2a173976ca11'

    const iface = new ethers.Interface( priceFeedAbi )
    const latestRoundDataCalldata = iface.encodeFunctionData( 'latestRoundData' )
    const decimalsCalldata = iface.encodeFunctionData( 'decimals' )

    const multicallCommands = Object.entries( feedsByChain )
        .reduce( ( acc, [ chain, chainFeeds ] ) => {
            const priceCalls = chainFeeds
                .map( ( feed ) => {
                    const call = {
                        target: feed.proxyAddress,
                        allowFailure: true,
                        callData: latestRoundDataCalldata
                    }

                    return call
                } )

            const decimalCalls = chainFeeds
                .map( ( feed ) => {
                    const call = {
                        target: feed.proxyAddress,
                        allowFailure: true,
                        callData: decimalsCalldata
                    }

                    return call
                } )

            acc[ chain ] = [ priceCalls, decimalCalls ]

            return acc
        }, {} )

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


        getAllLatestPrices: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { _allParams: { chainName } } = userParams
                let { url } = payload

                const subdomain = infuraSubDomain[ chainName ]
                if( !subdomain ) {
                    struct[ 'messages' ].push( `No Infura subdomain configured for chain ${chainName}` )
                    struct[ 'status' ] = false

                    return { struct }
                }

                url = url.replace( '--infura-subdomain--', subdomain )

                const commands = multicallCommands[ chainName ]
                if( !commands ) {
                    struct[ 'messages' ].push( `No multicall commands prepared for chain ${chainName}` )
                    struct[ 'status' ] = false

                    return { struct }
                }

                try {
                    const provider = new ethers.JsonRpcProvider( url )
                    const multicall = new ethers.Contract( MULTICALL3_ADDRESS, multicall3Abi, provider )

                    const [ priceCalls, decimalCalls ] = commands
                    const [ priceRes, decRes ] = await Promise.all( [
                        multicall.aggregate3( priceCalls ),
                        multicall.aggregate3( decimalCalls )
                    ] )

                    const chainFeeds = feedsByChain[ chainName ]
                    const allPrices = priceRes
                        .map( ( latest, i ) => {
                            const decimal = decRes[ i ]
                            if( !latest.success || !decimal.success ) { return null }

                            const latestDecoded = iface.decodeFunctionResult( 'latestRoundData', latest.returnData )
                            const decimalsDecoded = iface.decodeFunctionResult( 'decimals', decimal.returnData )
                            const decimals = Number( decimalsDecoded[ 0 ] )

                            const [ roundId, answer, , updatedAt ] = latestDecoded
                            const price = Number( ethers.formatUnits( answer, decimals ) )
                            const timestamp = Number( updatedAt ) * 1000
                            const timestampISO = new Date( timestamp ).toISOString()
                            const { name, proxyAddress } = chainFeeds[ i ]
                            const result = [ name, price, decimals, timestampISO, proxyAddress ]

                            return result
                        } )
                        .filter( ( item ) => item !== null )

                    struct[ 'data' ] = allPrices
                } catch( e ) {
                    struct[ 'messages' ].push( e?.message )
                    struct[ 'status' ] = false
                }

                return { struct }
            }
        }
    }
}
