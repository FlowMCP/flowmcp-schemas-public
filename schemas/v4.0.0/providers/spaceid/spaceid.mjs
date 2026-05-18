// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Module-level code: 25 lines

export const main = {
    namespace: 'spaceid',
    name: 'SPACE ID Web3 Name API',
    description: 'Resolve crypto addresses and domain names via SPACE ID\'s on-chain resolution API.',
    version: '4.0.0',
    docs: ['https://nameapi.space.id', 'https://space.id', 'https://docs.space.id'],
    tags: ['production', 'domain', 'identity', 'blockchain', 'cacheTtlDaily'],
    root: 'https://nameapi.space.id',
    tools: {
        getSupportedChains: {
            method: 'GET',
            path: '/',
            description: 'List supported chains and their domain suffixes (static, compiled from docs). via spaceid.',
            parameters: [],
            tests: [
                { _description: 'Return supported chains list' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: { type: 'object', properties: { chain: { type: 'string' }, chainID: { type: 'number' }, domain: { type: 'string' } } }
                }
            },
        },
        getAddress: {
            method: 'GET',
            path: '/getAddress',
            description: 'Resolve domain name to wallet address (e.g. steven.sei → sei1whl4xw...). Required: domain.',
            parameters: [
                { position: { key: 'domain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Resolve steven.sei to address', domain: 'steven.sei' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        address: { type: 'string' },
                        code: { type: 'number' },
                        msg: { type: 'string' }
                    }
                }
            },
        },
        getName: {
            method: 'GET',
            path: '/getName',
            description: 'Resolve wallet address to primary domain name on specified chain. Required: chainid, address.',
            parameters: [
                { position: { key: 'chainid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Resolve Sei address to steven.sei',
                    chainid: '902',
                    address: 'sei1whl4xw33yzgadnm23uhk4q9y39lynlptwjctxp'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        code: { type: 'number' },
                        data: { type: 'object', properties: { name: { type: 'string' }, chainID: { type: 'number' }, errMsg: { type: 'string' } } },
                        msg: { type: 'string' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {

    const SUPPORTED = [
        { chain: "Ethereum Mainnet", chainID: 1, domain: ".eth" },
        { chain: "BNB Chain", chainID: 56, domain: ".bnb" },
        { chain: "Solana", chainID: 900, domain: ".sol" },
        { chain: "Arbitrum One", chainID: 42161, domain: ".arb" },
        { chain: "Manta Pacific Mainnet", chainID: 169, domain: ".manta" },
        { chain: "Mode", chainID: 34443, domain: ".mode" },
        { chain: "ZKFair Mainnet", chainID: 42766, domain: ".zfk" },
        { chain: "Lightlink Phoenix Mainnet", chainID: 1890, domain: ".ll" },
        { chain: "ZetaChain Mainnet", chainID: 7000, domain: ".zeta" },
        { chain: "Merlin Mainnet", chainID: 4200, domain: ".merlin" },
        { chain: "Gnosis", chainID: 100, domain: ".gno" },
        { chain: "Taiko Alethia", chainID: 167000, domain: ".taiko" },
        { chain: "AlienX Mainnet", chainID: 10241024, domain: ".alien" },
        { chain: "Mint Mainnet", chainID: 185, domain: ".mint" },
        { chain: "AILayer Mainnet", chainID: 2649, domain: ".ail" },
        { chain: "Morph", chainID: 2818, domain: ".mph" },
        { chain: "DuckChain Mainnet", chainID: 5545, domain: ".duck" },
        { chain: "Gravity Alpha Mainnet", chainID: 1625, domain: ".g" },
        { chain: "Story", chainID: 1514, domain: ".ip" },
        { chain: "Injective", chainID: 901, domain: ".inj" },
        { chain: "Sei", chainID: 902, domain: ".sei" },
        { chain: "Lens on Polygon", chainID: 903, domain: ".lens" },
        { chain: "Crypto on Polygon", chainID: 904, domain: ".crypto" }
    ]

    return {
        getSupportedChains: {
            executeRequest: async ( { struct, payload } ) => {
                struct.status = true
                struct.data = SUPPORTED.slice()
                return { struct }
            }
        }
    }
}
