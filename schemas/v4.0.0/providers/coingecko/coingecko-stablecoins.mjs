// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'coingecko',
    name: 'CoinGecko Stablecoins API',
    description: 'Access and analyze stablecoin data including market metrics, peg stability and historical trends via CoinGecko API',
    version: '4.0.0',
    docs: ['https://docs.coingecko.com/reference/simple-price', 'https://docs.coingecko.com/reference/coins-id-market-chart'],
    tags: ['price', 'market', 'stablecoins', 'cacheTtlDaily'],
    root: 'https://api.coingecko.com/api/v3',
    tools: {
        getSupportedStablecoins: {
            method: 'GET',
            path: '/coins/markets',
            description: 'Get list of all stablecoins from CoinGecko with market data. Required: vs_currency, category, order, per_page.',
            parameters: [
                { position: { key: 'vs_currency', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(usd)'] }, description: 'Target currency for price conversion, e.g. usd, eur, btc' },
                { position: { key: 'category', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(stablecoins)'] }, description: 'CoinGecko coin category filter, e.g. stablecoins' },
                { position: { key: 'order', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(market_cap_desc)'] }, description: 'Sort order for results, e.g. market_cap_desc, volume_desc' },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(250)', 'default(50)'] }, description: 'Number of results per page (1-250)' }
            ],
            tests: [
                {
                    _description: 'Get top 50 stablecoins by market cap',
                    vs_currency: 'usd',
                    category: 'stablecoins',
                    order: 'market_cap_desc',
                    per_page: 50
                },
                {
                    _description: 'Get top 10 stablecoins in EUR',
                    vs_currency: 'eur',
                    category: 'stablecoins',
                    per_page: 10
                },
                {
                    _description: 'Get stablecoins sorted by volume',
                    vs_currency: 'usd',
                    category: 'stablecoins',
                    order: 'volume_desc',
                    per_page: 20
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            symbol: { type: 'string' },
                            name: { type: 'string' },
                            image: { type: 'string' },
                            current_price: { type: 'number' },
                            market_cap: { type: 'number' },
                            market_cap_rank: { type: 'number' },
                            fully_diluted_valuation: { type: 'number' },
                            total_volume: { type: 'number' },
                            high_24h: { type: 'number' },
                            low_24h: { type: 'number' },
                            price_change_24h: { type: 'number' },
                            price_change_percentage_24h: { type: 'number' },
                            market_cap_change_24h: { type: 'number' },
                            market_cap_change_percentage_24h: { type: 'number' },
                            circulating_supply: { type: 'number' },
                            total_supply: { type: 'number' },
                            max_supply: { type: 'number', nullable: true },
                            ath: { type: 'number' },
                            ath_change_percentage: { type: 'number' },
                            ath_date: { type: 'string' },
                            atl: { type: 'number' },
                            atl_change_percentage: { type: 'number' },
                            atl_date: { type: 'string' },
                            roi: { type: 'string', nullable: true },
                            last_updated: { type: 'string' }
                        }
                    }
                }
            },
        },
        getCurrentPrice: {
            method: 'GET',
            path: '/simple/price',
            description: 'Fetches current prices for major stablecoins with peg stability analysis. Required: ids, vs_currencies, include_24hr_change.',
            parameters: [
                { position: { key: 'ids', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(tether,usd-coin,dai,ethena-usde,first-digital-usd,paypal-usd,true-usd)'] }, description: 'Comma-separated CoinGecko coin IDs to query prices for' },
                { position: { key: 'vs_currencies', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(usd)'] }, description: 'Comma-separated target currencies, e.g. usd, eur, btc' },
                { position: { key: 'include_24hr_change', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['default(true)'] }, description: 'Include 24-hour price change percentage in response' }
            ],
            tests: [
                {
                    _description: 'Get current prices for major stablecoins',
                    ids: 'tether,usd-coin,dai',
                    vs_currencies: 'usd',
                    include_24hr_change: true
                },
                {
                    _description: 'Get USDT price in EUR',
                    ids: 'tether',
                    vs_currencies: 'eur',
                    include_24hr_change: true
                },
                {
                    _description: 'Get prices for all default stablecoins',
                    vs_currencies: 'usd',
                    include_24hr_change: true
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        dai: { type: 'object', properties: { usd: { type: 'number' }, usd_24h_change: { type: 'number' } } },
                        tether: { type: 'object', properties: { usd: { type: 'number' }, usd_24h_change: { type: 'number' } } },
                        'usd-coin': { type: 'object', properties: { usd: { type: 'number' }, usd_24h_change: { type: 'number' } } }
                    }
                }
            },
        },
        getHistoricalData: {
            method: 'GET',
            path: '/coins/:id/market_chart',
            description: 'Fetch historical market chart data for a specific stablecoin. Required: id, vs_currency, days.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(tether,usd-coin,dai,ethena-usde,first-digital-usd,paypal-usd,true-usd,frax,gemini-dollar,paxos-standard)', options: [] }, description: 'CoinGecko stablecoin ID to fetch historical data for' },
                { position: { key: 'vs_currency', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(usd)'] }, description: 'Target currency for price conversion, e.g. usd, eur' },
                { position: { key: 'days', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(90)', 'default(7)'] }, description: 'Number of days of historical data to retrieve (1-90)' }
            ],
            tests: [
                { _description: 'Get 7-day historical data for USDT', id: 'tether', vs_currency: 'usd', days: 7 },
                { _description: 'Get 30-day historical data for USDC', id: 'usd-coin', vs_currency: 'usd', days: 30 },
                { _description: 'Get 14-day historical data for DAI', id: 'dai', vs_currency: 'usd', days: 14 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        prices: { type: 'array', items: { type: 'array', items: { type: 'number' } } },
                        market_caps: { type: 'array', items: { type: 'array', items: { type: 'number' } } },
                        total_volumes: { type: 'array', items: { type: 'array', items: { type: 'number' } } }
                    }
                }
            },
        },
        analyzePegStability: {
            method: 'GET',
            path: '/simple/price',
            description: 'Analyze peg stability for multiple stablecoins by comparing current prices to $1.00.',
            parameters: [
                { position: { key: 'ids', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(tether,usd-coin,dai,ethena-usde,first-digital-usd)'] }, description: 'Comma-separated CoinGecko stablecoin IDs to analyze' },
                { position: { key: 'vs_currencies', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(usd)'] }, description: 'Target currency for peg comparison, e.g. usd' },
                { position: { key: 'include_24hr_change', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['default(true)'] }, description: 'Include 24-hour price change percentage in analysis' }
            ],
            tests: [
                {
                    _description: 'Analyze peg stability for top 5 stablecoins',
                    ids: 'tether,usd-coin,dai,ethena-usde,first-digital-usd',
                    vs_currencies: 'usd',
                    include_24hr_change: true
                },
                {
                    _description: 'Analyze peg stability for USDT and USDC only',
                    ids: 'tether,usd-coin',
                    vs_currencies: 'usd',
                    include_24hr_change: true
                },
                {
                    _description: 'Analyze peg stability with default stablecoins',
                    vs_currencies: 'usd',
                    include_24hr_change: true
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        dai: { type: 'object', properties: { usd: { type: 'number' }, usd_24h_change: { type: 'number' } } },
                        'ethena-usde': { type: 'object', properties: { usd: { type: 'number' }, usd_24h_change: { type: 'number' } } },
                        'first-digital-usd': { type: 'object', properties: { usd: { type: 'number' }, usd_24h_change: { type: 'number' } } },
                        tether: { type: 'object', properties: { usd: { type: 'number' }, usd_24h_change: { type: 'number' } } },
                        'usd-coin': { type: 'object', properties: { usd: { type: 'number' }, usd_24h_change: { type: 'number' } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getSupportedStablecoins: {
        postRequest: async ( { response, struct, payload } ) => {
            if (!response || !Array.isArray(response)) {
            return { response }
            }

            // Format stablecoin market data into readable format
            const stablecoins = response.map(coin => ({
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            current_price: coin.current_price,
            market_cap: coin.market_cap,
            market_cap_rank: coin.market_cap_rank,
            price_change_24h: coin.price_change_percentage_24h,
            peg_deviation: Math.abs(coin.current_price - 1.0) * 100
            }));

            response = {
            total_stablecoins: stablecoins.length,
            stablecoins: stablecoins
            };

            return { response }
        }
    },
    getCurrentPrice: {
        postRequest: async ( { response, struct, payload } ) => {
            if (!response) {
            return { response }
            }

            const analysis = Object.entries(response).map(([coinId, data]) => {
            const price = data.usd;
            const change24h = data.usd_24h_change || 0;
            const deviation = Math.abs(price - 1.0) * 100;

            let stability_status;
            if (deviation < 0.1) stability_status = "Excellent";
            else if (deviation < 0.5) stability_status = "Good";
            else if (deviation < 1.0) stability_status = "Moderate";
            else stability_status = "Poor";

            return {
            coin_id: coinId,
            current_price: price,
            peg_deviation_percent: deviation.toFixed(3),
            change_24h_percent: change24h.toFixed(3),
            stability_status: stability_status
            };
            });

            response = {
            analysis_timestamp: new Date().toISOString(),
            stablecoin_analysis: analysis
            };

            return { response }
        }
    },
    getHistoricalData: {
        postRequest: async ( { response, struct, payload } ) => {
            if (!response || !response.prices) {
            return { response }
            }

            const prices = response.prices;
            const volumes = response.total_volumes || [];

            // Calculate price statistics
            const priceValues = prices.map(p => p[1]);
            const avgPrice = priceValues.reduce((a, b) => a + b, 0) / priceValues.length;
            const maxPrice = Math.max(...priceValues);
            const minPrice = Math.min(...priceValues);
            const maxDeviation = Math.max(
            Math.abs(maxPrice - 1.0),
            Math.abs(minPrice - 1.0)
            ) * 100;

            response = {
            period_summary: {
            average_price: avgPrice.toFixed(6),
            max_price: maxPrice.toFixed(6),
            min_price: minPrice.toFixed(6),
            max_peg_deviation_percent: maxDeviation.toFixed(3),
            total_data_points: prices.length
            },
            price_data: prices.slice(0, 50), // Limit to first 50 points for readability
            volume_data: volumes.slice(0, 50)
            };

            return { response }
        }
    },
    analyzePegStability: {
        postRequest: async ( { response, struct, payload } ) => {
            if (!response) {
            return { response }
            }

            const deviations = Object.entries(response).map(([coinId, data]) => {
            const price = data.usd;
            const change24h = data.usd_24h_change || 0;
            const deviation = Math.abs(price - 1.0) * 100;

            return {
            coin_id: coinId,
            current_price: price,
            deviation_from_peg: deviation.toFixed(4),
            change_24h: change24h.toFixed(4),
            risk_level: deviation < 0.1 ? "Low" : deviation < 0.5 ? "Medium" : "High"
            };
            }).sort((a, b) => parseFloat(b.deviation_from_peg) - parseFloat(a.deviation_from_peg));

            response = {
            analysis_timestamp: new Date().toISOString(),
            most_stable: deviations[deviations.length - 1],
            least_stable: deviations[0],
            all_deviations: deviations
            };

            return { response }
        }
    }
} )
