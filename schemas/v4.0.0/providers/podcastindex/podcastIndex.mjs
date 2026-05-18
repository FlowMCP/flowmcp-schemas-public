export const main = {
    namespace: 'podcastindex',
    name: 'Podcast Index',
    description: 'Search and discover podcasts and episodes from a catalog of 4M+ podcasts. Includes trending feeds, recent episodes, live streams, and category browsing.',
    docs: ['https://podcastindex-org.github.io/docs-api/'],
    tags: ['podcast', 'audio', 'media', 'search', 'discovery', 'cacheTtlFrequent'],
    version: '4.0.0',
    root: 'https://api.podcastindex.org/api/1.0',
    requiredServerParams: ['PODCASTINDEX_API_KEY', 'PODCASTINDEX_API_SECRET'],
    headers: {
        'User-Agent': 'FlowMCP/1.0',
        'X-Auth-Key': '{{PODCASTINDEX_API_KEY}}',
        'X-PI-Secret-Internal': '{{PODCASTINDEX_API_SECRET}}'
    },
    tools: {
        searchByTerm: {
            method: 'GET',
            path: '/search/byterm',
            description: 'Search for podcasts by keyword or phrase. Returns matching podcast feeds with metadata including title, description, author, artwork, and categories.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] } },
                { position: { key: 'clean', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'fulltext', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for technology podcasts', q: 'technology', max: 5 },
                { _description: 'Search for true crime podcasts', q: 'true crime', max: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status' },
                        data: { type: 'object', description: 'Response payload' }
                    }
                }
            },
        },
        searchByPerson: {
            method: 'GET',
            path: '/search/byperson',
            description: 'Search for podcasts and episodes mentioning a specific person in tags, titles, or descriptions.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] } },
                { position: { key: 'fulltext', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for podcasts with Lex Fridman', q: 'Lex Fridman', max: 5 },
                { _description: 'Search for podcasts with Tim Ferriss', q: 'Tim Ferriss', max: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status' },
                        data: { type: 'object', description: 'Response payload' }
                    }
                }
            },
        },
        getPodcastByFeedId: {
            method: 'GET',
            path: '/podcasts/byfeedid',
            description: 'Get complete podcast feed information by PodcastIndex feed ID. Returns title, description, author, artwork, categories, value block, and funding data.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get podcast details for Podcasting 2.0 (feed 920666)', id: 920666 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status' },
                        data: { type: 'object', description: 'Response payload' }
                    }
                }
            },
        },
        getEpisodesByFeedId: {
            method: 'GET',
            path: '/episodes/byfeedid',
            description: 'Get episodes for a podcast by feed ID. Returns episodes in reverse chronological order with enclosure URLs, duration, and metadata.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] } },
                { position: { key: 'since', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get latest episodes for Podcasting 2.0', id: 920666, max: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status' },
                        data: { type: 'object', description: 'Response payload' }
                    }
                }
            },
        },
        getTrendingPodcasts: {
            method: 'GET',
            path: '/podcasts/trending',
            description: 'Get currently trending podcasts. Supports filtering by language and category.',
            parameters: [
                { position: { key: 'max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'lang', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'cat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'notcat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get top 5 trending podcasts', max: 5 },
                { _description: 'Get trending English podcasts', max: 5, lang: 'en' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status' },
                        data: { type: 'object', description: 'Response payload' }
                    }
                }
            },
        },
        getRecentEpisodes: {
            method: 'GET',
            path: '/recent/episodes',
            description: 'Get the most recently published podcast episodes globally. Supports language filtering and pagination.',
            parameters: [
                { position: { key: 'max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(1000)'] } },
                { position: { key: 'before', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'lang', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'excludeString', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get 5 most recent episodes', max: 5 },
                { _description: 'Get recent German episodes', max: 5, lang: 'de' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status' },
                        data: { type: 'object', description: 'Response payload' }
                    }
                }
            },
        },
        getLiveEpisodes: {
            method: 'GET',
            path: '/episodes/live',
            description: 'Get currently live podcast episodes from podcast:liveitem tags.',
            parameters: [
                { position: { key: 'max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } }
            ],
            tests: [
                { _description: 'Get live episodes', max: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status' },
                        data: { type: 'object', description: 'Response payload' }
                    }
                }
            },
        },
        getCategories: {
            method: 'GET',
            path: '/categories/list',
            description: 'Get the complete list of supported podcast categories with their IDs and names.',
            parameters: [],
            tests: [
                { _description: 'Get all podcast categories' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status' },
                        data: { type: 'object', description: 'Response payload' }
                    }
                }
            },
        }
    },
}

export const handlers = ( { sharedLists, libraries } ) => ( {
    searchByTerm: {
        preRequest: async ( { struct, payload } ) => {
            // REV-19: FlowMCP v3 — extract keys from headers (auto-interpolated from requiredServerParams)
            const apiKey = struct['headers']['X-Auth-Key']
            const apiSecret = struct['headers']['X-PI-Secret-Internal']
            delete struct['headers']['X-PI-Secret-Internal']
            const timestamp = Math.floor( Date.now() / 1000 )
            const crypto = await import( 'crypto' )
            const authHash = crypto.createHash( 'sha1' )
                .update( apiKey + apiSecret + timestamp )
                .digest( 'hex' )
            struct['headers']['X-Auth-Date'] = String( timestamp )
            struct['headers']['Authorization'] = authHash

            return { struct, payload }
        }
    },
    searchByPerson: {
        preRequest: async ( { struct, payload } ) => {
            // REV-19: FlowMCP v3 — extract keys from headers (auto-interpolated from requiredServerParams)
            const apiKey = struct['headers']['X-Auth-Key']
            const apiSecret = struct['headers']['X-PI-Secret-Internal']
            delete struct['headers']['X-PI-Secret-Internal']
            const timestamp = Math.floor( Date.now() / 1000 )
            const crypto = await import( 'crypto' )
            const authHash = crypto.createHash( 'sha1' )
                .update( apiKey + apiSecret + timestamp )
                .digest( 'hex' )
            struct['headers']['X-Auth-Date'] = String( timestamp )
            struct['headers']['Authorization'] = authHash

            return { struct, payload }
        }
    },
    getPodcastByFeedId: {
        preRequest: async ( { struct, payload } ) => {
            // REV-19: FlowMCP v3 — extract keys from headers (auto-interpolated from requiredServerParams)
            const apiKey = struct['headers']['X-Auth-Key']
            const apiSecret = struct['headers']['X-PI-Secret-Internal']
            delete struct['headers']['X-PI-Secret-Internal']
            const timestamp = Math.floor( Date.now() / 1000 )
            const crypto = await import( 'crypto' )
            const authHash = crypto.createHash( 'sha1' )
                .update( apiKey + apiSecret + timestamp )
                .digest( 'hex' )
            struct['headers']['X-Auth-Date'] = String( timestamp )
            struct['headers']['Authorization'] = authHash

            return { struct, payload }
        }
    },
    getEpisodesByFeedId: {
        preRequest: async ( { struct, payload } ) => {
            // REV-19: FlowMCP v3 — extract keys from headers (auto-interpolated from requiredServerParams)
            const apiKey = struct['headers']['X-Auth-Key']
            const apiSecret = struct['headers']['X-PI-Secret-Internal']
            delete struct['headers']['X-PI-Secret-Internal']
            const timestamp = Math.floor( Date.now() / 1000 )
            const crypto = await import( 'crypto' )
            const authHash = crypto.createHash( 'sha1' )
                .update( apiKey + apiSecret + timestamp )
                .digest( 'hex' )
            struct['headers']['X-Auth-Date'] = String( timestamp )
            struct['headers']['Authorization'] = authHash

            return { struct, payload }
        }
    },
    getTrendingPodcasts: {
        preRequest: async ( { struct, payload } ) => {
            // REV-19: FlowMCP v3 — extract keys from headers (auto-interpolated from requiredServerParams)
            const apiKey = struct['headers']['X-Auth-Key']
            const apiSecret = struct['headers']['X-PI-Secret-Internal']
            delete struct['headers']['X-PI-Secret-Internal']
            const timestamp = Math.floor( Date.now() / 1000 )
            const crypto = await import( 'crypto' )
            const authHash = crypto.createHash( 'sha1' )
                .update( apiKey + apiSecret + timestamp )
                .digest( 'hex' )
            struct['headers']['X-Auth-Date'] = String( timestamp )
            struct['headers']['Authorization'] = authHash

            return { struct, payload }
        }
    },
    getRecentEpisodes: {
        preRequest: async ( { struct, payload } ) => {
            // REV-19: FlowMCP v3 — extract keys from headers (auto-interpolated from requiredServerParams)
            const apiKey = struct['headers']['X-Auth-Key']
            const apiSecret = struct['headers']['X-PI-Secret-Internal']
            delete struct['headers']['X-PI-Secret-Internal']
            const timestamp = Math.floor( Date.now() / 1000 )
            const crypto = await import( 'crypto' )
            const authHash = crypto.createHash( 'sha1' )
                .update( apiKey + apiSecret + timestamp )
                .digest( 'hex' )
            struct['headers']['X-Auth-Date'] = String( timestamp )
            struct['headers']['Authorization'] = authHash

            return { struct, payload }
        }
    },
    getLiveEpisodes: {
        preRequest: async ( { struct, payload } ) => {
            // REV-19: FlowMCP v3 — extract keys from headers (auto-interpolated from requiredServerParams)
            const apiKey = struct['headers']['X-Auth-Key']
            const apiSecret = struct['headers']['X-PI-Secret-Internal']
            delete struct['headers']['X-PI-Secret-Internal']
            const timestamp = Math.floor( Date.now() / 1000 )
            const crypto = await import( 'crypto' )
            const authHash = crypto.createHash( 'sha1' )
                .update( apiKey + apiSecret + timestamp )
                .digest( 'hex' )
            struct['headers']['X-Auth-Date'] = String( timestamp )
            struct['headers']['Authorization'] = authHash

            return { struct, payload }
        }
    },
    getCategories: {
        preRequest: async ( { struct, payload } ) => {
            // REV-19: FlowMCP v3 — extract keys from headers (auto-interpolated from requiredServerParams)
            const apiKey = struct['headers']['X-Auth-Key']
            const apiSecret = struct['headers']['X-PI-Secret-Internal']
            delete struct['headers']['X-PI-Secret-Internal']
            const timestamp = Math.floor( Date.now() / 1000 )
            const crypto = await import( 'crypto' )
            const authHash = crypto.createHash( 'sha1' )
                .update( apiKey + apiSecret + timestamp )
                .digest( 'hex' )
            struct['headers']['X-Auth-Date'] = String( timestamp )
            struct['headers']['Authorization'] = authHash

            return { struct, payload }
        }
    }
} )
