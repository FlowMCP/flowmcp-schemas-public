// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'sourcify',
    name: 'Sourcify Contract Verification',
    description: 'Verify and lookup Ethereum smart contract source code verification status across multiple chains using Sourcify',
    version: '4.0.0',
    docs: ['https://docs.sourcify.dev/', 'https://sourcify.dev/'],
    tags: ['ethereum', 'verification', 'smartcontracts', 'cacheTtlDaily'],
    root: 'https://sourcify.dev/server',
    tools: {
        getVerificationStatus: {
            method: 'GET',
            path: '/v2/contract/:chainId/:address',
            description: 'Check if a contract is verified on Sourcify and get match type (full or partial)',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['length(42)'] } }
            ],
            tests: [
                { _description: 'Check USDC on Ethereum', chainId: 1, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        matchId: { type: 'string' },
                        creationMatch: { type: 'string' },
                        runtimeMatch: { type: 'string' },
                        verifiedAt: { type: 'string' },
                        match: { type: 'string' },
                        chainId: { type: 'string' },
                        address: { type: 'string' }
                    }
                }
            },
        },
        checkByAddresses: {
            method: 'GET',
            path: '/check-all-by-addresses',
            description: 'Check verification status of a contract address across one or multiple chains. Required: addresses, chainIds.',
            parameters: [
                { position: { key: 'addresses', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(42)'] } },
                { position: { key: 'chainIds', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Check USDC on Ethereum', addresses: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', chainIds: '1' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            address: { type: 'string' },
                            chainIds: { type: 'array', items: { type: 'object' } }
                        }
                    }
                }
            },
        },
        getSourceFileTree: {
            method: 'GET',
            path: '/files/tree/any/:chainId/:address',
            description: 'Get the list of verified source files for a contract via sourcify — query by chainId and address.. Use getSourceFiles first to find valid IDs',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['length(42)'] } }
            ],
            tests: [
                { _description: 'Get USDT source files on Ethereum', chainId: 1, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        files: { type: 'array', items: { type: 'string' } }
                    }
                }
            },
        },
        getSourceFiles: {
            method: 'GET',
            path: '/files/any/:chainId/:address',
            description: 'Get full source code and metadata of a verified contract via sourcify — query by chainId and address.. Use IDs from results in getSourceFileTree',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['length(42)'] } }
            ],
            tests: [
                { _description: 'Get USDC source on Ethereum', chainId: 1, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        files: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, path: { type: 'string' }, content: { type: 'string' } } } }
                    }
                }
            },
        },
        getSupportedChains: {
            method: 'GET',
            path: '/chains',
            description: 'Get the list of all chains supported by Sourcify. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'List all supported chains' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            chainId: { type: 'number' },
                            rpc: { type: 'array', items: { type: 'string' } },
                            traceSupportedRPCs: { type: 'array', items: { type: 'object' } },
                            supported: { type: 'boolean' },
                            etherscanAPI: { type: 'boolean' }
                        }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getSourceFiles: {
        postRequest: async ( { response, struct, payload } ) => {
            try {
            const raw = response
            if( !raw || !raw.files ) {
            return { response }}

            const files = raw.files
            .map( ( file ) => {
            const result = {
            name: file.name,
            path: file.path,
            contentPreview: file.content ? file.content.slice( 0, 500 ) : null
            }

            return result
            } )

            response = {
            source: "Sourcify",
            status: raw.status,
            fileCount: files.length,
            files
            }
            } catch( error ) {
            struct.status = false
            struct.messages.push( `Error formatting source files: ${error.message}` )
            }

            return { response }
        }
    },
    getSupportedChains: {
        postRequest: async ( { response, struct, payload } ) => {
            try {
            const raw = response
            if( !Array.isArray( raw ) ) {
            return { response }}

            const supported = raw
            .filter( ( chain ) => chain.supported === true )

            const chains = supported
            .map( ( chain ) => {
            const result = {
            name: chain.name,
            chainId: chain.chainId,
            etherscanAPI: chain.etherscanAPI || false
            }

            return result
            } )

            response = {
            source: "Sourcify",
            totalChains: raw.length,
            supportedChains: chains.length,
            chains
            }
            } catch( error ) {
            struct.status = false
            struct.messages.push( `Error formatting chains: ${error.message}` )
            }

            return { response }
        }
    }
} )
