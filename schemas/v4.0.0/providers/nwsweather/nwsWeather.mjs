export const main = {
    namespace: 'nwsweather',
    name: 'NWS Weather',
    description: 'Access US National Weather Service weather data including detailed forecasts, active severe weather alerts, and real-time observations from 3000+ weather stations. Covers the entire United States with official government weather data. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://www.weather.gov/documentation/services-web-api'],
    tags: ['weather', 'forecast', 'alerts', 'government', 'geolocation', 'cacheTtlFrequent'],
    root: 'https://api.weather.gov',
    requiredServerParams: [],
    headers: {
        'User-Agent': 'FlowMCP/2.0'
    },
    tools: {
        getPoint: {
            method: 'GET',
            path: '/points/:coordinates',
            description: 'Get metadata for a geographic point including the forecast office, grid coordinates, and links to forecast data. This is the entry point for location-based forecasts — use the returned gridId, gridX, and gridY with getForecast.',
            parameters: [
                { position: { key: 'coordinates', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get point metadata for Washington DC', coordinates: '38.8894,-77.0352' },
                { _description: 'Get point metadata for Chicago', coordinates: '41.8781,-87.6298' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { properties: { type: 'object', properties: { gridId: { type: 'string' }, gridX: { type: 'number' }, gridY: { type: 'number' }, forecast: { type: 'string' }, forecastHourly: { type: 'string' }, forecastGridData: { type: 'string' }, relativeLocation: { type: 'object' }, timeZone: { type: 'string' } } } } }
            }
        },
        getForecast: {
            method: 'GET',
            path: '/gridpoints/:gridId/:gridCoords/forecast',
            description: 'Get a detailed text weather forecast for a grid point. Returns 14 forecast periods with temperature, wind, and detailed descriptions. Use getPoint first to obtain gridId and grid coordinates (pass as "X,Y" string).',
            parameters: [
                { position: { key: 'gridId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'gridCoords', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get forecast for Washington DC area', gridId: 'LWX', gridCoords: '96,70' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { properties: { type: 'object', properties: { updated: { type: 'string' }, periods: { type: 'array', items: { type: 'object', properties: { number: { type: 'number' }, name: { type: 'string' }, startTime: { type: 'string' }, endTime: { type: 'string' }, isDaytime: { type: 'boolean' }, temperature: { type: 'number' }, temperatureUnit: { type: 'string' }, windSpeed: { type: 'string' }, windDirection: { type: 'string' }, shortForecast: { type: 'string' }, detailedForecast: { type: 'string' } } } } } } } }
            }
        },
        getHourlyForecast: {
            method: 'GET',
            path: '/gridpoints/:gridId/:gridCoords/forecast/hourly',
            description: 'Get hourly weather forecast for a grid point with 156 hours of data. Returns temperature, wind, precipitation probability, and short forecast text for each hour.',
            parameters: [
                { position: { key: 'gridId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'gridCoords', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get hourly forecast for Washington DC', gridId: 'LWX', gridCoords: '96,70' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { properties: { type: 'object', properties: { updated: { type: 'string' }, periods: { type: 'array', items: { type: 'object', properties: { number: { type: 'number' }, startTime: { type: 'string' }, temperature: { type: 'number' }, temperatureUnit: { type: 'string' }, windSpeed: { type: 'string' }, windDirection: { type: 'string' }, shortForecast: { type: 'string' }, probabilityOfPrecipitation: { type: 'object' } } } } } } } }
            }
        },
        getActiveAlerts: {
            method: 'GET',
            path: '/alerts/active',
            description: 'Get all currently active weather alerts across the US or filtered by area, event type, urgency, severity, or certainty. Returns alert details including affected zones and description.',
            parameters: [
                { position: { key: 'area', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'event', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'severity', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(Extreme,Severe,Moderate,Minor,Unknown)', options: ['optional()'] } },
                { position: { key: 'urgency', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(Immediate,Expected,Future,Past,Unknown)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get all active alerts', },
                { _description: 'Get active alerts in California', area: 'CA' },
                { _description: 'Get active tornado warnings', event: 'Tornado Warning' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { features: { type: 'array', items: { type: 'object', properties: { properties: { type: 'object', properties: { id: { type: 'string' }, areaDesc: { type: 'string' }, event: { type: 'string' }, severity: { type: 'string' }, urgency: { type: 'string' }, headline: { type: 'string' }, description: { type: 'string' }, onset: { type: 'string' }, expires: { type: 'string' }, senderName: { type: 'string' } } } } } } } }
            }
        },
        getStations: {
            method: 'GET',
            path: '/stations',
            description: 'List weather observation stations filtered by US state code. Returns station metadata including coordinates, elevation, and station identifier.',
            parameters: [
                { position: { key: 'state', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get weather stations in Washington DC', state: 'DC' },
                { _description: 'Get weather stations in Florida', state: 'FL' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { features: { type: 'array', items: { type: 'object', properties: { properties: { type: 'object', properties: { stationIdentifier: { type: 'string' }, name: { type: 'string' }, timeZone: { type: 'string' }, elevation: { type: 'object' } } }, geometry: { type: 'object', properties: { coordinates: { type: 'array' } } } } } } } }
            }
        },
        getLatestObservation: {
            method: 'GET',
            path: '/stations/:stationId/observations/latest',
            description: 'Get the latest weather observation from a specific station. Returns temperature, dewpoint, wind, pressure, visibility, and weather conditions. Use getStations to find station IDs.',
            parameters: [
                { position: { key: 'stationId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get latest observation from Reagan National Airport', stationId: 'KDCA' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { properties: { type: 'object', properties: { timestamp: { type: 'string' }, textDescription: { type: 'string' }, temperature: { type: 'object', properties: { value: { type: 'number' }, unitCode: { type: 'string' } } }, dewpoint: { type: 'object' }, windDirection: { type: 'object' }, windSpeed: { type: 'object' }, barometricPressure: { type: 'object' }, visibility: { type: 'object' }, relativeHumidity: { type: 'object' } } } } }
            }
        }
    }
}
