export const main = {
    namespace: 'rickandmorty',
    name: 'Rick and Morty API',
    description: 'Access The Rick and Morty API with data on 800+ characters, 50+ episodes, and 120+ locations from the animated TV show. Search and filter characters by name, status, species, or gender. Get episode guides and interdimensional location data. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://rickandmortyapi.com/documentation'],
    tags: ['entertainment', 'tv', 'opendata', 'cacheTtlStatic'],
    root: 'https://rickandmortyapi.com',
    requiredServerParams: [],
    headers: {},
    tools: {
        getCharacters: {
            method: 'GET',
            path: '/api/character/',
            description: 'Get all characters with optional filters. Filter by name, status (alive, dead, unknown), species, type, or gender (female, male, genderless, unknown). Paginated, 20 results per page.. Use IDs from results in getCharacter',
            parameters: [
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'status', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(alive,dead,unknown)', options: ['optional()'] } },
                { position: { key: 'species', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'gender', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(female,male,genderless,unknown)', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } }
            ],
            tests: [
                { _description: 'Search Rick', name: 'rick' },
                { _description: 'Dead characters', status: 'dead', page: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { info: { type: 'object', properties: { count: { type: 'number' }, pages: { type: 'number' }, next: { type: 'string' }, prev: { type: 'string' } } }, results: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, status: { type: 'string' }, species: { type: 'string' }, type: { type: 'string' }, gender: { type: 'string' }, origin: { type: 'object', properties: { name: { type: 'string' } } }, location: { type: 'object', properties: { name: { type: 'string' } } }, image: { type: 'string' }, episode: { type: 'array' } } } } } }
            }
        },
        getCharacter: {
            method: 'GET',
            path: '/api/character/:id',
            description: 'Get a specific character by ID. Returns name, status, species, type, gender, origin, last known location, image, and episode appearances.. Use getCharacters first to find valid IDs',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get Rick Sanchez (1)', id: 1 },
                { _description: 'Get Morty Smith (2)', id: 2 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, status: { type: 'string' }, species: { type: 'string' }, type: { type: 'string' }, gender: { type: 'string' }, origin: { type: 'object', properties: { name: { type: 'string' }, url: { type: 'string' } } }, location: { type: 'object', properties: { name: { type: 'string' }, url: { type: 'string' } } }, image: { type: 'string' }, episode: { type: 'array', items: { type: 'string' } } } }
            }
        },
        getEpisodes: {
            method: 'GET',
            path: '/api/episode/',
            description: 'Get all episodes with optional name filter. Returns episode name, air date, episode code (S01E01), and character appearances. Paginated.',
            parameters: [
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } }
            ],
            tests: [
                { _description: 'All episodes page 1', name: 'pilot' },
                { _description: 'Search Pilot', name: 'pilot' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { info: { type: 'object', properties: { count: { type: 'number' }, pages: { type: 'number' } } }, results: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, air_date: { type: 'string' }, episode: { type: 'string' }, characters: { type: 'array', items: { type: 'string' } } } } } } }
            }
        },
        getLocations: {
            method: 'GET',
            path: '/api/location/',
            description: 'Get all locations with optional filters. Filter by name, type, or dimension. Returns location details and which characters are residents. Paginated.',
            parameters: [
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'dimension', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } }
            ],
            tests: [
                { _description: 'All locations', page: 1 },
                { _description: 'Search Earth', name: 'earth' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { info: { type: 'object', properties: { count: { type: 'number' }, pages: { type: 'number' } } }, results: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, type: { type: 'string' }, dimension: { type: 'string' }, residents: { type: 'array', items: { type: 'string' } } } } } } }
            }
        }
    }
}
