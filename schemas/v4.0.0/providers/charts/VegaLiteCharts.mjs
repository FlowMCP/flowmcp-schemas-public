// Vega-Lite chart generation schema
// requiredLibraries: vega, vega-lite, canvas

export const main = {
    namespace: 'charts',
    name: 'Vega-Lite Charts',
    description: 'Generate publication-quality charts as PNG images using Vega-Lite. Supports candlestick (OHLCV), line, multi-line, and bar charts. All rendering is local — no external API required. Returns base64-encoded PNG data.',
    version: '4.0.0',
    docs: ['https://vega.github.io/vega-lite/'],
    tags: ['charts', 'visualization', 'trading', 'offline'],
    root: 'https://offline.vega-lite.local',
    tools: {
        generateCandlestickChart: {
            method: 'GET',
            path: '/',
            description: 'Generate a candlestick (OHLCV) chart as PNG. Provide opening, closing, high, and low prices as comma-separated values along with corresponding dates. Returns a base64-encoded PNG image.',
            parameters: [
                { position: { key: 'openings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'dates', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'title', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['optional()', 'default(Candlestick Chart)'] } },
                { position: { key: 'width', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(800)', 'min(200)', 'max(2000)'] } },
                { position: { key: 'height', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(400)', 'min(100)', 'max(1200)'] } }
            ],
            tests: [
                {
                    _description: 'Generate candlestick chart with 10 data points',
                    openings: '100,102,101,103,105,104,106,108,107,109',
                    closings: '102,101,103,105,104,106,108,107,109,111',
                    highs: '103,103,104,106,106,107,109,109,110,112',
                    lows: '99,100,100,102,103,103,105,106,106,108',
                    dates: '2026-01-01,2026-01-02,2026-01-03,2026-01-04,2026-01-05,2026-01-06,2026-01-07,2026-01-08,2026-01-09,2026-01-10',
                    title: 'Test Candlestick'
                }
            ],
        },
        generateLineChart: {
            method: 'GET',
            path: '/',
            description: 'Generate a line chart as PNG from comma-separated numeric values and dates. Returns a base64-encoded PNG image.',
            parameters: [
                { position: { key: 'values', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'dates', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'label', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['optional()', 'default(Value)'] } },
                { position: { key: 'title', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['optional()', 'default(Line Chart)'] } },
                { position: { key: 'width', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(800)', 'min(200)', 'max(2000)'] } },
                { position: { key: 'height', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(400)', 'min(100)', 'max(1200)'] } }
            ],
            tests: [
                {
                    _description: 'Generate line chart with 10 data points',
                    values: '100,102,101,105,108,107,110,112,111,115',
                    dates: '2026-01-01,2026-01-02,2026-01-03,2026-01-04,2026-01-05,2026-01-06,2026-01-07,2026-01-08,2026-01-09,2026-01-10',
                    label: 'Price',
                    title: 'Test Line Chart'
                }
            ],
        },
        generateMultiLineChart: {
            method: 'GET',
            path: '/',
            description: 'Generate a multi-line chart as PNG. Provide series as a JSON array of objects with label and values fields, plus comma-separated dates. Returns a base64-encoded PNG image.',
            parameters: [
                { position: { key: 'series', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(2)'] } },
                { position: { key: 'dates', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'title', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['optional()', 'default(Multi-Line Chart)'] } },
                { position: { key: 'width', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(800)', 'min(200)', 'max(2000)'] } },
                { position: { key: 'height', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(400)', 'min(100)', 'max(1200)'] } }
            ],
            tests: [
                {
                    _description: 'Generate multi-line chart with 2 series',
                    series: '[{"label":"BTC","values":"100,102,105,103,108,110,107,112,115,118"},{"label":"ETH","values":"50,52,51,55,54,58,57,60,62,61"}]',
                    dates: '2026-01-01,2026-01-02,2026-01-03,2026-01-04,2026-01-05,2026-01-06,2026-01-07,2026-01-08,2026-01-09,2026-01-10',
                    title: 'BTC vs ETH'
                }
            ],
        },
        generateBarChart: {
            method: 'GET',
            path: '/',
            description: 'Generate a bar chart as PNG from comma-separated numeric values and labels. Returns a base64-encoded PNG image.',
            parameters: [
                { position: { key: 'values', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'labels', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'title', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['optional()', 'default(Bar Chart)'] } },
                { position: { key: 'width', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(600)', 'min(200)', 'max(2000)'] } },
                { position: { key: 'height', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(400)', 'min(100)', 'max(1200)'] } }
            ],
            tests: [
                {
                    _description: 'Generate bar chart with 5 categories',
                    values: '42,38,25,18,12',
                    labels: 'Bitcoin,Ethereum,Solana,Cardano,Polkadot',
                    title: 'Market Cap Ranking'
                }
            ],
        }
    },
    requiredLibraries: ['vega', 'vega-lite', 'canvas']
}


export const handlers = ( { sharedLists, libraries } ) => {
    const vega = libraries['vega']
    const vegaLite = libraries['vega-lite']

    function parseCommaSeparatedNumbers( str ) {
        const numbers = str.split( ',' )
            .map( ( s ) => {
                const trimmed = s.trim()
                const num = Number( trimmed )

                return num
            } )

        return numbers
    }

    function parseCommaSeparatedStrings( str ) {
        const strings = str.split( ',' )
            .map( ( s ) => {
                const trimmed = s.trim()

                return trimmed
            } )

        return strings
    }

    async function renderSpec( { vlSpec } ) {
        const vgSpec = vegaLite.compile( vlSpec ).spec
        const view = new vega.View( vega.parse( vgSpec ), { renderer: 'none' } )
        const canvas = await view.toCanvas()
        const buffer = canvas.toBuffer( 'image/png' )
        const base64 = buffer.toString( 'base64' )

        return { base64, canvas }
    }

    return {
        generateCandlestickChart: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { openings, closings, highs, lows, dates, title, width, height } = userParams

                try {
                    const openArr = parseCommaSeparatedNumbers( openings )
                    const closeArr = parseCommaSeparatedNumbers( closings )
                    const highArr = parseCommaSeparatedNumbers( highs )
                    const lowArr = parseCommaSeparatedNumbers( lows )
                    const dateArr = parseCommaSeparatedStrings( dates )

                    const dataArray = dateArr
                        .map( ( date, idx ) => {
                            const point = {
                                date,
                                open: openArr[ idx ],
                                close: closeArr[ idx ],
                                high: highArr[ idx ],
                                low: lowArr[ idx ]
                            }

                            return point
                        } )

                    const vlSpec = {
                        '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
                        width: width || 800,
                        height: height || 400,
                        title: title || 'Candlestick Chart',
                        data: { values: dataArray },
                        encoding: {
                            x: { field: 'date', type: 'temporal', title: 'Date' }
                        },
                        layer: [
                            {
                                mark: { type: 'rule' },
                                encoding: {
                                    y: { field: 'low', type: 'quantitative', scale: { zero: false }, title: 'Price' },
                                    y2: { field: 'high' }
                                }
                            },
                            {
                                mark: { type: 'bar', size: 6 },
                                encoding: {
                                    y: { field: 'open', type: 'quantitative' },
                                    y2: { field: 'close' },
                                    color: {
                                        condition: { test: 'datum.open <= datum.close', value: '#06982d' },
                                        value: '#ae1325'
                                    }
                                }
                            }
                        ]
                    }

                    const { base64 } = await renderSpec( { vlSpec } )

                    struct['data'] = {
                        image: base64,
                        mimeType: 'image/png',
                        width: vlSpec.width,
                        height: vlSpec.height,
                        dataPoints: dataArray.length
                    }
                    struct['status'] = true
                } catch( e ) {
                    struct['status'] = false
                    struct['messages'].push( e?.message || 'Failed to generate candlestick chart' )
                }

                return { struct }
            }
        },
        generateLineChart: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { values, dates, label, title, width, height } = userParams

                try {
                    const valArr = parseCommaSeparatedNumbers( values )
                    const dateArr = parseCommaSeparatedStrings( dates )

                    const dataArray = dateArr
                        .map( ( date, idx ) => {
                            const point = {
                                date,
                                value: valArr[ idx ]
                            }

                            return point
                        } )

                    const vlSpec = {
                        '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
                        width: width || 800,
                        height: height || 400,
                        title: title || 'Line Chart',
                        data: { values: dataArray },
                        mark: { type: 'line', point: true },
                        encoding: {
                            x: { field: 'date', type: 'temporal', title: 'Date' },
                            y: { field: 'value', type: 'quantitative', title: label || 'Value', scale: { zero: false } }
                        }
                    }

                    const { base64 } = await renderSpec( { vlSpec } )

                    struct['data'] = {
                        image: base64,
                        mimeType: 'image/png',
                        width: vlSpec.width,
                        height: vlSpec.height,
                        dataPoints: dataArray.length
                    }
                    struct['status'] = true
                } catch( e ) {
                    struct['status'] = false
                    struct['messages'].push( e?.message || 'Failed to generate line chart' )
                }

                return { struct }
            }
        },
        generateMultiLineChart: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { series, dates, title, width, height } = userParams

                try {
                    const parsedSeries = JSON.parse( series )
                    const dateArr = parseCommaSeparatedStrings( dates )

                    const dataArray = parsedSeries
                        .reduce( ( acc, seriesItem ) => {
                            const { label: seriesLabel, values: seriesValues } = seriesItem
                            const valArr = parseCommaSeparatedNumbers( seriesValues )
                            const points = dateArr
                                .map( ( date, idx ) => {
                                    const point = {
                                        date,
                                        value: valArr[ idx ],
                                        series: seriesLabel
                                    }

                                    return point
                                } )
                            acc.push( ...points )

                            return acc
                        }, [] )

                    const vlSpec = {
                        '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
                        width: width || 800,
                        height: height || 400,
                        title: title || 'Multi-Line Chart',
                        data: { values: dataArray },
                        mark: { type: 'line', point: true },
                        encoding: {
                            x: { field: 'date', type: 'temporal', title: 'Date' },
                            y: { field: 'value', type: 'quantitative', title: 'Value', scale: { zero: false } },
                            color: { field: 'series', type: 'nominal', title: 'Series' }
                        }
                    }

                    const { base64 } = await renderSpec( { vlSpec } )

                    struct['data'] = {
                        image: base64,
                        mimeType: 'image/png',
                        width: vlSpec.width,
                        height: vlSpec.height,
                        dataPoints: dataArray.length
                    }
                    struct['status'] = true
                } catch( e ) {
                    struct['status'] = false
                    struct['messages'].push( e?.message || 'Failed to generate multi-line chart' )
                }

                return { struct }
            }
        },
        generateBarChart: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { values, labels, title, width, height } = userParams

                try {
                    const valArr = parseCommaSeparatedNumbers( values )
                    const labelArr = parseCommaSeparatedStrings( labels )

                    const dataArray = labelArr
                        .map( ( label, idx ) => {
                            const point = {
                                category: label,
                                value: valArr[ idx ]
                            }

                            return point
                        } )

                    const vlSpec = {
                        '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
                        width: width || 600,
                        height: height || 400,
                        title: title || 'Bar Chart',
                        data: { values: dataArray },
                        mark: { type: 'bar' },
                        encoding: {
                            x: { field: 'category', type: 'nominal', title: 'Category', sort: null },
                            y: { field: 'value', type: 'quantitative', title: 'Value' },
                            color: { field: 'category', type: 'nominal', legend: null }
                        }
                    }

                    const { base64 } = await renderSpec( { vlSpec } )

                    struct['data'] = {
                        image: base64,
                        mimeType: 'image/png',
                        width: vlSpec.width,
                        height: vlSpec.height,
                        dataPoints: dataArray.length
                    }
                    struct['status'] = true
                } catch( e ) {
                    struct['status'] = false
                    struct['messages'].push( e?.message || 'Failed to generate bar chart' )
                }

                return { struct }
            }
        }
    }
}
