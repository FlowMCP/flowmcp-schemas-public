export const main = {
    namespace: 'opensanctions',
    name: 'OpenSanctions',
    description: 'Search sanctions lists, PEP databases, and criminal entity records via the OpenSanctions yente API. Screen persons and companies against global watchlists, retrieve entity details, and access dataset metadata.',
    version: '4.0.0',
    docs: ['https://www.opensanctions.org/docs/api/', 'https://api.opensanctions.org/'],
    tags: ['sanctions', 'compliance', 'pep', 'screening', 'aml', 'cacheTtlDaily'],
    root: 'https://api.opensanctions.org',
    requiredServerParams: ['OPENSANCTIONS_API_KEY'],
    headers: {
        'Authorization': '{{OPENSANCTIONS_API_KEY}}'
    },
    tools: {
        searchEntities: {
            method: 'GET',
            path: '/search/default',
            description: 'Full-text search across all sanctions, PEP, and criminal entity datasets. Returns matching entities with properties, datasets, and risk topics.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(500)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'schema', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(Thing)'] } },
                { position: { key: 'countries', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'topics', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'datasets', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for sanctioned Russian entities', q: 'Gazprom' },
                { _description: 'Search PEPs in Germany', q: 'Putin', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, caption: { type: 'string' }, schema: { type: 'string' }, properties: { type: 'object' }, datasets: { type: 'array', items: { type: 'string' } }, referents: { type: 'array', items: { type: 'string' } }, topics: { type: 'array', items: { type: 'string' } }, score: { type: 'number' } } } },
                        total: { type: 'number' },
                        limit: { type: 'number' },
                        offset: { type: 'number' },
                        facets: { type: 'object' }
                    }
                }
            },
        },
        getEntity: {
            method: 'GET',
            path: '/entities/:entity_id',
            description: 'Fetch full details for a specific entity by ID. Returns all properties, associated datasets, and nested adjacent entities.',
            parameters: [
                { position: { key: 'entity_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'nested', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(true)'] } }
            ],
            tests: [
                { _description: 'Get entity details for Vladimir Putin', entity_id: 'Q7747' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        caption: { type: 'string' },
                        schema: { type: 'string' },
                        properties: { type: 'object' },
                        datasets: { type: 'array', items: { type: 'string' } },
                        referents: { type: 'array', items: { type: 'string' } },
                        topics: { type: 'array', items: { type: 'string' } },
                        first_seen: { type: 'string' },
                        last_seen: { type: 'string' },
                        last_change: { type: 'string' }
                    }
                }
            },
        },
        getAdjacentEntities: {
            method: 'GET',
            path: '/entities/:entity_id/adjacent',
            description: 'Fetch entities adjacent to a given entity (e.g., ownership, family, directorships). Returns grouped results by property type.',
            parameters: [
                { position: { key: 'entity_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(500)'] } }
            ],
            tests: [
                { _description: 'Get adjacent entities for Putin', entity_id: 'Q7747', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        entity: { type: 'object', properties: { id: { type: 'string' }, caption: { type: 'string' }, schema: { type: 'string' } } },
                        results: { type: 'object' }
                    }
                }
            },
        },
        matchEntities: {
            method: 'POST',
            path: '/match/default',
            description: 'Screen persons or companies against all sanctions and PEP watchlists. Submit entity properties and receive scored matches. Supports configurable threshold and algorithm.',
            parameters: [
                { position: { key: 'queries', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'threshold', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0.7)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(5)', 'max(500)'] } },
                { position: { key: 'algorithm', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(best,logic-v2,name-based,name-qualified,logic-v1,regression-v1)', options: ['optional()', 'default(best)'] } }
            ],
            tests: [
                { _description: 'Match a person against watchlists', queries: '{"q1":{"schema":"Person","properties":{"name":["Vladimir Putin"]}}}' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        responses: { type: 'object' },
                        total: { type: 'object' }
                    }
                }
            },
        },
        getCatalog: {
            method: 'GET',
            path: '/catalog',
            description: 'Retrieve the data catalog listing all available datasets with metadata including entity counts, update frequency, and source information.',
            parameters: [],
            tests: [
                { _description: 'Get full dataset catalog' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        datasets: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, title: { type: 'string' }, summary: { type: 'string' }, url: { type: 'string' }, entities_count: { type: 'number' } } } }
                    }
                }
            },
        },
        getStatements: {
            method: 'GET',
            path: '/statements',
            description: 'Access granular statement-level records. Each statement represents a single property value for an entity from a specific dataset source.',
            parameters: [
                { position: { key: 'entity_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'dataset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'prop', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'max(5000)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'Get statements for Putin entity', entity_id: 'Q7747', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, entity_id: { type: 'string' }, canonical_id: { type: 'string' }, prop: { type: 'string' }, prop_type: { type: 'string' }, schema: { type: 'string' }, value: { type: 'string' }, dataset: { type: 'string' }, first_seen: { type: 'string' }, last_seen: { type: 'string' } } } },
                        total: { type: 'number' },
                        limit: { type: 'number' },
                        offset: { type: 'number' }
                    }
                }
            },
        }
    }
}
