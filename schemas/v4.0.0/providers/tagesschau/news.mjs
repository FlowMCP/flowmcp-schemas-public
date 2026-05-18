// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'tagesschau',
    name: 'Tagesschau API',
    description: 'Access German public broadcasting news from ARD tagesschau including headlines, search, and live channels',
    version: '4.0.0',
    docs: ['https://www.tagesschau.de/'],
    tags: ['news', 'germany', 'media', 'cacheTtlFrequent'],
    root: 'https://www.tagesschau.de/api2u',
    tools: {
        getHomepage: {
            method: 'GET',
            path: '/homepage',
            description: 'Get current homepage news with top stories and regional coverage via tagesschau.',
            parameters: [],
            tests: [
                { _description: 'Get homepage news' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        news: { type: 'array', items: { type: 'object', properties: { sophoraId: { type: 'string' }, externalId: { type: 'string' }, title: { type: 'string' }, date: { type: 'string' }, teaserImage: { type: 'object' }, tags: { type: 'array', items: { type: 'object' } }, updateCheckUrl: { type: 'string' }, content: { type: 'array', items: { type: 'object' } }, tracking: { type: 'array', items: { type: 'object' } }, topline: { type: 'string' }, firstSentence: { type: 'string' }, video: { type: 'object' }, images: { type: 'array', items: { type: 'object' } }, firstFrame: { type: 'object' }, details: { type: 'string' }, detailsweb: { type: 'string' }, shareURL: { type: 'string' }, geotags: { type: 'array', items: { type: 'string' } }, regionId: { type: 'number' }, regionIds: { type: 'array', items: { type: 'string' } }, ressort: { type: 'string' }, crop: { type: 'object' }, breakingNews: { type: 'boolean' }, type: { type: 'string' } } } },
                        regional: { type: 'array', items: { type: 'object', properties: { sophoraId: { type: 'string' }, externalId: { type: 'string' }, title: { type: 'string' }, date: { type: 'string' }, teaserImage: { type: 'object' }, tags: { type: 'array', items: { type: 'object' } }, updateCheckUrl: { type: 'string' }, content: { type: 'array', items: { type: 'object' } }, tracking: { type: 'array', items: { type: 'object' } }, topline: { type: 'string' }, firstSentence: { type: 'string' }, images: { type: 'array', items: { type: 'object' } }, brandingImage: { type: 'object' }, details: { type: 'string' }, detailsweb: { type: 'string' }, shareURL: { type: 'string' }, geotags: { type: 'array', items: { type: 'string' } }, regionId: { type: 'number' }, regionIds: { type: 'array', items: { type: 'number' } }, breakingNews: { type: 'boolean' }, type: { type: 'string' } } } },
                        newStoriesCountLink: { type: 'string' },
                        type: { type: 'string' }
                    }
                }
            },
        },
        getNews: {
            method: 'GET',
            path: '/news',
            description: 'Get news articles filtered by region or editorial section (ressort). Optional filters: regions, ressort.',
            parameters: [
                { position: { key: 'regions', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(16)', 'optional()'] } },
                { position: { key: 'ressort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(inland,ausland,wirtschaft,sport,video,investigativ,wissen)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get domestic news', ressort: 'inland' },
                { _description: 'Get international news', ressort: 'ausland' },
                { _description: 'Get business news', ressort: 'wirtschaft' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        news: { type: 'array', items: { type: 'object', properties: { sophoraId: { type: 'string' }, externalId: { type: 'string' }, title: { type: 'string' }, date: { type: 'string' }, teaserImage: { type: 'object' }, tags: { type: 'array', items: { type: 'object' } }, updateCheckUrl: { type: 'string' }, tracking: { type: 'array', items: { type: 'object' } }, topline: { type: 'string' }, firstSentence: { type: 'string' }, images: { type: 'array', items: { type: 'string' } }, details: { type: 'string' }, detailsweb: { type: 'string' }, shareURL: { type: 'string' }, geotags: { type: 'array', items: { type: 'string' } }, regionId: { type: 'number' }, regionIds: { type: 'array', items: { type: 'string' } }, ressort: { type: 'string' }, breakingNews: { type: 'boolean' }, type: { type: 'string' } } } },
                        regional: { type: 'array', items: { type: 'string' } },
                        newStoriesCountLink: { type: 'string' },
                        type: { type: 'string' },
                        nextPage: { type: 'string' }
                    }
                }
            },
        },
        searchArticles: {
            method: 'GET',
            path: '/search',
            description: 'Search tagesschau articles by keyword. Supports pageSize, resultPage filters. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'searchText', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'pageSize', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(30)', 'default(10)', 'optional()'] } },
                { position: { key: 'resultPage', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'default(1)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Search for Ukraine news', searchText: 'ukraine', pageSize: 5 },
                { _description: 'Search for climate news', searchText: 'klima', pageSize: 5 },
                { _description: 'Search for economy news', searchText: 'wirtschaft', pageSize: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        details: { type: 'string' },
                        searchText: { type: 'string' },
                        pageSize: { type: 'number' },
                        resultPage: { type: 'number' },
                        totalItemCount: { type: 'number' },
                        searchResults: { type: 'array', items: { type: 'object', properties: { sophoraId: { type: 'string' }, externalId: { type: 'string' }, title: { type: 'string' }, date: { type: 'string' }, teaserImage: { type: 'object' }, tags: { type: 'array', items: { type: 'string' } }, updateCheckUrl: { type: 'string' }, tracking: { type: 'array', items: { type: 'object' } }, streams: { type: 'object' }, alttext: { type: 'string' }, copyright: { type: 'string' }, type: { type: 'string' } } } },
                        type: { type: 'string' }
                    }
                }
            },
        },
        getChannels: {
            method: 'GET',
            path: '/channels',
            description: 'Get available live streaming channels (tagesschau24, tagesschau, tagesthemen) Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'List all channels' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        channels: { type: 'array', items: { type: 'object', properties: { sophoraId: { type: 'string' }, externalId: { type: 'string' }, title: { type: 'string' }, teaserImage: { type: 'object' }, tracking: { type: 'array', items: { type: 'object' } }, streams: { type: 'object' }, alttext: { type: 'string' }, copyright: { type: 'string' }, type: { type: 'string' } } } },
                        type: { type: 'string' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getHomepage: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.news ) { return { response }}

            const articles = raw.news
            .map( ( article ) => {
            const { sophoraId, title, topline, firstSentence, date, ressort, tags, detailsweb, breakingNews } = article

            return {
            id: sophoraId,
            title,
            topline: topline || null,
            summary: firstSentence || null,
            date,
            section: ressort || null,
            isBreaking: breakingNews || false,
            tags: ( tags || [] ).map( ( t ) => t.tag ),
            webUrl: detailsweb || null
            }
            } )

            response = {
            articleCount: articles.length,
            articles
            }

            return { response }
        }
    },
    getNews: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.news ) { return { response }}

            const articles = raw.news
            .map( ( article ) => {
            const { sophoraId, title, topline, firstSentence, date, ressort, tags, detailsweb, breakingNews } = article

            return {
            id: sophoraId,
            title,
            topline: topline || null,
            summary: firstSentence || null,
            date,
            section: ressort || null,
            isBreaking: breakingNews || false,
            tags: ( tags || [] ).map( ( t ) => t.tag ),
            webUrl: detailsweb || null
            }
            } )

            response = {
            articleCount: articles.length,
            articles
            }

            return { response }
        }
    },
    searchArticles: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.searchResults ) { return { response }}

            const results = raw.searchResults
            .map( ( item ) => {
            const { title, date, detailsweb, firstSentence, topline } = item

            return {
            title,
            topline: topline || null,
            summary: firstSentence || null,
            date,
            webUrl: detailsweb || null
            }
            } )

            response = {
            searchText: raw.searchText,
            totalResults: raw.totalItemCount,
            pageSize: raw.pageSize,
            currentPage: raw.resultPage,
            resultCount: results.length,
            results
            }

            return { response }
        }
    },
    getChannels: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.channels ) { return { response }}

            const channels = raw.channels
            .map( ( channel ) => {
            const { title, date, streamUrl } = channel

            return {
            title,
            lastUpdate: date || null,
            streamUrl: streamUrl || null
            }
            } )

            response = {
            channelCount: channels.length,
            channels
            }

            return { response }
        }
    }
} )
