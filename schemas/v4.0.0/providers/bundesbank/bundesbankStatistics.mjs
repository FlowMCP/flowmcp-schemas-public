export const main = {
    namespace: 'bundesbank',
    name: 'BundesbankStatistics',
    description: 'Query Deutsche Bundesbank time series data via SDMX REST API — exchange rates, monetary statistics, financial market data, and macroeconomic indicators.',
    version: '4.0.0',
    docs: ['https://www.bundesbank.de/en/statistics/time-series-databases/help-for-sdmx-web-service'],
    tags: ['economics', 'finance', 'statistics', 'germany', 'central-bank', 'cacheTtlDaily'],
    root: 'https://api.statistiken.bundesbank.de',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        getTimeSeries: {
            method: 'GET',
            path: '/rest/data/:flowRef/:key',
            description: 'Retrieve specific time series data from a Bundesbank dataflow using dimensional keys. Returns observations in JSON format.',
            parameters: [
                { position: { key: 'flowRef', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'key', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'startPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'detail', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(full,dataonly,serieskeyonly,nodata)', options: ['optional()', 'default(dataonly)'] } },
                { position: { key: 'lastNObservations', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(1)'] } }
            ],
            tests: [
                { _description: 'Get daily USD/EUR exchange rate for 2024', flowRef: 'BBEX3', key: 'D.USD.EUR.BB.AC.000', startPeriod: '2024-01-01', endPeriod: '2024-12-31', detail: 'dataonly' },
                { _description: 'Get last 10 observations of monthly GBP/EUR rate', flowRef: 'BBEX3', key: 'M.GBP.EUR.BB.AC.A01', lastNObservations: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        header: { type: 'object', description: 'Response metadata including id, test flag, prepared timestamp, sender' },
                        dataSets: {
                            type: 'array',
                            description: 'Array of data sets containing series and observations',
                            items: { type: 'object' }
                        },
                        structure: { type: 'object', description: 'Structural metadata describing dimensions and attributes' }
                    }
                }
            }
        },
        getDataflow: {
            method: 'GET',
            path: '/rest/data/:flowRef',
            description: 'Retrieve all time series from a specified dataflow. Use with lastNObservations to limit response size.',
            parameters: [
                { position: { key: 'flowRef', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'startPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endPeriod', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'detail', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(full,dataonly,serieskeyonly,nodata)', options: ['optional()', 'default(serieskeyonly)'] } },
                { position: { key: 'lastNObservations', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(1)'] } }
            ],
            tests: [
                { _description: 'List all series keys in exchange rate dataflow', flowRef: 'BBEX3', detail: 'serieskeyonly' },
                { _description: 'Get last observation of German banking statistics', flowRef: 'BBK01', detail: 'dataonly', lastNObservations: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        header: { type: 'object' },
                        dataSets: { type: 'array', items: { type: 'object' } },
                        structure: { type: 'object' }
                    }
                }
            }
        },
        listDataflows: {
            method: 'GET',
            path: '/rest/metadata/dataflow/BBK',
            description: 'List all available Bundesbank dataflows (datasets). Returns metadata about all published statistical datasets.',
            parameters: [],
            tests: [
                { _description: 'List all available Bundesbank dataflows' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Dataflow: {
                            type: 'array',
                            description: 'Array of available dataflows with id, name, and version',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', description: 'Dataflow identifier (e.g. BBEX3, BBK01)' },
                                    name: { type: 'string', description: 'Human-readable name of the dataflow' },
                                    version: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getDataStructure: {
            method: 'GET',
            path: '/rest/metadata/datastructure/BBK/:resourceId',
            description: 'Get the data structure definition for a specific dataflow. Shows available dimensions, attributes, and their allowed values.',
            parameters: [
                { position: { key: 'resourceId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get structure of exchange rate dataflow', resourceId: 'BBK_ERX' },
                { _description: 'Get structure of banking statistics', resourceId: 'BBK_QFS' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        DataStructure: {
                            type: 'object',
                            description: 'Data structure definition with dimensions and measures'
                        }
                    }
                }
            }
        },
        getCodelist: {
            method: 'GET',
            path: '/rest/metadata/codelist/BBK/:resourceId',
            description: 'Get a specific code list used in Bundesbank data structures. Shows allowed values for a dimension (e.g. currency codes, frequency codes).',
            parameters: [
                { position: { key: 'resourceId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get currency code list for exchange rates', resourceId: 'CL_BBK_ERX_CURRENCY' },
                { _description: 'Get rate type code list', resourceId: 'CL_BBK_ERX_RATE_TYPE' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Codelist: {
                            type: 'object',
                            description: 'Code list with id, name, and array of codes'
                        }
                    }
                }
            }
        }
    }
}
