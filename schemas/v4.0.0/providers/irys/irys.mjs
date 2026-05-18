// Schema for #184 — Irys Decentralized Storage Gateway (GraphQL)
// No API key required — public GraphQL endpoint
// requiredLibraries: (none — raw fetch POST)

export const main = {
    namespace: 'irys',
    name: 'Irys Decentralized Storage',
    description: 'Query transactions, tags and receipts on Irys decentralized storage via public GraphQL API. Filter by owner, token, tags or timestamp. No API key required.',
    version: '4.0.0',
    docs: ['https://docs.irys.xyz/', 'https://arweave.mainnet.irys.xyz/graphql'],
    tags: ['irys', 'arweave', 'storage', 'decentralized', 'cacheTtlFrequent'],
    root: 'https://arweave.mainnet.irys.xyz',
    tools: {
        getTransactions: {
            method: 'POST',
            path: '/graphql',
            description: 'Query Irys transactions with optional filters for owner address, token type (arweave, ethereum, solana, matic), tags (key-value pairs) and pagination. Returns transaction id, address, token, timestamp, size and fee.',
            parameters: [
                { position: { key: 'first', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(100)'] } },
                { position: { key: 'owner', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'token', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'tagName', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'tagValue', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'after', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'order', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'enum(ASC,DESC)', options: ['optional()', 'default(DESC)'] } }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { transactions: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, address: { type: 'string' }, token: { type: 'string' }, timestamp: { type: 'number' }, size: { type: 'string' }, fee: { type: 'string' }, signature: { type: 'string' }, tags: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, value: { type: 'string' } } } } } } }, hasNextPage: { type: 'boolean' }, endCursor: { type: 'string' } } } },
            tests: [
                { _description: 'Latest 5 transactions', first: 5 },
                { _description: 'PNG uploads', first: 5, tagName: 'Content-Type', tagValue: 'image/png' },
                { _description: 'Transactions by owner', first: 3, owner: 'UsWPlOBHRyfWcbrlC5sV3-pNUjOQEI5WmDxLnypc93I' }
            ],
        },
        getTransactionById: {
            method: 'POST',
            path: '/graphql',
            description: 'Get a specific Irys transaction by its ID. Returns full details including address, token, timestamp, size, fee, signature, receipt and tags.',
            parameters: [
                { position: { key: 'transactionId', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['min(10)'] } }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { transaction: { type: 'object', properties: { id: { type: 'string' }, address: { type: 'string' }, token: { type: 'string' }, timestamp: { type: 'number' }, size: { type: 'string' }, fee: { type: 'string' }, signature: { type: 'string' }, tags: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, value: { type: 'string' } } } }, receipt: { type: 'object', properties: { deadlineHeight: { type: 'number' }, timestamp: { type: 'number' }, version: { type: 'string' }, signature: { type: 'string' } } } } } } } },
            tests: [
                { _description: 'Get specific transaction', transactionId: 'f1k4gUrFwYYOUSnuOCxmkafnpXSSH997Aro4Za-Dwz8' }
            ],
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const GQL_URL = 'https://arweave.mainnet.irys.xyz/graphql'

    async function gqlQuery( { query, variables } ) {
        const response = await fetch( GQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { query, variables } )
        } )
        const data = await response.json()
        if( data.errors ) {
            throw new Error( data.errors[0]?.message || 'GraphQL error' )
        }

        return data.data
    }

    return {
        getTransactions: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { first = 10, owner, token, tagName, tagValue, after, order = 'DESC' } = userParams

                const args = [`first: ${first}`, `order: ${order}`]
                if( owner ) { args.push( `owners: ["${owner}"]` ) }
                if( token ) { args.push( `token: "${token}"` ) }
                if( after ) { args.push( `after: "${after}"` ) }
                if( tagName && tagValue ) {
                    args.push( `tags: [{name: "${tagName}", values: ["${tagValue}"]}]` )
                }

                const query = `{ transactions(${args.join( ', ' )}) { edges { node { id address token timestamp size fee signature tags { name value } } cursor } pageInfo { hasNextPage endCursor } } }`

                try {
                    const result = await gqlQuery( { query } )
                    const edges = result.transactions?.edges || []
                    struct.data = {
                        transactions: edges
                            .map( ( { node } ) => node ),
                        hasNextPage: result.transactions?.pageInfo?.hasNextPage || false,
                        endCursor: result.transactions?.pageInfo?.endCursor || null
                    }
                    struct.status = true
                } catch( e ) {
                    struct.status = false
                    struct.messages.push( e?.message || 'Failed to query transactions.' )
                }

                return { struct }
            }
        },
        getTransactionById: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { transactionId } = userParams

                const query = `{ transactions(ids: ["${transactionId}"]) { edges { node { id address token timestamp size fee signature tags { name value } receipt { deadlineHeight timestamp version signature } } } } }`

                try {
                    const result = await gqlQuery( { query } )
                    const edges = result.transactions?.edges || []
                    if( edges.length === 0 ) {
                        struct.status = false
                        struct.messages.push( `Transaction not found: ${transactionId}` )
                    } else {
                        struct.data = { transaction: edges[0].node }
                        struct.status = true
                    }
                } catch( e ) {
                    struct.status = false
                    struct.messages.push( e?.message || 'Failed to get transaction.' )
                }

                return { struct }
            }
        }
    }
}
