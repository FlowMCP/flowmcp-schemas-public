// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'thegraph',
    name: 'TheGraphSubgraphTools',
    description: 'Introspect and query The Graph protocol subgraphs — fetch GraphQL schemas and execute arbitrary queries against any hosted subgraph.',
    version: '4.0.0',
    docs: ['https://thegraph.com/docs/en/'],
    tags: ['defi', 'subgraph', 'graphql', 'cacheTtlStatic'],
    root: 'https://gateway.thegraph.com',
    requiredServerParams: ['THEGRAPH_API_KEY'],
    headers: {
        Authorization: 'Bearer {{THEGRAPH_API_KEY}}'
    },
    tools: {
        getSubgraphSchema: {
            method: 'POST',
            path: '/api/{{THEGRAPH_API_KEY}}/subgraphs/id/{{subgraphId}}',
            description: 'Fetch the schema of a subgraph via introspection query via The Graph. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'subgraphId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Introspect Uniswap V3 subgraph', subgraphId: '5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        errors: { type: 'array', items: { type: 'object', properties: { message: { type: 'string' } } } }
                    }
                }
            },
        },
        querySubgraph: {
            method: 'POST',
            path: '/api/{{THEGRAPH_API_KEY}}/subgraphs/id/{{subgraphId}}',
            description: 'Run a raw GraphQL query on a subgraph via The Graph. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'subgraphId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Sample query for entity data',
                    subgraphId: '5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV',
                    query: 'query { pools(first: 2) { id } }'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        errors: { type: 'array', items: { type: 'object', properties: { message: { type: 'string' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getSubgraphSchema: {
        preRequest: async ( { struct, payload } ) => {
            const query = `
            query IntrospectionQuery {
            __schema {
            types {
            name
            kind
            fields {
            name
            }
            }
            }
            }
            `
            struct['body'] = { query }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const data = struct?.data?.data || {};
            if (!data.__schema) {
            struct.status = false;
            struct.messages = ["No schema returned."];
            } else {
            struct.status = true;
            response = data.__schema;
            }
            return { response }
        }
    },
    querySubgraph: {
        postRequest: async ( { response, struct, payload } ) => {
            const data = payload?.data?.data || {};
            if (!data) {
            struct.status = false;
            struct.messages = ["Query returned no data."];
            } else {
            struct.status = true;
            response = JSON.stringify(data, null, 2);
            }
            return { response }
        }
    }
} )
