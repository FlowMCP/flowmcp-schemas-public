// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// requiredLibraries: ethers
// Import: import { ethers } from 'ethers'

export const main = {
    namespace: 'ethers',
    name: 'Ethers ABI Utils',
    description: 'Offline ABI encoding and decoding utilities powered by ethers.js. Decode calldata, encode function calls, decode event logs, compute function selectors, and ABI encode/decode arbitrary parameters. No RPC or API key required.',
    version: '4.0.0',
    docs: ['https://docs.ethers.org/v6/api/abi/'],
    tags: ['blockchain', 'evm', 'abi', 'encoding', 'decoding', 'offline'],
    root: 'https://offline.ethers.local',
    tools: {
        decodeFunctionData: {
            method: 'GET',
            path: '/',
            description: 'Decode calldata (transaction input) using a human-readable ABI fragment. Returns the function name and decoded arguments. Use encodeFunctionData for related data. Use decodeEventLog for related data.',
            parameters: [
                {
                    position: {
                        key: 'functionSignature',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(10)']
                    }
                },
                {
                    position: {
                        key: 'data',
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
                    _description: 'Decode ERC-20 transfer calldata',
                    functionSignature: 'function transfer(address to, uint256 amount)',
                    data: '0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a7640000'
                },
                {
                    _description: 'Additional test for decodeFunctionData',
                    functionSignature: 'function transfer(address to, uint256 amount) alt',
                    data: '0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a7640000 alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from decodeFunctionData',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        encodeFunctionData: {
            method: 'GET',
            path: '/',
            description: 'Encode a function call into calldata using a human-readable ABI fragment and arguments as a JSON array string. Use decodeFunctionData for related data. Use decodeEventLog for related data.',
            parameters: [
                {
                    position: {
                        key: 'functionSignature',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(10)']
                    }
                },
                {
                    position: {
                        key: 'args',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()', 'default([])']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Encode ERC-20 transfer call',
                    functionSignature: 'function transfer(address to, uint256 amount)',
                    args: '["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "1000000000000000000"]'
                },
                {
                    _description: 'Additional test for encodeFunctionData',
                    functionSignature: 'function transfer(address to, uint256 amount) alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from encodeFunctionData',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        decodeEventLog: {
            method: 'GET',
            path: '/',
            description: 'Decode an event log using a human-readable event ABI fragment, log data, and topics array (as JSON string). Use decodeFunctionData for related data. Use encodeFunctionData for related data.',
            parameters: [
                {
                    position: {
                        key: 'eventSignature',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(10)']
                    }
                },
                {
                    position: {
                        key: 'data',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'topics',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(4)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Decode ERC-20 Transfer event',
                    eventSignature: 'event Transfer(address indexed from, address indexed to, uint256 value)',
                    data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
                    topics: '["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045","0x000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7"]'
                },
                {
                    _description: 'Additional test for decodeEventLog',
                    eventSignature: 'event Transfer(address indexed from, address indexed to, uint256 value) alt',
                    data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000 alt',
                    topics: '["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045","0x000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7"] alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from decodeEventLog',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        computeSelector: {
            method: 'GET',
            path: '/',
            description: "Compute the 4-byte function selector from a function signature string (e.g. 'transfer(address,uint256)'). Use decodeFunctionData for related data. Use encodeFunctionData for related data.",
            parameters: [
                {
                    position: {
                        key: 'signature',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(3)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Compute transfer selector',
                    signature: 'transfer(address,uint256)'
                },
                {
                    _description: 'Compute approve selector',
                    signature: 'approve(address,uint256)'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from computeSelector',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        encodeParameters: {
            method: 'GET',
            path: '/',
            description: 'ABI encode parameters given types and values as JSON array strings. Types example: \'["address","uint256"]\', values example: \'["0xabc...","100"]\'. Use decodeFunctionData for related data. Use encodeFunctionData for related data.',
            parameters: [
                {
                    position: {
                        key: 'types',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(4)']
                    }
                },
                {
                    position: {
                        key: 'values',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(2)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Encode address and uint256',
                    types: '["address","uint256"]',
                    values: '["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045","1000000000000000000"]'
                },
                {
                    _description: 'Additional test for encodeParameters',
                    types: '["address","uint256"] alt',
                    values: '["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045","1000000000000000000"] alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from encodeParameters',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        decodeParameters: {
            method: 'GET',
            path: '/',
            description: 'ABI decode hex data back to values given types as a JSON array string. Types example: \'["address","uint256"]\'. Use decodeFunctionData for related data. Use encodeFunctionData for related data.',
            parameters: [
                {
                    position: {
                        key: 'types',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(4)']
                    }
                },
                {
                    position: {
                        key: 'data',
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
                    _description: 'Decode address and uint256',
                    types: '["address","uint256"]',
                    data: '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a7640000'
                },
                {
                    _description: 'Additional test for decodeParameters',
                    types: '["address","uint256"] alt',
                    data: '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a7640000 alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from decodeParameters',
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
        decodeFunctionData: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { functionSignature, data } = userParams
                try {
                const iface = new ethers.Interface( [ functionSignature ] )
                const decoded = iface.parseTransaction( { data } )
                if( !decoded ) {
                struct.status = false
                struct.messages.push( 'Failed to decode: selector mismatch or invalid data' )
                return { struct }}
                const args = {}
                decoded.fragment.inputs
                .forEach( ( input, idx ) => {
                const value = decoded.args[ idx ]
                args[ input.name || `arg${idx}` ] = typeof value === 'bigint' ? value.toString() : value
                } )
                struct.data = {
                functionName: decoded.name,
                selector: decoded.selector,
                args,
                signature: decoded.signature
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to decode function data' )
                }
                return { struct }
            }
        },
        encodeFunctionData: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { functionSignature } = userParams
                const args = userParams.args || '[]'
                try {
                const parsedArgs = JSON.parse( args )
                const iface = new ethers.Interface( [ functionSignature ] )
                const functionName = iface.fragments[ 0 ].name
                const encoded = iface.encodeFunctionData( functionName, parsedArgs )
                struct.data = {
                functionName,
                selector: encoded.slice( 0, 10 ),
                encoded,
                byteLength: ( encoded.length - 2 ) / 2
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to encode function data' )
                }
                return { struct }
            }
        },
        decodeEventLog: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { eventSignature, data, topics } = userParams
                try {
                const parsedTopics = JSON.parse( topics )
                const iface = new ethers.Interface( [ eventSignature ] )
                const decoded = iface.parseLog( { data, topics: parsedTopics } )
                if( !decoded ) {
                struct.status = false
                struct.messages.push( 'Failed to decode: topic mismatch or invalid data' )
                return { struct }}
                const args = {}
                decoded.fragment.inputs
                .forEach( ( input, idx ) => {
                const value = decoded.args[ idx ]
                args[ input.name || `arg${idx}` ] = typeof value === 'bigint' ? value.toString() : value
                } )
                struct.data = {
                eventName: decoded.name,
                signature: decoded.signature,
                topic: decoded.topic,
                args
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to decode event log' )
                }
                return { struct }
            }
        },
        computeSelector: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { signature } = userParams
                try {
                const fullSig = signature.startsWith( 'function ' ) ? signature : `function ${signature}`
                const iface = new ethers.Interface( [ fullSig ] )
                const fragment = iface.fragments[ 0 ]
                struct.data = {
                signature: fragment.format( 'sighash' ),
                selector: iface.getFunction( fragment.name ).selector,
                fullSignature: fragment.format( 'full' )
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to compute selector' )
                }
                return { struct }
            }
        },
        encodeParameters: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { types, values } = userParams
                try {
                const parsedTypes = JSON.parse( types )
                const parsedValues = JSON.parse( values )
                const coder = ethers.AbiCoder.defaultAbiCoder()
                const encoded = coder.encode( parsedTypes, parsedValues )
                struct.data = {
                types: parsedTypes,
                encoded,
                byteLength: ( encoded.length - 2 ) / 2
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to encode parameters' )
                }
                return { struct }
            }
        },
        decodeParameters: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { types, data } = userParams
                try {
                const parsedTypes = JSON.parse( types )
                const coder = ethers.AbiCoder.defaultAbiCoder()
                const decoded = coder.decode( parsedTypes, data )
                const values = parsedTypes
                .map( ( type, idx ) => {
                const value = decoded[ idx ]
                const formatted = typeof value === 'bigint' ? value.toString() : value

                return { type, value: formatted }
                } )
                struct.data = {
                types: parsedTypes,
                values
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to decode parameters' )
                }
                return { struct }
            }
        }
    }
}
