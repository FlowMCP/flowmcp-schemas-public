export const main = {
    namespace: 'dblp',
    name: 'DBLP',
    description: 'Search the DBLP computer science bibliography with 6+ million publications. Find research papers by title, search authors by name, and find publication venues (conferences and journals) in computer science.',
    docs: ['https://dblp.org/faq/How+to+use+the+dblp+search+API.html'],
    tags: ['bibliography', 'research', 'papers', 'academic', 'computerscience', 'opendata', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://dblp.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchPublications: {
            method: 'GET',
            path: '/search/publ/api',
            description: 'Search for computer science publications in DBLP by title, author, or keyword. Returns matching papers with title, authors, venue, year, and DOI.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Search query string for publications — title keywords, author names, or topic terms' },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(json)'] }, description: 'Response format — use json for structured output' },
                { position: { key: 'h', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(1000)'] }, description: 'Maximum number of results to return (1-1000, default 20)' },
                { position: { key: 'f', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] }, description: 'First result offset for pagination (0-based index)' },
                { position: { key: 'c', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] }, description: 'Maximum number of completion results (0 to disable completions)' }
            ],
            tests: [
                { _description: 'Search for papers about transformer neural networks', q: 'transformer neural network', h: 10 },
                { _description: 'Search for blockchain consensus papers', q: 'blockchain consensus protocol', h: 10 },
                { _description: 'Search for large language model papers', q: 'large language model', h: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        result: {
                            type: 'object',
                            properties: {
                                query: { type: 'string' },
                                status: { type: 'object' },
                                hits: {
                                    type: 'object',
                                    properties: {
                                        '@total': { type: 'string' },
                                        '@computed': { type: 'string' },
                                        '@sent': { type: 'string' },
                                        hit: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    '@score': { type: 'string' },
                                                    '@id': { type: 'string' },
                                                    info: {
                                                        type: 'object',
                                                        properties: {
                                                            authors: { type: 'object' },
                                                            title: { type: 'string' },
                                                            venue: { type: 'string' },
                                                            year: { type: 'string' },
                                                            type: { type: 'string' },
                                                            doi: { type: 'string' },
                                                            url: { type: 'string' }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        searchAuthors: {
            method: 'GET',
            path: '/search/author/api',
            description: 'Search for computer science researchers and authors in DBLP by name. Returns matching authors with their DBLP profile URLs and publication counts.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Author name search query, e.g. Yann LeCun, Geoffrey Hinton' },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(json)'] }, description: 'Response format — use json for structured output' },
                { position: { key: 'h', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] }, description: 'Maximum number of results to return (1-1000, default 10)' },
                { position: { key: 'f', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] }, description: 'First result offset for pagination (0-based index)' },
                { position: { key: 'c', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] }, description: 'Maximum number of completion results (0 to disable completions)' }
            ],
            tests: [
                { _description: 'Search for researcher Yann LeCun', q: 'Yann LeCun', h: 5 },
                { _description: 'Search for author Geoffrey Hinton', q: 'Geoffrey Hinton', h: 5 },
                { _description: 'Search for Yoshua Bengio', q: 'Yoshua Bengio', h: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        result: {
                            type: 'object',
                            properties: {
                                query: { type: 'string' },
                                status: { type: 'object' },
                                hits: {
                                    type: 'object',
                                    properties: {
                                        '@total': { type: 'string' },
                                        '@computed': { type: 'string' },
                                        '@sent': { type: 'string' },
                                        hit: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    '@score': { type: 'string' },
                                                    '@id': { type: 'string' },
                                                    info: {
                                                        type: 'object',
                                                        properties: {
                                                            author: { type: 'string' },
                                                            url: { type: 'string' }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        searchVenues: {
            method: 'GET',
            path: '/search/venue/api',
            description: 'Search for computer science publication venues (conferences and journals) in DBLP by name or acronym. Returns matching venues with their type, acronym, and DBLP URL.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Venue search query — conference or journal name/acronym, e.g. NeurIPS, ICML' },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(json)'] }, description: 'Response format — use json for structured output' },
                { position: { key: 'h', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] }, description: 'Maximum number of results to return (1-1000, default 10)' },
                { position: { key: 'f', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] }, description: 'First result offset for pagination (0-based index)' },
                { position: { key: 'c', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] }, description: 'Maximum number of completion results (0 to disable completions)' }
            ],
            tests: [
                { _description: 'Search for NeurIPS conference', q: 'NeurIPS', h: 5 },
                { _description: 'Search for ICML conference', q: 'ICML machine learning', h: 5 },
                { _description: 'Search for ACM computing journals', q: 'ACM Transactions', h: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        result: {
                            type: 'object',
                            properties: {
                                query: { type: 'string' },
                                status: { type: 'object' },
                                hits: {
                                    type: 'object',
                                    properties: {
                                        '@total': { type: 'string' },
                                        '@computed': { type: 'string' },
                                        '@sent': { type: 'string' },
                                        hit: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    '@score': { type: 'string' },
                                                    '@id': { type: 'string' },
                                                    info: {
                                                        type: 'object',
                                                        properties: {
                                                            venue: { type: 'string' },
                                                            acronym: { type: 'string' },
                                                            type: { type: 'string' },
                                                            url: { type: 'string' }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
