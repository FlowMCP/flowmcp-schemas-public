// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'coingecko',
    name: 'CoinGeckoGlobal',
    description: 'Fetch global cryptocurrency market data from CoinGecko — total market cap, 24h volume, BTC/ETH dominance, plus DeFi-specific global metrics.',
    version: '4.0.0',
    docs: ['https://docs.coingecko.com/reference/introduction'],
    tags: ['crypto', 'global', 'marketdata', 'cacheTtlFrequent'],
    root: 'https://api.coingecko.com/api/v3',
    tools: {
        getGlobalData: {
            method: 'GET',
            path: '/global',
            description: 'Get global cryptocurrency market overview including total market cap, 24h trading volume, BTC/ETH dominance percentages, active cryptocurrency count, ICO stats, and number of exchanges. Market cap and volume are returned in 60+ fiat and crypto denominations.',
            parameters: [],
            tests: [
                { _description: 'Get global crypto market cap, volume, and BTC dominance' },
                { _description: 'Fetch current total market overview with dominance percentages' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: 'Global market data wrapper',
                            properties: {
                                active_cryptocurrencies: { type: 'number', description: 'Total number of actively traded cryptocurrencies' },
                                upcoming_icos: { type: 'number', description: 'Number of upcoming initial coin offerings' },
                                ongoing_icos: { type: 'number', description: 'Number of currently active ICOs' },
                                ended_icos: { type: 'number', description: 'Number of completed ICOs' },
                                markets: { type: 'number', description: 'Total number of tracked exchanges' },
                                total_market_cap: { type: 'object', description: 'Total crypto market capitalization in 60+ currencies (usd, eur, btc, eth, etc.)' },
                                total_volume: { type: 'object', description: 'Total 24h trading volume across all coins in 60+ currencies' },
                                market_cap_percentage: { type: 'object', description: 'Market cap dominance percentages for top coins (btc, eth, usdt, xrp, bnb, sol, etc.)' },
                                market_cap_change_percentage_24h_usd: { type: 'number', description: 'Total market cap percentage change over the last 24 hours in USD' },
                                volume_change_percentage_24h_usd: { type: 'number', description: 'Total trading volume percentage change over the last 24 hours in USD' },
                                updated_at: { type: 'number', description: 'Unix timestamp of last data update' }
                            }
                        }
                    }
                }
            },
        },
        getDeFiGlobalData: {
            method: 'GET',
            path: '/global/decentralized_finance_defi',
            description: 'Get global DeFi market statistics including total DeFi market cap, DeFi-to-ETH ratio, 24h DeFi trading volume, DeFi market dominance percentage, and the current top DeFi coin by dominance.',
            parameters: [],
            tests: [
                { _description: 'Get global DeFi market cap, volume, and dominance stats' },
                { _description: 'Fetch DeFi-to-ETH ratio and top DeFi coin' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: 'DeFi global market data wrapper',
                            properties: {
                                defi_market_cap: { type: 'string', description: 'Total DeFi market capitalization in USD as string' },
                                eth_market_cap: { type: 'string', description: 'Ethereum market capitalization in USD as string' },
                                defi_to_eth_ratio: { type: 'string', description: 'Ratio of DeFi market cap to ETH market cap as string percentage' },
                                trading_volume_24h: { type: 'string', description: 'Total DeFi 24-hour trading volume in USD as string' },
                                defi_dominance: { type: 'string', description: 'DeFi market dominance as percentage string of total crypto market' },
                                top_coin_name: { type: 'string', description: 'Name of the top DeFi coin by market dominance' },
                                top_coin_defi_dominance: { type: 'number', description: 'Market dominance percentage of the top DeFi coin within DeFi' }
                            }
                        }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getGlobalData: {
        postRequest: async ( { response, struct, payload } ) => {
            response = response['data'] || []
            return { response }
        }
    },
    getDeFiGlobalData: {
        postRequest: async ( { response, struct, payload } ) => {
            response = response['data'] || []
            return { response }
        }
    }
} )
