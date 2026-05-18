export const main = {
    namespace: 'openbrewerydb',
    name: 'Open Brewery DB',
    description: 'Access the Open Brewery DB, a free dataset of breweries worldwide. Search and filter breweries by name, city, state, country, and type (micro, nano, brewpub, large, etc.). Returns brewery details including address, coordinates, phone, and website. Community-maintained with 8,000+ US breweries and growing international coverage. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://www.openbrewerydb.org/documentation'],
    tags: ['food', 'beverage', 'opendata', 'cacheTtlDaily'],
    root: 'https://api.openbrewerydb.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        listBreweries: {
            method: 'GET',
            path: '/v1/breweries',
            description: 'List breweries with optional filters. Filter by city, state, country, type, or name. Use brewery IDs from results in getBrewery for full details. For text search use searchBreweries.',
            parameters: [
                { position: { key: 'by_city', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'by_state', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'by_country', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'by_type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(micro,nano,regional,brewpub,large,planning,bar,contract,proprietor,closed)', options: ['optional()'] } },
                { position: { key: 'by_name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'max(200)'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(asc,desc)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'List breweries in Portland', by_city: 'portland', per_page: 3 },
                { _description: 'List nano breweries', by_type: 'nano', per_page: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, brewery_type: { type: 'string' }, address_1: { type: 'string' }, city: { type: 'string' }, state_province: { type: 'string' }, postal_code: { type: 'string' }, country: { type: 'string' }, longitude: { type: 'number' }, latitude: { type: 'number' }, phone: { type: 'string' }, website_url: { type: 'string' } } } }
            }
        },
        searchBreweries: {
            method: 'GET',
            path: '/v1/breweries/search',
            description: 'Full-text search across brewery names. Returns matching breweries. Use IDs in getBrewery for complete details. For filtered listing use listBreweries.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'max(200)'] } }
            ],
            tests: [
                { _description: 'Search dog breweries', query: 'dog', per_page: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, brewery_type: { type: 'string' }, city: { type: 'string' }, state_province: { type: 'string' }, country: { type: 'string' }, longitude: { type: 'number' }, latitude: { type: 'number' }, website_url: { type: 'string' } } } }
            }
        },
        getBrewery: {
            method: 'GET',
            path: '/v1/breweries/:id',
            description: 'Get a single brewery by its UUID. Returns full details including address, coordinates, phone, and website. Use IDs from listBreweries or searchBreweries.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get specific brewery', id: '5128df48-79fc-4f0f-8b52-d06be54d0cec' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, brewery_type: { type: 'string' }, address_1: { type: 'string' }, city: { type: 'string' }, state_province: { type: 'string' }, postal_code: { type: 'string' }, country: { type: 'string' }, longitude: { type: 'number' }, latitude: { type: 'number' }, phone: { type: 'string' }, website_url: { type: 'string' } } }
            }
        },
        getRandomBrewery: {
            method: 'GET',
            path: '/v1/breweries/random',
            description: 'Get one or more random breweries. Useful for discovery and sampling the dataset.',
            parameters: [
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)', 'max(50)'] } }
            ],
            tests: [
                { _description: 'Get 3 random breweries', size: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, brewery_type: { type: 'string' }, city: { type: 'string' }, state_province: { type: 'string' }, country: { type: 'string' } } } }
            }
        }
    }
}
