export const main = {
    namespace: 'aqicn',
    name: 'AQICN World Air Quality Index',
    description: 'Real-time air quality data from 10,000+ monitoring stations worldwide. Provides AQI values, PM2.5, PM10, O3, NO2, SO2, CO concentrations, and health recommendations.',
    version: '4.0.0',
    docs: ['https://aqicn.org/json-api/doc/'],
    tags: ['environment', 'air-quality', 'health', 'pollution', 'cacheTtlFrequent'],
    root: 'https://api.waqi.info',
    requiredServerParams: ['AQICN_API_TOKEN'],
    headers: {},
    tools: {
        getCityAqi: {
            method: 'GET',
            path: '/feed/:city/',
            description: 'Get real-time air quality index (AQI) for a city by name. Returns AQI value, dominant pollutant, individual pollutant concentrations (PM2.5, PM10, O3, NO2, SO2, CO), and weather data.',
            parameters: [
                { position: { key: 'city', value: '{{CITY}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'City name to query AQI for (e.g. beijing, london, paris)' },
                { position: { key: 'token', value: '{{AQICN_API_TOKEN}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'AQICN API token for authentication (injected via server params)' }
            ],
            tests: [
                { _description: 'Get AQI for Beijing', CITY: 'beijing' },
                { _description: 'Get AQI for London', CITY: 'london' },
                { _description: 'Get AQI for Paris', CITY: 'paris' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status (ok or error)' },
                        data: {
                            type: 'object',
                            properties: {
                                aqi: { type: 'number', description: 'Air Quality Index value' },
                                idx: { type: 'number', description: 'Unique station index' },
                                city: { type: 'object', description: 'City information including name, geo coordinates, and URL' },
                                dominentpol: { type: 'string', description: 'Dominant pollutant (e.g. pm25, pm10, o3)' },
                                iaqi: { type: 'object', description: 'Individual Air Quality Index per pollutant (pm25, pm10, o3, no2, so2, co)' },
                                time: { type: 'object', description: 'Measurement timestamp with stime, tz, and vtime' },
                                forecast: { type: 'object', description: 'Daily forecast for pollutants and weather' },
                                attributions: { type: 'array', items: { type: 'object' }, description: 'Data source attributions with name and URL' }
                            }
                        },
                        message: { type: 'string', description: 'Error message when status is error' }
                    }
                }
            }
        },
        getGeoAqi: {
            method: 'GET',
            path: '/feed/geo::latitude;:longitude/',
            description: 'Get real-time AQI for a geographic coordinate. Returns the nearest monitoring station data with full pollutant breakdown.',
            parameters: [
                { position: { key: 'latitude', value: '{{LATITUDE}}', location: 'insert' }, z: { primitive: 'number()', options: [] }, description: 'Latitude coordinate (e.g. 52.52 for Berlin)' },
                { position: { key: 'longitude', value: '{{LONGITUDE}}', location: 'insert' }, z: { primitive: 'number()', options: [] }, description: 'Longitude coordinate (e.g. 13.405 for Berlin)' },
                { position: { key: 'token', value: '{{AQICN_API_TOKEN}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'AQICN API token for authentication (injected via server params)' }
            ],
            tests: [
                { _description: 'Get AQI for Berlin coordinates', LATITUDE: '52.52', LONGITUDE: '13.405' },
                { _description: 'Get AQI for New York coordinates', LATITUDE: '40.71', LONGITUDE: '-74.01' },
                { _description: 'Get AQI for Tokyo coordinates', LATITUDE: '35.68', LONGITUDE: '139.69' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status (ok or error)' },
                        data: {
                            type: 'object',
                            properties: {
                                aqi: { type: 'number', description: 'Air Quality Index value' },
                                idx: { type: 'number', description: 'Unique station index' },
                                city: { type: 'object', description: 'City information including name, geo coordinates, and URL' },
                                dominentpol: { type: 'string', description: 'Dominant pollutant (e.g. pm25, pm10, o3)' },
                                iaqi: { type: 'object', description: 'Individual Air Quality Index per pollutant (pm25, pm10, o3, no2, so2, co)' },
                                time: { type: 'object', description: 'Measurement timestamp with stime, tz, and vtime' },
                                forecast: { type: 'object', description: 'Daily forecast for pollutants and weather' },
                                attributions: { type: 'array', items: { type: 'object' }, description: 'Data source attributions with name and URL' }
                            }
                        }
                    }
                }
            }
        },
        searchStations: {
            method: 'GET',
            path: '/search/',
            description: 'Search for air quality monitoring stations by keyword. Returns a list of matching stations with their current AQI and location.',
            parameters: [
                { position: { key: 'keyword', value: '{{KEYWORD}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Search keyword for station name or city (e.g. munich, tokyo)' },
                { position: { key: 'token', value: '{{AQICN_API_TOKEN}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'AQICN API token for authentication (injected via server params)' }
            ],
            tests: [
                { _description: 'Search for Munich stations', KEYWORD: 'munich' },
                { _description: 'Search for Tokyo stations', KEYWORD: 'tokyo' },
                { _description: 'Search for Shanghai stations', KEYWORD: 'shanghai' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status (ok or error)' },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    uid: { type: 'number', description: 'Unique station identifier' },
                                    aqi: { type: 'string', description: 'Current AQI value as string' },
                                    station: { type: 'object', description: 'Station details including name, geo coordinates, and country' },
                                    time: { type: 'object', description: 'Measurement timestamp with stime, tz, and vtime' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getStationById: {
            method: 'GET',
            path: '/feed/@:stationId/',
            description: 'Get real-time AQI data for a specific monitoring station by its unique station ID.',
            parameters: [
                { position: { key: 'stationId', value: '{{STATION_ID}}', location: 'insert' }, z: { primitive: 'number()', options: [] }, description: 'Unique numeric station identifier (e.g. 1437 for Shanghai)' },
                { position: { key: 'token', value: '{{AQICN_API_TOKEN}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'AQICN API token for authentication (injected via server params)' }
            ],
            tests: [
                { _description: 'Get Shanghai station data', STATION_ID: '1437' },
                { _description: 'Get Beijing Dongsi station data', STATION_ID: '1451' },
                { _description: 'Get London Marylebone station data', STATION_ID: '5724' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status (ok or error)' },
                        data: {
                            type: 'object',
                            properties: {
                                aqi: { type: 'number', description: 'Air Quality Index value' },
                                idx: { type: 'number', description: 'Unique station index' },
                                city: { type: 'object', description: 'City information including name, geo coordinates, and URL' },
                                dominentpol: { type: 'string', description: 'Dominant pollutant (e.g. pm25, pm10, o3)' },
                                iaqi: { type: 'object', description: 'Individual Air Quality Index per pollutant (pm25, pm10, o3, no2, so2, co)' },
                                time: { type: 'object', description: 'Measurement timestamp with stime, tz, and vtime' },
                                forecast: { type: 'object', description: 'Daily forecast for pollutants and weather' },
                                attributions: { type: 'array', items: { type: 'object' }, description: 'Data source attributions with name and URL' }
                            }
                        }
                    }
                }
            }
        }
    }
}
