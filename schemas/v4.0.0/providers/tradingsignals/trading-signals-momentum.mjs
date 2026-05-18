export const main = {
    namespace: 'tradingsignals',
    name: 'TradingSignalsMomentum',
    description: 'Compute momentum indicators from price data using the trading-signals library. Includes RSI, MACD, Stochastic RSI, Momentum, Rate of Change, Center of Gravity, and Tom DeMark Sequential. All computation is local.',
    version: '4.0.0',
    docs: ['https://github.com/bennycode/trading-signals'],
    tags: ['trading', 'indicators', 'momentum', 'oscillators'],
    root: 'https://...',
    requiredLibraries: ['trading-signals'],
    tools: {
        computeRSI: {
            method: 'GET',
            path: '/',
            description: 'Relative Strength Index (RSI). Momentum oscillator measuring speed and magnitude of price changes. Values 0-100: below 30 = oversold, above 70 = overbought.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute RSI(14) for sample data', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64', interval: 14 }
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
        computeMACD: {
            method: 'GET',
            path: '/',
            description: 'Moving Average Convergence Divergence (MACD). Trend-following momentum indicator showing relationship between two EMAs. Returns MACD line, signal line, and histogram.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'shortInterval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(12)'] } },
                { position: { key: 'longInterval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(2)', 'default(26)'] } },
                { position: { key: 'signalInterval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(9)'] } }
            ],
            tests: [
                { _description: 'Compute MACD(12,26,9) for sample data', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64,46.21,46.25,45.71,46.45,45.78,45.35,44.03,44.18,44.22,44.57,43.42,42.66,43.13' }
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
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute StochasticRSI(14)', closings: '44,44.34,44.09,43.61,44.33,44.83,45.10,45.42,45.84,46.08,45.89,46.03,45.61,46.28,46.28,46.00,46.03,46.41,46.22,45.64,46.21,46.25,45.71,46.45,45.78,45.35,44.03,44.18,44.22,44.57,43.42,42.66,43.13', interval: 14 }
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
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(10)'] } }
            ],
            tests: [
                { _description: 'Compute Momentum(10)', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 10 }
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
        computeROC: {
            method: 'GET',
            path: '/',
            description: 'Rate of Change (ROC). Percentage change between current price and price N periods ago. Oscillates around zero — positive = uptrend, negative = downtrend.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(12)'] } }
            ],
            tests: [
                { _description: 'Compute ROC(12)', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 12 }
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
        computeCG: {
            method: 'GET',
            path: '/',
            description: 'Center of Gravity (CG). Oscillator by John Ehlers that identifies turning points with minimal lag. Uses signal line crossover for trade signals.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(10)'] } },
                { position: { key: 'signalInterval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(3)'] } }
            ],
            tests: [
                { _description: 'Compute CG(10,3)', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 10, signalInterval: 3 }
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
        computeTDS: {
            method: 'GET',
            path: '/',
            description: 'Tom DeMark Sequential (TDS). Counts consecutive closes higher/lower than 4 bars ago. Setup counts of 9 or 13 signal potential trend exhaustion.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Compute TDS for 20 prices', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120' }
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

    function parseClosings( closingsString ) {
        const closings = closingsString
            .split( ',' )
            .map( ( v ) => parseFloat( v.trim() ) )
            .filter( ( v ) => !isNaN( v ) )

        return closings
    }

    function computeSeriesIndicator( indicator, closings ) {
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

    return {
        computeRSI: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 14 } = userParams
                const closings = parseClosings( closingsString )
                const indicator = new ts.RSI( interval )
                const data = computeSeriesIndicator( indicator, closings )

                data['indicator'] = 'RSI'
                data['interval'] = interval

                const signal = indicator.isStable ? indicator.getSignal() : null

                data['signal'] = signal ? signal.state : null
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeMACD: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, shortInterval = 12, longInterval = 26, signalInterval = 9 } = userParams
                const closings = parseClosings( closingsString )
                const indicator = new ts.MACD(
                    new ts.EMA( shortInterval ),
                    new ts.EMA( longInterval ),
                    new ts.EMA( signalInterval )
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
                const signal = indicator.isStable ? indicator.getSignal() : null

                struct['data'] = {
                    indicator: 'MACD',
                    shortInterval,
                    longInterval,
                    signalInterval,
                    values: results,
                    stableValues: stableResults,
                    latest,
                    signal: signal ? signal.state : null,
                    isStable: indicator.isStable,
                    count: closings.length,
                    stableCount: stableResults.length
                }
                struct['status'] = true

                return { struct }
            }
        },
        computeStochasticRSI: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 14 } = userParams
                const closings = parseClosings( closingsString )
                const indicator = new ts.StochasticRSI( interval )
                const data = computeSeriesIndicator( indicator, closings )

                data['indicator'] = 'StochasticRSI'
                data['interval'] = interval

                const signal = indicator.isStable ? indicator.getSignal() : null

                data['signal'] = signal ? signal.state : null
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeMomentum: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 10 } = userParams
                const closings = parseClosings( closingsString )
                const indicator = new ts.MOM( interval )
                const data = computeSeriesIndicator( indicator, closings )

                data['indicator'] = 'MOM'
                data['interval'] = interval

                const signal = indicator.isStable ? indicator.getSignal() : null

                data['signal'] = signal ? signal.state : null
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeROC: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 12 } = userParams
                const closings = parseClosings( closingsString )
                const indicator = new ts.ROC( interval )
                const data = computeSeriesIndicator( indicator, closings )

                data['indicator'] = 'ROC'
                data['interval'] = interval

                const signal = indicator.isStable ? indicator.getSignal() : null

                data['signal'] = signal ? signal.state : null
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeCG: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 10, signalInterval = 3 } = userParams
                const closings = parseClosings( closingsString )
                const indicator = new ts.CG( interval, signalInterval )
                const data = computeSeriesIndicator( indicator, closings )

                data['indicator'] = 'CG'
                data['interval'] = interval
                data['signalInterval'] = signalInterval
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeTDS: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString } = userParams
                const closings = parseClosings( closingsString )
                const indicator = new ts.TDS()
                const data = computeSeriesIndicator( indicator, closings )

                data['indicator'] = 'TDS'

                const signal = indicator.isStable ? indicator.getSignal() : null

                data['signal'] = signal ? signal.state : null
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        }
    }
}
