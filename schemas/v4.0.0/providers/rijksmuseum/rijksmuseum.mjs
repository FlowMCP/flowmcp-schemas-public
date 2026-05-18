export const main = {
    namespace: 'rijksmuseum',
    name: 'Rijksmuseum',
    description: 'Search the Rijksmuseum art collection of 700K+ objects by title, creator, material, technique, and date. No API key required.',
    version: '4.0.0',
    docs: ['https://data.rijksmuseum.nl/docs/search'],
    tags: ['art', 'museum', 'culture', 'heritage', 'netherlands', 'cacheTtlStatic'],
    root: 'https://data.rijksmuseum.nl',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchCollection: {
            method: 'GET',
            path: '/search/collection',
            description: 'Search the Rijksmuseum collection by title, creator, type, material, technique, or date. Returns Linked Art identifiers for matching objects.',
            parameters: [
                { position: { key: 'title', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'creator', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'material', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'technique', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'creationDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'imageAvailable', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'pageToken', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for paintings by Rembrandt', creator: 'Rembrandt', type: 'painting' },
                { _description: 'Search for objects titled Night Watch', title: 'Nachtwacht' },
                { _description: 'Search for Vermeer paintings', creator: 'Vermeer', type: 'painting', imageAvailable: true }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        id: { type: 'string' },
                        orderedItems: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, id: { type: 'string' } } } },
                        next: { type: 'object', properties: { id: { type: 'string' } } }
                    }
                }
            },
        },
        searchByObjectNumber: {
            method: 'GET',
            path: '/search/collection',
            description: 'Find specific objects by their catalog number. Supports wildcard patterns (* for any sequence, ? for single character).',
            parameters: [
                { position: { key: 'objectNumber', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Find object SK-C-5 (The Night Watch)', objectNumber: 'SK-C-5' },
                { _description: 'Find all objects starting with SK-A', objectNumber: 'SK-A-*' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        orderedItems: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, id: { type: 'string' } } } }
                    }
                }
            },
        },
        searchByDescription: {
            method: 'GET',
            path: '/search/collection',
            description: 'Search the collection by keyword in object descriptions. Useful for thematic searches across all object types.',
            parameters: [
                { position: { key: 'description', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'imageAvailable', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for windmill related objects', description: 'windmill', imageAvailable: true },
                { _description: 'Search for tulip related objects', description: 'tulip' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        orderedItems: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, id: { type: 'string' } } } }
                    }
                }
            },
        }
    }
}
