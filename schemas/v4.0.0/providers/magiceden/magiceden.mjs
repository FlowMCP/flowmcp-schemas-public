// Migrated from v1.2.0 -> v3.0.0
// Category: handlers-clean

export const main = {
    namespace: 'magiceden',
    name: 'Magic Eden Solana API',
    description: 'Fetches NFT collection stats, listings, token metadata, and marketplace activity from Magic Eden, the leading Solana NFT marketplace',
    version: '4.0.0',
    docs: ['https://docs.magiceden.io'],
    tags: ['nft', 'solana', 'marketplace', 'cacheTtlFrequent'],
    root: 'https://api-mainnet.magiceden.dev/v2',
    tools: {
        getCollectionStats: {
            method: 'GET',
            path: '/collections/:symbol/stats',
            description: 'Get floor price, listed count, average price, and total volume statistics for a Solana NFT collection by its symbol. Prices are converted from lamports to SOL by the handler.',
            parameters: [
                { position: { key: 'symbol', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)', 'max(100)'] } }
            ],
            tests: [
                { _description: 'Get stats for Okay Bears collection', symbol: 'okay_bears' },
                { _description: 'Get stats for DeGods collection', symbol: 'degods' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Collection statistics with prices in SOL (converted from lamports)',
                    properties: {
                        symbol: { type: 'string', description: 'Collection symbol identifier' },
                        floorPriceSol: { type: 'number', description: 'Current floor price in SOL' },
                        listedCount: { type: 'number', description: 'Number of NFTs currently listed for sale' },
                        avgPrice24hSol: { type: 'number', description: 'Average sale price over last 24 hours in SOL' },
                        volumeAllSol: { type: 'number', description: 'Total all-time trading volume in SOL' }
                    }
                }
            }
        },
        getCollectionListings: {
            method: 'GET',
            path: '/collections/:symbol/listings',
            description: 'Get active NFT listings for a Solana collection with price, seller, token metadata, and rarity info. Supports pagination.',
            parameters: [
                { position: { key: 'symbol', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)', 'optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(20)', 'default(20)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get first 5 listings for Okay Bears', symbol: 'okay_bears', limit: 5 },
                { _description: 'Get DeGods listings with offset', symbol: 'degods', offset: 0, limit: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Summarized NFT listings for the collection',
                    properties: {
                        totalListings: { type: 'number', description: 'Number of listings returned in this page' },
                        listings: { type: 'array', description: 'Individual NFT listing entries', items: { type: 'object', properties: { tokenMint: { type: 'string', description: 'Solana mint address of the NFT token' }, name: { type: 'string', description: 'NFT name/title' }, image: { type: 'string', description: 'URL to the NFT image' }, collection: { type: 'string', description: 'Collection symbol the NFT belongs to' }, priceSol: { type: 'number', description: 'Listing price in SOL' }, seller: { type: 'string', description: 'Seller wallet address' }, listingSource: { type: 'string', description: 'Marketplace where the NFT is listed (e.g. magiceden_v2)' } } } }
                    }
                }
            }
        },
        getCollectionActivities: {
            method: 'GET',
            path: '/collections/:symbol/activities',
            description: 'Get recent marketplace activity for a Solana NFT collection including sales, listings, bids, and price changes. Supports pagination.',
            parameters: [
                { position: { key: 'symbol', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)', 'optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(20)', 'default(20)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get recent Okay Bears activity', symbol: 'okay_bears', limit: 5 },
                { _description: 'Get recent DeGods activity', symbol: 'degods', limit: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Summarized marketplace activity for the collection',
                    properties: {
                        totalActivities: { type: 'number', description: 'Number of activity events returned' },
                        activities: { type: 'array', description: 'Individual activity events', items: { type: 'object', properties: { type: { type: 'string', description: 'Activity type (e.g. buyNow, list, delist, bid)' }, source: { type: 'string', description: 'Marketplace source of the activity' }, tokenMint: { type: 'string', description: 'Solana mint address of the NFT' }, collection: { type: 'string', description: 'Collection symbol' }, priceSol: { type: 'number', description: 'Transaction price in SOL' }, buyer: { type: 'string', description: 'Buyer wallet address (null for listings)' }, seller: { type: 'string', description: 'Seller wallet address' }, blockTime: { type: 'number', description: 'Unix timestamp of the transaction' }, signature: { type: 'string', description: 'Solana transaction signature' } } } }
                    }
                }
            }
        },
        getTokenListings: {
            method: 'GET',
            path: '/tokens/:tokenMint/listings',
            description: 'Get active marketplace listings for a specific Solana NFT token by its mint address including price, seller, and listing source.',
            parameters: [
                { position: { key: 'tokenMint', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(32)', 'max(44)'] } }
            ],
            tests: [
                { _description: 'Get listings for a specific Okay Bears NFT', tokenMint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Active listings for the specific NFT token',
                    items: {
                        type: 'object',
                        properties: {
                            pdaAddress: { type: 'string', description: 'Program derived address for the listing' },
                            auctionHouse: { type: 'string', description: 'Auction house address' },
                            tokenAddress: { type: 'string', description: 'Token mint address' },
                            tokenMint: { type: 'string', description: 'Token mint address' },
                            seller: { type: 'string', description: 'Seller wallet address' },
                            tokenSize: { type: 'number', description: 'Number of tokens (always 1 for NFTs)' },
                            price: { type: 'number', description: 'Listing price in SOL' }
                        }
                    }
                }
            }
        },
        getTokenActivities: {
            method: 'GET',
            path: '/tokens/:tokenMint/activities',
            description: 'Get transaction history for a specific Solana NFT token by mint address including sales, transfers, listings, and bids.',
            parameters: [
                { position: { key: 'tokenMint', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(32)', 'max(44)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)', 'optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(20)', 'default(20)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get activity history for a specific NFT', tokenMint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Transaction history for the specific NFT token',
                    items: {
                        type: 'object',
                        properties: {
                            type: { type: 'string', description: 'Activity type (buyNow, list, delist, bid, cancelBid)' },
                            source: { type: 'string', description: 'Marketplace source' },
                            tokenMint: { type: 'string', description: 'Token mint address' },
                            collection: { type: 'string', description: 'Collection symbol' },
                            price: { type: 'number', description: 'Transaction price in SOL' },
                            buyer: { type: 'string', description: 'Buyer wallet address' },
                            seller: { type: 'string', description: 'Seller wallet address' },
                            blockTime: { type: 'number', description: 'Unix timestamp' },
                            signature: { type: 'string', description: 'Solana transaction signature' }
                        }
                    }
                }
            }
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getCollectionStats: {
        postRequest: async ( { response, struct, payload } ) => {
            if( !struct.status || !struct.data ) {
                return { response }
            }

            const data = struct.data
            const lamportsPerSol = 1_000_000_000

            response = {
                symbol: data['symbol'] || null,
                floorPriceSol: data['floorPrice'] ? data['floorPrice'] / lamportsPerSol : null,
                listedCount: data['listedCount'] || 0,
                avgPrice24hSol: data['avgPrice24hr'] ? data['avgPrice24hr'] / lamportsPerSol : null,
                volumeAllSol: data['volumeAll'] ? data['volumeAll'] / lamportsPerSol : null
            }

            return { response }
        }
    },
    getCollectionListings: {
        postRequest: async ( { response, struct, payload } ) => {
            if( !struct.status || !struct.data ) {
                return { response }
            }

            const listings = struct.data
            if( !Array.isArray( listings ) ) {
                return { response }
            }

            const items = listings
                .map( ( listing ) => {
                    const result = {
                        tokenMint: listing['tokenMint'] || null,
                        name: listing['token'] ? listing['token']['name'] : null,
                        image: listing['token'] ? listing['token']['image'] : null,
                        collection: listing['token'] ? listing['token']['collection'] : null,
                        priceSol: listing['price'] || null,
                        seller: listing['seller'] || null,
                        listingSource: listing['listingSource'] || null
                    }

                    return result
                } )

            response = {
                totalListings: listings.length,
                listings: items
            }

            return { response }
        }
    },
    getCollectionActivities: {
        postRequest: async ( { response, struct, payload } ) => {
            if( !struct.status || !struct.data ) {
                return { response }
            }

            const activities = struct.data
            if( !Array.isArray( activities ) ) {
                return { response }
            }

            const items = activities
                .map( ( activity ) => {
                    const result = {
                        type: activity['type'] || null,
                        source: activity['source'] || null,
                        tokenMint: activity['tokenMint'] || null,
                        collection: activity['collection'] || null,
                        priceSol: activity['price'] || null,
                        buyer: activity['buyer'] || null,
                        seller: activity['seller'] || null,
                        blockTime: activity['blockTime'] || null,
                        signature: activity['signature'] || null
                    }

                    return result
                } )

            response = {
                totalActivities: activities.length,
                activities: items
            }

            return { response }
        }
    }
} )
