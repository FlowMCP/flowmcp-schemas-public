export const main = {
    namespace: 'openalex',
    name: 'OpenAlex',
    description: 'Access the OpenAlex scholarly graph with 240M+ works, authors, institutions, funders, and topics. Free and open catalog of the global research system.',
    version: '4.0.0',
    docs: ['https://docs.openalex.org/'],
    tags: ['science', 'research', 'academic', 'publications', 'citations', 'cacheTtlDaily'],
    root: 'https://api.openalex.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchWorks: {
            method: 'GET',
            path: '/works',
            description: 'Search scholarly works by keyword, filter by date, type, open access status, and more. Returns titles, authors, DOIs, citation counts. Use work IDs from results in getWork for full metadata including abstracts.',
            parameters: [
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'filter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'max(200)'] } }
            ],
            tests: [
                { _description: 'Search for works about machine learning', search: 'machine learning', per_page: 5 },
                { _description: 'Filter works by publication year and open access', filter: 'publication_year:2024,is_oa:true', per_page: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object', properties: { count: { type: 'number' }, page: { type: 'number' }, per_page: { type: 'number' } } },
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, doi: { type: 'string' }, title: { type: 'string' }, display_name: { type: 'string' }, publication_year: { type: 'number' }, cited_by_count: { type: 'number' }, type: { type: 'string' } } } }
                    }
                }
            },
        },
        getWork: {
            method: 'GET',
            path: '/works/:id',
            description: 'Get a single work by OpenAlex ID, DOI, PMID, or PMCID. Returns full metadata including abstract and open access info. Use IDs from searchWorks or autocompleteEntities.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get a work by OpenAlex ID', id: 'W2741809807' },
                { _description: 'Get a work by DOI', id: 'doi:10.7717/peerj.4375' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: { id: { type: 'string' }, doi: { type: 'string' }, title: { type: 'string' }, display_name: { type: 'string' }, publication_year: { type: 'number' }, cited_by_count: { type: 'number' }, authorships: { type: 'array' }, open_access: { type: 'object' }, abstract_inverted_index: { type: 'object' } }
                }
            },
        },
        searchAuthors: {
            method: 'GET',
            path: '/authors',
            description: 'Search for authors by name or filter by institution, works count, citation count. Use author IDs from results in getAuthor for full profile with h-index and affiliations.',
            parameters: [
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'filter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'max(200)'] } }
            ],
            tests: [
                { _description: 'Search for authors named Einstein', search: 'Einstein', per_page: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object', properties: { count: { type: 'number' }, page: { type: 'number' }, per_page: { type: 'number' } } },
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, display_name: { type: 'string' }, works_count: { type: 'number' }, cited_by_count: { type: 'number' }, last_known_institutions: { type: 'array' } } } }
                    }
                }
            },
        },
        getAuthor: {
            method: 'GET',
            path: '/authors/:id',
            description: 'Get a single author by OpenAlex ID or ORCID. Returns full profile including name, affiliations, works count, citation metrics, and h-index.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get author by OpenAlex ID', id: 'A5023888391' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: { id: { type: 'string' }, display_name: { type: 'string' }, works_count: { type: 'number' }, cited_by_count: { type: 'number' }, summary_stats: { type: 'object' }, affiliations: { type: 'array' }, ids: { type: 'object' } }
                }
            },
        },
        searchInstitutions: {
            method: 'GET',
            path: '/institutions',
            description: 'Search for research institutions by name or filter by country, type, and works count. Returns institution profiles with ROR IDs and associated metadata.',
            parameters: [
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'filter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'max(200)'] } }
            ],
            tests: [
                { _description: 'Search for MIT', search: 'Massachusetts Institute of Technology', per_page: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object', properties: { count: { type: 'number' }, page: { type: 'number' }, per_page: { type: 'number' } } },
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, display_name: { type: 'string' }, ror: { type: 'string' }, country_code: { type: 'string' }, type: { type: 'string' }, works_count: { type: 'number' }, cited_by_count: { type: 'number' } } } }
                    }
                }
            },
        },
        searchFunders: {
            method: 'GET',
            path: '/funders',
            description: 'Search for research funders by name. Returns funder profiles with grant counts, associated works, and identifiers.',
            parameters: [
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'filter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'max(200)'] } }
            ],
            tests: [
                { _description: 'Search for NSF funders', search: 'National Science Foundation', per_page: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object', properties: { count: { type: 'number' }, page: { type: 'number' }, per_page: { type: 'number' } } },
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, display_name: { type: 'string' }, grants_count: { type: 'number' }, works_count: { type: 'number' }, cited_by_count: { type: 'number' } } } }
                    }
                }
            },
        },
        searchTopics: {
            method: 'GET',
            path: '/topics',
            description: 'Search the ~4,500 research topics in OpenAlex. Topics are algorithmically assigned to works. Returns topic details with field and domain classification.',
            parameters: [
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'filter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'max(200)'] } }
            ],
            tests: [
                { _description: 'Search for topics related to climate change', search: 'climate change', per_page: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object', properties: { count: { type: 'number' }, page: { type: 'number' }, per_page: { type: 'number' } } },
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, display_name: { type: 'string' }, field: { type: 'object' }, domain: { type: 'object' }, works_count: { type: 'number' } } } }
                    }
                }
            },
        },
        autocompleteEntities: {
            method: 'GET',
            path: '/autocomplete/:entityType',
            description: 'Get typeahead suggestions for any entity type (works, authors, institutions, funders, topics). Use returned IDs in the corresponding search or get tools (e.g. getWork, getAuthor).',
            parameters: [
                { position: { key: 'entityType', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(works,authors,institutions,funders,topics,sources,publishers,concepts)', options: [] } },
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Autocomplete works with keyword', entityType: 'works', q: 'quantum computing' },
                { _description: 'Autocomplete authors by name', entityType: 'authors', q: 'hinton' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, display_name: { type: 'string' }, hint: { type: 'string' }, cited_by_count: { type: 'number' }, entity_type: { type: 'string' } } } }
                    }
                }
            },
        }
    }
}
