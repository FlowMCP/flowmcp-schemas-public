// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "duneAnalytics" -> "duneanalytics"

export const main = {
    namespace: 'duneanalytics',
    name: 'DuneAnalytics',
    description: 'Retrieve results from Dune Analytics queries — fetch the latest cached result for any public Dune query by its numeric query ID. Returns structured row data.',
    version: '4.0.0',
    docs: ['https://docs.dune.com/api-reference/overview/introduction'],
    tags: ['analytics', 'queries', 'data', 'cacheTtlDaily'],
    root: 'https://api.dune.com/api/v1',
    requiredServerParams: ['DUNE_API_KEY'],
    headers: {
        'X-Dune-API-Key': '{{DUNE_API_KEY}}'
    },
    tools: {
        getLatestResult: {
            method: 'GET',
            path: '/query/:query_id/results',
            description: 'Fetch the latest cached result for a Dune query by its numeric ID. Returns structured row data with column metadata. The query must have been executed previously on Dune.',
            parameters: [
                { position: { key: 'query_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Retrieve latest result from query ID', query_id: 4032586 },
                { _description: 'Get ETH daily active addresses query', query_id: 1228795 },
                { _description: 'Get DEX trading volume query', query_id: 1847009 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Dune query execution result with row data and metadata',
                    properties: {
                        execution_id: { type: 'string', description: 'Unique identifier for this query execution' },
                        query_id: { type: 'number', description: 'The numeric Dune query ID that was executed' },
                        is_execution_finished: { type: 'boolean', description: 'Whether the query execution has completed' },
                        state: { type: 'string', description: 'Execution state: QUERY_STATE_COMPLETED, QUERY_STATE_EXECUTING, QUERY_STATE_FAILED, etc.' },
                        submitted_at: { type: 'string', description: 'ISO 8601 timestamp when the execution was submitted' },
                        expires_at: { type: 'string', description: 'ISO 8601 timestamp when the cached result expires' },
                        execution_started_at: { type: 'string', description: 'ISO 8601 timestamp when execution began' },
                        execution_ended_at: { type: 'string', description: 'ISO 8601 timestamp when execution finished' },
                        result: { type: 'object', description: 'Query result containing rows and metadata', properties: { rows: { type: 'array', description: 'Array of result row objects with dynamic keys matching column_names', items: { type: 'object' } }, metadata: { type: 'object', description: 'Result set metadata including schema and performance metrics', properties: { column_names: { type: 'array', description: 'Ordered list of column names in the result', items: { type: 'string' } }, column_types: { type: 'array', description: 'Data types for each column (varchar, bigint, double, etc.)', items: { type: 'string' } }, row_count: { type: 'number', description: 'Number of rows returned in this page' }, result_set_bytes: { type: 'number', description: 'Size of the returned result set in bytes' }, total_row_count: { type: 'number', description: 'Total number of rows in the full result' }, total_result_set_bytes: { type: 'number', description: 'Total size of the full result set in bytes' }, datapoint_count: { type: 'number', description: 'Total number of data points (rows x columns)' }, pending_time_millis: { type: 'number', description: 'Time spent waiting in queue in milliseconds' }, execution_time_millis: { type: 'number', description: 'Actual query execution time in milliseconds' } } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getLatestResult: {
        postRequest: async ( { response, struct, payload } ) => {
            struct.csv = payload?.content?.[0]?.text || "";
            return { response }
        }
    }
} )
