export const main = {
    namespace: 'openstates',
    name: 'Open States',
    description: 'Access US state legislature data from Open States covering all 50 states, DC, and Puerto Rico. Search legislators, bills, committees, and votes.',
    version: '4.0.0',
    docs: ['https://docs.openstates.org/api-v3/'],
    tags: ['politics', 'government', 'legislature', 'usa', 'cacheTtlDaily'],
    root: 'https://v3.openstates.org',
    requiredServerParams: ['OPENSTATES_API_KEY'],
    headers: {},
    tools: {
        searchPeople: {
            method: 'GET',
            path: '/people',
            description: 'Search for state legislators, governors, and other officials. Filter by name, jurisdiction, chamber, party, or district.',
            parameters: [
                { position: { key: 'apikey', value: '{{OPENSTATES_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'jurisdiction', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'party', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'district', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(50)'] } }
            ],
            tests: [
                { _description: 'Search legislators in California', jurisdiction: 'California', per_page: 5 },
                { _description: 'Search for Democratic legislators in New York', jurisdiction: 'New York', party: 'Democratic', per_page: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, party: { type: 'string' }, current_role: { type: 'object' } } } }, pagination: { type: 'object' } } }
            },
        },
        searchBills: {
            method: 'GET',
            path: '/bills',
            description: 'Search bills across state legislatures. Filter by jurisdiction, session, subject, sponsor, or full text search.',
            parameters: [
                { position: { key: 'apikey', value: '{{OPENSTATES_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'jurisdiction', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'session', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'subject', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(50)'] } }
            ],
            tests: [
                { _description: 'Search AI-related bills in California', jurisdiction: 'California', q: 'artificial intelligence', per_page: 5 },
                { _description: 'Search education bills in Texas', jurisdiction: 'Texas', subject: 'Education', per_page: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, identifier: { type: 'string' }, title: { type: 'string' }, session: { type: 'string' }, classification: { type: 'array' } } } }, pagination: { type: 'object' } } }
            },
        },
        getGeoLegislators: {
            method: 'GET',
            path: '/people.geo',
            description: 'Find state legislators for a specific geographic location. Returns all legislators whose districts contain the given coordinates.',
            parameters: [
                { position: { key: 'apikey', value: '{{OPENSTATES_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lng', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Find legislators for downtown Los Angeles', lat: 34.0522, lng: -118.2437 },
                { _description: 'Find legislators for Austin TX', lat: 30.2672, lng: -97.7431 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, party: { type: 'string' }, current_role: { type: 'object' } } } } } }
            },
        },
        listJurisdictions: {
            method: 'GET',
            path: '/jurisdictions',
            description: 'List all available jurisdictions (states, territories) with metadata about their legislative bodies, sessions, and data availability.',
            parameters: [
                { position: { key: 'apikey', value: '{{OPENSTATES_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'List all available jurisdictions' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, classification: { type: 'string' } } } } } }
            },
        }
    }
}
