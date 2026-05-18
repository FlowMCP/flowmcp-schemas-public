// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Import: import { EVM_CHAINS } from '../_shared/evmChains.mjs'
// Module-level code: 12 lines

export const main = {
    namespace: 'etherscan',
    name: 'SmartContractExplorer',
    description: 'Fetch current gas oracle data (safe, proposed, fast gas prices) across multiple EVM chains via the Etherscan v2 API. Supports Ethereum, Arbitrum, Polygon, Binance, Avalanche and more.',
    version: '4.0.0',
    docs: ['https://docs.etherscan.io'],
    tags: ['evm', 'gas', 'fees', 'cacheTtlRealtime'],
    sharedLists: [
        { ref: 'evmChains', version: '3.1.0' }
    ],
    root: 'https://api.etherscan.io/v2/api',
    requiredServerParams: ['ETHERSCAN_API_KEY'],
    tools: {
        getGasOracle: {
            method: 'GET',
            path: '/?module=gastracker&action=gasoracle&apikey={{ETHERSCAN_API_KEY}}',
            description: 'Fetch current gas oracle data (safe, proposed, fast gas prices) for a given EVM chain via Etherscan. Use estimateGasCost to estimate the time for a specific gas price.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(ETHEREUM_MAINNET,SEPOLIA_TESTNET,ARBITRUM_ONE_MAINNET,POLYGON_MAINNET,BINANCE_MAINNET,AVALANCHE_CCHAIN)', options: [] } }
            ],
            tests: [
                { _description: 'Gas oracle on Ethereum Mainnet', chainName: 'ETHEREUM_MAINNET' },
                { _description: 'Gas oracle on Arbitrum One', chainName: 'ARBITRUM_ONE_MAINNET' },
                { _description: 'Gas oracle on Polygon', chainName: 'POLYGON_MAINNET' },
                { _description: 'Gas oracle on Binance Smart Chain', chainName: 'BINANCE_MAINNET' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Gas oracle response with safe, proposed, and fast gas price tiers for the requested chain',
                    properties: {
                        status: { type: 'string', description: 'API status code, 1 for success, 0 for error' },
                        message: { type: 'string', description: 'Status message, typically OK or NOTOK' },
                        result: { type: 'string', description: 'Gas oracle data object (after postRequest handler extracts from wrapper) containing SafeGasPrice, ProposeGasPrice, FastGasPrice in Gwei' }
                    }
                }
            },
        },
        estimateGasCost: {
            method: 'GET',
            path: '/?module=gastracker&action=gasestimate&apikey={{ETHERSCAN_API_KEY}}',
            description: 'Estimate the confirmation time in seconds for a given gas price on a specific EVM chain. Use getGasOracle first to determine current gas price tiers.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(ETHEREUM_MAINNET,SEPOLIA_TESTNET,ARBITRUM_ONE_MAINNET,POLYGON_MAINNET,BINANCE_MAINNET,AVALANCHE_CCHAIN)', options: [] } },
                { position: { key: 'gasprice', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Estimate gas cost on Ethereum with 2 Gwei', chainName: 'ETHEREUM_MAINNET', gasprice: '2000000000' },
                { _description: 'Estimate gas cost on Polygon with 30 Gwei', chainName: 'POLYGON_MAINNET', gasprice: '30000000000' },
                { _description: 'Estimate gas cost on Binance with 5 Gwei', chainName: 'BINANCE_MAINNET', gasprice: '5000000000' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Estimated confirmation time for the given gas price on the requested chain',
                    properties: {
                        status: { type: 'string', description: 'API status code, 1 for success, 0 for error' },
                        message: { type: 'string', description: 'Status message, typically OK or NOTOK' },
                        result: { type: 'string', description: 'Estimated confirmation time in seconds for the provided gas price' }
                    }
                }
            },
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
        getGasOracle: {
            preRequest: async ( { struct, payload } ) => {
                const { chainName } = payload
                const { chainId } = chainsByAlias[chainName]
                struct['url'] = struct['url'].replace(`chainName=${chainName}`, `chainid=${chainId}`)
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
        },
        estimateGasCost: {
            preRequest: async ( { struct, payload } ) => {
                const { chainName } = payload
                const { chainId } = chainsByAlias[chainName]
                struct['url'] = struct['url'].replace(`chainName=${chainName}`, `chainid=${chainId}`)
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
