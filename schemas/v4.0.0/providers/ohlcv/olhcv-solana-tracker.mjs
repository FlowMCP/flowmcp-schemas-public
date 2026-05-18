// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// DONE: moment -> requiredLibraries
// SharedLists: tradingTimeframes

export const main = {
    namespace: 'ohlcv',
    name: 'Solana Tracker OHLCV for Solana',
    description: 'Retrieve OHLCV candlestick chart data from Solana Tracker for any Solana token and pool pair — configurable timeframes for price history visualization.',
    version: '4.0.0',
    docs: ['https://data.solanatracker.io'],
    tags: ['solana', 'ohlcv', 'charts', 'cacheTtlRealtime'],
    sharedLists: [
        { ref: 'tradingTimeframes', version: '3.0.0', filter: { key: 'solanaTrackerSlug', exists: true } }
    ],
    root: 'https://data.solanatracker.io',
    requiredServerParams: ['SOLANA_TRACKER_API_KEY'],
    requiredLibraries: ['moment'],
    headers: {
        'x-api-key': '{{SOLANA_TRACKER_API_KEY}}',
        'Content-Type': 'application/json'
    },
    tools: {
        getOhlcvSolana: {
            method: 'GET',
            path: '/chart/:token/:pool',
            description: 'Fetch OHLCV chart data for a specific token and pool on Solana. Required: token, pool, type, fromDateAmount, fromDateUnit, marketCap, removeOutliers.',
            parameters: [
                { position: { key: 'token', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'pool', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum({{tradingTimeframes:alias}})', options: [] } },
                { position: { key: 'fromDateAmount', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'fromDateUnit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(minutes,hours,days,weeks,months,years)', options: [] } },
                { position: { key: 'marketCap', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['default(false)'] } },
                { position: { key: 'removeOutliers', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['default(false)'] } }
            ],
            tests: [
                {
                    _description: '7 days chart data for token/pool',
                    token: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
                    pool: '9Tb2ohu5P16BpBarqd3N27WnkF51Ukfs8Z1GzzLDxVZW',
                    type: '1d',
                    fromDateAmount: 7,
                    fromDateUnit: 'days',
                    marketCap: 'false',
                    removeOutliers: 'false'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        oclhv: { type: 'array', description: 'Array of OHLCV candlestick data points sorted by time', items: { type: 'object', properties: { open: { type: 'number', description: 'Opening price for the candle period' }, close: { type: 'number', description: 'Closing price for the candle period' }, low: { type: 'number', description: 'Lowest price during the candle period' }, high: { type: 'number', description: 'Highest price during the candle period' }, volume: { type: 'number', description: 'Trading volume during the candle period' }, time: { type: 'number', description: 'Unix timestamp of the candle start' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const moment = libraries['moment']
    const TRADING_TIMEFRAMES = sharedLists['tradingTimeframes']

    const solanaTrackerTimeframes = TRADING_TIMEFRAMES
        .filter( ( t ) => t.solanaTrackerSlug !== undefined )
        .reduce( ( acc, t ) => {
            acc[ t.alias ] = t.seconds
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

    return {
        getOhlcvSolana: {
            preRequest: async ( { struct, payload } ) => {
                const { fromDateAmount, fromDateUnit } = payload
                const from = moment().subtract(fromDateAmount, fromDateUnit ).unix()
                const to = moment().unix()

                const url = new URL( struct.url )
                const params = Object
                .fromEntries( url.searchParams.entries() )

                delete params['fromDateAmount']
                delete params['fromDateUnit']
                params[ 'type' ] = solanaTrackerTimeframes[ params[ 'type' ] ]
                params[ 'time_from' ] = from
                params[ 'time_to' ] = to

                const newSearchParams = new URLSearchParams( params )
                struct.url = ''
                struct.url += url.origin + url.pathname
                struct.url += '?' + newSearchParams.toString()
                return { struct }
            },
            postRequest: async ( { response, struct, payload } ) => {
                try {
                    const { oclhv } = response
                    const result = oclhv
                        .map( ( a ) => {
                            const unixTimestamp = a.time
                            const timestamp = moment( a.timestamp ).toISOString()

                            return { open: a.open, close: a.close, high: a.high, low: a.low, volume: a.volume, unixTimestamp, timestamp }
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

                    response = result
                } catch( e ) {
                    struct.status = false
                    struct.messages.push( `Error transforming chart data: ${e.message}` )
                }

                return { response }
            }
        }
    }
}
