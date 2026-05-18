export const main = {
    namespace: 'bfsodl',
    name: 'BfsOdl',
    description: 'Access ambient gamma dose rate data from the German Federal Office for Radiation Protection (BfS) — 1,700 stations measuring radiation across Germany every 10 minutes.',
    version: '4.0.0',
    docs: ['https://odlinfo.bfs.de/ODL/EN/service/data-interface/data-interface_node.html', 'https://strahlenschutz.api.bund.dev/'],
    tags: ['germany', 'radiation', 'monitoring', 'environment', 'science', 'cacheTtlRealtime'],
    root: 'https://www.imis.bfs.de',
    requiredServerParams: [],
    headers: {},
    tools: {
        getLatestMeasurements: {
            method: 'GET',
            path: '/ogc/opendata/ows',
            description: 'Get the latest 1-hour gamma dose rate readings from all ~1,700 BfS radiation monitoring stations across Germany in GeoJSON format.',
            parameters: [
                { position: { key: 'service', value: 'WFS', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'version', value: '1.1.0', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'request', value: 'GetFeature', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'typeName', value: 'opendata:odlinfo_odl_1h_latest', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'outputFormat', value: 'application/json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'maxFeatures', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)', 'min(1)', 'max(2000)'] } },
                { position: { key: 'startIndex', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Get latest radiation readings from first 50 stations', maxFeatures: 50 },
                { _description: 'Get latest radiation readings from next 50 stations', maxFeatures: 50, startIndex: 50 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string', description: 'GeoJSON type: FeatureCollection' },
                        features: {
                            type: 'array',
                            description: 'Array of measurement station features',
                            items: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string', description: 'Feature' },
                                    geometry: { type: 'object', description: 'Station coordinates (longitude, latitude)' },
                                    properties: {
                                        type: 'object',
                                        description: 'Measurement data',
                                        properties: {
                                            kenn: { type: 'string', description: 'Station 9-digit identifier' },
                                            plz: { type: 'string', description: 'Postal code of station location' },
                                            name: { type: 'string', description: 'Station location name' },
                                            value: { type: 'number', description: 'Gamma dose rate in microsievert per hour (µSv/h)' },
                                            end_measure: { type: 'string', description: 'Measurement end timestamp' },
                                            site_status: { type: 'number', description: 'Operational status code' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        getStationTimeSeries: {
            method: 'GET',
            path: '/ogc/opendata/ows',
            description: 'Get hourly time series of gamma dose rate measurements for a specific BfS monitoring station by its 9-digit station ID.',
            parameters: [
                { position: { key: 'service', value: 'WFS', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'version', value: '1.1.0', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'request', value: 'GetFeature', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'typeName', value: 'opendata:odlinfo_timeseries_odl_1h', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'outputFormat', value: 'application/json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'viewparams', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'sortBy', value: 'end_measure', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'maxFeatures', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(168)', 'min(1)', 'max(1000)'] } }
            ],
            tests: [
                { _description: 'Get hourly time series for a station near Berlin (last 7 days)', viewparams: 'kenn:031020004', maxFeatures: 168 },
                { _description: 'Get hourly measurements for a Munich station', viewparams: 'kenn:091620003', maxFeatures: 48 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string', description: 'GeoJSON FeatureCollection' },
                        features: {
                            type: 'array',
                            description: 'Time series of dose rate measurements for the station',
                            items: {
                                type: 'object',
                                properties: {
                                    properties: {
                                        type: 'object',
                                        properties: {
                                            kenn: { type: 'string', description: 'Station identifier' },
                                            value: { type: 'number', description: 'Dose rate µSv/h' },
                                            end_measure: { type: 'string', description: 'Measurement timestamp' },
                                            site_status: { type: 'number', description: 'Status code' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        getDailyTimeSeries: {
            method: 'GET',
            path: '/ogc/opendata/ows',
            description: 'Get daily averaged gamma dose rate time series for a specific BfS monitoring station.',
            parameters: [
                { position: { key: 'service', value: 'WFS', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'version', value: '1.1.0', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'request', value: 'GetFeature', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'typeName', value: 'opendata:odlinfo_timeseries_odl_24h', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'outputFormat', value: 'application/json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'viewparams', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'sortBy', value: 'end_measure', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'maxFeatures', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(30)', 'min(1)', 'max(365)'] } }
            ],
            tests: [
                { _description: 'Get last 30 daily readings for a station near Hamburg', viewparams: 'kenn:020000001', maxFeatures: 30 },
                { _description: 'Get last 7 daily averages for a station in Cologne', viewparams: 'kenn:053150004', maxFeatures: 7 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string', description: 'GeoJSON FeatureCollection' },
                        features: {
                            type: 'array',
                            description: 'Daily averaged dose rate time series',
                            items: {
                                type: 'object',
                                properties: {
                                    properties: {
                                        type: 'object',
                                        properties: {
                                            kenn: { type: 'string', description: 'Station identifier' },
                                            value: { type: 'number', description: 'Daily averaged dose rate µSv/h' },
                                            end_measure: { type: 'string', description: 'Day end timestamp' }
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
}
