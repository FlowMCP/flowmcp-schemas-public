export const main = {
    namespace: 'openmeteo',
    name: 'OpenMeteoAirQuality',
    description: 'Get hourly air quality forecasts and current conditions for any location worldwide. Returns PM2.5, PM10, ozone, NO2, CO, UV index, and European/US AQI values from the Open-Meteo air quality model.',
    docs: ['https://open-meteo.com/en/docs/air-quality-api'],
    tags: ['airquality', 'pollution', 'environment', 'forecast', 'health', 'opendata', 'cacheTtlHourly'],
    version: '4.0.0',
    root: 'https://air-quality-api.open-meteo.com',
    requiredServerParams: [],
    headers: {},
    tools: {
        getAirQualityForecast: {
            method: 'GET',
            path: '/v1/air-quality',
            description: 'Get hourly air quality forecast for a geographic location. Returns PM2.5, PM10, ozone, nitrogen dioxide, carbon monoxide, UV index, and air quality indices (European and US AQI) for up to 7 days. For current conditions only, use getCurrentAirQuality. For pollen data, use getPollenForecast.',
            parameters: [
                { position: { key: 'latitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'longitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'hourly', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,us_aqi,european_aqi)'] } },
                { position: { key: 'forecast_days', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(5)', 'min(0)', 'max(7)'] } },
                { position: { key: 'past_days', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)', 'max(92)'] } },
                { position: { key: 'timezone', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(GMT)'] } },
                { position: { key: 'domains', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(auto,cams_europe,cams_global)', options: ['optional()', 'default(auto)'] } }
            ],
            tests: [
                { _description: 'Get air quality forecast for Berlin (PM2.5, PM10, AQI)', latitude: 52.52, longitude: 13.41, hourly: 'pm10,pm2_5,us_aqi,european_aqi', forecast_days: 3 },
                { _description: 'Get air quality for New York with ozone and NO2', latitude: 40.71, longitude: -74.01, hourly: 'pm2_5,ozone,nitrogen_dioxide,us_aqi', forecast_days: 2 },
                { _description: 'Get air quality for Tokyo', latitude: 35.68, longitude: 139.69, hourly: 'pm10,pm2_5,carbon_monoxide,us_aqi', forecast_days: 3 }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Hourly air quality forecast data for the requested location',
                schema: { type: 'object', properties: { latitude: { type: 'number', description: 'Resolved latitude of the grid cell' }, longitude: { type: 'number', description: 'Resolved longitude of the grid cell' }, generationtime_ms: { type: 'number', description: 'Server processing time in milliseconds' }, utc_offset_seconds: { type: 'number', description: 'UTC offset for the timezone' }, timezone: { type: 'string', description: 'Timezone identifier' }, hourly_units: { type: 'object', description: 'Units for each hourly variable' }, hourly: { type: 'object', description: 'Hourly air quality data arrays indexed by time', properties: { time: { type: 'array', items: { type: 'string' }, description: 'ISO 8601 timestamps' }, pm2_5: { type: 'array', items: { type: 'number' }, description: 'PM2.5 concentration (ug/m3)' }, pm10: { type: 'array', items: { type: 'number' }, description: 'PM10 concentration (ug/m3)' }, us_aqi: { type: 'array', items: { type: 'number' }, description: 'US Air Quality Index (0-500)' }, european_aqi: { type: 'array', items: { type: 'number' }, description: 'European Air Quality Index (0-100+)' } } } } }
            }
        },
        getCurrentAirQuality: {
            method: 'GET',
            path: '/v1/air-quality',
            description: 'Get current air quality conditions for a location. Returns real-time PM2.5, PM10, ozone, nitrogen dioxide, US AQI, and European AQI for the current hour. For multi-day forecasts use getAirQualityForecast.',
            parameters: [
                { position: { key: 'latitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'longitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'current', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(pm10,pm2_5,us_aqi,european_aqi,carbon_monoxide,nitrogen_dioxide,ozone)'] } },
                { position: { key: 'timezone', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(GMT)'] } },
                { position: { key: 'domains', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(auto,cams_europe,cams_global)', options: ['optional()', 'default(auto)'] } }
            ],
            tests: [
                { _description: 'Get current air quality for Paris', latitude: 48.85, longitude: 2.35, current: 'pm10,pm2_5,us_aqi,european_aqi' },
                { _description: 'Get current air quality for Beijing', latitude: 39.91, longitude: 116.39, current: 'pm2_5,pm10,us_aqi,nitrogen_dioxide,ozone' },
                { _description: 'Get current air quality for London', latitude: 51.51, longitude: -0.13, current: 'pm10,pm2_5,us_aqi,european_aqi,ozone' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Current air quality conditions for the requested location',
                schema: { type: 'object', properties: { latitude: { type: 'number', description: 'Resolved latitude' }, longitude: { type: 'number', description: 'Resolved longitude' }, current_units: { type: 'object', description: 'Units for each current variable' }, current: { type: 'object', description: 'Current air quality values', properties: { time: { type: 'string', description: 'Current observation timestamp (ISO 8601)' }, pm2_5: { type: 'number', description: 'Current PM2.5 (ug/m3)' }, pm10: { type: 'number', description: 'Current PM10 (ug/m3)' }, us_aqi: { type: 'number', description: 'Current US AQI' }, european_aqi: { type: 'number', description: 'Current European AQI' } } } } }
            }
        },
        getPollenForecast: {
            method: 'GET',
            path: '/v1/air-quality',
            description: 'Get pollen forecast for European locations. Returns hourly pollen counts for alder, birch, grass, mugwort, olive, and ragweed. Only available in the European domain.',
            parameters: [
                { position: { key: 'latitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'longitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'hourly', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(grass_pollen,birch_pollen,alder_pollen,ragweed_pollen,olive_pollen,mugwort_pollen)'] } },
                { position: { key: 'forecast_days', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(5)', 'min(0)', 'max(7)'] } },
                { position: { key: 'timezone', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(Europe/Berlin)'] } },
                { position: { key: 'domains', value: 'cams_europe', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(cams_europe)'] } }
            ],
            tests: [
                { _description: 'Get pollen forecast for Munich (grass and birch)', latitude: 48.14, longitude: 11.58, hourly: 'grass_pollen,birch_pollen,alder_pollen', forecast_days: 3, timezone: 'Europe/Berlin' },
                { _description: 'Get pollen forecast for Rome (olive pollen)', latitude: 41.90, longitude: 12.50, hourly: 'grass_pollen,olive_pollen,ragweed_pollen', forecast_days: 3, timezone: 'Europe/Rome' },
                { _description: 'Get all pollen types for Paris', latitude: 48.85, longitude: 2.35, hourly: 'grass_pollen,birch_pollen,alder_pollen,ragweed_pollen,olive_pollen,mugwort_pollen', timezone: 'Europe/Paris' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Hourly pollen forecast data for European locations',
                schema: { type: 'object', properties: { latitude: { type: 'number', description: 'Resolved latitude' }, longitude: { type: 'number', description: 'Resolved longitude' }, hourly_units: { type: 'object', description: 'Units for pollen variables (grains/m3)' }, hourly: { type: 'object', description: 'Hourly pollen count arrays', properties: { time: { type: 'array', items: { type: 'string' }, description: 'ISO 8601 timestamps' }, grass_pollen: { type: 'array', items: { type: 'number' }, description: 'Grass pollen count (grains/m3)' }, birch_pollen: { type: 'array', items: { type: 'number' }, description: 'Birch pollen count' }, alder_pollen: { type: 'array', items: { type: 'number' }, description: 'Alder pollen count' } } } } }
            }
        }
    },
}