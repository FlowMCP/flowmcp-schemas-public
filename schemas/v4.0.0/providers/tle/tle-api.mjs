export const main = {
    namespace: 'tle',
    name: 'TLE API',
    description: 'Access up-to-date NORAD Two-Line Element (TLE) orbital data for Earth-orbiting satellites including the ISS, weather satellites, and more.',
    docs: ['https://tle.ivanstanojevic.me/'],
    tags: ['satellite', 'space', 'orbit', 'tle', 'norad', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://tle.ivanstanojevic.me',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchSatellites: {
            method: 'GET',
            path: '/api/tle',
            description: 'Search for satellites by name and retrieve their Two-Line Element (TLE) data. Returns a paginated list of matching satellites.. Use IDs from results in getSatelliteById',
            parameters: [
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'page-size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(id,name)', options: ['optional()'] } },
                { position: { key: 'sort-dir', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(asc,desc)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for ISS satellite', search: 'ISS' },
                { _description: 'Search for NOAA weather satellites', search: 'NOAA' },
                { _description: 'Search for GPS satellites', search: 'GPS' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Paginated list of TLE satellite records matching the search',
                schema: { type: 'object', properties: { totalItems: { type: 'number', description: 'Total matching satellites' }, member: { type: 'array', description: 'Array of TLE records', items: { type: 'object', properties: { name: { type: 'string', description: 'Satellite name' }, satelliteId: { type: 'number', description: 'NORAD catalog ID' }, line1: { type: 'string', description: 'TLE line 1' }, line2: { type: 'string', description: 'TLE line 2' }, date: { type: 'string', description: 'Epoch date' } } } } } }
            },
        },
        getSatelliteById: {
            method: 'GET',
            path: '/api/tle/:id',
            description: 'Retrieve TLE orbital data for a specific satellite by its NORAD catalog number. Use searchSatellites first to find valid IDs.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get ISS TLE data (NORAD ID 25544)', id: 25544 },
                { _description: 'Get Hubble Space Telescope TLE (NORAD ID 20580)', id: 20580 },
                { _description: 'Get NOAA-15 satellite TLE (NORAD ID 25338)', id: 25338 }
            ],
            output: {
                mimeType: 'application/json',
                description: 'TLE orbital data for a specific satellite',
                schema: { type: 'object', properties: { name: { type: 'string', description: 'Satellite name' }, satelliteId: { type: 'number', description: 'NORAD catalog number' }, line1: { type: 'string', description: 'TLE line 1' }, line2: { type: 'string', description: 'TLE line 2' }, date: { type: 'string', description: 'Epoch date of orbital elements' } } }
            },
        }
    },
}