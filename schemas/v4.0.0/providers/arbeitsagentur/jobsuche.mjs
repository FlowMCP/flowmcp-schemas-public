// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'arbeitsagentur',
    name: 'Arbeitsagentur Jobsuche',
    description: 'Search job listings from the German Federal Employment Agency (Bundesagentur fuer Arbeit) public job board API',
    version: '4.0.0',
    docs: ['https://jobsuche.api.bund.dev/'],
    tags: ['jobs', 'employment', 'germany', 'cacheTtlDaily'],
    root: 'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service',
    headers: {
        'X-API-Key': 'jobboerse-jobsuche'
    },
    tools: {
        searchJobs: {
            method: 'GET',
            path: '/pc/v4/jobs',
            description: 'Search for job listings with filters for keywords, location, job type, and working hours',
            parameters: [
                { position: { key: 'was', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Search keyword for job title, profession, or skill (e.g. Informatik, Ingenieur)' },
                { position: { key: 'wo', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Location name to search for jobs (e.g. Berlin, Hamburg, Muenchen)' },
                { position: { key: 'berufsfeld', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Professional field code to filter job category' },
                { position: { key: 'arbeitgeber', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Employer name to filter results by company' },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'] }, description: 'Page number for pagination, starting at 0' },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(25)', 'optional()'] }, description: 'Number of results per page (1-100, default 25)' },
                { position: { key: 'veroeffentlichtseit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'max(100)', 'optional()'] }, description: 'Filter by publication recency in days (e.g. 7 for last week)' },
                { position: { key: 'angebotsart', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(1,2,4,34)', options: ['optional()'] }, description: 'Offer type: 1=Employment, 2=Training, 4=Internship, 34=Self-employment' },
                { position: { key: 'arbeitszeit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(vz,tz,snw,ho,mj)', options: ['optional()'] }, description: 'Working time: vz=Full-time, tz=Part-time, snw=Shift/night/weekend, ho=Home office, mj=Minijob' },
                { position: { key: 'befristung', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(1,2)', options: ['optional()'] }, description: 'Contract type: 1=Temporary, 2=Permanent' },
                { position: { key: 'zeitarbeit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] }, description: 'Filter for temporary agency work (true=only temp agency jobs)' },
                { position: { key: 'behinderung', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] }, description: 'Filter for jobs suitable for people with disabilities' },
                { position: { key: 'umkreis', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Search radius in kilometers around the specified location' }
            ],
            tests: [
                { _description: 'Search for IT jobs in Berlin', was: 'Informatik', wo: 'Berlin', size: 5 },
                { _description: 'Search for remote jobs', arbeitszeit: 'ho', size: 5 },
                { _description: 'Search for permanent engineering jobs', was: 'Ingenieur', befristung: 2, size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        stellenangebote: { type: 'array', items: { type: 'object', properties: { beruf: { type: 'string' }, titel: { type: 'string' }, refnr: { type: 'string' }, arbeitsort: { type: 'object', properties: { plz: { type: 'string' }, ort: { type: 'string' }, strasse: { type: 'string' }, region: { type: 'string' }, land: { type: 'string' }, koordinaten: { type: 'object', properties: { lat: { type: 'number' }, lon: { type: 'number' } } }, entfernung: { type: 'string' } } }, arbeitgeber: { type: 'string' }, aktuelleVeroeffentlichungsdatum: { type: 'string' }, modifikationsTimestamp: { type: 'string' }, eintrittsdatum: { type: 'string' }, kundennummerHash: { type: 'string' } } } },
                        maxErgebnisse: { type: 'number' },
                        page: { type: 'number' },
                        size: { type: 'number' }
                    }
                }
            },
        },
        searchJobsApp: {
            method: 'GET',
            path: '/pc/v4/app/jobs',
            description: 'Search for job listings via the app-optimized endpoint with the same filters via arbeitsagentur.',
            parameters: [
                { position: { key: 'was', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Search keyword for job title, profession, or skill (e.g. Software, Pflege)' },
                { position: { key: 'wo', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Location name to search for jobs (e.g. Muenchen, Koeln)' },
                { position: { key: 'berufsfeld', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Professional field code to filter job category' },
                { position: { key: 'arbeitgeber', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Employer name to filter results by company' },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'] }, description: 'Page number for pagination, starting at 0' },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(25)', 'optional()'] }, description: 'Number of results per page (1-100, default 25)' },
                { position: { key: 'veroeffentlichtseit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'max(100)', 'optional()'] }, description: 'Filter by publication recency in days (e.g. 14 for last two weeks)' },
                { position: { key: 'angebotsart', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(1,2,4,34)', options: ['optional()'] }, description: 'Offer type: 1=Employment, 2=Training, 4=Internship, 34=Self-employment' },
                { position: { key: 'arbeitszeit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(vz,tz,snw,ho,mj)', options: ['optional()'] }, description: 'Working time: vz=Full-time, tz=Part-time, snw=Shift/night/weekend, ho=Home office, mj=Minijob' },
                { position: { key: 'befristung', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(1,2)', options: ['optional()'] }, description: 'Contract type: 1=Temporary, 2=Permanent' },
                { position: { key: 'zeitarbeit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] }, description: 'Filter for temporary agency work (true=only temp agency jobs)' },
                { position: { key: 'behinderung', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] }, description: 'Filter for jobs suitable for people with disabilities' },
                { position: { key: 'umkreis', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Search radius in kilometers around the specified location' }
            ],
            tests: [
                { _description: 'Search app endpoint for jobs in Munich', was: 'Software', wo: 'München', size: 5 },
                { _description: 'Search app endpoint for part-time jobs', arbeitszeit: 'tz', size: 5 },
                { _description: 'Search app endpoint for training positions in Hamburg', was: 'Ausbildung', wo: 'Hamburg', angebotsart: 2, size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        stellenangebote: { type: 'array', items: { type: 'object', properties: { beruf: { type: 'string' }, titel: { type: 'string' }, refnr: { type: 'string' }, arbeitsort: { type: 'object', properties: { plz: { type: 'string' }, ort: { type: 'string' }, strasse: { type: 'string' }, region: { type: 'string' }, land: { type: 'string' }, koordinaten: { type: 'object', properties: { lat: { type: 'number' }, lon: { type: 'number' } } }, entfernung: { type: 'string' } } }, arbeitgeber: { type: 'string' }, aktuelleVeroeffentlichungsdatum: { type: 'string' }, modifikationsTimestamp: { type: 'string' }, eintrittsdatum: { type: 'string' }, kundennummerHash: { type: 'string' } } } },
                        maxErgebnisse: { type: 'number' },
                        page: { type: 'number' },
                        size: { type: 'number' }
                    }
                }
            },
        }
    }
}
