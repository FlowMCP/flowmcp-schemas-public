// Schema for #186 — Wikipedia REST + Action API
// No API key required — fully public

export const main = {
    namespace: 'wikipedia',
    name: 'Wikipedia',
    description: 'Search Wikipedia articles, get page summaries, and perform OpenSearch lookups via the public Wikipedia REST and Action APIs. No API key required.',
    version: '4.0.0',
    docs: ['https://en.wikipedia.org/api/rest_v1/', 'https://www.mediawiki.org/wiki/API:Main_page'],
    tags: ['knowledge', 'encyclopedia', 'search', 'cacheTtlDaily'],
    root: 'https://en.wikipedia.org',
    tools: {
        getPageSummary: {
            method: 'GET',
            path: '/api/rest_v1/page/summary/:title',
            description: 'Get a short summary of a Wikipedia article by title. Returns extract text, description, thumbnail and original image URLs.. Use searchArticles first to find valid IDs',
            parameters: [
                { position: { key: 'title', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { title: { type: 'string' }, displaytitle: { type: 'string' }, description: { type: 'string' }, extract: { type: 'string' }, extract_html: { type: 'string' }, thumbnail: { type: 'object', properties: { source: { type: 'string' }, width: { type: 'number' }, height: { type: 'number' } } }, originalimage: { type: 'object', properties: { source: { type: 'string' }, width: { type: 'number' }, height: { type: 'number' } } }, lang: { type: 'string' }, dir: { type: 'string' }, timestamp: { type: 'string' }, content_urls: { type: 'object' } } } },
            tests: [
                { _description: 'Summary of Bitcoin article', title: 'Bitcoin' },
                { _description: 'Summary of Ethereum article', title: 'Ethereum' }
            ],
        },
        searchArticles: {
            method: 'GET',
            path: '/w/api.php?action=query&list=search&format=json',
            description: 'Full-text search across Wikipedia articles. Returns matching titles, snippets and word counts.',
            parameters: [
                { position: { key: 'srsearch', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'srlimit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(50)'] } },
                { position: { key: 'sroffset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { query: { type: 'object', properties: { search: { type: 'array', items: { type: 'object', properties: { ns: { type: 'number' }, title: { type: 'string' }, pageid: { type: 'number' }, size: { type: 'number' }, wordcount: { type: 'number' }, snippet: { type: 'string' }, timestamp: { type: 'string' } } } }, searchinfo: { type: 'object', properties: { totalhits: { type: 'number' } } } } } } } },
            tests: [
                { _description: 'Search for blockchain articles', srsearch: 'blockchain technology', srlimit: 5 },
                { _description: 'Search for solana', srsearch: 'solana cryptocurrency', srlimit: 3 }
            ],
        },
        openSearch: {
            method: 'GET',
            path: '/w/api.php?action=opensearch&format=json',
            description: 'Autocomplete-style search returning matching article titles and URLs. Ideal for search-as-you-type.',
            parameters: [
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(100)'] } }
            ],
            output: { mimeType: 'application/json', schema: { type: 'array', items: { type: 'array' } } },
            tests: [
                { _description: 'Autocomplete for bitcoin', search: 'bitcoin', limit: 5 },
                { _description: 'Autocomplete for defi', search: 'decentralized finance', limit: 5 }
            ],
        },
        getMediaList: {
            method: 'GET',
            path: '/api/rest_v1/page/media-list/:title',
            description: 'Get all media files (images, audio, video) used in a Wikipedia article.',
            parameters: [
                { position: { key: 'title', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { items: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, type: { type: 'string' }, caption: { type: 'object' }, srcset: { type: 'array', items: { type: 'object', properties: { src: { type: 'string' }, scale: { type: 'string' } } } } } } } } } },
            tests: [
                { _description: 'Media files for Bitcoin article', title: 'Bitcoin' }
            ],
        }
    }
}
