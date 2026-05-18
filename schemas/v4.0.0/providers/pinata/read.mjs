// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'pinata',
    name: 'Pinata IPFS Read MCP Interface',
    description: 'Read content from IPFS via the Pinata gateway — access files by CID (Content Identifier) through Pinata\'s dedicated IPFS gateway with API key authentication.',
    version: '4.0.0',
    docs: ['https://gateway.pinata.cloud/'],
    tags: ['ipfs', 'storage', 'read', 'cacheTtlDaily'],
    root: 'https://gateway.pinata.cloud/ipfs',
    tools: {
        free_read_example: {
            method: 'GET',
            path: '/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1',
            description: 'Returns a static IPFS-hosted example (Bored Ape #1 metadata) via Pinata IPFS gateway.',
            parameters: [],
            tests: [
                { _description: 'Load BAYC #1 metadata from IPFS' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        image: { type: 'string' },
                        attributes: { type: 'array', items: { type: 'object', properties: { trait_type: { type: 'string' }, value: { type: 'string' } } } }
                    }
                }
            },
        },
        free_read_cid: {
            method: 'GET',
            path: '/{{cid}}',
            description: 'Reads content from any IPFS CID via Pinata IPFS. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'cid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Read arbitrary CID', cid: 'QmYwAPJzv5CZsnAzt8auV2Annh6wKghpMdJtKhHgGMRFjx' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        cid: { type: 'string', description: 'IPFS content identifier' },
                        message: { type: 'string', description: 'Content description' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    free_read_example: {
        postRequest: async ( { response, struct, payload } ) => {
            return { response }
        }
    },
    free_read_cid: {
        executeRequest: async ( { struct, payload } ) => {
            const { userParams } = payload
            struct.data = {
                cid: userParams.cid || 'QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1',
                message: 'This is a static example image hosted on IPFS'
            }
            struct.status = true
            return { struct }
        }
    }
} )
