export const main = {
    namespace: 'dpla',
    name: 'Digital Public Library of America',
    description: 'Search and retrieve cultural heritage objects from the Digital Public Library of America. Access 15M+ items including books, photographs, maps, audio, and video from libraries, archives, and museums across the United States.',
    version: '4.0.0',
    docs: ['https://pro.dp.la/developers/api-codex', 'https://pro.dp.la/developers/requests'],
    tags: ['library', 'archive', 'culturalheritage', 'metadata', 'opendata', 'cacheTtlDaily'],
    root: 'https://api.dp.la/v2',
    requiredServerParams: ['DPLA_API_KEY'],
    headers: {},
    tools: {
        searchItems: {
            method: 'GET',
            path: '/items',
            description: 'Search across all DPLA items using free text or field-specific queries. Returns metadata records as JSON-LD with pagination support. Supports boolean AND/OR operators and date range filtering. Use searchByTitle for related data. Use searchByCreator for related data.',
            parameters: [
                {
                    position: {
                        key: 'api_key',
                        value: '{{DPLA_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'q',
                        value: '{{USER_PARAM}}',
                        location: 'query'
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
                        key: 'page_size',
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
                        key: 'fields',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'sort_by',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'sort_order',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(asc,desc)',
                        options: ['optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for items about Abraham Lincoln',
                    q: 'Abraham Lincoln',
                    page_size: 5
                },
                {
                    _description: 'Search for photographs of New York',
                    q: 'New York photographs',
                    page_size: 3
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'number',
                            description: 'Number of items in the current response'
                        },
                        start: {
                            type: 'number',
                            description: 'Start numeric value'
                        },
                        limit: {
                            type: 'number',
                            description: 'Maximum number of results per page'
                        },
                        docs: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        description: 'Unique identifier'
                                    },
                                    sourceResource: {
                                        type: 'object',
                                        description: 'SourceResource details'
                                    },
                                    provider: {
                                        type: 'object',
                                        description: 'Provider details'
                                    },
                                    isShownAt: {
                                        type: 'string',
                                        description: 'IsShownAt value'
                                    }
                                },
                                description: 'Individual item in the docs collection'
                            },
                            description: 'Collection of docs items'
                        }
                    }
                }
            }
        },
        searchByTitle: {
            method: 'GET',
            path: '/items',
            description: 'Search DPLA items by title field. Returns items whose title matches the query string. Use searchItems for related data. Use searchByCreator for related data.',
            parameters: [
                {
                    position: {
                        key: 'api_key',
                        value: '{{DPLA_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'sourceResource.title',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'page_size',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)', 'min(1)', 'max(100)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for items with declaration of independence in title',
                    'sourceResource.title': 'declaration of independence',
                    page_size: 5
                },
                {
                    _description: 'Additional test for searchByTitle',
                    api_key: 'test',
                    'sourceResource.title': 'declaration of independence alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'number',
                            description: 'Number of items in the current response'
                        },
                        docs: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        description: 'Unique identifier'
                                    },
                                    sourceResource: {
                                        type: 'object',
                                        description: 'SourceResource details'
                                    }
                                },
                                description: 'Individual item in the docs collection'
                            },
                            description: 'Collection of docs items'
                        }
                    }
                }
            }
        },
        searchByCreator: {
            method: 'GET',
            path: '/items',
            description: 'Search DPLA items by creator/author name. Useful for finding works by a specific person or organization. Use searchItems for related data. Use searchByTitle for related data.',
            parameters: [
                {
                    position: {
                        key: 'api_key',
                        value: '{{DPLA_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'sourceResource.creator',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'page_size',
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
                        key: 'page',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(1)', 'min(1)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for items by Mark Twain',
                    'sourceResource.creator': 'Mark Twain',
                    page_size: 5
                },
                {
                    _description: 'Additional test for searchByCreator',
                    api_key: 'test',
                    'sourceResource.creator': 'Mark Twain alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'number',
                            description: 'Number of items in the current response'
                        },
                        docs: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        description: 'Unique identifier'
                                    },
                                    sourceResource: {
                                        type: 'object',
                                        description: 'SourceResource details'
                                    }
                                },
                                description: 'Individual item in the docs collection'
                            },
                            description: 'Collection of docs items'
                        }
                    }
                }
            }
        },
        getItem: {
            method: 'GET',
            path: '/items/:itemId',
            description: 'Retrieve a single DPLA item by its unique identifier. Returns full metadata including sourceResource, provider, and links to the original object. Use searchItems for related data. Use searchByTitle for related data.',
            parameters: [
                {
                    position: {
                        key: 'itemId',
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
                        key: 'api_key',
                        value: '{{DPLA_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get a specific DPLA item by ID',
                    itemId: 'a4e2356c5de2e34f2f53e75ce25197ce'
                },
                {
                    _description: 'Additional test for getItem',
                    itemId: '2',
                    api_key: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'number',
                            description: 'Number of items in the current response'
                        },
                        docs: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        description: 'Unique identifier'
                                    },
                                    sourceResource: {
                                        type: 'object',
                                        description: 'SourceResource details'
                                    },
                                    provider: {
                                        type: 'object',
                                        description: 'Provider details'
                                    },
                                    dataProvider: {
                                        type: 'object',
                                        description: 'DataProvider details'
                                    },
                                    isShownAt: {
                                        type: 'string',
                                        description: 'IsShownAt value'
                                    },
                                    object: {
                                        type: 'string',
                                        description: 'Object value'
                                    }
                                },
                                description: 'Individual item in the docs collection'
                            },
                            description: 'Collection of docs items'
                        }
                    }
                }
            }
        },
        searchWithFacets: {
            method: 'GET',
            path: '/items',
            description: 'Search DPLA items and retrieve facet counts for aggregated analysis. Useful for understanding the distribution of items across types, providers, dates, or subjects. Use searchItems for related data. Use searchByTitle for related data.',
            parameters: [
                {
                    position: {
                        key: 'api_key',
                        value: '{{DPLA_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'q',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'facets',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'page_size',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(0)', 'min(0)', 'max(100)']
                    }
                },
                {
                    position: {
                        key: 'facet_size',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(50)', 'min(1)', 'max(2000)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get type facets for Civil War items',
                    q: 'civil war',
                    facets: 'sourceResource.type',
                    page_size: 0
                },
                {
                    _description: 'Get provider facets for all items about music',
                    q: 'music',
                    facets: 'provider.name',
                    page_size: 0,
                    facet_size: 10
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'number',
                            description: 'Number of items in the current response'
                        },
                        facets: {
                            type: 'object',
                            description: 'Facets details'
                        },
                        docs: {
                            type: 'array',
                            description: 'Collection of docs items'
                        }
                    }
                }
            }
        },
        searchByDateRange: {
            method: 'GET',
            path: '/items',
            description: 'Search DPLA items within a date range using before and after filters on the sourceResource.date field. Useful for historical research within specific time periods. Use searchItems for related data. Use searchByTitle for related data.',
            parameters: [
                {
                    position: {
                        key: 'api_key',
                        value: '{{DPLA_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'sourceResource.date.after',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'sourceResource.date.before',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'q',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'page_size',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)', 'min(1)', 'max(100)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for items from the 1860s about the Civil War',
                    'sourceResource.date.after': '1860-01-01',
                    'sourceResource.date.before': '1870-01-01',
                    q: 'civil war',
                    page_size: 5
                },
                {
                    _description: 'Additional test for searchByDateRange',
                    api_key: 'test',
                    'sourceResource.date.after': '1860-01-01 alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'number',
                            description: 'Number of items in the current response'
                        },
                        docs: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        description: 'Unique identifier'
                                    },
                                    sourceResource: {
                                        type: 'object',
                                        description: 'SourceResource details'
                                    }
                                },
                                description: 'Individual item in the docs collection'
                            },
                            description: 'Collection of docs items'
                        }
                    }
                }
            }
        },
        searchByLocation: {
            method: 'GET',
            path: '/items',
            description: 'Search DPLA items by geographic location using the spatial field. Find items related to a specific city, state, or region. Use searchItems for related data. Use searchByTitle for related data.',
            parameters: [
                {
                    position: {
                        key: 'api_key',
                        value: '{{DPLA_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'sourceResource.spatial',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'page_size',
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
                        key: 'page',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(1)', 'min(1)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for items from Chicago',
                    'sourceResource.spatial': 'Chicago',
                    page_size: 5
                },
                {
                    _description: 'Additional test for searchByLocation',
                    api_key: 'test',
                    'sourceResource.spatial': 'Chicago alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'number',
                            description: 'Number of items in the current response'
                        },
                        docs: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        description: 'Unique identifier'
                                    },
                                    sourceResource: {
                                        type: 'object',
                                        description: 'SourceResource details'
                                    }
                                },
                                description: 'Individual item in the docs collection'
                            },
                            description: 'Collection of docs items'
                        }
                    }
                }
            }
        },
        searchCollections: {
            method: 'GET',
            path: '/collections',
            description: 'Search and browse DPLA collections. Collections are curated groupings of items from contributing institutions. Use searchItems for related data. Use searchByTitle for related data.',
            parameters: [
                {
                    position: {
                        key: 'api_key',
                        value: '{{DPLA_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'q',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
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
                        key: 'page_size',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)', 'min(1)', 'max(100)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for photography collections',
                    q: 'photography',
                    page_size: 5
                },
                {
                    _description: 'Additional test for searchCollections',
                    api_key: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'number',
                            description: 'Number of items in the current response'
                        },
                        start: {
                            type: 'number',
                            description: 'Start numeric value'
                        },
                        limit: {
                            type: 'number',
                            description: 'Maximum number of results per page'
                        },
                        docs: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        description: 'Unique identifier'
                                    },
                                    title: {
                                        type: 'string',
                                        description: 'Title or heading'
                                    },
                                    description: {
                                        type: 'string',
                                        description: 'Descriptive text'
                                    }
                                },
                                description: 'Individual item in the docs collection'
                            },
                            description: 'Collection of docs items'
                        }
                    }
                }
            }
        }
    }
}
