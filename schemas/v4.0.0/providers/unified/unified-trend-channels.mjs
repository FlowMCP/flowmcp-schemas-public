export const main = {
    namespace: 'unified',
    name: 'UnifiedTrendChannels',
    description: 'Compute trend channel and band indicators from price data. Choose between indicatorts, trading-signals, and talib via the library parameter. Covers Bollinger Bands, Bollinger Bands Width, Keltner Channel, Donchian Channel, Acceleration Bands, and Ichimoku Cloud. All computation is local.',
    version: '4.0.0',
    docs: ['https://github.com/bennycode/trading-signals', 'https://github.com/cinar/indicatorts'],
    tags: ['trading', 'indicators', 'trend', 'channels', 'bands', 'unified'],
    root: 'https://...',
    requiredLibraries: ['trading-signals', 'indicatorts', 'talib'],
    tools: {
        computeBollingerBands: {
            method: 'GET',
            path: '/',
            description: 'Bollinger Bands (BB). Volatility bands placed above and below a moving average. Band width expands during volatility, contracts during consolidation. Default: 20-period SMA with 2 standard deviations.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(20)'] } },
                { position: { key: 'deviationMultiplier', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(2)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute BB(5,2) via trading-signals', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 5, deviationMultiplier: 2, library: 'trading-signals' },
                { _description: 'Compute BB(5,2) via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 5, deviationMultiplier: 2, library: 'indicatorts' },
                { _description: 'Compute BB(5,2) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 5, deviationMultiplier: 2, library: 'talib' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        values: { type: 'array', items: { type: 'number' }, description: 'Computed indicator values' },
                        length: { type: 'number', description: 'Number of values' }
                    }
                }
            }
        },
        computeBollingerBandsWidth: {
            method: 'GET',
            path: '/',
            description: 'Bollinger Bands Width (BBW). Measures the percentage difference between upper and lower Bollinger Bands. Low values indicate consolidation (squeeze), high values indicate volatility expansion.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(20)'] } },
                { position: { key: 'deviationMultiplier', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(2)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute BBW(5,2) via trading-signals', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 5, deviationMultiplier: 2, library: 'trading-signals' },
                { _description: 'Compute BBW(5,2) via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 5, deviationMultiplier: 2, library: 'indicatorts' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        values: { type: 'array', items: { type: 'number' }, description: 'Computed indicator values' },
                        length: { type: 'number', description: 'Number of values' }
                    }
                }
            }
        },
        computeKeltnerChannel: {
            method: 'GET',
            path: '/',
            description: 'Keltner Channel. Volatility-based envelope set above and below an EMA. Uses ATR for band distance. Trend direction and breakout signals when price moves outside the channel.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(20)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute Keltner(5) via indicatorts', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 5, library: 'indicatorts' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        values: { type: 'array', items: { type: 'number' }, description: 'Computed indicator values' },
                        length: { type: 'number', description: 'Number of values' }
                    }
                }
            }
        },
        computeDonchianChannel: {
            method: 'GET',
            path: '/',
            description: 'Donchian Channel. Plots the highest high and lowest low over N periods. Classic breakout indicator — price above upper channel signals bullish breakout, below lower signals bearish.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(20)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute Donchian(5) via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 5, library: 'indicatorts' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        values: { type: 'array', items: { type: 'number' }, description: 'Computed indicator values' },
                        length: { type: 'number', description: 'Number of values' }
                    }
                }
            }
        },
        computeAccelerationBands: {
            method: 'GET',
            path: '/',
            description: 'Acceleration Bands (ABands). Envelope indicator that plots upper and lower bands around a moving average based on price acceleration. Band expansion signals breakout potential.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(20)'] } },
                { position: { key: 'width', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(4)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute ABands(5,4) via trading-signals', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 5, width: 4, library: 'trading-signals' },
                { _description: 'Compute ABands(5,4) via talib', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 5, width: 4, library: 'talib' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        values: { type: 'array', items: { type: 'number' }, description: 'Computed indicator values' },
                        length: { type: 'number', description: 'Number of values' }
                    }
                }
            }
        },
        computeIchimokuCloud: {
            method: 'GET',
            path: '/',
            description: 'Ichimoku Cloud (Ichimoku Kinko Hyo). Comprehensive indicator showing support/resistance, trend direction, and momentum. Includes Conversion Line, Base Line, Leading Span A/B, and Lagging Span.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'short', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(9)'] } },
                { position: { key: 'medium', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(26)'] } },
                { position: { key: 'long', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(52)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute Ichimoku(3,5,10) via indicatorts', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', short: 3, medium: 5, long: 10, library: 'indicatorts' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        values: { type: 'array', items: { type: 'number' }, description: 'Computed indicator values' },
                        length: { type: 'number', description: 'Number of values' }
                    }
                }
            }
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const ts = libraries['trading-signals']
    const ind = libraries['indicatorts']
    const talib = libraries['talib']

    function parseArray( str ) {
        const arr = str
            .split( ',' )
            .map( ( v ) => parseFloat( v.trim() ) )
            .filter( ( v ) => !isNaN( v ) )

        return arr
    }

    function executeTalib( config ) {
        const result = new Promise( ( resolve, reject ) => {
            talib.execute( config, ( err, res ) => {
                if( err ) { reject( err ) }
                else { resolve( res ) }
            } )
        } )

        return result
    }

    function buildCandles( highs, lows, closings ) {
        const len = Math.min( highs.length, lows.length, closings.length )
        const candles = []

        Array.from( { length: len } )
            .forEach( ( _, i ) => {
                candles.push( { high: highs[ i ], low: lows[ i ], close: closings[ i ] } )
            } )

        return candles
    }

    return {
        computeBollingerBands: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsStr, period = 20, deviationMultiplier = 2, library = 'trading-signals' } = userParams

                if( library === 'trading-signals' ) {
                    const closings = parseArray( closingsStr )
                    const indicator = new ts.BollingerBands( period, deviationMultiplier )
                    const results = []

                    closings
                        .forEach( ( price ) => {
                            const val = indicator.add( price )

                            if( val !== null ) {
                                results.push( {
                                    upper: Number( val.upper ),
                                    middle: Number( val.middle ),
                                    lower: Number( val.lower )
                                } )
                            } else {
                                results.push( null )
                            }
                        } )

                    const stableResults = results
                        .filter( ( v ) => v !== null )
                    const latest = stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null

                    struct['data'] = {
                        indicator: 'BollingerBands',
                        period,
                        deviationMultiplier,
                        library,
                        values: results,
                        stableValues: stableResults,
                        latest,
                        isStable: indicator.isStable,
                        count: closings.length,
                        stableCount: stableResults.length
                    }
                } else if( library === 'indicatorts' ) {
                    const closings = parseArray( closingsStr )
                    const raw = ind.bollingerBands( closings, { period } )
                    const upperArr = raw.upper || []
                    const middleArr = raw.middle || []
                    const lowerArr = raw.lower || []
                    const len = Math.max( upperArr.length, middleArr.length, lowerArr.length )
                    const values = []

                    Array.from( { length: len } )
                        .forEach( ( _, i ) => {
                            const upper = upperArr[ i ]
                            const middle = middleArr[ i ]
                            const lower = lowerArr[ i ]
                            const allValid = upper !== undefined && middle !== undefined && lower !== undefined && !isNaN( upper ) && !isNaN( middle ) && !isNaN( lower )

                            if( allValid ) {
                                values.push( { upper, middle, lower } )
                            } else {
                                values.push( null )
                            }
                        } )

                    const stableValues = values
                        .filter( ( v ) => v !== null )
                    const latest = stableValues.length > 0 ? stableValues[ stableValues.length - 1 ] : null

                    struct['data'] = {
                        indicator: 'BollingerBands',
                        period,
                        deviationMultiplier,
                        library,
                        values,
                        stableValues,
                        latest,
                        count: closings.length,
                        stableCount: stableValues.length
                    }
                } else if( library === 'talib' ) {
                    const closings = parseArray( closingsStr )
                    const config = {
                        name: 'BBANDS',
                        startIdx: 0,
                        endIdx: closings.length - 1,
                        inReal: closings,
                        optInTimePeriod: period,
                        optInNbDevUp: deviationMultiplier,
                        optInNbDevDn: deviationMultiplier,
                        optInMAType: 0
                    }
                    const result = await executeTalib( config )
                    const upper = result.result.outRealUpperBand
                    const middle = result.result.outRealMiddleBand
                    const lower = result.result.outRealLowerBand
                    const len = Math.max( upper.length, middle.length, lower.length )
                    const values = []

                    Array.from( { length: len } )
                        .forEach( ( _, i ) => {
                            values.push( { upper: upper[ i ], middle: middle[ i ], lower: lower[ i ] } )
                        } )

                    const latest = values.length > 0 ? values[ values.length - 1 ] : null

                    struct['data'] = {
                        indicator: 'BollingerBands',
                        period,
                        deviationMultiplier,
                        library,
                        values,
                        latest,
                        count: closings.length,
                        stableCount: values.length,
                        begIndex: result.begIndex
                    }
                }

                struct['status'] = true

                return { struct }
            }
        },
        computeBollingerBandsWidth: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsStr, period = 20, deviationMultiplier = 2, library = 'trading-signals' } = userParams

                if( library === 'trading-signals' ) {
                    const closings = parseArray( closingsStr )
                    const bb = new ts.BollingerBands( period, deviationMultiplier )
                    const indicator = new ts.BollingerBandsWidth( bb )
                    const results = []

                    closings
                        .forEach( ( price ) => {
                            const val = indicator.add( price )
                            results.push( val !== null && val !== undefined ? Number( val ) : null )
                        } )

                    const stableResults = results
                        .filter( ( v ) => v !== null )

                    struct['data'] = {
                        indicator: 'BollingerBandsWidth',
                        period,
                        deviationMultiplier,
                        library,
                        values: results,
                        stableValues: stableResults,
                        latest: stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null,
                        isStable: indicator.isStable,
                        count: closings.length,
                        stableCount: stableResults.length
                    }
                } else if( library === 'indicatorts' ) {
                    const closings = parseArray( closingsStr )
                    const bb = ind.bollingerBands( closings, { period } )
                    const raw = ind.bollingerBandsWidth( bb, { period } )
                    const values = raw.width || []

                    struct['data'] = {
                        indicator: 'BollingerBandsWidth',
                        period,
                        deviationMultiplier,
                        library,
                        values,
                        latest: values.length > 0 ? values[ values.length - 1 ] : null,
                        count: closings.length,
                        stableCount: values.length
                    }
                }

                struct['status'] = true

                return { struct }
            }
        },
        computeKeltnerChannel: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, period = 20, library = 'indicatorts' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )
                const raw = ind.keltnerChannel( highs, lows, closings, { period } )
                const upperArr = raw.upper || []
                const middleArr = raw.middle || []
                const lowerArr = raw.lower || []
                const len = Math.max( upperArr.length, middleArr.length, lowerArr.length )
                const values = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        const upper = upperArr[ i ]
                        const middle = middleArr[ i ]
                        const lower = lowerArr[ i ]
                        const allValid = upper !== undefined && middle !== undefined && lower !== undefined && !isNaN( upper ) && !isNaN( middle ) && !isNaN( lower )

                        if( allValid ) {
                            values.push( { upper, middle, lower } )
                        } else {
                            values.push( null )
                        }
                    } )

                const stableValues = values
                    .filter( ( v ) => v !== null )
                const latest = stableValues.length > 0 ? stableValues[ stableValues.length - 1 ] : null

                struct['data'] = {
                    indicator: 'KeltnerChannel',
                    period,
                    library,
                    values,
                    stableValues,
                    latest,
                    count: closings.length,
                    stableCount: stableValues.length
                }
                struct['status'] = true

                return { struct }
            }
        },
        computeDonchianChannel: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsStr, period = 20, library = 'indicatorts' } = userParams
                const closings = parseArray( closingsStr )
                const raw = ind.donchianChannel( closings, { period } )
                const upperArr = raw.upper || []
                const middleArr = raw.middle || []
                const lowerArr = raw.lower || []
                const len = Math.max( upperArr.length, middleArr.length, lowerArr.length )
                const values = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        const upper = upperArr[ i ]
                        const middle = middleArr[ i ]
                        const lower = lowerArr[ i ]
                        const allValid = upper !== undefined && middle !== undefined && lower !== undefined && !isNaN( upper ) && !isNaN( middle ) && !isNaN( lower )

                        if( allValid ) {
                            values.push( { upper, middle, lower } )
                        } else {
                            values.push( null )
                        }
                    } )

                const stableValues = values
                    .filter( ( v ) => v !== null )
                const latest = stableValues.length > 0 ? stableValues[ stableValues.length - 1 ] : null

                struct['data'] = {
                    indicator: 'DonchianChannel',
                    period,
                    library,
                    values,
                    stableValues,
                    latest,
                    count: closings.length,
                    stableCount: stableValues.length
                }
                struct['status'] = true

                return { struct }
            }
        },
        computeAccelerationBands: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, period = 20, width = 4, library = 'trading-signals' } = userParams

                if( library === 'trading-signals' ) {
                    const highs = parseArray( highsStr )
                    const lows = parseArray( lowsStr )
                    const closings = parseArray( closingsStr )
                    const candles = buildCandles( highs, lows, closings )
                    const indicator = new ts.AccelerationBands( period, width )
                    const results = []

                    candles
                        .forEach( ( candle ) => {
                            const val = indicator.add( candle )

                            if( val !== null ) {
                                results.push( { upper: Number( val.upper ), middle: Number( val.middle ), lower: Number( val.lower ) } )
                            } else {
                                results.push( null )
                            }
                        } )

                    const stableResults = results
                        .filter( ( v ) => v !== null )
                    const latest = stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null

                    struct['data'] = {
                        indicator: 'AccelerationBands',
                        period,
                        width,
                        library,
                        values: results,
                        stableValues: stableResults,
                        latest,
                        isStable: indicator.isStable,
                        count: candles.length,
                        stableCount: stableResults.length
                    }
                } else if( library === 'talib' ) {
                    const highs = parseArray( highsStr )
                    const lows = parseArray( lowsStr )
                    const closings = parseArray( closingsStr )
                    const config = {
                        name: 'ACCBANDS',
                        startIdx: 0,
                        endIdx: closings.length - 1,
                        high: highs,
                        low: lows,
                        close: closings,
                        optInTimePeriod: period
                    }
                    const result = await executeTalib( config )
                    const upper = result.result.outRealUpperBand
                    const middle = result.result.outRealMiddleBand
                    const lower = result.result.outRealLowerBand
                    const len = Math.max( upper.length, middle.length, lower.length )
                    const values = []

                    Array.from( { length: len } )
                        .forEach( ( _, i ) => {
                            values.push( { upper: upper[ i ], middle: middle[ i ], lower: lower[ i ] } )
                        } )

                    const latest = values.length > 0 ? values[ values.length - 1 ] : null

                    struct['data'] = {
                        indicator: 'AccelerationBands',
                        period,
                        width,
                        library,
                        values,
                        latest,
                        count: closings.length,
                        stableCount: values.length,
                        begIndex: result.begIndex
                    }
                }

                struct['status'] = true

                return { struct }
            }
        },
        computeIchimokuCloud: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, short: shortPeriod = 9, medium = 26, long: longPeriod = 52, library = 'indicatorts' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )
                const raw = ind.ichimokuCloud( highs, lows, closings, { short: shortPeriod, medium, long: longPeriod } )

                struct['data'] = {
                    indicator: 'IchimokuCloud',
                    short: shortPeriod,
                    medium,
                    long: longPeriod,
                    library,
                    conversion: raw.tenkan || [],
                    base: raw.kijun || [],
                    leadingSpanA: raw.ssa || [],
                    leadingSpanB: raw.ssb || [],
                    laggingSpan: raw.laggingSpan || [],
                    count: closings.length
                }
                struct['status'] = true

                return { struct }
            }
        }
    }
}
