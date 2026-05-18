export const main = {
    namespace: 'regionalstatistik',
    name: 'Regionalstatistik GENESIS',
    description: 'Access the German Regional Statistics Database (Regionaldatenbank Deutschland) via the GENESIS REST API — 160+ statistical indicators at Kreis, Gemeinde, and Bundesland level. Free registration required.',
    version: '4.0.0',
    docs: ['https://www.regionalstatistik.de/genesis/online?Menu=Webservice', 'https://www.regionalstatistik.de/genesisws/swagger-ui'],
    tags: ['germany', 'statistics', 'demographics', 'regional', 'opendata', 'census', 'cacheTtlDaily'],
    root: 'https://www.regionalstatistik.de',
    requiredServerParams: ['REGIONALSTATISTIK_USERNAME', 'REGIONALSTATISTIK_PASSWORD'],
    headers: {},
    tools: {
        searchStatistics: {
            method: 'POST',
            path: '/genesisws/rest/2020/catalogue/statistics',
            description: 'Search for available statistics by keyword or code pattern. Returns matching statistics with their codes, descriptions, and content information.',
            parameters: [
                { position: { key: 'username', value: '{{REGIONALSTATISTIK_USERNAME}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'password', value: '{{REGIONALSTATISTIK_PASSWORD}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'selection', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'searchcriterion', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(code,content)', options: ['optional()', 'default(code)'] } },
                { position: { key: 'sortcriterion', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(code,content)', options: ['optional()', 'default(code)'] } },
                { position: { key: 'pagelength', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'language', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(de,en)', options: ['optional()', 'default(de)'] } }
            ],
            tests: [
                { _description: 'Search population statistics', selection: '12*', pagelength: 5, language: 'en' },
                { _description: 'Search by content keyword', selection: 'Bevoelkerung*', searchcriterion: 'content', pagelength: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Ident: { type: 'object', properties: { Service: { type: 'string' }, Method: { type: 'string' } } },
                        Status: { type: 'object', properties: { Code: { type: 'number' }, Content: { type: 'string' }, Type: { type: 'string' } } },
                        List: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    Code: { type: 'string', description: 'Statistics code (e.g. 12411)' },
                                    Content: { type: 'string', description: 'Statistics description' },
                                    Information: { type: 'string', description: 'Additional information' }
                                }
                            }
                        },
                        Copyright: { type: 'string' }
                    }
                }
            }
        },
        searchTables: {
            method: 'POST',
            path: '/genesisws/rest/2020/catalogue/tables',
            description: 'Search for available data tables by code pattern or keyword. Tables contain the actual statistical data organized by region and time.',
            parameters: [
                { position: { key: 'username', value: '{{REGIONALSTATISTIK_USERNAME}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'password', value: '{{REGIONALSTATISTIK_PASSWORD}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'selection', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'area', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(all,public,user)', options: ['optional()', 'default(all)'] } },
                { position: { key: 'searchcriterion', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(code,content)', options: ['optional()', 'default(code)'] } },
                { position: { key: 'sortcriterion', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(code,content)', options: ['optional()', 'default(code)'] } },
                { position: { key: 'pagelength', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'language', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(de,en)', options: ['optional()', 'default(de)'] } }
            ],
            tests: [
                { _description: 'Search population tables', selection: '12411*', pagelength: 5, language: 'en' },
                { _description: 'Search all public tables about Arbeitsmarkt', selection: 'Arbeitsmarkt*', searchcriterion: 'content', area: 'public', pagelength: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Ident: { type: 'object', properties: { Service: { type: 'string' }, Method: { type: 'string' } } },
                        Status: { type: 'object', properties: { Code: { type: 'number' }, Content: { type: 'string' }, Type: { type: 'string' } } },
                        List: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    Code: { type: 'string', description: 'Table code (e.g. 12411-01-01-4)' },
                                    Content: { type: 'string', description: 'Table description' },
                                    Time: { type: 'string', description: 'Available time range' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getTableData: {
            method: 'POST',
            path: '/genesisws/rest/2020/data/table',
            description: 'Retrieve actual data from a specific table. Supports filtering by region (AGS codes), time range, and content variables. Returns structured statistical data.',
            parameters: [
                { position: { key: 'username', value: '{{REGIONALSTATISTIK_USERNAME}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'password', value: '{{REGIONALSTATISTIK_PASSWORD}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'area', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(all,public,user)', options: ['optional()', 'default(all)'] } },
                { position: { key: 'startyear', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endyear', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'regionalvariable', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'regionalkey', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'format', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(ffcsv,csv,xlsx,html)', options: ['optional()', 'default(ffcsv)'] } },
                { position: { key: 'language', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(de,en)', options: ['optional()', 'default(de)'] } }
            ],
            tests: [
                { _description: 'Get population table for all regions 2022', name: '12411-01-01-4', startyear: '2022', endyear: '2022', language: 'en' },
                { _description: 'Get population data for Berlin (AGS 11)', name: '12411-01-01-4', regionalkey: '11*', startyear: '2020', endyear: '2022' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Ident: { type: 'object', properties: { Service: { type: 'string' }, Method: { type: 'string' } } },
                        Status: { type: 'object', properties: { Code: { type: 'number' }, Content: { type: 'string' }, Type: { type: 'string' } } },
                        Object: {
                            type: 'object',
                            properties: {
                                Content: { type: 'string', description: 'CSV or structured table data' },
                                Structure: { type: 'object', description: 'Table structure metadata' }
                            }
                        },
                        Copyright: { type: 'string' }
                    }
                }
            }
        },
        searchVariables: {
            method: 'POST',
            path: '/genesisws/rest/2020/catalogue/variables',
            description: 'Search for available variables (dimensions) used in statistics. Variables define regional keys, time periods, and classification criteria.',
            parameters: [
                { position: { key: 'username', value: '{{REGIONALSTATISTIK_USERNAME}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'password', value: '{{REGIONALSTATISTIK_PASSWORD}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'selection', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'area', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(all,public,user)', options: ['optional()', 'default(all)'] } },
                { position: { key: 'searchcriterion', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(code,content)', options: ['optional()', 'default(code)'] } },
                { position: { key: 'sortcriterion', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(code,content)', options: ['optional()', 'default(code)'] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(all,classificatory,identifying,temporal,spatial,value)', options: ['optional()', 'default(all)'] } },
                { position: { key: 'pagelength', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'language', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(de,en)', options: ['optional()', 'default(de)'] } }
            ],
            tests: [
                { _description: 'Search regional variables', selection: 'GEMEIN*', pagelength: 5, language: 'en' },
                { _description: 'Search all spatial variables', selection: '*', type: 'spatial', pagelength: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Ident: { type: 'object', properties: { Service: { type: 'string' }, Method: { type: 'string' } } },
                        Status: { type: 'object', properties: { Code: { type: 'number' }, Content: { type: 'string' }, Type: { type: 'string' } } },
                        List: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    Code: { type: 'string', description: 'Variable code' },
                                    Content: { type: 'string', description: 'Variable description' },
                                    Type: { type: 'string', description: 'Variable type (classificatory, spatial, etc.)' },
                                    Information: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        findAll: {
            method: 'POST',
            path: '/genesisws/rest/2020/find/find',
            description: 'Full-text search across all objects in the database — statistics, tables, variables, and values. Returns categorized results.',
            parameters: [
                { position: { key: 'username', value: '{{REGIONALSTATISTIK_USERNAME}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'password', value: '{{REGIONALSTATISTIK_PASSWORD}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'term', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'pagelength', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'language', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(de,en)', options: ['optional()', 'default(de)'] } }
            ],
            tests: [
                { _description: 'Search for population data', term: 'Bevoelkerung', pagelength: 10, language: 'de' },
                { _description: 'Search for unemployment data', term: 'Arbeitslose', pagelength: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Ident: { type: 'object', properties: { Service: { type: 'string' }, Method: { type: 'string' } } },
                        Status: { type: 'object', properties: { Code: { type: 'number' }, Content: { type: 'string' }, Type: { type: 'string' } } },
                        Statistics: { type: 'object', description: 'Matching statistics' },
                        Tables: { type: 'object', description: 'Matching tables' },
                        Variables: { type: 'object', description: 'Matching variables' },
                        Copyright: { type: 'string' }
                    }
                }
            }
        },
        getQualitySigns: {
            method: 'GET',
            path: '/genesisws/rest/2020/catalogue/qualitysigns',
            description: 'Retrieve the list of quality signs used in the database. These signs indicate data quality, suppression, and estimation status (e.g. provisional, estimated, suppressed).',
            parameters: [
                { position: { key: 'language', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(de,en)', options: ['optional()', 'default(de)'] } }
            ],
            tests: [
                { _description: 'Get quality signs in English', language: 'en' },
                { _description: 'Get quality signs in German', language: 'de' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Ident: { type: 'object', properties: { Service: { type: 'string' }, Method: { type: 'string' } } },
                        Status: { type: 'object', properties: { Code: { type: 'number' }, Content: { type: 'string' }, Type: { type: 'string' } } },
                        List: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    Code: { type: 'string', description: 'Quality sign symbol (e.g. -, ..., /, p, r, s)' },
                                    Content: { type: 'string', description: 'Explanation of the quality sign' }
                                }
                            }
                        },
                        Copyright: { type: 'string' }
                    }
                }
            }
        }
    }
}
