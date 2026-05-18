export const main = {
    namespace: 'brightsky',
    name: 'Bright Sky',
    description: 'Access German weather data from DWD (Deutscher Wetterdienst) including hourly forecasts, current conditions, weather alerts, and rainfall radar.',
    docs: ['https://brightsky.dev/docs/'],
    tags: ['weather', 'forecast', 'germany', 'dwd', 'meteorology', 'cacheTtlHourly'],
    version: '4.0.0',
    root: 'https://api.brightsky.dev',
    requiredServerParams: [],
    headers: {},
    tools: {
        getWeather: {
            method: 'GET',
            path: '/weather',
            description: 'Retrieve hourly weather observations and forecasts for a location in Germany. Provide location via lat/lon or DWD station ID, and a start date.',
            parameters: [
                { position: { key: 'date', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Start date for weather data in ISO 8601 format, e.g. 2025-01-15 or 2025-01-15T00:00:00+00:00' },
                { position: { key: 'last_date', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'End date for weather data in ISO 8601 format, e.g. 2025-01-16. Defaults to date + 1 day if omitted' },
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Latitude of the location in decimal degrees, e.g. 52.52 for Berlin' },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Longitude of the location in decimal degrees, e.g. 13.405 for Berlin' },
                { position: { key: 'dwd_station_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'DWD weather station ID as a string, e.g. 10382 for Berlin-Tempelhof. Alternative to lat/lon' },
                { position: { key: 'units', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(dwd,si)', options: ['optional()', 'default(dwd)'] }, description: 'Unit system for response values. dwd uses German DWD units (km/h, hPa), si uses SI units (m/s, Pa)' },
                { position: { key: 'tz', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Timezone for timestamps in the response, e.g. Europe/Berlin. Defaults to UTC' }
            ],
            outputSchema: {
                weather: [{
                    timestamp: 'string',
                    source_id: 'number',
                    precipitation: 'number|null',
                    pressure_msl: 'number|null',
                    sunshine: 'number|null',
                    temperature: 'number|null',
                    wind_direction: 'number|null',
                    wind_speed: 'number|null',
                    cloud_cover: 'number|null',
                    dew_point: 'number|null',
                    relative_humidity: 'number|null',
                    visibility: 'number|null',
                    wind_gust_direction: 'number|null',
                    wind_gust_speed: 'number|null',
                    condition: 'string|null',
                    precipitation_probability: 'number|null',
                    precipitation_probability_6h: 'number|null',
                    solar: 'number|null',
                    fallback_source_ids: 'object',
                    icon: 'string'
                }],
                sources: [{
                    id: 'number',
                    dwd_station_id: 'string',
                    observation_type: 'string',
                    lat: 'number',
                    lon: 'number',
                    height: 'number',
                    station_name: 'string',
                    wmo_station_id: 'string',
                    first_record: 'string',
                    last_record: 'string',
                    distance: 'number'
                }]
            },
            tests: [
                { _description: 'Get weather for Berlin today', lat: 52.52, lon: 13.405, date: '2025-01-15' },
                { _description: 'Get weather for Munich with date range', lat: 48.137, lon: 11.576, date: '2025-01-15', last_date: '2025-01-16' },
                { _description: 'Get weather by DWD station', dwd_station_id: '10382', date: '2025-01-15' }
            ],
        },
        getCurrentWeather: {
            method: 'GET',
            path: '/current_weather',
            description: 'Get the most recent weather observations for a location in Germany. Returns current conditions from the nearest DWD station.',
            parameters: [
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Latitude of the location in decimal degrees, e.g. 52.52 for Berlin' },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Longitude of the location in decimal degrees, e.g. 13.405 for Berlin' },
                { position: { key: 'dwd_station_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'DWD weather station ID as a string, e.g. 10382 for Berlin-Tempelhof. Alternative to lat/lon' },
                { position: { key: 'units', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(dwd,si)', options: ['optional()', 'default(dwd)'] }, description: 'Unit system for response values. dwd uses German DWD units (km/h, hPa), si uses SI units (m/s, Pa)' },
                { position: { key: 'tz', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Timezone for timestamps in the response, e.g. Europe/Berlin. Defaults to UTC' }
            ],
            outputSchema: {
                weather: {
                    source_id: 'number',
                    timestamp: 'string',
                    cloud_cover: 'number|null',
                    condition: 'string|null',
                    dew_point: 'number|null',
                    solar_10: 'number|null',
                    solar_30: 'number|null',
                    solar_60: 'number|null',
                    precipitation_10: 'number|null',
                    precipitation_30: 'number|null',
                    precipitation_60: 'number|null',
                    pressure_msl: 'number|null',
                    relative_humidity: 'number|null',
                    visibility: 'number|null',
                    wind_direction_10: 'number|null',
                    wind_direction_30: 'number|null',
                    wind_direction_60: 'number|null',
                    wind_speed_10: 'number|null',
                    wind_speed_30: 'number|null',
                    wind_speed_60: 'number|null',
                    wind_gust_direction_10: 'number|null',
                    wind_gust_direction_30: 'number|null',
                    wind_gust_direction_60: 'number|null',
                    wind_gust_speed_10: 'number|null',
                    wind_gust_speed_30: 'number|null',
                    wind_gust_speed_60: 'number|null',
                    sunshine_30: 'number|null',
                    sunshine_60: 'number|null',
                    temperature: 'number|null',
                    fallback_source_ids: 'object',
                    icon: 'string'
                },
                sources: [{
                    id: 'number',
                    dwd_station_id: 'string',
                    observation_type: 'string',
                    lat: 'number',
                    lon: 'number',
                    height: 'number',
                    station_name: 'string',
                    wmo_station_id: 'string',
                    first_record: 'string|null',
                    last_record: 'string|null',
                    distance: 'number'
                }]
            },
            tests: [
                { _description: 'Get current weather for Berlin', lat: 52.52, lon: 13.405 },
                { _description: 'Get current weather for Hamburg', lat: 53.551, lon: 9.994 },
                { _description: 'Get current weather for Frankfurt', lat: 50.11, lon: 8.682 }
            ],
        },
        getAlerts: {
            method: 'GET',
            path: '/alerts',
            description: 'Retrieve active weather alerts from DWD for a specific location in Germany. Returns all active alerts if no location is specified.',
            parameters: [
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Latitude of the location in decimal degrees, e.g. 48.137 for Munich' },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Longitude of the location in decimal degrees, e.g. 11.576 for Munich' },
                { position: { key: 'warn_cell_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'DWD warn cell ID to filter alerts for a specific warning area, e.g. 709162001 for Munich' },
                { position: { key: 'tz', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Timezone for timestamps in the response, e.g. Europe/Berlin. Defaults to UTC' }
            ],
            outputSchema: {
                alerts: [{
                    id: 'number',
                    alert_id: 'string|number',
                    effective: 'string',
                    onset: 'string',
                    expires: 'string',
                    category: 'string',
                    response_type: 'string',
                    urgency: 'string',
                    severity: 'string',
                    certainty: 'string',
                    event_code: 'number',
                    event_en: 'string',
                    event_de: 'string',
                    headline_en: 'string',
                    headline_de: 'string',
                    description_en: 'string',
                    description_de: 'string',
                    instruction_en: 'string',
                    instruction_de: 'string',
                    status: 'string'
                }],
                location: {
                    warn_cell_id: 'number',
                    name: 'string',
                    name_short: 'string',
                    district: 'string',
                    state: 'string',
                    state_short: 'string'
                }
            },
            tests: [
                { _description: 'Get all active weather alerts in Germany', lat: 48.137, lon: 11.576 },
                { _description: 'Get weather alerts for Munich', lat: 48.137, lon: 11.576 },
                { _description: 'Get weather alerts for Hamburg', lat: 53.551, lon: 9.994 }
            ],
        },
        getSources: {
            method: 'GET',
            path: '/sources',
            description: 'List available DWD weather observation stations near a given location, including station metadata and data availability.',
            parameters: [
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Latitude of the location in decimal degrees, e.g. 52.52 for Berlin' },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Longitude of the location in decimal degrees, e.g. 13.405 for Berlin' },
                { position: { key: 'max_dist', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50000)'] }, description: 'Maximum distance in meters from the given lat/lon to search for stations. Default is 50000 (50 km)' },
                { position: { key: 'dwd_station_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'DWD weather station ID to look up a specific station, e.g. 10382 for Berlin-Tempelhof' }
            ],
            outputSchema: {
                sources: [{
                    id: 'number',
                    dwd_station_id: 'string',
                    observation_type: 'string',
                    lat: 'number',
                    lon: 'number',
                    height: 'number',
                    station_name: 'string',
                    wmo_station_id: 'string',
                    first_record: 'string|null',
                    last_record: 'string|null',
                    distance: 'number'
                }]
            },
            tests: [
                { _description: 'Get weather stations near Berlin', lat: 52.52, lon: 13.405 },
                { _description: 'Get weather stations near Munich within 100km', lat: 48.137, lon: 11.576, max_dist: 100000 },
                { _description: 'Get station info by DWD station ID', dwd_station_id: '10382' }
            ],
        }
    },
}
