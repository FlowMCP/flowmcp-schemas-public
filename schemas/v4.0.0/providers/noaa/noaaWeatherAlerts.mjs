export const main = {
    namespace: 'noaa',
    name: 'NOAAWeatherAlerts',
    description: 'Access US National Weather Service alerts, forecasts, and observations from NOAA\'s Weather.gov API. Retrieve active weather alerts by state, forecast by grid coordinates, and station observations.',
    docs: ['https://www.weather.gov/documentation/services-web-api'],
    tags: ['weather', 'alerts', 'forecast', 'noaa', 'us', 'government', 'opendata', 'cacheTtlShort'],
    version: '4.0.0',
    root: 'https://api.weather.gov',
    requiredServerParams: [],
    headers: {
        'User-Agent': 'FlowMCP/2.0.0 (https://github.com/FlowMCP)',
        'Accept': 'application/geo+json'
    },
    tools: {
        getActiveAlertsByArea: {
            method: 'GET',
            path: '/alerts/active',
            description: 'Get all active weather alerts for a US state or territory. Returns NWS warnings, watches, and advisories currently in effect.',
            parameters: [
                { position: { key: 'area', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(500)'] } }
            ],
            tests: [
                { _description: 'Get active alerts for California', area: 'CA' },
                { _description: 'Get active alerts for Texas', area: 'TX' },
                { _description: 'Get active alerts for Florida', area: 'FL', limit: 5 }
            ],
        },
        getAlertTypes: {
            method: 'GET',
            path: '/alerts/types',
            description: 'Get all valid NWS alert event types. Returns a list of recognized event type strings used in weather alerts.',
            parameters: [],
            tests: [
                { _description: 'Get all alert event types' }
            ],
        },
        getPointMetadata: {
            method: 'GET',
            path: '/points/:latitude,:longitude',
            description: 'Get NWS grid metadata for a geographic point. Returns the forecast office, grid coordinates, and URLs for forecasts and observations for the given latitude/longitude.',
            parameters: [
                { position: { key: 'latitude', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'longitude', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get grid metadata for New York City', latitude: '40.7128', longitude: '-74.0060' },
                { _description: 'Get grid metadata for Los Angeles', latitude: '34.0522', longitude: '-118.2437' },
                { _description: 'Get grid metadata for Chicago', latitude: '41.8781', longitude: '-87.6298' }
            ],
        },
        getForecastByGrid: {
            method: 'GET',
            path: '/gridpoints/:office/:gridX,:gridY/forecast',
            description: 'Get a 7-day weather forecast for a NWS grid point. Returns forecast periods (day/night) with temperature, wind, and weather description.',
            parameters: [
                { position: { key: 'office', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'gridX', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'gridY', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get 7-day forecast for New York (OKX office)', office: 'OKX', gridX: '33', gridY: '37' },
                { _description: 'Get 7-day forecast for Los Angeles area (LOX office)', office: 'LOX', gridX: '150', gridY: '50' }
            ],
        },
        getLatestObservation: {
            method: 'GET',
            path: '/stations/:stationId/observations/latest',
            description: 'Get the most recent weather observation from a NWS station. Returns current temperature, wind, humidity, pressure, and other conditions.',
            parameters: [
                { position: { key: 'stationId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get latest observation from JFK airport station', stationId: 'KJFK' },
                { _description: 'Get latest observation from LAX airport station', stationId: 'KLAX' },
                { _description: 'Get latest observation from Chicago OHare station', stationId: 'KORD' }
            ],
        }
    },
}