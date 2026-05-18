// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'arbeitsagentur',
    name: 'Arbeitsagentur Jobsuche API',
    description: 'German Federal Employment Agency (Bundesagentur fuer Arbeit) job search API providing access to Germany\'s largest job database with filtering by profession, location, employer, and job type',
    version: '4.0.0',
    docs: ['https://jobsuche.api.bund.dev/'],
    tags: ['jobs', 'germany', 'employment', 'labor', 'cacheTtlDaily'],
    root: 'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service',
    headers: {
        'X-API-Key': 'jobboerse-jobsuche'
    },
    tools: {
        searchJobs: {
            method: 'GET',
            path: '/pc/v4/jobs',
            description: 'Search for job listings by keyword, location, profession field, employer, or job type. Returns job title, employer, location with coordinates, and publication date.',
            parameters: [
                { position: { key: 'was', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Search keyword for job title or description, e.g. software, ingenieur, pflege' } },
                { position: { key: 'wo', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Location name to search jobs in, e.g. Berlin, Hamburg, Muenchen' } },
                { position: { key: 'berufsfeld', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Profession field filter, e.g. Informatik, Elektrotechnik, Maschinenbau' } },
                { position: { key: 'arbeitgeber', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Employer name filter to narrow results to a specific company' } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)', 'optional()'], description: 'Page number for pagination, starting at 0' } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(25)', 'optional()'], description: 'Number of results per page, between 1 and 100' } },
                { position: { key: 'angebotsart', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'], description: 'Job offer type filter as numeric code, e.g. 1 for employment, 2 for apprenticeship, 4 for internship' } }
            ],
            tests: [
                { _description: 'Search software jobs in Berlin', was: 'software', wo: 'berlin', size: 5 },
                { _description: 'Search all jobs', size: 5 },
                { _description: 'Search engineering jobs in Munich', was: 'ingenieur', wo: 'muenchen', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        maxResults: { type: 'number' },
                        jobCount: { type: 'number' },
                        jobs: { type: 'array', items: { type: 'object', properties: { refnr: { type: 'string' }, title: { type: 'string' }, profession: { type: 'string' }, employer: { type: 'string' }, location: { type: 'string' }, region: { type: 'string' }, publishedDate: { type: 'string' }, entryDate: { type: 'string' } } } }
                    }
                }
            },
        },
        searchJobsByEmployer: {
            method: 'GET',
            path: '/pc/v4/jobs',
            description: 'Search for job listings by a specific employer name. Returns matching jobs with title, location, and publication date.',
            parameters: [
                { position: { key: 'arbeitgeber', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'], description: 'Employer name to search for, e.g. Deutsche Bahn, Siemens, BMW' } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)', 'optional()'], description: 'Page number for pagination, starting at 0' } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(25)', 'optional()'], description: 'Number of results per page, between 1 and 100' } }
            ],
            tests: [
                { _description: 'Search Deutsche Bahn jobs', arbeitgeber: 'Deutsche Bahn', size: 5 },
                { _description: 'Search Siemens jobs', arbeitgeber: 'Siemens', size: 5 },
                { _description: 'Search BMW jobs', arbeitgeber: 'BMW', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        maxResults: { type: 'number' },
                        jobCount: { type: 'number' },
                        jobs: { type: 'array', items: { type: 'object', properties: { refnr: { type: 'string' }, title: { type: 'string' }, profession: { type: 'string' }, employer: { type: 'string' }, location: { type: 'string' }, region: { type: 'string' }, publishedDate: { type: 'string' }, entryDate: { type: 'string' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    searchJobs: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.stellenangebote ) { return { response }}

            const jobs = raw.stellenangebote
            .map( ( job ) => {
            const result = {
            refnr: job.refnr || null,
            title: job.titel || null,
            profession: job.beruf || null,
            employer: job.arbeitgeber || null,
            location: job.arbeitsort?.ort || null,
            region: job.arbeitsort?.region || null,
            publishedDate: job.aktuelleVeroeffentlichungsdatum || null,
            entryDate: job.eintrittsdatum || null
            }

            return result
            } )

            response = {
            maxResults: raw.maxErgebnisse || null,
            jobCount: jobs.length,
            jobs
            }

            return { response }
        }
    },
    searchJobsByEmployer: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.stellenangebote ) { return { response }}

            const jobs = raw.stellenangebote
            .map( ( job ) => {
            const result = {
            refnr: job.refnr || null,
            title: job.titel || null,
            profession: job.beruf || null,
            employer: job.arbeitgeber || null,
            location: job.arbeitsort?.ort || null,
            region: job.arbeitsort?.region || null,
            publishedDate: job.aktuelleVeroeffentlichungsdatum || null,
            entryDate: job.eintrittsdatum || null
            }

            return result
            } )

            response = {
            maxResults: raw.maxErgebnisse || null,
            jobCount: jobs.length,
            jobs
            }

            return { response }
        }
    }
} )
