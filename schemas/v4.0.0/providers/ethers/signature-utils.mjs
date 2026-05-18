// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// requiredLibraries: ethers
// Import: import { ethers } from 'ethers'

export const main = {
    namespace: 'ethers',
    name: 'Ethers Signature Utils',
    description: 'Offline signature verification and recovery utilities powered by ethers.js. Verify personal signatures, verify EIP-712 typed data, hash messages with Ethereum prefix, and recover signer addresses. No RPC or API key required.',
    version: '4.0.0',
    docs: ['https://docs.ethers.org/v6/api/crypto/#signing-key', 'https://eips.ethereum.org/EIPS/eip-712'],
    tags: ['blockchain', 'evm', 'signature', 'verification', 'offline'],
    root: 'https://offline.ethers.local',
    tools: {
        verifyMessage: {
            method: 'GET',
            path: '/',
            description: 'Recover the signer address from a personal_sign signature. Verifies that a message was signed by a specific address.',
            parameters: [
                {
                    position: {
                        key: 'message',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(1)']
                    }
                },
                {
                    position: {
                        key: 'signature',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['regex(^0x[a-fA-F0-9]+$)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Verify a signed message',
                    message: 'Hello World',
                    signature: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ff'
                },
                {
                    _description: 'Additional test for verifyMessage',
                    message: 'Hello World alt',
                    signature: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ff alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from verifyMessage',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        verifyTypedData: {
            method: 'GET',
            path: '/',
            description: 'Recover the signer address from an EIP-712 typed data signature. Provide domain, types, value as JSON strings, and the signature hex.',
            parameters: [
                {
                    position: {
                        key: 'domain',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(2)']
                    }
                },
                {
                    position: {
                        key: 'types',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(2)']
                    }
                },
                {
                    position: {
                        key: 'value',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(2)']
                    }
                },
                {
                    position: {
                        key: 'signature',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['regex(^0x[a-fA-F0-9]+$)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Verify EIP-712 typed data',
                    domain: '{"name":"Test","version":"1","chainId":1}',
                    types: '{"Message":[{"name":"content","type":"string"}]}',
                    value: '{"content":"Hello"}',
                    signature: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ff'
                },
                {
                    _description: 'Additional test for verifyTypedData',
                    domain: '{"name":"Test","version":"1","chainId":1} alt',
                    types: '{"Message":[{"name":"content","type":"string"}]} alt',
                    value: '{"content":"Hello"} alt',
                    signature: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ff alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from verifyTypedData',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        hashMessage: {
            method: 'GET',
            path: '/',
            description: "Hash a message with the Ethereum signed message prefix: '\x19Ethereum Signed Message:\n' + length + message. Returns the digest used for signature verification.",
            parameters: [
                {
                    position: {
                        key: 'message',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(1)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Hash a simple message',
                    message: 'Hello World'
                },
                {
                    _description: 'Additional test for hashMessage',
                    message: 'Hello World alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from hashMessage',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        recoverAddress: {
            method: 'GET',
            path: '/',
            description: 'Recover the signer address from a message digest (hash) and signature. Use hashMessage first to get the digest from a text message.',
            parameters: [
                {
                    position: {
                        key: 'digest',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['regex(^0x[a-fA-F0-9]{64}$)']
                    }
                },
                {
                    position: {
                        key: 'signature',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['regex(^0x[a-fA-F0-9]+$)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Recover address from digest and signature',
                    digest: '0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2',
                    signature: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ff'
                },
                {
                    _description: 'Additional test for recoverAddress',
                    digest: '0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2 alt',
                    signature: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ff alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from recoverAddress',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        }
    },
    requiredLibraries: ['ethers']
}

export const handlers = ( { sharedLists, libraries } ) => {
    const ethers = libraries['ethers']

    return {
        verifyMessage: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { message, signature } = userParams
                try {
                const recoveredAddress = ethers.verifyMessage( message, signature )
                struct.data = {
                message,
                recoveredAddress,
                signature
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to verify message signature' )
                }
                return { struct }
            }
        },
        verifyTypedData: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { domain, types, value, signature } = userParams
                try {
                const parsedDomain = JSON.parse( domain )
                const parsedTypes = JSON.parse( types )
                const parsedValue = JSON.parse( value )
                const recoveredAddress = ethers.verifyTypedData( parsedDomain, parsedTypes, parsedValue, signature )
                struct.data = {
                domain: parsedDomain,
                recoveredAddress,
                signature
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to verify typed data signature' )
                }
                return { struct }
            }
        },
        hashMessage: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { message } = userParams
                try {
                const hash = ethers.hashMessage( message )
                struct.data = {
                message,
                hash,
                prefix: '\\x19Ethereum Signed Message:\\n' + message.length
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to hash message' )
                }
                return { struct }
            }
        },
        recoverAddress: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { digest, signature } = userParams
                try {
                const recoveredAddress = ethers.recoverAddress( digest, signature )
                struct.data = {
                digest,
                recoveredAddress,
                signature
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to recover address' )
                }
                return { struct }
            }
        }
    }
}
