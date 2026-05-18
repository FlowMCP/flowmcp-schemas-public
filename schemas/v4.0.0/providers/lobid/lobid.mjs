export const main = {
    namespace: 'lobid',
    name: 'lobid',
    description: 'hbz Linked Open Data service providing access to German library catalog resources (250M+ holdings), GND authority records (Gemeinsame Normdatei), and library organisations via REST/JSON-LD API',
    version: '4.0.0',
    docs: ['https://lobid.org/resources/api', 'https://lobid.org/gnd/api'],
    tags: ['library', 'catalog', 'gnd', 'authority', 'bibliography', 'germany', 'opendata', 'cacheTtlDaily'],
    root: 'https://lobid.org',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        searchResources: {
            method: 'GET',
            path: '/resources/search',
            description: 'Search bibliographic resources across German library catalogs (250M+ holdings). Supports Lucene query syntax, field-specific search, and aggregations.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'from', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for Goethe publications', q: 'goethe', size: 3 },
                { _description: 'Search by title field', q: 'title:Faust', size: 2 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        totalItems: { type: 'number' },
                        member: { type: 'array', items: { type: 'object' } },
                        id: { type: 'string' }
                    }
                }
            }
        },
        getResource: {
            method: 'GET',
            path: '/resources/:resourceId.json',
            description: 'Retrieve a single bibliographic resource by its hbz catalog ID. Returns full JSON-LD record with title, authors, subjects, holdings.',
            parameters: [
                { position: { key: 'resourceId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get a specific catalog record', resourceId: 'HT016203987' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        type: { type: 'array', items: { type: 'string' } },
                        title: { type: 'string' },
                        contribution: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        },
        searchGnd: {
            method: 'GET',
            path: '/gnd/search',
            description: 'Search GND (Gemeinsame Normdatei) authority records — persons, organizations, subjects, places. 9M+ entries from the German National Library.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'filter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'from', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search GND for Goethe', q: 'Goethe', size: 3 },
                { _description: 'Search GND for persons named Einstein', q: 'preferredName:Einstein', filter: 'type:Person', size: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        totalItems: { type: 'number' },
                        member: { type: 'array', items: { type: 'object' } },
                        id: { type: 'string' }
                    }
                }
            }
        },
        getGndRecord: {
            method: 'GET',
            path: '/gnd/:gndId.json',
            description: 'Retrieve a single GND authority record by its GND identifier. Returns detailed information about a person, organization, subject, or place.',
            parameters: [
                { position: { key: 'gndId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get GND record for Johann Wolfgang von Goethe', gndId: '118540238' },
                { _description: 'Get GND record for Berlin', gndId: '4005728-8' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        type: { type: 'array', items: { type: 'string' } },
                        preferredName: { type: 'string' },
                        variantName: { type: 'array', items: { type: 'string' } },
                        gndIdentifier: { type: 'string' }
                    }
                }
            }
        },
        searchResourcesByAuthor: {
            method: 'GET',
            path: '/resources/search',
            description: 'Search bibliographic resources by author/contributor name. Uses the contribution.agent.label field for precise author matching.',
            parameters: [
                { position: { key: 'q', value: 'contribution.agent.label:{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for works by Kafka', q: 'Kafka', size: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        totalItems: { type: 'number' },
                        member: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        },
        searchGndPersons: {
            method: 'GET',
            path: '/gnd/search',
            description: 'Search GND specifically for persons — authors, artists, scientists, historical figures. Filters by type:Person.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'filter', value: 'type:Person', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for persons named Bach', q: 'Bach', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        totalItems: { type: 'number' },
                        member: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        },
        searchResourcesBySubject: {
            method: 'GET',
            path: '/resources/search',
            description: 'Search bibliographic resources by subject heading. Uses the subject.label field for topic-based discovery.',
            parameters: [
                { position: { key: 'q', value: 'subject.label:{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for resources about artificial intelligence', q: 'Künstliche Intelligenz', size: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        totalItems: { type: 'number' },
                        member: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        },
        autocompleteGnd: {
            method: 'GET',
            path: '/gnd/search',
            description: 'Autocomplete/suggest GND entries by name prefix. Returns compact suggestions suitable for search-as-you-type interfaces.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(5)'] } },
                { position: { key: 'format', value: 'json:suggest', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Autocomplete for Beethoven', q: 'Beethov', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            label: { type: 'string' },
                            id: { type: 'string' },
                            category: { type: 'string' }
                        }
                    }
                }
            }
        }
    }
}
