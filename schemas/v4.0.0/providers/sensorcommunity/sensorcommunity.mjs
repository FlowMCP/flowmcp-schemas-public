export const main = {
    namespace: 'sensorcommunity',
    name: 'Sensor.Community',
    description: 'Access citizen-science air quality and environmental sensor data from the Sensor.Community network (formerly Luftdaten.info). Query hyperlocal PM2.5, PM10, temperature, and humidity readings from thousands of DIY sensors worldwide.',
    version: '4.0.0',
    docs: ['https://github.com/opendata-stuttgart/meta/wiki/APIs'],
    tags: ['environment', 'airquality', 'sensors', 'opendata', 'citizenscience', 'cacheTtlFrequent'],
    root: 'https://data.sensor.community',
    requiredServerParams: [],
    headers: {},
    tools: {
        getSensorData: {
            method: 'GET',
            path: '/airrohr/v1/sensor/:sensorId',
            description: 'Get the most recent measurements (last 5 minutes) from a specific sensor by its API ID. Returns PM2.5, PM10, temperature, humidity, or pressure depending on sensor type.',
            parameters: [
                { position: { key: 'sensorId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get data from sensor 83377 (Berlin)', sensorId: 83377 },
                { _description: 'Get data from sensor 71906', sensorId: 71906 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            sensor: { type: 'object', properties: { id: { type: 'number' }, sensor_type: { type: 'object' }, pin: { type: 'string' } } },
                            sensordatavalues: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, value: { type: 'string' }, value_type: { type: 'string' } } } },
                            location: { type: 'object', properties: { id: { type: 'number' }, latitude: { type: 'string' }, longitude: { type: 'string' }, country: { type: 'string' } } },
                            timestamp: { type: 'string' }
                        }
                    }
                }
            },
        },
        filterByType: {
            method: 'GET',
            path: '/airrohr/v1/filter/type=:sensorType',
            description: 'Get all sensor readings from the last 5 minutes filtered by sensor type. Common types: SDS011 (PM), BME280 (temp/humidity/pressure), DHT22 (temp/humidity).',
            parameters: [
                { position: { key: 'sensorType', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(SDS011,BME280,DHT22,SPS30,PMS5003,PMS7003,HPM,SEN5X)', options: [] } }
            ],
            tests: [
                { _description: 'Get all BME280 temperature sensor readings', sensorType: 'BME280' },
                { _description: 'Get all SDS011 particulate matter readings', sensorType: 'SDS011' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            sensor: { type: 'object' },
                            sensordatavalues: { type: 'array' },
                            location: { type: 'object' },
                            timestamp: { type: 'string' }
                        }
                    }
                }
            },
        },
        filterByArea: {
            method: 'GET',
            path: '/airrohr/v1/filter/area=:lat,:lon,:distance',
            description: 'Get all sensor readings from the last 5 minutes within a circular area. Specify center coordinates (lat/lon) and radius in km.',
            parameters: [
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'distance', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get sensors within 5km of Berlin center', lat: 52.52, lon: 13.405, distance: 5 },
                { _description: 'Get sensors within 10km of Munich', lat: 48.137, lon: 11.576, distance: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            sensor: { type: 'object' },
                            sensordatavalues: { type: 'array' },
                            location: { type: 'object' },
                            timestamp: { type: 'string' }
                        }
                    }
                }
            },
        },
        filterByCountry: {
            method: 'GET',
            path: '/airrohr/v1/filter/country=:countryCode',
            description: 'Get all sensor readings from the last 5 minutes for a specific country. Use ISO 3166-1 alpha-2 country codes (DE, FR, US, etc.).',
            parameters: [
                { position: { key: 'countryCode', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get all sensors in Germany', countryCode: 'DE' },
                { _description: 'Get all sensors in Bulgaria', countryCode: 'BG' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            sensor: { type: 'object' },
                            sensordatavalues: { type: 'array' },
                            location: { type: 'object' },
                            timestamp: { type: 'string' }
                        }
                    }
                }
            },
        },
        filterByBox: {
            method: 'GET',
            path: '/airrohr/v1/filter/box=:lat1,:lon1,:lat2,:lon2',
            description: 'Get all sensor readings from the last 5 minutes within a rectangular bounding box defined by two corner coordinates.',
            parameters: [
                { position: { key: 'lat1', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lon1', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lat2', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lon2', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get sensors in central Berlin bounding box', lat1: 52.49, lon1: 13.35, lat2: 52.55, lon2: 13.45 },
                { _description: 'Get sensors in Hamburg area', lat1: 53.45, lon1: 9.85, lat2: 53.65, lon2: 10.15 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            sensor: { type: 'object' },
                            sensordatavalues: { type: 'array' },
                            location: { type: 'object' },
                            timestamp: { type: 'string' }
                        }
                    }
                }
            },
        },
        averageFiveMinutes: {
            method: 'GET',
            path: '/static/v2/data.json',
            description: 'Get averaged measurements per sensor for the last 5 minutes across all sensors worldwide. Large response with all active sensors.',
            parameters: [],
            tests: [
                { _description: 'Get 5-minute averaged data for all sensors' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            sensor: { type: 'object' },
                            sensordatavalues: { type: 'array' },
                            location: { type: 'object' },
                            timestamp: { type: 'string' }
                        }
                    }
                }
            },
        },
        averageOneHour: {
            method: 'GET',
            path: '/static/v2/data.1h.json',
            description: 'Get averaged measurements per sensor for the last hour across all sensors worldwide. Large response with all active sensors.',
            parameters: [],
            tests: [
                { _description: 'Get 1-hour averaged data for all sensors' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            sensor: { type: 'object' },
                            sensordatavalues: { type: 'array' },
                            location: { type: 'object' },
                            timestamp: { type: 'string' }
                        }
                    }
                }
            },
        },
        dustSensorsOnly: {
            method: 'GET',
            path: '/static/v2/data.dust.min.json',
            description: 'Get minimal averaged data for dust/particulate matter sensors only (PM2.5, PM10). Smaller response than the full data endpoints.',
            parameters: [],
            tests: [
                { _description: 'Get dust sensor data (PM2.5/PM10 only)' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            sensor: { type: 'object' },
                            sensordatavalues: { type: 'array' },
                            location: { type: 'object' },
                            timestamp: { type: 'string' }
                        }
                    }
                }
            },
        }
    }
}
