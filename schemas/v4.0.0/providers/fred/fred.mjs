export const main = {
    namespace: 'fred',
    name: 'FRED',
    description: 'Access Federal Reserve Economic Data (FRED) from the St. Louis Fed. Search and retrieve economic time series, categories, and releases covering GDP, employment, inflation, and more.',
    version: '4.0.0',
    docs: ['https://fred.stlouisfed.org/docs/api/fred/'],
    tags: ['economics', 'finance', 'statistics', 'government', 'cacheTtlDaily'],
    root: 'https://api.stlouisfed.org',
    requiredServerParams: ['FRED_API_KEY'],
    headers: {},
    tools: {
        searchSeries: {
            method: 'GET',
            path: '/fred/series/search',
            description: 'Search for economic data series by keywords. Returns matching series with metadata including title, frequency, units, and seasonal adjustment. Use getSeriesObservations for related data. Use getSeriesInfo for related data.',
            parameters: [
                {
                    position: {
                        key: 'api_key',
                        value: '{{FRED_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'file_type',
                        value: 'json',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'search_text',
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
                        key: 'limit',
                        value: '{{USER_PARAM}}',
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
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(0)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for GDP series',
                    search_text: 'GDP'
                },
                {
                    _description: 'Search for unemployment data',
                    search_text: 'unemployment rate',
                    limit: 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        seriess: {
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
                                    frequency: {
                                        type: 'string',
                                        description: 'Frequency value'
                                    },
                                    units: {
                                        type: 'string',
                                        description: 'Units value'
                                    }
                                },
                                description: 'Individual item in the seriess collection'
                            },
                            description: 'Collection of seriess items'
                        }
                    }
                }
            }
        },
        getSeriesObservations: {
            method: 'GET',
            path: '/fred/series/observations',
            description: 'Get data values for an economic data series. Returns time series observations with date and value pairs. Use searchSeries for related data. Use getSeriesInfo for related data.',
            parameters: [
                {
                    position: {
                        key: 'api_key',
                        value: '{{FRED_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'file_type',
                        value: 'json',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'series_id',
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
                        key: 'observation_start',
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
                        key: 'observation_end',
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
                        key: 'limit',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(100000)', 'max(100000)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get US GDP observations',
                    series_id: 'GDP',
                    observation_start: '2020-01-01',
                    observation_end: '2024-12-31'
                },
                {
                    _description: 'Get unemployment rate data',
                    series_id: 'UNRATE',
                    observation_start: '2023-01-01'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        observations: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    date: {
                                        type: 'string',
                                        description: 'Date value'
                                    },
                                    value: {
                                        type: 'string',
                                        description: 'Value or amount'
                                    }
                                },
                                description: 'Individual item in the observations collection'
                            },
                            description: 'Collection of observations items'
                        }
                    }
                }
            }
        },
        getSeriesInfo: {
            method: 'GET',
            path: '/fred/series',
            description: 'Get metadata for an economic data series including title, frequency, units, seasonal adjustment, and date range. Use searchSeries for related data. Use getSeriesObservations for related data.',
            parameters: [
                {
                    position: {
                        key: 'api_key',
                        value: '{{FRED_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'file_type',
                        value: 'json',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'series_id',
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
                    _description: 'Get GDP series info',
                    series_id: 'GDP'
                },
                {
                    _description: 'Additional test for getSeriesInfo',
                    api_key: 'test',
                    file_type: 'test',
                    series_id: '2'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        seriess: {
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
                                    frequency_short: {
                                        type: 'string',
                                        description: 'Frequency_short value'
                                    },
                                    units_short: {
                                        type: 'string',
                                        description: 'Units_short value'
                                    }
                                },
                                description: 'Individual item in the seriess collection'
                            },
                            description: 'Collection of seriess items'
                        }
                    }
                }
            }
        },
        getReleases: {
            method: 'GET',
            path: '/fred/releases',
            description: 'List all releases of economic data. A release groups related data series (e.g., Employment Situation, Consumer Price Index). Use searchSeries for related data. Use getSeriesObservations for related data.',
            parameters: [
                {
                    position: {
                        key: 'api_key',
                        value: '{{FRED_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'file_type',
                        value: 'json',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'limit',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(100)', 'max(1000)']
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
                }
            ],
            tests: [
                {
                    _description: 'List all FRED releases',
                    limit: 20
                },
                {
                    _description: 'Additional test for getReleases',
                    api_key: 'test',
                    file_type: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        releases: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'number',
                                        description: 'Unique identifier'
                                    },
                                    name: {
                                        type: 'string',
                                        description: 'Display name'
                                    },
                                    link: {
                                        type: 'string',
                                        description: 'Link to related resource'
                                    }
                                },
                                description: 'Individual item in the releases collection'
                            },
                            description: 'Collection of releases items'
                        }
                    }
                }
            }
        },
        getCategory: {
            method: 'GET',
            path: '/fred/category/children',
            description: 'Get child categories for a parent category. Use category_id 0 for the root. Categories organize series into a hierarchy (e.g., Money Banking & Finance > Interest Rates). Use searchSeries for related data. Use getSeriesObservations for related data.',
            parameters: [
                {
                    position: {
                        key: 'api_key',
                        value: '{{FRED_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'file_type',
                        value: 'json',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'category_id',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(0)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get root categories',
                    category_id: 0
                },
                {
                    _description: 'Additional test for getCategory',
                    api_key: 'test',
                    file_type: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        categories: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'number',
                                        description: 'Unique identifier'
                                    },
                                    name: {
                                        type: 'string',
                                        description: 'Display name'
                                    },
                                    parent_id: {
                                        type: 'number',
                                        description: 'Parent_id numeric value'
                                    }
                                },
                                description: 'Individual item in the categories collection'
                            },
                            description: 'Category classifications'
                        }
                    }
                }
            }
        }
    }
}
