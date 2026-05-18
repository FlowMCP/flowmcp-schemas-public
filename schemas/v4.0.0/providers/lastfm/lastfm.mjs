export const main = {
    namespace: 'lastfm',
    name: 'Last.fm',
    description: 'Access music data from Last.fm including artist information, track details, album data, charts, and music recommendations powered by listening data.',
    version: '4.0.0',
    docs: ['https://www.last.fm/api'],
    tags: ['music', 'entertainment', 'charts', 'recommendations', 'cacheTtlDaily'],
    root: 'https://ws.audioscrobbler.com',
    requiredServerParams: ['LASTFM_API_KEY'],
    headers: {},
    tools: {
        searchArtists: {
            method: 'GET',
            path: '/2.0/',
            description: 'Search for artists by name. Returns matching artists with listeners count, images, and similarity info.',
            parameters: [
                { position: { key: 'method', value: 'artist.search', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'api_key', value: '{{LASTFM_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'artist', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(50)'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } }
            ],
            tests: [
                { _description: 'Search for Radiohead', artist: 'Radiohead', limit: 5 },
                { _description: 'Search for Beatles', artist: 'Beatles', limit: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'object', properties: { artistmatches: { type: 'object', properties: { artist: { type: 'array' } } } } } } }
            },
        },
        getArtistInfo: {
            method: 'GET',
            path: '/2.0/',
            description: 'Get detailed artist information including biography, stats, similar artists, and top tags.',
            parameters: [
                { position: { key: 'method', value: 'artist.getinfo', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'api_key', value: '{{LASTFM_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'artist', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Radiohead artist info', artist: 'Radiohead' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { artist: { type: 'object', properties: { name: { type: 'string' }, url: { type: 'string' }, stats: { type: 'object' }, similar: { type: 'object' }, tags: { type: 'object' }, bio: { type: 'object' } } } } }
            },
        },
        searchTracks: {
            method: 'GET',
            path: '/2.0/',
            description: 'Search for tracks by name. Returns matching tracks with artist, listeners count, and match score.',
            parameters: [
                { position: { key: 'method', value: 'track.search', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'api_key', value: '{{LASTFM_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'track', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(50)'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } }
            ],
            tests: [
                { _description: 'Search for Bohemian Rhapsody', track: 'Bohemian Rhapsody', limit: 5 },
                { _description: 'Search for Yesterday', track: 'Yesterday', limit: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'object', properties: { trackmatches: { type: 'object', properties: { track: { type: 'array' } } } } } } }
            },
        },
        getTopArtists: {
            method: 'GET',
            path: '/2.0/',
            description: 'Get the top artists chart on Last.fm. Returns the most popular artists ranked by listener count.',
            parameters: [
                { position: { key: 'method', value: 'chart.gettopartists', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'api_key', value: '{{LASTFM_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(50)'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } }
            ],
            tests: [
                { _description: 'Get top 10 artists chart', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { artists: { type: 'object', properties: { artist: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, playcount: { type: 'string' }, listeners: { type: 'string' }, url: { type: 'string' } } } } } } } }
            },
        },
        getAlbumInfo: {
            method: 'GET',
            path: '/2.0/',
            description: 'Get detailed album information including tracklist, tags, wiki summary, and play statistics.',
            parameters: [
                { position: { key: 'method', value: 'album.getinfo', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'api_key', value: '{{LASTFM_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'artist', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'album', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get OK Computer album info', artist: 'Radiohead', album: 'OK Computer' },
                { _description: 'Get Abbey Road album info', artist: 'The Beatles', album: 'Abbey Road' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { album: { type: 'object', properties: { name: { type: 'string' }, artist: { type: 'string' }, url: { type: 'string' }, tracks: { type: 'object' }, tags: { type: 'object' }, wiki: { type: 'object' } } } } }
            },
        }
    }
}
