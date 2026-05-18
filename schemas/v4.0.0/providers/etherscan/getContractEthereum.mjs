// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'etherscan',
    name: 'Etherscan',
    description: 'Retrieve smart contract ABI and verified Solidity source code from Etherscan (Ethereum mainnet). Returns the contract interface definition and full source for any verified contract address on Ethereum.',
    version: '4.0.0',
    docs: ['https://docs.etherscan.io'],
    tags: ['ethereum', 'contracts', 'explorer', 'cacheTtlDaily'],
    root: 'https://api.etherscan.io/v2/api',
    requiredServerParams: ['ETHERSCAN_API_KEY'],
    tools: {
        getContractABI: {
            method: 'GET',
            path: '/?chainid=1&module=contract&action=getabi&apikey={{ETHERSCAN_API_KEY}}',
            description: 'Get the ABI (Application Binary Interface) of a verified smart contract. Returns a JSON-encoded ABI string that defines the contract functions and events. Use getContractSourceCode to also retrieve the Solidity source.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(42)', 'max(42)'] } }
            ],
            tests: [
                { _description: 'Uniswap V2 Factory', address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' },
                { _description: 'Uniswap V2 Router02', address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' },
                { _description: 'USDT Token Contract', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Etherscan API response containing the contract ABI as a JSON-encoded string',
                    properties: {
                        status: { type: 'string', description: 'API status code, 1 for success, 0 for error (e.g., unverified contract)' },
                        message: { type: 'string', description: 'Status message, typically OK or NOTOK' },
                        result: { type: 'string', description: 'JSON-encoded ABI array string defining contract functions, events, and their parameters' }
                    }
                }
            },
        },
        getContractSourceCode: {
            method: 'GET',
            path: '/?chainid=1&module=contract&action=getsourcecode&apikey={{ETHERSCAN_API_KEY}}',
            description: 'Get the verified Solidity source code, compiler settings, and metadata of a smart contract. Use getContractABI for just the interface definition.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(42)', 'max(42)'] } }
            ],
            tests: [
                { _description: 'Uniswap V2 Factory', address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' },
                { _description: 'Uniswap V2 Router02', address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' },
                { _description: 'USDT Token Contract', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Etherscan API response with full contract source code and compilation details',
                    properties: {
                        status: { type: 'string', description: 'API status code, 1 for success, 0 for error' },
                        message: { type: 'string', description: 'Status message, typically OK or NOTOK' },
                        result: {
                            type: 'array',
                            description: 'Array containing one contract source code object (always single-element)',
                            items: {
                                type: 'object',
                                properties: {
                                    SourceCode: { type: 'string', description: 'Full Solidity source code, may be JSON-encoded for multi-file contracts' },
                                    ABI: { type: 'string', description: 'JSON-encoded ABI string' },
                                    ContractName: { type: 'string', description: 'Name of the contract as declared in Solidity' },
                                    CompilerVersion: { type: 'string', description: 'Solidity compiler version used (e.g., v0.8.17+commit.8df45f5f)' },
                                    CompilerType: { type: 'string', description: 'Compiler type, typically solc or vyper' },
                                    OptimizationUsed: { type: 'string', description: 'Whether compiler optimization was enabled, 0 or 1' },
                                    Runs: { type: 'string', description: 'Number of optimization runs configured' },
                                    ConstructorArguments: { type: 'string', description: 'ABI-encoded constructor arguments used at deployment' },
                                    EVMVersion: { type: 'string', description: 'Target EVM version (e.g., london, paris)' },
                                    Library: { type: 'string', description: 'Linked library addresses if any' },
                                    ContractFileName: { type: 'string', description: 'Source file name of the contract' },
                                    LicenseType: { type: 'string', description: 'SPDX license identifier (e.g., MIT, GPL-3.0)' },
                                    Proxy: { type: 'string', description: 'Whether contract is a proxy, 0 or 1' },
                                    Implementation: { type: 'string', description: 'Implementation contract address if proxy' },
                                    SwarmSource: { type: 'string', description: 'Swarm hash for source verification' },
                                    SimilarMatch: { type: 'string', description: 'Whether this is a similar match to a verified contract' }
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
    getContractABI: {
        postRequest: async ( { response, struct, payload } ) => {
            if( response.status !== "1" ) {
            throw new Error( response.message )
            }
            response = response.result
            return { response }
        }
    },
    getContractSourceCode: {
        postRequest: async ( { response, struct, payload } ) => {
            if( response.status !== "1" ) {
            throw new Error( response.message )
            }
            response = response.result
            return { response }
        }
    }
} )
