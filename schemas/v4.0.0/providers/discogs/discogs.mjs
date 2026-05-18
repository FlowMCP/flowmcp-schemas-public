export const main = {
    namespace: 'discogs',
    name: 'Discogs',
    description: 'Search and browse the Discogs music database with 19M+ releases, 9.9M+ artists, and 2.2M+ labels. Get detailed release, artist, and label information.',
    version: '4.0.0',
    docs: ['https://www.discogs.com/developers'],
    tags: ['music', 'releases', 'artists', 'vinyl', 'database', 'cacheTtlDaily'],
    root: 'https://api.discogs.com',
    requiredServerParams: [],
    headers: {
        'User-Agent': 'FlowMCP/1.0'
    },
    tools: {
        search: {
            method: 'GET',
            path: '/database/search',
            description: 'Search the Discogs database for releases, artists, and labels. Supports filtering by type, title, artist, and more.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Search query string for artist, release, or label name' },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(release,master,artist,label)', options: ['optional()'] }, description: 'Result type filter: release, master, artist, or label' },
                { position: { key: 'genre', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Filter by music genre, e.g. Rock, Electronic, Jazz' },
                { position: { key: 'style', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Filter by music style, e.g. Grunge, Techno, Bebop' },
                { position: { key: 'country', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Filter by country of release, e.g. US, UK, Germany' },
                { position: { key: 'year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Filter by release year, e.g. 1991 or range 1990-1995' },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)'] }, description: 'Number of results per page (default 50)' },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] }, description: 'Page number for pagination (default 1)' }
            ],
            tests: [
                { _description: 'Search for Nirvana artists', q: 'Nirvana', type: 'artist', per_page: 5, page: 1 },
                { _description: 'Search for Electronic releases', q: 'Kraftwerk', type: 'release', per_page: 5 },
                { _description: 'Search for Warp Records label', q: 'Warp Records', type: 'label', per_page: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        pagination: { type: 'object', description: 'Pagination metadata', properties: { page: { type: 'number', description: 'Current page number' }, pages: { type: 'number', description: 'Total number of pages' }, per_page: { type: 'number', description: 'Items per page' }, items: { type: 'number', description: 'Total number of items' } } },
                        results: { type: 'array', description: 'Array of search result objects', items: { type: 'object', properties: { id: { type: 'number', description: 'Discogs resource ID' }, type: { type: 'string', description: 'Result type: release, master, artist, or label' }, title: { type: 'string', description: 'Title of the result' }, uri: { type: 'string', description: 'Discogs web URI' }, resource_url: { type: 'string', description: 'Discogs API resource URL' } } } }
                    }
                }
            },
        },
        getRelease: {
            method: 'GET',
            path: '/releases/:releaseId',
            description: 'Get detailed information for a specific release including tracklist, artists, labels, formats, and community statistics.',
            parameters: [
                { position: { key: 'releaseId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] }, description: 'Discogs release ID number' }
            ],
            tests: [
                { _description: 'Get Rick Astley - Never Gonna Give You Up (release 249504)', releaseId: 249504 },
                { _description: 'Get Nirvana - Nevermind (release 377072)', releaseId: 377072 },
                { _description: 'Get Daft Punk - Discovery (release 66529)', releaseId: 66529 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', description: 'Discogs release ID' },
                        title: { type: 'string', description: 'Release title' },
                        year: { type: 'number', description: 'Release year' },
                        status: { type: 'string', description: 'Release status (Accepted, Draft, etc.)' },
                        artists: { type: 'array', description: 'Artists on this release', items: { type: 'object', properties: { name: { type: 'string', description: 'Artist name' }, id: { type: 'number', description: 'Discogs artist ID' } } } },
                        labels: { type: 'array', description: 'Record labels for this release', items: { type: 'object', properties: { name: { type: 'string', description: 'Label name' }, catno: { type: 'string', description: 'Catalog number' } } } },
                        genres: { type: 'array', description: 'Music genres' },
                        styles: { type: 'array', description: 'Music styles (sub-genres)' },
                        tracklist: { type: 'array', description: 'Ordered list of tracks', items: { type: 'object', properties: { position: { type: 'string', description: 'Track position (e.g. A1, B2, 1)' }, title: { type: 'string', description: 'Track title' }, duration: { type: 'string', description: 'Track duration' } } } }
                    }
                }
            },
        },
        getMasterRelease: {
            method: 'GET',
            path: '/masters/:masterId',
            description: 'Get the master release which groups all versions of a release. Returns main release ID, tracklist, and version count.',
            parameters: [
                { position: { key: 'masterId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] }, description: 'Discogs master release ID number' }
            ],
            tests: [
                { _description: 'Get master release for Never Gonna Give You Up (master 96559)', masterId: 96559 },
                { _description: 'Get master release for Nevermind (master 13814)', masterId: 13814 },
                { _description: 'Get master release for OK Computer (master 21262)', masterId: 21262 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', description: 'Discogs master release ID' },
                        title: { type: 'string', description: 'Master release title' },
                        main_release: { type: 'number', description: 'ID of the main (most common) release version' },
                        most_recent_release: { type: 'number', description: 'ID of the most recently added version' },
                        num_for_sale: { type: 'number', description: 'Number of copies for sale on Discogs marketplace' },
                        lowest_price: { type: 'number', description: 'Lowest marketplace price in USD' },
                        year: { type: 'number', description: 'Original release year' },
                        artists: { type: 'array', description: 'Artists on this master release', items: { type: 'object', properties: { name: { type: 'string', description: 'Artist name' }, id: { type: 'number', description: 'Discogs artist ID' } } } },
                        genres: { type: 'array', description: 'Music genres' },
                        styles: { type: 'array', description: 'Music styles (sub-genres)' },
                        tracklist: { type: 'array', description: 'Ordered list of tracks', items: { type: 'object', properties: { position: { type: 'string', description: 'Track position' }, title: { type: 'string', description: 'Track title' }, duration: { type: 'string', description: 'Track duration' } } } }
                    }
                }
            },
        },
        getArtist: {
            method: 'GET',
            path: '/artists/:artistId',
            description: 'Get detailed information for a specific artist including profile, name variations, URLs, and images.',
            parameters: [
                { position: { key: 'artistId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] }, description: 'Discogs artist ID number' }
            ],
            tests: [
                { _description: 'Get artist Nickelback (ID 108713)', artistId: 108713 },
                { _description: 'Get artist Radiohead (ID 3840)', artistId: 3840 },
                { _description: 'Get artist Aphex Twin (ID 45)', artistId: 45 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', description: 'Discogs artist ID' },
                        name: { type: 'string', description: 'Artist name' },
                        profile: { type: 'string', description: 'Artist biography and description' },
                        uri: { type: 'string', description: 'Discogs web URI for this artist' },
                        releases_url: { type: 'string', description: 'API URL for artist releases' },
                        namevariations: { type: 'array', description: 'Alternative name spellings and variations' },
                        urls: { type: 'array', description: 'External website URLs' },
                        members: { type: 'array', description: 'Band or group members', items: { type: 'object', properties: { id: { type: 'number', description: 'Member artist ID' }, name: { type: 'string', description: 'Member name' }, active: { type: 'boolean', description: 'Whether member is currently active' } } } }
                    }
                }
            },
        },
        getArtistReleases: {
            method: 'GET',
            path: '/artists/:artistId/releases',
            description: 'Get a paginated list of releases by a specific artist. Includes masters, releases, and appearances.',
            parameters: [
                { position: { key: 'artistId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] }, description: 'Discogs artist ID number' },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(year,title,format)', options: ['optional()', 'default(year)'] }, description: 'Sort field: year, title, or format' },
                { position: { key: 'sort_order', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(asc,desc)', options: ['optional()', 'default(asc)'] }, description: 'Sort direction: ascending or descending' },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)'] }, description: 'Number of results per page (default 50)' },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] }, description: 'Page number for pagination (default 1)' }
            ],
            tests: [
                { _description: 'Get Nickelback releases sorted by year', artistId: 108713, sort: 'year', sort_order: 'desc', per_page: 5, page: 1 },
                { _description: 'Get Radiohead releases by title', artistId: 3840, sort: 'title', per_page: 5 },
                { _description: 'Get Aphex Twin releases', artistId: 45, sort: 'year', sort_order: 'desc', per_page: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        pagination: { type: 'object', description: 'Pagination metadata', properties: { page: { type: 'number', description: 'Current page number' }, pages: { type: 'number', description: 'Total number of pages' }, per_page: { type: 'number', description: 'Items per page' }, items: { type: 'number', description: 'Total number of items' } } },
                        releases: { type: 'array', description: 'Array of release objects', items: { type: 'object', properties: { id: { type: 'number', description: 'Discogs release ID' }, title: { type: 'string', description: 'Release title' }, type: { type: 'string', description: 'Release type: master or release' }, year: { type: 'number', description: 'Release year' }, artist: { type: 'string', description: 'Artist name' }, role: { type: 'string', description: 'Artist role (Main, Appearance, etc.)' }, resource_url: { type: 'string', description: 'Discogs API resource URL' } } } }
                    }
                }
            },
        },
        getLabel: {
            method: 'GET',
            path: '/labels/:labelId',
            description: 'Get detailed information for a specific record label including profile, contact info, and sub-labels.',
            parameters: [
                { position: { key: 'labelId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] }, description: 'Discogs record label ID number' }
            ],
            tests: [
                { _description: 'Get label Planet E (ID 1)', labelId: 1 },
                { _description: 'Get label Warp Records (ID 23528)', labelId: 23528 },
                { _description: 'Get label Sub Pop (ID 19)', labelId: 19 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', description: 'Discogs label ID' },
                        name: { type: 'string', description: 'Label name' },
                        profile: { type: 'string', description: 'Label description and history' },
                        uri: { type: 'string', description: 'Discogs web URI for this label' },
                        releases_url: { type: 'string', description: 'API URL for label releases' },
                        contact_info: { type: 'string', description: 'Label contact information' },
                        sublabels: { type: 'array', description: 'Sub-labels owned by this label', items: { type: 'object', properties: { id: { type: 'number', description: 'Sub-label ID' }, name: { type: 'string', description: 'Sub-label name' } } } },
                        urls: { type: 'array', description: 'External website URLs' }
                    }
                }
            },
        }
    }
}
