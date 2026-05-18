export const main = {
    namespace: 'nasaneows',
    name: 'NasaNeows',
    description: 'Query NASA Near Earth Object Web Service (NeoWs) for asteroid close approach data, individual asteroid details, and browse the full asteroid dataset.',
    version: '4.0.0',
    docs: ['https://api.nasa.gov/', 'https://www.neowsapp.com/'],
    tags: ['nasa', 'asteroids', 'space', 'planetary-defense', 'science', 'cacheTtlFrequent'],
    root: 'https://api.nasa.gov',
    requiredServerParams: ['API_DATA_GOV_KEY'],
    headers: {},
    tools: {
        getFeed: {
            method: 'GET',
            path: '/neo/rest/v1/feed',
            description: 'Retrieve a list of Near Earth Objects that have close approaches to Earth within a specified date range (max 7 days).',
            parameters: [
                { position: { key: 'start_date', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'end_date', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get asteroids with close approaches on a specific date', start_date: '2024-01-01', end_date: '2024-01-01' },
                { _description: 'Get 3-day asteroid feed', start_date: '2024-03-01', end_date: '2024-03-03' },
                { _description: 'Get asteroid feed without specifying end date', start_date: '2024-06-01' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        links: { type: 'object', description: 'Navigation links for next, previous, and self' },
                        element_count: { type: 'number', description: 'Total number of NEOs in response' },
                        near_earth_objects: { type: 'object', description: 'Date-keyed object containing arrays of asteroid records' }
                    }
                }
            }
        },
        lookupAsteroid: {
            method: 'GET',
            path: '/neo/rest/v1/neo/:asteroidId',
            description: 'Look up a specific Near Earth Object by its NASA JPL small body ID (SPK-ID), returning full orbital and physical data.',
            parameters: [
                { position: { key: 'asteroidId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Look up asteroid Apophis by SPK-ID', asteroidId: '2099942' },
                { _description: 'Look up asteroid 433 Eros', asteroidId: '2000433' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'NEO reference ID' },
                        name: { type: 'string', description: 'Asteroid name' },
                        nasa_jpl_url: { type: 'string', description: 'JPL close approach data URL' },
                        absolute_magnitude_h: { type: 'number', description: 'Absolute magnitude H' },
                        estimated_diameter: { type: 'object', description: 'Estimated diameter in km, meters, miles, feet' },
                        is_potentially_hazardous_asteroid: { type: 'boolean', description: 'Whether asteroid is classified as potentially hazardous' },
                        close_approach_data: { type: 'array', description: 'Historical close approach records' },
                        orbital_data: { type: 'object', description: 'Orbital parameters' }
                    }
                }
            }
        },
        browseAsteroids: {
            method: 'GET',
            path: '/neo/rest/v1/neo/browse',
            description: 'Browse the full NASA Near Earth Object dataset with pagination.',
            parameters: [
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Browse first page of all NEOs', page: 0, size: 20 },
                { _description: 'Browse second page of NEO dataset', page: 1, size: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        links: { type: 'object', description: 'Pagination navigation links' },
                        page: { type: 'object', description: 'Pagination metadata (size, total_elements, total_pages, number)' },
                        near_earth_objects: { type: 'array', description: 'Array of NEO records' }
                    }
                }
            }
        },
        getTodayFeed: {
            method: 'GET',
            path: '/neo/rest/v1/feed/today',
            description: 'Get the Near Earth Objects with close approaches to Earth for today.',
            parameters: [
                { position: { key: 'detailed', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get today\'s NEO close approaches' },
                { _description: 'Get today\'s NEOs with detailed data', detailed: true }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        element_count: { type: 'number', description: 'Count of NEOs today' },
                        near_earth_objects: { type: 'object', description: 'Today\'s asteroid close approach data' }
                    }
                }
            }
        }
    }
}
