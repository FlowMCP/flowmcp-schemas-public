// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "chartImg" -> "chartimg"

export const main = {
    namespace: 'chartimg',
    name: 'Chart Image API',
    description: 'High-quality TradingView chart screenshots and financial chart image generation service',
    version: '4.0.0',
    docs: ['https://doc.chart-img.com'],
    tags: ['charts', 'visualization', 'trading', 'cacheTtlStatic'],
    sharedLists: [
        { ref: 'tradingTimeframes', version: '3.0.0', filter: { key: 'alias', exists: true } }
    ],
    root: 'https://api.chart-img.com',
    requiredServerParams: ['CHART_IMG_API_KEY'],
    headers: {
        'x-api-key': '{{CHART_IMG_API_KEY}}'
    },
    tools: {
        getAdvancedChart: {
            method: 'POST',
            path: '/v2/tradingview/advanced-chart',
            description: 'Capture a high-quality screenshot of a TradingView advanced chart with specified symbol and settings',
            parameters: [
                { position: { key: 'symbol', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(1m,3m,5m,15m,30m,45m,1h,4h,1D,1W,1M)', options: ['default(15m)', 'optional()'] } },
                { position: { key: 'theme', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(light,dark)', options: ['default(dark)', 'optional()'] } },
                { position: { key: 'width', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['min(400)', 'max(2000)', 'default(1200)', 'optional()'] } },
                { position: { key: 'height', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['min(300)', 'max(1500)', 'default(800)', 'optional()'] } },
                { position: { key: 'session', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(regular,extended)', options: ['default(extended)', 'optional()'] } },
                { position: { key: 'timezone', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['default(America/New_York)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Screenshot Tesla stock', symbol: 'NASDAQ:TSLA', interval: '15m', theme: 'dark', height: 600 }
            ],
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getAdvancedChart: {
        executeRequest: async ( { struct, payload } ) => {
            const response = await fetch( payload.url, {
                method: payload.method,
                headers: payload.headers,
                body: JSON.stringify( payload.body )
            } )

            struct.httpStatus = response.status
            struct.responseHeaders = Object.fromEntries( response.headers.entries() )
            struct.dataAsString = await response.text()

            if( response.ok ) {
                try {
                    struct.data = JSON.parse( struct.dataAsString )
                } catch {
                    struct.data = { rawResponse: struct.dataAsString }
                }
            } else {
                struct.status = false
                struct.messages.push( `HTTP ${response.status}: ${response.statusText}` )
            }

            return { struct }
        }
    }
} )
