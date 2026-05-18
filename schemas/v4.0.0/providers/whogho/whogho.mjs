export const main = {
    namespace: 'whogho',
    name: 'WHO Global Health Observatory',
    description: 'Access WHO Global Health Observatory data — query health indicators, country statistics, and dimension values via the GHO OData API.',
    version: '4.0.0',
    docs: ['https://www.who.int/data/gho/info/gho-odata-api'],
    tags: ['health', 'who', 'statistics', 'global', 'indicators', 'cacheTtlDaily'],
    root: 'https://ghoapi.azureedge.net/api',
    requiredServerParams: [],
    headers: {},
    tools: {
        getIndicators: {
            method: 'GET',
            path: '/Indicator',
            description: 'List all available health indicators in the Global Health Observatory with their codes and names.. Use IDs from results in getIndicatorData',
            parameters: [
                { position: { key: '$filter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: '$top', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: '$skip', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'List first 10 health indicators', '$top': 10 },
                { _description: 'List indicators with skip for pagination', '$top': 10, '$skip': 50 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        value: {
                            type: 'array',
                            description: 'Array of indicator objects with IndicatorCode and IndicatorName'
                        }
                    }
                }
            }
        },
        getIndicatorData: {
            method: 'GET',
            path: '/:indicatorCode',
            description: 'Retrieve observation data for a specific health indicator, optionally filtered by country, year, or other dimensions.. Use getIndicators first to find valid IDs',
            parameters: [
                { position: { key: 'indicatorCode', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: '$filter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: '$select', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: '$orderby', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: '$top', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: '$skip', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get life expectancy data', indicatorCode: 'WHOSIS_000001', '$top': 10 },
                { _description: 'Get HIV incidence data filtered by country', indicatorCode: 'HIV_0000000001', '$filter': "SpatialDim eq 'DEU'", '$top': 5 },
                { _description: 'Get maternal mortality data for a specific year', indicatorCode: 'MDG_0000000026', '$filter': "TimeDim eq 2020", '$top': 20 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        value: {
                            type: 'array',
                            description: 'Array of data observations with SpatialDim, TimeDim, Value, and dimension codes'
                        }
                    }
                }
            }
        },
        getDimensions: {
            method: 'GET',
            path: '/DIMENSION',
            description: 'List all available dimension types used to categorize health data (e.g., country, sex, age group).. Use IDs from results in getDimensionValues',
            parameters: [
                { position: { key: '$top', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'List all available dimensions' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        value: {
                            type: 'array',
                            description: 'Array of dimension objects with Code and Title'
                        }
                    }
                }
            }
        },
        getDimensionValues: {
            method: 'GET',
            path: '/DIMENSION/:dimensionCode',
            description: 'List all values for a specific dimension type (e.g., all countries for the COUNTRY dimension).',
            parameters: [
                { position: { key: 'dimensionCode', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: '$filter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: '$top', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'List all countries in the COUNTRY dimension', dimensionCode: 'COUNTRY', '$top': 10 },
                { _description: 'List all regions', dimensionCode: 'REGION', '$top': 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        value: {
                            type: 'array',
                            description: 'Array of dimension value objects with Code and Title'
                        }
                    }
                }
            }
        },
        getCountries: {
            method: 'GET',
            path: '/DIMENSION/COUNTRY',
            description: 'List all countries available in the WHO Global Health Observatory.',
            parameters: [
                { position: { key: '$filter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: '$top', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: '$skip', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'List first 20 countries', '$top': 20 },
                { _description: 'Search for a specific country', '$filter': "Title eq 'Germany'" }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        value: {
                            type: 'array',
                            description: 'Array of country objects with Code (ISO3) and Title'
                        }
                    }
                }
            }
        }
    }
}
