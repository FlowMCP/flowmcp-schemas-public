// Schema for #304 — OpenPLZ API (Postal codes and municipalities for DE/AT/CH)
// No API key required — fully public Open Data

export const main = {
    namespace: 'openplz',
    name: 'OpenPLZ API',
    description: 'Query postal codes, localities, streets, municipalities, and administrative divisions for Germany, Austria, and Switzerland. Open Data REST API with no authentication required.',
    version: '4.0.0',
    docs: ['https://openplzapi.org/swagger/index.html', 'https://github.com/openpotato/openplzapi'],
    tags: ['geodata', 'postalcodes', 'municipalities', 'germany', 'austria', 'switzerland', 'opendata', 'cacheTtlStatic'],
    root: 'https://openplzapi.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        getGermanFederalStates: {
            method: 'GET',
            path: '/de/FederalStates',
            description: 'Returns all 16 German federal states (Bundeslaender) with their official keys and names.',
            parameters: [],
            tests: [
                { _description: 'Get all German federal states' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            key: { type: 'string' },
                            name: { type: 'string' }
                        }
                    }
                }
            }
        },
        searchGermanLocalities: {
            method: 'GET',
            path: '/de/Localities',
            description: 'Search German localities by postal code or name. Returns locality, municipality, district, and federal state. For street-level data use searchGermanStreets. For combined search use germanFullTextSearch.',
            parameters: [
                {
                    position: { key: 'postalCode', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] }
                },
                {
                    position: { key: 'pageSize', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(50)'] }
                }
            ],
            tests: [
                { _description: 'Search by postal code 10115 (Berlin Mitte)', postalCode: '10115' },
                { _description: 'Search by name Berlin', name: 'Berlin' },
                { _description: 'Search by postal code 80331 (Munich)', postalCode: '80331' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            postalCode: { type: 'string' },
                            municipality: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' },
                                    type: { type: 'string' }
                                }
                            },
                            district: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' },
                                    type: { type: 'string' }
                                }
                            },
                            federalState: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        searchGermanStreets: {
            method: 'GET',
            path: '/de/Streets',
            description: 'Search German streets by name, postal code, or locality. Returns street name with locality, municipality, district, and federal state context.',
            parameters: [
                {
                    position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'postalCode', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'locality', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] }
                },
                {
                    position: { key: 'pageSize', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(50)'] }
                }
            ],
            tests: [
                { _description: 'Search Friedrichstrasse in Berlin', name: 'Friedrichstr', locality: 'Berlin' },
                { _description: 'Search streets in postal code 10115', postalCode: '10115' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            postalCode: { type: 'string' },
                            locality: { type: 'string' },
                            municipality: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' },
                                    type: { type: 'string' }
                                }
                            },
                            district: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' },
                                    type: { type: 'string' }
                                }
                            },
                            federalState: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        germanFullTextSearch: {
            method: 'GET',
            path: '/de/FullTextSearch',
            description: 'Full-text search across German streets, postal codes, and localities. For structured queries use searchGermanLocalities or searchGermanStreets. For Austrian or Swiss data, use the country-specific tools.',
            parameters: [
                {
                    position: { key: 'searchTerm', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: ['min(1)'] }
                },
                {
                    position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] }
                },
                {
                    position: { key: 'pageSize', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(50)'] }
                }
            ],
            tests: [
                { _description: 'Full-text search for Alexanderplatz Berlin', searchTerm: 'Alexanderplatz Berlin' },
                { _description: 'Full-text search for 80331 Muenchen', searchTerm: '80331 Muenchen' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            postalCode: { type: 'string' },
                            locality: { type: 'string' },
                            municipality: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' },
                                    type: { type: 'string' }
                                }
                            },
                            district: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' },
                                    type: { type: 'string' }
                                }
                            },
                            federalState: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getAustrianProvinces: {
            method: 'GET',
            path: '/at/FederalProvinces',
            description: 'Returns all 9 Austrian federal provinces (Bundeslaender) with their official keys and names.',
            parameters: [],
            tests: [
                { _description: 'Get all Austrian federal provinces' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            key: { type: 'string' },
                            name: { type: 'string' }
                        }
                    }
                }
            }
        },
        searchAustrianLocalities: {
            method: 'GET',
            path: '/at/Localities',
            description: 'Search Austrian localities by postal code or name. Returns locality name, postal code, municipality, district, and federal province.',
            parameters: [
                {
                    position: { key: 'postalCode', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] }
                },
                {
                    position: { key: 'pageSize', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(50)'] }
                }
            ],
            tests: [
                { _description: 'Search by postal code 1010 (Vienna center)', postalCode: '1010' },
                { _description: 'Search by name Salzburg', name: 'Salzburg' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            postalCode: { type: 'string' },
                            municipality: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' },
                                    code: { type: 'string' },
                                    status: { type: 'string' }
                                }
                            },
                            district: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' },
                                    code: { type: 'string' }
                                }
                            },
                            federalProvince: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getSwissCantons: {
            method: 'GET',
            path: '/ch/Cantons',
            description: 'Returns all 26 Swiss cantons with their official keys and names.',
            parameters: [],
            tests: [
                { _description: 'Get all Swiss cantons' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            key: { type: 'string' },
                            name: { type: 'string' }
                        }
                    }
                }
            }
        },
        searchSwissLocalities: {
            method: 'GET',
            path: '/ch/Localities',
            description: 'Search Swiss localities by postal code or name. Returns locality name, postal code, commune, district, and canton.',
            parameters: [
                {
                    position: { key: 'postalCode', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] }
                },
                {
                    position: { key: 'pageSize', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(50)'] }
                }
            ],
            tests: [
                { _description: 'Search by postal code 8001 (Zurich center)', postalCode: '8001' },
                { _description: 'Search by name Bern', name: 'Bern' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            postalCode: { type: 'string' },
                            commune: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' },
                                    shortName: { type: 'string' }
                                }
                            },
                            district: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' }
                                }
                            },
                            canton: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    name: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
