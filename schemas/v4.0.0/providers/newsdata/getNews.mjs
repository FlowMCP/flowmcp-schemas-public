// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'newsdata',
    name: 'CryptoNews',
    description: 'Fetches general or topic-specific cryptocurrency news articles from NewsData.io.',
    version: '4.0.0',
    docs: ['https://newsdata.io/documentation/'],
    tags: ['news', 'media', 'global', 'cacheTtlFrequent'],
    root: 'https://newsdata.io/api/1',
    requiredServerParams: ['NEWSDATA_API_KEY'],
    headers: {},
    tools: {
        getLatestNewsdata: {
            method: 'GET',
            path: '/crypto',
            description: 'Fetch the latest general crypto news from NewsData.io. Returns articles with sentiment analysis, AI tags, and source metadata. No query parameter needed. For topic-specific search, use getCryptoNewsdata instead.',
            parameters: [
                { position: { key: 'apikey', value: '{{NEWSDATA_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get latest general crypto news' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'NewsData.io response with latest crypto news articles',
                    properties: {
                        status: { type: 'string', description: 'API response status (success or error)' },
                        totalResults: { type: 'number', description: 'Total number of articles available' },
                        results: { type: 'array', description: 'Array of crypto news article objects', items: { type: 'object', properties: { article_id: { type: 'string', description: 'Unique article identifier' }, link: { type: 'string', description: 'Direct URL to the full article' }, title: { type: 'string', description: 'Article headline' }, description: { type: 'string', description: 'Short article summary' }, content: { type: 'string', description: 'Full article body text' }, keywords: { type: 'array', description: 'Extracted keywords from the article', items: { type: 'string' } }, creator: { type: 'array', description: 'Article author names', items: { type: 'string' } }, coin: { type: 'string', nullable: true, description: 'Associated cryptocurrency coin name (null if not coin-specific)' }, language: { type: 'string', description: 'Article language code (e.g. english)' }, pubDate: { type: 'string', description: 'Publication date in YYYY-MM-DD HH:MM:SS format' }, pubDateTZ: { type: 'string', description: 'Timezone of the publication date (e.g. UTC)' }, fetched_at: { type: 'string', description: 'Timestamp when the article was indexed' }, image_url: { type: 'string', description: 'URL to the article thumbnail image' }, video_url: { type: 'string', nullable: true, description: 'URL to associated video content (null if none)' }, source_id: { type: 'string', description: 'Source identifier slug' }, source_name: { type: 'string', nullable: true, description: 'Human-readable source name' }, source_priority: { type: 'number', description: 'Source ranking priority (lower is higher priority)' }, source_url: { type: 'string', nullable: true, description: 'URL to the source website' }, source_icon: { type: 'string', nullable: true, description: 'URL to the source favicon' }, sentiment: { type: 'string', description: 'Article sentiment classification (positive, negative, neutral)' }, sentiment_stats: { type: 'string', description: 'Detailed sentiment score breakdown as JSON string' }, ai_tag: { type: 'string', description: 'AI-generated topic tags for the article' }, duplicate: { type: 'boolean', description: 'Whether this article is a duplicate of another' } } } },
                        nextPage: { type: 'string', description: 'Pagination cursor for fetching the next page of results' }
                    }
                }
            },
        },
        getCryptoNewsdata: {
            method: 'GET',
            path: '/latest',
            description: 'Fetch topic-specific crypto news for a given query. Required: q. Use for targeted searches like "bitcoin" or "ethereum". For general crypto news without a query, use getLatestNewsdata instead.',
            parameters: [
                { position: { key: 'apikey', value: '{{NEWSDATA_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'category', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(business)'] } }
            ],
            tests: [
                { _description: 'Fetch Bitcoin news', q: 'bitcoin', category: 'business' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'NewsData.io response with topic-filtered news articles',
                    properties: {
                        status: { type: 'string', description: 'API response status (success or error)' },
                        totalResults: { type: 'number', description: 'Total number of articles matching the query' },
                        results: { type: 'array', description: 'Array of matching news article objects', items: { type: 'object', properties: { article_id: { type: 'string', description: 'Unique article identifier' }, link: { type: 'string', description: 'Direct URL to the full article' }, title: { type: 'string', description: 'Article headline' }, description: { type: 'string', description: 'Short article summary' }, content: { type: 'string', description: 'Full article body text' }, keywords: { type: 'array', description: 'Extracted keywords from the article', items: { type: 'string' } }, creator: { type: 'array', description: 'Article author names', items: { type: 'string' } }, language: { type: 'string', description: 'Article language code' }, country: { type: 'array', description: 'Countries the article is relevant to', items: { type: 'string' } }, category: { type: 'array', description: 'Content categories (e.g. business, technology)', items: { type: 'string' } }, datatype: { type: 'string', description: 'Article data type classification' }, pubDate: { type: 'string', description: 'Publication date in YYYY-MM-DD HH:MM:SS format' }, pubDateTZ: { type: 'string', description: 'Timezone of the publication date' }, fetched_at: { type: 'string', description: 'Timestamp when the article was indexed' }, image_url: { type: 'string', description: 'URL to the article thumbnail image' }, video_url: { type: 'string', nullable: true, description: 'URL to associated video content (null if none)' }, source_id: { type: 'string', description: 'Source identifier slug' }, source_name: { type: 'string', description: 'Human-readable source name' }, source_priority: { type: 'number', description: 'Source ranking priority (lower is higher priority)' }, source_url: { type: 'string', description: 'URL to the source website' }, source_icon: { type: 'string', description: 'URL to the source favicon' }, sentiment: { type: 'string', description: 'Article sentiment classification (positive, negative, neutral)' }, sentiment_stats: { type: 'string', description: 'Detailed sentiment score breakdown as JSON string' }, ai_tag: { type: 'string', description: 'AI-generated topic tags' }, ai_region: { type: 'string', description: 'AI-detected geographic region of the article' }, ai_org: { type: 'string', description: 'AI-detected organizations mentioned in the article' }, ai_summary: { type: 'string', description: 'AI-generated article summary' }, duplicate: { type: 'boolean', description: 'Whether this article is a duplicate of another' } } } },
                        nextPage: { type: 'string', description: 'Pagination cursor for fetching the next page of results' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getLatestNewsdata: {
        postRequest: async ( { response, struct, payload } ) => {
            const __routeName = 'getLatestNewsdata'
            struct.news = payload?.content?.[0]?.text || "No data."
            return { response }
        }
    },
    getCryptoNewsdata: {
        postRequest: async ( { response, struct, payload } ) => {
            const __routeName = 'getCryptoNewsdata'
            struct.news = payload?.content?.[0]?.text || "No data."
            return { response }
        }
    }
} )
