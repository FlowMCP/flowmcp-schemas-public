export const main = {
    namespace: 'datacite',
    name: 'DataCite',
    description: 'Search and retrieve DOI metadata for research data, software, and scholarly outputs from DataCite — 60M+ DOIs across 3000+ repositories.',
    version: '4.0.0',
    docs: ['https://support.datacite.org/docs/api'],
    tags: ['doi', 'research', 'metadata', 'science', 'opendata', 'cacheTtlDaily'],
    root: 'https://api.datacite.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchDois: {
            method: 'GET',
            path: '/dois',
            description: 'Search for DOIs across all DataCite repositories. Supports full-text query, resource type filtering, and pagination. Use getDoiById for related data. Use listClients for related data.',
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
                        key: 'resource-type-id',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(dataset,software,text,collection,image,audiovisual,workflow,other)',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'registered',
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
                        key: 'page[size]',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(25)', 'min(1)', 'max(1000)']
                    }
                },
                {
                    position: {
                        key: 'page[number]',
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
                        key: 'sort',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(relevance,-created,created,-published,published)',
                        options: ['optional()', 'default(relevance)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for climate change datasets',
                    query: 'climate change',
                    'resource-type-id': 'dataset',
                    'page[size]': 5
                },
                {
                    _description: 'Search for machine learning software',
                    query: 'machine learning',
                    'resource-type-id': 'software',
                    'page[size]': 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            description: 'Array of DOI records',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        description: 'DOI identifier'
                                    },
                                    type: {
                                        type: 'string',
                                        description: 'Type classification'
                                    },
                                    attributes: {
                                        type: 'object',
                                        properties: {
                                            doi: {
                                                type: 'string',
                                                description: 'Digital Object Identifier'
                                            },
                                            titles: {
                                                type: 'array',
                                                description: 'Collection of titles items'
                                            },
                                            creators: {
                                                type: 'array',
                                                description: 'Collection of creators items'
                                            },
                                            publisher: {
                                                type: 'string',
                                                description: 'Publisher name'
                                            },
                                            publicationYear: {
                                                type: 'number',
                                                description: 'PublicationYear numeric value'
                                            },
                                            descriptions: {
                                                type: 'array',
                                                description: 'Collection of descriptions items'
                                            },
                                            subjects: {
                                                type: 'array',
                                                description: 'Subject classifications'
                                            },
                                            types: {
                                                type: 'object',
                                                description: 'Types details'
                                            },
                                            dates: {
                                                type: 'array',
                                                description: 'Collection of dates items'
                                            },
                                            rightsList: {
                                                type: 'array',
                                                description: 'Collection of rightsList items'
                                            },
                                            citationCount: {
                                                type: 'number',
                                                description: 'Number of citations'
                                            },
                                            viewCount: {
                                                type: 'number',
                                                description: 'ViewCount numeric value'
                                            },
                                            downloadCount: {
                                                type: 'number',
                                                description: 'DownloadCount numeric value'
                                            }
                                        },
                                        description: 'Attribute collection'
                                    }
                                },
                                description: 'Individual item in the data collection'
                            }
                        },
                        meta: {
                            type: 'object',
                            properties: {
                                total: {
                                    type: 'number',
                                    description: 'Total matching records'
                                },
                                totalPages: {
                                    type: 'number',
                                    description: 'TotalPages numeric value'
                                },
                                page: {
                                    type: 'number',
                                    description: 'Current page number'
                                }
                            },
                            description: 'Metadata information'
                        }
                    }
                }
            }
        },
        getDoiById: {
            method: 'GET',
            path: '/dois/:doiPrefix/:doiSuffix',
            description: 'Retrieve full metadata for a specific DOI. Returns creators, titles, descriptions, rights, citations, and usage statistics. Use searchDois for related data. Use listClients for related data.',
            parameters: [
                {
                    position: {
                        key: 'doiPrefix',
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
                        key: 'doiSuffix',
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
                    _description: 'Get metadata for a Zenodo DOI',
                    doiPrefix: '10.5281',
                    doiSuffix: 'zenodo.3357455'
                },
                {
                    _description: 'Get metadata for a Dryad dataset DOI',
                    doiPrefix: '10.5061',
                    doiSuffix: 'dryad.234'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Unique identifier'
                                },
                                type: {
                                    type: 'string',
                                    description: 'Type classification'
                                },
                                attributes: {
                                    type: 'object',
                                    properties: {
                                        doi: {
                                            type: 'string',
                                            description: 'Digital Object Identifier'
                                        },
                                        titles: {
                                            type: 'array',
                                            description: 'Collection of titles items'
                                        },
                                        creators: {
                                            type: 'array',
                                            description: 'Collection of creators items'
                                        },
                                        publisher: {
                                            type: 'string',
                                            description: 'Publisher name'
                                        },
                                        publicationYear: {
                                            type: 'number',
                                            description: 'PublicationYear numeric value'
                                        },
                                        descriptions: {
                                            type: 'array',
                                            description: 'Collection of descriptions items'
                                        },
                                        subjects: {
                                            type: 'array',
                                            description: 'Subject classifications'
                                        },
                                        types: {
                                            type: 'object',
                                            description: 'Types details'
                                        },
                                        dates: {
                                            type: 'array',
                                            description: 'Collection of dates items'
                                        },
                                        rightsList: {
                                            type: 'array',
                                            description: 'Collection of rightsList items'
                                        },
                                        relatedIdentifiers: {
                                            type: 'array',
                                            description: 'Collection of relatedIdentifiers items'
                                        },
                                        fundingReferences: {
                                            type: 'array',
                                            description: 'Collection of fundingReferences items'
                                        },
                                        geoLocations: {
                                            type: 'array',
                                            description: 'Collection of geoLocations items'
                                        },
                                        version: {
                                            type: 'string',
                                            description: 'Version number'
                                        },
                                        citationCount: {
                                            type: 'number',
                                            description: 'Number of citations'
                                        },
                                        viewCount: {
                                            type: 'number',
                                            description: 'ViewCount numeric value'
                                        },
                                        downloadCount: {
                                            type: 'number',
                                            description: 'DownloadCount numeric value'
                                        },
                                        state: {
                                            type: 'string',
                                            description: 'State or province'
                                        },
                                        created: {
                                            type: 'string',
                                            description: 'Creation timestamp'
                                        },
                                        registered: {
                                            type: 'string',
                                            description: 'Registered value'
                                        },
                                        updated: {
                                            type: 'string',
                                            description: 'Last update timestamp'
                                        }
                                    },
                                    description: 'Attribute collection'
                                }
                            },
                            description: 'Response data payload'
                        }
                    }
                }
            }
        },
        listClients: {
            method: 'GET',
            path: '/clients',
            description: 'List DataCite repository clients (data centers). Returns client name, type, year of registration, and associated provider. Use searchDois for related data. Use getDoiById for related data.',
            parameters: [
                {
                    position: {
                        key: 'query',
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
                        key: 'provider-id',
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
                        key: 'client-type',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(repository,periodical)',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'page[size]',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(25)', 'min(1)', 'max(1000)']
                    }
                },
                {
                    position: {
                        key: 'page[number]',
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
                    _description: 'Search for Zenodo client',
                    query: 'zenodo',
                    'page[size]': 5
                },
                {
                    _description: 'List repository clients',
                    'client-type': 'repository',
                    'page[size]': 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        description: 'Unique identifier'
                                    },
                                    type: {
                                        type: 'string',
                                        description: 'Type classification'
                                    },
                                    attributes: {
                                        type: 'object',
                                        properties: {
                                            name: {
                                                type: 'string',
                                                description: 'Display name'
                                            },
                                            symbol: {
                                                type: 'string',
                                                description: 'Token or asset symbol'
                                            },
                                            year: {
                                                type: 'number',
                                                description: 'Year value'
                                            },
                                            clientType: {
                                                type: 'string',
                                                description: 'ClientType value'
                                            },
                                            url: {
                                                type: 'string',
                                                description: 'URL link'
                                            },
                                            language: {
                                                type: 'array',
                                                description: 'Language code'
                                            },
                                            isActive: {
                                                type: 'boolean',
                                                description: 'Whether isActive is true'
                                            },
                                            created: {
                                                type: 'string',
                                                description: 'Creation timestamp'
                                            },
                                            updated: {
                                                type: 'string',
                                                description: 'Last update timestamp'
                                            }
                                        },
                                        description: 'Attribute collection'
                                    }
                                },
                                description: 'Individual item in the data collection'
                            },
                            description: 'Response data payload'
                        },
                        meta: {
                            type: 'object',
                            properties: {
                                total: {
                                    type: 'number',
                                    description: 'Total number of available results'
                                },
                                totalPages: {
                                    type: 'number',
                                    description: 'TotalPages numeric value'
                                },
                                page: {
                                    type: 'number',
                                    description: 'Current page number'
                                }
                            },
                            description: 'Metadata information'
                        }
                    }
                }
            }
        },
        listProviders: {
            method: 'GET',
            path: '/providers',
            description: 'List DataCite member organizations (DOI registration agencies and allocators). Returns provider name, region, and membership type. Use searchDois for related data. Use getDoiById for related data.',
            parameters: [
                {
                    position: {
                        key: 'query',
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
                        key: 'region',
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
                        key: 'member-type',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(direct_member,consortium,consortium_organization)',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'page[size]',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(25)', 'min(1)', 'max(1000)']
                    }
                },
                {
                    position: {
                        key: 'page[number]',
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
                    _description: 'Search for CERN as a provider',
                    query: 'CERN',
                    'page[size]': 5
                },
                {
                    _description: 'List consortium providers in Europe',
                    'member-type': 'consortium',
                    'page[size]': 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        description: 'Unique identifier'
                                    },
                                    type: {
                                        type: 'string',
                                        description: 'Type classification'
                                    },
                                    attributes: {
                                        type: 'object',
                                        properties: {
                                            name: {
                                                type: 'string',
                                                description: 'Display name'
                                            },
                                            symbol: {
                                                type: 'string',
                                                description: 'Token or asset symbol'
                                            },
                                            region: {
                                                type: 'string',
                                                description: 'Region name'
                                            },
                                            memberType: {
                                                type: 'string',
                                                description: 'MemberType value'
                                            },
                                            website: {
                                                type: 'string',
                                                description: 'Website value'
                                            },
                                            isActive: {
                                                type: 'boolean',
                                                description: 'Whether isActive is true'
                                            },
                                            joined: {
                                                type: 'string',
                                                description: 'Joined value'
                                            },
                                            created: {
                                                type: 'string',
                                                description: 'Creation timestamp'
                                            },
                                            updated: {
                                                type: 'string',
                                                description: 'Last update timestamp'
                                            }
                                        },
                                        description: 'Attribute collection'
                                    }
                                },
                                description: 'Individual item in the data collection'
                            },
                            description: 'Response data payload'
                        },
                        meta: {
                            type: 'object',
                            properties: {
                                total: {
                                    type: 'number',
                                    description: 'Total number of available results'
                                },
                                totalPages: {
                                    type: 'number',
                                    description: 'TotalPages numeric value'
                                },
                                page: {
                                    type: 'number',
                                    description: 'Current page number'
                                }
                            },
                            description: 'Metadata information'
                        }
                    }
                }
            }
        },
        getProviderById: {
            method: 'GET',
            path: '/providers/:providerId',
            description: 'Retrieve details for a specific DataCite provider by its symbol. Returns name, region, DOI count, and membership information. Use searchDois for related data. Use getDoiById for related data.',
            parameters: [
                {
                    position: {
                        key: 'providerId',
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
                    _description: 'Get CERN provider details',
                    providerId: 'cern'
                },
                {
                    _description: 'Get TIB Hannover provider details',
                    providerId: 'tib'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Unique identifier'
                                },
                                type: {
                                    type: 'string',
                                    description: 'Type classification'
                                },
                                attributes: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            type: 'string',
                                            description: 'Display name'
                                        },
                                        symbol: {
                                            type: 'string',
                                            description: 'Token or asset symbol'
                                        },
                                        region: {
                                            type: 'string',
                                            description: 'Region name'
                                        },
                                        memberType: {
                                            type: 'string',
                                            description: 'MemberType value'
                                        },
                                        website: {
                                            type: 'string',
                                            description: 'Website value'
                                        },
                                        isActive: {
                                            type: 'boolean',
                                            description: 'Whether isActive is true'
                                        },
                                        joined: {
                                            type: 'string',
                                            description: 'Joined value'
                                        },
                                        created: {
                                            type: 'string',
                                            description: 'Creation timestamp'
                                        },
                                        updated: {
                                            type: 'string',
                                            description: 'Last update timestamp'
                                        }
                                    },
                                    description: 'Attribute collection'
                                }
                            },
                            description: 'Response data payload'
                        }
                    }
                }
            }
        },
        getDoiActivities: {
            method: 'GET',
            path: '/dois/:doiPrefix/:doiSuffix/activities',
            description: 'Retrieve the activity log for a specific DOI. Shows registration, metadata updates, and state changes over time. Use searchDois for related data. Use getDoiById for related data.',
            parameters: [
                {
                    position: {
                        key: 'doiPrefix',
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
                        key: 'doiSuffix',
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
                        key: 'page[size]',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(25)', 'min(1)', 'max(100)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get activity log for a Zenodo DOI',
                    doiPrefix: '10.5281',
                    doiSuffix: 'zenodo.3357455',
                    'page[size]': 5
                },
                {
                    _description: 'Additional test for getDoiActivities',
                    doiPrefix: '10.1126/science.1157996',
                    doiSuffix: '10.1126/science.1157996'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        description: 'Unique identifier'
                                    },
                                    type: {
                                        type: 'string',
                                        description: 'Type classification'
                                    },
                                    attributes: {
                                        type: 'object',
                                        properties: {
                                            action: {
                                                type: 'string',
                                                description: 'Action value'
                                            },
                                            wasGeneratedBy: {
                                                type: 'string',
                                                description: 'WasGeneratedBy value'
                                            },
                                            created: {
                                                type: 'string',
                                                description: 'Creation timestamp'
                                            }
                                        },
                                        description: 'Attribute collection'
                                    }
                                },
                                description: 'Individual item in the data collection'
                            },
                            description: 'Response data payload'
                        },
                        meta: {
                            type: 'object',
                            properties: {
                                total: {
                                    type: 'number',
                                    description: 'Total number of available results'
                                }
                            },
                            description: 'Metadata information'
                        }
                    }
                }
            }
        },
        heartbeat: {
            method: 'GET',
            path: '/heartbeat',
            description: 'Check DataCite API health status. Returns a simple status indicator for monitoring and connectivity verification. Use searchDois for related data. Use getDoiById for related data.',
            parameters: [],
            tests: [
                {
                    _description: 'Check DataCite API health'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            description: 'API health status'
                        }
                    }
                }
            }
        }
    }
}
