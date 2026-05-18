export const main = {
    namespace: 'openaire',
    name: 'OpenAIRE',
    description: 'Search the OpenAIRE Research Graph containing 170M+ research products. Query publications, datasets, software, and projects with EU funding linkage, open access status, and impact metrics.',
    version: '4.0.0',
    docs: ['https://graph.openaire.eu/docs/apis/search-api/'],
    tags: ['science', 'research', 'publications', 'openaccess', 'funding', 'cacheTtlDaily'],
    root: 'https://api.openaire.eu',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchPublications: {
            method: 'GET',
            path: '/search/publications',
            description: 'Search for scientific publications by keywords, author, DOI, title, or ORCID. Filter by open access status, funding source, country. For datasets use searchDatasets, for all types use searchResearchProducts.',
            parameters: [
                { position: { key: 'keywords', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'title', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'author', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'doi', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'orcid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'OA', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'funder', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(WT,EC,ARC,ANDS,NSF,FCT,NHMRC)', options: ['optional()'] } },
                { position: { key: 'fromDateAccepted', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'toDateAccepted', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'country', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for open access publications about CRISPR', keywords: 'CRISPR', OA: true, size: 5 },
                { _description: 'Search for publications by DOI', doi: '10.1038/s41586-020-2649-2', size: 5 },
                { _description: 'Search for EU-funded publications about climate change', keywords: 'climate change', funder: 'EC', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        response: { type: 'object', properties: { header: { type: 'object', properties: { total: { type: 'string' }, page: { type: 'string' }, size: { type: 'string' } } }, results: { type: 'array' } } }
                    }
                }
            },
        },
        searchDatasets: {
            method: 'GET',
            path: '/search/datasets',
            description: 'Search for research datasets by keywords, author, DOI, or title. Filter by open access, funding source, and country.',
            parameters: [
                { position: { key: 'keywords', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'title', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'author', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'doi', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'OA', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'funder', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(WT,EC,ARC,ANDS,NSF,FCT,NHMRC)', options: ['optional()'] } },
                { position: { key: 'country', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for genomics datasets', keywords: 'genomics', size: 5 },
                { _description: 'Search for open access datasets about biodiversity', keywords: 'biodiversity', OA: true, size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        response: { type: 'object', properties: { header: { type: 'object', properties: { total: { type: 'string' }, page: { type: 'string' }, size: { type: 'string' } } }, results: { type: 'array' } } }
                    }
                }
            },
        },
        searchSoftware: {
            method: 'GET',
            path: '/search/software',
            description: 'Search for research software by keywords, author, DOI, or title. Filter by open access, funding source, and country.',
            parameters: [
                { position: { key: 'keywords', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'title', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'author', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'doi', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'OA', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for machine learning software', keywords: 'machine learning', size: 5 },
                { _description: 'Search for bioinformatics software', keywords: 'bioinformatics', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        response: { type: 'object', properties: { header: { type: 'object', properties: { total: { type: 'string' }, page: { type: 'string' }, size: { type: 'string' } } }, results: { type: 'array' } } }
                    }
                }
            },
        },
        searchResearchProducts: {
            method: 'GET',
            path: '/search/researchProducts',
            description: 'Search across all research product types (publications, datasets, software, other). Unified search alternative to type-specific tools (searchPublications, searchDatasets, searchSoftware). Includes impact metrics filtering.',
            parameters: [
                { position: { key: 'keywords', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'doi', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'orcid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'OA', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'funder', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(WT,EC,ARC,ANDS,NSF,FCT,NHMRC)', options: ['optional()'] } },
                { position: { key: 'country', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'influence', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(C1,C2,C3,C4,C5)', options: ['optional()'] } },
                { position: { key: 'popularity', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(C1,C2,C3,C4,C5)', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for highly influential AI research', keywords: 'artificial intelligence', influence: 'C1', size: 5 },
                { _description: 'Search for NSF-funded research products', funder: 'NSF', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        response: { type: 'object', properties: { header: { type: 'object', properties: { total: { type: 'string' }, page: { type: 'string' }, size: { type: 'string' } } }, results: { type: 'array' } } }
                    }
                }
            },
        },
        searchProjects: {
            method: 'GET',
            path: '/search/projects',
            description: 'Search for funded research projects by keywords, grant ID, project name, acronym, funder, or participating countries. Filter by funding stream and time period.',
            parameters: [
                { position: { key: 'keywords', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'acronym', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'grantID', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'funder', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(WT,EC,ARC,ANDS,NSF,FCT,NHMRC)', options: ['optional()'] } },
                { position: { key: 'fundingStream', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'startYear', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endYear', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'participantCountries', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for EC-funded projects about quantum computing', keywords: 'quantum computing', funder: 'EC', size: 5 },
                { _description: 'Search for NSF projects starting in 2023', funder: 'NSF', startYear: '2023', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        response: { type: 'object', properties: { header: { type: 'object', properties: { total: { type: 'string' }, page: { type: 'string' }, size: { type: 'string' } } }, results: { type: 'array' } } }
                    }
                }
            },
        }
    }
}
