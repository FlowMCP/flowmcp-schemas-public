export const main = {
    namespace: 'ebird',
    name: 'eBird',
    description: 'Access bird observation data from eBird by Cornell Lab of Ornithology. Search recent sightings, notable observations, and birding hotspots worldwide.',
    version: '4.0.0',
    docs: ['https://documenter.getpostman.com/view/664302/S1ENwy59'],
    tags: ['birds', 'nature', 'biodiversity', 'science', 'cacheTtlFrequent'],
    root: 'https://api.ebird.org/v2',
    requiredServerParams: ['EBIRD_API_KEY'],
    headers: {
        'x-ebirdapitoken': '{{EBIRD_API_KEY}}'
    },
    tools: {
        getRecentObservations: {
            method: 'GET',
            path: '/data/obs/:regionCode/recent',
            description: 'Get recent bird observations in a region. Returns sightings from the last 30 days with species, location, and date information. Use getNotableObservations for related data. Use getNearbyObservations for related data.',
            parameters: [
                {
                    position: {
                        key: 'regionCode',
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
                        key: 'back',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(14)', 'max(30)']
                    }
                },
                {
                    position: {
                        key: 'maxResults',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(100)', 'max(10000)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get recent observations in New York state',
                    regionCode: 'US-NY',
                    back: 7,
                    maxResults: 10
                },
                {
                    _description: 'Get recent observations in Germany',
                    regionCode: 'DE',
                    back: 14,
                    maxResults: 20
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            speciesCode: {
                                type: 'string'
                            },
                            comName: {
                                type: 'string'
                            },
                            sciName: {
                                type: 'string'
                            },
                            locName: {
                                type: 'string'
                            },
                            obsDt: {
                                type: 'string'
                            },
                            howMany: {
                                type: 'number'
                            },
                            lat: {
                                type: 'number'
                            },
                            lng: {
                                type: 'number'
                            }
                        }
                    }
                }
            }
        },
        getNotableObservations: {
            method: 'GET',
            path: '/data/obs/:regionCode/notable',
            description: 'Get notable (rare or unusual) bird observations in a region. Highlights species that are uncommon for the area and time of year. Use getRecentObservations for related data. Use getNearbyObservations for related data.',
            parameters: [
                {
                    position: {
                        key: 'regionCode',
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
                        key: 'back',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(14)', 'max(30)']
                    }
                },
                {
                    position: {
                        key: 'maxResults',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(100)', 'max(10000)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get notable sightings in California',
                    regionCode: 'US-CA',
                    back: 7,
                    maxResults: 10
                },
                {
                    _description: 'Additional test for getNotableObservations',
                    regionCode: 'US-CA alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            speciesCode: {
                                type: 'string'
                            },
                            comName: {
                                type: 'string'
                            },
                            sciName: {
                                type: 'string'
                            },
                            locName: {
                                type: 'string'
                            },
                            obsDt: {
                                type: 'string'
                            },
                            howMany: {
                                type: 'number'
                            }
                        }
                    }
                }
            }
        },
        getNearbyObservations: {
            method: 'GET',
            path: '/data/obs/geo/recent',
            description: 'Get recent bird observations near a geographic coordinate. Searches within a radius around the specified latitude and longitude. Use getRecentObservations for related data. Use getNotableObservations for related data.',
            parameters: [
                {
                    position: {
                        key: 'lat',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'lng',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'dist',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(25)', 'max(50)']
                    }
                },
                {
                    position: {
                        key: 'back',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(14)', 'max(30)']
                    }
                },
                {
                    position: {
                        key: 'maxResults',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(100)', 'max(10000)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get observations near Central Park NYC',
                    lat: 40.785091,
                    lng: -73.968285,
                    dist: 10,
                    maxResults: 10
                },
                {
                    _description: 'Additional test for getNearbyObservations',
                    lat: 41.785091,
                    lng: -72.968285
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            speciesCode: {
                                type: 'string'
                            },
                            comName: {
                                type: 'string'
                            },
                            sciName: {
                                type: 'string'
                            },
                            locName: {
                                type: 'string'
                            },
                            obsDt: {
                                type: 'string'
                            },
                            howMany: {
                                type: 'number'
                            },
                            lat: {
                                type: 'number'
                            },
                            lng: {
                                type: 'number'
                            }
                        }
                    }
                }
            }
        },
        getHotspots: {
            method: 'GET',
            path: '/ref/hotspot/:regionCode',
            description: 'Get birding hotspots in a region. Returns locations where bird observations are frequently reported. Use getRecentObservations for related data. Use getNotableObservations for related data.',
            parameters: [
                {
                    position: {
                        key: 'regionCode',
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
                        key: 'back',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(14)', 'max(30)']
                    }
                },
                {
                    position: {
                        key: 'fmt',
                        value: 'json',
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
                    _description: 'Get hotspots in Massachusetts',
                    regionCode: 'US-MA'
                },
                {
                    _description: 'Additional test for getHotspots',
                    regionCode: 'US-MA alt',
                    fmt: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            locId: {
                                type: 'string'
                            },
                            locName: {
                                type: 'string'
                            },
                            countryCode: {
                                type: 'string'
                            },
                            lat: {
                                type: 'number'
                            },
                            lng: {
                                type: 'number'
                            },
                            numSpeciesAllTime: {
                                type: 'number'
                            }
                        }
                    }
                }
            }
        }
    }
}
