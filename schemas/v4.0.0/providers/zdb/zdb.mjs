export const main = {
    namespace: 'zdb',
    name: 'ZDB',
    description: 'Access the Zeitschriftendatenbank (German Journal Database) with 2.2M+ serial titles and 24.7M holdings from 3,700+ libraries. Returns JSON-LD. Free, no key required.',
    version: '4.0.0',
    docs: ['https://zeitschriftendatenbank.de/services/schnittstellen/json-api'],
    tags: ['libraries', 'journals', 'serials', 'bibliography', 'germany', 'cacheTtlDaily'],
    root: 'https://zeitschriftendatenbank.de/api',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchTitles: {
            method: 'GET',
            path: '/tit.jsonld',
            description: 'Search serial titles in ZDB by keyword. Returns JSON-LD collection with ISSN, title, publisher, medium, and pagination. Supports full-text and field-specific queries.. Use IDs from results in getTitle',
            parameters: [
                { position: { key: 'q', value: '{{QUERY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'size', value: '{{SIZE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'page', value: '{{PAGE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'compact', value: '{{COMPACT}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for journals about nature', q: 'nature', size: 3 },
                { _description: 'Search for journals with ISSN prefix', q: 'issn=0002', size: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        '@context': { type: 'string' },
                        type: { type: 'string' },
                        freetextQuery: { type: 'string' },
                        totalItems: { type: 'number' },
                        member: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    type: { type: 'string' },
                                    identifier: { type: 'string' },
                                    title: { type: 'string' },
                                    issn: { type: 'string' },
                                    medium: { type: 'string' },
                                    publisher: { type: 'string' }
                                }
                            }
                        },
                        view: {
                            type: 'object',
                            properties: {
                                type: { type: 'string' },
                                first: { type: 'string' },
                                last: { type: 'string' },
                                next: { type: 'string' }
                            }
                        }
                    }
                }
            }
        },
        getTitle: {
            method: 'GET',
            path: '/tit/:zdbId.jsonld',
            description: 'Get a single serial title by ZDB-ID. Returns full JSON-LD record with ISSN, title, publisher, publication history, medium type, and PICA+ data fields.. Use searchTitles first to find valid IDs',
            parameters: [
                { position: { key: 'zdbId', value: '{{ZDB_ID}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get American Journal of Physics by ZDB-ID', zdbId: '2947-6' },
                { _description: 'Get Nature by ZDB-ID', zdbId: '800-x' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        '@context': { type: 'string' },
                        type: { type: 'string' },
                        totalItems: { type: 'number' },
                        member: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    type: { type: 'string' },
                                    identifier: { type: 'string' },
                                    title: { type: 'string' },
                                    issn: { type: 'string' },
                                    medium: { type: 'string' },
                                    publisher: { type: 'string' },
                                    temporal: { type: 'string' },
                                    data: { type: 'object' }
                                }
                            }
                        }
                    }
                }
            }
        },
        searchTitlesLookup: {
            method: 'GET',
            path: '/tit.jsonld',
            description: 'Lightweight title lookup returning minimal fields (id, title, ISSN, medium). Use format=lookup for autocomplete-style searches with reduced payload size.',
            parameters: [
                { position: { key: 'q', value: '{{QUERY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'lookup', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'size', value: '{{SIZE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'page', value: '{{PAGE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } }
            ],
            tests: [
                { _description: 'Lookup journals matching physics', q: 'physics', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        '@context': { type: 'string' },
                        type: { type: 'string' },
                        freetextQuery: { type: 'string' },
                        totalItems: { type: 'number' },
                        member: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    title: { type: 'string' },
                                    issn: { type: 'string' },
                                    medium: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        searchTitlesData: {
            method: 'GET',
            path: '/tit.jsonld',
            description: 'Full data title search returning complete PICA+ records. Use format=data for detailed bibliographic data including all MARC-like fields.',
            parameters: [
                { position: { key: 'q', value: '{{QUERY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'data', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'size', value: '{{SIZE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'page', value: '{{PAGE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } }
            ],
            tests: [
                { _description: 'Get full PICA data for chemistry journals', q: 'chemistry', size: 2 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        '@context': { type: 'string' },
                        type: { type: 'string' },
                        freetextQuery: { type: 'string' },
                        totalItems: { type: 'number' },
                        member: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    title: { type: 'string' },
                                    issn: { type: 'string' },
                                    medium: { type: 'string' },
                                    publisher: { type: 'string' },
                                    data: { type: 'object' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
