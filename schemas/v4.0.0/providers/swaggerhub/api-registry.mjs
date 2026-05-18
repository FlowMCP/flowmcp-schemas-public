// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'swaggerhub',
    name: 'SwaggerHub API',
    description: 'FlowMCP interface for SwaggerHub registry API, supporting search, metadata listing, and Swagger definition retrieval.',
    version: '4.0.0',
    docs: ['https://swaggerhub.com/api/swagger-hub/registry-api/1.0.0'],
    tags: ['production', 'api', 'documentation', 'registry', 'cacheTtlDaily'],
    root: 'https://api.swaggerhub.com/apis',
    tools: {
        searchApis: {
            method: 'GET',
            path: '/',
            description: 'Searches SwaggerHub public APIs using query parameters like `query`, `state`, `tag`, etc.. Use IDs from results in listApiVersions',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'state', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(PUBLISHED,UNPUBLISHED)', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for finance-related APIs', query: 'finance', state: 'PUBLISHED' }
            ,
                { _description: 'Default test for searchApis', query: 'finance', state: 'PUBLISHED' }],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        description: { type: 'string' },
                        url: { type: 'string' },
                        offset: { type: 'number' },
                        totalCount: { type: 'number' },
                        blocked: { type: 'boolean' },
                        apis: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, summary: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, properties: { type: 'array', items: { type: 'object' } } } } }
                    }
                }
            },
        },
        listApiVersions: {
            method: 'GET',
            path: '/:owner/:api',
            description: 'Returns metadata for all versions of a specified API via swaggerhub — query by owner and api.',
            parameters: [
                { position: { key: 'owner', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'api', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'List versions of registry-api', owner: 'swagger-hub', api: 'registry-api' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        description: { type: 'string' },
                        url: { type: 'string' },
                        offset: { type: 'number' },
                        totalCount: { type: 'number' },
                        blocked: { type: 'boolean' },
                        apis: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, summary: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, properties: { type: 'array', items: { type: 'object' } } } } }
                    }
                }
            },
        }
    }
}
