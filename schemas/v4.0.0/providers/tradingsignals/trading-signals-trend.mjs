export const main = {
    namespace: 'tradingsignals',
    name: 'TradingSignalsTrend',
    description: 'Compute trend-following indicators from price data using the trading-signals library. Includes SMA, EMA, DEMA, WMA, WSMA, RMA, DMA, and Linear Regression. All computation is local — no external API calls.',
    version: '4.0.0',
    docs: ['https://github.com/bennycode/trading-signals'],
    tags: ['trading', 'indicators', 'trend', 'moving-averages'],
    root: 'https://...',
    requiredLibraries: ['trading-signals'],
    tools: {
        computeSMA: {
            method: 'GET',
            path: '/',
            description: 'Simple Moving Average (SMA). Calculates the unweighted mean of the last N prices. Use for smoothing price data and identifying trend direction.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute SMA(14) for 20 price points', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 14 }
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
        computeEMA: {
            method: 'GET',
            path: '/',
            description: 'Exponential Moving Average (EMA). Gives more weight to recent prices, reacts faster to price changes than SMA. Foundation for MACD and other indicators.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute EMA(12) for 20 price points', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 12 }
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
        computeDEMA: {
            method: 'GET',
            path: '/',
            description: 'Double Exponential Moving Average (DEMA). Reduces lag compared to standard EMA by applying EMA twice. Better at tracking fast-moving trends.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute DEMA(14) for 20 price points', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 14 }
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
        computeWMA: {
            method: 'GET',
            path: '/',
            description: 'Weighted Moving Average (WMA). Assigns linearly increasing weights to more recent data points. Balances responsiveness between SMA and EMA.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute WMA(10) for 20 price points', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 10 }
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
        computeWSMA: {
            method: 'GET',
            path: '/',
            description: 'Wilder Smoothed Moving Average (WSMA). Also known as Modified Moving Average. Uses Wilders smoothing method, common in ATR and RSI calculations.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute WSMA(14) for 20 price points', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 14 }
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
        computeRMA: {
            method: 'GET',
            path: '/',
            description: 'Running Moving Average (RMA). Exponentially weighted moving average used internally by RSI. Lower smoothing factor than EMA for the same period.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute RMA(14) for 20 price points', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 14 }
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
        computeDMA: {
            method: 'GET',
            path: '/',
            description: 'Double Moving Average (DMA). Computes short-term and long-term moving averages simultaneously. Crossover signals indicate trend changes.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'shortInterval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(10)'] } },
                { position: { key: 'longInterval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(2)', 'default(21)'] } }
            ],
            tests: [
                { _description: 'Compute DMA(10,21) crossover', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120,119,121', shortInterval: 10, longInterval: 21 }
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
        computeLinearRegression: {
            method: 'GET',
            path: '/',
            description: 'Linear Regression. Fits a straight line to price data using least squares. Returns prediction, slope, and intercept for trend analysis and price forecasting.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(2)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute Linear Regression(14)', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 14 }
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

    function computeSeriesIndicator( IndicatorClass, closings, interval ) {
        const indicator = new IndicatorClass( interval )
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
        computeSMA: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 14 } = userParams
                const closings = parseClosings( closingsString )
                const data = computeSeriesIndicator( ts.SMA, closings, interval )

                data['indicator'] = 'SMA'
                data['interval'] = interval
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeEMA: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 14 } = userParams
                const closings = parseClosings( closingsString )
                const data = computeSeriesIndicator( ts.EMA, closings, interval )

                data['indicator'] = 'EMA'
                data['interval'] = interval
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeDEMA: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 14 } = userParams
                const closings = parseClosings( closingsString )
                const data = computeSeriesIndicator( ts.DEMA, closings, interval )

                data['indicator'] = 'DEMA'
                data['interval'] = interval
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeWMA: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 14 } = userParams
                const closings = parseClosings( closingsString )
                const data = computeSeriesIndicator( ts.WMA, closings, interval )

                data['indicator'] = 'WMA'
                data['interval'] = interval
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeWSMA: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 14 } = userParams
                const closings = parseClosings( closingsString )
                const data = computeSeriesIndicator( ts.WSMA, closings, interval )

                data['indicator'] = 'WSMA'
                data['interval'] = interval
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeRMA: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 14 } = userParams
                const closings = parseClosings( closingsString )
                const data = computeSeriesIndicator( ts.RMA, closings, interval )

                data['indicator'] = 'RMA'
                data['interval'] = interval
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeDMA: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, shortInterval = 10, longInterval = 21 } = userParams
                const closings = parseClosings( closingsString )
                const indicator = new ts.DMA( shortInterval, longInterval )
                const results = []

                closings
                    .forEach( ( price ) => {
                        const val = indicator.add( price )
                        results.push( val !== null ? { short: Number( val.short ), long: Number( val.long ) } : null )
                    } )

                const stableResults = results
                    .filter( ( v ) => v !== null )
                const latest = stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null

                struct['data'] = {
                    indicator: 'DMA',
                    shortInterval,
                    longInterval,
                    values: results,
                    stableValues: stableResults,
                    latest,
                    isStable: indicator.isStable,
                    count: closings.length,
                    stableCount: stableResults.length
                }
                struct['status'] = true

                return { struct }
            }
        },
        computeLinearRegression: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 14 } = userParams
                const closings = parseClosings( closingsString )
                const indicator = new ts.LinearRegression( interval )
                const results = []

                closings
                    .forEach( ( price ) => {
                        const val = indicator.add( price )

                        if( val !== null ) {
                            results.push( {
                                prediction: Number( val.prediction ),
                                slope: Number( val.slope ),
                                intercept: Number( val.intercept )
                            } )
                        } else {
                            results.push( null )
                        }
                    } )

                const stableResults = results
                    .filter( ( v ) => v !== null )
                const latest = stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null

                struct['data'] = {
                    indicator: 'LinearRegression',
                    interval,
                    values: results,
                    stableValues: stableResults,
                    latest,
                    isStable: indicator.isStable,
                    count: closings.length,
                    stableCount: stableResults.length
                }
                struct['status'] = true

                return { struct }
            }
        }
    }
}
