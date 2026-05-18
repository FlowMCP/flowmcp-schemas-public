// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// requiredLibraries: ethers
// Import: import { ethers } from 'ethers'

export const main = {
    namespace: 'ethers',
    name: 'Ethers Hash & Address Utils',
    description: 'Offline hash and address computation utilities powered by ethers.js. Compute keccak256 hashes, Solidity packed hashes, CREATE2 and CREATE addresses, ENS namehash, and checksum addresses. No RPC or API key required.',
    version: '4.0.0',
    docs: ['https://docs.ethers.org/v6/api/crypto/', 'https://docs.ethers.org/v6/api/address/'],
    tags: ['blockchain', 'evm', 'hash', 'address', 'offline'],
    root: 'https://offline.ethers.local',
    tools: {
        keccak256: {
            method: 'GET',
            path: '/',
            description: 'Compute the keccak256 hash of hex data (0x-prefixed) or UTF-8 text. For text input, it is first converted to UTF-8 bytes.',
            parameters: [
                {
                    position: {
                        key: 'data',
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
                        key: 'inputType',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(hex,text)',
                        options: ['optional()', 'default(hex)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Hash hex data',
                    data: '0x1234',
                    inputType: 'hex'
                },
                {
                    _description: 'Hash text string',
                    data: 'Hello World',
                    inputType: 'text'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from keccak256',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        solidityPackedKeccak256: {
            method: 'GET',
            path: '/',
            description: 'Compute keccak256 of Solidity tightly-packed encoded data. Provide types and values as JSON array strings. Equivalent to keccak256(abi.encodePacked(...)) in Solidity.',
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
                    _description: 'Pack address and uint256',
                    types: '["address","uint256"]',
                    values: '["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045","1"]'
                },
                {
                    _description: 'Additional test for solidityPackedKeccak256',
                    types: '["address","uint256"] alt',
                    values: '["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045","1"] alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from solidityPackedKeccak256',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getCreate2Address: {
            method: 'GET',
            path: '/',
            description: 'Compute the CREATE2 contract address from deployer address, salt (bytes32 hex), and init code hash (bytes32 hex). Used for predicting Uniswap pool addresses and other deterministic deployments.',
            parameters: [
                {
                    position: {
                        key: 'deployer',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['regex(^0x[a-fA-F0-9]{40}$)']
                    }
                },
                {
                    position: {
                        key: 'salt',
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
                        key: 'initCodeHash',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['regex(^0x[a-fA-F0-9]{64}$)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Compute Uniswap V3 pool address',
                    deployer: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
                    salt: '0x0000000000000000000000000000000000000000000000000000000000000001',
                    initCodeHash: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'
                },
                {
                    _description: 'Additional test for getCreate2Address',
                    deployer: '0x1F98431c8aD98523631AE4a59f267346ea31F984 alt',
                    salt: '0x0000000000000000000000000000000000000000000000000000000000000001 alt',
                    initCodeHash: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54 alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getCreate2Address',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getCreateAddress: {
            method: 'GET',
            path: '/',
            description: 'Compute the CREATE contract address from deployer address and nonce. Predicts the address of the next contract deployed by an account.',
            parameters: [
                {
                    position: {
                        key: 'deployer',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['regex(^0x[a-fA-F0-9]{40}$)']
                    }
                },
                {
                    position: {
                        key: 'nonce',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(0)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Compute CREATE address for nonce 0',
                    deployer: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
                    nonce: 0
                },
                {
                    _description: 'Additional test for getCreateAddress',
                    deployer: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 alt',
                    nonce: 1
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getCreateAddress',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        checksumAddress: {
            method: 'GET',
            path: '/',
            description: 'Convert an Ethereum address to its EIP-55 checksummed format. Validates that the input is a valid 20-byte address.',
            parameters: [
                {
                    position: {
                        key: 'address',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['regex(^0x[a-fA-F0-9]{40}$)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Checksum lowercase address',
                    address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
                },
                {
                    _description: 'Additional test for checksumAddress',
                    address: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from checksumAddress',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        namehash: {
            method: 'GET',
            path: '/',
            description: 'Compute the ENS namehash for a domain name. Used for resolving ENS names on-chain.',
            parameters: [
                {
                    position: {
                        key: 'name',
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
                    _description: 'Hash vitalik.eth',
                    name: 'vitalik.eth'
                },
                {
                    _description: 'Hash eth TLD',
                    name: 'eth'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from namehash',
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
        keccak256: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { data } = userParams
                const inputType = userParams.inputType || 'hex'
                try {
                const bytes = inputType === 'text'
                ? ethers.toUtf8Bytes( data )
                : data
                const hash = ethers.keccak256( bytes )
                struct.data = {
                input: data,
                inputType,
                hash
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to compute keccak256' )
                }
                return { struct }
            }
        },
        solidityPackedKeccak256: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { types, values } = userParams
                try {
                const parsedTypes = JSON.parse( types )
                const parsedValues = JSON.parse( values )
                const packed = ethers.solidityPacked( parsedTypes, parsedValues )
                const hash = ethers.keccak256( packed )
                struct.data = {
                types: parsedTypes,
                packed,
                hash
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to compute solidity packed keccak256' )
                }
                return { struct }
            }
        },
        getCreate2Address: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { deployer, salt, initCodeHash } = userParams
                try {
                const address = ethers.getCreate2Address( deployer, salt, initCodeHash )
                struct.data = {
                deployer,
                salt,
                initCodeHash,
                computedAddress: address
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to compute CREATE2 address' )
                }
                return { struct }
            }
        },
        getCreateAddress: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { deployer, nonce } = userParams
                try {
                const address = ethers.getCreateAddress( { from: deployer, nonce: Number( nonce ) } )
                struct.data = {
                deployer,
                nonce: Number( nonce ),
                computedAddress: address
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to compute CREATE address' )
                }
                return { struct }
            }
        },
        checksumAddress: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { address } = userParams
                try {
                const checksummed = ethers.getAddress( address )
                struct.data = {
                input: address,
                checksumAddress: checksummed,
                isValid: true
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Invalid address' )
                }
                return { struct }
            }
        },
        namehash: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { name } = userParams
                try {
                const hash = ethers.namehash( name )
                struct.data = {
                name,
                namehash: hash
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || 'Failed to compute namehash' )
                }
                return { struct }
            }
        }
    }
}
