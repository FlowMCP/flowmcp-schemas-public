export const main = {
    namespace: 'pumpfun',
    name: 'Pump.fun Token Launch API',
    description: 'Fetches meme token launch data, coin details, live streams, community replies, and creator profiles from Pump.fun on Solana. Use getCoins for discovery, getCoinByMint for details.',
    version: '4.0.0',
    docs: ['https://pump.fun'],
    tags: ['crypto', 'solana', 'memecoins', 'defi', 'cacheTtlFrequent'],
    root: 'https://frontend-api-v3.pump.fun',
    requiredServerParams: [],
    headers: {},
    tools: {
        getCoins: {
            method: 'GET',
            description: 'List Pump.fun meme tokens sorted by last trade time, market cap, or creation date with pagination and NSFW filtering. via pumpfun.',
            path: '/coins',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(50)', 'default(10)', 'optional()'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)', 'optional()'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(last_trade_timestamp,created_timestamp,market_cap)', options: ['default(last_trade_timestamp)', 'optional()'] } },
                { position: { key: 'order', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(DESC,ASC)', options: ['default(DESC)', 'optional()'] } },
                { position: { key: 'includeNsfw', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['default(false)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get recently traded Pump.fun tokens', limit: 5 },
                { _description: 'Get top tokens by market cap', limit: 5, sort: 'market_cap', order: 'DESC' },
                { _description: 'Get newest token launches', limit: 5, sort: 'created_timestamp', order: 'DESC' }
            ],
        },
        getCoinByMint: {
            method: 'GET',
            description: 'Get detailed information for a single Pump.fun token by its Solana mint address including bonding curve state, market cap, creator, trade timestamps, and Raydium pool address. Use mint addresses from getCoins. Use getUserProfile with the creator address for profile data.',
            path: '/coins/:mintAddress',
            parameters: [
                { position: { key: 'mintAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(32)', 'max(44)'] } }
            ],
            tests: [
                { _description: 'Get Pippin token details', mintAddress: 'Dfh5DzRgSvvCFDoYc2ciTkMrbDfRKybA4SoFbPmApump' },
                { _description: 'Get Fartcoin token details', mintAddress: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump' }
            ],
        },
        getCurrentlyLive: {
            method: 'GET',
            description: 'List Pump.fun tokens that currently have active livestreams with viewer counts and stream URLs. via pumpfun.',
            path: '/coins/currently-live',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(50)', 'default(10)', 'optional()'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)', 'optional()'] } },
                { position: { key: 'includeNsfw', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['default(false)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get tokens with active livestreams', limit: 5 }
            ],
        },
        getUserProfile: {
            method: 'GET',
            description: 'Get a Pump.fun user profile by Solana wallet address including username, bio, follower count, and linked social accounts. via pumpfun.',
            path: '/users/:walletAddress',
            parameters: [
                { position: { key: 'walletAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(32)', 'max(44)'] } }
            ],
            tests: [
                { _description: 'Get Pippin creator profile', walletAddress: '8xNnRiuVHbnRe3rWu8zmw3DmAoTcD3zetJs86do1CWzA' }
            ],
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getCoins: {
        postRequest: async ( { response, struct, payload } ) => {
            if( !struct.status || !struct.data ) {
                return { struct, payload }
            }

            const coins = Array.isArray( struct.data ) ? struct.data : []
            if( coins.length === 0 ) {
                return { struct, payload }
            }

            const summarized = coins
                .map( ( coin ) => {
                    const result = {
                        mint: coin['mint'],
                        name: coin['name'],
                        symbol: coin['symbol'],
                        marketCap: coin['market_cap'],
                        usdMarketCap: coin['usd_market_cap'],
                        complete: coin['complete'],
                        creator: coin['creator'],
                        createdAt: coin['created_timestamp'],
                        lastTradeAt: coin['last_trade_timestamp'],
                        replyCount: coin['reply_count'],
                        isCurrentlyLive: coin['is_currently_live'] || false
                    }

                    return result
                } )

            struct.data = {
                count: summarized.length,
                coins: summarized
            }

            return { response }
        }
    },
    getCurrentlyLive: {
        postRequest: async ( { response, struct, payload } ) => {
            if( !struct.status || !struct.data ) {
                return { response }
            }

            const coins = Array.isArray( struct.data ) ? struct.data : []
            if( coins.length === 0 ) {
                return { response }
            }

            const summarized = coins
                .map( ( coin ) => {
                    const result = {
                        mint: coin['mint'],
                        name: coin['name'],
                        symbol: coin['symbol'],
                        marketCap: coin['market_cap'],
                        usdMarketCap: coin['usd_market_cap'],
                        complete: coin['complete'],
                        creator: coin['creator'],
                        createdAt: coin['created_timestamp'],
                        lastTradeAt: coin['last_trade_timestamp'],
                        replyCount: coin['reply_count'],
                        isCurrentlyLive: coin['is_currently_live'] || false
                    }

                    return result
                } )

            response = {
                count: summarized.length,
                coins: summarized
            }

            return { response }
        }
    }
} )
