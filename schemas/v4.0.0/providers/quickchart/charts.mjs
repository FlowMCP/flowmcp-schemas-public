// Category: handlers-clean
// QuickChart.io — free chart rendering, no API key required
// Renders Chart.js configs to PNG images via POST

export const main = {
    namespace: 'quickchart',
    name: 'QuickChart Image Generator',
    description: 'Generate chart images (PNG) from Chart.js configurations via QuickChart.io. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://quickchart.io/documentation'],
    tags: ['charts', 'visualization', 'images', 'cacheTtlStatic'],
    root: 'https://quickchart.io',
    requiredServerParams: [],
    headers: {},
    tools: {
        renderChart: {
            method: 'POST',
            path: '/chart',
            description: 'Render a Chart.js config to PNG image. Returns binary image data as base64. Supports line, bar, pie, radar, and more.',
            parameters: [
                { position: { key: 'chart', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'width', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['default(800)', 'optional()'] } },
                { position: { key: 'height', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['default(400)', 'optional()'] } },
                { position: { key: 'backgroundColor', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['default(#0d1117)', 'optional()'] } },
                { position: { key: 'format', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(png,svg,webp)', options: ['default(png)', 'optional()'] } }
            ],
            tests: [
                {
                    _description: 'Simple line chart',
                    chart: JSON.stringify( {
                        type: 'line',
                        data: {
                            labels: ['Jan', 'Feb', 'Mar'],
                            datasets: [{ label: 'Test', data: [10, 20, 15], borderColor: '#58a6ff', fill: false }]
                        }
                    } ),
                    width: 600,
                    height: 300
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        base64: { type: 'string' },
                        mimeType: { type: 'string' },
                        size: { type: 'number' }
                    }
                }
            }
        },
        getChartUrl: {
            method: 'GET',
            path: '/chart',
            description: 'Get a URL for a Chart.js chart image. Use for embedding in markdown or HTML. Returns the image URL directly.',
            parameters: [
                { position: { key: 'c', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'w', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(800)', 'optional()'] } },
                { position: { key: 'h', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(400)', 'optional()'] } },
                { position: { key: 'bkg', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(%230d1117)', 'optional()'] } },
                { position: { key: 'f', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(png,svg,webp)', options: ['default(png)', 'optional()'] } }
            ],
            tests: [
                {
                    _description: 'URL for simple bar chart',
                    c: JSON.stringify( { type: 'bar', data: { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] } } ),
                    w: 400,
                    h: 200
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        url: { type: 'string' },
                        shortUrl: { type: 'string' }
                    }
                }
            }
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    renderChart: {
        executeRequest: async ( { struct, payload } ) => {
            const { chart, width, height, backgroundColor, format } = payload.userParams || payload.body || {}

            const body = {
                chart: typeof chart === 'string' ? chart : JSON.stringify( chart ),
                width: width || 800,
                height: height || 400,
                backgroundColor: backgroundColor || '#0d1117',
                format: format || 'png'
            }

            const response = await fetch( `${payload.url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( body )
            } )

            struct.httpStatus = response.status

            if( !response.ok ) {
                struct.status = false
                struct.messages.push( `HTTP ${response.status}: ${response.statusText}` )

                return { struct }
            }

            const buffer = Buffer.from( await response.arrayBuffer() )

            struct.data = {
                base64: buffer.toString( 'base64' ),
                mimeType: `image/${format || 'png'}`,
                size: buffer.length
            }

            return { struct }
        }
    },
    getChartUrl: {
        executeRequest: async ( { struct, payload } ) => {
            const { c, w, h, bkg, f } = payload.userParams || {}
            const chartConfig = typeof c === 'string' ? c : JSON.stringify( c )

            // Create short URL via QuickChart API
            const response = await fetch( 'https://quickchart.io/chart/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {
                    chart: chartConfig,
                    width: w || 800,
                    height: h || 400,
                    backgroundColor: decodeURIComponent( bkg || '#0d1117' ),
                    format: f || 'png'
                } )
            } )

            struct.httpStatus = response.status

            if( !response.ok ) {
                struct.status = false
                struct.messages.push( `HTTP ${response.status}: ${response.statusText}` )

                return { struct }
            }

            const result = await response.json()

            struct.data = {
                url: result.url,
                shortUrl: result.url
            }

            return { struct }
        }
    }
} )
