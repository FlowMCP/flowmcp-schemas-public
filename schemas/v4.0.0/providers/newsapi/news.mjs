// Migrated from v1.2.0 -> v2.0.0
// Category: simple
// Import: import { ISO_COUNTRY_CODES } from '../_shared/isoCountryCodes.mjs'
// Import: import { ISO_LANGUAGE_CODES } from '../_shared/isoLanguageCodes.mjs'
// Module-level code: 2 lines

export const main = {
    namespace: 'newsapi',
    name: 'NewsAPI.org',
    description: 'Access breaking news headlines and search through articles from news sources and blogs across the web',
    version: '4.0.0',
    docs: ['https://newsapi.org/docs'],
    tags: ['news', 'media', 'content', 'cacheTtlFrequent'],
    root: 'https://newsapi.org/v2',
    requiredServerParams: ['NEWSAPI_API_KEY'],
    headers: {
        'X-API-Key': '{{NEWSAPI_API_KEY}}'
    },
    tools: {
        getTopHeadlines: {
            method: 'GET',
            path: '/top-headlines',
            description: 'Get breaking news headlines for a country or category via newsapi. Supports country, category, sources filters. Cannot mix sources with country/category. Use getSources to discover available source IDs.',
            parameters: [
                { position: { key: 'country', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(ae,ar,at,au,be,bg,br,ca,ch,cn,co,cu,cz,de,eg,fr,gb,gr,hk,hu,id,ie,il,in,it,jp,kr,lt,lv,ma,mx,my,ng,nl,no,nz,ph,pl,pt,ro,rs,ru,sa,se,sg,si,sk,th,tr,tw,ua,us,ve,za)', options: ['optional()'] } },
                { position: { key: 'category', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(business,entertainment,general,health,science,sports,technology)', options: ['optional()'] } },
                { position: { key: 'sources', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'pageSize', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get US top headlines', country: 'us' },
                { _description: 'Get technology headlines', category: 'technology' },
                { _description: 'Search for Bitcoin news', q: 'bitcoin', pageSize: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'News API response with matching headline articles',
                    properties: {
                        status: { type: 'string', description: 'Request status (ok or error)' },
                        totalResults: { type: 'number', description: 'Total number of articles matching the query' },
                        articles: { type: 'array', description: 'Array of news article objects', items: { type: 'object', properties: { source: { type: 'object', description: 'Source information with id and name fields' }, author: { type: 'string', description: 'Article author name (may be null)' }, title: { type: 'string', description: 'Article headline' }, description: { type: 'string', description: 'Short article summary or excerpt' }, url: { type: 'string', description: 'Direct URL to the full article' }, urlToImage: { type: 'string', description: 'URL to the article thumbnail image (may be null)' }, publishedAt: { type: 'string', description: 'Publication timestamp in ISO 8601 format' }, content: { type: 'string', description: 'First 200 characters of the article body (truncated)' } } } }
                    }
                }
            },
        },
        getEverything: {
            method: 'GET',
            path: '/everything',
            description: 'Search through millions of articles from over 80,000 large and small news sources and blogs. More flexible than getTopHeadlines with date range, domain, and language filters. Use for historical article search.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'qInTitle', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'sources', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'domains', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'excludeDomains', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'from', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'to', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'language', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(ar,de,en,es,fr,he,it,nl,no,pt,ru,sv,ud,zh)', options: ['optional()'] } },
                { position: { key: 'sortBy', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(relevancy,popularity,publishedAt)', options: ['optional()'] } },
                { position: { key: 'pageSize', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Search for cryptocurrency articles', q: 'cryptocurrency', sortBy: 'publishedAt', pageSize: 20 },
                { _description: 'Search for AI in titles', qInTitle: 'artificial intelligence', language: 'en' },
                { _description: 'Get articles from specific domains', domains: 'techcrunch.com,wired.com', language: 'en' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'News API response with matching articles from the full archive',
                    properties: {
                        status: { type: 'string', description: 'Request status (ok or error)' },
                        totalResults: { type: 'number', description: 'Total number of articles matching the query' },
                        articles: { type: 'array', description: 'Array of news article objects', items: { type: 'object', properties: { source: { type: 'object', description: 'Source information with id and name fields' }, author: { type: 'string', description: 'Article author name (may be null)' }, title: { type: 'string', description: 'Article headline' }, description: { type: 'string', description: 'Short article summary or excerpt' }, url: { type: 'string', description: 'Direct URL to the full article' }, urlToImage: { type: 'string', description: 'URL to the article thumbnail image (may be null)' }, publishedAt: { type: 'string', description: 'Publication timestamp in ISO 8601 format' }, content: { type: 'string', description: 'First 200 characters of the article body (truncated)' } } } }
                    }
                }
            },
        },
        getSources: {
            method: 'GET',
            path: '/top-headlines/sources',
            description: 'Get the subset of news publishers that top headlines and everything endpoints are available for. Use returned source IDs in getTopHeadlines and getEverything sources parameter. Filter by category, language, or country.',
            parameters: [
                { position: { key: 'category', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(business,entertainment,general,health,science,sports,technology)', options: ['optional()'] } },
                { position: { key: 'language', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(ar,de,en,es,fr,he,it,nl,no,pt,ru,sv,ud,zh)', options: ['optional()'] } },
                { position: { key: 'country', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(ae,ar,at,au,be,bg,br,ca,ch,cn,co,cu,cz,de,eg,fr,gb,gr,hk,hu,id,ie,il,in,it,jp,kr,lt,lv,ma,mx,my,ng,nl,no,nz,ph,pl,pt,ro,rs,ru,sa,se,sg,si,sk,th,tr,tw,ua,us,ve,za)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get all sources', category: 'technology' },
                { _description: 'Get technology sources', category: 'technology' },
                { _description: 'Get US English sources', country: 'us', language: 'en' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'News API response with available news source publishers',
                    properties: {
                        status: { type: 'string', description: 'Request status (ok or error)' },
                        sources: { type: 'array', description: 'Array of news source publisher objects', items: { type: 'object', properties: { id: { type: 'string', description: 'Source identifier for use in sources parameter (e.g. bbc-news, cnn)' }, name: { type: 'string', description: 'Display name of the news source' }, description: { type: 'string', description: 'Brief description of the news source' }, url: { type: 'string', description: 'URL to the news source homepage' }, category: { type: 'string', description: 'Content category (business, entertainment, general, health, science, sports, technology)' }, language: { type: 'string', description: 'Primary language of the source (ISO 639-1 code)' }, country: { type: 'string', description: 'Country of origin (ISO 3166-1 alpha-2 code)' } } } }
                    }
                }
            },
        }
    }
}
