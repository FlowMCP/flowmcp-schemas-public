export const main = {
    namespace: 'deutschedigitalebibliothek',
    name: 'Deutsche Digitale Bibliothek',
    description: 'Access German cultural heritage data from the Deutsche Digitale Bibliothek (DDB) with 40M+ digitized objects from museums, archives, libraries, and monuments across Germany.',
    version: '4.0.0',
    docs: ['https://labs.deutsche-digitale-bibliothek.de/app/ddbapi/'],
    tags: ['culture', 'heritage', 'library', 'museum', 'archive', 'germany', 'cacheTtlDaily'],
    root: 'https://api.deutsche-digitale-bibliothek.de',
    requiredServerParams: ['DDB_API_KEY'],
    headers: {
        Authorization: 'OAuth oauth_consumer_key="{{DDB_API_KEY}}"',
        Accept: 'application/json'
    },
    tools: {
        searchItems: {
            method: 'GET',
            path: '/search',
            description: 'Search the DDB catalog for cultural heritage objects. Supports full-text queries with pagination and sorting. Returns matching items with metadata summaries. Use getItem for related data. Use getItemBinaries for related data.',
            parameters: [
                {
                    position: {
                        key: 'query',
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
                        key: 'offset',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(0)']
                    }
                },
                {
                    position: {
                        key: 'rows',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(20)', 'max(100)']
                    }
                },
                {
                    position: {
                        key: 'sort',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(RELEVANCE,ALPHA_ASC,ALPHA_DESC,TIME_ASC,TIME_DESC)',
                        options: ['optional()', 'default(RELEVANCE)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for items about Berlin',
                    query: 'Berlin',
                    rows: 5,
                    offset: 0
                },
                {
                    _description: 'Additional test for searchItems',
                    query: 'climate change'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        numberOfResults: {
                            type: 'number',
                            description: 'NumberOfResults numeric value'
                        },
                        results: {
                            type: 'array',
                            description: 'Array of result items'
                        }
                    }
                }
            }
        },
        getItem: {
            method: 'GET',
            path: '/items/:id',
            description: 'Get detailed metadata for a specific cultural heritage item by its DDB item ID (32-character BASE32 identifier). Use searchItems for related data. Use getItemBinaries for related data.',
            parameters: [
                {
                    position: {
                        key: 'id',
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
                    _description: 'Get item details by ID',
                    id: 'ZZPBZTREU77H2TBNLGBM3LBCCFSN4XGH'
                },
                {
                    _description: 'Additional test for getItem',
                    id: '2'
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
                        label: {
                            type: 'string',
                            description: 'Human-readable label'
                        },
                        fields: {
                            type: 'object',
                            description: 'Fields details'
                        }
                    }
                }
            }
        },
        getItemBinaries: {
            method: 'GET',
            path: '/items/:id/binaries',
            description: 'Get a list of available binary files (images, documents, media) for a specific DDB item. Use searchItems for related data. Use getItem for related data.',
            parameters: [
                {
                    position: {
                        key: 'id',
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
                    _description: 'Get binaries for an item',
                    id: 'ZZPBZTREU77H2TBNLGBM3LBCCFSN4XGH'
                },
                {
                    _description: 'Additional test for getItemBinaries',
                    id: '2'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        binaries: {
                            type: 'array',
                            description: 'Collection of binaries items'
                        }
                    }
                }
            }
        },
        getItemChildren: {
            method: 'GET',
            path: '/items/:id/children',
            description: 'Get child items of a hierarchical DDB item (e.g., pages of a book, parts of a collection). Use searchItems for related data. Use getItem for related data.',
            parameters: [
                {
                    position: {
                        key: 'id',
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
                    _description: 'Get child items',
                    id: 'ZZPBZTREU77H2TBNLGBM3LBCCFSN4XGH'
                },
                {
                    _description: 'Additional test for getItemChildren',
                    id: '2'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        children: {
                            type: 'array',
                            description: 'Collection of children items'
                        }
                    }
                }
            }
        },
        getItemView: {
            method: 'GET',
            path: '/items/:id/view',
            description: 'Get the display view data for a DDB item including rendered metadata fields and preview information. Use searchItems for related data. Use getItem for related data.',
            parameters: [
                {
                    position: {
                        key: 'id',
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
                    _description: 'Get item view data',
                    id: 'ZZPBZTREU77H2TBNLGBM3LBCCFSN4XGH'
                },
                {
                    _description: 'Additional test for getItemView',
                    id: '2'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        item: {
                            type: 'object',
                            description: 'Item details'
                        }
                    }
                }
            }
        },
        listInstitutions: {
            method: 'GET',
            path: '/institutions',
            description: 'List contributing institutions (museums, libraries, archives) in the Deutsche Digitale Bibliothek. Filterable by sector. Use searchItems for related data. Use getItem for related data.',
            parameters: [
                {
                    position: {
                        key: 'sector',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(sec_01,sec_02,sec_03,sec_04,sec_05,sec_06,sec_07)',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'hasItems',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'boolean()',
                        options: ['optional()', 'default(true)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'List institutions with items',
                    hasItems: true
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        institutions: {
                            type: 'array',
                            description: 'Collection of institutions items'
                        }
                    }
                }
            }
        },
        searchSuggest: {
            method: 'GET',
            path: '/search/suggest',
            description: 'Get autocomplete suggestions for a search query in the DDB catalog. Use searchItems for related data. Use getItem for related data.',
            parameters: [
                {
                    position: {
                        key: 'query',
                        value: '{{USER_PARAM}}',
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
                    _description: 'Get search suggestions for Goethe',
                    query: 'Goethe'
                },
                {
                    _description: 'Additional test for searchSuggest',
                    query: 'climate change'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        suggestions: {
                            type: 'array',
                            description: 'Collection of suggestions items'
                        }
                    }
                }
            }
        },
        getVersion: {
            method: 'GET',
            path: '/version',
            description: 'Get the current API version of the Deutsche Digitale Bibliothek. Use searchItems for related data. Use getItem for related data.',
            parameters: [],
            tests: [
                {
                    _description: 'Get API version'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        version: {
                            type: 'string',
                            description: 'Version number'
                        }
                    }
                }
            }
        }
    }
}
