export const main = {
    namespace: 'doaj',
    name: 'DOAJ',
    description: 'Search the Directory of Open Access Journals for open access journals and articles. Covers 20,000+ peer-reviewed journals and 10M+ articles across all disciplines.',
    version: '4.0.0',
    docs: ['https://doaj.org/api/v4/docs', 'https://doaj.org/'],
    tags: ['science', 'journals', 'openaccess', 'articles', 'research', 'cacheTtlDaily'],
    root: 'https://doaj.org/api',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchArticles: {
            method: 'GET',
            path: '/search/articles/:query',
            description: 'Search open access articles by query string. Supports Elasticsearch syntax with field shortcuts: title, doi, issn, publisher, abstract. Max 1000 results per search. Use searchJournals for related data. Use getArticle for related data.',
            parameters: [
                {
                    position: {
                        key: 'query',
                        value: '{{USER_PARAM}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'page',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(1)', 'min(1)']
                    }
                },
                {
                    position: {
                        key: 'pageSize',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)', 'min(1)', 'max(100)']
                    }
                },
                {
                    position: {
                        key: 'sort',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for machine learning articles',
                    query: 'machine learning',
                    pageSize: 5
                },
                {
                    _description: 'Search articles by DOI',
                    query: 'doi:10.3389/fpsyg.2013.00479',
                    pageSize: 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        total: {
                            type: 'number',
                            description: 'Total number of available results'
                        },
                        page: {
                            type: 'number',
                            description: 'Current page number'
                        },
                        pageSize: {
                            type: 'number',
                            description: 'PageSize numeric value'
                        },
                        results: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        description: 'Unique identifier'
                                    },
                                    bibjson: {
                                        type: 'object',
                                        properties: {
                                            title: {
                                                type: 'string',
                                                description: 'Title or heading'
                                            },
                                            author: {
                                                type: 'array',
                                                description: 'Author information'
                                            },
                                            abstract: {
                                                type: 'string',
                                                description: 'Abstract or summary text'
                                            },
                                            journal: {
                                                type: 'object',
                                                description: 'Journal details'
                                            },
                                            identifier: {
                                                type: 'array',
                                                description: 'Collection of identifier items'
                                            }
                                        },
                                        description: 'Bibjson details'
                                    }
                                },
                                description: 'Individual item in the results collection'
                            },
                            description: 'Array of result items'
                        }
                    }
                }
            }
        },
        searchJournals: {
            method: 'GET',
            path: '/search/journals/:query',
            description: 'Search open access journals by query string. Supports field shortcuts: title, issn, publisher, license, username. Max 1000 results per search. Use searchArticles for related data. Use getArticle for related data.',
            parameters: [
                {
                    position: {
                        key: 'query',
                        value: '{{USER_PARAM}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'page',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(1)', 'min(1)']
                    }
                },
                {
                    position: {
                        key: 'pageSize',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)', 'min(1)', 'max(100)']
                    }
                },
                {
                    position: {
                        key: 'sort',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for biology journals',
                    query: 'biology',
                    pageSize: 5
                },
                {
                    _description: 'Search journals by ISSN',
                    query: 'issn:2041-1723',
                    pageSize: 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        total: {
                            type: 'number',
                            description: 'Total number of available results'
                        },
                        page: {
                            type: 'number',
                            description: 'Current page number'
                        },
                        pageSize: {
                            type: 'number',
                            description: 'PageSize numeric value'
                        },
                        results: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        description: 'Unique identifier'
                                    },
                                    bibjson: {
                                        type: 'object',
                                        properties: {
                                            title: {
                                                type: 'string',
                                                description: 'Title or heading'
                                            },
                                            publisher: {
                                                type: 'object',
                                                description: 'Publisher name'
                                            },
                                            subject: {
                                                type: 'array',
                                                description: 'Collection of subject items'
                                            },
                                            license: {
                                                type: 'array',
                                                description: 'License information'
                                            },
                                            identifier: {
                                                type: 'array',
                                                description: 'Collection of identifier items'
                                            }
                                        },
                                        description: 'Bibjson details'
                                    }
                                },
                                description: 'Individual item in the results collection'
                            },
                            description: 'Array of result items'
                        }
                    }
                }
            }
        },
        getArticle: {
            method: 'GET',
            path: '/articles/:articleId',
            description: 'Retrieve a single article record by its DOAJ ID. Returns full bibliographic metadata including title, authors, abstract, journal info, and identifiers. Use searchArticles for related data. Use searchJournals for related data.',
            parameters: [
                {
                    position: {
                        key: 'articleId',
                        value: '{{USER_PARAM}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get article by DOAJ ID',
                    articleId: '8e293ab318724851919f5dc8281388f4'
                },
                {
                    _description: 'Additional test for getArticle',
                    articleId: '2'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier'
                        },
                        bibjson: {
                            type: 'object',
                            properties: {
                                title: {
                                    type: 'string',
                                    description: 'Title or heading'
                                },
                                author: {
                                    type: 'array',
                                    description: 'Author information'
                                },
                                abstract: {
                                    type: 'string',
                                    description: 'Abstract or summary text'
                                },
                                journal: {
                                    type: 'object',
                                    description: 'Journal details'
                                },
                                identifier: {
                                    type: 'array',
                                    description: 'Collection of identifier items'
                                },
                                year: {
                                    type: 'string',
                                    description: 'Year value'
                                },
                                month: {
                                    type: 'string',
                                    description: 'Month value'
                                }
                            },
                            description: 'Bibjson details'
                        }
                    }
                }
            }
        },
        getJournal: {
            method: 'GET',
            path: '/journals/:journalId',
            description: 'Retrieve a single journal record by its DOAJ ID. Returns full journal metadata including title, publisher, subjects, licenses, and ISSN identifiers. Use searchArticles for related data. Use searchJournals for related data.',
            parameters: [
                {
                    position: {
                        key: 'journalId',
                        value: '{{USER_PARAM}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get journal by DOAJ ID',
                    journalId: '9a775e6e55c54e3dbb11a1f892741b6b'
                },
                {
                    _description: 'Additional test for getJournal',
                    journalId: '2'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier'
                        },
                        bibjson: {
                            type: 'object',
                            properties: {
                                title: {
                                    type: 'string',
                                    description: 'Title or heading'
                                },
                                publisher: {
                                    type: 'object',
                                    description: 'Publisher name'
                                },
                                subject: {
                                    type: 'array',
                                    description: 'Collection of subject items'
                                },
                                license: {
                                    type: 'array',
                                    description: 'License information'
                                },
                                identifier: {
                                    type: 'array',
                                    description: 'Collection of identifier items'
                                },
                                apc: {
                                    type: 'object',
                                    description: 'Apc details'
                                }
                            },
                            description: 'Bibjson details'
                        }
                    }
                }
            }
        }
    }
}
