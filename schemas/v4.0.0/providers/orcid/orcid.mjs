export const main = {
    namespace: 'orcid',
    name: 'ORCID',
    description: 'Access the ORCID public API with 19M+ researcher profiles, publications, affiliations, fundings, and peer reviews. Free public API, no authentication required.',
    version: '4.0.0',
    docs: ['https://info.orcid.org/documentation/api-tutorials/'],
    tags: ['science', 'research', 'researchers', 'academic', 'profiles', 'cacheTtlDaily'],
    root: 'https://pub.orcid.org/v3.0',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        searchResearchers: {
            method: 'GET',
            path: '/search/',
            description: 'Search the ORCID registry for researchers using Solr query syntax. Search by name, affiliation, keywords, DOI, or ORCID ID. Use returned ORCID paths in getRecord, getPersonDetails, getWorks, or getActivities.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'rows', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)', 'max(1000)'] } }
            ],
            tests: [
                { _description: 'Search for researchers named Hawking in physics', q: 'family-name:Hawking AND keyword:physics', rows: 5 },
                { _description: 'Search for researchers at Stanford', q: 'affiliation-org-name:Stanford', rows: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        'num-found': { type: 'number' },
                        result: { type: 'array', items: { type: 'object', properties: { 'orcid-identifier': { type: 'object', properties: { uri: { type: 'string' }, path: { type: 'string' }, host: { type: 'string' } } } } } }
                    }
                }
            },
        },
        getRecord: {
            method: 'GET',
            path: '/:orcid/record',
            description: 'Get the full ORCID record for a researcher in a single call. For specific sections use getPersonDetails, getWorks, getEmployments, getEducations, or getFundings.',
            parameters: [
                { position: { key: 'orcid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get record for Josiah Carberry (test ORCID)', orcid: '0000-0002-1825-0097' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        'orcid-identifier': { type: 'object', properties: { path: { type: 'string' } } },
                        person: { type: 'object' },
                        'activities-summary': { type: 'object' }
                    }
                }
            },
        },
        getPersonDetails: {
            method: 'GET',
            path: '/:orcid/person',
            description: 'Get biographical details for a researcher including name, biography, keywords, researcher URLs, email addresses, and external identifiers.',
            parameters: [
                { position: { key: 'orcid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get person details for Josiah Carberry', orcid: '0000-0002-1825-0097' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'object', properties: { 'given-names': { type: 'object' }, 'family-name': { type: 'object' } } },
                        biography: { type: 'object' },
                        'researcher-urls': { type: 'object' },
                        keywords: { type: 'object' },
                        'external-identifiers': { type: 'object' }
                    }
                }
            },
        },
        getWorks: {
            method: 'GET',
            path: '/:orcid/works',
            description: 'Get all works (publications) for a researcher. Returns work summaries including titles, types, external IDs (DOI, PMID), and publication dates.',
            parameters: [
                { position: { key: 'orcid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get works for Josiah Carberry', orcid: '0000-0002-1825-0097' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        'last-modified-date': { type: 'object' },
                        group: { type: 'array', items: { type: 'object', properties: { 'work-summary': { type: 'array' }, 'external-ids': { type: 'object' } } } }
                    }
                }
            },
        },
        getEmployments: {
            method: 'GET',
            path: '/:orcid/employments',
            description: 'Get employment affiliations for a researcher. Returns current and past institutional affiliations with roles, departments, and date ranges.',
            parameters: [
                { position: { key: 'orcid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get employments for Josiah Carberry', orcid: '0000-0002-1825-0097' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        'last-modified-date': { type: 'object' },
                        'affiliation-group': { type: 'array', items: { type: 'object', properties: { summaries: { type: 'array' } } } }
                    }
                }
            },
        },
        getEducations: {
            method: 'GET',
            path: '/:orcid/educations',
            description: 'Get education history for a researcher. Returns degrees, institutions, departments, and date ranges.',
            parameters: [
                { position: { key: 'orcid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get educations for Josiah Carberry', orcid: '0000-0002-1825-0097' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        'last-modified-date': { type: 'object' },
                        'affiliation-group': { type: 'array', items: { type: 'object', properties: { summaries: { type: 'array' } } } }
                    }
                }
            },
        },
        getFundings: {
            method: 'GET',
            path: '/:orcid/fundings',
            description: 'Get funding activities for a researcher. Returns grants and awards with titles, funders, amounts, and date ranges.',
            parameters: [
                { position: { key: 'orcid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get fundings for Josiah Carberry', orcid: '0000-0002-1825-0097' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        'last-modified-date': { type: 'object' },
                        group: { type: 'array', items: { type: 'object', properties: { 'funding-summary': { type: 'array' }, 'external-ids': { type: 'object' } } } }
                    }
                }
            },
        },
        getActivities: {
            method: 'GET',
            path: '/:orcid/activities',
            description: 'Get a summary of all activities for a researcher. Returns aggregated summaries. For the complete record including bio, use getRecord. For individual sections use getWorks, getEmployments, etc.',
            parameters: [
                { position: { key: 'orcid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get all activities for Josiah Carberry', orcid: '0000-0002-1825-0097' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        educations: { type: 'object' },
                        employments: { type: 'object' },
                        fundings: { type: 'object' },
                        works: { type: 'object' },
                        'peer-reviews': { type: 'object' }
                    }
                }
            },
        }
    }
}
