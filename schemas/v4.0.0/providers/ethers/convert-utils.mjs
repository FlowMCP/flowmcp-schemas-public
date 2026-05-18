// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// requiredLibraries: ethers
// Import: import { ethers } from 'ethers'

export const main = {
    namespace: 'ethers',
    name: 'Ethers Convert Utils',
    description: 'Offline unit conversion and data transformation utilities powered by ethers.js. Convert between wei and human-readable units, format and parse ether values, hexlify numbers, and convert between hex and UTF-8. No RPC or API key required.',
    version: '4.0.0',
    docs: ['https://docs.ethers.org/v6/api/utils/'],
    tags: ['blockchain', 'evm', 'conversion', 'units', 'encoding', 'offline'],
    root: 'https://offline.ethers.local',
    tools: {
        formatUnits: {
            method: 'GET',
            path: '/',
            description: 'Format a wei value into a human-readable string with the specified number of decimals. Default is 18 (like ETH). Use 6 for USDC/USDT, 8 for WBTC.',
            parameters: [
                {
                    position: {
                        key: 'value',
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
                        key: 'decimals',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(0)', 'max(77)', 'optional()', 'default(18)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Format 1 ETH in wei',
                    value: '1000000000000000000',
                    decimals: 18
                },
                {
                    _description: 'Format 1 USDC (6 decimals)',
                    value: '1000000',
                    decimals: 6
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from formatUnits',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        parseUnits: {
            method: 'GET',
            path: '/',
            description: 'Parse a human-readable value string into wei with the specified number of decimals. Default is 18. Use 6 for USDC/USDT, 8 for WBTC.',
            parameters: [
                {
                    position: {
                        key: 'value',
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
                        key: 'decimals',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(0)', 'max(77)', 'optional()', 'default(18)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Parse 1.5 ETH to wei',
                    value: '1.5',
                    decimals: 18
                },
                {
                    _description: 'Parse 100 USDC to atomic units',
                    value: '100',
                    decimals: 6
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from parseUnits',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        formatEther: {
            method: 'GET',
            path: '/',
            description: 'Format a wei value to ether (18 decimals). Shorthand for formatUnits(value, 18).',
            parameters: [
                {
                    position: {
                        key: 'value',
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
                    _description: 'Format 1 ETH',
                    value: '1000000000000000000'
                },
                {
                    _description: 'Format 0.5 ETH',
                    value: '500000000000000000'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from formatEther',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        parseEther: {
            method: 'GET',
            path: '/',
            description: 'Parse an ether string to wei. Shorthand for parseUnits(value, 18).',
            parameters: [
                {
                    position: {
                        key: 'value',
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
                    _description: 'Parse 1.0 ETH',
                    value: '1.0'
                },
                {
                    _description: 'Parse 0.001 ETH',
                    value: '0.001'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from parseEther',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        hexlify: {
            method: 'GET',
            path: '/',
            description: 'Convert a number or numeric string to a 0x-prefixed hex string.',
            parameters: [
                {
                    position: {
                        key: 'value',
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
                    _description: 'Hexlify 255',
                    value: '255'
                },
                {
                    _description: 'Hexlify 1000000',
                    value: '1000000'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from hexlify',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        toUtf8String: {
            method: 'GET',
            path: '/',
            description: 'Decode a hex-encoded byte string to its UTF-8 text representation.',
            parameters: [
                {
                    position: {
                        key: 'data',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['regex(^0x[a-fA-F0-9]*$)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Decode Hello World hex',
                    data: '0x48656c6c6f20576f726c64'
                },
                {
                    _description: 'Additional test for toUtf8String',
                    data: '0x48656c6c6f20576f726c64 alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from toUtf8String',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        toUtf8Bytes: {
            method: 'GET',
            path: '/',
            description: 'Encode a UTF-8 text string to its hex-encoded byte representation.',
            parameters: [
                {
                    position: {
                        key: 'text',
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
                    _description: 'Encode Hello World to hex',
                    text: 'Hello World'
                },
                {
                    _description: 'Additional test for toUtf8Bytes',
                    text: 'Hello World alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from toUtf8Bytes',
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
        formatUnits: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { value } = userParams
                const decimals = userParams.decimals !== undefined ? Number( userParams.decimals ) : 18
                try {
                const formatted = ethers.formatUnits( value, decimals )
                struct.data = {
                wei: value,
                decimals,
                formatted
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to format units' )
                }
                return { struct }
            }
        },
        parseUnits: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { value } = userParams
                const decimals = userParams.decimals !== undefined ? Number( userParams.decimals ) : 18
                try {
                const parsed = ethers.parseUnits( value, decimals )
                struct.data = {
                input: value,
                decimals,
                wei: parsed.toString()
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to parse units' )
                }
                return { struct }
            }
        },
        formatEther: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { value } = userParams
                try {
                const formatted = ethers.formatEther( value )
                struct.data = {
                wei: value,
                ether: formatted
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to format ether' )
                }
                return { struct }
            }
        },
        parseEther: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { value } = userParams
                try {
                const parsed = ethers.parseEther( value )
                struct.data = {
                ether: value,
                wei: parsed.toString()
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to parse ether' )
                }
                return { struct }
            }
        },
        hexlify: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { value } = userParams
                try {
                const hex = ethers.toBeHex( BigInt( value ) )
                struct.data = {
                input: value,
                hex
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to hexlify value' )
                }
                return { struct }
            }
        },
        toUtf8String: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { data } = userParams
                try {
                const text = ethers.toUtf8String( data )
                struct.data = {
                hex: data,
                text
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to decode UTF-8 string' )
                }
                return { struct }
            }
        },
        toUtf8Bytes: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { text } = userParams
                try {
                const bytes = ethers.toUtf8Bytes( text )
                const hex = ethers.hexlify( bytes )
                struct.data = {
                text,
                hex,
                byteLength: bytes.length
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to encode UTF-8 bytes' )
                }
                return { struct }
            }
        }
    }
}
