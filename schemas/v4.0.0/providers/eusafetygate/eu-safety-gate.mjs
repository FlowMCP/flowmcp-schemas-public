export const main = {
    namespace: 'eusafetygate',
    name: 'EU Safety Gate Product Recalls',
    description: 'Access the EU Safety Gate (formerly RAPEX) system for dangerous product notifications across the European Economic Area. Query product recall alerts, weekly reports, risk types, product categories, and country data. Covers 250+ countries, 20+ risk types, and 30+ product categories. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://ec.europa.eu/safety-gate-alerts/'],
    tags: ['consumer-safety', 'eu', 'product-recalls', 'opendata', 'cacheTtlDaily'],
    root: 'https://ec.europa.eu/safety-gate-alerts/public/api',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        listLanguages: {
            method: 'GET',
            path: '/languages',
            description: 'List all supported languages in the EU Safety Gate system. Returns 28 languages including all EU official languages plus Norwegian, Icelandic, Ukrainian, Arabic, and Irish. Use the language key to localize notification responses.',
            parameters: [],
            tests: [
                { _description: 'List all supported languages' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'List of all supported languages in the Safety Gate system',
                    items: {
                        type: 'object',
                        properties: {
                            key: { type: 'string', description: 'ISO language code (e.g., EN, DE, FR)' },
                            name: { type: 'string', description: 'Full language name in English' }
                        }
                    }
                }
            }
        },
        listCountries: {
            method: 'GET',
            path: '/country/list',
            description: 'List all countries tracked by EU Safety Gate. Returns 250+ countries with EU/EEA membership flags, useful for filtering notifications by origin or reporting country.',
            parameters: [],
            tests: [
                { _description: 'List all countries with EU/EEA flags' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'List of all countries tracked by EU Safety Gate with membership status',
                    items: {
                        type: 'object',
                        properties: {
                            key: { type: 'string', description: 'ISO country code (e.g., DE, FR, US)' },
                            propertyKey: { type: 'string', description: 'Internal property key used for filtering' },
                            name: { type: 'string', description: 'Full country name in English' },
                            orderIndex: { type: 'number', description: 'Display order index for sorting' },
                            euCountry: { type: 'boolean', description: 'Whether the country is an EU member state' },
                            eeaCountry: { type: 'boolean', description: 'Whether the country is an EEA member' }
                        }
                    }
                }
            }
        },
        listEnums: {
            method: 'GET',
            path: '/enum/list',
            description: 'Get all enumeration values used for filtering product safety notifications. Returns risk types (22 categories like FIRE, CHEMICAL, CHOKING, ELECTRIC_SHOCK) and product categories (34 types like TOYS, COSMETICS, MOTOR_VEHICLES, ELECTRICAL_APPLIANCES). Use these values to filter listReports results.',
            parameters: [],
            tests: [
                { _description: 'List all risk types and product categories' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Enumeration values for risk types and product categories used across the Safety Gate system',
                    properties: {
                        riskTypeEnum: {
                            type: 'array',
                            description: 'Available risk type categories for filtering notifications',
                            items: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string', description: 'Risk type identifier (e.g., FIRE, CHEMICAL, CHOKING)' },
                                    name: { type: 'string', description: 'Human-readable risk type name' }
                                }
                            }
                        },
                        productCategoryEnum: {
                            type: 'array',
                            description: 'Available product categories for filtering notifications',
                            items: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string', description: 'Product category identifier (e.g., TOYS, COSMETICS, MOTOR_VEHICLES)' },
                                    name: { type: 'string', description: 'Human-readable product category name' }
                                }
                            }
                        }
                    }
                }
            }
        },
        listReportYears: {
            method: 'GET',
            path: '/webreport/years/all',
            description: 'Get all available years for weekly safety reports. Returns years from 2005 to present, useful for building time-based queries with listReports.',
            parameters: [],
            tests: [
                { _description: 'List all available report years' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'List of years with available weekly safety reports, from 2005 to present',
                    items: { type: 'number' }
                }
            }
        },
        getLatestReport: {
            method: 'GET',
            path: '/webreport/last',
            description: 'Get the most recent weekly safety report reference. Returns the year of the latest published report. Use listReports to browse all reports with pagination.',
            parameters: [],
            tests: [
                { _description: 'Get latest weekly report' }
            ],
            output: {
                mimeType: 'text/plain',
                schema: {
                    type: 'string',
                    description: 'Year of the most recently published weekly safety report'
                }
            }
        },
        listReports: {
            method: 'POST',
            path: '/webreport/all',
            description: 'Get paginated list of all weekly safety reports. Each report contains product recall notifications published during that week. Use listEnums to get valid filter values for risk types and product categories.',
            parameters: [
                { position: { key: 'pageNumber', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'pageSize', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } }
            ],
            tests: [
                { _description: 'Get first page of weekly reports', pageNumber: 0, pageSize: 5 },
                { _description: 'Get second page of weekly reports', pageNumber: 1, pageSize: 5 },
                { _description: 'Get larger page of reports', pageNumber: 0, pageSize: 20 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of weekly safety reports with product recall notifications',
                    properties: {
                        content: { type: 'array', description: 'Array of weekly report objects containing product recall notifications' },
                        pageable: {
                            type: 'object',
                            description: 'Pagination metadata for the current request',
                            properties: {
                                pageNumber: { type: 'number', description: 'Current page number (0-based)' },
                                pageSize: { type: 'number', description: 'Number of reports per page' }
                            }
                        },
                        totalElements: { type: 'number', description: 'Total number of weekly reports available' },
                        totalPages: { type: 'number', description: 'Total number of pages available' },
                        last: { type: 'boolean', description: 'Whether this is the last page' },
                        first: { type: 'boolean', description: 'Whether this is the first page' },
                        empty: { type: 'boolean', description: 'Whether the result set is empty' }
                    }
                }
            }
        }
    }
}
