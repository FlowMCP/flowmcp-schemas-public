export const main = {
    namespace: 'cheapshark',
    name: 'CheapShark Game Deals',
    description: 'Access CheapShark, a game deals aggregator that tracks prices across 30+ digital PC game stores. Search deals by price, store, rating, or title. Compare prices across Steam, GOG, Humble Bundle, Epic Games, and more. Get historical lowest prices and deal alerts. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://apidocs.cheapshark.com/'],
    tags: ['entertainment', 'gaming', 'shopping', 'opendata', 'cacheTtlFrequent'],
    root: 'https://www.cheapshark.com',
    requiredServerParams: [],
    headers: {},
    tools: {
        getDeals: {
            method: 'GET',
            path: '/api/1.0/deals',
            description: 'Get current game deals with filters. Filter by store, price range, Metacritic score, Steam rating, and more. Returns sale price, normal price, savings percentage, and store info. Sorted by deal rating by default.',
            parameters: [
                { position: { key: 'storeID', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Store ID to filter deals by (1=Steam, 2=GamersGate, 3=GreenManGaming, etc.)' },
                { position: { key: 'upperPrice', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Maximum sale price in USD to filter deals' },
                { position: { key: 'lowerPrice', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] }, description: 'Minimum sale price in USD to filter deals (default 0)' },
                { position: { key: 'metacritic', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Minimum Metacritic score (0-100) to filter deals' },
                { position: { key: 'sortBy', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(DealRating,Title,Savings,Price,Metacritic,Reviews,Release,Store,Recent)', options: ['optional()', 'default(DealRating)'] }, description: 'Sort order for results: DealRating, Title, Savings, Price, Metacritic, Reviews, Release, Store, or Recent' },
                { position: { key: 'pageSize', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(60)', 'max(60)'] }, description: 'Number of deals per page (max 60, default 60)' },
                { position: { key: 'pageNumber', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] }, description: 'Page number for pagination, starting at 0' }
            ],
            tests: [
                { _description: 'Best deals under $15', upperPrice: 15, pageSize: 5 },
                { _description: 'Steam deals over 80 Metacritic', storeID: '1', metacritic: 80, pageSize: 5 },
                { _description: 'Free games sorted by rating', upperPrice: 0, lowerPrice: 0, sortBy: 'DealRating', pageSize: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', description: 'List of game deals matching the filter criteria', items: { type: 'object', properties: { internalName: { type: 'string', description: 'Normalized game name without spaces or special characters' }, title: { type: 'string', description: 'Display title of the game' }, dealID: { type: 'string', description: 'Unique deal identifier for this specific store listing' }, storeID: { type: 'string', description: 'Store ID (1=Steam, 2=GamersGate, etc.), use listStores for full mapping' }, gameID: { type: 'string', description: 'CheapShark internal game ID, use with getGameDetails' }, salePrice: { type: 'string', description: 'Current sale price in USD' }, normalPrice: { type: 'string', description: 'Regular retail price in USD' }, isOnSale: { type: 'string', description: 'Whether the game is currently on sale (1 = yes, 0 = no)' }, savings: { type: 'string', description: 'Savings percentage off normal price' }, metacriticScore: { type: 'string', description: 'Metacritic review score (0-100), 0 if not rated' }, steamRatingPercent: { type: 'string', description: 'Steam user rating percentage, 0 if not available' }, releaseDate: { type: 'number', description: 'Unix timestamp of game release date' }, thumb: { type: 'string', description: 'Thumbnail image URL' } } } }
            }
        },
        searchGames: {
            method: 'GET',
            path: '/api/1.0/games',
            description: 'Search games by title. Returns game info with cheapest current price across all stores and the cheapest deal ID for direct linking.',
            parameters: [
                { position: { key: 'title', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Game title or partial title to search for' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(60)', 'max(60)'] }, description: 'Maximum number of results to return (max 60, default 60)' }
            ],
            tests: [
                { _description: 'Search Batman games', title: 'batman', limit: 5 },
                { _description: 'Search Witcher games', title: 'witcher', limit: 5 },
                { _description: 'Search Portal games', title: 'portal', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', description: 'List of games matching the title search', items: { type: 'object', properties: { gameID: { type: 'string', description: 'CheapShark internal game ID for use with getGameDetails' }, steamAppID: { type: 'string', description: 'Steam application ID, null if not on Steam' }, cheapest: { type: 'string', description: 'Current cheapest price in USD across all tracked stores' }, cheapestDealID: { type: 'string', description: 'Deal ID for the cheapest current offer' }, external: { type: 'string', description: 'External display title of the game' }, internalName: { type: 'string', description: 'Normalized internal name without spaces' }, thumb: { type: 'string', description: 'Thumbnail image URL' } } } }
            }
        },
        getGameDetails: {
            method: 'GET',
            path: '/api/1.0/games',
            description: 'Get detailed game info by game ID. Returns title, cheapest price ever recorded, and current deals from all stores with prices and savings percentages.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] }, description: 'CheapShark internal game ID number' }
            ],
            tests: [
                { _description: 'Get LEGO Batman (612)', id: 612 },
                { _description: 'Get Portal 2 details (218)', id: 218 },
                { _description: 'Get game details (1)', id: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Detailed game information with all current store deals', properties: { info: { type: 'object', description: 'Basic game metadata', properties: { title: { type: 'string', description: 'Game display title' }, steamAppID: { type: 'string', description: 'Steam application ID, null if not on Steam' }, thumb: { type: 'string', description: 'Thumbnail image URL' } } }, cheapestPriceEver: { type: 'object', description: 'Historical lowest price across all tracked stores', properties: { price: { type: 'string', description: 'Lowest price ever recorded in USD' }, date: { type: 'number', description: 'Unix timestamp when the lowest price was recorded' } } }, deals: { type: 'array', description: 'Current deals from all tracked stores', items: { type: 'object', properties: { storeID: { type: 'string', description: 'Store ID, use listStores for name mapping' }, dealID: { type: 'string', description: 'Unique deal identifier for this store listing' }, price: { type: 'string', description: 'Current sale price in USD' }, retailPrice: { type: 'string', description: 'Regular retail price in USD' }, savings: { type: 'string', description: 'Savings percentage off retail price' } } } } } }
            }
        },
        listStores: {
            method: 'GET',
            path: '/api/1.0/stores',
            description: 'List all tracked game stores. Returns store names, IDs, active status, and image URLs for Steam, GOG, Humble Bundle, Epic, Fanatical, and 25+ more stores.',
            parameters: [],
            tests: [
                { _description: 'List all stores' },
                { _description: 'List all tracked game stores' },
                { _description: 'Get complete store directory' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', description: 'All tracked digital game stores', items: { type: 'object', properties: { storeID: { type: 'string', description: 'Numeric store identifier used in deal results' }, storeName: { type: 'string', description: 'Store display name (e.g. Steam, GOG, Epic Games Store)' }, isActive: { type: 'number', description: 'Whether the store is currently tracked (1 = active, 0 = inactive)' }, images: { type: 'object', description: 'Store branding images', properties: { banner: { type: 'string', description: 'Banner image path' }, logo: { type: 'string', description: 'Logo image path' }, icon: { type: 'string', description: 'Icon image path' } } } } } }
            }
        }
    }
}
