export const main = {
    namespace: 'tvmaze',
    name: 'TVmaze TV Shows API',
    description: 'Access TVmaze, a community-driven TV information database. Search TV shows, get episode guides, cast information, schedules, and show details. Covers 70,000+ shows with episode-level data, air dates, ratings, and images. Free, no API key required for most endpoints.',
    version: '4.0.0',
    docs: ['https://www.tvmaze.com/api'],
    tags: ['entertainment', 'tv', 'media', 'opendata', 'cacheTtlDaily'],
    root: 'https://api.tvmaze.com',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchShows: {
            method: 'GET',
            path: '/search/shows',
            description: 'Search TV shows by name. Returns matching shows with relevance score, show details, and images. Best for finding shows by title.. Use IDs from results in getShow',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search Breaking Bad', q: 'breaking bad' },
                { _description: 'Search The Office', q: 'the office' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { score: { type: 'number' }, show: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, type: { type: 'string' }, language: { type: 'string' }, genres: { type: 'array', items: { type: 'string' } }, status: { type: 'string' }, premiered: { type: 'string' }, ended: { type: 'string' }, rating: { type: 'object', properties: { average: { type: 'number' } } }, network: { type: 'object', properties: { name: { type: 'string' }, country: { type: 'object' } } }, summary: { type: 'string' }, image: { type: 'object', properties: { medium: { type: 'string' }, original: { type: 'string' } } } } } } } }
            }
        },
        getShow: {
            method: 'GET',
            path: '/shows/:id',
            description: 'Get detailed information about a TV show by its TVmaze ID. Returns show name, genres, schedule, rating, network, summary, and images.. Use searchShows first to find valid IDs',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get Breaking Bad (id 169)', id: 169 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, type: { type: 'string' }, language: { type: 'string' }, genres: { type: 'array' }, status: { type: 'string' }, premiered: { type: 'string' }, ended: { type: 'string' }, schedule: { type: 'object', properties: { time: { type: 'string' }, days: { type: 'array' } } }, rating: { type: 'object', properties: { average: { type: 'number' } } }, network: { type: 'object' }, summary: { type: 'string' }, image: { type: 'object' } } }
            }
        },
        getShowEpisodes: {
            method: 'GET',
            path: '/shows/:id/episodes',
            description: 'Get all episodes of a TV show. Returns season number, episode number, name, air date, runtime, rating, and summary for every episode.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Breaking Bad episodes', id: 169 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, season: { type: 'number' }, number: { type: 'number' }, airdate: { type: 'string' }, runtime: { type: 'number' }, rating: { type: 'object', properties: { average: { type: 'number' } } }, summary: { type: 'string' }, image: { type: 'object' } } } }
            }
        },
        getShowCast: {
            method: 'GET',
            path: '/shows/:id/cast',
            description: 'Get the cast of a TV show. Returns actors and their characters with biographical data, images, and links.. Use searchShows first to find valid IDs',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Breaking Bad cast', id: 169 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { person: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, birthday: { type: 'string' }, gender: { type: 'string' }, country: { type: 'object' }, image: { type: 'object' } } }, character: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, image: { type: 'object' } } } } } }
            }
        },
        getSchedule: {
            method: 'GET',
            path: '/schedule',
            description: 'Get the TV schedule for a specific date and country. Returns all shows airing on that date with episode details, air time, and network information. Default: today in US.. Use searchShows first to find valid IDs',
            parameters: [
                { position: { key: 'country', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(US)'] } },
                { position: { key: 'date', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'US schedule today', country: 'US' },
                { _description: 'UK schedule', country: 'GB' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, season: { type: 'number' }, number: { type: 'number' }, airdate: { type: 'string' }, airtime: { type: 'string' }, runtime: { type: 'number' }, show: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, network: { type: 'object' } } } } } }
            }
        }
    }
}
