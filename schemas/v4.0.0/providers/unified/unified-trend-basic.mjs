export const main = {
    namespace: 'unified',
    name: 'UnifiedTrendBasic',
    description: 'Compute basic moving averages from price data. Choose between indicatorts, trading-signals, and talib via the library parameter. Covers SMA, EMA, DEMA, WMA, TEMA, TRIMA, WSMA, and RMA. All computation is local.',
    version: '4.0.0',
    docs: ['https://github.com/bennycode/trading-signals', 'https://github.com/cinar/indicatorts'],
    tags: ['trading', 'indicators', 'trend', 'moving-averages', 'unified'],
    root: 'https://...',
    requiredLibraries: ['trading-signals', 'indicatorts', 'talib'],
    tools: {
        computeSimpleMovingAverage: {
            method: 'GET',
            path: '/',
            description: 'Simple Moving Average (SMA). Smooths price data by averaging closing prices over a specified period. Most basic trend-following indicator.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute SMA(14) via trading-signals', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'trading-signals' },
                { _description: 'Compute SMA(14) via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'indicatorts' },
                { _description: 'Compute SMA(14) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'talib' }
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
        computeExponentialMovingAverage: {
            method: 'GET',
            path: '/',
            description: 'Exponential Moving Average (EMA). Gives more weight to recent prices, reacting faster to price changes than SMA. Widely used for trend identification.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute EMA(14) via trading-signals', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'trading-signals' },
                { _description: 'Compute EMA(14) via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'indicatorts' },
                { _description: 'Compute EMA(14) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'talib' }
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
        computeDoubleExponentialMovingAverage: {
            method: 'GET',
            path: '/',
            description: 'Double Exponential Moving Average (DEMA). Reduces lag by applying EMA twice. Faster response to price changes than standard EMA.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute DEMA(14) via trading-signals', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'trading-signals' },
                { _description: 'Compute DEMA(14) via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'indicatorts' },
                { _description: 'Compute DEMA(14) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'talib' }
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
        computeWeightedMovingAverage: {
            method: 'GET',
            path: '/',
            description: 'Weighted Moving Average (WMA). Assigns linearly increasing weights to recent data points. More responsive than SMA but smoother than EMA.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute WMA(14) via trading-signals', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'trading-signals' },
                { _description: 'Compute WMA(14) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'talib' }
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
        computeTripleExponentialMovingAverage: {
            method: 'GET',
            path: '/',
            description: 'Triple Exponential Moving Average (TEMA). Applies EMA three times to minimize lag. Best for identifying strong trends with minimal noise.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,talib)', 'default(talib)'] } }
            ],
            tests: [
                { _description: 'Compute TEMA(5) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 5, library: 'talib' },
                { _description: 'Compute TEMA(5) via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 5, library: 'indicatorts' }
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
        computeTriangularMovingAverage: {
            method: 'GET',
            path: '/',
            description: 'Triangular Moving Average (TRIMA). Double-smoothed SMA that places most weight on the middle of the period. Very smooth, best for identifying long-term trends.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,talib)', 'default(talib)'] } }
            ],
            tests: [
                { _description: 'Compute TRIMA(5) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 5, library: 'talib' },
                { _description: 'Compute TRIMA(5) via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 5, library: 'indicatorts' }
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
        computeWildersSmoothingMovingAverage: {
            method: 'GET',
            path: '/',
            description: 'Wilders Smoothing Moving Average (WSMA). Smoothing method developed by J. Welles Wilder. Uses a smoothing factor of 1/N, commonly used internally by RSI and ATR.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(trading-signals)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute WSMA(14) via trading-signals', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'trading-signals' }
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
        computeRunningMovingAverage: {
            method: 'GET',
            path: '/',
            description: 'Running Moving Average (RMA). Exponentially weighted moving average with a smoothing factor of 1/N. Also known as Modified Moving Average. Used internally by RSI.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute RMA(14) via trading-signals', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'trading-signals' },
                { _description: 'Compute RMA(14) via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', period: 14, library: 'indicatorts' }
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

    function parseClosings( closingsString ) {
        const closings = closingsString
            .split( ',' )
            .map( ( v ) => parseFloat( v.trim() ) )
            .filter( ( v ) => !isNaN( v ) )

        return closings
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

    const dispatch = {
        computeSimpleMovingAverage: {
            'trading-signals': ( closings, { period } ) => computeWithStreaming( new ts.SMA( period ), closings ),
            'indicatorts': ( closings, { period } ) => computeWithIndicatorts( 'simpleMovingAverage', closings, { period } ),
            'talib': ( closings, { period } ) => computeWithTalib( 'SMA', closings, { optInTimePeriod: period } )
        },
        computeExponentialMovingAverage: {
            'trading-signals': ( closings, { period } ) => computeWithStreaming( new ts.EMA( period ), closings ),
            'indicatorts': ( closings, { period } ) => computeWithIndicatorts( 'exponentialMovingAverage', closings, { period } ),
            'talib': ( closings, { period } ) => computeWithTalib( 'EMA', closings, { optInTimePeriod: period } )
        },
        computeDoubleExponentialMovingAverage: {
            'trading-signals': ( closings, { period } ) => computeWithStreaming( new ts.DEMA( period ), closings ),
            'indicatorts': ( closings, { period } ) => computeWithIndicatorts( 'doubleExponentialMovingAverage', closings, { period } ),
            'talib': ( closings, { period } ) => computeWithTalib( 'DEMA', closings, { optInTimePeriod: period } )
        },
        computeWeightedMovingAverage: {
            'trading-signals': ( closings, { period } ) => computeWithStreaming( new ts.WMA( period ), closings ),
            'talib': ( closings, { period } ) => computeWithTalib( 'WMA', closings, { optInTimePeriod: period } )
        },
        computeTripleExponentialMovingAverage: {
            'indicatorts': ( closings, { period } ) => computeWithIndicatorts( 'tripleExponentialMovingAverage', closings, { period } ),
            'talib': ( closings, { period } ) => computeWithTalib( 'TEMA', closings, { optInTimePeriod: period } )
        },
        computeTriangularMovingAverage: {
            'indicatorts': ( closings, { period } ) => computeWithIndicatorts( 'triangularMovingAverage', closings, { period } ),
            'talib': ( closings, { period } ) => computeWithTalib( 'TRIMA', closings, { optInTimePeriod: period } )
        },
        computeWildersSmoothingMovingAverage: {
            'trading-signals': ( closings, { period } ) => computeWithStreaming( new ts.WSMA( period ), closings )
        },
        computeRunningMovingAverage: {
            'trading-signals': ( closings, { period } ) => computeWithStreaming( new ts.RMA( period ), closings ),
            'indicatorts': ( closings, { period } ) => computeWithIndicatorts( 'rollingMovingAverage', closings, { period } )
        }
    }

    const indicatorMeta = {
        computeSimpleMovingAverage: 'SMA',
        computeExponentialMovingAverage: 'EMA',
        computeDoubleExponentialMovingAverage: 'DEMA',
        computeWeightedMovingAverage: 'WMA',
        computeTripleExponentialMovingAverage: 'TEMA',
        computeTriangularMovingAverage: 'TRIMA',
        computeWildersSmoothingMovingAverage: 'WSMA',
        computeRunningMovingAverage: 'RMA'
    }

    function buildHandler( routeName ) {
        const handler = {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, period = 14, library = 'trading-signals' } = userParams
                const closings = parseClosings( closingsString )
                const compute = dispatch[ routeName ][ library ]
                const data = await compute( closings, { period } )

                data['indicator'] = indicatorMeta[ routeName ]
                data['period'] = period
                data['library'] = library
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        }

        return handler
    }

    return {
        computeSimpleMovingAverage: buildHandler( 'computeSimpleMovingAverage' ),
        computeExponentialMovingAverage: buildHandler( 'computeExponentialMovingAverage' ),
        computeDoubleExponentialMovingAverage: buildHandler( 'computeDoubleExponentialMovingAverage' ),
        computeWeightedMovingAverage: buildHandler( 'computeWeightedMovingAverage' ),
        computeTripleExponentialMovingAverage: buildHandler( 'computeTripleExponentialMovingAverage' ),
        computeTriangularMovingAverage: buildHandler( 'computeTriangularMovingAverage' ),
        computeWildersSmoothingMovingAverage: buildHandler( 'computeWildersSmoothingMovingAverage' ),
        computeRunningMovingAverage: buildHandler( 'computeRunningMovingAverage' )
    }
}
