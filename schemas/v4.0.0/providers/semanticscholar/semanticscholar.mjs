export const main = {
    namespace: 'semanticscholar',
    name: 'Semantic Scholar',
    description: 'Access the Semantic Scholar academic graph with 200M+ papers, TLDR summaries, citation intent, embeddings, and author profiles. Free API, no key required for basic access.',
    version: '4.0.0',
    docs: ['https://api.semanticscholar.org/api-docs/graph'],
    tags: ['science', 'research', 'academic', 'papers', 'citations', 'cacheTtlDaily'],
    root: 'https://api.semanticscholar.org/graph/v1',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchPapers: {
            method: 'GET',
            path: '/paper/search',
            description: 'Search for papers by keyword query. Returns relevance-ranked results with titles, authors, citation counts, and more. Supports filtering by publication type, year, venue, and fields of study.. Use IDs from results in getPaper',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(paperId,title,year,citationCount,authors)'] } },
                { position: { key: 'publicationTypes', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'fieldsOfStudy', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(100)'] } }
            ],
            tests: [
                { _description: 'Search for papers about transformer models', query: 'transformer attention mechanism', limit: 5 },
                { _description: 'Search for recent AI papers', query: 'large language models', year: '2024', limit: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        offset: { type: 'number' },
                        data: { type: 'array', items: { type: 'object', properties: { paperId: { type: 'string' }, title: { type: 'string' }, year: { type: 'number' }, citationCount: { type: 'number' }, authors: { type: 'array' } } } }
                    }
                }
            },
        },
        getPaper: {
            method: 'GET',
            path: '/paper/:paperId',
            description: 'Get details for a single paper by Semantic Scholar ID, DOI, ArXiv ID, PMID, PMCID, ACL ID, or Corpus ID. Returns full metadata including abstract, TLDR, citation counts, and references.. Use searchPapers first to find valid IDs',
            parameters: [
                { position: { key: 'paperId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(paperId,title,abstract,year,citationCount,authors,tldr)'] } }
            ],
            tests: [
                { _description: 'Get Attention Is All You Need paper by S2 ID', paperId: '204e3073870fae3d05bcbc2f6a8e263d9b72e776', fields: 'paperId,title,abstract,year,citationCount,authors,tldr' },
                { _description: 'Get paper by DOI', paperId: 'DOI:10.1038/nrn3241', fields: 'paperId,title,year,citationCount' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: { paperId: { type: 'string' }, title: { type: 'string' }, abstract: { type: 'string' }, year: { type: 'number' }, citationCount: { type: 'number' }, authors: { type: 'array' }, tldr: { type: 'object', properties: { text: { type: 'string' } } } }
                }
            },
        },
        getPaperCitations: {
            method: 'GET',
            path: '/paper/:paperId/citations',
            description: 'Get papers that cite a given paper. Returns citing papers with their metadata. Supports pagination with offset and limit.',
            parameters: [
                { position: { key: 'paperId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(paperId,title,year,citationCount,authors)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(1000)'] } }
            ],
            tests: [
                { _description: 'Get citations for Attention Is All You Need', paperId: '204e3073870fae3d05bcbc2f6a8e263d9b72e776', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        offset: { type: 'number' },
                        data: { type: 'array', items: { type: 'object', properties: { citingPaper: { type: 'object', properties: { paperId: { type: 'string' }, title: { type: 'string' }, year: { type: 'number' }, citationCount: { type: 'number' } } } } } }
                    }
                }
            },
        },
        getPaperReferences: {
            method: 'GET',
            path: '/paper/:paperId/references',
            description: 'Get papers referenced by a given paper. Returns the bibliography entries with metadata. Supports pagination with offset and limit.',
            parameters: [
                { position: { key: 'paperId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(paperId,title,year,citationCount,authors)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(1000)'] } }
            ],
            tests: [
                { _description: 'Get references from Attention Is All You Need', paperId: '204e3073870fae3d05bcbc2f6a8e263d9b72e776', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        offset: { type: 'number' },
                        data: { type: 'array', items: { type: 'object', properties: { citedPaper: { type: 'object', properties: { paperId: { type: 'string' }, title: { type: 'string' }, year: { type: 'number' }, citationCount: { type: 'number' } } } } } }
                    }
                }
            },
        },
        getPaperAuthors: {
            method: 'GET',
            path: '/paper/:paperId/authors',
            description: 'Get the list of authors for a given paper with their profiles and metrics.',
            parameters: [
                { position: { key: 'paperId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(authorId,name,affiliations,citationCount,hIndex)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)', 'max(1000)'] } }
            ],
            tests: [
                { _description: 'Get authors of Attention Is All You Need', paperId: '204e3073870fae3d05bcbc2f6a8e263d9b72e776', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        offset: { type: 'number' },
                        data: { type: 'array', items: { type: 'object', properties: { authorId: { type: 'string' }, name: { type: 'string' }, affiliations: { type: 'array' }, citationCount: { type: 'number' }, hIndex: { type: 'number' } } } }
                    }
                }
            },
        },
        searchAuthors: {
            method: 'GET',
            path: '/author/search',
            description: 'Search for authors by name. Returns author profiles with paper counts, citation metrics, and affiliations.. Use IDs from results in getPaperAuthors',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(authorId,name,paperCount,citationCount,hIndex)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(1000)'] } }
            ],
            tests: [
                { _description: 'Search for author Geoffrey Hinton', query: 'Geoffrey Hinton', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        offset: { type: 'number' },
                        data: { type: 'array', items: { type: 'object', properties: { authorId: { type: 'string' }, name: { type: 'string' }, paperCount: { type: 'number' }, citationCount: { type: 'number' }, hIndex: { type: 'number' } } } }
                    }
                }
            },
        },
        getAuthor: {
            method: 'GET',
            path: '/author/:authorId',
            description: 'Get details for a single author by Semantic Scholar author ID. Returns full profile including name, affiliations, paper count, citation count, and h-index.. Use searchPapers first to find valid IDs',
            parameters: [
                { position: { key: 'authorId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(authorId,name,affiliations,paperCount,citationCount,hIndex)'] } }
            ],
            tests: [
                { _description: 'Get author profile for Geoffrey Hinton', authorId: '1695689', fields: 'authorId,name,affiliations,paperCount,citationCount,hIndex' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: { authorId: { type: 'string' }, name: { type: 'string' }, affiliations: { type: 'array' }, paperCount: { type: 'number' }, citationCount: { type: 'number' }, hIndex: { type: 'number' } }
                }
            },
        },
        getAuthorPapers: {
            method: 'GET',
            path: '/author/:authorId/papers',
            description: 'Get papers written by a specific author. Returns paginated list of papers with metadata. Supports filtering by publication date.',
            parameters: [
                { position: { key: 'authorId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(paperId,title,year,citationCount)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(1000)'] } }
            ],
            tests: [
                { _description: 'Get papers by Geoffrey Hinton', authorId: '1695689', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        offset: { type: 'number' },
                        data: { type: 'array', items: { type: 'object', properties: { paperId: { type: 'string' }, title: { type: 'string' }, year: { type: 'number' }, citationCount: { type: 'number' } } } }
                    }
                }
            },
        }
    }
}
