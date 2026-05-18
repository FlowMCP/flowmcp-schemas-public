export const main = {
    namespace: 'unified',
    name: 'UnifiedVolume',
    description: 'Compute volume-based indicators from price and volume data. Choose between indicatorts, trading-signals, and talib via the library parameter. Covers OBV, VWAP, AD, ADOSC, CMF, MFI, VWMA, and VPT. All computation is local.',
    version: '4.0.0',
    docs: ['https://github.com/bennycode/trading-signals', 'https://github.com/cinar/indicatorts'],
    tags: ['trading', 'indicators', 'volume', 'unified'],
    root: 'https://...',
    requiredLibraries: ['trading-signals', 'indicatorts', 'talib'],
    tools: {
        computeOnBalanceVolume: {
            method: 'GET',
            path: '/',
            description: 'On-Balance Volume (OBV). Cumulative volume indicator that adds volume on up days and subtracts on down days. Rising OBV confirms uptrend, falling OBV confirms downtrend.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'volumes', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'opens', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals,talib)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute OBV via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1000,1200,900,1100,1300', library: 'indicatorts' },
                { _description: 'Compute OBV via trading-signals', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1000,1200,900,1100,1300', opens: '100,101,102,102,104,105,105,107,108,108,110,111,111,113,114,114,116,117,117,119', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', library: 'trading-signals' },
                { _description: 'Compute OBV via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1000,1200,900,1100,1300', library: 'talib' }
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
        computeVolumeWeightedAveragePrice: {
            method: 'GET',
            path: '/',
            description: 'Volume Weighted Average Price (VWAP). Calculates the average price weighted by volume. Key institutional benchmark — price above VWAP is bullish, below is bearish.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'volumes', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'optional()', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,trading-signals)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute VWAP via indicatorts', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1000,1200,900,1100,1300', period: 14, library: 'indicatorts' },
                { _description: 'Compute VWAP via trading-signals', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1000,1200,900,1100,1300', library: 'trading-signals' }
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
        computeAccumulationDistribution: {
            method: 'GET',
            path: '/',
            description: 'Accumulation/Distribution (AD). Cumulative indicator using volume and price to assess whether a stock is being accumulated or distributed.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'volumes', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,talib)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute AD via indicatorts', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1000,1200,900,1100,1300', library: 'indicatorts' },
                { _description: 'Compute AD via talib', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1000,1200,900,1100,1300', library: 'talib' }
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
        computeAccumulationDistributionOscillator: {
            method: 'GET',
            path: '/',
            description: 'Accumulation/Distribution Oscillator (ADOSC). Measures the momentum of the AD line using fast and slow EMA periods. Divergence from price signals potential reversals.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'volumes', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'fastPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(3)'] } },
                { position: { key: 'slowPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(10)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(talib)', 'default(talib)'] } }
            ],
            tests: [
                { _description: 'Compute ADOSC via talib', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1000,1200,900,1100,1300', fastPeriod: 3, slowPeriod: 10, library: 'talib' }
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
        computeChaikinMoneyFlow: {
            method: 'GET',
            path: '/',
            description: 'Chaikin Money Flow (CMF). Measures the amount of money flow volume over a given period. Positive CMF indicates buying pressure, negative indicates selling pressure.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'volumes', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(20)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute CMF(20) via indicatorts', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1000,1200,900,1100,1300', period: 20, library: 'indicatorts' }
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
        computeMoneyFlowIndex: {
            method: 'GET',
            path: '/',
            description: 'Money Flow Index (MFI). Oscillator that uses both price and volume to measure buying and selling pressure. Similar to RSI but volume-weighted. Range 0-100.',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'volumes', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts,talib)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute MFI(14) via indicatorts', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1000,1200,900,1100,1300', period: 14, library: 'indicatorts' },
                { _description: 'Compute MFI(14) via talib', highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121', lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1000,1200,900,1100,1300', period: 14, library: 'talib' }
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
        computeVolumeWeightedMovingAverage: {
            method: 'GET',
            path: '/',
            description: 'Volume Weighted Moving Average (VWMA). Moving average that gives more weight to periods with higher volume. Areas with higher volume have greater influence on the average.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'volumes', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute VWMA(14) via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1000,1200,900,1100,1300', period: 14, library: 'indicatorts' }
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
        computeVolumePriceTrend: {
            method: 'GET',
            path: '/',
            description: 'Volume Price Trend (VPT). Correlates volume with price change direction and magnitude. Similar to OBV but accounts for the percentage of price change.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'volumes', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(indicatorts)', 'default(indicatorts)'] } }
            ],
            tests: [
                { _description: 'Compute VPT via indicatorts', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1000,1200,900,1100,1300', library: 'indicatorts' }
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

    return {
        computeOnBalanceVolume: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsStr, volumes: volumesStr, opens: opensStr, highs: highsStr, lows: lowsStr, library = 'indicatorts' } = userParams
                const closings = parseArray( closingsStr )
                const volumes = parseArray( volumesStr )

                let data

                if( library === 'trading-signals' ) {
                    const opens = parseArray( opensStr )
                    const highs = parseArray( highsStr )
                    const lows = parseArray( lowsStr )
                    const len = Math.min( opens.length, highs.length, lows.length, closings.length, volumes.length )
                    const indicator = new ts.OBV( 14 )
                    const results = []

                    Array.from( { length: len } )
                        .forEach( ( _, i ) => {
                            const candle = { open: opens[ i ], high: highs[ i ], low: lows[ i ], close: closings[ i ], volume: volumes[ i ] }
                            const val = indicator.add( candle )
                            results.push( val !== null && val !== undefined ? Number( val ) : null )
                        } )

                    const stableResults = results
                        .filter( ( v ) => v !== null )

                    data = {
                        indicator: 'OBV',
                        library,
                        values: results,
                        stableValues: stableResults,
                        latest: stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null,
                        isStable: indicator.isStable,
                        count: len,
                        stableCount: stableResults.length
                    }
                } else if( library === 'indicatorts' ) {
                    const values = ind.onBalanceVolume( closings, volumes )

                    data = {
                        indicator: 'OBV',
                        library,
                        values,
                        latest: values.length > 0 ? values[ values.length - 1 ] : null,
                        count: closings.length,
                        stableCount: values.length
                    }
                } else if( library === 'talib' ) {
                    const config = {
                        name: 'OBV',
                        startIdx: 0,
                        endIdx: closings.length - 1,
                        inReal: closings,
                        volume: volumes
                    }
                    const result = await executeTalib( config )
                    const outValues = result.result.outReal

                    data = {
                        indicator: 'OBV',
                        library,
                        values: outValues,
                        latest: outValues.length > 0 ? outValues[ outValues.length - 1 ] : null,
                        count: closings.length,
                        stableCount: outValues.length,
                        begIndex: result.begIndex
                    }
                }

                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeVolumeWeightedAveragePrice: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, volumes: volumesStr, period = 14, library = 'indicatorts' } = userParams

                let data

                if( library === 'trading-signals' ) {
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

                    data = {
                        indicator: 'VWAP',
                        library,
                        values: results,
                        stableValues: stableResults,
                        latest: stableResults.length > 0 ? stableResults[ stableResults.length - 1 ] : null,
                        isStable: indicator.isStable,
                        count: len,
                        stableCount: stableResults.length
                    }
                } else if( library === 'indicatorts' ) {
                    const closings = parseArray( closingsStr )
                    const volumes = parseArray( volumesStr )
                    const values = ind.volumeWeightedAveragePrice( closings, volumes, { period } )

                    data = {
                        indicator: 'VWAP',
                        library,
                        period,
                        values,
                        latest: values.length > 0 ? values[ values.length - 1 ] : null,
                        count: closings.length,
                        stableCount: values.length
                    }
                }

                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeAccumulationDistribution: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, volumes: volumesStr, library = 'indicatorts' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )
                const volumes = parseArray( volumesStr )

                let data

                if( library === 'indicatorts' ) {
                    const values = ind.accumulationDistribution( highs, lows, closings, volumes )

                    data = {
                        indicator: 'AD',
                        library,
                        values,
                        latest: values.length > 0 ? values[ values.length - 1 ] : null,
                        count: closings.length,
                        stableCount: values.length
                    }
                } else if( library === 'talib' ) {
                    const config = {
                        name: 'AD',
                        startIdx: 0,
                        endIdx: closings.length - 1,
                        high: highs,
                        low: lows,
                        close: closings,
                        volume: volumes
                    }
                    const result = await executeTalib( config )
                    const outValues = result.result.outReal

                    data = {
                        indicator: 'AD',
                        library,
                        values: outValues,
                        latest: outValues.length > 0 ? outValues[ outValues.length - 1 ] : null,
                        count: closings.length,
                        stableCount: outValues.length,
                        begIndex: result.begIndex
                    }
                }

                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeAccumulationDistributionOscillator: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, volumes: volumesStr, fastPeriod = 3, slowPeriod = 10, library = 'talib' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )
                const volumes = parseArray( volumesStr )

                const config = {
                    name: 'ADOSC',
                    startIdx: 0,
                    endIdx: closings.length - 1,
                    high: highs,
                    low: lows,
                    close: closings,
                    volume: volumes,
                    optInFastPeriod: fastPeriod,
                    optInSlowPeriod: slowPeriod
                }
                const result = await executeTalib( config )
                const outValues = result.result.outReal

                struct['data'] = {
                    indicator: 'ADOSC',
                    library,
                    fastPeriod,
                    slowPeriod,
                    values: outValues,
                    latest: outValues.length > 0 ? outValues[ outValues.length - 1 ] : null,
                    count: closings.length,
                    stableCount: outValues.length,
                    begIndex: result.begIndex
                }
                struct['status'] = true

                return { struct }
            }
        },
        computeChaikinMoneyFlow: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, volumes: volumesStr, period = 20, library = 'indicatorts' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )
                const volumes = parseArray( volumesStr )
                const values = ind.chaikinMoneyFlow( highs, lows, closings, volumes, { period } )

                struct['data'] = {
                    indicator: 'CMF',
                    library,
                    period,
                    values,
                    latest: values.length > 0 ? values[ values.length - 1 ] : null,
                    count: closings.length,
                    stableCount: values.length
                }
                struct['status'] = true

                return { struct }
            }
        },
        computeMoneyFlowIndex: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { highs: highsStr, lows: lowsStr, closings: closingsStr, volumes: volumesStr, period = 14, library = 'indicatorts' } = userParams
                const highs = parseArray( highsStr )
                const lows = parseArray( lowsStr )
                const closings = parseArray( closingsStr )
                const volumes = parseArray( volumesStr )

                let data

                if( library === 'indicatorts' ) {
                    const values = ind.moneyFlowIndex( highs, lows, closings, volumes, { period } )

                    data = {
                        indicator: 'MFI',
                        library,
                        period,
                        values,
                        latest: values.length > 0 ? values[ values.length - 1 ] : null,
                        count: closings.length,
                        stableCount: values.length
                    }
                } else if( library === 'talib' ) {
                    const config = {
                        name: 'MFI',
                        startIdx: 0,
                        endIdx: closings.length - 1,
                        high: highs,
                        low: lows,
                        close: closings,
                        volume: volumes,
                        optInTimePeriod: period
                    }
                    const result = await executeTalib( config )
                    const outValues = result.result.outReal

                    data = {
                        indicator: 'MFI',
                        library,
                        period,
                        values: outValues,
                        latest: outValues.length > 0 ? outValues[ outValues.length - 1 ] : null,
                        count: closings.length,
                        stableCount: outValues.length,
                        begIndex: result.begIndex
                    }
                }

                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeVolumeWeightedMovingAverage: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsStr, volumes: volumesStr, period = 14, library = 'indicatorts' } = userParams
                const closings = parseArray( closingsStr )
                const volumes = parseArray( volumesStr )
                const values = ind.volumeWeightedMovingAverage( closings, volumes, { period } )

                struct['data'] = {
                    indicator: 'VWMA',
                    library,
                    period,
                    values,
                    latest: values.length > 0 ? values[ values.length - 1 ] : null,
                    count: closings.length,
                    stableCount: values.length
                }
                struct['status'] = true

                return { struct }
            }
        },
        computeVolumePriceTrend: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsStr, volumes: volumesStr, library = 'indicatorts' } = userParams
                const closings = parseArray( closingsStr )
                const volumes = parseArray( volumesStr )
                const values = ind.volumePriceTrend( closings, volumes )

                struct['data'] = {
                    indicator: 'VPT',
                    library,
                    values,
                    latest: values.length > 0 ? values[ values.length - 1 ] : null,
                    count: closings.length,
                    stableCount: values.length
                }
                struct['status'] = true

                return { struct }
            }
        }
    }
}
