export const main = {
    namespace: 'bis',
    name: 'BisStatistics',
    description: 'Query Bank for International Settlements statistical data via SDMX REST API — central bank policy rates, effective exchange rates, credit-to-GDP gaps, property prices, consumer prices, debt securities, and US dollar exchange rates.',
    version: '4.0.0',
    docs: ['https://stats.bis.org/api/v2', 'https://www.bis.org/statistics/index.htm'],
    tags: ['economics', 'finance', 'central-bank', 'statistics', 'cacheTtlDaily'],
    root: 'https://stats.bis.org/api/v2',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/vnd.sdmx.data+json'
    },
    tools: {
        getCentralBankPolicyRates: {
            method: 'GET',
            path: '/data/dataflow/BIS/WS_CBPOL/1.0',
            description: 'Get central bank policy rates for all reporting countries. Returns the interest rate which best captures the monetary authorities policy intentions.',
            parameters: [
                { position: { key: 'startPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'detail', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(full,dataonly,serieskeysonly,nodata)', options: ['optional()', 'default(dataonly)'] } }
            ],
            tests: [
                { _description: 'Get central bank policy rates from 2025 onward', startPeriod: '2025-01', detail: 'dataonly' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', description: 'Response identifier' },
                                prepared: { type: 'string', description: 'Response preparation timestamp' }
                            }
                        },
                        data: {
                            type: 'object',
                            properties: {
                                dataSets: {
                                    type: 'array',
                                    description: 'Array of dataset objects containing time series data',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            action: { type: 'string' },
                                            series: { type: 'object', description: 'Series keyed by dimension index with observations' }
                                        }
                                    }
                                },
                                structure: {
                                    type: 'object',
                                    description: 'Structure metadata describing dimensions and attributes',
                                    properties: {
                                        dimensions: { type: 'object' },
                                        attributes: { type: 'object' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        getEffectiveExchangeRates: {
            method: 'GET',
            path: '/data/dataflow/BIS/WS_EER/1.0',
            description: 'Get BIS effective exchange rate indices — nominal and real broad and narrow indices for all reporting economies.',
            parameters: [
                { position: { key: 'startPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'detail', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(full,dataonly,serieskeysonly,nodata)', options: ['optional()', 'default(dataonly)'] } }
            ],
            tests: [
                { _description: 'Get effective exchange rates from 2025', startPeriod: '2025-01', detail: 'dataonly' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object' },
                        data: {
                            type: 'object',
                            properties: {
                                dataSets: { type: 'array', items: { type: 'object' } },
                                structure: { type: 'object' }
                            }
                        }
                    }
                }
            }
        },
        getCreditToGdpGaps: {
            method: 'GET',
            path: '/data/dataflow/BIS/WS_CREDIT_GAP/1.0',
            description: 'Get credit-to-GDP gaps — the difference between the credit-to-GDP ratio and its long-run trend, capturing the build-up of excessive credit.',
            parameters: [
                { position: { key: 'startPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'detail', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(full,dataonly,serieskeysonly,nodata)', options: ['optional()', 'default(dataonly)'] } }
            ],
            tests: [
                { _description: 'Get credit-to-GDP gaps from 2024', startPeriod: '2024-01', detail: 'dataonly' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object' },
                        data: {
                            type: 'object',
                            properties: {
                                dataSets: { type: 'array', items: { type: 'object' } },
                                structure: { type: 'object' }
                            }
                        }
                    }
                }
            }
        },
        getPropertyPrices: {
            method: 'GET',
            path: '/data/dataflow/BIS/WS_SPP/1.0',
            description: 'Get selected residential property price indices — real and nominal property prices across BIS reporting countries.',
            parameters: [
                { position: { key: 'startPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'detail', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(full,dataonly,serieskeysonly,nodata)', options: ['optional()', 'default(dataonly)'] } }
            ],
            tests: [
                { _description: 'Get property prices from 2024', startPeriod: '2024-01', detail: 'dataonly' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object' },
                        data: {
                            type: 'object',
                            properties: {
                                dataSets: { type: 'array', items: { type: 'object' } },
                                structure: { type: 'object' }
                            }
                        }
                    }
                }
            }
        },
        getConsumerPrices: {
            method: 'GET',
            path: '/data/dataflow/BIS/WS_LONG_CPI/1.0',
            description: 'Get consumer price indices — CPI statistics measuring the average change in the price of consumer items purchased by households.',
            parameters: [
                { position: { key: 'startPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'detail', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(full,dataonly,serieskeysonly,nodata)', options: ['optional()', 'default(dataonly)'] } }
            ],
            tests: [
                { _description: 'Get consumer prices from 2024', startPeriod: '2024-01', detail: 'dataonly' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object' },
                        data: {
                            type: 'object',
                            properties: {
                                dataSets: { type: 'array', items: { type: 'object' } },
                                structure: { type: 'object' }
                            }
                        }
                    }
                }
            }
        },
        getUsDollarExchangeRates: {
            method: 'GET',
            path: '/data/dataflow/BIS/WS_XRU/1.0',
            description: 'Get US dollar exchange rates — the price of one country currency expressed in US dollars for all reporting economies.',
            parameters: [
                { position: { key: 'startPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'detail', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(full,dataonly,serieskeysonly,nodata)', options: ['optional()', 'default(dataonly)'] } }
            ],
            tests: [
                { _description: 'Get USD exchange rates from 2025', startPeriod: '2025-01', detail: 'dataonly' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object' },
                        data: {
                            type: 'object',
                            properties: {
                                dataSets: { type: 'array', items: { type: 'object' } },
                                structure: { type: 'object' }
                            }
                        }
                    }
                }
            }
        },
        getDebtSecurities: {
            method: 'GET',
            path: '/data/dataflow/BIS/WS_DEBT_SEC2_PUB/1.0',
            description: 'Get international debt securities statistics (BIS-compiled) — outstanding amounts and net issuance of international bonds and notes by country, sector, and currency.',
            parameters: [
                { position: { key: 'startPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'detail', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(full,dataonly,serieskeysonly,nodata)', options: ['optional()', 'default(dataonly)'] } }
            ],
            tests: [
                { _description: 'Get debt securities data from 2024', startPeriod: '2024-01', detail: 'dataonly' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object' },
                        data: {
                            type: 'object',
                            properties: {
                                dataSets: { type: 'array', items: { type: 'object' } },
                                structure: { type: 'object' }
                            }
                        }
                    }
                }
            }
        },
        getGenericData: {
            method: 'GET',
            path: '/data/dataflow/BIS/:dataflowId/1.0',
            description: 'Query any BIS SDMX dataflow by its identifier. Use listDataflows to discover available dataflow IDs (e.g., WS_CBS_PUB for consolidated banking, WS_DEBT_SEC2_PUB for debt securities, WS_LBS_D_PUB for locational banking, WS_DSR for debt service ratios, WS_TC for total credit).',
            parameters: [
                { position: { key: 'dataflowId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'startPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'detail', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(full,dataonly,serieskeysonly,nodata)', options: ['optional()', 'default(dataonly)'] } }
            ],
            tests: [
                { _description: 'Get debt service ratios from 2024', dataflowId: 'WS_DSR', startPeriod: '2024-01', detail: 'dataonly' },
                { _description: 'Get total credit data from 2024', dataflowId: 'WS_TC', startPeriod: '2024-01', detail: 'dataonly' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                prepared: { type: 'string' }
                            }
                        },
                        data: {
                            type: 'object',
                            properties: {
                                dataSets: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            action: { type: 'string' },
                                            series: { type: 'object', description: 'Time series data keyed by dimension indices' }
                                        }
                                    }
                                },
                                structure: {
                                    type: 'object',
                                    properties: {
                                        dimensions: { type: 'object', description: 'Dimension definitions for interpreting series keys' },
                                        attributes: { type: 'object', description: 'Attribute definitions' }
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
