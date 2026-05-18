export const main = {
    namespace: 'tradingsignals',
    name: 'TradingSignalsVolatility',
    description: 'Compute volatility indicators from price data using the trading-signals library. Includes Bollinger Bands, Bollinger Bands Width, Interquartile Range, and Mean Absolute Deviation. All computation is local.',
    version: '4.0.0',
    docs: ['https://github.com/bennycode/trading-signals'],
    tags: ['trading', 'indicators', 'volatility', 'bands'],
    root: 'https://...',
    requiredLibraries: ['trading-signals'],
    tools: {
        computeBollingerBands: {
            method: 'GET',
            path: '/',
            description: 'Bollinger Bands (BB). Volatility bands placed above and below a moving average. Band width expands during volatility, contracts during consolidation. Default: 20-period SMA with 2 standard deviations.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(20)'] } },
                { position: { key: 'deviationMultiplier', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(2)'] } }
            ],
            tests: [
                { _description: 'Compute BB(20,2) for 25 prices', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120,119,121,123,122,124', interval: 20, deviationMultiplier: 2 }
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
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(20)'] } },
                { position: { key: 'deviationMultiplier', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(2)'] } }
            ],
            tests: [
                { _description: 'Compute BBW(20,2)', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120,119,121,123,122,124', interval: 20, deviationMultiplier: 2 }
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
        computeIQR: {
            method: 'GET',
            path: '/',
            description: 'Interquartile Range (IQR). Measures statistical dispersion as the difference between Q3 and Q1. Robust measure of spread that is not affected by outliers.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute IQR(14)', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 14 }
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
        computeMAD: {
            method: 'GET',
            path: '/',
            description: 'Mean Absolute Deviation (MAD). Average of absolute deviations from the mean. Simpler alternative to standard deviation for measuring price dispersion.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } }
            ],
            tests: [
                { _description: 'Compute MAD(14)', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120', interval: 14 }
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
        computeBollingerBands: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 20, deviationMultiplier = 2 } = userParams
                const closings = parseClosings( closingsString )
                const indicator = new ts.BollingerBands( interval, deviationMultiplier )
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
                    interval,
                    deviationMultiplier,
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
        computeBollingerBandsWidth: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 20, deviationMultiplier = 2 } = userParams
                const closings = parseClosings( closingsString )
                const bb = new ts.BollingerBands( interval, deviationMultiplier )
                const indicator = new ts.BollingerBandsWidth( bb )
                const data = computeSeriesIndicator( indicator, closings )

                data['indicator'] = 'BollingerBandsWidth'
                data['interval'] = interval
                data['deviationMultiplier'] = deviationMultiplier
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeIQR: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 14 } = userParams
                const closings = parseClosings( closingsString )
                const indicator = new ts.IQR( interval )
                const data = computeSeriesIndicator( indicator, closings )

                data['indicator'] = 'IQR'
                data['interval'] = interval
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        },
        computeMAD: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, interval = 14 } = userParams
                const closings = parseClosings( closingsString )
                const indicator = new ts.MAD( interval )
                const data = computeSeriesIndicator( indicator, closings )

                data['indicator'] = 'MAD'
                data['interval'] = interval
                struct['data'] = data
                struct['status'] = true

                return { struct }
            }
        }
    }
}
