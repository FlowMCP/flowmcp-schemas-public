// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// DONE: axios -> native fetch
// DONE: moment -> requiredLibraries
// SharedLists: evmChains, tradingTimeframes

export const main = {
    namespace: 'ohlcv',
    name: 'Moralis Recursive OHLCV EVM and Ethereum',
    description: 'Recursively fetch OHLCV candlestick data from Moralis for any EVM token pair — auto-paginates through all available timeframes for complete price history.',
    version: '4.0.0',
    docs: ['https://docs.moralis.io/web3-data-api/evm/reference/get-ohlcv-by-pair-address'],
    tags: ['evm', 'ohlcv', 'charts', 'cacheTtlRealtime'],
    sharedLists: [
        { ref: 'evmChains', version: '3.1.0', filter: { key: 'moralisChainSlug', exists: true } },
        { ref: 'tradingTimeframes', version: '3.0.0' }
    ],
    root: 'https://deep-index.moralis.io',
    requiredServerParams: ['MORALIS_API_KEY'],
    requiredLibraries: ['moment'],
    headers: {
        'X-API-Key': '{{MORALIS_API_KEY}}'
    },
    tools: {
        getRecursiveOhlcvEVM: {
            method: 'GET',
            path: '/api/v2.2/pairs/:pairAddress/ohlcv',
            description: 'Fetch OHLCV data recursively until max length or iteration limit is reached. Required: pairAddress, chain, timeframe, currency, fromDateAmount, fromDateUnit, maxResultLength.',
            parameters: [
                { position: { key: 'pairAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{evmChains:alias}})', options: [] } },
                { position: { key: 'timeframe', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(1s,10s,30s,1m,5m,10m,30m,1h,4h,12h,1d,1w,1M)', options: [] } },
                { position: { key: 'currency', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(usd,native)', options: ['default(usd)'] } },
                { position: { key: 'fromDateAmount', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'fromDateUnit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(minutes,hours,days,weeks,months,years)', options: [] } },
                { position: { key: 'maxResultLength', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional(), default(1000)'] } }
            ],
            tests: [
                {
                    _description: 'Fetch 7-day OHLCV data for WETH/USDC Uniswap V2 pair on Ethereum',
                    pairAddress: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
                    chain: 'ETHEREUM_MAINNET',
                    timeframe: '1m',
                    currency: 'usd',
                    fromDateAmount: 7,
                    fromDateUnit: 'days',
                    maxResultLength: 1000
                }
            ],
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const moment = libraries['moment']
    const EVM_CHAINS = sharedLists['evmChains']
    const TRADING_TIMEFRAMES = sharedLists['tradingTimeframes']

    const moralisTimeframes = TRADING_TIMEFRAMES
        .filter( ( t ) => t.moralisSlug !== undefined )
        .reduce( ( acc, t ) => {
            acc[ t.alias ] = t.moralisSlug
            return acc
        }, {} )
    const fromDateUnits = {
        "minutes": 60,
        "hours": 3600,
        "days": 86400,
        "weeks": 604800,
        "months": 2592000,
        "years": 31536000
    }
    const moralisChainAliases = [
        'ETHEREUM_MAINNET', 'SEPOLIA_TESTNET', 'HOLESKY_TESTNET',
        'POLYGON_MAINNET', 'POLYGON_AMOY_TESTNET', 'BINANCE_MAINNET',
        'BINANCE_TESTNET', 'AVALANCHE_MAINNET', 'FANTOM_MAINNET',
        'CRONOS_MAINNET', 'ARBITRUM_ONE_MAINNET', 'GNOSIS_MAINNET',
        'GNOSIS_TESTNET', 'CHILIZ_MAINNET', 'CHILIZ_TESTNET',
        'BASE_MAINNET', 'BASE_SEPOLIA_TESTNET', 'OPTIMISM_MAINNET',
        'LINEA_MAINNET', 'LINEA_SEPOLIA_TESTNET', 'MOONBEAM_MAINNET',
        'MOONRIVER_MAINNET', 'MOONBASE_ALPHA_TESTNET', 'FLOW_MAINNET',
        'FLOW_TESTNET', 'RONIN_MAINNET', 'RONIN_TESTNET',
        'LISK_MAINNET', 'LISK_SEPOLIA_TESTNET', 'PULSECHAIN_MAINNET'
    ]
    const chainSelections = EVM_CHAINS
        .filter( ( c ) => moralisChainAliases.includes( c.alias ) && c.moralisChainSlug !== undefined )
        .reduce( ( acc, chain ) => {
            acc[ chain.alias ] = chain.moralisChainSlug
            return acc
        }, {} )

    return {
        getRecursiveOhlcvEVM: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { pairAddress, chain: _chainValue, timeframe: _timeframeAlias, currency, fromDateAmount, fromDateUnit, maxResultLength = 1000 } = userParams
                const chain = chainSelections[ _chainValue ]
                const timeframe = moralisTimeframes[ _timeframeAlias ]
                const fromDate = moment().subtract(fromDateAmount, fromDateUnit).toISOString();
                const toDate = moment().toISOString();
                const url = `https://deep-index.moralis.io/api/v2.2/pairs/${pairAddress}/ohlcv`;

                let accumulated = []
                let cursor = null
                let iteration = 0
                const maxIterations = 5
                const { headers } = payload

                let keepFetching = true
                const fetchPage = async () => {
                    if( iteration >= maxIterations || accumulated.length >= maxResultLength || !keepFetching ) {
                        return
                    }

                    try {
                        const params = new URLSearchParams( {
                            chain, timeframe, currency, fromDate, toDate, 'limit': '1000'
                        } )

                        if( cursor ) { params.set( 'cursor', cursor ) }

                        const res = await fetch( `${url}?${params.toString()}`, { headers } )

                        if( !res.ok ) {
                            struct.status = false
                            struct.messages.push( `API error: ${res.status}` )
                            keepFetching = false
                            return
                        }

                        const body = await res.json()
                        const { result, cursor: next } = body

                        if( !Array.isArray( result ) ) {
                            keepFetching = false
                            return
                        }

                        result.forEach( ( item ) => { accumulated.push( item ) } )

                        if( !next ) {
                            keepFetching = false
                            return
                        }

                        cursor = next
                        iteration = iteration + 1
                        await fetchPage()
                    } catch( e ) {
                        struct.status = false
                        struct.messages.push( `API error: ${e.message}` )
                        keepFetching = false
                    }
                }

                await fetchPage()

                if( !struct.status ) {
                    return { struct }
                }

                const data = accumulated
                    .map( ( a ) => {
                        const unixTimestamp = moment( a.timestamp ).unix()

                        return { open: a.open, close: a.close, high: a.high, low: a.low, volume: a.volume, timestamp: a.timestamp, unixTimestamp }
                    } )
                    .sort( ( a, b ) => a.unixTimestamp - b.unixTimestamp )
                    .reduce( ( acc, a ) => {
                        acc.openings.push( a.open )
                        acc.closings.push( a.close )
                        acc.highs.push( a.high )
                        acc.lows.push( a.low )
                        acc.volumes.push( a.volume )
                        acc.timestamps.push( a.timestamp )
                        acc.prices.push( a.close )
                        acc.values.push( a.close )

                        return acc
                    }, {
                        openings: [],
                        closings: [],
                        highs: [],
                        lows: [],
                        volumes: [],
                        prices: [],
                        values: [],
                        timestamps: []
                    } )

                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        }
    }
}
