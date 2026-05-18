export const main = {
    namespace: 'ipuparline',
    name: 'IpuParline',
    description: 'Query IPU Parline global parliamentary data — countries, parliaments, chambers, elections, and specialized bodies for 190+ countries.',
    version: '4.0.0',
    docs: ['https://data.ipu.org/data-tools/api/'],
    tags: ['politics', 'parliament', 'democracy', 'elections', 'cacheTtlDaily'],
    root: 'https://api.data.ipu.org',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        listCountries: {
            method: 'GET',
            path: '/v1/countries',
            description: 'List all countries in the Parline database with parliamentary metadata including official name, ISO codes, IPU membership status, and population data. Use country codes from results with getCountry, getParliament, or as context for listChambers.',
            parameters: [
                { position: { key: 'page[size]', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(200)'] }, description: 'Number of countries per page (max 200)' },
                { position: { key: 'page[number]', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] }, description: 'Page number for pagination' }
            ],
            tests: [
                { _description: 'List first 20 countries', 'page[size]': 20, 'page[number]': 1 },
                { _description: 'List all countries in one request', 'page[size]': 200 },
                { _description: 'Get second page of countries', 'page[size]': 20, 'page[number]': 2 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of countries with parliamentary metadata in JSON:API format',
                    properties: {
                        meta: {
                            type: 'object',
                            description: 'Pagination metadata',
                            properties: {
                                total: { type: 'number', description: 'Total number of countries in the database' },
                                row_count: { type: 'number', description: 'Number of countries in the current page' }
                            }
                        },
                        links: {
                            type: 'object',
                            description: 'Pagination navigation links',
                            properties: {
                                self: { type: 'string', description: 'URL for the current page' },
                                next: { type: 'string', description: 'URL for the next page (null if last page)' },
                                last: { type: 'string', description: 'URL for the last page' }
                            }
                        },
                        data: {
                            type: 'array',
                            description: 'Array of country objects with ISO codes and parliamentary attributes',
                            items: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string', description: 'Resource type, always Country' },
                                    id: { type: 'string', description: 'ISO 2-letter country code (use with getCountry and getParliament)' },
                                    attributes: { type: 'object', description: 'Country attributes including official name, ISO codes, membership status, population' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getCountry: {
            method: 'GET',
            path: '/v1/countries/:countryCode',
            description: 'Get detailed information about a specific country including official name, ISO codes, currency, IPU membership, and population history. Use listCountries to find valid country codes. Use getParliament for parliamentary structure details.',
            parameters: [
                { position: { key: 'countryCode', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(2)', 'max(2)'] }, description: 'ISO 2-letter country code (e.g. DE, US, GB)' }
            ],
            tests: [
                { _description: 'Get country data for Germany', countryCode: 'DE' },
                { _description: 'Get country data for United States', countryCode: 'US' },
                { _description: 'Get country data for Japan', countryCode: 'JP' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Detailed country record with parliamentary and demographic data',
                    properties: {
                        meta: { type: 'object', description: 'Response metadata' },
                        data: {
                            type: 'object',
                            description: 'Country resource object',
                            properties: {
                                type: { type: 'string', description: 'Resource type, always Country' },
                                id: { type: 'string', description: 'ISO 2-letter country code' },
                                attributes: { type: 'object', description: 'Country attributes including official name, ISO codes, currency, IPU membership status, and population history' }
                            }
                        }
                    }
                }
            }
        },
        listParliaments: {
            method: 'GET',
            path: '/v1/parliaments',
            description: 'List all parliaments with detailed structural data including type (unicameral/bicameral), assent rules, dissolution powers, and legislative procedures. Use getParliament with a country code for a specific parliament.',
            parameters: [
                { position: { key: 'page[size]', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(200)'] }, description: 'Number of parliaments per page (max 200)' },
                { position: { key: 'page[number]', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] }, description: 'Page number for pagination' }
            ],
            tests: [
                { _description: 'List first 10 parliaments', 'page[size]': 10 },
                { _description: 'Get second page of parliaments', 'page[size]': 10, 'page[number]': 2 },
                { _description: 'List 50 parliaments at once', 'page[size]': 50 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of parliament structures in JSON:API format',
                    properties: {
                        meta: { type: 'object', description: 'Pagination metadata', properties: { total: { type: 'number', description: 'Total number of parliaments' }, row_count: { type: 'number', description: 'Number of parliaments in current page' } } },
                        links: { type: 'object', description: 'Pagination navigation links' },
                        data: {
                            type: 'array',
                            description: 'Array of parliament objects with structural attributes',
                            items: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string', description: 'Resource type, always Parliament' },
                                    id: { type: 'string', description: 'Country code identifying this parliament' },
                                    attributes: { type: 'object', description: 'Parliament structure details: type (unicameral/bicameral), assent rules, dissolution powers, legislative procedures' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getParliament: {
            method: 'GET',
            path: '/v1/parliaments/:countryCode',
            description: 'Get detailed parliament data for a specific country including type, chambers, assent rules, dissolution powers, and oversight mechanisms. Use listCountries to find valid country codes. Use listChambers for chamber-level composition data.',
            parameters: [
                { position: { key: 'countryCode', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(2)', 'max(2)'] }, description: 'ISO 2-letter country code (e.g. DE, GB, US)' }
            ],
            tests: [
                { _description: 'Get German Bundestag parliament data', countryCode: 'DE' },
                { _description: 'Get UK Parliament data', countryCode: 'GB' },
                { _description: 'Get French parliament data', countryCode: 'FR' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Detailed parliament record with structural and procedural data',
                    properties: {
                        meta: { type: 'object', description: 'Response metadata' },
                        data: {
                            type: 'object',
                            description: 'Parliament resource object',
                            properties: {
                                type: { type: 'string', description: 'Resource type, always Parliament' },
                                id: { type: 'string', description: 'Country code identifying this parliament' },
                                attributes: { type: 'object', description: 'Parliament attributes: type (unicameral/bicameral), chamber names, assent rules, dissolution powers, oversight mechanisms, legislative procedures' }
                            }
                        }
                    }
                }
            }
        },
        listChambers: {
            method: 'GET',
            path: '/v1/chambers',
            description: 'List all parliamentary chambers worldwide with composition data, election systems, term lengths, and membership statistics. Use with getElections to correlate chamber data with election results.',
            parameters: [
                { position: { key: 'page[size]', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(200)'] }, description: 'Number of chambers per page (max 200)' },
                { position: { key: 'page[number]', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] }, description: 'Page number for pagination' }
            ],
            tests: [
                { _description: 'List first 10 chambers', 'page[size]': 10 },
                { _description: 'Get all chambers in one page', 'page[size]': 200 },
                { _description: 'Get third page of chambers', 'page[size]': 10, 'page[number]': 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of parliamentary chambers worldwide in JSON:API format',
                    properties: {
                        meta: { type: 'object', description: 'Pagination metadata', properties: { total: { type: 'number', description: 'Total number of chambers' }, row_count: { type: 'number', description: 'Number of chambers in current page' } } },
                        links: { type: 'object', description: 'Pagination navigation links' },
                        data: {
                            type: 'array',
                            description: 'Array of chamber objects with composition and election data',
                            items: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string', description: 'Resource type, always Chamber' },
                                    id: { type: 'string', description: 'Chamber identifier' },
                                    attributes: { type: 'object', description: 'Chamber attributes: name, type (lower/upper/unicameral), total seats, election system, term length, gender composition' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getElections: {
            method: 'GET',
            path: '/v1/reports/elections',
            description: 'Get election reports filtered by year, month, and parliamentary structure. Returns election results, voter turnout, and seat distribution. Use listChambers for chamber context and listCountries for country codes.',
            parameters: [
                { position: { key: 'year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(1900)', 'max(2030)'] }, description: 'Filter elections by year (1900-2030)' },
                { position: { key: 'month', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(1)', 'max(12)'] }, description: 'Filter elections by month (1-12)' },
                { position: { key: 'struct_parl_status', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(lower_chamber,upper_chamber,unicameral)', options: ['optional()'] }, description: 'Filter by chamber type: lower_chamber, upper_chamber, or unicameral' }
            ],
            tests: [
                { _description: 'Get all elections in 2024', year: 2024 },
                { _description: 'Get lower chamber elections in January 2025', year: 2025, month: 1, struct_parl_status: 'lower_chamber' },
                { _description: 'Get unicameral elections in 2023', year: 2023, struct_parl_status: 'unicameral' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Election report results filtered by the specified criteria',
                    properties: {
                        meta: { type: 'object', description: 'Response metadata including total count' },
                        data: {
                            type: 'array',
                            description: 'Array of election report objects with results and turnout data',
                            items: {
                                type: 'object',
                                properties: {
                                    country_code: { type: 'string', description: 'ISO 2-letter country code' },
                                    country_name: { type: 'string', description: 'Full country name' },
                                    election_code: { type: 'string', description: 'Unique election identifier code' },
                                    election_title: { type: 'string', description: 'Descriptive title of the election' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
