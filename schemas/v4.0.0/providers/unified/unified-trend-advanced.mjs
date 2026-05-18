export const main = {
    namespace: 'unified',
    name: 'UnifiedTrendAdvanced',
    description: 'Compute advanced trend indicators from price data. Choose between trading-signals and talib via the library parameter. Covers DMA, KAMA, MAMA, T3, Linear Regression, Linear Regression Slope, Angle, and Intercept. All computation is local.',
    version: '4.0.0',
    docs: ['https://github.com/bennycode/trading-signals', 'https://github.com/cinar/indicatorts'],
    tags: ['trading', 'indicators', 'trend', 'advanced', 'unified'],
    root: 'https://...',
    requiredLibraries: ['trading-signals', 'indicatorts', 'talib'],
    tools: {
        computeDisplacedMovingAverage: {
            method: 'GET',
            path: '/',
            description: 'Displaced Moving Average (DMA). Uses two SMAs with different periods to identify trend direction and crossovers. Returns compound values with short and long moving average components.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'shortInterval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(10)'] } },
                { position: { key: 'longInterval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(21)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(trading-signals)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute DMA(5,10) via trading-signals', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120,119,121,123,122,124,126,125,127,129,128,130,132,131,133,135,134,136,138,137,139,141,140,142,144,143,145,147,146,148,150', shortInterval: 5, longInterval: 10, library: 'trading-signals' }
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
        computeKaufmanAdaptiveMovingAverage: {
            method: 'GET',
            path: '/',
            description: 'Kaufman Adaptive Moving Average (KAMA). Adapts to market volatility by adjusting its smoothing constant. Moves slowly in ranging markets and quickly in trending markets.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(10)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(talib)', 'default(talib)'] } }
            ],
            tests: [
                { _description: 'Compute KAMA(10) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120,119,121,123,122,124,126,125,127,129,128,130,132,131,133,135,134,136,138,137,139,141,140,142,144,143,145,147,146,148,150', period: 10, library: 'talib' }
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
        computeMESAAdaptiveMovingAverage: {
            method: 'GET',
            path: '/',
            description: 'MESA Adaptive Moving Average (MAMA). Uses Hilbert Transform to adapt to dominant market cycles. Returns two outputs: MAMA (leading) and FAMA (following). Crossovers signal trend changes.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'fastLimit', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['default(0.5)'] } },
                { position: { key: 'slowLimit', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['default(0.05)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(talib)', 'default(talib)'] } }
            ],
            tests: [
                { _description: 'Compute MAMA via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120,119,121,123,122,124,126,125,127,129,128,130,132,131,133,135,134,136,138,137,139,141,140,142,144,143,145,147,146,148,150', fastLimit: 0.5, slowLimit: 0.05, library: 'talib' }
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
        computeT3: {
            method: 'GET',
            path: '/',
            description: 'T3 Moving Average. Triple-smoothed EMA with a volume factor for reduced lag. Produces ultra-smooth trend line. Volume factor controls the balance between lag reduction and smoothness.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(5)'] } },
                { position: { key: 'vFactor', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['default(0.7)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(talib)', 'default(talib)'] } }
            ],
            tests: [
                { _description: 'Compute T3(5,0.7) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120,119,121,123,122,124,126,125,127,129,128,130,132,131,133,135,134,136,138,137,139,141,140,142,144,143,145,147,146,148,150', period: 5, vFactor: 0.7, library: 'talib' }
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
            description: 'Linear Regression. Fits a straight line to closing prices over a period using least squares. Returns the predicted value at the end of the regression line. Useful for identifying trend direction and strength.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(trading-signals,talib)', 'default(trading-signals)'] } }
            ],
            tests: [
                { _description: 'Compute LinearRegression(5) via trading-signals', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120,119,121,123,122,124,126,125,127,129,128,130,132,131,133,135,134,136,138,137,139,141,140,142,144,143,145,147,146,148,150', period: 5, library: 'trading-signals' },
                { _description: 'Compute LinearRegression(5) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120,119,121,123,122,124,126,125,127,129,128,130,132,131,133,135,134,136,138,137,139,141,140,142,144,143,145,147,146,148,150', period: 5, library: 'talib' }
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
        computeLinearRegressionSlope: {
            method: 'GET',
            path: '/',
            description: 'Linear Regression Slope. Returns the slope of the linear regression line over a period. Positive slope indicates uptrend, negative indicates downtrend. Magnitude shows trend strength.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(talib)', 'default(talib)'] } }
            ],
            tests: [
                { _description: 'Compute LinearRegressionSlope(5) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120,119,121,123,122,124,126,125,127,129,128,130,132,131,133,135,134,136,138,137,139,141,140,142,144,143,145,147,146,148,150', period: 5, library: 'talib' }
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
        computeLinearRegressionAngle: {
            method: 'GET',
            path: '/',
            description: 'Linear Regression Angle. Returns the angle of the linear regression line in degrees. Values near 45 indicate strong trends, values near 0 indicate flat markets.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(talib)', 'default(talib)'] } }
            ],
            tests: [
                { _description: 'Compute LinearRegressionAngle(5) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120,119,121,123,122,124,126,125,127,129,128,130,132,131,133,135,134,136,138,137,139,141,140,142,144,143,145,147,146,148,150', period: 5, library: 'talib' }
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
        computeLinearRegressionIntercept: {
            method: 'GET',
            path: '/',
            description: 'Linear Regression Intercept. Returns the y-intercept of the linear regression line. Combined with slope, fully defines the regression line equation for trend analysis.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)', 'default(14)'] } },
                { position: { key: 'library', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(talib)', 'default(talib)'] } }
            ],
            tests: [
                { _description: 'Compute LinearRegressionIntercept(5) via talib', closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120,119,121,123,122,124,126,125,127,129,128,130,132,131,133,135,134,136,138,137,139,141,140,142,144,143,145,147,146,148,150', period: 5, library: 'talib' }
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

    function computeCompoundStreaming( indicator, closings, keys ) {
        const results = []

        closings
            .forEach( ( price ) => {
                const val = indicator.add( price )

                if( val !== null && val !== undefined ) {
                    const entry = {}

                    keys
                        .forEach( ( k ) => {
                            entry[ k ] = Number( val[ k ] )
                        } )

                    results.push( entry )
                } else {
                    results.push( null )
                }
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

    async function computeMAMAWithTalib( closings, { fastLimit, slowLimit } ) {
        const config = {
            name: 'MAMA',
            startIdx: 0,
            endIdx: closings.length - 1,
            inReal: closings,
            optInFastLimit: fastLimit,
            optInSlowLimit: slowLimit
        }
        const result = await executeTalib( config )
        const { outMAMA, outFAMA } = result.result
        const values = []

        outMAMA
            .forEach( ( mama, i ) => {
                values.push( { mama, fama: outFAMA[ i ] } )
            } )

        return {
            values,
            latest: values.length > 0 ? values[ values.length - 1 ] : null,
            count: closings.length,
            stableCount: values.length,
            begIndex: result.begIndex
        }
    }

    const dispatch = {
        computeDisplacedMovingAverage: {
            'trading-signals': ( closings, { shortInterval, longInterval } ) => computeCompoundStreaming( new ts.DMA( shortInterval, longInterval ), closings, ['short', 'long'] )
        },
        computeKaufmanAdaptiveMovingAverage: {
            'talib': ( closings, { period } ) => computeWithTalib( 'KAMA', closings, { optInTimePeriod: period } )
        },
        computeMESAAdaptiveMovingAverage: {
            'talib': ( closings, { fastLimit, slowLimit } ) => computeMAMAWithTalib( closings, { fastLimit, slowLimit } )
        },
        computeT3: {
            'talib': ( closings, { period, vFactor } ) => computeWithTalib( 'T3', closings, { optInTimePeriod: period, optInVFactor: vFactor } )
        },
        computeLinearRegression: {
            'trading-signals': ( closings, { period } ) => computeCompoundStreaming( new ts.LinearRegression( period ), closings, ['prediction', 'slope', 'intercept'] ),
            'talib': ( closings, { period } ) => computeWithTalib( 'LINEARREG', closings, { optInTimePeriod: period } )
        },
        computeLinearRegressionSlope: {
            'talib': ( closings, { period } ) => computeWithTalib( 'LINEARREG_SLOPE', closings, { optInTimePeriod: period } )
        },
        computeLinearRegressionAngle: {
            'talib': ( closings, { period } ) => computeWithTalib( 'LINEARREG_ANGLE', closings, { optInTimePeriod: period } )
        },
        computeLinearRegressionIntercept: {
            'talib': ( closings, { period } ) => computeWithTalib( 'LINEARREG_INTERCEPT', closings, { optInTimePeriod: period } )
        }
    }

    const indicatorMeta = {
        computeDisplacedMovingAverage: 'DMA',
        computeKaufmanAdaptiveMovingAverage: 'KAMA',
        computeMESAAdaptiveMovingAverage: 'MAMA',
        computeT3: 'T3',
        computeLinearRegression: 'LinearRegression',
        computeLinearRegressionSlope: 'LinearRegressionSlope',
        computeLinearRegressionAngle: 'LinearRegressionAngle',
        computeLinearRegressionIntercept: 'LinearRegressionIntercept'
    }

    function buildHandler( routeName ) {
        const handler = {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { closings: closingsString, library = 'trading-signals' } = userParams
                const closings = parseClosings( closingsString )
                const compute = dispatch[ routeName ][ library ]
                const data = await compute( closings, userParams )

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
        computeDisplacedMovingAverage: buildHandler( 'computeDisplacedMovingAverage' ),
        computeKaufmanAdaptiveMovingAverage: buildHandler( 'computeKaufmanAdaptiveMovingAverage' ),
        computeMESAAdaptiveMovingAverage: buildHandler( 'computeMESAAdaptiveMovingAverage' ),
        computeT3: buildHandler( 'computeT3' ),
        computeLinearRegression: buildHandler( 'computeLinearRegression' ),
        computeLinearRegressionSlope: buildHandler( 'computeLinearRegressionSlope' ),
        computeLinearRegressionAngle: buildHandler( 'computeLinearRegressionAngle' ),
        computeLinearRegressionIntercept: buildHandler( 'computeLinearRegressionIntercept' )
    }
}
