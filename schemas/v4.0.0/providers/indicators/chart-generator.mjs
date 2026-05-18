// Chart Generator — Local candlestick chart generation using ECharts
// No external API calls — generates PNG charts from OHLCV data locally

export const main = {
    namespace: 'indicators',
    name: 'Chart Generator',
    description: 'Generate candlestick PNG charts from OHLCV data locally using ECharts. Returns base64-encoded PNG images for embedding in Markdown reports.',
    version: '4.0.0',
    docs: ['https://echarts.apache.org/en/api.html'],
    tags: ['charts', 'ohlcv', 'trading', 'indicators', 'visualization'],
    root: 'https://localhost',
    requiredLibraries: ['echarts'],
    tools: {
        generateCandlestickChart: {
            method: 'GET',
            path: '/',
            description: 'Generate a candlestick chart PNG from OHLCV arrays. Input: comma-separated strings of openings, closings, highs, lows, volumes, timestamps. Optional: title, width, height, emaperiods (e.g. "9,21" for EMA overlays). Returns base64-encoded PNG.',
            parameters: [
                {
                    position: {
                        key: 'openings',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'closings',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'highs',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'lows',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'volumes',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'timestamps',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'title',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()', 'default(OHLCV Chart)']
                    }
                },
                {
                    position: {
                        key: 'width',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(1200)']
                    }
                },
                {
                    position: {
                        key: 'height',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(600)']
                    }
                },
                {
                    position: {
                        key: 'emaperiods',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'showVolume',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'boolean()',
                        options: ['optional()', 'default(true)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Generate a simple 5-candle chart',
                    openings: '100,105,103,108,110',
                    closings: '105,103,108,106,115',
                    highs: '107,108,110,112,118',
                    lows: '98,101,102,104,108',
                    volumes: '1000,1200,900,1500,2000',
                    timestamps: '2026-03-07,2026-03-08,2026-03-09,2026-03-10,2026-03-11',
                    title: 'Test Chart',
                    width: 800,
                    height: 400,
                    showVolume: true
                },
                {
                    _description: 'Additional test for generateCandlestickChart',
                    openings: '100,105,103,108,110 alt',
                    closings: '105,103,108,106,115 alt',
                    highs: '107,108,110,112,118 alt',
                    lows: '98,101,102,104,108 alt',
                    timestamps: '2026-03-07,2026-03-08,2026-03-09,2026-03-10,2026-03-11 alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from generateCandlestickChart',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        }
    }
}

export const handlers = ( { sharedLists, libraries } ) => {
    const echarts = libraries['echarts']

    const calculateEMA = ( { closings, period } ) => {
        const multiplier = 2 / ( period + 1 )
        const emaValues = []

        closings
            .forEach( ( close, idx ) => {
                if( idx === 0 ) {
                    emaValues.push( close )
                } else {
                    const prev = emaValues[ idx - 1 ]
                    const ema = ( close - prev ) * multiplier + prev

                    emaValues.push( ema )
                }
            } )

        return { emaValues }
    }

    return {
        generateCandlestickChart: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const {
                    openings: openStr,
                    closings: closeStr,
                    highs: highStr,
                    lows: lowStr,
                    volumes: volumeStr,
                    timestamps: timestampStr,
                    title = 'OHLCV Chart',
                    width = 1200,
                    height = 600,
                    emaperiods: emaPeriodStr,
                    showVolume = true
                } = userParams

                const openings = openStr.split( ',' ).map( ( v ) => parseFloat( v ) )
                const closings = closeStr.split( ',' ).map( ( v ) => parseFloat( v ) )
                const highs = highStr.split( ',' ).map( ( v ) => parseFloat( v ) )
                const lows = lowStr.split( ',' ).map( ( v ) => parseFloat( v ) )
                const timestamps = timestampStr.split( ',' )

                const volumes = volumeStr
                    ? volumeStr.split( ',' ).map( ( v ) => parseFloat( v ) )
                    : []

                const candlestickData = openings
                    .map( ( open, idx ) => {
                        const dataPoint = [ open, closings[ idx ], lows[ idx ], highs[ idx ] ]

                        return dataPoint
                    } )

                const series = [
                    {
                        name: 'Candlestick',
                        type: 'candlestick',
                        data: candlestickData,
                        itemStyle: {
                            color: '#26a69a',
                            color0: '#ef5350',
                            borderColor: '#26a69a',
                            borderColor0: '#ef5350'
                        }
                    }
                ]

                if( emaPeriodStr ) {
                    emaPeriodStr.split( ',' )
                        .forEach( ( periodStr ) => {
                            const period = parseInt( periodStr, 10 )
                            const { emaValues } = calculateEMA( { closings, period } )
                            const colors = { 9: '#f39c12', 21: '#3498db', 50: '#e74c3c', 200: '#9b59b6' }
                            const lineColor = colors[ period ] || '#95a5a6'

                            series.push( {
                                name: `EMA ${period}`,
                                type: 'line',
                                data: emaValues,
                                smooth: true,
                                lineStyle: { width: 1.5, color: lineColor },
                                symbol: 'none'
                            } )
                        } )
                }

                const gridConfig = showVolume && volumes.length > 0
                    ? [
                        { left: '10%', right: '8%', top: '10%', height: '55%' },
                        { left: '10%', right: '8%', top: '72%', height: '18%' }
                    ]
                    : [
                        { left: '10%', right: '8%', top: '10%', height: '80%' }
                    ]

                const xAxisConfig = showVolume && volumes.length > 0
                    ? [
                        { type: 'category', data: timestamps, gridIndex: 0, axisLabel: { color: '#999' } },
                        { type: 'category', data: timestamps, gridIndex: 1, axisLabel: { show: false } }
                    ]
                    : [
                        { type: 'category', data: timestamps, gridIndex: 0, axisLabel: { color: '#999' } }
                    ]

                const yAxisConfig = showVolume && volumes.length > 0
                    ? [
                        { scale: true, gridIndex: 0, axisLabel: { color: '#999' } },
                        { scale: true, gridIndex: 1, axisLabel: { color: '#999' } }
                    ]
                    : [
                        { scale: true, gridIndex: 0, axisLabel: { color: '#999' } }
                    ]

                if( showVolume && volumes.length > 0 ) {
                    const volumeColors = openings
                        .map( ( open, idx ) => {
                            const color = closings[ idx ] >= open ? '#26a69a' : '#ef5350'

                            return color
                        } )

                    series.push( {
                        name: 'Volume',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: volumes,
                        itemStyle: {
                            color: ( params ) => {
                                const idx = params.dataIndex

                                return volumeColors[ idx ] || '#999'
                            }
                        }
                    } )
                }

                const option = {
                    backgroundColor: '#1a1a2e',
                    title: {
                        text: title,
                        left: 'center',
                        textStyle: { color: '#e0e0e0', fontSize: 16 }
                    },
                    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
                    grid: gridConfig,
                    xAxis: xAxisConfig,
                    yAxis: yAxisConfig,
                    series
                }

                try {
                    const { createCanvas } = await import( 'canvas' )
                    const canvas = createCanvas( width, height )

                    echarts.setPlatformAPI( {
                        createCanvas: () => {
                            const c = createCanvas( width, height )

                            return c
                        }
                    } )

                    const chart = echarts.init( canvas, null, { width, height } )
                    chart.setOption( option )

                    const buffer = canvas.toBuffer( 'image/png' )
                    const base64 = buffer.toString( 'base64' )

                    chart.dispose()

                    struct['data'] = {
                        base64,
                        mimeType: 'image/png',
                        width,
                        height,
                        dataPoints: openings.length,
                        markdown: `![${title}](data:image/png;base64,${base64})`
                    }
                    struct['status'] = true
                } catch( e ) {
                    struct['status'] = false
                    struct['messages'].push( `Chart generation error: ${e.message}` )
                }

                return { struct }
            }
        }
    }
}
