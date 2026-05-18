export const main = {
    namespace: 'crossref',
    name: 'Crossref',
    description: 'Access 150M+ DOI metadata records, citations, funders, journals, and members from the Crossref scholarly registry. Free, no key required. Add mailto for polite pool access.',
    version: '4.0.0',
    docs: [
        'https://www.crossref.org/documentation/retrieve-metadata/rest-api/',
        'https://api.crossref.org/swagger-ui/index.html'
    ],
    tags: ['science', 'research', 'publications', 'citations', 'doi', 'cacheTtlDaily'],
    root: 'https://api.crossref.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchWorks: {
            method: 'GET',
            path: '/works',
            description: 'Search scholarly works across 150M+ DOI records. Filter by date, type, funder, ORCID, license, and more. Supports pagination with rows/offset or cursor. Use getWork for related data. Use searchFunders for related data.',
            parameters: [
                {
                    position: {
                        key: 'query',
                        value: '{{QUERY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'filter',
                        value: '{{FILTER}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'sort',
                        value: '{{SORT}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'order',
                        value: '{{ORDER}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(asc,desc)',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'rows',
                        value: '{{ROWS}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(20)', 'max(1000)']
                    }
                },
                {
                    position: {
                        key: 'offset',
                        value: '{{OFFSET}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'select',
                        value: '{{SELECT}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'mailto',
                        value: '{{MAILTO}}',
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
                    _description: 'Search works about CRISPR',
                    query: 'CRISPR',
                    rows: 3
                },
                {
                    _description: 'Filter works by type journal-article from 2024',
                    filter: 'type:journal-article,from-pub-date:2024-01-01',
                    rows: 3
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            description: 'Response status indicator'
                        },
                        'message-type': {
                            type: 'string',
                            description: 'Type of response message'
                        },
                        message: {
                            type: 'object',
                            properties: {
                                'total-results': {
                                    type: 'number',
                                    description: 'Total number of matching results'
                                },
                                items: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            DOI: {
                                                type: 'string',
                                                description: 'Digital Object Identifier'
                                            },
                                            title: {
                                                type: 'array',
                                                description: 'Title or heading'
                                            },
                                            author: {
                                                type: 'array',
                                                description: 'Author information'
                                            },
                                            type: {
                                                type: 'string',
                                                description: 'Type classification'
                                            },
                                            publisher: {
                                                type: 'string',
                                                description: 'Publisher name'
                                            },
                                            'is-referenced-by-count': {
                                                type: 'number',
                                                description: 'Number of citations received'
                                            },
                                            'published-print': {
                                                type: 'object',
                                                description: 'Print publication date'
                                            },
                                            'published-online': {
                                                type: 'object',
                                                description: 'Online publication date'
                                            }
                                        },
                                        description: 'Individual item in the items collection'
                                    },
                                    description: 'Collection of result items'
                                },
                                'items-per-page': {
                                    type: 'number',
                                    description: 'Number of items returned per page'
                                },
                                query: {
                                    type: 'object',
                                    description: 'Query parameters used'
                                }
                            },
                            description: 'Response message or payload'
                        }
                    }
                }
            }
        },
        getWork: {
            method: 'GET',
            path: '/works/:doi',
            description: 'Get full metadata for a single work by DOI. Returns title, authors, abstract, references, funding info, license, and citation counts. Use searchWorks for related data. Use searchFunders for related data.',
            parameters: [
                {
                    position: {
                        key: 'doi',
                        value: '{{DOI}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'mailto',
                        value: '{{MAILTO}}',
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
                    _description: 'Get metadata for a Nature paper',
                    doi: '10.1038/nature12373'
                },
                {
                    _description: 'Get metadata for a PLOS ONE paper',
                    doi: '10.1371/journal.pone.0000000'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            description: 'Response status indicator'
                        },
                        'message-type': {
                            type: 'string',
                            description: 'Type of response message'
                        },
                        message: {
                            type: 'object',
                            properties: {
                                DOI: {
                                    type: 'string',
                                    description: 'Digital Object Identifier'
                                },
                                title: {
                                    type: 'array',
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
                                type: {
                                    type: 'string',
                                    description: 'Type classification'
                                },
                                publisher: {
                                    type: 'string',
                                    description: 'Publisher name'
                                },
                                'is-referenced-by-count': {
                                    type: 'number',
                                    description: 'Number of citations received'
                                },
                                'references-count': {
                                    type: 'number',
                                    description: 'Number of references cited'
                                },
                                reference: {
                                    type: 'array',
                                    description: 'List of cited references'
                                },
                                funder: {
                                    type: 'array',
                                    description: 'Funding organization information'
                                },
                                license: {
                                    type: 'array',
                                    description: 'License information'
                                }
                            },
                            description: 'Response message or payload'
                        }
                    }
                }
            }
        },
        searchFunders: {
            method: 'GET',
            path: '/funders',
            description: 'Search the Open Funder Registry. Find funding organizations by name with metadata about associated works and DOI counts. Use searchWorks for related data. Use getWork for related data.',
            parameters: [
                {
                    position: {
                        key: 'query',
                        value: '{{QUERY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'rows',
                        value: '{{ROWS}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(20)']
                    }
                },
                {
                    position: {
                        key: 'offset',
                        value: '{{OFFSET}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'mailto',
                        value: '{{MAILTO}}',
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
                    _description: 'Search for NIH funders',
                    query: 'National Institutes of Health',
                    rows: 3
                },
                {
                    _description: 'Additional test for searchFunders',
                    query: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            description: 'Response status indicator'
                        },
                        'message-type': {
                            type: 'string',
                            description: 'Type of response message'
                        },
                        message: {
                            type: 'object',
                            properties: {
                                'total-results': {
                                    type: 'number',
                                    description: 'Total number of matching results'
                                },
                                items: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'string',
                                                description: 'Unique identifier'
                                            },
                                            name: {
                                                type: 'string',
                                                description: 'Display name'
                                            },
                                            location: {
                                                type: 'string',
                                                description: 'Geographic location'
                                            },
                                            'alt-names': {
                                                type: 'array',
                                                description: 'Alternative names'
                                            },
                                            uri: {
                                                type: 'string',
                                                description: 'Resource URI'
                                            }
                                        },
                                        description: 'Individual item in the items collection'
                                    },
                                    description: 'Collection of result items'
                                }
                            },
                            description: 'Response message or payload'
                        }
                    }
                }
            }
        },
        getFunder: {
            method: 'GET',
            path: '/funders/:funderId',
            description: 'Get metadata for a specific funder by Funder Registry ID. Returns name, location, alternate names, and work counts. Use searchWorks for related data. Use getWork for related data.',
            parameters: [
                {
                    position: {
                        key: 'funderId',
                        value: '{{FUNDER_ID}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'mailto',
                        value: '{{MAILTO}}',
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
                    _description: 'Get NIH funder details',
                    funderId: '100000002'
                },
                {
                    _description: 'Additional test for getFunder',
                    funderId: '100000003'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            description: 'Response status indicator'
                        },
                        'message-type': {
                            type: 'string',
                            description: 'Type of response message'
                        },
                        message: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Unique identifier'
                                },
                                name: {
                                    type: 'string',
                                    description: 'Display name'
                                },
                                location: {
                                    type: 'string',
                                    description: 'Geographic location'
                                },
                                'alt-names': {
                                    type: 'array',
                                    description: 'Alternative names'
                                },
                                uri: {
                                    type: 'string',
                                    description: 'Resource URI'
                                },
                                tokens: {
                                    type: 'array',
                                    description: 'Associated tokens or identifiers'
                                }
                            },
                            description: 'Response message or payload'
                        }
                    }
                }
            }
        },
        searchMembers: {
            method: 'GET',
            path: '/members',
            description: 'List Crossref member organizations (publishers). Filter by name, location, or prefix. Returns publisher metadata with DOI counts and coverage info. Use searchWorks for related data. Use getWork for related data.',
            parameters: [
                {
                    position: {
                        key: 'query',
                        value: '{{QUERY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'rows',
                        value: '{{ROWS}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(20)']
                    }
                },
                {
                    position: {
                        key: 'offset',
                        value: '{{OFFSET}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'mailto',
                        value: '{{MAILTO}}',
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
                    _description: 'Search for Elsevier member',
                    query: 'Elsevier',
                    rows: 3
                },
                {
                    _description: 'Additional test for searchMembers',
                    query: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            description: 'Response status indicator'
                        },
                        'message-type': {
                            type: 'string',
                            description: 'Type of response message'
                        },
                        message: {
                            type: 'object',
                            properties: {
                                'total-results': {
                                    type: 'number',
                                    description: 'Total number of matching results'
                                },
                                items: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'number',
                                                description: 'Unique identifier'
                                            },
                                            'primary-name': {
                                                type: 'string',
                                                description: 'Primary-name value'
                                            },
                                            location: {
                                                type: 'string',
                                                description: 'Geographic location'
                                            },
                                            prefixes: {
                                                type: 'array',
                                                description: 'Associated prefixes'
                                            },
                                            counts: {
                                                type: 'object',
                                                description: 'Aggregate count statistics'
                                            }
                                        },
                                        description: 'Individual item in the items collection'
                                    },
                                    description: 'Collection of result items'
                                }
                            },
                            description: 'Response message or payload'
                        }
                    }
                }
            }
        },
        searchJournals: {
            method: 'GET',
            path: '/journals',
            description: 'Search journals registered with Crossref. Find by title keyword. Returns journal metadata with ISSN, publisher, subject, and DOI coverage statistics. Use searchWorks for related data. Use getWork for related data.',
            parameters: [
                {
                    position: {
                        key: 'query',
                        value: '{{QUERY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'rows',
                        value: '{{ROWS}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(20)']
                    }
                },
                {
                    position: {
                        key: 'offset',
                        value: '{{OFFSET}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'mailto',
                        value: '{{MAILTO}}',
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
                    _description: 'Search for journals about physics',
                    query: 'physics',
                    rows: 3
                },
                {
                    _description: 'Additional test for searchJournals',
                    query: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            description: 'Response status indicator'
                        },
                        'message-type': {
                            type: 'string',
                            description: 'Type of response message'
                        },
                        message: {
                            type: 'object',
                            properties: {
                                'total-results': {
                                    type: 'number',
                                    description: 'Total number of matching results'
                                },
                                items: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            ISSN: {
                                                type: 'array',
                                                description: 'International Standard Serial Number'
                                            },
                                            title: {
                                                type: 'string',
                                                description: 'Title or heading'
                                            },
                                            publisher: {
                                                type: 'string',
                                                description: 'Publisher name'
                                            },
                                            subjects: {
                                                type: 'array',
                                                description: 'Subject classifications'
                                            },
                                            counts: {
                                                type: 'object',
                                                description: 'Aggregate count statistics'
                                            },
                                            coverage: {
                                                type: 'object',
                                                description: 'Coverage statistics'
                                            }
                                        },
                                        description: 'Individual item in the items collection'
                                    },
                                    description: 'Collection of result items'
                                }
                            },
                            description: 'Response message or payload'
                        }
                    }
                }
            }
        },
        getJournal: {
            method: 'GET',
            path: '/journals/:issn',
            description: 'Get metadata for a specific journal by ISSN. Returns full journal info including publisher, subjects, DOI coverage, and breakdowns by type and year. Use searchWorks for related data. Use getWork for related data.',
            parameters: [
                {
                    position: {
                        key: 'issn',
                        value: '{{ISSN}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'mailto',
                        value: '{{MAILTO}}',
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
                    _description: 'Get Nature journal metadata',
                    issn: '0028-0836'
                },
                {
                    _description: 'Get Science journal metadata',
                    issn: '0036-8075'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            description: 'Response status indicator'
                        },
                        'message-type': {
                            type: 'string',
                            description: 'Type of response message'
                        },
                        message: {
                            type: 'object',
                            properties: {
                                ISSN: {
                                    type: 'array',
                                    description: 'International Standard Serial Number'
                                },
                                title: {
                                    type: 'string',
                                    description: 'Title or heading'
                                },
                                publisher: {
                                    type: 'string',
                                    description: 'Publisher name'
                                },
                                subjects: {
                                    type: 'array',
                                    description: 'Subject classifications'
                                },
                                counts: {
                                    type: 'object',
                                    description: 'Aggregate count statistics'
                                },
                                coverage: {
                                    type: 'object',
                                    description: 'Coverage statistics'
                                },
                                breakdowns: {
                                    type: 'object',
                                    description: 'Breakdown statistics by category'
                                }
                            },
                            description: 'Response message or payload'
                        }
                    }
                }
            }
        },
        listTypes: {
            method: 'GET',
            path: '/types',
            description: 'List all work types used in Crossref metadata (journal-article, book-chapter, dataset, etc.). Returns type identifiers and labels. Use searchWorks for related data. Use getWork for related data.',
            parameters: [
                {
                    position: {
                        key: 'mailto',
                        value: '{{MAILTO}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                }
            ],
            tests: [
                { _description: 'List all Crossref work types', mailto: 'test' },
                {
                    _description: 'Additional test for listTypes',
                    mailto: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            description: 'Response status indicator'
                        },
                        'message-type': {
                            type: 'string',
                            description: 'Type of response message'
                        },
                        message: {
                            type: 'object',
                            properties: {
                                'total-results': {
                                    type: 'number',
                                    description: 'Total number of matching results'
                                },
                                items: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'string',
                                                description: 'Unique identifier'
                                            },
                                            label: {
                                                type: 'string',
                                                description: 'Human-readable label'
                                            }
                                        },
                                        description: 'Individual item in the items collection'
                                    },
                                    description: 'Collection of result items'
                                }
                            },
                            description: 'Response message or payload'
                        }
                    }
                }
            }
        }
    }
}
