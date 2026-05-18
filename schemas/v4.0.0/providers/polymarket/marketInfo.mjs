// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'polymarket',
    name: 'Polymarket Predictions',
    description: 'Access prediction market data from Polymarket via the CLOB API — list active markets with filters or retrieve detailed info for a specific market by condition ID.',
    version: '4.0.0',
    docs: ['https://docs.polymarket.com'],
    tags: ['prediction', 'markets', 'trading', 'cacheTtlFrequent'],
    root: 'https://clob.polymarket.com',
    tools: {
        getMarkets: {
            method: 'GET',
            path: '/markets',
            description: 'List prediction markets with optional filters via Polymarket CLOB API. Use condition_id from results in getMarketInfo for detailed market data.',
            parameters: [
                { position: { key: 'status', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(active,resolved)', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(10)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)'] } }
            ],
            tests: [
                { _description: 'List 5 active markets', status: 'active', limit: 10, offset: 0 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: { type: 'array', items: { type: 'object', properties: { enable_order_book: { type: 'boolean' }, active: { type: 'boolean' }, closed: { type: 'boolean' }, archived: { type: 'boolean' }, accepting_orders: { type: 'boolean' }, accepting_order_timestamp: { type: 'number', nullable: true }, minimum_order_size: { type: 'number' }, minimum_tick_size: { type: 'number' }, condition_id: { type: 'string' }, question_id: { type: 'string' }, question: { type: 'string' }, description: { type: 'string' }, market_slug: { type: 'string' }, end_date_iso: { type: 'string' }, game_start_time: { type: 'string' }, seconds_delay: { type: 'number' }, fpmm: { type: 'string' }, maker_base_fee: { type: 'number' }, taker_base_fee: { type: 'number' }, notifications_enabled: { type: 'boolean' }, neg_risk: { type: 'boolean' }, neg_risk_market_id: { type: 'string' }, neg_risk_request_id: { type: 'string' }, icon: { type: 'string' }, image: { type: 'string' }, rewards: { type: 'object' }, is_50_50_outcome: { type: 'boolean' }, tokens: { type: 'array', items: { type: 'object' } }, tags: { type: 'array', items: { type: 'string' } } } } },
                        next_cursor: { type: 'string' },
                        limit: { type: 'number' },
                        count: { type: 'number' }
                    }
                }
            },
        },
        getMarketInfo: {
            method: 'GET',
            path: '/markets/:condition_id',
            description: 'Get detailed information about a specific prediction market via Polymarket — query by condition id. Use condition_ids from getMarkets.',
            parameters: [
                { position: { key: 'condition_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get info for market ID xyz',
                    condition_id: '0x9412b855478d1dc1ba433a18de8bd082dc22b0c3a30c01f307016c2a07c11572'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        enable_order_book: { type: 'boolean' },
                        active: { type: 'boolean' },
                        closed: { type: 'boolean' },
                        archived: { type: 'boolean' },
                        accepting_orders: { type: 'boolean' },
                        accepting_order_timestamp: { type: 'number', nullable: true },
                        minimum_order_size: { type: 'number' },
                        minimum_tick_size: { type: 'number' },
                        condition_id: { type: 'string' },
                        question_id: { type: 'string' },
                        question: { type: 'string' },
                        description: { type: 'string' },
                        market_slug: { type: 'string' },
                        end_date_iso: { type: 'string' },
                        game_start_time: { type: 'string', nullable: true },
                        seconds_delay: { type: 'number' },
                        fpmm: { type: 'string' },
                        maker_base_fee: { type: 'number' },
                        taker_base_fee: { type: 'number' },
                        notifications_enabled: { type: 'boolean' },
                        neg_risk: { type: 'boolean' },
                        neg_risk_market_id: { type: 'string' },
                        neg_risk_request_id: { type: 'string' },
                        icon: { type: 'string' },
                        image: { type: 'string' },
                        rewards: { type: 'object', properties: { rates: { type: 'number', nullable: true }, min_size: { type: 'number' }, max_spread: { type: 'number' } } },
                        is_50_50_outcome: { type: 'boolean' },
                        tokens: { type: 'array', items: { type: 'object', properties: { token_id: { type: 'string' }, outcome: { type: 'string' }, price: { type: 'number' }, winner: { type: 'boolean' } } } },
                        tags: { type: 'array', items: { type: 'string' } }
                    }
                }
            },
        }
    }
}
