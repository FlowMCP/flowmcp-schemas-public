// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'coingecko',
    name: 'CoinGeckoCategories',
    description: 'Retrieve cryptocurrency category data from CoinGecko — list all available category IDs or get detailed market stats (market cap, volume, change) per category.',
    version: '4.0.0',
    docs: ['https://docs.coingecko.com/reference/introduction'],
    tags: ['crypto', 'categories', 'marketdata', 'cacheTtlDaily'],
    root: 'https://api.coingecko.com/api/v3',
    tools: {
        getAvailableCoinCategoryIds: {
            method: 'GET',
            path: '/coins/categories/list',
            description: 'List all available cryptocurrency category IDs and names from CoinGecko. Use these category_id values to query detailed market stats with getCoinCategoryDetailsByIds. Returns lightweight pairs of category_id and display name.',
            parameters: [],
            tests: [
                { _description: 'List all available coin category IDs and names' },
                { _description: 'Get category ID reference list for downstream queries' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            category_id: { type: 'string', description: 'Machine-readable category identifier used as query parameter, e.g. base-meme-coins' },
                            name: { type: 'string', description: 'Human-readable category display name, e.g. Base Meme Coins' }
                        }
                    }
                }
            },
        },
        getCoinCategoryDetailsByIds: {
            method: 'GET',
            path: '/coins/categories',
            description: 'Get detailed market statistics for specific cryptocurrency categories by their IDs. Returns market cap, 24h volume, 24h market cap change percentage, top 3 coins, and last update timestamp for each requested category.',
            parameters: [
                { position: { key: 'category_ids', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'array()', options: [] }, description: 'Array of category IDs to query, e.g. ["base-meme-coins", "meme-token"]. Get valid IDs from getAvailableCoinCategoryIds.' }
            ],
            tests: [
                { _description: 'Get market stats for Base Meme Coins and Meme Token categories', category_ids: ['base-meme-coins', 'meme-token'] },
                { _description: 'Get details for DeFi category', category_ids: ['decentralized-finance-defi'] },
                { _description: 'Get details for Layer 1 and Layer 2 categories', category_ids: ['layer-1', 'layer-2'] }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'Category identifier matching the requested category_id' },
                            name: { type: 'string', description: 'Human-readable category name' },
                            market_cap: { type: 'number', description: 'Total market capitalization in USD for all coins in this category' },
                            market_cap_change_24h: { type: 'number', description: 'Market cap percentage change over the last 24 hours' },
                            content: { type: 'string', description: 'Description or editorial content about this category' },
                            top_3_coins_id: { type: 'array', items: { type: 'string' }, description: 'CoinGecko IDs of the top 3 coins by market cap in this category' },
                            top_3_coins: { type: 'array', items: { type: 'string' }, description: 'Thumbnail image URLs for the top 3 coins in this category' },
                            volume_24h: { type: 'number', description: 'Total 24-hour trading volume in USD for all coins in this category' },
                            updated_at: { type: 'string', description: 'ISO 8601 timestamp of the last data update' }
                        }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getAvailableCoinCategoryIds: {
        postRequest: async ( { response, struct, payload } ) => {
            response = response = {
            'category_ids': response
            .map( ( c ) => c['category_id'] )
            }

            return { response }
        }
    },
    getCoinCategoryDetailsByIds: {
        postRequest: async ( { response, struct, payload } ) => {
            const { category_ids } = payload
            const itemsByCategory = category_ids
            .reduce( ( acc, id ) => {
            const item = response
            .filter( ( c ) => c['id'] === id )
            acc[ id ] = item ? item[ 0 ] : null
            return acc
            }, {} )
            response = itemsByCategory

            return { response }
        }
    }
} )
