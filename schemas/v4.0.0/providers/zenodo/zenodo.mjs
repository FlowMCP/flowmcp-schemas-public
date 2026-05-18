export const main = {
    namespace: 'zenodo',
    name: 'Zenodo',
    description: 'Search and retrieve open research datasets, publications, software, and other research outputs from Zenodo, the CERN-hosted open science repository.',
    version: '4.0.0',
    docs: ['https://developers.zenodo.org/'],
    tags: ['science', 'research', 'datasets', 'openaccess', 'publications', 'cacheTtlDaily'],
    root: 'https://zenodo.org/api',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchRecords: {
            method: 'GET',
            path: '/records/',
            description: 'Search published research records using Elasticsearch query syntax. Filter by type, community, status, and geolocation. Supports pagination and sorting.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(publication,poster,presentation,dataset,image,video,software,lesson,physicalobject,other)', options: ['optional()'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(bestmatch,mostrecent,-bestmatch,-mostrecent)', options: ['optional()', 'default(bestmatch)'] } },
                { position: { key: 'communities', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'all_versions', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(100)'] } }
            ],
            tests: [
                { _description: 'Search for climate change datasets', q: 'climate change', type: 'dataset', size: 5 },
                { _description: 'Search for machine learning software', q: 'machine learning', type: 'software', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        hits: { type: 'object', properties: { total: { type: 'number' }, hits: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, doi: { type: 'string' }, metadata: { type: 'object' }, links: { type: 'object' } } } } } }
                    }
                }
            },
        },
        getRecord: {
            method: 'GET',
            path: '/records/:recordId',
            description: 'Retrieve a single published record by its Zenodo ID. Returns full metadata including title, creators, description, files, license, and DOI.',
            parameters: [
                { position: { key: 'recordId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get a specific Zenodo record', recordId: 1217190 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        doi: { type: 'string' },
                        metadata: { type: 'object', properties: { title: { type: 'string' }, creators: { type: 'array' }, description: { type: 'string' }, license: { type: 'object' }, publication_date: { type: 'string' }, resource_type: { type: 'object' } } },
                        files: { type: 'array' },
                        links: { type: 'object' }
                    }
                }
            },
        },
        searchCommunities: {
            method: 'GET',
            path: '/communities/',
            description: 'Search Zenodo communities (curated collections of research outputs). Communities group related records by topic, project, or institution.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(bestmatch,mostrecent)', options: ['optional()', 'default(bestmatch)'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(100)'] } }
            ],
            tests: [
                { _description: 'Search for genomics communities', q: 'genomics', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        hits: { type: 'object', properties: { total: { type: 'number' }, hits: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, curation_policy: { type: 'string' } } } } } }
                    }
                }
            },
        },
        searchLicenses: {
            method: 'GET',
            path: '/licenses/',
            description: 'Search available licenses in Zenodo. Returns license identifiers, titles, and URLs used for tagging research outputs.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } }
            ],
            tests: [
                { _description: 'Search for Creative Commons licenses', q: 'creative commons', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        hits: { type: 'object', properties: { total: { type: 'number' }, hits: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, title: { type: 'string' }, url: { type: 'string' } } } } } }
                    }
                }
            },
        },
        searchFunders: {
            method: 'GET',
            path: '/funders/',
            description: 'Search for research funders registered in Zenodo. Returns funder names, identifiers, and associated grant information.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } }
            ],
            tests: [
                { _description: 'Search for NIH as funder', q: 'National Institutes of Health', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        hits: { type: 'object', properties: { total: { type: 'number' }, hits: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, country: { type: 'string' }, acronyms: { type: 'array' } } } } } }
                    }
                }
            },
        }
    }
}
