// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'coinmarketcap',
    name: 'CoinMarketCap Categories',
    description: 'Retrieve cryptocurrency category data from CoinMarketCap — list categories, get category details, map coin IDs, fetch metadata, and query latest market quotes. Use getCategories to browse categories, then getCategory with a category ID for details. Use getIdMap to find coin IDs for getMetadataV2 and getQuotesLatestV2.',
    version: '4.0.0',
    docs: ['https://coinmarketcap.com/api/documentation/v1/'],
    tags: ['crypto', 'categories', 'marketdata', 'cacheTtlDaily'],
    root: 'https://pro-api.coinmarketcap.com',
    requiredServerParams: ['CMC_API_KEY'],
    headers: {
        'X-CMC_PRO_API_KEY': '{{CMC_API_KEY}}'
    },
    tools: {
        getCategories: {
            method: 'GET',
            path: '/v1/cryptocurrency/categories',
            description: 'Get a list of all cryptocurrency categories via CoinMarketCap. Supports start, limit, id filters. Category IDs from this response can be used in getCategory for detailed info.',
            parameters: [
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'optional()'], description: 'Pagination offset (1-based index of the first result)' } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(5000)', 'optional()'], description: 'Maximum number of categories to return (1-5000)' } },
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Filter by one or more comma-separated category IDs' } },
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Filter by one or more comma-separated category slugs' } },
                { position: { key: 'symbol', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Filter by one or more comma-separated cryptocurrency symbols' } }
            ],
            tests: [
                { _description: 'Fetch categories with default pagination', limit: 5 },
                { _description: 'Fetch first 5 categories', limit: 5 },
                { _description: 'Fetch categories starting at offset 10', start: 10, limit: 3 }
            ],
            output: {
                description: 'List of cryptocurrency categories with market cap, volume, and price change metrics',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CMC API response wrapper containing a data array of categories and a status object with request metadata',
                    properties: {
                        data: { type: 'array', description: 'Array of cryptocurrency category objects', items: { type: 'object', properties: { id: { type: 'string', description: 'Unique category identifier (e.g. 605e2ce9d41eae1066535f7c). Use in getCategory.' }, name: { type: 'string', description: 'Category display name (e.g. DeFi, Layer 1, Meme)' }, title: { type: 'string', description: 'Category title for display purposes' }, description: { type: 'string', description: 'Brief text explaining what this category represents' }, volume: { type: 'number', description: 'Total 24h trading volume across all tokens in this category in USD' }, num_tokens: { type: 'number', description: 'Number of cryptocurrencies belonging to this category' }, avg_price_change: { type: 'number', description: 'Average 24h price change percentage across all tokens in the category' }, market_cap: { type: 'number', description: 'Total market capitalization of all tokens in this category in USD' }, market_cap_change: { type: 'number', description: '24h change in total market capitalization as a percentage' }, volume_change: { type: 'number', description: '24h change in trading volume as a percentage' }, last_updated: { type: 'string', description: 'ISO 8601 timestamp of the last data update' } } } },
                        status: { type: 'object', description: 'API request metadata including error state and credit usage', properties: { timestamp: { type: 'string', description: 'ISO 8601 timestamp when the request was processed' }, error_code: { type: 'number', description: 'Error code (0 = success, non-zero = error)' }, error_message: { type: 'string', nullable: true, description: 'Human-readable error message, null on success' }, elapsed: { type: 'number', description: 'Time in milliseconds to process the request' }, credit_count: { type: 'number', description: 'Number of API credits consumed by this request' }, notice: { type: 'string', nullable: true, description: 'Optional notice or deprecation warning from CMC' } } }
                    }
                }
            },
        },
        getCategory: {
            method: 'GET',
            path: '/v1/cryptocurrency/category',
            description: 'Get information about a single cryptocurrency category via CoinMarketCap. Supports start, limit, convert filters. Use category IDs from getCategories.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [], description: 'Category ID to retrieve (e.g. 605e2ce9d41eae1066535f7c)' } },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'optional()'], description: 'Pagination offset for coins within the category (1-based)' } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(1000)', 'optional()'], description: 'Maximum number of coins to return within the category (1-1000)' } },
                { position: { key: 'convert', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Fiat or cryptocurrency to convert prices into (e.g. USD, EUR, BTC)' } },
                { position: { key: 'convert_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'CoinMarketCap currency ID for price conversion (alternative to convert)' } }
            ],
            tests: [
                { _description: 'Fetch a category by ID', id: '605e2ce9d41eae1066535f7c' },
                { _description: 'Fetch category with limited coins', id: '605e2ce9d41eae1066535f7c', limit: 5 },
                { _description: 'Fetch category converted to EUR', id: '605e2ce9d41eae1066535f7c', convert: 'EUR' }
            ],
            output: {
                description: 'Detailed category information including list of coins with market data',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CMC API response wrapper containing category detail data and request status',
                    properties: {
                        data: { type: 'object', description: 'Category detail object with embedded coin listings', properties: { id: { type: 'string', description: 'Unique category identifier' }, name: { type: 'string', description: 'Category display name' }, title: { type: 'string', description: 'Category title for display' }, description: { type: 'string', description: 'Explanation of what this category represents' }, volume: { type: 'number', description: 'Total 24h trading volume across all tokens in USD' }, coins: { type: 'array', description: 'Paginated list of cryptocurrency objects belonging to this category with market data', items: { type: 'object' } }, num_tokens: { type: 'number', description: 'Total count of tokens in the category' }, last_updated: { type: 'string', description: 'ISO 8601 timestamp of last data update' }, avg_price_change: { type: 'number', description: 'Average 24h price change percentage across all category tokens' }, market_cap: { type: 'number', description: 'Total market cap in USD' }, market_cap_change: { type: 'number', description: '24h market cap change percentage' }, volume_change: { type: 'number', description: '24h volume change percentage' } } },
                        status: { type: 'object', description: 'API request metadata including error state and credit usage', properties: { timestamp: { type: 'string', description: 'ISO 8601 timestamp when request was processed' }, error_code: { type: 'number', description: 'Error code (0 = success)' }, error_message: { type: 'string', nullable: true, description: 'Error message, null on success' }, elapsed: { type: 'number', description: 'Processing time in milliseconds' }, credit_count: { type: 'number', description: 'API credits consumed' }, notice: { type: 'string', nullable: true, description: 'Optional notice from CMC' } } }
                    }
                }
            },
        },
        getIdMap: {
            method: 'GET',
            path: '/v1/cryptocurrency/map',
            description: 'Get a mapping of all cryptocurrencies to unique CoinMarketCap IDs. Optional filters: listing_status, start, limit, sort, symbol, aux. Use returned IDs in getMetadataV2 and getQuotesLatestV2.',
            parameters: [
                { position: { key: 'listing_status', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(active,inactive,untracked)', options: ['optional()'], description: 'Filter by listing status: active, inactive, or untracked' } },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'optional()'], description: 'Pagination offset (1-based index of the first result)' } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(5000)', 'optional()'], description: 'Maximum number of results to return (1-5000)' } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(id,cmc_rank)', options: ['optional()'], description: 'Sort results by CoinMarketCap ID or rank' } },
                { position: { key: 'symbol', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Filter by one or more comma-separated cryptocurrency symbols (e.g. BTC,ETH)' } },
                { position: { key: 'aux', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Comma-separated list of supplemental data fields: platform, first_historical_data, last_historical_data, is_active, status' } }
            ],
            tests: [
                { _description: 'Fetch active cryptocurrency ID map', listing_status: 'active' },
                { _description: 'Fetch limited ID map sorted by cmc_rank', sort: 'cmc_rank', limit: 50 },
                { _description: 'Fetch ID map for BTC and ETH', symbol: 'BTC,ETH' }
            ],
            output: {
                description: 'Mapping of cryptocurrencies to CMC IDs with basic metadata for cross-referencing with other endpoints',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CMC API response with array of cryptocurrency ID mappings and request status',
                    properties: {
                        status: { type: 'object', description: 'API request metadata', properties: { timestamp: { type: 'string', description: 'ISO 8601 timestamp when request was processed' }, error_code: { type: 'number', description: 'Error code (0 = success)' }, error_message: { type: 'string', nullable: true, description: 'Error message, null on success' }, elapsed: { type: 'number', description: 'Processing time in milliseconds' }, credit_count: { type: 'number', description: 'API credits consumed' }, notice: { type: 'string', nullable: true, description: 'Optional notice from CMC' } } },
                        data: { type: 'array', description: 'Array of cryptocurrency mapping objects', items: { type: 'object', properties: { id: { type: 'number', description: 'Unique CMC cryptocurrency ID. Use in getMetadataV2 and getQuotesLatestV2.' }, rank: { type: 'number', description: 'Current CMC market cap rank' }, name: { type: 'string', description: 'Full cryptocurrency name (e.g. Bitcoin)' }, symbol: { type: 'string', description: 'Ticker symbol (e.g. BTC)' }, slug: { type: 'string', description: 'URL-friendly identifier (e.g. bitcoin)' }, is_active: { type: 'number', description: '1 if actively traded, 0 if inactive' }, status: { type: 'number', description: 'Listing status code' }, first_historical_data: { type: 'string', description: 'ISO 8601 timestamp of earliest available data' }, last_historical_data: { type: 'string', description: 'ISO 8601 timestamp of most recent data' }, platform: { type: 'string', nullable: true, description: 'Platform blockchain info for tokens (null for native coins like BTC)' } } } }
                    }
                }
            },
        },
        getMetadataV2: {
            method: 'GET',
            path: '/v2/cryptocurrency/info',
            description: 'Get static metadata for one or more cryptocurrencies including logo, description, website URLs, and social links. Use IDs from getIdMap or symbols directly.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'One or more comma-separated CoinMarketCap cryptocurrency IDs (e.g. 1,2)' } },
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'One or more comma-separated cryptocurrency slugs (e.g. bitcoin,ethereum)' } },
                { position: { key: 'symbol', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'One or more comma-separated cryptocurrency symbols (e.g. BTC,ETH)' } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Token contract address to look up (e.g. for ERC-20 tokens)' } },
                { position: { key: 'skip_invalid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'], description: 'When true, skip invalid IDs/symbols instead of returning an error' } },
                { position: { key: 'aux', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Comma-separated supplemental fields: urls, logo, description, tags, platform, date_added, notice, status' } }
            ],
            tests: [
                { _description: 'Fetch metadata for Bitcoin by ID', id: '1' },
                { _description: 'Fetch metadata for Ethereum by slug', slug: 'ethereum' },
                { _description: 'Fetch metadata by symbol and allow skipping invalids', symbol: 'BTC,ETH', skip_invalid: true }
            ],
            output: {
                description: 'Static cryptocurrency metadata including logos, descriptions, social links, and platform info keyed by CMC ID',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CMC API response with cryptocurrency metadata keyed by ID and request status',
                    properties: {
                        status: { type: 'object', description: 'API request metadata', properties: { timestamp: { type: 'string', description: 'ISO 8601 timestamp when request was processed' }, error_code: { type: 'number', description: 'Error code (0 = success)' }, error_message: { type: 'string', nullable: true, description: 'Error message, null on success' }, elapsed: { type: 'number', description: 'Processing time in milliseconds' }, credit_count: { type: 'number', description: 'API credits consumed' }, notice: { type: 'string', nullable: true, description: 'Optional notice from CMC' } } },
                        data: { type: 'object', description: 'Map of CMC ID strings to cryptocurrency metadata objects (e.g. {"1": {...}, "1027": {...}})', properties: { '1': { type: 'object', description: 'Example entry for Bitcoin (ID 1) — actual keys are dynamic CMC IDs', properties: { id: { type: 'number', description: 'CMC cryptocurrency ID' }, name: { type: 'string', description: 'Full cryptocurrency name' }, symbol: { type: 'string', description: 'Ticker symbol' }, category: { type: 'string', description: 'Asset category (e.g. coin, token)' }, description: { type: 'string', description: 'Project description text' }, slug: { type: 'string', description: 'URL-friendly identifier' }, logo: { type: 'string', description: 'URL to the cryptocurrency logo image' }, subreddit: { type: 'string', description: 'Associated subreddit name' }, notice: { type: 'string', description: 'Any active notices for this cryptocurrency' }, tags: { type: 'array', description: 'Array of tag slugs (e.g. mineable, pow)', items: { type: 'string' } }, 'tag-names': { type: 'array', description: 'Human-readable tag names corresponding to tags array', items: { type: 'string' } }, 'tag-groups': { type: 'array', description: 'Tag group categories', items: { type: 'string' } }, urls: { type: 'object', description: 'Map of URL types to arrays of URLs (website, twitter, reddit, etc.)' }, platform: { type: 'string', nullable: true, description: 'Platform blockchain for tokens (null for native coins)' }, date_added: { type: 'string', description: 'ISO 8601 date when added to CMC' }, twitter_username: { type: 'string', description: 'Official Twitter/X username' }, is_hidden: { type: 'number', description: '1 if hidden from listings, 0 otherwise' }, date_launched: { type: 'string', description: 'ISO 8601 launch date' }, contract_address: { type: 'array', description: 'Token contract addresses across chains', items: { type: 'string' } }, self_reported_circulating_supply: { type: 'number', nullable: true, description: 'Self-reported circulating supply (may differ from CMC calculation)' }, self_reported_tags: { type: 'string', nullable: true, description: 'Self-reported project tags' }, self_reported_market_cap: { type: 'number', nullable: true, description: 'Self-reported market cap in USD' }, infinite_supply: { type: 'boolean', description: 'Whether the token has no maximum supply cap' } } } } }
                    }
                }
            },
        },
        getQuotesLatestV2: {
            method: 'GET',
            path: '/v2/cryptocurrency/quotes/latest',
            description: 'Get the latest market quote for one or more cryptocurrencies, supporting multiple conversions. Use IDs from getIdMap or symbols directly.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'One or more comma-separated CoinMarketCap cryptocurrency IDs (e.g. 1,1027)' } },
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'One or more comma-separated cryptocurrency slugs (e.g. bitcoin,ethereum)' } },
                { position: { key: 'symbol', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'One or more comma-separated cryptocurrency symbols (e.g. BTC,ETH)' } },
                { position: { key: 'convert', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Fiat or cryptocurrency to convert quotes into (e.g. USD, EUR, BTC)' } },
                { position: { key: 'convert_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'CoinMarketCap currency ID for price conversion (alternative to convert)' } },
                { position: { key: 'aux', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Comma-separated supplemental fields: num_market_pairs, cmc_rank, date_added, tags, platform, max_supply, circulating_supply, total_supply' } },
                { position: { key: 'skip_invalid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'], description: 'When true, skip invalid IDs/symbols instead of returning an error' } }
            ],
            tests: [
                { _description: 'Fetch latest quote for Bitcoin by ID', id: '1' },
                { _description: 'Fetch latest quote for Ethereum and Bitcoin by symbol', symbol: 'BTC,ETH', convert: 'USD' },
                { _description: 'Fetch quote using slug and skip invalids', slug: 'bitcoin,ethereum', skip_invalid: true }
            ],
            output: {
                description: 'Latest market quotes for requested cryptocurrencies keyed by CMC ID, with price, volume, and market cap data',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CMC API response with quote data keyed by cryptocurrency ID and request status',
                    properties: {
                        status: { type: 'object', description: 'API request metadata', properties: { timestamp: { type: 'string', description: 'ISO 8601 timestamp when request was processed' }, error_code: { type: 'number', description: 'Error code (0 = success)' }, error_message: { type: 'string', nullable: true, description: 'Error message, null on success' }, elapsed: { type: 'number', description: 'Processing time in milliseconds' }, credit_count: { type: 'number', description: 'API credits consumed' }, notice: { type: 'string', nullable: true, description: 'Optional notice from CMC' } } },
                        data: { type: 'object', description: 'Map of CMC ID strings to cryptocurrency quote objects (e.g. {"1": {...}, "1027": {...}})', properties: { '1': { type: 'object', description: 'Example entry for Bitcoin (ID 1) — actual keys are dynamic CMC IDs', properties: { id: { type: 'number', description: 'CMC cryptocurrency ID' }, name: { type: 'string', description: 'Full cryptocurrency name' }, symbol: { type: 'string', description: 'Ticker symbol' }, slug: { type: 'string', description: 'URL-friendly identifier' }, num_market_pairs: { type: 'number', description: 'Number of active trading pairs across exchanges' }, date_added: { type: 'string', description: 'ISO 8601 date when added to CMC' }, tags: { type: 'array', description: 'Array of tag objects categorizing the cryptocurrency', items: { type: 'object' } }, max_supply: { type: 'number', description: 'Maximum possible supply (e.g. 21M for BTC)' }, circulating_supply: { type: 'number', description: 'Currently circulating coin supply' }, total_supply: { type: 'number', description: 'Total minted supply including locked/reserved' }, is_active: { type: 'number', description: '1 if actively traded, 0 if inactive' }, infinite_supply: { type: 'boolean', description: 'Whether the token has no maximum supply cap' }, minted_market_cap: { type: 'number', description: 'Market cap based on minted supply' }, platform: { type: 'string', nullable: true, description: 'Platform blockchain for tokens (null for native coins)' }, cmc_rank: { type: 'number', description: 'Current CMC market cap rank' }, is_fiat: { type: 'number', description: '1 if fiat currency, 0 if cryptocurrency' }, self_reported_circulating_supply: { type: 'number', nullable: true, description: 'Self-reported circulating supply' }, self_reported_market_cap: { type: 'number', nullable: true, description: 'Self-reported market cap in USD' }, tvl_ratio: { type: 'string', nullable: true, description: 'Market cap to TVL ratio (for DeFi tokens)' }, last_updated: { type: 'string', description: 'ISO 8601 timestamp of last price update' }, quote: { type: 'object', description: 'Map of currency codes to price/volume/market_cap objects (e.g. {"USD": {price, volume_24h, ...}})' } } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getCategories: {
        preRequest: async ( { struct, payload } ) => {
            // Modify the response structure or struct if needed
            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            // Modify the response structure or payload if needed
            return { response }
        }
    },
    getCategory: {
        postRequest: async ( { response, struct, payload } ) => {
            // Modify the response structure or payload if needed
            return { response }
        }
    },
    getIdMap: {
        postRequest: async ( { response, struct, payload } ) => {
            // Modify the response structure or payload if needed
            return { response }
        }
    },
    getMetadataV2: {
        postRequest: async ( { response, struct, payload } ) => {
            // Modify the response structure or payload if needed
            return { response }
        }
    },
    getQuotesLatestV2: {
        postRequest: async ( { response, struct, payload } ) => {
            // Modify the response structure or payload if needed
            return { response }
        }
    }
} )
