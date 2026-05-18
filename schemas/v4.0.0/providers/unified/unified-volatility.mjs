export const main = {
    namespace: 'unified',
    name: 'UnifiedVolatility',
    description: 'Compute volatility indicators from price data. Choose between indicatorts, trading-signals, and talib via the library parameter. Covers ATR, TR, NATR, IQR, MAD, Ulcer Index, Mass Index, and Chandelier Exit. All computation is local.',
    version: '4.0.0',
    docs: ['https://github.com/bennycode/trading-signals', 'https://github.com/cinar/indicatorts'],
    tags: ['trading', 'indicators', 'volatility', 'unified'],
    root: 'https://...',
    requiredLibraries: ['trading-signals', 'indicatorts', 'talib'],
    tools: {
        computeAverageTrueRange: {
            method: 'GET',
            path: '/',
            description: 'Average True Range (ATR). Measures market volatility by decomposing the entire range of an asset price. Higher ATR = higher volatility. Used for position sizing and stop-loss placement.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute ATR(14) via trading-signals', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'trading-signals' },
                { _description: 'Compute ATR(14) via indicatorts', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'indicatorts' },
                { _description: 'Compute ATR(14) via talib', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'talib' }
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
        computeTrueRange: {
            method: 'GET',
            path: '/',
            description: 'True Range (TR). Measures the greatest of: current high minus low, absolute high minus previous close, absolute low minus previous close. Building block for ATR.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute TR via trading-signals', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', library: 'trading-signals' },
                { _description: 'Compute TR via indicatorts', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', library: 'indicatorts' },
                { _description: 'Compute TR via talib', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', library: 'talib' }
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
        computeNormalizedAverageTrueRange: {
            method: 'GET',
            path: '/',
            description: 'Normalized Average True Range (NATR). ATR expressed as a percentage of the closing price. Allows volatility comparison across different price levels and assets.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(talib)', 'default(talib)'] } }
            ],
            tests: [
                { _description: 'Compute NATR(14) via talib', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'talib' }
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
        computeInterquartileRange: {
            method: 'GET',
            path: '/',
            description: 'Interquartile Range (IQR). Measures statistical dispersion as the difference between Q3 and Q1. Robust measure of spread that is not affected by outliers.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(trading-signals)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute IQR(14) via trading-signals', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'trading-signals' }
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
        computeMeanAbsoluteDeviation: {
            method: 'GET',
            path: '/',
            description: 'Mean Absolute Deviation (MAD). Average of absolute deviations from the mean. Simpler alternative to standard deviation for measuring price dispersion.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(trading-signals)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute MAD(14) via trading-signals', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'trading-signals' }
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
        computeUlcerIndex: {
            method: 'GET',
            path: '/',
            description: 'Ulcer Index. Measures downside volatility by tracking the depth and duration of price drawdowns from recent highs. Lower values indicate less downside risk.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute UlcerIndex(14) via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'indicatorts' }
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
        computeMassIndex: {
            method: 'GET',
            path: '/',
            description: 'Mass Index. Identifies trend reversals by measuring the narrowing and widening of the range between high and low prices. A bulge above 27 followed by drop below 26.5 signals reversal.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'emaPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(9)'] } },
                { position: { key: 'miPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(25)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute MassIndex(9,25) via indicatorts', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', emaPeriod: 9, miPeriod: 25, library: 'indicatorts' }
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
        computeChandelierExit: {
            method: 'GET',
            path: '/',
            description: 'Chandelier Exit. Trailing stop-loss indicator based on ATR. Sets exit points below the highest high (long) or above the lowest low (short) by a multiple of ATR. Used for trend-following exits.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(22)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute ChandelierExit(5) via indicatorts', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 5, library: 'indicatorts' }
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

    function computeHLCIndicator( indicator, candles ) {
        const results = []

        candles
            .forEach( ( candle ) => {
                const val = indicator.add( candle )
                results.push( val !== null && val !== undefined ? Number( val ) : null )
            } )

        const stableResults = results
            .filter( ( v ) => v !== null )

        return {
            values: results,
            stableValues: stableResults,
            latest: stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null,
            isStable: indicator.isStable,
            count: candles.length,
            stableCount: stableResults.length
        }
    }

    function computeWithStreaming( indicator, closings ) {
        const results = []

        closings
            .forEach( ( price ) => {
                const val = indicator.add( price )
                results.push( val !== null && val !== undefined ? Number( val ) : null )
            } )

        const stableResults = results
            .filter( ( v ) => v !== null )

        return {
            values: results,
            stableValues: stableResults,
            latest: stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null,
            isStable: indicator.isStable,
            count: closings.length,
            stableCount: stableResults.length
        }
    }

    function computeWithIndicatorts( fn, args, params ) {
        const values = ind[ fn ]( ...args, params )

        return {
            values,
            latest: values.length > 0 ? values[ values.length - 1 ] : null,
            count: values.length,
            stableCount: values.length
        }
    }

    async function computeHLCWithTalib( name, highs, lows, closings, optInputs ) {
        const config = {
            name,
            startIdx: 0,
            endIdx: closings.length - 1,
            high: highs,
            low: lows,
            close: closings,
            ...optInputs
        }
        const result = await executeTalib( config )
        const outValues = result.result.outReal

        return {
            values: outValues,
            latest: outValues.length > 0 ? outValues[ outValues.length - 1 ] : null,
            count: closings.length,
            stableCount: outValues.length,
            begIndex: result.begIndex
        }
    }

    return {
        computeAverageTrueRange: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, period = 14, library = 'trading-signals' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )
                let data

                if( library === 'trading-signals' ) {
                    const candles = buildCandles( highs, lows, closings )
                    data = computeHLCIndicator( new ts.ATR( period ), candles )
                } else if( library === 'indicatorts' ) {
                    const raw = ind.averageTrueRange( highs, lows, closings, { period } )
                    const values = raw.atrLine || raw['atrLine'] || []

                    data = {
                        values,
                        latest: values.length > 0 ? values[ values.length - 1 ] : null,
                        count: closings.length,
                        stableCount: values.length
                    }
                } else if( library === 'talib' ) {
                    data = await computeHLCWithTalib( 'ATR', highs, lows, closings, { optInTimePeriod: period } )
                }

                data['indicator'] = 'ATR'
                data['period'] = period
                data['library'] = library
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeTrueRange: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, library = 'trading-signals' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )
                let data

                if( library === 'trading-signals' ) {
                    const candles = buildCandles( highs, lows, closings )
                    data = computeHLCIndicator( new ts.TR(), candles )
                } else if( library === 'indicatorts' ) {
                    data = computeWithIndicatorts( 'trueRange', [ highs, lows, closings ], undefined )
                } else if( library === 'talib' ) {
                    data = await computeHLCWithTalib( 'TRANGE', highs, lows, closings, {} )
                }

                data['indicator'] = 'TR'
                data['library'] = library
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeNormalizedAverageTrueRange: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, period = 14, library = 'talib' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )
                const data = await computeHLCWithTalib( 'NATR', highs, lows, closings, { optInTimePeriod: period } )

                data['indicator'] = 'NATR'
                data['period'] = period
                data['library'] = library
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeInterquartileRange: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsStr, period = 14, library = 'trading-signals' } = userParams
                const closings = parseArray( closingsStr )
                const data = computeWithStreaming( new ts.IQR( period ), closings )

                data['indicator'] = 'IQR'
                data['period'] = period
                data['library'] = library
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeMeanAbsoluteDeviation: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsStr, period = 14, library = 'trading-signals' } = userParams
                const closings = parseArray( closingsStr )
                const data = computeWithStreaming( new ts.MAD( period ), closings )

                data['indicator'] = 'MAD'
                data['period'] = period
                data['library'] = library
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeUlcerIndex: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsStr, period = 14, library = 'indicatorts' } = userParams
                const closings = parseArray( closingsStr )
                const data = computeWithIndicatorts( 'ulcerIndex', [ closings ], { period } )

                data['indicator'] = 'UlcerIndex'
                data['period'] = period
                data['library'] = library
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeMassIndex: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, emaPeriod = 9, miPeriod = 25, library = 'indicatorts' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const values = ind.massIndex( highs, lows, { emaPeriod, miPeriod } )

                struct['data'] = {
                    indicator: 'MassIndex',
                    emaPeriod,
                    miPeriod,
                    library,
                    values,
                    latest: values.length > 0 ? values[ values.length - 1 ] : null,
                    count: highs.length,
                    stableCount: values.length
                }
                struct['status'] = true

                return { struct }
            }
        },
        computeChandelierExit: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, period = 22, library = 'indicatorts' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )
                const raw = ind.chandelierExit( highs, lows, closings, { period } )
                const exitLong = raw.long || raw['long'] || []
                const exitShort = raw.short || raw['short'] || []
                const len = Math.max( exitLong.length, exitShort.length )
                const values = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        values.push( { exitLong: exitLong[ i ], exitShort: exitShort[ i ] } )
                    } )

                const latest = values.length > 0 ? values[ values.length - 1 ] : null

                struct['data'] = {
                    indicator: 'ChandelierExit',
                    period,
                    library,
                    values,
                    latest,
                    count: closings.length,
                    stableCount: values.length
                }
                struct['status'] = true

                return { struct }
            }
        }
    }
}
