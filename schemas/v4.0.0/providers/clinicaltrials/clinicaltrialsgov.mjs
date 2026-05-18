export const main = {
    namespace: 'clinicaltrials',
    name: 'ClinicalTrialsGov',
    description: 'Search and retrieve clinical trial study records from ClinicalTrials.gov, including study details, eligibility criteria, contacts, and results.',
    docs: ['https://clinicaltrials.gov/data-api/api', 'https://clinicaltrials.gov/data-api/about-api'],
    tags: ['health', 'medicine', 'clinicaltrials', 'research', 'fda', 'science', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://clinicaltrials.gov',
    requiredServerParams: [],
    headers: {},
    tools: {
        listStudies: {
            method: 'GET',
            path: '/api/v2/studies',
            description: 'Search and list clinical trial studies with filters for condition, intervention, sponsor, status, phase, and location. Returns paginated study records.',
            parameters: [
                { position: { key: 'query.cond', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'query.intr', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'query.titles', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'query.spons', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'query.term', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'filter.overallStatus', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'filter.phase', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'pageSize', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] } },
                { position: { key: 'pageToken', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for active diabetes clinical trials', 'query.cond': 'diabetes', 'filter.overallStatus': 'RECRUITING', pageSize: 5 },
                { _description: 'Search for Phase 3 cancer trials with mRNA intervention', 'query.cond': 'cancer', 'query.intr': 'mRNA', 'filter.phase': 'PHASE3', pageSize: 5 },
                { _description: 'Search for Alzheimer disease trials by sponsor keyword', 'query.cond': 'Alzheimer disease', pageSize: 10 },
                { _description: 'Search for COVID-19 vaccine trials', 'query.cond': 'COVID-19', 'query.intr': 'vaccine', pageSize: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        studies: { type: 'array', description: 'Array of study records matching the search criteria', items: { type: 'object', properties: { protocolSection: { type: 'object', description: 'Main study protocol data' }, hasResults: { type: 'boolean', description: 'Whether results have been posted' } } } },
                        nextPageToken: { type: 'string', description: 'Token for fetching the next page of results' },
                        totalCount: { type: 'number', description: 'Total number of studies matching the query' }
                    }
                }
            }
        },
        getStudy: {
            method: 'GET',
            path: '/api/v2/studies/:nctId',
            description: 'Retrieve full details of a single clinical trial study by its NCT ID, including protocol, arms, outcomes, eligibility, contacts, and results.',
            parameters: [
                { position: { key: 'nctId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(/^NCT\\d{8}$/)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get details of a specific Pfizer COVID-19 vaccine trial', nctId: 'NCT04368728' },
                { _description: 'Get details of an Alzheimer disease study', nctId: 'NCT03137563' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        protocolSection: { type: 'object', description: 'Study protocol including identification, status, description, conditions, design, arms, outcomes, eligibility, contacts, and references' },
                        resultsSection: { type: 'object', description: 'Study results if posted (participant flow, baseline, outcomes, adverse events)' },
                        hasResults: { type: 'boolean', description: 'Whether study results have been posted' }
                    }
                }
            }
        },
        listStudyFields: {
            method: 'GET',
            path: '/api/v2/studies/metadata',
            description: 'Retrieve the list of all available data fields and their data types that can be queried or returned from the ClinicalTrials.gov API.',
            parameters: [
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get full list of available study data fields' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of field definition objects with name, type, and description'
                }
            }
        }
    }
}