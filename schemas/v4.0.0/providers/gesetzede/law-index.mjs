// Gesetze aus dem Internet — Law Index (preloaded)
// Category: handlers-clean
// Source: https://gadi.netlify.app (https://github.com/nfelger/gesetze-aus-dem-internet)
// Note: The index page is an HTML file listing all 6,872 German federal laws.
// Preloaded and parsed into a searchable array, filtered client-side.
// No API key required — public static site.

export const main = {
    namespace: 'gesetzede',
    name: 'German Federal Laws Index',
    description: 'Search and browse the index of all German federal laws from gesetze-im-internet.de — 6,800+ laws with abbreviation, full title, and direct links',
    version: '4.0.0',
    docs: ['https://gadi.netlify.app', 'https://github.com/nfelger/gesetze-aus-dem-internet'],
    tags: ['law', 'germany', 'government', 'legal', 'opendata'],
    root: 'https://gadi.netlify.app',
    tools: {
        searchLaws: {
            method: 'GET',
            path: '/',
            description: 'Search German federal laws by keyword in abbreviation or title. Case-insensitive matching. Returns matching laws sorted by relevance (exact abbreviation match first, then title matches). Use getLawList for related data. Use getIndexStats for related data.',
            parameters: [
                {
                    position: {
                        key: 'q',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(1)']
                    }
                },
                {
                    position: {
                        key: 'limit',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(1)', 'max(500)', 'default(20)', 'optional()']
                    }
                },
                {
                    position: {
                        key: 'offset',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(0)', 'default(0)', 'optional()']
                    }
                }
            ],
            preload: {
                enabled: true,
                ttl: 604800,
                description: 'Full law index (~900KB parsed, 6,800+ entries, updated weekly)'
            },
            tests: [
                {
                    _description: 'Search for Grundgesetz',
                    q: 'Grundgesetz',
                    limit: 5
                },
                {
                    _description: 'Search by abbreviation BGB',
                    q: 'BGB',
                    limit: 5
                },
                {
                    _description: 'Search for Strafrecht',
                    q: 'Straf',
                    limit: 10
                },
                {
                    _description: 'Search for Handelsgesetzbuch',
                    q: 'HGB',
                    limit: 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from searchLaws',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getLawList: {
            method: 'GET',
            path: '/',
            description: 'Browse all German federal laws with pagination. Optionally filter by first letter of abbreviation. Use searchLaws for related data. Use getIndexStats for related data.',
            parameters: [
                {
                    position: {
                        key: 'letter',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(1)', 'max(1)', 'optional()']
                    }
                },
                {
                    position: {
                        key: 'limit',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(1)', 'max(500)', 'default(50)', 'optional()']
                    }
                },
                {
                    position: {
                        key: 'offset',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(0)', 'default(0)', 'optional()']
                    }
                }
            ],
            preload: {
                enabled: true,
                ttl: 604800,
                description: 'Full law index, optionally filtered by first letter'
            },
            tests: [
                {
                    _description: 'First 10 laws',
                    limit: 10
                },
                {
                    _description: 'Laws starting with G',
                    letter: 'G',
                    limit: 10
                },
                {
                    _description: 'Laws starting with S',
                    letter: 'S',
                    limit: 10
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getLawList',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getIndexStats: {
            method: 'GET',
            path: '/',
            description: 'Get statistics about the German federal law catalog: total count, distribution by first letter, and sample entries per letter. Use searchLaws for related data. Use getLawList for related data.',
            parameters: [],
            preload: {
                enabled: true,
                ttl: 604800,
                description: 'Aggregated statistics from full law index'
            },
            tests: [
                {
                    _description: 'Index statistics'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getIndexStats',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        }
    }
}

export const handlers = ( { sharedLists, libraries } ) => {
    const INDEX_URL = 'https://gadi.netlify.app'
    const ENTRY_REGEX = /href="laws\/([^"]+)\.json">([^<]+)<\/a>\s*\(<!--\s*-->([^<]*?)<!--\s*-->\)/g

    const _cache = { data: null, timestamp: null, ttl: 3600000 }

    const decodeHtmlEntities = ( { text } ) => {
        const entities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#039;': "'",
            '&apos;': "'",
            '&#x27;': "'"
        }

        const decoded = Object.entries( entities )
            .reduce( ( acc, [ entity, char ] ) => {
                const result = acc.split( entity ).join( char )

                return result
            }, text )

        return decoded
    }

    const fetchIndex = async () => {
        const now = Date.now()
        if( _cache.data && _cache.timestamp && ( now - _cache.timestamp ) < _cache.ttl ) {
            return { laws: _cache.data, fromCache: true }
        }

        const response = await fetch( INDEX_URL )
        if( !response.ok ) {
            throw new Error( `HTTP ${response.status}: ${response.statusText}` )
        }

        const html = await response.text()
        const laws = []
        const matches = html.matchAll( ENTRY_REGEX )

        Array.from( matches )
            .forEach( ( match ) => {
                const slug = match[1]
                const abbreviation = decodeHtmlEntities( { text: match[2] } )
                const title = decodeHtmlEntities( { text: match[3].trim() } )

                laws.push( { slug, abbreviation, title } )
            } )

        _cache.data = laws
        _cache.timestamp = now

        return { laws, fromCache: false }
    }

    return {
        searchLaws: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    const { laws, fromCache } = await fetchIndex()
                    const q = ( userParams.q || '' ).toLowerCase()
                    const limit = userParams.limit || 20
                    const offset = userParams.offset || 0

                    const scored = laws
                        .map( ( law ) => {
                            const abbrLower = law.abbreviation.toLowerCase()
                            const titleLower = law.title.toLowerCase()
                            let score = 0

                            if( abbrLower === q ) {
                                score = 100
                            } else if( abbrLower.startsWith( q ) ) {
                                score = 80
                            } else if( abbrLower.includes( q ) ) {
                                score = 60
                            } else if( titleLower.includes( q ) ) {
                                score = 40
                            }

                            return { law, score }
                        } )
                        .filter( ( { score } ) => score > 0 )
                        .sort( ( a, b ) => b.score - a.score )

                    const totalMatches = scored.length
                    const sliced = scored
                        .slice( offset, offset + limit )
                        .map( ( { law, score } ) => {
                            const result = {
                                slug: law.slug,
                                abbreviation: law.abbreviation,
                                title: law.title,
                                relevance: score,
                                jsonUrl: `https://gadi.netlify.app/laws/${law.slug}.json`
                            }

                            return result
                        } )

                    struct.data = {
                        source: 'Gesetze aus dem Internet',
                        query: q,
                        totalIndex: laws.length,
                        totalMatches,
                        returnedCount: sliced.length,
                        offset,
                        limit,
                        fromCache,
                        laws: sliced
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error searching law index: ${error.message}` )
                }

                return { struct }
            }
        },
        getLawList: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    const { laws, fromCache } = await fetchIndex()
                    const letter = ( userParams.letter || '' ).toUpperCase()
                    const limit = userParams.limit || 50
                    const offset = userParams.offset || 0

                    const filtered = letter
                        ? laws.filter( ( law ) => {
                            const firstChar = law.abbreviation.charAt( 0 ).toUpperCase()

                            return firstChar === letter
                        } )
                        : laws

                    const sliced = filtered
                        .slice( offset, offset + limit )
                        .map( ( law ) => {
                            const result = {
                                slug: law.slug,
                                abbreviation: law.abbreviation,
                                title: law.title,
                                jsonUrl: `https://gadi.netlify.app/laws/${law.slug}.json`
                            }

                            return result
                        } )

                    struct.data = {
                        source: 'Gesetze aus dem Internet',
                        filter: { letter: letter || null },
                        totalIndex: laws.length,
                        totalFiltered: filtered.length,
                        returnedCount: sliced.length,
                        offset,
                        limit,
                        fromCache,
                        laws: sliced
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching law list: ${error.message}` )
                }

                return { struct }
            }
        },
        getIndexStats: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { laws, fromCache } = await fetchIndex()
                    const letterCounts = {}

                    laws.forEach( ( law ) => {
                        const firstChar = law.abbreviation.charAt( 0 ).toUpperCase()
                        letterCounts[firstChar] = ( letterCounts[firstChar] || 0 ) + 1
                    } )

                    const distribution = Object.entries( letterCounts )
                        .sort( ( a, b ) => b[1] - a[1] )
                        .map( ( [ letter, count ] ) => {
                            const result = { letter, count }

                            return result
                        } )

                    struct.data = {
                        source: 'Gesetze aus dem Internet',
                        totalLaws: laws.length,
                        uniqueLetters: distribution.length,
                        fromCache,
                        distribution
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error computing index stats: ${error.message}` )
                }

                return { struct }
            }
        }
    }
}
