export const main = {
    namespace: 'openlegaldata',
    name: 'Open Legal Data',
    description: 'Access 250K+ German court decisions, 57K+ law sections, 1100+ law books, and court metadata via the Open Legal Data REST API (CC0 licensed).',
    version: '4.0.0',
    docs: ['https://de.openlegaldata.io/api/'],
    tags: ['legal', 'germany', 'courts', 'opendata', 'law', 'cacheTtlDaily'],
    root: 'https://de.openlegaldata.io/api',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchCases: {
            method: 'GET',
            path: '/cases/search/',
            description: 'Full-text search across 250K+ German court decisions. Returns case metadata including court, date, decision type, and full text.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for cases about Mord (murder)', query: 'Mord' },
                { _description: 'Search for DSGVO privacy cases', query: 'DSGVO' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number' },
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, slug: { type: 'string' }, court: { type: 'object' }, file_number: { type: 'string' }, date: { type: 'string' } } } }
                    }
                }
            },
        },
        listCases: {
            method: 'GET',
            path: '/cases/',
            description: 'List German court decisions with pagination. Returns case ID, slug, court details, file number, date, ECLI, decision type, and full content.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'List first 5 court decisions', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number' },
                        next: { type: 'string' },
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, slug: { type: 'string' }, court: { type: 'object' }, file_number: { type: 'string' }, date: { type: 'string' }, ecli: { type: 'string' } } } }
                    }
                }
            },
        },
        searchLaws: {
            method: 'GET',
            path: '/laws/search/',
            description: 'Full-text search across German law sections. Returns matching sections with title, content, book reference, and section identifier.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for Grundgesetz provisions', query: 'Grundgesetz' },
                { _description: 'Search for Mietrecht (tenancy law)', query: 'Mietrecht' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number' },
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, title: { type: 'string' }, content: { type: 'string' }, book: { type: 'object' } } } }
                    }
                }
            },
        },
        listLaws: {
            method: 'GET',
            path: '/laws/',
            description: 'List German law sections with pagination. Returns section details including title, content, book reference, document number, and ordering.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'List first 5 law sections', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number' },
                        next: { type: 'string' },
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, title: { type: 'string' }, content: { type: 'string' }, book: { type: 'object' } } } }
                    }
                }
            },
        },
        listLawBooks: {
            method: 'GET',
            path: '/law_books/',
            description: 'List 1100+ German law books (codes and statutes). Returns book code, full title, revision date, and version status.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'List first 10 law books', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number' },
                        next: { type: 'string' },
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, code: { type: 'string' }, title: { type: 'string' }, revision_date: { type: 'string' } } } }
                    }
                }
            },
        },
        listStates: {
            method: 'GET',
            path: '/states/',
            description: 'List all German federal states (Bundeslaender) used as court location reference. Returns state name, country association, and slug.',
            parameters: [
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'List all German federal states' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number' },
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, slug: { type: 'string' } } } }
                    }
                }
            },
        }
    }
}
