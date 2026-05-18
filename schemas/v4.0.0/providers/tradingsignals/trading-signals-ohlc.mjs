export const main = {
    namespace: 'tradingsignals',
    name: 'TradingSignalsOHLC',
    description: 'Compute OHLC-based technical indicators using the trading-signals library. These indicators require High/Low/Close candle data. Includes ADX, ATR, CCI, WilliamsR, Stochastic Oscillator, REI, DX, and True Range.',
    version: '4.0.0',
    docs: ['https://github.com/bennycode/trading-signals'],
    tags: ['trading', 'indicators', 'ohlc', 'candle-based'],
    root: 'https://...',
    requiredLibraries: ['trading-signals'],
    tools: {
        computeADX: {
            method: 'GET',
            path: '/',
            description: 'Average Directional Index (ADX). Measures trend strength regardless of direction. Values 0-100: below 20 = weak/no trend, above 25 = strong trend, above 50 = very strong trend. Requires High, Low, Close data.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute ADX(14) for sample candle data', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 14 }
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
        computeATR: {
            method: 'GET',
            path: '/',
            description: 'Average True Range (ATR). Measures market volatility by decomposing the entire range of an asset price. Higher ATR = higher volatility. Used for position sizing and stop-loss placement.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute ATR(14)', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 14 }
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
        computeCCI: {
            method: 'GET',
            path: '/',
            description: 'Commodity Channel Index (CCI). Oscillator measuring deviation from statistical mean. Above +100 = overbought, below -100 = oversold. Works on any asset, not just commodities.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(20)'] } }
            ],
            tests: [
                { _description: 'Compute CCI(20)', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 20 }
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
        computeWilliamsR: {
            method: 'GET',
            path: '/',
            description: 'Williams %R. Momentum oscillator measuring overbought/oversold levels. Ranges -100 to 0: above -20 = overbought, below -80 = oversold. Inverse of Fast Stochastic.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute Williams%R(14)', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 14 }
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
                { position: { key: 'kSmoothing', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(1)'] } },
                { position: { key: 'dPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(3)'] } }
            ],
            tests: [
                { _description: 'Compute Stochastic(14,1,3)', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120' }
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
        computeREI: {
            method: 'GET',
            path: '/',
            description: 'Range Expansion Index (REI). Oscillator by Tom DeMark measuring internal strength of price bars. Above +45 = overbought, below -45 = oversold. Zero-lag design.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(2)'] } }
            ],
            tests: [
                { _description: 'Compute REI(2)', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 2 }
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
        computeDX: {
            method: 'GET',
            path: '/',
            description: 'Directional Index (DX). Measures the strength of the trend without smoothing. The raw building block of ADX. Returns values 0-100 with +DI and -DI components.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute DX(14)', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 14 }
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
        computeTR: {
            method: 'GET',
            path: '/',
            description: 'True Range (TR). Measures the greatest of: current high minus low, absolute high minus previous close, absolute low minus previous close. Building block for ATR.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Compute True Range', highs: '101,103,102,104,106,105,107,109,108,110', lows: '99,101,100,102,104,103,105,107,106,108', closings: '100,102,101,103,105,104,106,108,107,109' }
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

    return {
        computeADX: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, interval = 14 } = userParams
                const candles = buildCandles( parseArray( highsStr ), parseArray( lowsStr ), parseArray( closingsStr ) )
                const indicator = new ts.ADX( interval )
                const data = computeHLCIndicator( indicator, candles )

                data['indicator'] = 'ADX'
                data['interval'] = interval
                data['pdi'] = indicator.pdi !== undefined ? Number( indicator.pdi ) : null
                data['mdi'] = indicator.mdi !== undefined ? Number( indicator.mdi ) : null
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeATR: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, interval = 14 } = userParams
                const candles = buildCandles( parseArray( highsStr ), parseArray( lowsStr ), parseArray( closingsStr ) )
                const indicator = new ts.ATR( interval )
                const data = computeHLCIndicator( indicator, candles )

                data['indicator'] = 'ATR'
                data['interval'] = interval
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeCCI: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, interval = 20 } = userParams
                const candles = buildCandles( parseArray( highsStr ), parseArray( lowsStr ), parseArray( closingsStr ) )
                const indicator = new ts.CCI( interval )
                const data = computeHLCIndicator( indicator, candles )

                data['indicator'] = 'CCI'
                data['interval'] = interval

                const signal = indicator.isStable ? indicator.getSignal() : null

                data['signal'] = signal ? signal.state : null
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeWilliamsR: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, interval = 14 } = userParams
                const candles = buildCandles( parseArray( highsStr ), parseArray( lowsStr ), parseArray( closingsStr ) )
                const indicator = new ts.WilliamsR( interval )
                const data = computeHLCIndicator( indicator, candles )

                data['indicator'] = 'WilliamsR'
                data['interval'] = interval

                const signal = indicator.isStable ? indicator.getSignal() : null

                data['signal'] = signal ? signal.state : null
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeStochasticOscillator: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, kPeriod = 14, kSmoothing = 1, dPeriod = 3 } = userParams
                const candles = buildCandles( parseArray( highsStr ), parseArray( lowsStr ), parseArray( closingsStr ) )
                const indicator = new ts.StochasticOscillator( kPeriod, kSmoothing, dPeriod )
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
                const signal = indicator.isStable ? indicator.getSignal() : null

                struct['data'] = {
                    indicator: 'StochasticOscillator',
                    kPeriod,
                    kSmoothing,
                    dPeriod,
                    values: results,
                    stableValues: stableResults,
                    latest,
                    signal: signal ? signal.state : null,
                    isStable: indicator.isStable,
                    count: candles.length,
                    stableCount: stableResults.length
                }
                struct['status'] = true

                return { struct }
            }
        },
        computeREI: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, interval = 2 } = userParams
                const candles = buildCandles( parseArray( highsStr ), parseArray( lowsStr ), parseArray( closingsStr ) )
                const indicator = new ts.REI( interval )
                const data = computeHLCIndicator( indicator, candles )

                data['indicator'] = 'REI'
                data['interval'] = interval

                const signal = indicator.isStable ? indicator.getSignal() : null

                data['signal'] = signal ? signal.state : null
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeDX: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, interval = 14 } = userParams
                const candles = buildCandles( parseArray( highsStr ), parseArray( lowsStr ), parseArray( closingsStr ) )
                const indicator = new ts.DX( interval )
                const data = computeHLCIndicator( indicator, candles )

                data['indicator'] = 'DX'
                data['interval'] = interval
                data['pdi'] = indicator.pdi !== undefined ? Number( indicator.pdi ) : null
                data['mdi'] = indicator.mdi !== undefined ? Number( indicator.mdi ) : null
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeTR: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr } = userParams
                const candles = buildCandles( parseArray( highsStr ), parseArray( lowsStr ), parseArray( closingsStr ) )
                const indicator = new ts.TR()
                const data = computeHLCIndicator( indicator, candles )

                data['indicator'] = 'TR'
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        }
    }
}
