export const main = {
    namespace: 'retractionwatch',
    name: 'Retraction Watch / Crossref Retractions',
    description: 'Access 63K+ retracted and corrected scholarly articles via the Crossref API. Search retractions by date range, DOI, publisher, or keyword. Data sourced from Retraction Watch and publisher update notices.',
    version: '4.0.0',
    docs: ['https://api.crossref.org/swagger-ui/index.html', 'https://www.crossref.org/documentation/retrieve-metadata/rest-api/'],
    tags: ['science', 'retractions', 'scholarly', 'integrity', 'research', 'cacheTtlDaily'],
    root: 'https://api.crossref.org',
    requiredServerParams: [],
    headers: {
        'User-Agent': 'FlowMCP/1.0 (mailto:polite@flowmcp.org)'
    },
    tools: {
        getRetractions: {
            method: 'GET',
            path: '/works',
            description: 'List retracted works from Crossref with retraction update-type filter. Returns DOI, title, authors, publisher, and retraction metadata. Paginated with configurable rows.',
            parameters: [
                { position: { key: 'filter', value: 'update-type:retraction', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'rows', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(published,deposited,indexed,created)', options: ['optional()', 'default(deposited)'] } },
                { position: { key: 'order', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(asc,desc)', options: ['optional()', 'default(desc)'] } }
            ],
            tests: [
                { _description: 'Get 5 most recently deposited retractions', rows: 5, offset: 0, sort: 'deposited', order: 'desc' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        message: { type: 'object', properties: { 'total-results': { type: 'number' }, items: { type: 'array', items: { type: 'object', properties: { DOI: { type: 'string' }, title: { type: 'array' }, author: { type: 'array' }, publisher: { type: 'string' }, type: { type: 'string' }, 'update-to': { type: 'array' } } } } } }
                    }
                }
            },
        },
        getRetractionsByDateRange: {
            method: 'GET',
            path: '/works',
            description: 'List retracted works published within a specific date range. Combine retraction filter with from-pub-date and until-pub-date for temporal analysis.',
            parameters: [
                { position: { key: 'fromDate', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'untilDate', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'rows', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'Get retractions published in 2024', fromDate: '2024-01-01', untilDate: '2024-12-31', rows: 5, offset: 0 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        message: { type: 'object', properties: { 'total-results': { type: 'number' }, items: { type: 'array', items: { type: 'object', properties: { DOI: { type: 'string' }, title: { type: 'array' }, author: { type: 'array' }, publisher: { type: 'string' }, 'published-print': { type: 'object' }, 'update-to': { type: 'array' } } } } } }
                    }
                }
            },
        },
        searchRetractions: {
            method: 'GET',
            path: '/works',
            description: 'Search retracted works by keyword query. Combines free-text search with the retraction update-type filter to find specific retracted publications.',
            parameters: [
                { position: { key: 'filter', value: 'update-type:retraction', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'rows', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'Search retractions related to fraud', query: 'fabrication fraud', rows: 5, offset: 0 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        message: { type: 'object', properties: { 'total-results': { type: 'number' }, items: { type: 'array', items: { type: 'object', properties: { DOI: { type: 'string' }, title: { type: 'array' }, author: { type: 'array' }, publisher: { type: 'string' }, type: { type: 'string' }, score: { type: 'number' } } } } } }
                    }
                }
            },
        },
        getWorkByDoi: {
            method: 'GET',
            path: '/works/:doi',
            description: 'Get full metadata for a specific scholarly work by its DOI. Returns detailed information including title, authors, references, license, funding, and any update/retraction notices.',
            parameters: [
                { position: { key: 'doi', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get metadata for a Nature paper', doi: '10.1038/s41586-020-2649-2' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        message: { type: 'object', properties: { DOI: { type: 'string' }, title: { type: 'array' }, author: { type: 'array' }, publisher: { type: 'string' }, 'reference-count': { type: 'number' }, 'is-referenced-by-count': { type: 'number' }, type: { type: 'string' }, abstract: { type: 'string' } } }
                    }
                }
            },
        },
        getRetractionsFromPublisher: {
            method: 'GET',
            path: '/works',
            description: 'List retracted works from a specific publisher by combining retraction filter with member ID. Useful for analyzing retraction rates per publisher.',
            parameters: [
                { position: { key: 'memberId', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'rows', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'Get retractions from Elsevier (member 78)', memberId: '78', rows: 5, offset: 0 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        message: { type: 'object', properties: { 'total-results': { type: 'number' }, items: { type: 'array', items: { type: 'object', properties: { DOI: { type: 'string' }, title: { type: 'array' }, author: { type: 'array' }, publisher: { type: 'string' }, 'update-to': { type: 'array' } } } } } }
                    }
                }
            },
        },
        searchJournals: {
            method: 'GET',
            path: '/journals',
            description: 'Search for journals by name. Returns journal metadata including ISSN, publisher, and DOI coverage statistics. Useful for identifying journals with retraction histories.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'rows', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } }
            ],
            tests: [
                { _description: 'Search for Nature journals', query: 'nature', rows: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        message: { type: 'object', properties: { 'total-results': { type: 'number' }, items: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, publisher: { type: 'string' }, ISSN: { type: 'array' }, counts: { type: 'object' }, coverage: { type: 'object' } } } } } }
                    }
                }
            },
        }
    }
}


export const handlers = () => ( {
    getRetractionsByDateRange: {
        preRequest: async ( { struct, payload } ) => {
            const { userParams } = payload
            const fromDate = userParams.fromDate
            const untilDate = userParams.untilDate

            struct.url.searchParams.set( 'filter', `update-type:retraction,from-pub-date:${fromDate},until-pub-date:${untilDate}` )
            delete payload.userParams.fromDate
            delete payload.userParams.untilDate

            return { struct, payload }
        }
    },
    getRetractionsFromPublisher: {
        preRequest: async ( { struct, payload } ) => {
            const { userParams } = payload
            const memberId = userParams.memberId

            struct.url.searchParams.set( 'filter', `update-type:retraction,member:${memberId}` )
            delete payload.userParams.memberId

            return { struct, payload }
        }
    }
} )
