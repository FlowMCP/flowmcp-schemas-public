// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'coingecko',
    name: 'CoinGeckoTrending',
    description: 'Retrieve trending cryptocurrency data from CoinGecko — currently trending coins, trending NFT collections, and trending market categories with price and volume.',
    version: '4.0.0',
    docs: ['https://docs.coingecko.com/reference/introduction'],
    tags: ['crypto', 'trending', 'discovery', 'cacheTtlFrequent'],
    root: 'https://api.coingecko.com/api/v3',
    tools: {
        getTrendingCoins: {
            method: 'GET',
            path: '/search/trending',
            description: 'Get the top trending cryptocurrency coins on CoinGecko based on the most popular user searches in the last 24 hours. Returns coin details including name, symbol, market cap rank, price, 24h volume, and 24h price change. Handler extracts and flattens coin data for easy consumption.',
            parameters: [],
            tests: [
                { _description: 'Get top trending coins by search popularity in the last 24 hours' },
                { _description: 'Fetch currently most-searched cryptocurrencies with price data' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        coins: { type: 'array', description: 'Trending coins sorted by search popularity', items: { type: 'object', properties: { item: { type: 'object', description: 'Coin details including id, name, symbol, market_cap_rank, thumb, and nested data with price, volume, market_cap' } } } },
                        nfts: { type: 'array', description: 'Trending NFT collections (included in raw response, handler focuses on coins)', items: { type: 'object', properties: { id: { type: 'string', description: 'NFT collection ID' }, name: { type: 'string', description: 'NFT collection name' }, symbol: { type: 'string', description: 'NFT collection symbol' }, thumb: { type: 'string', description: 'Thumbnail image URL' }, nft_contract_id: { type: 'number', description: 'NFT contract numeric ID' }, native_currency_symbol: { type: 'string', description: 'Native blockchain currency symbol (e.g. ETH)' }, floor_price_in_native_currency: { type: 'number', description: 'Current floor price in native currency' }, floor_price_24h_percentage_change: { type: 'number', description: 'Floor price 24h percentage change' }, data: { type: 'object', description: 'Extended NFT market data' } } } },
                        categories: { type: 'array', description: 'Trending market categories', items: { type: 'object', properties: { id: { type: 'number', description: 'Category numeric ID' }, name: { type: 'string', description: 'Category display name' }, market_cap_1h_change: { type: 'number', description: 'Market cap percentage change in the last hour' }, slug: { type: 'string', description: 'URL-friendly category slug' }, coins_count: { type: 'string', description: 'Number of coins in this category' }, data: { type: 'object', description: 'Extended category market data' } } } }
                    }
                }
            },
        },
        getTrendingNfts: {
            method: 'GET',
            path: '/search/trending',
            description: 'Get the top trending NFT collections on CoinGecko based on recent search activity and market interest. Returns NFT collection details including name, symbol, floor price in native currency, 24h floor price change, and extended market data. Handler extracts the NFT-specific data from the trending endpoint.',
            parameters: [],
            tests: [
                { _description: 'Get top trending NFT collections with floor prices and 24h changes' },
                { _description: 'Fetch currently most-searched NFT collections' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        coins: { type: 'array', description: 'Trending coins (included in raw response, handler focuses on NFTs)', items: { type: 'object', properties: { item: { type: 'object', description: 'Coin item data' } } } },
                        nfts: { type: 'array', description: 'Trending NFT collections sorted by search popularity', items: { type: 'object', properties: { id: { type: 'string', description: 'CoinGecko NFT collection ID' }, name: { type: 'string', description: 'NFT collection display name' }, symbol: { type: 'string', description: 'NFT collection ticker symbol' }, thumb: { type: 'string', description: 'Thumbnail image URL' }, nft_contract_id: { type: 'number', description: 'NFT smart contract numeric identifier' }, native_currency_symbol: { type: 'string', description: 'Native blockchain currency symbol (e.g. ETH, SOL)' }, floor_price_in_native_currency: { type: 'number', description: 'Current floor price denominated in native currency' }, floor_price_24h_percentage_change: { type: 'number', description: 'Floor price percentage change over the last 24 hours' }, data: { type: 'object', description: 'Extended market data including volume and sparkline' } } } },
                        categories: { type: 'array', description: 'Trending categories (included in raw response)', items: { type: 'object', properties: { id: { type: 'number', description: 'Category numeric ID' }, name: { type: 'string', description: 'Category name' }, market_cap_1h_change: { type: 'number', description: 'Market cap 1h change percentage' }, slug: { type: 'string', description: 'URL slug' }, coins_count: { type: 'string', description: 'Coin count in category' }, data: { type: 'object', description: 'Extended data' } } } }
                    }
                }
            },
        },
        getTrendingCategories: {
            method: 'GET',
            path: '/search/trending',
            description: 'Get trending cryptocurrency market categories on CoinGecko. Returns categories experiencing the most search interest, including category name, 1-hour market cap change, coin count, and extended market data with sparklines. Handler extracts category-specific data from the trending endpoint.',
            parameters: [],
            tests: [
                { _description: 'Get trending market categories with 1h market cap changes' },
                { _description: 'Fetch currently trending crypto categories and their coin counts' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        coins: { type: 'array', description: 'Trending coins (included in raw response, handler focuses on categories)', items: { type: 'object', properties: { item: { type: 'object', description: 'Coin item data' } } } },
                        nfts: { type: 'array', description: 'Trending NFTs (included in raw response)', items: { type: 'object', properties: { id: { type: 'string', description: 'NFT ID' }, name: { type: 'string', description: 'NFT name' }, symbol: { type: 'string', description: 'NFT symbol' }, thumb: { type: 'string', description: 'Thumbnail URL' }, nft_contract_id: { type: 'number', description: 'Contract ID' }, native_currency_symbol: { type: 'string', description: 'Native currency' }, floor_price_in_native_currency: { type: 'number', description: 'Floor price' }, floor_price_24h_percentage_change: { type: 'number', description: '24h change' }, data: { type: 'object', description: 'Extended data' } } } },
                        categories: { type: 'array', description: 'Trending market categories sorted by search popularity', items: { type: 'object', properties: { id: { type: 'number', description: 'Category numeric identifier' }, name: { type: 'string', description: 'Category display name (e.g. Meme, DeFi, Layer 1)' }, market_cap_1h_change: { type: 'number', description: 'Category market cap percentage change in the last hour' }, slug: { type: 'string', description: 'URL-friendly category slug for linking' }, coins_count: { type: 'string', description: 'Total number of coins classified in this category' }, data: { type: 'object', description: 'Extended market data including market_cap, volume, sparkline, and 24h market cap change in USD' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getTrendingCoins: {
        postRequest: async ( { response, struct, payload } ) => {
            const items = response['coins']
            .map( ( item ) => {
            item = item['item']
            delete item['small']
            delete item['large']
            item['data']['price_change_percentage_24h'] = item['data']['price_change_percentage_24h']['usd']
            Object
            .entries( item['data'] )
            .forEach( ( [ key, value ] ) => {
            item[ `_data.${key}` ] = value
            delete item['data'][ key ]
            } )
            delete item['data']
            return item
            } )

            response = {
            'total': items.length,
            'items': items
            }

            return { response }
        }
    },
    getTrendingNfts: {
        postRequest: async ( { response, struct, payload } ) => {
            response = response['nfts']
            .map( ( item ) => {
            Object
            .entries( item['data'] )
            .forEach( ( [ key, value ] ) => {
            item[ `_data.${key}` ] = value
            delete item['data'][ key ]
            } )
            delete item['data']
            return item
            } )

            return { response }
        }
    },
    getTrendingCategories: {
        postRequest: async ( { response, struct, payload } ) => {
            response = response['categories']
            .map( ( item ) => {
            item['data']['market_cap_change_percentage_24h'] = item['data']['market_cap_change_percentage_24h']['usd']
            Object
            .entries( item['data'] )
            .forEach( ( [ key, value ] ) => {
            item[ `_data.${key}` ] = value
            delete item['data'][ key ]
            } )
            delete item['data']
            return item
            } )

            return { response }
        }
    }
} )
