export const main = {
    namespace: 'nihreporter',
    name: 'NIH RePORTER',
    description: 'Search NIH-funded research projects, publications, and clinical studies. Access grant details, funding amounts, principal investigators, and linked publications for federally funded biomedical research.',
    version: '4.0.0',
    docs: ['https://api.reporter.nih.gov/'],
    tags: ['science', 'research', 'funding', 'grants', 'biomedical', 'cacheTtlDaily'],
    root: 'https://api.reporter.nih.gov/v2',
    requiredServerParams: [],
    headers: {
        'Content-Type': 'application/json'
    },
    tools: {
        searchProjects: {
            method: 'POST',
            path: '/projects/search',
            description: 'Search NIH-funded research projects by keywords, fiscal year, organization, PI name, or funding mechanism. Returns project details including title, abstract, funding, and PI information.',
            parameters: [
                { position: { key: 'criteria', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'max(14999)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'max(500)'] } },
                { position: { key: 'sort_field', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'sort_order', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(asc,desc)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search projects funded in fiscal year 2024', criteria: '{"fiscal_years":[2024]}', offset: 0, limit: 2 },
                { _description: 'Search CRISPR-related projects', criteria: '{"advanced_text_search":{"operator":"and","search_field":"terms","search_text":"CRISPR"}}', offset: 0, limit: 2 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object', properties: { search_id: { type: 'string' }, total: { type: 'number' }, offset: { type: 'number' }, limit: { type: 'number' }, sort_field: { type: 'string' }, sort_order: { type: 'string' } } },
                        results: { type: 'array', items: { type: 'object', properties: { appl_id: { type: 'number' }, project_num: { type: 'string' }, project_title: { type: 'string' }, abstract_text: { type: 'string' }, fiscal_year: { type: 'number' }, award_amount: { type: 'number' }, agency_code: { type: 'string' }, principal_investigators: { type: 'array' }, organization: { type: 'object' } } } }
                    }
                }
            },
        },
        searchPublications: {
            method: 'POST',
            path: '/publications/search',
            description: 'Search publications linked to NIH-funded research by PMIDs, application IDs, or core project numbers. Supports wildcard searches on project numbers.',
            parameters: [
                { position: { key: 'criteria', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'max(9999)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'max(500)'] } }
            ],
            tests: [
                { _description: 'Search publications by PubMed IDs', criteria: '{"pmids":[28432209]}', offset: 0, limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object', properties: { total: { type: 'number' }, offset: { type: 'number' }, limit: { type: 'number' } } },
                        results: { type: 'array', items: { type: 'object', properties: { coreproject: { type: 'string' }, pmid: { type: 'number' }, applid: { type: 'number' } } } }
                    }
                }
            },
        },
        searchClinicalStudies: {
            method: 'POST',
            path: '/clinical_studies/search',
            description: 'Search clinical studies linked to NIH-funded projects. Returns study details with ClinicalTrials.gov NCT identifiers and project linkages.',
            parameters: [
                { position: { key: 'criteria', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'max(500)'] } }
            ],
            tests: [
                { _description: 'Search clinical studies linked to NIH projects', criteria: '{"fiscal_years":[2024]}', offset: 0, limit: 2 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object', properties: { total: { type: 'number' }, offset: { type: 'number' }, limit: { type: 'number' } } },
                        results: { type: 'array', items: { type: 'object', properties: { coreproject: { type: 'string' }, clinicalstudies: { type: 'array' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const buildBody = ( payload ) => {
        const { criteria, offset, limit, sort_field, sort_order } = payload
        const parsed = typeof criteria === 'string' ? JSON.parse( criteria ) : criteria
        const body = { criteria: parsed, offset: offset || 0, limit: limit || 50 }
        if( sort_field ) { body.sort_field = sort_field }
        if( sort_order ) { body.sort_order = sort_order }
        return body
    }

    return {
        searchProjects: {
            preRequest: async ( { struct, payload } ) => {
                struct.body = buildBody( payload )
                return { struct }
            }
        },
        searchPublications: {
            preRequest: async ( { struct, payload } ) => {
                struct.body = buildBody( payload )
                return { struct }
            }
        },
        searchClinicalStudies: {
            preRequest: async ( { struct, payload } ) => {
                struct.body = buildBody( payload )
                return { struct }
            }
        },
        getProjectDetails: {
            preRequest: async ( { struct, payload } ) => {
                struct.body = buildBody( payload )
                return { struct }
            }
        }
    }
}
