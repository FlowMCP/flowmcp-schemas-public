export const main = {
    namespace: 'unified',
    name: 'UnifiedMomentumAdvanced',
    description: 'Compute advanced momentum indicators from price data. Choose between indicatorts, trading-signals, and talib via the library parameter. Covers APO, PPO, CCI, WilliamsR, CMO, ULTOSC, Aroon, and BOP. All computation is local.',
    version: '4.0.0',
    docs: ['https://github.com/bennycode/trading-signals', 'https://github.com/cinar/indicatorts'],
    tags: ['trading', 'indicators', 'momentum', 'advanced', 'unified'],
    root: 'https://...',
    requiredLibraries: ['trading-signals', 'indicatorts', 'talib'],
    tools: {
        computeAbsolutePriceOscillator: {
            method: 'GET',
            path: '/',
            description: 'Absolute Price Oscillator (APO). Calculates the difference between a fast and slow EMA. Crossing above zero indicates bullish momentum, crossing below zero indicates bearish momentum.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'fastPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(12)'] } },
                { position: { key: 'slowPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(26)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,talib)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute APO(5,10) via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', fastPeriod: 5, slowPeriod: 10, library: 'indicatorts' },
                { _description: 'Compute APO(5,10) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', fastPeriod: 5, slowPeriod: 10, library: 'talib' }
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
        computePercentagePriceOscillator: {
            method: 'GET',
            path: '/',
            description: 'Percentage Price Oscillator (PPO). Shows the percentage difference between two EMAs. Returns PPO line, signal line, and histogram. A breakout is confirmed when PPO is positive.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'fastPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(12)'] } },
                { position: { key: 'slowPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(26)'] } },
                { position: { key: 'signalPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(9)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,talib)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute PPO(5,10,9) via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', fastPeriod: 5, slowPeriod: 10, signalPeriod: 9, library: 'indicatorts' },
                { _description: 'Compute PPO(5,10,9) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', fastPeriod: 5, slowPeriod: 10, signalPeriod: 9, library: 'talib' }
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
        computeCommodityChannelIndex: {
            method: 'GET',
            path: '/',
            description: 'Commodity Channel Index (CCI). Oscillator measuring deviation from statistical mean. Above +100 = overbought, below -100 = oversold. Requires High, Low, Close data.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(20)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute CCI(20) via trading-signals', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 20, library: 'trading-signals' },
                { _description: 'Compute CCI(20) via indicatorts', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 20, library: 'indicatorts' },
                { _description: 'Compute CCI(20) via talib', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 20, library: 'talib' }
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
        computeWilliamsPercentR: {
            method: 'GET',
            path: '/',
            description: 'Williams %R. Momentum oscillator measuring overbought/oversold levels. Ranges -100 to 0: above -20 = overbought, below -80 = oversold. Requires High, Low, Close data.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute Williams%R(14) via trading-signals', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'trading-signals' },
                { _description: 'Compute Williams%R(14) via indicatorts', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'indicatorts' },
                { _description: 'Compute Williams%R(14) via talib', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'talib' }
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
        computeChandeMomentumOscillator: {
            method: 'GET',
            path: '/',
            description: 'Chande Momentum Oscillator (CMO). Measures momentum on both up and down days. Ranges -100 to +100. Above +50 = overbought, below -50 = oversold.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(talib)', 'default(talib)'] } }
            ],
            tests: [
                { _description: 'Compute CMO(14) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'talib' }
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
        computeUltimateOscillator: {
            method: 'GET',
            path: '/',
            description: 'Ultimate Oscillator (ULTOSC). Combines short, medium, and long-term price action into one oscillator. Uses three time periods to reduce false signals. Above 70 = overbought, below 30 = oversold.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period1', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(7)'] } },
                { position: { key: 'period2', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'period3', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(28)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(talib)', 'default(talib)'] } }
            ],
            tests: [
                { _description: 'Compute ULTOSC(3,7,14) via talib', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period1: 3, period2: 7, period3: 14, library: 'talib' }
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
        computeAroon: {
            method: 'GET',
            path: '/',
            description: 'Aroon Indicator. Identifies trend changes and strength. Aroon Up measures uptrend strength, Aroon Down measures downtrend strength. Values range 0-100. Aroon Up above Aroon Down = bullish.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,talib)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute Aroon(14) via indicatorts', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', period: 14, library: 'indicatorts' },
                { _description: 'Compute Aroon(14) via talib', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', period: 14, library: 'talib' }
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
        computeBalanceOfPower: {
            method: 'GET',
            path: '/',
            description: 'Balance of Power (BOP). Measures the strength of buying vs selling pressure. Positive = upward trend, negative = downward trend, zero = balance. Requires Open, High, Low, Close data.',
            parameters: [
                { position: { key: 'opens', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,talib)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute BOP via indicatorts', opens: '100,101,102,102,104,105,105,107,108,108,110,111,111,113,114,114,116,117,117,119', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', library: 'indicatorts' },
                { _description: 'Compute BOP via talib', opens: '100,101,102,102,104,105,105,107,108,108,110,111,111,113,114,114,116,117,117,119', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', library: 'talib' }
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

    function buildCandles( highs, lows, closings ) {
        const len = Math.min( highs.length, lows.length, closings.length )
        const candles = []

        Array.from( { length: len } )
            .forEach( ( _, i ) => {
                candles.push( { high: highs[ i ], low: lows[ i ], close: closings[ i ] } )
            } )

        return candles
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

    function computeHLCStreaming( indicator, candles ) {
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

    return {
        computeAbsolutePriceOscillator: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsStr, fastPeriod = 12, slowPeriod = 26, library = 'indicatorts' } = userParams
                const closings = parseArray( closingsStr )

                let data = {}

                if( library === 'indicatorts' ) {
                    const values = ind.absolutePriceOscillator( closings, { fast: fastPeriod, slow: slowPeriod } )

                    data = {
                        values,
                        latest: values.length > 0 ? values[ values.length - 1 ] : null,
                        count: closings.length,
                        stableCount: values.length
                    }
                } else if( library === 'talib' ) {
                    const config = {
                        name: 'APO',
                        startIdx: 0,
                        endIdx: closings.length - 1,
                        inReal: closings,
                        optInFastPeriod: fastPeriod,
                        optInSlowPeriod: slowPeriod,
                        optInMAType: 0
                    }
                    const result = await executeTalib( config )
                    const outValues = result.result.outReal

                    data = {
                        values: outValues,
                        latest: outValues.length > 0 ? outValues[ outValues.length - 1 ] : null,
                        count: closings.length,
                        stableCount: outValues.length,
                        begIndex: result.begIndex
                    }
                }

                data['indicator'] = 'APO'
                data['fastPeriod'] = fastPeriod
                data['slowPeriod'] = slowPeriod
                data['library'] = library
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computePercentagePriceOscillator: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsStr, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9, library = 'indicatorts' } = userParams
                const closings = parseArray( closingsStr )

                let data = {}

                if( library === 'indicatorts' ) {
                    const result = ind.percentagePriceOscillator( closings, { fast: fastPeriod, slow: slowPeriod, signal: signalPeriod } )
                    const { ppoResult, signal, histogram } = result
                    const len = Math.min( ppoResult.length, signal.length, histogram.length )
                    const combined = []

                    Array.from( { length: len } )
                        .forEach( ( _, i ) => {
                            combined.push( { ppo: ppoResult[ i ], signal: signal[ i ], histogram: histogram[ i ] } )
                        } )

                    data = {
                        ppoLine: ppoResult,
                        signalLine: signal,
                        histogram,
                        values: combined,
                        latest: combined.length > 0 ? combined[ combined.length - 1 ] : null,
                        count: closings.length,
                        stableCount: combined.length
                    }
                } else if( library === 'talib' ) {
                    const config = {
                        name: 'PPO',
                        startIdx: 0,
                        endIdx: closings.length - 1,
                        inReal: closings,
                        optInFastPeriod: fastPeriod,
                        optInSlowPeriod: slowPeriod,
                        optInMAType: 0
                    }
                    const result = await executeTalib( config )
                    const outValues = result.result.outReal

                    data = {
                        values: outValues,
                        latest: outValues.length > 0 ? outValues[ outValues.length - 1 ] : null,
                        count: closings.length,
                        stableCount: outValues.length,
                        begIndex: result.begIndex
                    }
                }

                data['indicator'] = 'PPO'
                data['fastPeriod'] = fastPeriod
                data['slowPeriod'] = slowPeriod
                data['signalPeriod'] = signalPeriod
                data['library'] = library
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeCommodityChannelIndex: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, period = 20, library = 'trading-signals' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )

                let data = {}

                if( library === 'trading-signals' ) {
                    const candles = buildCandles( highs, lows, closings )
                    const indicator = new ts.CCI( period )

                    data = computeHLCStreaming( indicator, candles )
                } else if( library === 'indicatorts' ) {
                    const values = ind.communityChannelIndex( highs, lows, closings, { period } )

                    data = {
                        values,
                        latest: values.length > 0 ? values[ values.length - 1 ] : null,
                        count: closings.length,
                        stableCount: values.length
                    }
                } else if( library === 'talib' ) {
                    const config = {
                        name: 'CCI',
                        startIdx: 0,
                        endIdx: closings.length - 1,
                        high: highs,
                        low: lows,
                        close: closings,
                        optInTimePeriod: period
                    }
                    const result = await executeTalib( config )
                    const outValues = result.result.outReal

                    data = {
                        values: outValues,
                        latest: outValues.length > 0 ? outValues[ outValues.length - 1 ] : null,
                        count: closings.length,
                        stableCount: outValues.length,
                        begIndex: result.begIndex
                    }
                }

                data['indicator'] = 'CCI'
                data['period'] = period
                data['library'] = library
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeWilliamsPercentR: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, period = 14, library = 'trading-signals' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )

                let data = {}

                if( library === 'trading-signals' ) {
                    const candles = buildCandles( highs, lows, closings )
                    const indicator = new ts.WilliamsR( period )

                    data = computeHLCStreaming( indicator, candles )
                } else if( library === 'indicatorts' ) {
                    const values = ind.williamsR( highs, lows, closings, { period } )

                    data = {
                        values,
                        latest: values.length > 0 ? values[ values.length - 1 ] : null,
                        count: closings.length,
                        stableCount: values.length
                    }
                } else if( library === 'talib' ) {
                    const config = {
                        name: 'WILLR',
                        startIdx: 0,
                        endIdx: closings.length - 1,
                        high: highs,
                        low: lows,
                        close: closings,
                        optInTimePeriod: period
                    }
                    const result = await executeTalib( config )
                    const outValues = result.result.outReal

                    data = {
                        values: outValues,
                        latest: outValues.length > 0 ? outValues[ outValues.length - 1 ] : null,
                        count: closings.length,
                        stableCount: outValues.length,
                        begIndex: result.begIndex
                    }
                }

                data['indicator'] = 'WilliamsR'
                data['period'] = period
                data['library'] = library
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeChandeMomentumOscillator: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsStr, period = 14, library = 'talib' } = userParams
                const closings = parseArray( closingsStr )

                const config = {
                    name: 'CMO',
                    startIdx: 0,
                    endIdx: closings.length - 1,
                    inReal: closings,
                    optInTimePeriod: period
                }
                const result = await executeTalib( config )
                const outValues = result.result.outReal

                const data = {
                    values: outValues,
                    latest: outValues.length > 0 ? outValues[ outValues.length - 1 ] : null,
                    count: closings.length,
                    stableCount: outValues.length,
                    begIndex: result.begIndex,
                    indicator: 'CMO',
                    period,
                    library
                }

                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeUltimateOscillator: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, period1 = 7, period2 = 14, period3 = 28, library = 'talib' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )

                const config = {
                    name: 'ULTOSC',
                    startIdx: 0,
                    endIdx: closings.length - 1,
                    high: highs,
                    low: lows,
                    close: closings,
                    optInTimePeriod1: period1,
                    optInTimePeriod2: period2,
                    optInTimePeriod3: period3
                }
                const result = await executeTalib( config )
                const outValues = result.result.outReal

                const data = {
                    values: outValues,
                    latest: outValues.length > 0 ? outValues[ outValues.length - 1 ] : null,
                    count: closings.length,
                    stableCount: outValues.length,
                    begIndex: result.begIndex,
                    indicator: 'ULTOSC',
                    period1,
                    period2,
                    period3,
                    library
                }

                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeAroon: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, period = 14, library = 'indicatorts' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )

                let data = {}

                if( library === 'indicatorts' ) {
                    const result = ind.aroon( highs, lows, { period } )
                    const { up, down } = result
                    const len = Math.min( up.length, down.length )
                    const combined = []

                    Array.from( { length: len } )
                        .forEach( ( _, i ) => {
                            combined.push( { aroonUp: up[ i ], aroonDown: down[ i ] } )
                        } )

                    data = {
                        aroonUp: up,
                        aroonDown: down,
                        values: combined,
                        latest: combined.length > 0 ? combined[ combined.length - 1 ] : null,
                        count: highs.length,
                        stableCount: combined.length
                    }
                } else if( library === 'talib' ) {
                    const config = {
                        name: 'AROON',
                        startIdx: 0,
                        endIdx: highs.length - 1,
                        high: highs,
                        low: lows,
                        optInTimePeriod: period
                    }
                    const result = await executeTalib( config )
                    const { outAroonDown, outAroonUp } = result.result
                    const len = Math.min( outAroonUp.length, outAroonDown.length )
                    const combined = []

                    Array.from( { length: len } )
                        .forEach( ( _, i ) => {
                            combined.push( { aroonUp: outAroonUp[ i ], aroonDown: outAroonDown[ i ] } )
                        } )

                    data = {
                        aroonUp: outAroonUp,
                        aroonDown: outAroonDown,
                        values: combined,
                        latest: combined.length > 0 ? combined[ combined.length - 1 ] : null,
                        count: highs.length,
                        stableCount: combined.length,
                        begIndex: result.begIndex
                    }
                }

                data['indicator'] = 'Aroon'
                data['period'] = period
                data['library'] = library
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeBalanceOfPower: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { opens: opensStr, highs: highsStr, lows: lowsStr, closings: closingsStr, library = 'indicatorts' } = userParams
                const opens = parseArray( opensStr )
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )

                let data = {}

                if( library === 'indicatorts' ) {
                    const values = ind.balanceOfPower( opens, highs, lows, closings )

                    data = {
                        values,
                        latest: values.length > 0 ? values[ values.length - 1 ] : null,
                        count: closings.length,
                        stableCount: values.length
                    }
                } else if( library === 'talib' ) {
                    const config = {
                        name: 'BOP',
                        startIdx: 0,
                        endIdx: closings.length - 1,
                        open: opens,
                        high: highs,
                        low: lows,
                        close: closings
                    }
                    const result = await executeTalib( config )
                    const outValues = result.result.outReal

                    data = {
                        values: outValues,
                        latest: outValues.length > 0 ? outValues[ outValues.length - 1 ] : null,
                        count: closings.length,
                        stableCount: outValues.length,
                        begIndex: result.begIndex
                    }
                }

                data['indicator'] = 'BOP'
                data['library'] = library
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        }
    }
}
