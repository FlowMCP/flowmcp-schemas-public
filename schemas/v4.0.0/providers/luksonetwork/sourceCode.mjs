// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "luksoNetwork" -> "luksonetwork"

export const main = {
    namespace: 'luksonetwork',
    name: 'Contract',
    description: 'Retrieve smart contract data from LUKSO BlockScout — list verified contracts, get ABI, fetch source code, and look up contract creation transaction details.',
    version: '4.0.0',
    docs: ['https://explorer.execution.mainnet.lukso.network/api-docs', 'https://explorer.execution.testnet.lukso.network/api-docs'],
    tags: ['lukso', 'contracts', 'sourcecode', 'cacheTtlDaily'],
    root: 'https://explorer.execution.--chain--.lukso.network/api',
    tools: {
        listcontracts: {
            method: 'GET',
            path: '/?module=contract&action=listcontracts',
            description: 'List sorted contracts, optionally filtered via LUKSO BlockScout. Supports page, offset, filter filters.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'filter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(verified,unverified,empty,1,2,3)', options: ['optional()'] } },
                { position: { key: 'verified_at_start_timestamp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'verified_at_end_timestamp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'List verified contracts', chainName: 'LUKSO_MAINNET', page: 1, offset: 10, filter: 'verified' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        result: { type: 'array', items: { type: 'object', properties: { ABI: { type: 'string' }, Address: { type: 'string' }, CompilerVersion: { type: 'string' }, ContractName: { type: 'string' }, OptimizationUsed: { type: 'string' } } } },
                        status: { type: 'string' }
                    }
                }
            },
        },
        getabi: {
            method: 'GET',
            path: '/?module=contract&action=getabi',
            description: 'Get ABI for a verified contract via LUKSO BlockScout. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get ABI for known address',
                    chainName: 'LUKSO_MAINNET',
                    address: '0xd9db270c1b5e3bd161e8c8503c55ceabee709552'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        result: { type: 'string' },
                        status: { type: 'string' }
                    }
                }
            },
        },
        getsourcecode: {
            method: 'GET',
            path: '/?module=contract&action=getsourcecode',
            description: 'Get contract source code via LUKSO BlockScout. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Fetch source code for contract',
                    chainName: 'LUKSO_MAINNET',
                    address: '0xd9db270c1b5e3bd161e8c8503c55ceabee709552'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        result: { type: 'array', items: { type: 'object', properties: { AdditionalSources: { type: 'array', items: { type: 'object' } }, CompilerSettings: { type: 'object' }, IsProxy: { type: 'string' }, SourceCode: { type: 'string' }, ABI: { type: 'string' }, ContractName: { type: 'string' }, CompilerVersion: { type: 'string' }, OptimizationUsed: { type: 'string' }, EVMVersion: { type: 'string' }, FileName: { type: 'string' }, Address: { type: 'string' } } } },
                        status: { type: 'string' }
                    }
                }
            },
        },
        getcontractcreation: {
            method: 'GET',
            path: '/?module=contract&action=getcontractcreation',
            description: 'Get contract creator and creation tx hash via LUKSO BlockScout. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'contractaddresses', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get creation data for contracts',
                    chainName: 'LUKSO_MAINNET',
                    contractaddresses: '0xd9db270c1b5e3bd161e8c8503c55ceabee709552'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        result: { type: 'array', items: { type: 'object', properties: { blockNumber: { type: 'string' }, contractAddress: { type: 'string' }, contractCreator: { type: 'string' }, contractFactory: { type: 'string' }, creationBytecode: { type: 'string' }, timestamp: { type: 'string' }, txHash: { type: 'string' } } } },
                        status: { type: 'string' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    listcontracts: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            struct['url'] = struct['url']
            .replace("--chain--", alias[payload.chainName]);
            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            if( response?.message !== 'OK' ) {
                throw new Error( response?.message || 'Request failed' )
            } else if( typeof response?.message ) {
            response = response?.result
            }
            return { response }
        }
    },
    getabi: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            struct['url'] = struct['url']
            .replace("--chain--", alias[payload.chainName]);
            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            if( response?.message !== 'OK' ) {
                throw new Error( response?.message || 'Request failed' )
            } else if( typeof response?.message ) {
            response = response?.result
            }
            return { response }
        }
    },
    getsourcecode: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            struct['url'] = struct['url']
            .replace("--chain--", alias[payload.chainName]);
            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            if( response?.message !== 'OK' ) {
                throw new Error( response?.message || 'Request failed' )
            } else if( typeof response?.message ) {
            response = response?.result
            }
            return { response }
        }
    },
    getcontractcreation: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" };
            struct['url'] = struct['url']
            .replace("--chain--", alias[payload.chainName]);
            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            if( response?.message !== 'OK' ) {
                throw new Error( response?.message || 'Request failed' )
            } else if( typeof response?.message ) {
            response = response?.result
            }
            return { response }
        }
    }
} )
