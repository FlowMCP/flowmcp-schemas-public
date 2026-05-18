export const main = {
    namespace: 'opensensemap',
    name: 'openSenseMap',
    description: 'Community-driven sensor network with 16K+ stations worldwide measuring air quality, temperature, humidity, UV, noise, and more. Open data platform by re:edu and University of Muenster.',
    version: '4.0.0',
    docs: ['https://docs.opensensemap.org/', 'https://api.opensensemap.org/'],
    tags: ['environment', 'sensors', 'iot', 'air-quality', 'opendata', 'cacheTtlFrequent'],
    root: 'https://api.opensensemap.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        listBoxes: {
            method: 'GET',
            path: '/boxes',
            description: 'List senseBox stations with optional filters by phenomenon, exposure type, geographic bounding box, or date. Returns station metadata and last measurement timestamps.',
            parameters: [
                { position: { key: 'limit', value: '{{LIMIT}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(100)'] } },
                { position: { key: 'phenomenon', value: '{{PHENOMENON}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'exposure', value: '{{EXPOSURE}}', location: 'query' }, z: { primitive: 'enum(indoor,outdoor,mobile,unknown)', options: ['optional()'] } },
                { position: { key: 'bbox', value: '{{BBOX}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'minimal', value: 'true', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'List 5 outdoor stations', LIMIT: '5', EXPOSURE: 'outdoor' },
                { _description: 'List stations measuring temperature', LIMIT: '5', PHENOMENON: 'temperature' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            name: { type: 'string' },
                            exposure: { type: 'string' },
                            currentLocation: { type: 'object' },
                            lastMeasurementAt: { type: 'string' }
                        }
                    }
                }
            }
        },
        getBox: {
            method: 'GET',
            path: '/boxes/:senseBoxId',
            description: 'Get full details of a single senseBox station including all sensors, last measurements, location, model, and metadata.',
            parameters: [
                { position: { key: 'senseBoxId', value: '{{SENSEBOX_ID}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get LeKa Berlin station', SENSEBOX_ID: '5391be52a8341554157792e6' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        sensors: { type: 'array', items: { type: 'object' } },
                        currentLocation: { type: 'object' },
                        exposure: { type: 'string' },
                        model: { type: 'string' },
                        lastMeasurementAt: { type: 'string' }
                    }
                }
            }
        },
        getSensorData: {
            method: 'GET',
            path: '/boxes/:senseBoxId/data/:sensorId',
            description: 'Get measurement time series for a specific sensor on a senseBox. Returns timestamped values with optional date filtering.',
            parameters: [
                { position: { key: 'senseBoxId', value: '{{SENSEBOX_ID}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'sensorId', value: '{{SENSOR_ID}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'from-date', value: '{{FROM_DATE}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'to-date', value: '{{TO_DATE}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get brightness data from LeKa Berlin', SENSEBOX_ID: '5391be52a8341554157792e6', SENSOR_ID: '5391be52a8341554157792e7' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            value: { type: 'string' },
                            createdAt: { type: 'string' }
                        }
                    }
                }
            }
        },
        getStats: {
            method: 'GET',
            path: '/stats',
            description: 'Get global statistics for the openSenseMap network: total number of senseBoxes, total measurements, and active stations.',
            parameters: [],
            tests: [
                { _description: 'Get network statistics' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: { type: 'number' }
                }
            }
        },
        searchBoxesByLocation: {
            method: 'GET',
            path: '/boxes',
            description: 'Search senseBox stations within a geographic bounding box. Provide southwest and northeast corners as comma-separated coordinates (lon_sw,lat_sw,lon_ne,lat_ne).',
            parameters: [
                { position: { key: 'bbox', value: '{{BBOX}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{LIMIT}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(100)'] } },
                { position: { key: 'minimal', value: 'true', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Find stations in Berlin area', BBOX: '13.1,52.3,13.6,52.7', LIMIT: '5' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            name: { type: 'string' },
                            exposure: { type: 'string' },
                            currentLocation: { type: 'object' }
                        }
                    }
                }
            }
        }
    }
}
