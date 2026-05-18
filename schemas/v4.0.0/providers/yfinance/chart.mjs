// Category: handlers-clean
// Yahoo Finance Chart API — free OHLCV data, no API key required

export const main = {
    namespace: 'yfinance',
    name: 'Yahoo Finance Chart',
    description: 'Fetch OHLCV (Open/High/Low/Close/Volume) price data from Yahoo Finance for any ticker symbol. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://finance.yahoo.com'],
    tags: ['finance', 'prices', 'ohlcv', 'stocks', 'crypto', 'cacheTtlDaily'],
    sharedLists: [
        { ref: 'tradingTimeframes', version: '3.0.0', filter: { key: 'alias', exists: true } }
    ],
    root: 'https://query2.finance.yahoo.com',
    requiredServerParams: [],
    headers: {},
    tools: {
        getOhlcv: {
            method: 'GET',
            path: '/v8/finance/chart/:symbol',
            description: 'Fetch OHLCV price history for a ticker symbol. Returns timestamps, open, high, low, close, volume arrays.',
            parameters: [
                { position: { key: 'symbol', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'range', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max)', options: ['default(6mo)', 'optional()'] } },
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo)', options: ['default(1d)', 'optional()'] } }
            ],
            tests: [
                { _description: 'BTC-USD daily 6 months', symbol: 'BTC-USD', range: '6mo', interval: '1d' },
                { _description: 'ETH-USD daily 3 months', symbol: 'ETH-USD', range: '3mo', interval: '1d' },
                { _description: 'AAPL daily 1 year', symbol: 'AAPL', range: '1y', interval: '1d' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        symbol: { type: 'string' },
                        currency: { type: 'string' },
                        count: { type: 'number' },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    date: { type: 'string' },
                                    open: { type: 'number' },
                                    high: { type: 'number' },
                                    low: { type: 'number' },
                                    close: { type: 'number' },
                                    volume: { type: 'number' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getQuote: {
            method: 'GET',
            path: '/v8/finance/chart/:symbol',
            description: 'Fetch current quote with latest price, market cap, and 52-week range for a ticker symbol.',
            parameters: [
                { position: { key: 'symbol', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Current BTC-USD quote', symbol: 'BTC-USD' },
                { _description: 'Current AAPL quote', symbol: 'AAPL' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        symbol: { type: 'string' },
                        currency: { type: 'string' },
                        price: { type: 'number' },
                        previousClose: { type: 'number' },
                        fiftyTwoWeekHigh: { type: 'number' },
                        fiftyTwoWeekLow: { type: 'number' },
                        marketCap: { type: 'number' },
                        volume: { type: 'number' }
                    }
                }
            }
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getOhlcv: {
        executeRequest: async ( { struct, payload } ) => {
            const response = await fetch( payload.url, {
                method: 'GET',
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FlowMCP/2.0)' }
            } )

            struct.httpStatus = response.status

            if( !response.ok ) {
                struct.status = false
                struct.messages.push( `HTTP ${response.status}: ${response.statusText}` )

                return { struct }
            }

            const raw = await response.json()
            const result = raw.chart.result[0]
            const { timestamp } = result
            const quote = result.indicators.quote[0]
            const { meta } = result

            const data = timestamp
                .map( ( ts, i ) => {
                    const row = {
                        date: new Date( ts * 1000 ).toISOString().split( 'T' )[0],
                        open: quote.open[i] !== null ? Math.round( quote.open[i] * 100 ) / 100 : null,
                        high: quote.high[i] !== null ? Math.round( quote.high[i] * 100 ) / 100 : null,
                        low: quote.low[i] !== null ? Math.round( quote.low[i] * 100 ) / 100 : null,
                        close: quote.close[i] !== null ? Math.round( quote.close[i] * 100 ) / 100 : null,
                        volume: quote.volume[i] || 0
                    }

                    return row
                } )
                .filter( ( row ) => row.close !== null )

            struct.data = {
                symbol: meta.symbol,
                currency: meta.currency,
                count: data.length,
                data
            }

            return { struct }
        }
    },
    getQuote: {
        executeRequest: async ( { struct, payload } ) => {
            const response = await fetch( payload.url, {
                method: 'GET',
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FlowMCP/2.0)' }
            } )

            struct.httpStatus = response.status

            if( !response.ok ) {
                struct.status = false
                struct.messages.push( `HTTP ${response.status}: ${response.statusText}` )

                return { struct }
            }

            const raw = await response.json()
            const meta = raw.chart.result[0].meta

            struct.data = {
                symbol: meta.symbol,
                currency: meta.currency,
                price: Math.round( meta.regularMarketPrice * 100 ) / 100,
                previousClose: Math.round( meta.previousClose * 100 ) / 100,
                fiftyTwoWeekHigh: Math.round( meta.fiftyTwoWeekHigh * 100 ) / 100,
                fiftyTwoWeekLow: Math.round( meta.fiftyTwoWeekLow * 100 ) / 100,
                marketCap: meta.marketCap || null,
                volume: meta.regularMarketVolume || 0
            }

            return { struct }
        }
    }
} )
