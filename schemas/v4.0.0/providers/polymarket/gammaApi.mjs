// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Module-level code: 94 lines

export const main = {
    namespace: 'polymarket',
    name: 'Polymarket Predictions',
    description: 'FlowMCP schema for Polymarket\'s public Gamma API: search events, list events, and list markets with readable, table-like summaries.',
    version: '4.0.0',
    docs: ['https://gamma-api.polymarket.com'],
    tags: ['predictions', 'markets', 'events', 'cacheTtlFrequent'],
    root: 'https://gamma-api.polymarket.com',
    tools: {
        searchEvents: {
            method: 'GET',
            path: '/public-search',
            description: 'Search for events. Mirrors /public-search with rich post-formatting of results. via Polymarket.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'cache', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['optional()'] } },
                { position: { key: 'events_status', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit_per_type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(10)'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'events_tag', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'regex(^[A-Za-z0-9_,-]+$)'] } },
                { position: { key: 'keep_closed_markets', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'ascending', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['optional()'] } },
                { position: { key: 'search_tags', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['optional()'] } },
                { position: { key: 'search_profiles', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['optional()'] } },
                { position: { key: 'recurrence', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'exclude_tag_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'regex(^[0-9,]+$)'] } },
                { position: { key: 'optimized', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Basic search for bnb with defaults', q: 'bnb', limit_per_type: 10 },
                {
                    _description: 'Search open events; include tags',
                    q: 'election',
                    events_status: 'open',
                    search_tags: 'true',
                    limit_per_type: 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        events: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, ticker: { type: 'string' }, slug: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, startDate: { type: 'string' }, creationDate: { type: 'string' }, endDate: { type: 'string' }, image: { type: 'string' }, icon: { type: 'string' }, active: { type: 'boolean' }, closed: { type: 'boolean' }, archived: { type: 'boolean' }, new: { type: 'boolean' }, featured: { type: 'boolean' }, restricted: { type: 'boolean' }, liquidity: { type: 'number' }, volume: { type: 'number' }, openInterest: { type: 'number' }, createdAt: { type: 'string' }, updatedAt: { type: 'string' }, competitive: { type: 'number' }, volume24hr: { type: 'number' }, volume1wk: { type: 'number' }, volume1mo: { type: 'number' }, volume1yr: { type: 'number' }, enableOrderBook: { type: 'boolean' }, liquidityClob: { type: 'number' }, negRisk: { type: 'boolean' }, commentCount: { type: 'number' }, markets: { type: 'array', items: { type: 'object' } }, tags: { type: 'array', items: { type: 'object' } }, cyom: { type: 'boolean' }, showAllOutcomes: { type: 'boolean' }, showMarketImages: { type: 'boolean' }, enableNegRisk: { type: 'boolean' }, automaticallyActive: { type: 'boolean' }, seriesSlug: { type: 'string' }, negRiskAugmented: { type: 'boolean' }, pendingDeployment: { type: 'boolean' }, deploying: { type: 'boolean' }, requiresTranslation: { type: 'boolean' } } } },
                        pagination: { type: 'object', properties: { hasMore: { type: 'boolean' }, totalResults: { type: 'number' } } }
                    }
                }
            },
        },
        getEvents: {
            method: 'GET',
            path: '/events',
            description: 'List events with embedded markets. Supports date range filtering, slug search, and sorting by volume.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(10)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(0)'] } },
                { position: { key: 'order', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(volume,markets.volume)'] } },
                { position: { key: 'ascending', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['default(false)'] } },
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'regex(^[0-9,]+$)'] } },
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'regex(^[A-Za-z0-9-_,]+$)'] } },
                { position: { key: 'tag_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'closed', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['default(false)'] } },
                { position: { key: 'start_date_min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'start_date_max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'end_date_min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'end_date_max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                {
                    _description: 'Top events by volume',
                    limit: 5,
                    offset: 0,
                    order: 'volume,markets.volume',
                    ascending: 'false',
                    closed: 'false'
                },
                {
                    _description: 'Events ending in H2 2025',
                    limit: 5,
                    end_date_min: '2025-06-01T00:00:00Z',
                    end_date_max: '2025-12-31T23:59:59Z',
                    closed: 'false'
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
                            ticker: { type: 'string' },
                            slug: { type: 'string' },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            resolutionSource: { type: 'string' },
                            startDate: { type: 'string' },
                            creationDate: { type: 'string' },
                            endDate: { type: 'string' },
                            image: { type: 'string' },
                            icon: { type: 'string' },
                            active: { type: 'boolean' },
                            closed: { type: 'boolean' },
                            archived: { type: 'boolean' },
                            new: { type: 'boolean' },
                            featured: { type: 'boolean' },
                            restricted: { type: 'boolean' },
                            liquidity: { type: 'number' },
                            volume: { type: 'number' },
                            openInterest: { type: 'number' },
                            createdAt: { type: 'string' },
                            updatedAt: { type: 'string' },
                            competitive: { type: 'number' },
                            volume24hr: { type: 'number' },
                            volume1wk: { type: 'number' },
                            volume1mo: { type: 'number' },
                            volume1yr: { type: 'number' },
                            enableOrderBook: { type: 'boolean' },
                            liquidityClob: { type: 'number' },
                            negRisk: { type: 'boolean' },
                            commentCount: { type: 'number' },
                            markets: { type: 'array', items: { type: 'object' } },
                            tags: { type: 'array', items: { type: 'object' } },
                            cyom: { type: 'boolean' },
                            showAllOutcomes: { type: 'boolean' },
                            showMarketImages: { type: 'boolean' },
                            enableNegRisk: { type: 'boolean' },
                            automaticallyActive: { type: 'boolean' },
                            gmpChartMode: { type: 'string' },
                            negRiskAugmented: { type: 'boolean' },
                            cumulativeMarkets: { type: 'boolean' },
                            pendingDeployment: { type: 'boolean' },
                            deploying: { type: 'boolean' },
                            requiresTranslation: { type: 'boolean' }
                        }
                    }
                }
            },
        },
        getMarkets: {
            method: 'GET',
            path: '/markets',
            description: 'List markets. Mirrors /markets and returns an ASCII table via Polymarket. Supports id, slug, condition_ids filters.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(10)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(0)'] } },
                { position: { key: 'order', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(volume)'] } },
                { position: { key: 'ascending', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['default(false)'] } },
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'regex(^[0-9,]+$)'] } },
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'regex(^[A-Za-z0-9-_,]+$)'] } },
                { position: { key: 'condition_ids', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'regex(^[A-Za-z0-9,-]+$)'] } },
                { position: { key: 'closed', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['default(false)'] } }
            ],
            tests: [
                { _description: 'Most active markets', limit: 10, offset: 0, order: 'volume', ascending: 'false', closed: 'false' },
                { _description: 'Closed markets only', closed: 'true', limit: 5, offset: 0, order: 'volume', ascending: 'false' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            question: { type: 'string' },
                            conditionId: { type: 'string' },
                            slug: { type: 'string' },
                            resolutionSource: { type: 'string' },
                            endDate: { type: 'string' },
                            liquidity: { type: 'string' },
                            startDate: { type: 'string' },
                            image: { type: 'string' },
                            icon: { type: 'string' },
                            description: { type: 'string' },
                            outcomes: { type: 'string' },
                            outcomePrices: { type: 'string' },
                            volume: { type: 'string' },
                            active: { type: 'boolean' },
                            closed: { type: 'boolean' },
                            marketMakerAddress: { type: 'string' },
                            createdAt: { type: 'string' },
                            updatedAt: { type: 'string' },
                            new: { type: 'boolean' },
                            featured: { type: 'boolean' },
                            submitted_by: { type: 'string' },
                            archived: { type: 'boolean' },
                            resolvedBy: { type: 'string' },
                            restricted: { type: 'boolean' },
                            groupItemTitle: { type: 'string' },
                            questionID: { type: 'string' },
                            enableOrderBook: { type: 'boolean' },
                            orderPriceMinTickSize: { type: 'number' },
                            orderMinSize: { type: 'number' },
                            volumeNum: { type: 'number' },
                            liquidityNum: { type: 'number' },
                            endDateIso: { type: 'string' },
                            startDateIso: { type: 'string' },
                            hasReviewedDates: { type: 'boolean' },
                            gameStartTime: { type: 'string' },
                            secondsDelay: { type: 'number' },
                            clobTokenIds: { type: 'string' },
                            umaBond: { type: 'string' },
                            umaReward: { type: 'string' },
                            volumeClob: { type: 'number' },
                            liquidityClob: { type: 'number' },
                            customLiveness: { type: 'number' },
                            acceptingOrders: { type: 'boolean' },
                            negRisk: { type: 'boolean' },
                            negRiskRequestID: { type: 'string' },
                            events: { type: 'array', items: { type: 'object' } },
                            ready: { type: 'boolean' },
                            funded: { type: 'boolean' },
                            acceptingOrdersTimestamp: { type: 'string' },
                            cyom: { type: 'boolean' },
                            competitive: { type: 'number' },
                            pagerDutyNotificationEnabled: { type: 'boolean' },
                            approved: { type: 'boolean' },
                            rewardsMinSize: { type: 'number' },
                            rewardsMaxSpread: { type: 'number' },
                            spread: { type: 'number' },
                            oneHourPriceChange: { type: 'number' },
                            lastTradePrice: { type: 'number' },
                            bestBid: { type: 'number' },
                            bestAsk: { type: 'number' },
                            automaticallyActive: { type: 'boolean' },
                            clearBookOnStart: { type: 'boolean' },
                            manualActivation: { type: 'boolean' },
                            negRiskOther: { type: 'boolean' },
                            gameId: { type: 'string' },
                            sportsMarketType: { type: 'string' },
                            umaResolutionStatuses: { type: 'string' },
                            pendingDeployment: { type: 'boolean' },
                            deploying: { type: 'boolean' },
                            deployingTimestamp: { type: 'string' },
                            rfqEnabled: { type: 'boolean' },
                            eventStartTime: { type: 'string' },
                            holdingRewardsEnabled: { type: 'boolean' },
                            feesEnabled: { type: 'boolean' },
                            requiresTranslation: { type: 'boolean' },
                            feeType: { type: 'number', nullable: true }
                        }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {

    function truncate( s, n = 100 ) {
        const result = typeof s === 'string'
            ? ( s.length > n ? s.slice( 0, n ) + '...' : s )
            : ''
        return result
    }
    function safeJsonParse( x ) {
        try {
            const result = typeof x === 'string' ? JSON.parse( x ) : Array.isArray( x ) ? x : []
            return result
        } catch {
            return []
        }
    }
    function kvTable( rows, headers ) {
        if( !Array.isArray( rows ) || rows.length === 0 ) {
            return 'No data available'
        }
        const widths = headers
            .map( ( h, i ) => Math.max( h.length, ...rows.map( ( r ) => String( r[i] ?? '' ).length ) ) )
        const line = '+' + widths.map( ( w ) => '-'.repeat( w + 2 ) ).join( '+' ) + '+'
        const fmtRow = ( r ) => '| ' + r
            .map( ( c, i ) => String( c ).padEnd( widths[i], ' ' ) )
            .join( ' | ' ) + ' |'
        const head = fmtRow( headers )
        const body = rows.map( fmtRow ).join( '\n' )
        const result = [line, head, line, body, line].join( '\n' )
        return result
    }
    function formatSingleEvent( ev ) {
        const title = ev?.title ?? 'N/A'
        const closed = String( ev?.closed ?? 'N/A' )
        const endDate = ev?.endDate ?? 'N/A'
        const volume = ev?.volume ?? 'N/A'
        const desc = truncate( ev?.description ?? 'N/A', 160 )
        const markets = Array.isArray( ev?.markets ) ? ev.markets : []
        let marketsSection = 'No markets available for this event.'
        if( markets.length ) {
            const rows = markets
                .map( ( m ) => {
                    const outcomes = safeJsonParse( m?.outcomes ?? '[]' )
                    const outcomePrices = safeJsonParse( m?.outcomePrices ?? '[]' )
                    const options = Object.fromEntries( outcomes.map( ( o, i ) => [o, outcomePrices[i]] ) )
                    const row = [
                        ( m?.question ?? 'N/A' ).slice( 0, 50 ),
                        JSON.stringify( options ),
                        String( m?.closed ?? 'N/A' ),
                        m?.volume ?? 'N/A'
                    ]
                    return row
                } )
            marketsSection = 'Markets:\n' + kvTable( rows, ['Question', 'Options', 'Closed', 'Volume'] )
        }
        const result = [
            `## ${title}`,
            '',
            `Closed: ${closed} | End Date: ${endDate} | Volume: ${volume}`,
            '',
            desc,
            '',
            marketsSection
        ].join( '\n' )
        return result
    }
    function formatEventsArray( arr ) {
        if( !Array.isArray( arr ) || arr.length === 0 ) {
            return 'No events found.'
        }
        const result = arr
            .map( ( ev ) => formatSingleEvent( ev ) )
            .join( '\n\n' )
        return result
    }
    function formatMarketsArray( arr ) {
        if( !Array.isArray( arr ) || arr.length === 0 ) {
            return 'No data available'
        }
        const rows = arr
            .map( ( item ) => {
                const outcomes = safeJsonParse( item?.outcomes ?? '[]' )
                const outcomePrices = safeJsonParse( item?.outcomePrices ?? '[]' )
                const options = Object.fromEntries( outcomes.map( ( o, i ) => [o, outcomePrices[i]] ) )
                const row = [
                    ( item?.question ?? 'N/A' ).slice( 0, 50 ),
                    JSON.stringify( options ),
                    item?.endDate ?? 'N/A',
                    item?.volume ?? 'N/A',
                    String( item?.closed ?? 'N/A' )
                ]
                return row
            } )
        const result = kvTable( rows, ['Question', 'Options', 'End Date', 'Volume', 'Closed'] )
        return result
    }

    return {
        searchEvents: {
            postRequest: async ( { response, struct, payload } ) => {
                const events = struct?.data?.events ?? []
                response = { text: formatEventsArray( events ) }

                return { response }
            }
        },
        getEvents: {
            postRequest: async ( { response, struct, payload } ) => {
                const events = Array.isArray( struct?.data ) ? response : []
                response = { text: formatEventsArray( events ) }

                return { response }
            }
        },
        getMarkets: {
            postRequest: async ( { response, struct, payload } ) => {
                const markets = Array.isArray( struct?.data ) ? response : []
                response = { text: formatMarketsArray( markets ) }

                return { response }
            }
        }
    }
}
