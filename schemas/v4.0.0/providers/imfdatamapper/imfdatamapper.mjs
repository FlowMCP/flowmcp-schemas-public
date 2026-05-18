export const main = {
    namespace: 'imfdatamapper',
    name: 'IMF DataMapper',
    description: 'Access international financial and economic data from the IMF DataMapper. 120+ indicators covering GDP, inflation, debt, trade, and more for 190+ countries. Free, no key required.',
    version: '4.0.0',
    docs: ['https://www.imf.org/external/datamapper/'],
    tags: ['economics', 'finance', 'macroeconomics', 'international', 'statistics', 'cacheTtlDaily'],
    root: 'https://www.imf.org/external/datamapper/api/v1',
    requiredServerParams: [],
    headers: {},
    tools: {
        listIndicators: {
            method: 'GET',
            path: '/indicators',
            description: 'List all 120+ available economic indicators with labels, descriptions, sources, units, and dataset names. Use indicator codes (e.g. NGDP_RPCH, PCPIPCH) with getIndicatorAllCountries, getIndicatorByCountry, or getIndicatorByGroup.',
            parameters: [],
            tests: [
                { _description: 'List all available IMF indicators' },
                { _description: 'Retrieve full indicator catalog' },
                { _description: 'Get indicator codes and descriptions' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Catalog of all IMF DataMapper indicators keyed by indicator code',
                    properties: {
                        indicators: {
                            type: 'object',
                            description: 'Map of indicator codes to their metadata (e.g. NGDP_RPCH for real GDP growth)',
                            properties: {
                                NGDP_RPCH: {
                                    type: 'object',
                                    description: 'Example indicator: Real GDP growth rate',
                                    properties: {
                                        label: { type: 'string', description: 'Human-readable indicator name' },
                                        description: { type: 'string', description: 'Detailed explanation of what the indicator measures' },
                                        source: { type: 'string', description: 'Data source (e.g. World Economic Outlook)' },
                                        unit: { type: 'string', description: 'Unit of measurement (e.g. percent change, billions USD)' },
                                        dataset: { type: 'string', description: 'IMF dataset the indicator belongs to' }
                                    }
                                }
                            }
                        },
                        api: {
                            type: 'object',
                            description: 'API metadata including version and output format',
                            properties: {
                                version: { type: 'string', description: 'API version number' },
                                'output-method': { type: 'string', description: 'Response output format' }
                            }
                        }
                    }
                }
            }
        },
        listCountries: {
            method: 'GET',
            path: '/countries',
            description: 'List all 190+ countries with ISO 3-letter codes and labels. Use these codes as the countries parameter for getIndicatorByCountry.',
            parameters: [],
            tests: [
                { _description: 'List all available countries' },
                { _description: 'Retrieve full country catalog with ISO codes' },
                { _description: 'Get country codes for data queries' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Catalog of all countries keyed by ISO 3-letter code',
                    properties: {
                        countries: {
                            type: 'object',
                            description: 'Map of ISO 3-letter country codes to their labels',
                            properties: {
                                USA: { type: 'object', description: 'Example country entry', properties: { label: { type: 'string', description: 'Full country name' } } },
                                DEU: { type: 'object', description: 'Example country entry', properties: { label: { type: 'string', description: 'Full country name' } } }
                            }
                        },
                        api: {
                            type: 'object',
                            description: 'API metadata including version and output format',
                            properties: {
                                version: { type: 'string', description: 'API version number' },
                                'output-method': { type: 'string', description: 'Response output format' }
                            }
                        }
                    }
                }
            }
        },
        listGroups: {
            method: 'GET',
            path: '/groups',
            description: 'List all 100+ country groups and regions (advanced economies, emerging markets, EU, G20, ASEAN, etc.) with labels. Use group codes with getIndicatorByGroup for aggregate data.',
            parameters: [],
            tests: [
                { _description: 'List all country groups' },
                { _description: 'Retrieve full group catalog' },
                { _description: 'Get group codes for aggregate queries' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Catalog of all country groups keyed by group code',
                    properties: {
                        groups: {
                            type: 'object',
                            description: 'Map of group codes to their labels (e.g. ADVEC for Advanced Economies)',
                            properties: {
                                ADVEC: { type: 'object', description: 'Example group: Advanced Economies', properties: { label: { type: 'string', description: 'Full group name' } } },
                                EU: { type: 'object', description: 'Example group: European Union', properties: { label: { type: 'string', description: 'Full group name' } } }
                            }
                        },
                        api: {
                            type: 'object',
                            description: 'API metadata including version and output format',
                            properties: {
                                version: { type: 'string', description: 'API version number' },
                                'output-method': { type: 'string', description: 'Response output format' }
                            }
                        }
                    }
                }
            }
        },
        getIndicatorAllCountries: {
            method: 'GET',
            path: '/:indicator',
            description: 'Get time series data for a single indicator across ALL countries. Returns year-value pairs from 1980 to 2030 (forecast). Use listIndicators to find valid indicator codes. Use getIndicatorByCountry to narrow to specific countries.',
            parameters: [
                { position: { key: 'indicator', value: '{{INDICATOR}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'IMF indicator code (e.g. NGDP_RPCH for real GDP growth, PCPIPCH for inflation)' }
            ],
            tests: [
                { _description: 'Get real GDP growth for all countries', indicator: 'NGDP_RPCH' },
                { _description: 'Get inflation rate for all countries', indicator: 'PCPIPCH' },
                { _description: 'Get current account balance for all countries', indicator: 'BCA_NGDPD' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Time series values for the requested indicator across all countries',
                    properties: {
                        values: {
                            type: 'object',
                            description: 'Nested map: indicator code -> country code -> year -> value',
                            properties: {
                                NGDP_RPCH: {
                                    type: 'object',
                                    description: 'Country-level data keyed by ISO 3-letter code',
                                    properties: {
                                        USA: { type: 'object', description: 'Year-value pairs for this country (e.g. {"2023": 2.5, "2024": 1.8})' },
                                        DEU: { type: 'object', description: 'Year-value pairs for this country' }
                                    }
                                }
                            }
                        },
                        api: {
                            type: 'object',
                            description: 'API metadata including version and output format',
                            properties: {
                                version: { type: 'string', description: 'API version number' },
                                'output-method': { type: 'string', description: 'Response output format' }
                            }
                        }
                    }
                }
            }
        },
        getIndicatorByCountry: {
            method: 'GET',
            path: '/:indicator/:countries',
            description: 'Get time series data for a single indicator and one or more specific countries. Separate multiple country codes with +. Returns annual values from 1980 to 2030. Use listCountries to find valid ISO codes and listIndicators for indicator codes.',
            parameters: [
                { position: { key: 'indicator', value: '{{INDICATOR}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'IMF indicator code (e.g. NGDP_RPCH for real GDP growth)' },
                { position: { key: 'countries', value: '{{COUNTRIES}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'ISO 3-letter country codes, separate multiple with + (e.g. USA+DEU+FRA)' }
            ],
            tests: [
                { _description: 'Get real GDP growth for USA', indicator: 'NGDP_RPCH', countries: 'USA' },
                { _description: 'Get GDP per capita for Germany and France', indicator: 'NGDPDPC', countries: 'DEU+FRA' },
                { _description: 'Get unemployment rate for G7 countries', indicator: 'LUR', countries: 'USA+GBR+DEU+FRA+JPN+CAN+ITA' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Time series values for the requested indicator filtered to specific countries',
                    properties: {
                        values: {
                            type: 'object',
                            description: 'Nested map: indicator code -> country code -> year -> value',
                            properties: {
                                NGDP_RPCH: {
                                    type: 'object',
                                    description: 'Country-level data keyed by ISO 3-letter code',
                                    properties: {
                                        USA: { type: 'object', description: 'Year-value pairs for this country (e.g. {"2023": 2.5, "2024": 1.8})' }
                                    }
                                }
                            }
                        },
                        api: {
                            type: 'object',
                            description: 'API metadata including version and output format',
                            properties: {
                                version: { type: 'string', description: 'API version number' },
                                'output-method': { type: 'string', description: 'Response output format' }
                            }
                        }
                    }
                }
            }
        },
        getIndicatorByGroup: {
            method: 'GET',
            path: '/:indicator/groups/:group',
            description: 'Get time series data for an indicator filtered by a country group (e.g., advanced economies, EU, G20). Returns aggregate or per-member data by year. Use listGroups to find valid group codes and listIndicators for indicator codes.',
            parameters: [
                { position: { key: 'indicator', value: '{{INDICATOR}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'IMF indicator code (e.g. NGDP_RPCH for real GDP growth)' },
                { position: { key: 'group', value: '{{GROUP}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Country group code from listGroups (e.g. ADVEC, EU, G20)' }
            ],
            tests: [
                { _description: 'Get GDP growth for advanced economies', indicator: 'NGDP_RPCH', group: 'ADVEC' },
                { _description: 'Get inflation for EU countries', indicator: 'PCPIPCH', group: 'EU' },
                { _description: 'Get government debt for G20 countries', indicator: 'GGXWDG_NGDP', group: 'G20' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Time series values for the requested indicator filtered to a country group',
                    properties: {
                        values: { type: 'object', description: 'Nested map: indicator code -> country/group code -> year -> value' },
                        api: {
                            type: 'object',
                            description: 'API metadata including version and output format',
                            properties: {
                                version: { type: 'string', description: 'API version number' },
                                'output-method': { type: 'string', description: 'Response output format' }
                            }
                        }
                    }
                }
            }
        }
    }
}
