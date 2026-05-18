export const main = {
    namespace: 'jpl',
    name: 'JplFireball',
    description: 'Query NASA JPL fireball and bolide event data — atmospheric impacts detected by US Government sensors including date, location, energy, and velocity.',
    docs: ['https://ssd-api.jpl.nasa.gov/doc/fireball.html'],
    tags: ['nasa', 'space', 'science', 'fireball', 'meteor', 'planetarydefense', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://ssd-api.jpl.nasa.gov',
    requiredServerParams: [],
    headers: {},
    tools: {
        getFireballs: {
            method: 'GET',
            path: '/fireball.api',
            description: 'Retrieve fireball and bolide events detected by US Government sensors, optionally filtered by date range, energy thresholds, and altitude. Each record includes date, coordinates, altitude, velocity, and radiated/impact energy.',
            parameters: [
                { position: { key: 'date-min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Start date filter in YYYY-MM-DD format' },
                { position: { key: 'date-max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'End date filter in YYYY-MM-DD format' },
                { position: { key: 'energy-min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Minimum total radiated energy in joules (scientific notation, e.g. 1e10)' },
                { position: { key: 'impact-e-min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Minimum estimated impact energy in kilotons of TNT' },
                { position: { key: 'req-loc', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] }, description: 'Require geographic location data (exclude events without coordinates)' },
                { position: { key: 'req-alt', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] }, description: 'Require altitude data (exclude events without altitude measurement)' },
                { position: { key: 'vel-comp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] }, description: 'Include velocity components (vx, vy, vz) in addition to total velocity' },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default("-date")'] }, description: 'Sort field with optional - prefix for descending (e.g. -date, energy, -energy)' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(1)', 'max(1000)'] }, description: 'Maximum number of results to return (max 1000)' }
            ],
            tests: [
                { _description: 'Get the 20 most recent fireball events', limit: 20 },
                { _description: 'Get fireballs since 2020 with location data required', 'date-min': '2020-01-01', 'req-loc': true, limit: 50 },
                { _description: 'Get high-energy fireballs above 10 kiloton impact energy', 'impact-e-min': '10', limit: 20 },
                { _description: 'Get fireballs in a specific year with velocity components', 'date-min': '2023-01-01', 'date-max': '2023-12-31', 'vel-comp': true }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Fireball event dataset with field definitions and tabular data records',
                    properties: {
                        signature: { type: 'object', description: 'API response signature with source and version info', properties: { source: { type: 'string', description: 'Data source identifier (NASA JPL)' }, version: { type: 'string', description: 'API version number' } } },
                        count: { type: 'string', description: 'Total number of fireball events returned' },
                        fields: { type: 'array', description: 'Array of field names describing the columns in the data array (date, energy, impact-e, lat, lon, alt, vel, etc.)', items: { type: 'string', description: 'Column name' } },
                        data: { type: 'array', description: 'Array of fireball event records, each an array of values matching the fields order', items: { type: 'array', description: 'Single fireball event as array of values [date, energy, impact-e, lat, lat-dir, lon, lon-dir, alt, vel, ...]' } }
                    }
                }
            },
        }
    },
}
