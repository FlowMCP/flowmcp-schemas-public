export const main = {
    namespace: 'tradingsignals',
    name: 'TradingSignalsVolume',
    description: 'Compute volume and candle-based indicators using the trading-signals library. Includes OBV, VWAP, Acceleration Bands, Awesome Oscillator, Accelerator Oscillator, Parabolic SAR, and ZigZag. All computation is local.',
    version: '4.0.0',
    docs: ['https://github.com/bennycode/trading-signals'],
    tags: ['trading', 'indicators', 'volume', 'candle-based'],
    root: 'https://...',
    requiredLibraries: ['trading-signals'],
    tools: {
        computeOBV: {
            method: 'GET',
            path: '/',
            description: 'On-Balance Volume (OBV). Cumulative volume indicator that adds volume on up days and subtracts on down days. Rising OBV confirms uptrend, falling OBV confirms downtrend. Requires OHLCV data.',
            parameters: [
                { position: { key: 'opens', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'volumes', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute OBV for sample OHLCV data', opens: '100,101,102,102,104,105,105,107,108,108,110,111,111,113,114', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800', interval: 14 }
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
        computeVWAP: {
            method: 'GET',
            path: '/',
            description: 'Volume Weighted Average Price (VWAP). Calculates the average price weighted by volume. Key institutional benchmark — price above VWAP = bullish, below = bearish. Requires HLC + Volume data.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'volumes', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Compute VWAP for sample HLC+Volume data', highs: '101,103,102,104,106,105,107,109,108,110', lows: '99,101,100,102,104,103,105,107,106,108', closings: '100,102,101,103,105,104,106,108,107,109', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200' }
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
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(20)'] } },
                { position: { key: 'width', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(4)'] } }
            ],
            tests: [
                { _description: 'Compute Acceleration Bands(20,4)', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121,123', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119,121', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120,122', interval: 20, width: 4 }
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
        computeAO: {
            method: 'GET',
            path: '/',
            description: 'Awesome Oscillator (AO). Measures market momentum using the difference between 5-period and 34-period simple moving averages of the midpoint (H+L)/2. Positive = bullish momentum.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'shortInterval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(5)'] } },
                { position: { key: 'longInterval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(2)', 'default(34)'] } }
            ],
            tests: [
                { _description: 'Compute AO(5,34) for 40 candles', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121,123,122,124,126,125,127,129,128,130,132,131,133,135,134,136,138,137,139,141,140', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119,121,120,122,124,123,125,127,126,128,130,129,131,133,132,134,136,135,137,139,138' }
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
        computeAC: {
            method: 'GET',
            path: '/',
            description: 'Accelerator Oscillator (AC). Measures the acceleration/deceleration of the current driving force (Awesome Oscillator). Leading indicator — changes before AO does.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'shortAO', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(5)'] } },
                { position: { key: 'longAO', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(2)', 'default(34)'] } },
                { position: { key: 'signalInterval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(5)'] } }
            ],
            tests: [
                { _description: 'Compute AC(5,34,5) for 40 candles', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121,123,122,124,126,125,127,129,128,130,132,131,133,135,134,136,138,137,139,141,140', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119,121,120,122,124,123,125,127,126,128,130,129,131,133,132,134,136,135,137,139,138' }
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
        computePSAR: {
            method: 'GET',
            path: '/',
            description: 'Parabolic SAR (Stop and Reverse). Trend-following indicator that provides potential entry and exit points. Dots below price = uptrend, dots above = downtrend.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'accelerationStep', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(0.02)'] } },
                { position: { key: 'accelerationMax', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(0.2)'] } }
            ],
            tests: [
                { _description: 'Compute PSAR(0.02,0.2)', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119' }
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
        computeZigZag: {
            method: 'GET',
            path: '/',
            description: 'ZigZag. Filters out noise by only plotting price changes larger than a specified deviation percentage. Connects significant swing highs and lows. Useful for wave analysis.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'deviation', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(5)'] } }
            ],
            tests: [
                { _description: 'Compute ZigZag(5%)', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', deviation: 5 }
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

    return {
        computeOBV: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { opens: opensStr, highs: highsStr, lows: lowsStr, closings: closingsStr, volumes: volumesStr, interval = 14 } = userParams
                const opens = parseArray( opensStr )
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )
                const volumes = parseArray( volumesStr )
                const len = Math.min( opens.length, highs.length, lows.length, closings.length, volumes.length )
                const indicator = new ts.OBV( interval )
                const results = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        const candle = { open: opens[ i ], high: highs[ i ], low: lows[ i ], close: closings[ i ], volume: volumes[ i ] }
                        const val = indicator.add( candle )
                        results.push( val !== null && val !== undefined ? Number( val ) : null )
                    } )

                const stableResults = results
                    .filter( ( v ) => v !== null )
                const signal = indicator.isStable ? indicator.getSignal() : null

                struct['data'] = {
                    indicator: 'OBV',
                    interval,
                    values: results,
                    stableValues: stableResults,
                    latest: stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null,
                    signal: signal ? signal.state : null,
                    isStable: indicator.isStable,
                    count: len,
                    stableCount: stableResults.length
                }
                struct['status'] = true

                return { struct }
            }
        },
        computeVWAP: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, volumes: volumesStr } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )
                const volumes = parseArray( volumesStr )
                const len = Math.min( highs.length, lows.length, closings.length, volumes.length )
                const indicator = new ts.VWAP()
                const results = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        const candle = { high: highs[ i ], low: lows[ i ], close: closings[ i ], volume: volumes[ i ] }
                        const val = indicator.add( candle )
                        results.push( val !== null && val !== undefined ? Number( val ) : null )
                    } )

                const stableResults = results
                    .filter( ( v ) => v !== null )

                struct['data'] = {
                    indicator: 'VWAP',
                    values: results,
                    stableValues: stableResults,
                    latest: stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null,
                    isStable: indicator.isStable,
                    count: len,
                    stableCount: stableResults.length
                }
                struct['status'] = true

                return { struct }
            }
        },
        computeAccelerationBands: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, interval = 20, width = 4 } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )
                const len = Math.min( highs.length, lows.length, closings.length )
                const indicator = new ts.AccelerationBands( interval, width )
                const results = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        const candle = { high: highs[ i ], low: lows[ i ], close: closings[ i ] }
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
                    interval,
                    width,
                    values: results,
                    stableValues: stableResults,
                    latest,
                    isStable: indicator.isStable,
                    count: len,
                    stableCount: stableResults.length
                }
                struct['status'] = true

                return { struct }
            }
        },
        computeAO: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, shortInterval = 5, longInterval = 34 } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const len = Math.min( highs.length, lows.length )
                const indicator = new ts.AO( shortInterval, longInterval )
                const results = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        const candle = { high: highs[ i ], low: lows[ i ] }
                        const val = indicator.add( candle )
                        results.push( val !== null && val !== undefined ? Number( val ) : null )
                    } )

                const stableResults = results
                    .filter( ( v ) => v !== null )
                const signal = indicator.isStable ? indicator.getSignal() : null

                struct['data'] = {
                    indicator: 'AO',
                    shortInterval,
                    longInterval,
                    values: results,
                    stableValues: stableResults,
                    latest: stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null,
                    signal: signal ? signal.state : null,
                    isStable: indicator.isStable,
                    count: len,
                    stableCount: stableResults.length
                }
                struct['status'] = true

                return { struct }
            }
        },
        computeAC: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, shortAO = 5, longAO = 34, signalInterval = 5 } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const len = Math.min( highs.length, lows.length )
                const indicator = new ts.AC( shortAO, longAO, signalInterval )
                const results = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        const candle = { high: highs[ i ], low: lows[ i ] }
                        const val = indicator.add( candle )
                        results.push( val !== null && val !== undefined ? Number( val ) : null )
                    } )

                const stableResults = results
                    .filter( ( v ) => v !== null )
                const signal = indicator.isStable ? indicator.getSignal() : null

                struct['data'] = {
                    indicator: 'AC',
                    shortAO,
                    longAO,
                    signalInterval,
                    values: results,
                    stableValues: stableResults,
                    latest: stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null,
                    signal: signal ? signal.state : null,
                    isStable: indicator.isStable,
                    count: len,
                    stableCount: stableResults.length
                }
                struct['status'] = true

                return { struct }
            }
        },
        computePSAR: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, accelerationStep = 0.02, accelerationMax = 0.2 } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const len = Math.min( highs.length, lows.length )
                const indicator = new ts.PSAR( { accelerationStep, accelerationMax } )
                const results = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        const candle = { high: highs[ i ], low: lows[ i ] }
                        const val = indicator.add( candle )
                        results.push( val !== null && val !== undefined ? Number( val ) : null )
                    } )

                const stableResults = results
                    .filter( ( v ) => v !== null )

                struct['data'] = {
                    indicator: 'PSAR',
                    accelerationStep,
                    accelerationMax,
                    values: results,
                    stableValues: stableResults,
                    latest: stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null,
                    isStable: indicator.isStable,
                    count: len,
                    stableCount: stableResults.length
                }
                struct['status'] = true

                return { struct }
            }
        },
        computeZigZag: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, deviation = 5 } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const len = Math.min( highs.length, lows.length )
                const indicator = new ts.ZigZag( { deviation } )
                const results = []

                Array.from( { length: len } )
                    .forEach( ( _, i ) => {
                        const candle = { high: highs[ i ], low: lows[ i ] }
                        const val = indicator.add( candle )
                        results.push( val !== null && val !== undefined ? Number( val ) : null )
                    } )

                const stableResults = results
                    .filter( ( v ) => v !== null )

                struct['data'] = {
                    indicator: 'ZigZag',
                    deviation,
                    values: results,
                    stableValues: stableResults,
                    latest: stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null,
                    isStable: indicator.isStable,
                    count: len,
                    stableCount: stableResults.length
                }
                struct['status'] = true

                return { struct }
            }
        }
    }
}
