// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Module-level code: 46 lines

export const main = {
    namespace: 'poap',
    name: 'POAP GraphQL',
    description: 'Query the POAP protocol via GraphQL — introspect the schema, run predefined queries, or execute custom GraphQL queries for event attendance and token metadata.',
    version: '4.0.0',
    docs: ['https://public.compass.poap.tech/v1/graphql'],
    tags: ['nft', 'attendance', 'graphql', 'events', 'cacheTtlDaily'],
    root: 'https://public.compass.poap.tech/v1/graphql',
    headers: {
        'content-type': 'application/json'
    },
    tools: {
        getTypename: {
            method: 'POST',
            path: '/',
            description: 'Simple GraphQL query to retrieve the __typename root for basic connectivity test.',
            parameters: [],
            tests: [
                { _description: 'Simple __typename query test' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: { type: 'object', properties: { __typename: { type: 'string' } } }
                    }
                }
            },
        },
        getSchemaDefinition: {
            method: 'POST',
            path: '/',
            description: 'Returns the full GraphQL schema via introspection via POAP. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Returns full GraphQL schema' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: { type: 'object', properties: { __schema: { type: 'object', properties: { queryType: { type: 'object' }, types: { type: 'array', items: { type: 'object' } } } } } }
                    }
                }
            },
        },
        getPredefinedQueryList: {
            method: 'GET',
            path: '/',
            description: 'List all available predefined GraphQL queries for the POAP subgraph via the query catalog endpoint.',
            parameters: [],
            tests: [
                { _description: 'Sample query for entity data' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: { type: 'object', properties: { queryId: { type: 'string' }, description: { type: 'string' } } }
                }
            },
        },
        executePrefinedQuery: {
            method: 'POST',
            path: '/',
            description: 'Execute a predefined GraphQL query on the POAP subgraph — select a query by ID from available templates.',
            parameters: [
                { position: { key: 'queryId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(poapsFromBerlin,highestAttendanceLastYear,collectorPoaps,mostTransferredPoaps,dropsBasicInfo,poapsByChain,artistsList,recentMoments,topCollectors,mostExclusiveDrops,mostPopularDrops)', options: [] } }
            ],
            tests: [
                {
                    _description: 'Returns the top 5 POAP drops from Berlin with the most tokens minted, including event details.',
                    queryId: 'poapsFromBerlin'
                },
                {
                    _description: 'Returns the top 5 POAP drops from 2024 with the most tokens minted, including event details and attendance count.',
                    queryId: 'highestAttendanceLastYear'
                },
                {
                    _description: 'Retrieves the total POAP count for a specific wallet address and shows a sample of their collected events.',
                    queryId: 'collectorPoaps'
                },
                {
                    _description: 'Identifies the POAPs with the highest transfer counts, which may indicate high value or popularity in secondary markets.',
                    queryId: 'mostTransferredPoaps'
                },
                {
                    _description: 'Retrieves basic information about POAP drops including location data, useful for geographic distribution analysis.',
                    queryId: 'dropsBasicInfo'
                },
                {
                    _description: 'Examines the blockchain network distribution of POAPs, showing which chains are most commonly used for minting.',
                    queryId: 'poapsByChain'
                },
                {
                    _description: 'Lists artists who have contributed to POAP designs, providing insight into the creative contributors to the ecosystem.',
                    queryId: 'artistsList'
                },
                {
                    _description: 'Explores user-created moments associated with POAPs, showing how people memorialize their experiences with digital collectibles.',
                    queryId: 'recentMoments'
                },
                {
                    _description: 'Identifies the most prolific POAP collectors, whose collections could be further analyzed for thematic preferences.',
                    queryId: 'topCollectors'
                },
                {
                    _description: 'Examines the rarity spectrum of POAP drops by finding those with the fewest minted tokens, indicating exclusivity.',
                    queryId: 'mostExclusiveDrops'
                },
                {
                    _description: 'Identifies the most popular POAP events of all time based on total participation, showing which events resonated most with the community.',
                    queryId: 'mostPopularDrops'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: { type: 'object', properties: { drops: { type: 'array', items: { type: 'object' } } } }
                    }
                }
            },
        },
        querySubgraph: {
            method: 'POST',
            path: '/',
            description: 'Execute a custom raw GraphQL query on the POAP subgraph — pass any valid GraphQL query string directly.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Sample query for entity data', query: 'query { collections_artists { name } }' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: { type: 'object', properties: { collections_artists: { type: 'array', items: { type: 'object' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {

    const poapQueries = {
        poapsFromBerlin: {
            description: "Returns the top 5 POAP drops from Berlin with the most tokens minted, including event details.",
            query: `{ drops(where: {_or: [{name: {_ilike: "%Berlin%"}}, {description: {_ilike: "%Berlin%"}}]}, limit: 20) { id name description city country start_date end_date image_url fancy_id } }`
        },
        highestAttendanceLastYear: {
            description: "Returns the top 5 POAP drops from 2024 with the most tokens minted, including event details and attendance count.",
            query: `{ drops( where: {start_date: {_gt: "2024-01-01"}}, limit: 5, order_by: {poaps_aggregate: {count: desc}} ) { id name fancy_id start_date end_date city country poaps_aggregate { aggregate { count } } } }`
        },
        collectorPoaps: {
            description: "Retrieves the total POAP count for a specific wallet address and shows a sample of their collected events.",
            query: `{ collectors( where: {address: {_eq: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"} } ) { address poaps_aggregate { aggregate { count } } poaps(limit: 5) { drop { name start_date } } } }`
        },
        mostTransferredPoaps: {
            description: "Identifies the POAPs with the highest transfer counts, which may indicate high value or popularity in secondary markets.",
            query: `{ poaps( limit: 5, order_by: {transfer_count: desc} ) { id transfer_count drop { name fancy_id start_date } } }`
        },
        dropsBasicInfo: {
            description: "Retrieves basic information about POAP drops including location data, useful for geographic distribution analysis.",
            query: `{ drops(limit: 5) { id name city country } }`
        },
        poapsByChain: {
            description: "Examines the blockchain network distribution of POAPs, showing which chains are most commonly used for minting.",
            query: `{ poaps(limit: 10) { chain id minted_on } }`
        },
        artistsList: {
            description: "Lists artists who have contributed to POAP designs, providing insight into the creative contributors to the ecosystem.",
            query: `{ collections_artists { name } }`
        },
        recentMoments: {
            description: "Explores user-created moments associated with POAPs, showing how people memorialize their experiences with digital collectibles.",
            query: `{ moments( limit: 5, order_by: {created_on: desc} ) { id created_on author drops { drop { name } } } }`
        },
        topCollectors: {
            description: "Identifies the most prolific POAP collectors, whose collections could be further analyzed for thematic preferences.",
            query: `{ collectors( limit: 3, order_by: {poaps_owned: desc} ) { address poaps_owned } }`
        },
        mostExclusiveDrops: {
            description: "Examines the rarity spectrum of POAP drops by finding those with the fewest minted tokens, indicating exclusivity.",
            query: `{ drops( limit: 10, order_by: {poaps_aggregate: {count: asc}} ) { id name fancy_id poaps_aggregate { aggregate { count } } } }`
        },
        mostPopularDrops: {
            description: "Identifies the most popular POAP events of all time based on total participation, showing which events resonated most with the community.",
            query: `{ drops( limit: 10, order_by: {poaps_aggregate: {count: desc}} ) { id name fancy_id poaps_aggregate { aggregate { count } } } }`
        }
    }

    return {
        getTypename: {
            preRequest: async ( { struct, payload } ) => {
                struct.body = { query: '{ __typename }' }
                return { struct }
            }
        },
        getSchemaDefinition: {
            preRequest: async ( { struct, payload } ) => {
                struct.body = { query: '{ __schema { queryType { name } types { name kind } } }' }
                return { struct }
            }
        },
        getPredefinedQueryList: {
            executeRequest: async ( { struct, payload } ) => {
                struct['status'] = true
                struct['data'] = Object
                .entries( poapQueries )
                .map( ( [ queryId, { description } ] ) => {
                return { description, queryId }
                } )
                return { struct }
            }
        },
        executePrefinedQuery: {
            preRequest: async ( { struct, payload } ) => {
                const { queryId } = payload
                const { query } = poapQueries[ queryId ]
                if( !struct.body ) { struct.body = {} }
                struct.body.query = query
                return { struct }
            }
        }
    }
}
