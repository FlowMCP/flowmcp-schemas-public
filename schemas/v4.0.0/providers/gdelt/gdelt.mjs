export const main = {
    namespace: 'gdelt',
    name: 'GDELT Global News Monitoring',
    description: 'Access the GDELT Project global news monitoring system. Search and analyze worldwide news coverage across 100+ languages, updated every 15 minutes. Query article lists, timeline volumes, tone analysis, and contextual sentence-level excerpts. Covers 300M+ news articles from 2015 to present. Free, no API key required. Rate limit: 1 request per 5 seconds.',
    version: '4.0.0',
    docs: ['https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/', 'https://blog.gdeltproject.org/announcing-the-gdelt-context-2-0-api/'],
    tags: ['news', 'media', 'global', 'opendata', 'cacheTtlFrequent'],
    root: 'https://api.gdeltproject.org',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        searchArticles: {
            method: 'GET',
            path: '/api/v2/doc/doc',
            description: 'Full-text search across global news articles monitored by GDELT. Returns article URLs, titles, publication dates, source domains, languages, and countries. Supports boolean queries, domain/language/country filters, and tone analysis. Default timespan: last 3 months. Max 250 records. TIMESPAN is in minutes (1440=1day, 10080=1week). Use searchContext for sentence-level excerpts of the same articles.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'mode', value: 'artlist', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'maxrecords', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(250)'] } },
                { position: { key: 'TIMESPAN', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'SORT', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(DateDesc,DateAsc,ToneDesc,ToneAsc,HybridRel)', options: ['optional()', 'default(DateDesc)'] } }
            ],
            tests: [
                { _description: 'Search for Germany news articles', query: 'germany', maxrecords: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'GDELT article search results', properties: { articles: { type: 'array', description: 'Array of matching news articles', items: { type: 'object', properties: { url: { type: 'string', description: 'Full URL of the article' }, url_mobile: { type: 'string', description: 'Mobile-optimized URL (may be empty)' }, title: { type: 'string', description: 'Article headline/title' }, seendate: { type: 'string', description: 'Date article was indexed by GDELT in YYYYMMDDTHHmmSSZ format' }, socialimage: { type: 'string', description: 'URL of the article social media preview image' }, domain: { type: 'string', description: 'Source website domain (e.g. reuters.com)' }, language: { type: 'string', description: 'Article language in IETF format (e.g. English, German)' }, sourcecountry: { type: 'string', description: 'Source country name (e.g. United States, Germany)' } } } } } }
            }
        },
        getTimelineVolume: {
            method: 'GET',
            path: '/api/v2/doc/doc',
            description: 'Get a timeline of article volume over time for a search query. Returns daily or hourly counts of matching articles, useful for tracking media attention on topics. TIMESPAN is in minutes (1440=1day, 10080=1week). Default: 3 months. Shows aggregate view of articles found by searchArticles.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'mode', value: 'timelinevol', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'TIMESPAN', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'TIMELINESMOOTH', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'max(30)'] } }
            ],
            tests: [
                { _description: 'Climate news volume over 7 days', query: 'climate change' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Timeline of article volume for the query over the timespan', properties: { timeline: { type: 'array', description: 'Array of time-bucketed article counts', items: { type: 'object', properties: { date: { type: 'string', description: 'Date/time bucket label' }, value: { type: 'number', description: 'Number of articles matching the query in this time bucket' } } } } } }
            }
        },
        getTimelineTone: {
            method: 'GET',
            path: '/api/v2/doc/doc',
            description: 'Get a timeline of average media tone (sentiment) over time for a query. Positive values indicate positive sentiment, negative values indicate negative coverage. Useful for tracking public perception shifts.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'mode', value: 'timelinetone', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'TIMESPAN', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'TIMELINESMOOTH', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'max(30)'] } }
            ],
            tests: [
                { _description: 'Tone of AI coverage over 7 days', query: 'artificial intelligence' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Timeline of average media tone/sentiment for the query over the timespan', properties: { timeline: { type: 'array', description: 'Array of time-bucketed average tone values', items: { type: 'object', properties: { date: { type: 'string', description: 'Date/time bucket label' }, value: { type: 'number', description: 'Average tone score — positive values indicate positive sentiment, negative values indicate negative coverage' } } } } } }
            }
        },
        searchContext: {
            method: 'GET',
            path: '/api/v2/context/context',
            description: 'Search news with sentence-level context excerpts. Returns articles with the specific sentence containing the query plus surrounding context paragraph. Ideal for fact-finding and quote extraction. Less rate-limited than the DOC API. Shares query syntax with searchArticles.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'mode', value: 'artlist', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'maxrecords', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(250)'] } },
                { position: { key: 'TIMESPAN', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'SORT', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(DateDesc,DateAsc,ToneDesc,ToneAsc,HybridRel)', options: ['optional()', 'default(DateDesc)'] } }
            ],
            tests: [
                { _description: 'Search context for climate articles', query: 'climate', maxrecords: 3 },
                { _description: 'Search context for Germany news', query: 'germany', maxrecords: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'GDELT context search results with sentence-level excerpts', properties: { articles: { type: 'array', description: 'Array of articles with contextual sentence excerpts', items: { type: 'object', properties: { url: { type: 'string', description: 'Full URL of the article' }, title: { type: 'string', description: 'Article headline/title' }, seendate: { type: 'string', description: 'Date article was indexed in YYYYMMDDTHHmmSSZ format' }, socialimage: { type: 'string', description: 'URL of the article social media preview image' }, domain: { type: 'string', description: 'Source website domain' }, language: { type: 'string', description: 'Article language' }, isquote: { type: 'number', description: 'Whether the matching sentence is a direct quote (1) or not (0)' }, sentence: { type: 'string', description: 'The specific sentence containing the query match' }, context: { type: 'string', description: 'Surrounding paragraph providing context around the matching sentence' } } } } } }
            }
        },
        getToneChart: {
            method: 'GET',
            path: '/api/v2/doc/doc',
            description: 'Get a tone/sentiment distribution chart for a query. Shows how coverage is distributed across the tone spectrum from very negative to very positive.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'mode', value: 'tonechart', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'TIMESPAN', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Tone chart for EU news', query: 'european union' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Tone distribution chart showing sentiment spread across articles', properties: { tonechart: { type: 'array', description: 'Array of tone histogram bins', items: { type: 'object', properties: { bin: { type: 'number', description: 'Tone score bin center — ranges from approximately -15 (very negative) to +15 (very positive)' }, count: { type: 'number', description: 'Number of articles in this tone bin' } } } } } }
            }
        }
    }
}
