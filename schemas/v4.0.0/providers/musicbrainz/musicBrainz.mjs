export const main = {
    namespace: 'musicbrainz',
    name: 'MusicBrainz',
    description: 'Query the MusicBrainz music metadata database with 2M+ artists, 30M+ recordings, and comprehensive release information. Search or look up artists, recordings, releases, and release groups by MBID or keyword.',
    version: '4.0.0',
    docs: ['https://musicbrainz.org/doc/MusicBrainz_API'],
    tags: ['music', 'metadata', 'artists', 'recordings', 'opendata', 'cacheTtlDaily'],
    root: 'https://musicbrainz.org/ws/2',
    requiredServerParams: [],
    headers: {
        'User-Agent': 'FlowMCP/2.0.0 (https://github.com/FlowMCP)',
        'Accept': 'application/json'
    },
    tools: {
        searchArtist: {
            method: 'GET',
            path: '/artist',
            description: 'Search for artists by name, country, type, or other fields. Returns a list of matching artists with their MBIDs, sort names, and disambiguation comments.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'fmt', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for The Beatles', query: 'The Beatles' },
                { _description: 'Search for David Bowie', query: 'David Bowie', limit: 5 },
                { _description: 'Search for UK rock groups', query: 'artist:radiohead AND country:GB', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number', description: 'Total number of matching artists' },
                        offset: { type: 'number', description: 'Pagination offset' },
                        artists: {
                            type: 'array',
                            description: 'Array of artist objects',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', description: 'Artist MBID' },
                                    name: { type: 'string', description: 'Artist name' },
                                    'sort-name': { type: 'string', description: 'Name used for sorting' },
                                    disambiguation: { type: 'string', description: 'Comment to disambiguate similar names' },
                                    type: { type: 'string', description: 'Artist type: Person, Group, Orchestra, etc.' },
                                    country: { type: 'string', description: 'ISO 3166-1 alpha-2 country code' },
                                    score: { type: 'number', description: 'Search relevance score' }
                                }
                            }
                        }
                    }
                }
            }
        },
        lookupArtist: {
            method: 'GET',
            path: '/artist/:mbid',
            description: 'Look up full details for an artist by their MusicBrainz ID (MBID). Optionally include related data like releases, recordings, release-groups, and tags.',
            parameters: [
                { position: { key: 'mbid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'inc', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'fmt', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Look up The Beatles by MBID', mbid: 'b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d' },
                { _description: 'Look up David Bowie with release groups included', mbid: '5441c29d-3602-4898-b1a1-b77fa23b8e50', inc: 'release-groups' },
                { _description: 'Look up Radiohead with tags', mbid: 'a74b1b7f-71a5-4011-9441-d0b5e4122711', inc: 'tags' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Artist MBID' },
                        name: { type: 'string', description: 'Artist name' },
                        'sort-name': { type: 'string', description: 'Name used for sorting' },
                        type: { type: 'string', description: 'Artist type' },
                        country: { type: 'string', description: 'Country code' },
                        'life-span': { type: 'object', description: 'Begin and end dates' },
                        tags: { type: 'array', description: 'Genre and subject tags' },
                        'release-groups': { type: 'array', description: 'Associated release groups (if requested)' }
                    }
                }
            }
        },
        searchRecording: {
            method: 'GET',
            path: '/recording',
            description: 'Search for recordings (tracks/songs) by title, artist, ISRC, duration, or release. Returns matching recordings with their MBIDs, artist credits, and release info.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'fmt', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for "Bohemian Rhapsody" by Queen', query: 'Bohemian Rhapsody AND artist:Queen' },
                { _description: 'Search for recordings titled "Yesterday"', query: 'recording:Yesterday AND artist:Beatles' },
                { _description: 'Search for recordings by ISRC', query: 'isrc:GBAYE0601498' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number', description: 'Total number of matching recordings' },
                        offset: { type: 'number', description: 'Pagination offset' },
                        recordings: {
                            type: 'array',
                            description: 'Array of recording objects',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', description: 'Recording MBID' },
                                    title: { type: 'string', description: 'Recording title' },
                                    length: { type: 'number', description: 'Duration in milliseconds' },
                                    'first-release-date': { type: 'string', description: 'First release date' },
                                    'artist-credit': { type: 'array', description: 'Credited artists' },
                                    releases: { type: 'array', description: 'Releases containing this recording' },
                                    score: { type: 'number', description: 'Search relevance score' }
                                }
                            }
                        }
                    }
                }
            }
        },
        searchRelease: {
            method: 'GET',
            path: '/release',
            description: 'Search for releases (albums, singles, EPs) by title, artist, barcode, label, or date. Returns matching releases with their MBIDs, formats, and label info.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'fmt', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for Abbey Road album by The Beatles', query: 'Abbey Road AND artist:Beatles' },
                { _description: 'Search for Dark Side of the Moon', query: 'Dark Side of the Moon AND artist:Pink Floyd' },
                { _description: 'Search by barcode', query: 'barcode:724353966522' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number', description: 'Total number of matching releases' },
                        offset: { type: 'number', description: 'Pagination offset' },
                        releases: {
                            type: 'array',
                            description: 'Array of release objects',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', description: 'Release MBID' },
                                    title: { type: 'string', description: 'Release title' },
                                    status: { type: 'string', description: 'Release status (Official, Bootleg, etc.)' },
                                    date: { type: 'string', description: 'Release date' },
                                    country: { type: 'string', description: 'Release country' },
                                    'label-info': { type: 'array', description: 'Label and catalog number info' },
                                    'artist-credit': { type: 'array', description: 'Credited artists' },
                                    score: { type: 'number', description: 'Search relevance score' }
                                }
                            }
                        }
                    }
                }
            }
        },
        lookupRecording: {
            method: 'GET',
            path: '/recording/:mbid',
            description: 'Look up full details for a recording by its MBID. Optionally include artists, releases, isrcs, and tags.',
            parameters: [
                { position: { key: 'mbid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'inc', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'fmt', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Look up Bohemian Rhapsody by Queen', mbid: '7844d4d0-0254-43ff-8bd2-e4b6ffcc9a8f' },
                { _description: 'Look up a recording with artist and release details', mbid: '7844d4d0-0254-43ff-8bd2-e4b6ffcc9a8f', inc: 'artists releases isrcs' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Recording MBID' },
                        title: { type: 'string', description: 'Recording title' },
                        length: { type: 'number', description: 'Duration in milliseconds' },
                        'first-release-date': { type: 'string', description: 'First release date' },
                        'artist-credit': { type: 'array', description: 'Credited artists' },
                        releases: { type: 'array', description: 'Releases containing this recording' },
                        isrcs: { type: 'array', description: 'ISRC codes for this recording' },
                        tags: { type: 'array', description: 'Tags on this recording' }
                    }
                }
            }
        },
        searchReleaseGroup: {
            method: 'GET',
            path: '/release-group',
            description: 'Search for release groups (logical groupings of releases, typically albums or singles) by title or artist. Returns matching release groups with type and date information.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'fmt', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for all Led Zeppelin albums', query: 'artist:Led Zeppelin AND primarytype:Album' },
                { _description: 'Search for Thriller release group', query: 'Thriller AND artist:Michael Jackson' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number', description: 'Total number of matching release groups' },
                        offset: { type: 'number', description: 'Pagination offset' },
                        'release-groups': {
                            type: 'array',
                            description: 'Array of release group objects',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', description: 'Release group MBID' },
                                    title: { type: 'string', description: 'Release group title' },
                                    'primary-type': { type: 'string', description: 'Primary type: Album, Single, EP, etc.' },
                                    'secondary-types': { type: 'array', description: 'Secondary types: Live, Compilation, etc.' },
                                    'first-release-date': { type: 'string', description: 'Date of first release' },
                                    'artist-credit': { type: 'array', description: 'Credited artists' },
                                    score: { type: 'number', description: 'Search relevance score' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
