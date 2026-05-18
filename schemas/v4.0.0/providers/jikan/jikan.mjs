export const main = {
    namespace: 'jikan',
    name: 'Jikan MyAnimeList API',
    description: 'Access anime and manga data from MyAnimeList via the Jikan API. Search 25,000+ anime and 60,000+ manga titles. Get detailed information including synopsis, ratings, episodes, characters, and recommendations. Covers anime, manga, characters, and people. Free, no API key required. Rate limit: 3 requests/second.',
    version: '4.0.0',
    docs: ['https://docs.api.jikan.moe/'],
    tags: ['entertainment', 'anime', 'manga', 'opendata', 'cacheTtlDaily'],
    root: 'https://api.jikan.moe',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchAnime: {
            method: 'GET',
            path: '/v4/anime',
            description: 'Search anime by title, type, status, rating, or genre. Returns detailed anime information including score, episodes, synopsis, and images. Types: tv, movie, ova, special, ona, music. Use getAnime with a mal_id from results for full details.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Search query for anime title' },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(tv,movie,ova,special,ona,music)', options: ['optional()'] }, description: 'Anime type filter' },
                { position: { key: 'status', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(airing,complete,upcoming)', options: ['optional()'] }, description: 'Airing status filter' },
                { position: { key: 'rating', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(g,pg,pg13,r17,r,rx)', options: ['optional()'] }, description: 'Age rating filter (g=all ages, pg=children, pg13=teens, r17=violence, r=mild nudity, rx=explicit)' },
                { position: { key: 'order_by', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(score,rank,popularity,members,favorites)', options: ['optional()'] }, description: 'Field to sort results by' },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(asc,desc)', options: ['optional()'] }, description: 'Sort direction' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'max(25)'] }, description: 'Results per page (max 25)' },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] }, description: 'Page number for pagination' }
            ],
            tests: [
                { _description: 'Search Naruto', q: 'naruto', limit: 3 },
                { _description: 'Top rated anime movies', type: 'movie', order_by: 'score', sort: 'desc', limit: 3 },
                { _description: 'Search currently airing TV anime', status: 'airing', type: 'tv', order_by: 'score', sort: 'desc', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated anime search results with detailed metadata',
                    properties: {
                        data: {
                            type: 'array',
                            description: 'Array of anime entries matching the search criteria',
                            items: {
                                type: 'object',
                                properties: {
                                    mal_id: { type: 'number', description: 'MyAnimeList unique anime ID (use with getAnime for full details)' },
                                    title: { type: 'string', description: 'Anime title in romanized Japanese' },
                                    title_english: { type: 'string', description: 'Official English title' },
                                    type: { type: 'string', description: 'Anime type: TV, Movie, OVA, Special, ONA, Music' },
                                    episodes: { type: 'number', description: 'Total episode count (null if ongoing/unknown)' },
                                    status: { type: 'string', description: 'Airing status: Currently Airing, Finished Airing, Not yet aired' },
                                    score: { type: 'number', description: 'Community score from 1-10 (weighted average)' },
                                    scored_by: { type: 'number', description: 'Number of users who submitted a score' },
                                    rank: { type: 'number', description: 'Overall ranking position on MyAnimeList' },
                                    synopsis: { type: 'string', description: 'Plot summary/description' },
                                    year: { type: 'number', description: 'Year of premiere' },
                                    genres: { type: 'array', description: 'Array of genre objects with mal_id, type, name, and url' },
                                    images: { type: 'object', description: 'Image URLs in jpg and webp formats with small/large variants' }
                                }
                            }
                        },
                        pagination: {
                            type: 'object',
                            description: 'Pagination info for navigating result pages',
                            properties: {
                                last_visible_page: { type: 'number', description: 'Last available page number' },
                                has_next_page: { type: 'boolean', description: 'Whether more pages of results exist' }
                            }
                        }
                    }
                }
            }
        },
        getAnime: {
            method: 'GET',
            path: '/v4/anime/:id',
            description: 'Get detailed information about a specific anime by MAL ID. Returns complete metadata including synopsis, score, episodes, studios, producers, and streaming platforms. Use searchAnime or getTopAnime to find MAL IDs.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] }, description: 'MyAnimeList anime ID (from searchAnime or getTopAnime results)' }
            ],
            tests: [
                { _description: 'Get Naruto (MAL 20)', id: 20 },
                { _description: 'Get Spirited Away (MAL 199)', id: 199 },
                { _description: 'Get Attack on Titan (MAL 16498)', id: 16498 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Complete anime record with all available metadata',
                    properties: {
                        data: {
                            type: 'object',
                            description: 'Full anime details',
                            properties: {
                                mal_id: { type: 'number', description: 'MyAnimeList unique anime ID' },
                                title: { type: 'string', description: 'Anime title in romanized Japanese' },
                                title_english: { type: 'string', description: 'Official English title' },
                                type: { type: 'string', description: 'Anime type: TV, Movie, OVA, Special, ONA, Music' },
                                episodes: { type: 'number', description: 'Total episode count' },
                                status: { type: 'string', description: 'Airing status' },
                                score: { type: 'number', description: 'Community score from 1-10' },
                                rank: { type: 'number', description: 'Overall ranking position' },
                                popularity: { type: 'number', description: 'Popularity ranking based on member count' },
                                synopsis: { type: 'string', description: 'Full plot summary/description' },
                                studios: { type: 'array', description: 'Array of animation studio objects' },
                                genres: { type: 'array', description: 'Array of genre objects' },
                                themes: { type: 'array', description: 'Array of thematic tags (e.g. Mecha, School)' },
                                streaming: { type: 'array', description: 'Array of streaming platform objects with name and url' },
                                images: { type: 'object', description: 'Image URLs in jpg and webp formats' }
                            }
                        }
                    }
                }
            }
        },
        searchManga: {
            method: 'GET',
            path: '/v4/manga',
            description: 'Search manga by title, type, status, or genre. Types: manga, novel, lightnovel, oneshot, doujin, manhwa, manhua. Use getTopAnime for anime rankings instead.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Search query for manga title' },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(manga,novel,lightnovel,oneshot,doujin,manhwa,manhua)', options: ['optional()'] }, description: 'Manga type filter' },
                { position: { key: 'order_by', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(score,rank,popularity,members,favorites)', options: ['optional()'] }, description: 'Field to sort results by' },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(asc,desc)', options: ['optional()'] }, description: 'Sort direction' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'max(25)'] }, description: 'Results per page (max 25)' }
            ],
            tests: [
                { _description: 'Search One Piece', q: 'one piece', limit: 3 },
                { _description: 'Top rated manga by score', order_by: 'score', sort: 'desc', limit: 5 },
                { _description: 'Search for manhwa (Korean comics)', type: 'manhwa', order_by: 'score', sort: 'desc', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated manga search results with detailed metadata',
                    properties: {
                        data: {
                            type: 'array',
                            description: 'Array of manga entries matching the search criteria',
                            items: {
                                type: 'object',
                                properties: {
                                    mal_id: { type: 'number', description: 'MyAnimeList unique manga ID' },
                                    title: { type: 'string', description: 'Manga title in romanized Japanese' },
                                    title_english: { type: 'string', description: 'Official English title' },
                                    type: { type: 'string', description: 'Manga type: Manga, Novel, Light Novel, One-shot, Doujinshi, Manhwa, Manhua' },
                                    chapters: { type: 'number', description: 'Total chapter count (null if ongoing/unknown)' },
                                    volumes: { type: 'number', description: 'Total volume count (null if ongoing/unknown)' },
                                    status: { type: 'string', description: 'Publishing status: Publishing, Finished, On Hiatus, Discontinued' },
                                    score: { type: 'number', description: 'Community score from 1-10' },
                                    synopsis: { type: 'string', description: 'Plot summary/description' },
                                    genres: { type: 'array', description: 'Array of genre objects' },
                                    images: { type: 'object', description: 'Cover image URLs in jpg and webp formats' }
                                }
                            }
                        },
                        pagination: { type: 'object', description: 'Pagination info for navigating result pages' }
                    }
                }
            }
        },
        getTopAnime: {
            method: 'GET',
            path: '/v4/top/anime',
            description: 'Get top-ranked anime from MyAnimeList. Filter by type and ranking criteria. Use getAnime with a mal_id from results for complete details.',
            parameters: [
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(tv,movie,ova,special,ona,music)', options: ['optional()'] }, description: 'Anime type filter' },
                { position: { key: 'filter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(airing,upcoming,bypopularity,favorite)', options: ['optional()'] }, description: 'Ranking filter: airing (currently on), upcoming, bypopularity, or favorite' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'max(25)'] }, description: 'Results per page (max 25)' },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] }, description: 'Page number for pagination' }
            ],
            tests: [
                { _description: 'Top 5 anime', limit: 5 },
                { _description: 'Top anime movies', type: 'movie', limit: 5 },
                { _description: 'Most popular currently airing anime', filter: 'airing', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Top-ranked anime list with detailed metadata',
                    properties: {
                        data: {
                            type: 'array',
                            description: 'Array of top-ranked anime entries',
                            items: {
                                type: 'object',
                                properties: {
                                    mal_id: { type: 'number', description: 'MyAnimeList unique anime ID (use with getAnime for full details)' },
                                    title: { type: 'string', description: 'Anime title in romanized Japanese' },
                                    score: { type: 'number', description: 'Community score from 1-10' },
                                    rank: { type: 'number', description: 'Overall ranking position' },
                                    episodes: { type: 'number', description: 'Total episode count' },
                                    type: { type: 'string', description: 'Anime type: TV, Movie, OVA, etc.' },
                                    images: { type: 'object', description: 'Image URLs in jpg and webp formats' }
                                }
                            }
                        },
                        pagination: { type: 'object', description: 'Pagination info for navigating result pages' }
                    }
                }
            }
        }
    }
}
