// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'dwd',
    name: 'DWD WarnWetter API',
    description: 'German Weather Service (Deutscher Wetterdienst) weather forecasts and station data via the WarnWetter app API',
    version: '4.0.0',
    docs: ['https://dwd.api.bund.dev/'],
    tags: ['weather', 'germany', 'forecast', 'cacheTtlFrequent'],
    root: 'https://app-prod-ws.warnwetter.de/v30',
    tools: {
        getStationOverview: {
            method: 'GET',
            path: '/stationOverviewExtended',
            description: 'Get extended weather forecast overview for a DWD station. Returns hourly forecasts (forecast1 short-term, forecast2 extended), daily summaries, active warnings, and three-hour summaries. The handler simplifies the response to stationId, forecastStart, days, and warnings.',
            parameters: [
                { position: { key: 'stationIds', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default("10382")'] } }
            ],
            tests: [
                { _description: 'Get Berlin Tegel station forecast', stationIds: '10382' },
                { _description: 'Get Hamburg station forecast', stationIds: '10147' },
                { _description: 'Get Munich station forecast', stationIds: '10870' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Weather forecast data keyed by station ID. The postRequest handler transforms this into a simplified {stationCount, stations} object.',
                    properties: {
                        '10382': { type: 'object', description: 'Station-specific forecast data (key is the station ID)', properties: { forecast1: { type: 'object', description: 'Short-term hourly forecast (next ~3 days)', properties: { stationId: { type: 'string', description: 'DWD weather station identifier' }, start: { type: 'number', description: 'Unix timestamp (ms) of the first forecast step' }, timeStep: { type: 'number', description: 'Interval between forecast steps in milliseconds' }, temperature: { type: 'array', description: 'Temperature values in 1/10 degrees Celsius (divide by 10 for actual)', items: { type: 'number' } }, windSpeed: { type: 'string', nullable: true, description: 'Wind speed values (null if unavailable)' }, windDirection: { type: 'string', nullable: true, description: 'Wind direction values in degrees (null if unavailable)' }, windGust: { type: 'string', nullable: true, description: 'Wind gust speed values (null if unavailable)' }, precipitationTotal: { type: 'array', description: 'Total precipitation in 1/10 mm per time step', items: { type: 'number' } }, sunshine: { type: 'array', description: 'Sunshine duration in minutes per time step', items: { type: 'number' } }, dewPoint2m: { type: 'array', description: 'Dew point at 2m in 1/10 degrees Celsius', items: { type: 'number' } }, surfacePressure: { type: 'array', description: 'Surface pressure in 1/10 hPa', items: { type: 'number' } }, humidity: { type: 'array', description: 'Relative humidity percentage', items: { type: 'number' } }, isDay: { type: 'array', description: 'Whether each time step is during daylight', items: { type: 'boolean' } }, cloudCoverTotal: { type: 'array', description: 'Total cloud cover in octas (0-8 scale)', items: { type: 'string' } }, temperatureStd: { type: 'array', description: 'Temperature standard deviation for uncertainty', items: { type: 'number' } }, icon: { type: 'array', description: 'DWD weather icon code for each time step', items: { type: 'number' } }, icon1h: { type: 'array', description: 'DWD 1-hour weather icon code', items: { type: 'number' } }, precipitationProbablity: { type: 'string', nullable: true, description: 'Precipitation probability values (null if unavailable)' }, precipitationProbablityIndex: { type: 'number', nullable: true, description: 'Precipitation probability index (null if unavailable)' } } }, days: { type: 'array', description: 'Daily forecast summaries with min/max temperature and weather icon', items: { type: 'object' } }, forecast2: { type: 'object', description: 'Extended forecast beyond forecast1 (lower resolution)', properties: { stationId: { type: 'string', description: 'DWD weather station identifier' }, start: { type: 'number', description: 'Unix timestamp (ms) of the first extended forecast step' }, timeStep: { type: 'number', description: 'Interval between extended forecast steps in milliseconds' }, temperature: { type: 'array', description: 'Temperature values for extended period', items: { type: 'string' } }, windSpeed: { type: 'string', nullable: true, description: 'Wind speed values (null if unavailable)' }, windDirection: { type: 'string', nullable: true, description: 'Wind direction values (null if unavailable)' }, windGust: { type: 'string', nullable: true, description: 'Wind gust speed values (null if unavailable)' }, precipitationTotal: { type: 'array', description: 'Total precipitation per time step', items: { type: 'number' } }, sunshine: { type: 'array', description: 'Sunshine duration per time step', items: { type: 'number' } }, dewPoint2m: { type: 'array', description: 'Dew point at 2m for extended period', items: { type: 'number' } }, surfacePressure: { type: 'array', description: 'Surface pressure for extended period', items: { type: 'number' } }, humidity: { type: 'array', description: 'Relative humidity for extended period', items: { type: 'number' } }, isDay: { type: 'array', description: 'Daylight indicator for extended period', items: { type: 'boolean' } }, cloudCoverTotal: { type: 'array', description: 'Cloud cover for extended period', items: { type: 'string' } }, temperatureStd: { type: 'array', description: 'Temperature uncertainty for extended period', items: { type: 'string' } }, icon: { type: 'array', description: 'Weather icon codes for extended period', items: { type: 'number' } }, icon1h: { type: 'array', description: '1-hour icon codes for extended period', items: { type: 'number' } }, precipitationProbablity: { type: 'string', nullable: true, description: 'Precipitation probability (null if unavailable)' }, precipitationProbablityIndex: { type: 'number', nullable: true, description: 'Precipitation probability index (null if unavailable)' } } }, forecastStart: { type: 'string', nullable: true, description: 'ISO 8601 timestamp when the forecast period begins' }, warnings: { type: 'array', description: 'Active DWD weather warnings for this station', items: { type: 'object' } }, threeHourSummaries: { type: 'string', nullable: true, description: 'Three-hour summary data (null if unavailable)' } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getStationOverview: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw || typeof raw !== 'object' ) { return { response }}

            const stations = Object.entries( raw )
            .map( ( [ stationId, data ] ) => {
            const result = {
            stationId,
            forecastStart: data.forecastStart || null,
            days: data.days || null,
            warnings: data.warnings || []
            }

            return result
            } )

            response = {
            stationCount: stations.length,
            stations
            }

            return { response }
        }
    }
} )
