// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Import: import { EVM_CHAINS } from '../_shared/evmChains.mjs'
// Module-level code: 10 lines

export const main = {
    namespace: 'etherscan',
    name: 'SmartContractExplorer',
    description: 'Retrieve smart contract ABI and verified source code across 60+ EVM chains via Etherscan v2 API. Lists available chains and fetches contract data by address.',
    version: '4.0.0',
    docs: ['https://docs.etherscan.io'],
    tags: ['evm', 'contracts', 'explorer', 'cacheTtlDaily'],
    sharedLists: [
        {
            ref: 'evmChains',
            version: '3.1.0'
        }
    ],
    root: 'https://api.etherscan.io/v2/api',
    requiredServerParams: ['ETHERSCAN_API_KEY'],
    tools: {
        getAvailableChains: {
            method: 'GET',
            path: '/chains',
            description: 'List available blockchain aliases via Etherscan. Returns structured JSON response data. Use getSmartContractAbi for related data. Use getSourceCode for related data.',
            parameters: [],
            tests: [
                {
                    _description: 'Fetch available chains'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getAvailableChains',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getSmartContractAbi: {
            method: 'GET',
            path: '/?module=contract&action=getabi&apikey={{ETHERSCAN_API_KEY}}',
            description: 'Fetch smart contract source code by alias via Etherscan. Returns structured JSON response data. Use getAvailableChains for related data. Use getSourceCode for related data.',
            parameters: [
                {
                    position: {
                        key: 'chainName',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum({{evmChains:etherscanAlias}})',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'address',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(42)', 'max(42)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Uniswap V2 Factory on Ethereum',
                    chainName: 'ETHEREUM_MAINNET',
                    address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
                },
                {
                    _description: 'Uniswap V3 Factory on Ethereum',
                    chainName: 'ETHEREUM_MAINNET',
                    address: '0x1F98431c8aD98523631AE4a59f267346ea31F984'
                },
                {
                    _description: 'QuickSwap Factory on Polygon',
                    chainName: 'POLYGON_MAINNET',
                    address: '0x5757371414417b8c6caad45baef941abc7d3ab32'
                },
                {
                    _description: 'PancakeSwap V2 Factory on BNB Chain',
                    chainName: 'BINANCE_MAINNET',
                    address: '0xca143ce32fe78f1f7019d7d551a6402fc5350c73'
                },
                {
                    _description: 'Trader Joe V2.1 Factory on Avalanche',
                    chainName: 'AVALANCHE_CCHAIN',
                    address: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            description: 'Response status indicator'
                        },
                        message: {
                            type: 'string',
                            description: 'Response message or payload'
                        },
                        result: {
                            type: 'string',
                            description: 'Result payload from the API'
                        }
                    }
                }
            }
        },
        getSourceCode: {
            method: 'GET',
            path: '/?module=contract&action=getsourcecode&apikey={{ETHERSCAN_API_KEY}}',
            description: 'Fetch smart contract source code by alias via Etherscan. Returns structured JSON response data. Use getAvailableChains for related data. Use getSmartContractAbi for related data.',
            parameters: [
                {
                    position: {
                        key: 'chainName',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum({{evmChains:etherscanAlias}})',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'address',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(42)', 'max(42)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Uniswap V2 Factory on Ethereum',
                    chainName: 'ETHEREUM_MAINNET',
                    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
                },
                {
                    _description: 'QuickSwap Factory on Polygon',
                    chainName: 'POLYGON_MAINNET',
                    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
                },
                {
                    _description: 'PancakeSwap V2 Factory on BNB Chain',
                    chainName: 'BINANCE_MAINNET',
                    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
                },
                {
                    _description: 'Trader Joe V2.1 Factory on Avalanche',
                    chainName: 'AVALANCHE_CCHAIN',
                    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            description: 'Response status indicator'
                        },
                        message: {
                            type: 'string',
                            description: 'Response message or payload'
                        },
                        result: {
                            type: 'string',
                            description: 'Result payload from the API'
                        }
                    }
                }
            }
        }
    }
}

export const handlers = ( { sharedLists, libraries } ) => {
    const EVM_CHAINS = sharedLists['evmChains']

    const etherscanChains = EVM_CHAINS
        .filter( ( c ) => c.etherscanAlias !== undefined )
    const chainsByAlias = etherscanChains
        .reduce( ( acc, chain ) => {
            acc[ chain.etherscanAlias ] = { chainId: chain.etherscanChainId, name: chain.name }
            return acc
        }, {} )
    return {
        getAvailableChains: {
            executeRequest: async ( { struct, payload } ) => {
                struct['data'] = Object.keys( chainsByAlias )

                return { struct }
            }
        },
        getSmartContractAbi: {
            preRequest: async ( { struct, payload } ) => {
                const { chainName } = payload
                const { chainId } = chainsByAlias[ chainName ]
                struct['url'] = struct['url']
                .replace( `chainName=${chainName}`, `chainid=${chainId}` )

                return { struct }
            },
            postRequest: async ( { response, struct, payload } ) => {
                if( !response ) { return { response }}

                if( response.status !== "1" ) {
                throw new Error( response.message )
                }

                response = JSON.parse( response?.result )

                return { response }
            }
        },
        getSourceCode: {
            preRequest: async ( { struct, payload } ) => {
                const { chainName } = payload
                const { chainId } = chainsByAlias[ chainName ]
                struct['url'] = struct['url']
                .replace( `chainName=${chainName}`, `chainid=${chainId}` )

                return { struct }
            },
            postRequest: async ( { response, struct, payload } ) => {
                if( !response ) { return { response }}

                if( response.status !== "1" ) {
                throw new Error( response.message )
                }

                response = response.result

                return { response }
            }
        }
    }
}
