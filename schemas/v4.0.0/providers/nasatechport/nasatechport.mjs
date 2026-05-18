export const main = {
    namespace: 'nasatechport',
    name: 'NASA TechPort',
    description: 'Access NASA TechPort technology portfolio data — search and retrieve NASA-funded technology projects, programs, organizations, and taxonomy information.',
    version: '4.0.0',
    docs: ['https://techport.nasa.gov/help/api', 'https://api.nasa.gov/'],
    tags: ['nasa', 'technology', 'research', 'space', 'science', 'cacheTtlDaily'],
    root: 'https://api.nasa.gov',
    requiredServerParams: ['API_DATA_GOV_KEY'],
    headers: {},
    tools: {
        getProject: {
            method: 'GET',
            path: '/techport/api/projects/:projectId',
            description: 'Retrieve detailed information about a specific NASA technology project by its ID.',
            parameters: [
                { position: { key: 'projectId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get details for the Artemis project', projectId: 17792 },
                { _description: 'Get details for a robotics project', projectId: 91820 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        project: { type: 'object', description: 'Full project record with title, description, status, dates, and more' }
                    }
                }
            }
        },
        getProjectIds: {
            method: 'GET',
            path: '/techport/api/projects',
            description: 'Retrieve a list of all available project IDs, optionally filtered by last update date.',
            parameters: [
                { position: { key: 'updatedSince', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get project IDs updated since 2024-01-01', updatedSince: '2024-01-01' },
                { _description: 'Get project IDs updated since 2025-06-01', updatedSince: '2025-06-01' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        projects: { type: 'array', description: 'Array of project ID objects' },
                        totalCount: { type: 'number', description: 'Total number of matching projects' }
                    }
                }
            }
        },
        searchProjects: {
            method: 'GET',
            path: '/techport/api/projects/search',
            description: 'Search NASA technology projects by keyword query.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for Mars-related projects', query: 'Mars' },
                { _description: 'Search for AI and machine learning projects', query: 'artificial intelligence' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        projects: { type: 'array', description: 'Array of matching project summaries' },
                        totalCount: { type: 'number', description: 'Total number of search results' }
                    }
                }
            }
        },
        getProgram: {
            method: 'GET',
            path: '/techport/api/programs/:programId',
            description: 'Retrieve details of a specific NASA program by its ID.',
            parameters: [
                { position: { key: 'programId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get a specific NASA program', programId: 63 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        program: { type: 'object', description: 'Program record with name, description, and related projects' }
                    }
                }
            }
        },
        getPrograms: {
            method: 'GET',
            path: '/techport/api/programs',
            description: 'List all NASA programs, optionally filtered to show only active programs.',
            parameters: [
                { position: { key: 'activeOnly', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'List all NASA programs', activeOnly: true },
                { _description: 'List only active NASA programs', activeOnly: true }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        programs: { type: 'array', description: 'Array of program records' }
                    }
                }
            }
        },
        getOrganization: {
            method: 'GET',
            path: '/techport/api/organizations/:organizationId',
            description: 'Retrieve details of a specific organization contributing to NASA projects.',
            parameters: [
                { position: { key: 'organizationId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get a specific organization', organizationId: 4849 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        organization: { type: 'object', description: 'Organization details including name, type, and location' }
                    }
                }
            }
        }
    }
}
