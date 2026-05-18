export const main = {
    namespace: 'ecb',
    name: 'EcbSdmx',
    description: 'Query the European Central Bank statistical data via SDMX REST API — exchange rates, interest rates, monetary aggregates, and macroeconomic indicators with flexible time series filtering.',
    version: '4.0.0',
    docs: ['https://data.ecb.europa.eu/help/api/data', 'https://data.ecb.europa.eu/help/api/overview'],
    tags: ['finance', 'economics', 'central-bank', 'exchange-rates', 'cacheTtlDaily'],
    root: 'https://data-api.ecb.europa.eu',
    requiredServerParams: [],
    headers: {
        Accept: 'application/vnd.sdmx.data+json;version=1.0.0-wd'
    },
    tools: {
        getExchangeRates: {
            method: 'GET',
            path: '/service/data/EXR/:key',
            description: 'Get exchange rate data from the ECB. The key follows the pattern FREQ.CURRENCY.DENOM.EXR_TYPE.EXR_SUFFIX (e.g., D.USD.EUR.SP00.A for daily USD/EUR spot rate). Use getInterestRates for related data. Use getMonetaryAggregates for related data.',
            parameters: [
                {
                    position: {
                        key: 'key',
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
                        key: 'startPeriod',
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
                        key: 'endPeriod',
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
                        key: 'detail',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(full,dataonly,serieskeysonly,nodata)',
                        options: ['optional()', 'default(full)']
                    }
                },
                {
                    position: {
                        key: 'lastNObservations',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'min(1)']
                    }
                },
                {
                    position: {
                        key: 'firstNObservations',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'min(1)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get daily USD/EUR exchange rate for 2025',
                    key: 'D.USD.EUR.SP00.A',
                    startPeriod: '2025-01-01',
                    endPeriod: '2025-12-31'
                },
                {
                    _description: 'Get monthly GBP/EUR exchange rate last 12 observations',
                    key: 'M.GBP.EUR.SP00.A',
                    lastNObservations: 12
                },
                {
                    _description: 'Get daily JPY/EUR spot rate for January 2025',
                    key: 'D.JPY.EUR.SP00.A',
                    startPeriod: '2025-01-01',
                    endPeriod: '2025-01-31'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        header: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Response identifier'
                                },
                                prepared: {
                                    type: 'string',
                                    description: 'Response preparation timestamp'
                                },
                                sender: {
                                    type: 'object',
                                    description: 'Sender details'
                                }
                            },
                            description: 'Header information'
                        },
                        dataSets: {
                            type: 'array',
                            description: 'Array of dataset objects containing the time series data',
                            items: {
                                type: 'object',
                                properties: {
                                    action: {
                                        type: 'string',
                                        description: 'Action value'
                                    },
                                    series: {
                                        type: 'object',
                                        description: 'Series keyed by dimension index with observations'
                                    }
                                },
                                description: 'Individual item in the dataSets collection'
                            }
                        },
                        structure: {
                            type: 'object',
                            description: 'Structure metadata describing dimensions and attributes',
                            properties: {
                                dimensions: {
                                    type: 'object',
                                    description: 'Dimensions details'
                                },
                                attributes: {
                                    type: 'object',
                                    description: 'Attribute collection'
                                }
                            }
                        }
                    }
                }
            }
        },
        getInterestRates: {
            method: 'GET',
            path: '/service/data/FM/:key',
            description: 'Get financial market interest rate data (key interest rates, money market rates, government bond yields). Key pattern: FREQ.GEO.INDICATOR.MATURITY.COUNTERPART (e.g., M.U2.EUR.RT.MM.EURIBOR1MD_.HSTA for monthly Euribor). Use getExchangeRates for related data. Use getMonetaryAggregates for related data.',
            parameters: [
                {
                    position: {
                        key: 'key',
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
                        key: 'startPeriod',
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
                        key: 'endPeriod',
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
                        key: 'lastNObservations',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'min(1)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get monthly Euro area financial market data',
                    key: 'M.U2.EUR.RT.MM.EURIBOR1MD_.HSTA',
                    lastNObservations: 12
                },
                {
                    _description: 'Additional test for getInterestRates',
                    key: 'M.U2.EUR.RT.MM.EURIBOR1MD_.HSTA alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        header: {
                            type: 'object',
                            description: 'Header information'
                        },
                        dataSets: {
                            type: 'array',
                            items: {
                                type: 'object'
                            },
                            description: 'Collection of dataSets items'
                        },
                        structure: {
                            type: 'object',
                            description: 'Structure details'
                        }
                    }
                }
            }
        },
        getMonetaryAggregates: {
            method: 'GET',
            path: '/service/data/BSI/:key',
            description: 'Get balance sheet items (monetary aggregates, credit data) from the ECB statistical warehouse. Key follows BSI dataflow dimensions. Use getExchangeRates for related data. Use getInterestRates for related data.',
            parameters: [
                {
                    position: {
                        key: 'key',
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
                        key: 'startPeriod',
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
                        key: 'endPeriod',
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
                        key: 'lastNObservations',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'min(1)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get Euro area M3 monetary aggregate (last 12 months)',
                    key: 'M.U2.Y.V.M30.X.1.U2.2300.Z01.E',
                    lastNObservations: 12
                },
                {
                    _description: 'Additional test for getMonetaryAggregates',
                    key: 'M.U2.Y.V.M30.X.1.U2.2300.Z01.E alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        header: {
                            type: 'object',
                            description: 'Header information'
                        },
                        dataSets: {
                            type: 'array',
                            items: {
                                type: 'object'
                            },
                            description: 'Collection of dataSets items'
                        },
                        structure: {
                            type: 'object',
                            description: 'Structure details'
                        }
                    }
                }
            }
        },
        getInflationData: {
            method: 'GET',
            path: '/service/data/ICP/:key',
            description: 'Get harmonised index of consumer prices (HICP) inflation data. Key follows ICP dataflow dimensions for price indices and inflation rates. Use getExchangeRates for related data. Use getInterestRates for related data.',
            parameters: [
                {
                    position: {
                        key: 'key',
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
                        key: 'startPeriod',
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
                        key: 'endPeriod',
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
                        key: 'lastNObservations',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'min(1)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get Euro area overall HICP annual rate of change',
                    key: 'M.U2.N.000000.4.ANR',
                    lastNObservations: 24
                },
                {
                    _description: 'Additional test for getInflationData',
                    key: 'M.U2.N.000000.4.ANR alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        header: {
                            type: 'object',
                            description: 'Header information'
                        },
                        dataSets: {
                            type: 'array',
                            items: {
                                type: 'object'
                            },
                            description: 'Collection of dataSets items'
                        },
                        structure: {
                            type: 'object',
                            description: 'Structure details'
                        }
                    }
                }
            }
        },
        getGenericData: {
            method: 'GET',
            path: '/service/data/:flowRef/:key',
            description: 'Query any ECB SDMX dataflow by its reference and series key. Use this for dataflows not covered by the specific routes (e.g., SEC, CBD, MIR, QSA). Use getExchangeRates for related data. Use getInterestRates for related data.',
            parameters: [
                {
                    position: {
                        key: 'flowRef',
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
                        key: 'key',
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
                        key: 'startPeriod',
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
                        key: 'endPeriod',
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
                        key: 'detail',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(full,dataonly,serieskeysonly,nodata)',
                        options: ['optional()', 'default(full)']
                    }
                },
                {
                    position: {
                        key: 'lastNObservations',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'min(1)']
                    }
                },
                {
                    position: {
                        key: 'firstNObservations',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'min(1)']
                    }
                },
                {
                    position: {
                        key: 'updatedAfter',
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
                    _description: 'Get quarterly GDP data for Euro area',
                    flowRef: 'QSA',
                    key: 'Q.N.I8.W0.S1.S1.B.B1GQ._Z._Z._Z.EUR.V.N',
                    lastNObservations: 8
                },
                {
                    _description: 'Get daily EUR/USD exchange rate for January 2025',
                    flowRef: 'EXR',
                    key: 'D.USD.EUR.SP00.A',
                    startPeriod: '2025-01-01',
                    endPeriod: '2025-01-31'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        header: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Unique identifier'
                                },
                                prepared: {
                                    type: 'string',
                                    description: 'Prepared value'
                                },
                                sender: {
                                    type: 'object',
                                    description: 'Sender details'
                                }
                            },
                            description: 'Header information'
                        },
                        dataSets: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    action: {
                                        type: 'string',
                                        description: 'Action value'
                                    },
                                    series: {
                                        type: 'object',
                                        description: 'Time series data keyed by dimension indices'
                                    }
                                },
                                description: 'Individual item in the dataSets collection'
                            },
                            description: 'Collection of dataSets items'
                        },
                        structure: {
                            type: 'object',
                            properties: {
                                dimensions: {
                                    type: 'object',
                                    description: 'Dimension definitions for interpreting series keys'
                                },
                                attributes: {
                                    type: 'object',
                                    description: 'Attribute definitions'
                                }
                            },
                            description: 'Structure details'
                        }
                    }
                }
            }
        }
    }
}
