export const main = {
    namespace: 'omdb',
    name: 'OMDb',
    description: 'Search and retrieve movie, TV series, and episode information from the Open Movie Database. Get details including ratings, plot, cast, and poster images.',
    version: '4.0.0',
    docs: ['https://www.omdbapi.com/'],
    tags: ['movies', 'entertainment', 'media', 'cacheTtlDaily'],
    root: 'https://www.omdbapi.com',
    requiredServerParams: ['OMDB_API_KEY'],
    headers: {},
    tools: {
        searchMovies: {
            method: 'GET',
            path: '/',
            description: 'Search for movies, series, or episodes by title. Returns a paginated list of matching results with basic info.',
            parameters: [
                { position: { key: 'apikey', value: '{{OMDB_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 's', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(movie,series,episode)', options: ['optional()'] } },
                { position: { key: 'y', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)', 'max(100)'] } }
            ],
            tests: [
                { _description: 'Search for Batman movies', s: 'Batman', type: 'movie' },
                { _description: 'Search for sci-fi series', s: 'Star Trek', type: 'series' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { Search: { type: 'array', items: { type: 'object', properties: { Title: { type: 'string' }, Year: { type: 'string' }, imdbID: { type: 'string' }, Type: { type: 'string' }, Poster: { type: 'string' } } } }, totalResults: { type: 'string' }, Response: { type: 'string' } } }
            },
        },
        getByImdbId: {
            method: 'GET',
            path: '/',
            description: 'Get detailed information for a specific movie or series by its IMDb ID. Returns full metadata including ratings, plot, cast, and awards.',
            parameters: [
                { position: { key: 'apikey', value: '{{OMDB_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'i', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'plot', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(short,full)', options: ['optional()', 'default(short)'] } }
            ],
            tests: [
                { _description: 'Get The Dark Knight details', i: 'tt0468569' },
                { _description: 'Get Inception with full plot', i: 'tt1375666', plot: 'full' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { Title: { type: 'string' }, Year: { type: 'string' }, Rated: { type: 'string' }, Released: { type: 'string' }, Runtime: { type: 'string' }, Genre: { type: 'string' }, Director: { type: 'string' }, Actors: { type: 'string' }, Plot: { type: 'string' }, imdbRating: { type: 'string' }, imdbID: { type: 'string' } } }
            },
        },
        getByTitle: {
            method: 'GET',
            path: '/',
            description: 'Get detailed information for a movie or series by its title. Returns the best matching result with full metadata.',
            parameters: [
                { position: { key: 'apikey', value: '{{OMDB_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 't', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(movie,series,episode)', options: ['optional()'] } },
                { position: { key: 'y', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'plot', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(short,full)', options: ['optional()', 'default(short)'] } }
            ],
            tests: [
                { _description: 'Get Interstellar by title', t: 'Interstellar', type: 'movie' },
                { _description: 'Get Breaking Bad series info', t: 'Breaking Bad', type: 'series' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { Title: { type: 'string' }, Year: { type: 'string' }, Rated: { type: 'string' }, Genre: { type: 'string' }, Director: { type: 'string' }, Actors: { type: 'string' }, Plot: { type: 'string' }, imdbRating: { type: 'string' }, imdbID: { type: 'string' } } }
            },
        }
    }
}
