export const main = {
    namespace: 'noaaclimate',
    name: 'NOAA Climate Data',
    description: 'Access US and global climate data from NOAA National Centers for Environmental Information (NCEI). Query daily weather summaries, global station data, and climate normals. Covers 10,000+ weather stations worldwide with temperature, precipitation, wind, and other observations. Two APIs available: CDO Web Services (requires free API key) and NCEI Data Services (no key required).',
    version: '4.0.0',
    docs: ['https://www.ncei.noaa.gov/support/access-data-service-api-user-documentation'],
    tags: ['weather', 'climate', 'science', 'usa', 'opendata', 'cacheTtlDaily'],
    root: 'https://www.ncei.noaa.gov',
    requiredServerParams: [],
    headers: {},
    tools: {
        getDailySummaries: {
            method: 'GET',
            path: '/access/services/data/v1',
            description: 'Get daily weather summaries from NOAA stations. Returns temperature (TMAX, TMIN, TAVG in tenths of degrees Celsius), precipitation (PRCP in tenths of mm), snowfall (SNOW in mm), and more. Station IDs follow GHCN format (e.g., USW00094728 for Central Park NYC). No API key required.',
            parameters: [
                { position: { key: 'dataset', value: 'daily-summaries', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'stations', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'startDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'endDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'dataTypes', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(TMAX,TMIN,PRCP)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'units', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(standard,metric)', options: ['optional()', 'default(standard)'] } }
            ],
            tests: [
                { _description: 'NYC Central Park Jan 2024', stations: 'USW00094728', startDate: '2024-01-01', endDate: '2024-01-03', dataTypes: 'TMAX,TMIN,PRCP' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Array of daily weather summary records for the requested station and date range',
                schema: { type: 'array', items: { type: 'object', properties: { DATE: { type: 'string', description: 'Observation date (YYYY-MM-DD)' }, STATION: { type: 'string', description: 'GHCN station identifier' }, TMAX: { type: 'string', description: 'Maximum temperature (tenths of degrees Celsius in standard units)' }, TMIN: { type: 'string', description: 'Minimum temperature (tenths of degrees Celsius in standard units)' }, PRCP: { type: 'string', description: 'Precipitation (tenths of mm in standard units)' }, SNOW: { type: 'string', description: 'Snowfall (mm)' }, TAVG: { type: 'string', description: 'Average temperature (tenths of degrees Celsius)' } } } }
            }
        },
        getGlobalSummary: {
            method: 'GET',
            path: '/access/services/data/v1',
            description: 'Get global summary of the day (GSOD) from worldwide weather stations. Returns temperature (TEMP in Fahrenheit), dew point (DEWP), sea level pressure (SLP), visibility (VISIB), wind speed (WDSP in knots), precipitation (PRCP in inches), max/min temperature. Station IDs use USAF-WBAN format (e.g., 72503014732 for LaGuardia Airport). For daily US data use getDailySummaries, for hourly data use getGlobalHourly.',
            parameters: [
                { position: { key: 'dataset', value: 'global-summary-of-the-day', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'stations', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'startDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'endDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'dataTypes', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'LaGuardia Airport Jan 2024', stations: '72503014732', startDate: '2024-01-01', endDate: '2024-01-03' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Array of global daily weather summary records',
                schema: { type: 'array', items: { type: 'object', properties: { DATE: { type: 'string', description: 'Observation date (YYYY-MM-DD)' }, STATION: { type: 'string', description: 'USAF-WBAN station identifier' }, TEMP: { type: 'string', description: 'Mean temperature (Fahrenheit)' }, DEWP: { type: 'string', description: 'Mean dew point (Fahrenheit)' }, SLP: { type: 'string', description: 'Mean sea level pressure (millibars)' }, VISIB: { type: 'string', description: 'Mean visibility (miles)' }, WDSP: { type: 'string', description: 'Mean wind speed (knots)' }, MXSPD: { type: 'string', description: 'Maximum sustained wind speed (knots)' }, GUST: { type: 'string', description: 'Maximum wind gust (knots)' }, MAX: { type: 'string', description: 'Maximum temperature (Fahrenheit)' }, MIN: { type: 'string', description: 'Minimum temperature (Fahrenheit)' }, PRCP: { type: 'string', description: 'Total precipitation (inches)' }, SNDP: { type: 'string', description: 'Snow depth (inches)' }, FRSHTT: { type: 'string', description: 'Fog/Rain/Snow/Hail/Thunder/Tornado indicators (6-digit binary)' } } } }
            }
        },
        getGlobalHourly: {
            method: 'GET',
            path: '/access/services/data/v1',
            description: 'Get hourly weather observations from global stations (Integrated Surface Database). Returns wind direction/speed, temperature, dew point, sea level pressure, visibility, and weather type. For daily aggregates use getDailySummaries or getGlobalSummary.',
            parameters: [
                { position: { key: 'dataset', value: 'global-hourly', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'stations', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'startDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'endDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'dataTypes', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'JFK Airport hourly Jan 1 2024', stations: '72503014732', startDate: '2024-01-01', endDate: '2024-01-01' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Array of hourly weather observation records',
                schema: { type: 'array', items: { type: 'object', properties: { DATE: { type: 'string', description: 'Observation timestamp (ISO 8601)' }, STATION: { type: 'string', description: 'Station identifier' }, TMP: { type: 'string', description: 'Air temperature (scaled, comma-separated value and quality)' }, DEW: { type: 'string', description: 'Dew point temperature' }, SLP: { type: 'string', description: 'Sea level pressure' }, WND: { type: 'string', description: 'Wind direction and speed' }, VIS: { type: 'string', description: 'Visibility distance' }, AA1: { type: 'string', description: 'Liquid precipitation occurrence' } } } }
            }
        },
        getClimateNormals: {
            method: 'GET',
            path: '/access/services/data/v1',
            description: 'Get 30-year climate normals (1991-2020) for US stations. Returns average temperatures, precipitation, heating/cooling degree days, and other statistical normals. Compare with getDailySummaries to see how current conditions differ from historical averages.',
            parameters: [
                { position: { key: 'dataset', value: 'normals-daily', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'stations', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'startDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'endDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'dataTypes', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(DLY-TMAX-NORMAL,DLY-TMIN-NORMAL,DLY-PRCP-PCTALL-GE001HI)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'NYC normals for January', stations: 'USW00094728', startDate: '2010-01-01', endDate: '2010-01-31', dataTypes: 'DLY-TMAX-NORMAL,DLY-TMIN-NORMAL' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Array of 30-year climate normal records for the station',
                schema: { type: 'array', items: { type: 'object', properties: { DATE: { type: 'string', description: 'Reference date for normal value (YYYY-MM-DD)' }, STATION: { type: 'string', description: 'GHCN station identifier' } } } }
            }
        }
    }
}
