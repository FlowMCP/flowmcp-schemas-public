export const main = {
    namespace: 'biorxiv',
    name: 'bioRxiv / medRxiv',
    description: 'Access bioRxiv and medRxiv preprint metadata including content details, publication records, publisher data, and summary statistics for scientific preprints.',
    version: '4.0.0',
    docs: ['https://api.biorxiv.org/'],
    tags: ['science', 'preprints', 'biology', 'medicine', 'research', 'cacheTtlDaily'],
    root: 'https://api.biorxiv.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        getContentDetails: {
            method: 'GET',
            path: '/details/:server/:startDate/:endDate/:cursor',
            description: 'Get detailed preprint metadata for a date range. Returns title, authors, DOI, abstract, category, and version info. Paginated with 100 results per call.',
            parameters: [
                { position: { key: 'server', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(biorxiv,medrxiv)', options: [] }, description: 'Preprint server to query: biorxiv for biology, medrxiv for medicine' },
                { position: { key: 'startDate', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Start date for the query range in YYYY-MM-DD format (e.g. 2024-01-15)' },
                { position: { key: 'endDate', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'End date for the query range in YYYY-MM-DD format (e.g. 2024-01-15)' },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] }, description: 'Pagination cursor offset, increments by 100 per page (0, 100, 200, ...)' }
            ],
            tests: [
                { _description: 'Get bioRxiv preprints for a single day', server: 'biorxiv', startDate: '2024-01-15', endDate: '2024-01-15', cursor: 0 },
                { _description: 'Get medRxiv preprints for a single day', server: 'medrxiv', startDate: '2024-01-15', endDate: '2024-01-15', cursor: 0 },
                { _description: 'Get bioRxiv preprints page 2', server: 'biorxiv', startDate: '2024-01-15', endDate: '2024-01-15', cursor: 100 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        messages: { type: 'array', items: { type: 'object', properties: { status: { type: 'string' }, category: { type: 'string' }, interval: { type: 'string' }, cursor: { type: 'number' }, count: { type: 'number' }, total: { type: 'string' } } } },
                        collection: { type: 'array', items: { type: 'object', properties: { doi: { type: 'string' }, title: { type: 'string' }, authors: { type: 'string' }, author_corresponding: { type: 'string' }, author_corresponding_institution: { type: 'string' }, date: { type: 'string' }, version: { type: 'string' }, type: { type: 'string' }, license: { type: 'string' }, category: { type: 'string' }, abstract: { type: 'string' }, published: { type: 'string' }, server: { type: 'string' } } } }
                    }
                }
            },
        },
        getDetailsByDoi: {
            method: 'GET',
            path: '/details/:server/:doi/na/json',
            description: 'Get detailed metadata for a specific preprint by its DOI. Returns all versions and revision history.',
            parameters: [
                { position: { key: 'server', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(biorxiv,medrxiv)', options: [] }, description: 'Preprint server to query: biorxiv for biology, medrxiv for medicine' },
                { position: { key: 'doi', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'DOI of the preprint (e.g. 10.1101/2024.01.01.573838)' }
            ],
            tests: [
                { _description: 'Get details for a specific bioRxiv preprint', server: 'biorxiv', doi: '10.1101/2024.01.01.573838' },
                { _description: 'Get details for another bioRxiv preprint', server: 'biorxiv', doi: '10.1101/2021.03.15.435381' },
                { _description: 'Get details for a medRxiv preprint', server: 'medrxiv', doi: '10.1101/2024.01.01.24300687' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        messages: { type: 'array' },
                        collection: { type: 'array', items: { type: 'object', properties: { doi: { type: 'string' }, title: { type: 'string' }, authors: { type: 'string' }, abstract: { type: 'string' }, version: { type: 'string' }, type: { type: 'string' }, date: { type: 'string' }, category: { type: 'string' }, server: { type: 'string' } } } }
                    }
                }
            },
        },
        getPublishedArticles: {
            method: 'GET',
            path: '/pubs/:server/:startDate/:endDate/:cursor',
            description: 'Get preprints that have been published in peer-reviewed journals within a date range. Returns DOI mappings between preprint and published versions.',
            parameters: [
                { position: { key: 'server', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(biorxiv,medrxiv)', options: [] }, description: 'Preprint server to query: biorxiv for biology, medrxiv for medicine' },
                { position: { key: 'startDate', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Start date in YYYY-MM-DD format (e.g. 2024-01-01)' },
                { position: { key: 'endDate', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'End date in YYYY-MM-DD format (e.g. 2024-01-07)' },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] }, description: 'Pagination cursor offset, increments by 100 per page' }
            ],
            tests: [
                { _description: 'Get published articles from bioRxiv for a date range', server: 'biorxiv', startDate: '2024-01-01', endDate: '2024-01-07', cursor: 0 },
                { _description: 'Get published articles from medRxiv', server: 'medrxiv', startDate: '2024-01-01', endDate: '2024-01-07', cursor: 0 },
                { _description: 'Get published articles page 2', server: 'biorxiv', startDate: '2024-01-01', endDate: '2024-01-07', cursor: 100 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        messages: { type: 'array' },
                        collection: { type: 'array', items: { type: 'object', properties: { biorxiv_doi: { type: 'string' }, published_doi: { type: 'string' }, preprint_title: { type: 'string' }, published_journal: { type: 'string' }, published_date: { type: 'string' } } } }
                    }
                }
            },
        },
        getPublisherArticles: {
            method: 'GET',
            path: '/publisher/:prefix/:startDate/:endDate/:cursor',
            description: 'Get preprints published by a specific publisher using their DOI prefix. Returns preprint-to-journal mappings for the publisher.',
            parameters: [
                { position: { key: 'prefix', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'DOI prefix of the publisher (e.g. 10.15252 for EMBO Press, 10.1038 for Nature)' },
                { position: { key: 'startDate', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Start date in YYYY-MM-DD format (e.g. 2024-01-01)' },
                { position: { key: 'endDate', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'End date in YYYY-MM-DD format (e.g. 2024-01-31)' },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] }, description: 'Pagination cursor offset, increments by 100 per page' }
            ],
            tests: [
                { _description: 'Get EMBO Press preprints (prefix 10.15252)', prefix: '10.15252', startDate: '2024-01-01', endDate: '2024-01-31', cursor: 0 },
                { _description: 'Get Nature preprints (prefix 10.1038)', prefix: '10.1038', startDate: '2024-01-01', endDate: '2024-01-31', cursor: 0 },
                { _description: 'Get PLOS preprints (prefix 10.1371)', prefix: '10.1371', startDate: '2024-01-01', endDate: '2024-01-31', cursor: 0 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        messages: { type: 'array' },
                        collection: { type: 'array', items: { type: 'object', properties: { biorxiv_doi: { type: 'string' }, published_doi: { type: 'string' }, preprint_title: { type: 'string' }, published_journal: { type: 'string' } } } }
                    }
                }
            },
        },
        getSummaryStatistics: {
            method: 'GET',
            path: '/sum/:interval/json',
            description: 'Get summary statistics for bioRxiv and medRxiv submissions. Returns monthly or yearly counts of new papers, revised papers, and published articles.',
            parameters: [
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(m,y)', options: [] }, description: 'Time interval for aggregation: m=monthly, y=yearly' }
            ],
            tests: [
                { _description: 'Get yearly summary statistics', interval: 'y' },
                { _description: 'Get monthly summary statistics', interval: 'm' },
                { _description: 'Get yearly submission trends', interval: 'y' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        messages: { type: 'object', properties: { status: { type: 'string' }, category: { type: 'string' }, interval: { type: 'string' } } },
                        'bioRxiv content statistics': { type: 'array', items: { type: 'object', properties: { year: { type: 'number' }, new_papers: { type: 'number' }, new_papers_cumulative: { type: 'number' }, revised_papers: { type: 'number' }, revised_papers_cumulative: { type: 'number' } } } }
                    }
                }
            },
        },
        getUsageStatistics: {
            method: 'GET',
            path: '/usage/:interval/:server/json',
            description: 'Get usage statistics (abstract views and full-text downloads) for bioRxiv or medRxiv by monthly or yearly intervals.',
            parameters: [
                { position: { key: 'interval', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(m,y)', options: [] }, description: 'Time interval for aggregation: m=monthly, y=yearly' },
                { position: { key: 'server', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(biorxiv,medrxiv)', options: [] }, description: 'Preprint server to query usage stats for: biorxiv or medrxiv' }
            ],
            tests: [
                { _description: 'Get yearly usage stats for bioRxiv', interval: 'y', server: 'biorxiv' },
                { _description: 'Get yearly usage stats for medRxiv', interval: 'y', server: 'medrxiv' },
                { _description: 'Get monthly usage stats for bioRxiv', interval: 'm', server: 'biorxiv' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        messages: { type: 'object', properties: { status: { type: 'string' } } },
                        'bioRxiv content statistics': { type: 'array', items: { type: 'object', properties: { year: { type: 'string' }, abstract_views: { type: 'string' }, full_text_views: { type: 'string' }, pdf_downloads: { type: 'string' }, abstract_cumulative: { type: 'number' }, full_text_cumulative: { type: 'number' }, pdf_cumulative: { type: 'number' } } } }
                    }
                }
            },
        }
    }
}
