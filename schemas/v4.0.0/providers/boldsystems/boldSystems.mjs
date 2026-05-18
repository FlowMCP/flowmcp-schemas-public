export const main = {
    namespace: 'boldsystems',
    name: 'BOLD Systems',
    description: 'Query the Barcode of Life Data Systems (BOLD) for DNA barcode records. Search by taxonomy, geography, or BIN (Barcode Index Number) and retrieve sequence data.',
    version: '4.0.0',
    docs: ['https://boldsystems.org/data/api/'],
    tags: ['biology', 'genetics', 'biodiversity', 'science', 'cacheTtlDaily'],
    root: 'https://portal.boldsystems.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        preprocessQuery: {
            method: 'GET',
            path: '/api/query/preprocessor',
            description: 'Validate and resolve search terms against controlled vocabularies. Converts free-text queries into formal triplets for use with the query endpoint.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Preprocess taxonomy query for Lepidoptera', query: 'tax:Lepidoptera' },
                { _description: 'Preprocess geography query for Canada', query: 'geo:Canada' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { query: { type: 'string' }, resolved: { type: 'array' } } }
            },
        },
        getSummary: {
            method: 'GET',
            path: '/api/summary',
            description: 'Get aggregate statistics for barcode data matching the query. Returns counts by taxonomy, geography, BIN, and other metadata fields.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get summary for Lepidoptera barcodes', query: 'tax:Lepidoptera' },
                { _description: 'Get geographic summary for bees', query: 'tax:Apis', fields: 'geo' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { total: { type: 'number' }, summary: { type: 'object' } } }
            },
        },
        executeQuery: {
            method: 'GET',
            path: '/api/query',
            description: 'Execute a barcode data query and receive a query token for downloading results. The token is valid for 24 hours.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'extent', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(full,partial)', options: ['optional()', 'default(full)'] } }
            ],
            tests: [
                { _description: 'Query barcodes for Apis mellifera', query: 'tax:Apis mellifera' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { query_id: { type: 'string' }, total: { type: 'number' } } }
            },
        }
    }
}
