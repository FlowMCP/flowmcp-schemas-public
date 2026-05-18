export const main = {
    namespace: 'catalogueoflife',
    name: 'CatalogueOfLife',
    description: 'Search and retrieve taxonomic name records from the Catalogue of Life ChecklistBank — 2.07M+ species across all kingdoms of life.',
    version: '4.0.0',
    docs: ['https://api.catalogueoflife.org/'],
    tags: ['taxonomy', 'biology', 'species', 'science', 'cacheTtlDaily'],
    root: 'https://api.catalogueoflife.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchNames: {
            method: 'GET',
            path: '/nameusage/search',
            description: 'Search taxonomic name usages across the Catalogue of Life by scientific or vernacular name.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(prefix,whole_words,exact)', options: ['optional()'] } },
                { position: { key: 'rank', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'status', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(accepted,ambiguous_synonym,misapplied,provisionally_accepted,synonym,bare_name)', options: ['optional()'] } },
                { position: { key: 'datasetKey', value: '3', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Search for lion species in COL', q: 'Panthera leo' },
                { _description: 'Search for accepted species named Homo', q: 'Homo sapiens', status: 'accepted' },
                { _description: 'Search by prefix for Puma with limit', q: 'Puma', type: 'prefix', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        offset: { type: 'number', description: 'Current offset' },
                        limit: { type: 'number', description: 'Number of results per page' },
                        total: { type: 'number', description: 'Total matching records' },
                        result: { type: 'array', description: 'Array of name usage records' },
                        empty: { type: 'boolean', description: 'Whether result is empty' },
                        last: { type: 'boolean', description: 'Whether this is the last page' }
                    }
                }
            }
        },
        getNameUsage: {
            method: 'GET',
            path: '/dataset/3/nameusage/:id',
            description: 'Retrieve a specific taxon by its unique ID from the Catalogue of Life.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get taxon by known COL ID for Panthera leo', id: '6MB3T' },
                { _description: 'Get taxon record for Homo sapiens', id: '6MFKM' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Unique taxon identifier' },
                        status: { type: 'string', description: 'Taxonomic status (accepted, synonym, etc.)' },
                        rank: { type: 'string', description: 'Taxonomic rank' },
                        label: { type: 'string', description: 'Full taxon label with authorship' },
                        classification: { type: 'array', description: 'Hierarchical classification' }
                    }
                }
            }
        },
        matchName: {
            method: 'GET',
            path: '/nidx/match',
            description: 'Match a scientific name to a COL record, returning the best matching taxon with classification.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'verbose', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } }
            ],
            tests: [
                { _description: 'Match exact species name for wolf', q: 'Canis lupus' },
                { _description: 'Match name with verbose output for oak', q: 'Quercus robur', verbose: true }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        usage: { type: 'object', description: 'Matched name usage record' },
                        type: { type: 'string', description: 'Match type (exact, canonical, etc.)' }
                    }
                }
            }
        },
        listVocabulary: {
            method: 'GET',
            path: '/vocab/:vocab',
            description: 'List all values for a COL vocabulary such as taxonomic ranks, environments, or name types.',
            parameters: [
                { position: { key: 'vocab', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(rank,environment,nametype,nomcode,taxonomicstatus,typestatustype)', options: [] } }
            ],
            tests: [
                { _description: 'List all taxonomic ranks', vocab: 'rank' },
                { _description: 'List all taxonomic status values', vocab: 'taxonomicstatus' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of vocabulary values'
                }
            }
        },
        getApiVersion: {
            method: 'GET',
            path: '/version',
            description: 'Retrieve the current version of the COL ChecklistBank API.',
            parameters: [],
            tests: [
                { _description: 'Get current API version' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        version: { type: 'string', description: 'API version string' }
                    }
                }
            }
        }
    }
}
