export const main = {
    namespace: 'openchargemap',
    name: 'OpenChargeMap',
    description: 'Global directory of 300K+ electric vehicle (EV) charging stations. Community-maintained, crowdsourced data with real-time availability, connector types, charging speeds, and operator information.',
    version: '4.0.0',
    docs: ['https://openchargemap.org/site/develop/api'],
    tags: ['ev', 'charging', 'transport', 'energy', 'geospatial', 'cacheTtlFrequent'],
    root: 'https://api.openchargemap.io/v3',
    requiredServerParams: ['OPENCHARGEMAP_API_KEY'],
    headers: {
        'X-API-Key': '{{OPENCHARGEMAP_API_KEY}}'
    },
    tools: {
        searchChargingStations: {
            method: 'GET',
            path: '/poi',
            description: 'Search EV charging stations by location, country, distance, operator, connector type, or power level. Returns station details with connectors, operator, address, and usage information.',
            parameters: [
                { position: { key: 'output', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'latitude', value: '{{LATITUDE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'longitude', value: '{{LONGITUDE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'distance', value: '{{DISTANCE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'distanceunit', value: '{{DISTANCE_UNIT}}', location: 'query' }, z: { primitive: 'enum(km,miles)', options: ['optional()', 'default(km)'] } },
                { position: { key: 'countrycode', value: '{{COUNTRY_CODE}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'maxresults', value: '{{MAX_RESULTS}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(500)'] } },
                { position: { key: 'compact', value: 'true', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Find charging stations near Berlin', LATITUDE: '52.52', LONGITUDE: '13.405', DISTANCE: '5', MAX_RESULTS: '5' },
                { _description: 'Find stations in Germany', COUNTRY_CODE: 'DE', MAX_RESULTS: '5' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            ID: { type: 'number' },
                            AddressInfo: { type: 'object' },
                            Connections: { type: 'array', items: { type: 'object' } },
                            OperatorInfo: { type: 'object' },
                            UsageType: { type: 'object' },
                            StatusType: { type: 'object' },
                            NumberOfPoints: { type: 'number' }
                        }
                    }
                }
            }
        },
        getStationById: {
            method: 'GET',
            path: '/poi',
            description: 'Get full details for a specific charging station by its OpenChargeMap ID. Returns complete station information including all connectors, operator, media, and user comments.',
            parameters: [
                { position: { key: 'output', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'chargepointid', value: '{{CHARGEPOINT_ID}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get a specific charging station', CHARGEPOINT_ID: '1' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            ID: { type: 'number' },
                            AddressInfo: { type: 'object' },
                            Connections: { type: 'array', items: { type: 'object' } },
                            OperatorInfo: { type: 'object' },
                            MediaItems: { type: 'array' },
                            UserComments: { type: 'array' }
                        }
                    }
                }
            }
        },
        getReferenceData: {
            method: 'GET',
            path: '/referencedata',
            description: 'Get reference data including all connector types, charging levels, operators, countries, status types, and usage types. Useful for populating filters and understanding data codes.',
            parameters: [],
            tests: [
                { _description: 'Get all reference data' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        ConnectionTypes: { type: 'array', items: { type: 'object' } },
                        ChargerTypes: { type: 'array', items: { type: 'object' } },
                        Countries: { type: 'array', items: { type: 'object' } },
                        Operators: { type: 'array', items: { type: 'object' } },
                        StatusTypes: { type: 'array', items: { type: 'object' } },
                        UsageTypes: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        },
        searchByBoundingBox: {
            method: 'GET',
            path: '/poi',
            description: 'Search charging stations within a geographic bounding box defined by top-left and bottom-right coordinates.',
            parameters: [
                { position: { key: 'output', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'boundingbox', value: '({{LAT_TOP}},{{LNG_LEFT}}),({{LAT_BOTTOM}},{{LNG_RIGHT}})', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'maxresults', value: '{{MAX_RESULTS}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(500)'] } },
                { position: { key: 'compact', value: 'true', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Find stations in Munich area', LAT_TOP: '48.25', LNG_LEFT: '11.4', LAT_BOTTOM: '48.05', LNG_RIGHT: '11.7', MAX_RESULTS: '5' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            ID: { type: 'number' },
                            AddressInfo: { type: 'object' },
                            Connections: { type: 'array', items: { type: 'object' } },
                            NumberOfPoints: { type: 'number' }
                        }
                    }
                }
            }
        }
    }
}
