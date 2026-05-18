export const main = {
    namespace: 'unified',
    name: 'UnifiedMomentumBasic',
    description: 'Compute basic momentum oscillators from price data. Choose between indicatorts, trading-signals, and talib via the library parameter. Covers RSI, MACD, Stochastic, StochRSI, MOM, ROC, CG, and TRIX. All computation is local.',
    version: '4.0.0',
    docs: ['https://github.com/bennycode/trading-signals', 'https://github.com/cinar/indicatorts'],
    tags: ['trading', 'indicators', 'momentum', 'oscillators', 'unified'],
    root: 'https://...',
    requiredLibraries: ['trading-signals', 'indicatorts', 'talib'],
    tools: {
        computeRelativeStrengthIndex: {
            method: 'GET',
            path: '/',
            description: 'Relative Strength Index (RSI). Momentum oscillator measuring speed and magnitude of price changes. Values 0-100: below 30 = oversold, above 70 = overbought.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute RSI(14) via trading-signals', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', period: 14, library: 'trading-signals' },
                { _description: 'Compute RSI(14) via indicatorts', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', period: 14, library: 'indicatorts' },
                { _description: 'Compute RSI(14) via talib', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', period: 14, library: 'talib' }
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
        computeMovingAverageConvergenceDivergence: {
            method: 'GET',
            path: '/',
            description: 'Moving Average Convergence Divergence (MACD). Trend-following momentum indicator showing relationship between two EMAs. Returns MACD line, signal line, and histogram.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'fastPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(12)'] } },
                { position: { key: 'slowPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(2)', 'default(26)'] } },
                { position: { key: 'signalPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(9)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute MACD(12,26,9) via trading-signals', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', library: 'trading-signals' },
                { _description: 'Compute MACD(12,26,9) via indicatorts', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', library: 'indicatorts' },
                { _description: 'Compute MACD(12,26,9) via talib', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', library: 'talib' }
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
        computeStochasticOscillator: {
            method: 'GET',
            path: '/',
            description: 'Stochastic Oscillator. Compares closing price to price range over N periods. Returns %K (fast) and %D (slow) lines. Above 80 = overbought, below 20 = oversold.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'kPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'dPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(3)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute Stochastic(14,3) via trading-signals', highs: '44.5,44.84,44.59,44.11,44.83,45.33,45.60,45.92,46.34,46.58,46.39,46.53,46.11,46.78,46.78,46.50,46.53,46.91,46.72,46.14', lows: '43.5,43.84,43.59,43.11,43.83,44.33,44.60,44.92,45.34,45.58,45.39,45.53,45.11,45.78,45.78,45.50,45.53,45.91,45.72,45.14', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', library: 'trading-signals' },
                { _description: 'Compute Stochastic(14,3) via indicatorts', highs: '44.5,44.84,44.59,44.11,44.83,45.33,45.60,45.92,46.34,46.58,46.39,46.53,46.11,46.78,46.78,46.50,46.53,46.91,46.72,46.14', lows: '43.5,43.84,43.59,43.11,43.83,44.33,44.60,44.92,45.34,45.58,45.39,45.53,45.11,45.78,45.78,45.50,45.53,45.91,45.72,45.14', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', library: 'indicatorts' },
                { _description: 'Compute Stochastic(14,3) via talib', highs: '44.5,44.84,44.59,44.11,44.83,45.33,45.60,45.92,46.34,46.58,46.39,46.53,46.11,46.78,46.78,46.50,46.53,46.91,46.72,46.14', lows: '43.5,43.84,43.59,43.11,43.83,44.33,44.60,44.92,45.34,45.58,45.39,45.53,45.11,45.78,45.78,45.50,45.53,45.91,45.72,45.14', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', library: 'talib' }
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
        computeStochasticRSI: {
            method: 'GET',
            path: '/',
            description: 'Stochastic RSI. Applies the Stochastic oscillator formula to RSI values instead of price. More sensitive than regular RSI, ranges 0-100.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute StochasticRSI(14) via trading-signals', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', period: 14, library: 'trading-signals' },
                { _description: 'Compute StochasticRSI(14) via talib', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', period: 14, library: 'talib' }
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
        computeMomentum: {
            method: 'GET',
            path: '/',
            description: 'Momentum (MOM). Measures the rate of price change by comparing current price to price N periods ago. Positive = upward momentum, negative = downward.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(10)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute Momentum(10) via trading-signals', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', period: 10, library: 'trading-signals' },
                { _description: 'Compute Momentum(10) via talib', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', period: 10, library: 'talib' }
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
        computeRateOfChange: {
            method: 'GET',
            path: '/',
            description: 'Rate of Change (ROC). Percentage change between current price and price N periods ago. Oscillates around zero -- positive = uptrend, negative = downtrend.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(12)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute ROC(12) via trading-signals', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', period: 12, library: 'trading-signals' },
                { _description: 'Compute ROC(12) via indicatorts', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', period: 12, library: 'indicatorts' },
                { _description: 'Compute ROC(12) via talib', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', period: 12, library: 'talib' }
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
        computeCenterOfGravity: {
            method: 'GET',
            path: '/',
            description: 'Center of Gravity (CG). Oscillator by John Ehlers that identifies turning points with minimal lag. Uses signal line crossover for trade signals.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(10)'] } },
                { position: { key: 'signalPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(3)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(trading-signals)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute CG(10,3) via trading-signals', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', period: 10, signalPeriod: 3, library: 'trading-signals' }
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
        computeTripleExponentialAverage: {
            method: 'GET',
            path: '/',
            description: 'Triple Exponential Average (TRIX). Oscillator showing percentage rate of change of a triple-smoothed EMA. Filters insignificant price movements. Oscillates around zero.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,talib)', 'default(talib)'] } }
            ],
            tests: [
                { _description: 'Compute TRIX(5) via indicatorts', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', period: 5, library: 'indicatorts' },
                { _description: 'Compute TRIX(5) via talib', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', period: 5, library: 'talib' }
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

    function computeWithIndicatorts( fn, closings, params ) {
        const values = ind[ fn ]( closings, params )

        return {
            values,
            latest: values.length > 0 ? values[ values.length - 1 ] : null,
            count: closings.length,
            stableCount: values.length
        }
    }

    async function computeWithTalib( name, closings, optInputs ) {
        const config = {
            name,
            startIdx: 0,
            endIdx: closings.length - 1,
            inReal: closings,
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

    const dispatch = {
        computeRelativeStrengthIndex: {
            'trading-signals': ( { closings, period } ) => {
                const data = computeWithStreaming( new ts.RSI( period ), closings )

                return data
            },
            'indicatorts': ( { closings, period } ) => {
                const data = computeWithIndicatorts( 'relativeStrengthIndex', closings, { period } )

                return data
            },
            'talib': async ( { closings, period } ) => {
                const data = await computeWithTalib( 'RSI', closings, { optInTimePeriod: period } )

                return data
            }
        },
        computeMovingAverageConvergenceDivergence: {
            'trading-signals': ( { closings, fastPeriod, slowPeriod, signalPeriod } ) => {
                const indicator = new ts.MACD(
                    new ts.EMA( fastPeriod ),
                    new ts.EMA( slowPeriod ),
                    new ts.EMA( signalPeriod )
                )
                const results = []

                closings
                    .forEach( ( price ) => {
                        const val = indicator.add( price )

                        if( val !== null ) {
                            results.push( {
                                macd: Number( val.macd ),
                                signal: Number( val.signal ),
                                histogram: Number( val.histogram )
                            } )
                        } else {
                            results.push( null )
                        }
                    } )

                const stableResults = results
                    .filter( ( v ) => v !== null )
                const latest = stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null

                return {
                    values: results,
                    stableValues: stableResults,
                    latest,
                    isStable: indicator.isStable,
                    count: closings.length,
                    stableCount: stableResults.length
                }
            },
            'indicatorts': ( { closings, fastPeriod, slowPeriod, signalPeriod } ) => {
                const result = ind.movingAverageConvergenceDivergence( closings, {
                    fast: fastPeriod,
                    slow: slowPeriod,
                    signal: signalPeriod
                } )
                const { macdLine, signalLine } = result
                const len = Math.min( macdLine.length, signalLine.length )
                const values = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        values.push( {
                            macd: macdLine[ i ],
                            signal: signalLine[ i ],
                            histogram: macdLine[ i ] - signalLine[ i ]
                        } )
                    } )

                const stableValues = values
                    .filter( ( v ) => v !== null && !isNaN( v.macd ) )
                const latest = stableValues.length > 0 ? stableValues[ stableValues.length - 1 ] : null

                return {
                    values,
                    stableValues,
                    latest,
                    count: closings.length,
                    stableCount: stableValues.length
                }
            },
            'talib': async ( { closings, fastPeriod, slowPeriod, signalPeriod } ) => {
                const config = {
                    name: 'MACD',
                    startIdx: 0,
                    endIdx: closings.length - 1,
                    inReal: closings,
                    optInFastPeriod: fastPeriod,
                    optInSlowPeriod: slowPeriod,
                    optInSignalPeriod: signalPeriod
                }
                const result = await executeTalib( config )
                const { outMACD, outMACDSignal, outMACDHist } = result.result
                const len = outMACD.length
                const values = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        values.push( {
                            macd: outMACD[ i ],
                            signal: outMACDSignal[ i ],
                            histogram: outMACDHist[ i ]
                        } )
                    } )

                const latest = values.length > 0 ? values[ values.length - 1 ] : null

                return {
                    values,
                    stableValues: values,
                    latest,
                    count: closings.length,
                    stableCount: values.length,
                    begIndex: result.begIndex
                }
            }
        },
        computeStochasticOscillator: {
            'trading-signals': ( { highs, lows, closings, kPeriod, dPeriod } ) => {
                const candles = buildCandles( highs, lows, closings )
                const indicator = new ts.StochasticOscillator( kPeriod, 1, dPeriod )
                const results = []

                candles
                    .forEach( ( candle ) => {
                        const val = indicator.add( candle )

                        if( val !== null ) {
                            results.push( { stochK: Number( val.stochK ), stochD: Number( val.stochD ) } )
                        } else {
                            results.push( null )
                        }
                    } )

                const stableResults = results
                    .filter( ( v ) => v !== null )
                const latest = stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null

                return {
                    values: results,
                    stableValues: stableResults,
                    latest,
                    isStable: indicator.isStable,
                    count: candles.length,
                    stableCount: stableResults.length
                }
            },
            'indicatorts': ( { highs, lows, closings, kPeriod, dPeriod } ) => {
                const result = ind.stochasticOscillator( highs, lows, closings, { kPeriod, dPeriod } )
                const { k, d } = result
                const len = Math.min( k.length, d.length )
                const values = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        values.push( { stochK: k[ i ], stochD: d[ i ] } )
                    } )

                const stableValues = values
                    .filter( ( v ) => v !== null && !isNaN( v.stochK ) )
                const latest = stableValues.length > 0 ? stableValues[ stableValues.length - 1 ] : null

                return {
                    values,
                    stableValues,
                    latest,
                    count: closings.length,
                    stableCount: stableValues.length
                }
            },
            'talib': async ( { highs, lows, closings, kPeriod, dPeriod } ) => {
                const config = {
                    name: 'STOCH',
                    startIdx: 0,
                    endIdx: closings.length - 1,
                    high: highs,
                    low: lows,
                    close: closings,
                    optInFastK_Period: kPeriod,
                    optInSlowK_Period: 3,
                    optInSlowK_MAType: 0,
                    optInSlowD_Period: dPeriod,
                    optInSlowD_MAType: 0
                }
                const result = await executeTalib( config )
                const { outSlowK, outSlowD } = result.result
                const len = outSlowK.length
                const values = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        values.push( { stochK: outSlowK[ i ], stochD: outSlowD[ i ] } )
                    } )

                const latest = values.length > 0 ? values[ values.length - 1 ] : null

                return {
                    values,
                    stableValues: values,
                    latest,
                    count: closings.length,
                    stableCount: values.length,
                    begIndex: result.begIndex
                }
            }
        },
        computeStochasticRSI: {
            'trading-signals': ( { closings, period } ) => {
                const data = computeWithStreaming( new ts.StochasticRSI( period ), closings )

                return data
            },
            'talib': async ( { closings, period } ) => {
                const config = {
                    name: 'STOCHRSI',
                    startIdx: 0,
                    endIdx: closings.length - 1,
                    inReal: closings,
                    optInTimePeriod: period,
                    optInFastK_Period: 5,
                    optInFastD_Period: 3,
                    optInFastD_MAType: 0
                }
                const result = await executeTalib( config )
                const { outFastK, outFastD } = result.result
                const len = outFastK.length
                const values = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        values.push( { fastK: outFastK[ i ], fastD: outFastD[ i ] } )
                    } )

                const latest = values.length > 0 ? values[ values.length - 1 ] : null

                return {
                    values,
                    stableValues: values,
                    latest,
                    count: closings.length,
                    stableCount: values.length,
                    begIndex: result.begIndex
                }
            }
        },
        computeMomentum: {
            'trading-signals': ( { closings, period } ) => {
                const data = computeWithStreaming( new ts.MOM( period ), closings )

                return data
            },
            'talib': async ( { closings, period } ) => {
                const data = await computeWithTalib( 'MOM', closings, { optInTimePeriod: period } )

                return data
            }
        },
        computeRateOfChange: {
            'trading-signals': ( { closings, period } ) => {
                const data = computeWithStreaming( new ts.ROC( period ), closings )

                return data
            },
            'indicatorts': ( { closings, period } ) => {
                const data = computeWithIndicatorts( 'priceRateOfChange', closings, { period } )

                return data
            },
            'talib': async ( { closings, period } ) => {
                const data = await computeWithTalib( 'ROC', closings, { optInTimePeriod: period } )

                return data
            }
        },
        computeCenterOfGravity: {
            'trading-signals': ( { closings, period, signalPeriod } ) => {
                const data = computeWithStreaming( new ts.CG( period, signalPeriod ), closings )

                return data
            }
        },
        computeTripleExponentialAverage: {
            'indicatorts': ( { closings, period } ) => {
                const data = computeWithIndicatorts( 'tripleExponentialAverage', closings, { period } )

                return data
            },
            'talib': async ( { closings, period } ) => {
                const data = await computeWithTalib( 'TRIX', closings, { optInTimePeriod: period } )

                return data
            }
        }
    }

    const indicatorMeta = {
        computeRelativeStrengthIndex: 'RSI',
        computeMovingAverageConvergenceDivergence: 'MACD',
        computeStochasticOscillator: 'StochasticOscillator',
        computeStochasticRSI: 'StochasticRSI',
        computeMomentum: 'MOM',
        computeRateOfChange: 'ROC',
        computeCenterOfGravity: 'CG',
        computeTripleExponentialAverage: 'TRIX'
    }

    function buildHandler( routeName ) {
        const handler = {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const {
                    closings: closingsString,
                    highs: highsString,
                    lows: lowsString,
                    period = 14,
                    fastPeriod = 12,
                    slowPeriod = 26,
                    signalPeriod = 9,
                    kPeriod = 14,
                    dPeriod = 3,
                    library = 'trading-signals'
                } = userParams
                const closings = parseArray( closingsString )
                const highs = highsString ? parseArray( highsString ) : []
                const lows = lowsString ? parseArray( lowsString ) : []
                const compute = dispatch[ routeName ][ library ]
                const data = await compute( {
                    closings,
                    highs,
                    lows,
                    period,
                    fastPeriod,
                    slowPeriod,
                    signalPeriod,
                    kPeriod,
                    dPeriod
                } )

                data['indicator'] = indicatorMeta[ routeName ]
                data['library'] = library
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        }

        return handler
    }

    return {
        computeRelativeStrengthIndex: buildHandler( 'computeRelativeStrengthIndex' ),
        computeMovingAverageConvergenceDivergence: buildHandler( 'computeMovingAverageConvergenceDivergence' ),
        computeStochasticOscillator: buildHandler( 'computeStochasticOscillator' ),
        computeStochasticRSI: buildHandler( 'computeStochasticRSI' ),
        computeMomentum: buildHandler( 'computeMomentum' ),
        computeRateOfChange: buildHandler( 'computeRateOfChange' ),
        computeCenterOfGravity: buildHandler( 'computeCenterOfGravity' ),
        computeTripleExponentialAverage: buildHandler( 'computeTripleExponentialAverage' )
    }
}
