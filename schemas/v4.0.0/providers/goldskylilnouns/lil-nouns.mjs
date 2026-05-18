// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "goldskyLilNouns" -> "goldskylilnouns"

export const main = {
    namespace: 'goldskylilnouns',
    name: 'Lil Nouns Subgraph',
    description: 'Fetch governance proposal data from the Lil Nouns DAO subgraph on Goldsky — list all proposals or retrieve a specific proposal by ID with vote details.',
    version: '4.0.0',
    docs: ['https://lilnouns.wtf', 'https://docs.goldsky.com'],
    tags: ['governance', 'dao', 'nft', 'ethereum', 'cacheTtlDaily'],
    root: 'https://api.goldsky.com/api/public/project_cldjvjgtylso13swq3dre13sf/subgraphs/lil-nouns-subgraph/1.0.6/gn',
    headers: {
        'Content-Type': 'application/json'
    },
    tools: {
        getProposals: {
            method: 'POST',
            path: '/',
            description: 'Retrieves the first 1000 proposals ordered by creation timestamp descending via Goldsky. Returns proposal IDs that can be used with getProposalById for full details including description.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Fetch first 1000 proposals from Lil Nouns subgraph', query: '{ proposals(first: 5) { id title status forVotes againstVotes } }' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'GraphQL response with Lil Nouns DAO governance proposals',
                    properties: {
                        data: {
                            type: 'object',
                            description: 'GraphQL data wrapper',
                            properties: {
                                proposals: {
                                    type: 'array',
                                    description: 'Array of governance proposals ordered by creation time',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'string', description: 'Numeric proposal ID — use with getProposalById for full details' },
                                            title: { type: 'string', description: 'Proposal title' },
                                            status: { type: 'string', description: 'Current status (PENDING, ACTIVE, CANCELLED, DEFEATED, SUCCEEDED, QUEUED, EXPIRED, EXECUTED)' },
                                            forVotes: { type: 'string', description: 'Number of votes in favor' },
                                            againstVotes: { type: 'string', description: 'Number of votes against' },
                                            abstainVotes: { type: 'string', description: 'Number of abstaining votes' },
                                            createdTimestamp: { type: 'string', description: 'Unix timestamp when proposal was created' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        },
        getProposalById: {
            method: 'POST',
            path: '/',
            description: 'Fetch a single proposal by its numeric ID via Goldsky with full details including description and vote breakdown. Get proposal IDs from getProposals.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['regex(^\\\\d+$)'] } }
            ],
            tests: [
                { _description: 'Fetch proposal with ID 327', id: '327' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'GraphQL response with a single Lil Nouns DAO proposal including full details',
                    properties: {
                        data: {
                            type: 'object',
                            description: 'GraphQL data wrapper',
                            properties: {
                                proposal: {
                                    type: 'object',
                                    description: 'Detailed proposal record',
                                    properties: {
                                        id: { type: 'string', description: 'Numeric proposal ID' },
                                        title: { type: 'string', description: 'Proposal title' },
                                        description: { type: 'string', description: 'Full proposal description text (may be long, includes markdown)' },
                                        status: { type: 'string', description: 'Current status (PENDING, ACTIVE, CANCELLED, DEFEATED, SUCCEEDED, QUEUED, EXPIRED, EXECUTED)' },
                                        quorumVotes: { type: 'string', description: 'Number of votes required for quorum' },
                                        forVotes: { type: 'string', description: 'Number of votes in favor' },
                                        againstVotes: { type: 'string', description: 'Number of votes against' },
                                        abstainVotes: { type: 'string', description: 'Number of abstaining votes' },
                                        createdTimestamp: { type: 'string', description: 'Unix timestamp when proposal was created' },
                                        startBlock: { type: 'string', description: 'Ethereum block number when voting starts' },
                                        endBlock: { type: 'string', description: 'Ethereum block number when voting ends' },
                                        proposer: { type: 'object', description: 'Proposer wallet info', properties: { id: { type: 'string', description: 'Ethereum address of the proposer' } } }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getProposals: {
        preRequest: async ( { struct, payload } ) => {
            struct.url = struct.url.replace(/\/$/, '');
            struct.body = {
            variables: {},
            query: `{
            proposals(first: 1000, orderBy: createdTimestamp, orderDirection: desc) {
            id
            title
            status
            forVotes
            againstVotes
            abstainVotes
            createdTimestamp
            startBlock
            endBlock
            proposer {
            id
            }
            __typename
            }
            }`
            };
            return { struct }
        }
    },
    getProposalById: {
        preRequest: async ( { struct, payload } ) => {
            const { id } = payload;
            struct.url = struct.url.replace(/\/$/, '');
            struct.body = {
            variables: { id },
            query: `query GetProposalById($id: String!) {
            proposal(id: $id) {
            id
            title
            description
            status
            quorumVotes
            forVotes
            againstVotes
            abstainVotes
            createdTimestamp
            startBlock
            endBlock
            proposer {
            id
            __typename
            }
            __typename
            }
            }`
            };
            return { struct }
        }
    }
} )
