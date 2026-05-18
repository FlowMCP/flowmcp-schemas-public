// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// DONE: axios -> native fetch
// DONE: moment -> requiredLibraries
// SharedLists: tradingTimeframes

export const main = {
    namespace: 'ohlcv',
    name: 'Moralis Recursive OHLCV Solana',
    description: 'Recursively fetch OHLCV candlestick data from Moralis for any Solana token pair — auto-paginates through all available timeframes for complete price history.',
    version: '4.0.0',
    docs: ['https://docs.moralis.io/web3-data-api/solana/reference/get-ohlcv-by-pair-address'],
    tags: ['solana', 'ohlcv', 'charts', 'cacheTtlRealtime'],
    sharedLists: [
        { ref: 'tradingTimeframes', version: '3.0.0' }
    ],
    root: 'https://solana-gateway.moralis.io',
    requiredServerParams: ['MORALIS_API_KEY'],
    requiredLibraries: ['moment'],
    headers: {
        'X-API-Key': '{{MORALIS_API_KEY}}'
    },
    tools: {
        getRecursiveOhlcvSolana: {
            method: 'GET',
            path: '/token/:chain/pairs/:pairAddress/ohlcv',
            description: 'Fetch OHLCV data recursively until max length or iteration limit is reached. Required: chain, pairAddress, timeframe, fromDateAmount, fromDateUnit, maxResultLength. Optional filters: currency.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(mainnet,devnet)', options: [] } },
                { position: { key: 'pairAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'timeframe', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(1s,10s,30s,1m,5m,10m,30m,1h,4h,12h,1d,1w,1M)', options: [] } },
                { position: { key: 'currency', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(usd,native)', options: ['optional()', 'default(usd)'] } },
                { position: { key: 'fromDateAmount', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'fromDateUnit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(minutes,hours,days,weeks,months,years)', options: [] } },
                { position: { key: 'maxResultLength', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(1000)'] } }
            ],
            tests: [
                {
                    _description: 'Fetch 7-day OHLCV data for USDC/SOL',
                    pairAddress: '83v8iPyZihDEjDdY8RdZddyZNyUtXngz69Lgo9Kt5d6d',
                    chain: 'mainnet',
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
    const TRADING_TIMEFRAMES = sharedLists['tradingTimeframes']

    const moralisTimeframes = TRADING_TIMEFRAMES
        .filter( ( t ) => t.moralisSlug !== undefined )
        .reduce( ( acc, t ) => {
            acc[ t.alias ] = t.moralisSlug
            return acc
        }, {} )

    return {
        getRecursiveOhlcvSolana: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { pairAddress, chain, timeframe: _timeframeAlias, currency, fromDateAmount, fromDateUnit, maxResultLength } = userParams
                const timeframe = moralisTimeframes[ _timeframeAlias ]
                const fromDate = moment().subtract( fromDateAmount, fromDateUnit ).toISOString()
                const toDate = moment().toISOString()
                const root = 'https://solana-gateway.moralis.io'
                const url = `${root}/token/${chain}/pairs/${pairAddress}/ohlcv`

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
                    .sort( ( a, b ) => a['unixTimestamp'] - b['unixTimestamp'] )
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
