// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "luksoNetwork" -> "luksonetwork"

export const main = {
    namespace: 'luksonetwork',
    name: 'LUKSO BlockScout NFTs',
    description: 'Query NFT data on LUKSO via BlockScout — collections, instances, holders, and transfers for any address or smart contract on LUKSO Mainnet.',
    version: '4.0.0',
    docs: ['https://explorer.execution.mainnet.lukso.network/api-docs', 'https://explorer.execution.testnet.lukso.network/api-docs'],
    tags: ['lukso', 'nft', 'collectibles', 'cacheTtlDaily'],
    root: 'https://explorer.execution.--chain--.lukso.network/api/v2',
    tools: {
        getNFTsByAddress: {
            method: 'GET',
            path: '/addresses/:address_hash/nft',
            description: 'NFTs owned by address via LUKSO BlockScout — query by address hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get NFTs for address',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0xC15509fDB3616FdE248d56122138f2F7C122a123'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { animation_url: { type: 'string', nullable: true }, external_app_url: { type: 'string' }, id: { type: 'string' }, image_url: { type: 'string' }, is_unique: { type: 'boolean', nullable: true }, media_type: { type: 'string', nullable: true }, media_url: { type: 'string' }, metadata: { type: 'object' }, owner: { type: 'string', nullable: true }, thumbnails: { type: 'string', nullable: true }, token: { type: 'object' }, token_type: { type: 'string' }, value: { type: 'string' } } } },
                        next_page_params: { type: 'object', properties: { token_type: { type: 'string' }, token_contract_address_hash: { type: 'string' }, token_id: { type: 'string' }, items_count: { type: 'number' } } }
                    }
                }
            },
        },
        getNFTCollectionsByAddress: {
            method: 'GET',
            path: '/addresses/:address_hash/nft/collections',
            description: 'NFTs grouped by collection via LUKSO BlockScout — query by address hash. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get NFT collections',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0xC15509fDB3616FdE248d56122138f2F7C122a123'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { amount: { type: 'string' }, token: { type: 'object' }, token_instances: { type: 'array', items: { type: 'string' } } } } },
                        next_page_params: { type: 'string', nullable: true }
                    }
                }
            },
        },
        getNFTInstancesByContract: {
            method: 'GET',
            path: '/tokens/:address_hash/instances',
            description: 'List all NFT instances in contract via LUKSO BlockScout — query by address hash.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get NFT instances',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x4c1dFFd1F59A01Ff7FBe5dabFA4484F3CD50E9CD'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { animation_url: { type: 'string', nullable: true }, external_app_url: { type: 'string' }, id: { type: 'string' }, image_url: { type: 'string' }, is_unique: { type: 'boolean' }, media_type: { type: 'string', nullable: true }, media_url: { type: 'string' }, metadata: { type: 'object' }, owner: { type: 'object' }, thumbnails: { type: 'string', nullable: true }, token: { type: 'object' } } } },
                        next_page_params: { type: 'object', properties: { unique_token: { type: 'number' } } }
                    }
                }
            },
        },
        getNFTInstanceById: {
            method: 'GET',
            path: '/tokens/:address_hash/instances/:id',
            description: 'Get one NFT by ID via LUKSO BlockScout — query by address hash and id. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get NFT instance by ID',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x4c1dFFd1F59A01Ff7FBe5dabFA4484F3CD50E9CD',
                    id: 32
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        animation_url: { type: 'string', nullable: true },
                        external_app_url: { type: 'string' },
                        id: { type: 'string' },
                        image_url: { type: 'string' },
                        is_unique: { type: 'boolean' },
                        media_type: { type: 'string', nullable: true },
                        media_url: { type: 'string' },
                        metadata: { type: 'object', properties: { LSP4Metadata: { type: 'object', properties: { assets: { type: 'array', items: { type: 'string' } }, attributes: { type: 'array', items: { type: 'object' } }, description: { type: 'string', nullable: true }, icon: { type: 'array', items: { type: 'object' } }, images: { type: 'array', items: { type: 'array', items: { type: 'object' } } }, links: { type: 'array', items: { type: 'object' } }, name: { type: 'string' } } }, attributes: { type: 'array', items: { type: 'object' } }, description: { type: 'string', nullable: true }, external_url: { type: 'string' }, image: { type: 'string' }, name: { type: 'string' } } },
                        owner: { type: 'object', properties: { ens_domain_name: { type: 'string', nullable: true }, hash: { type: 'string' }, implementations: { type: 'array', items: { type: 'object' } }, is_contract: { type: 'boolean' }, is_scam: { type: 'boolean' }, is_verified: { type: 'boolean' }, metadata: { type: 'string', nullable: true }, name: { type: 'string', nullable: true }, private_tags: { type: 'array', items: { type: 'string' } }, proxy_type: { type: 'string' }, public_tags: { type: 'array', items: { type: 'string' } }, reputation: { type: 'string' }, watchlist_names: { type: 'array', items: { type: 'string' } } } },
                        thumbnails: { type: 'string', nullable: true },
                        token: { type: 'object', properties: { address_hash: { type: 'string' }, circulating_market_cap: { type: 'number', nullable: true }, decimals: { type: 'number', nullable: true }, exchange_rate: { type: 'number', nullable: true }, holders_count: { type: 'string' }, icon_url: { type: 'string', nullable: true }, name: { type: 'string' }, reputation: { type: 'string' }, symbol: { type: 'string' }, total_supply: { type: 'string' }, type: { type: 'string' }, volume_24h: { type: 'number', nullable: true } } }
                    }
                }
            },
        },
        getNFTInstanceTransfers: {
            method: 'GET',
            path: '/tokens/:address_hash/instances/:id/transfers',
            description: 'Transfers of a specific NFT via LUKSO BlockScout — query by address hash and id.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get NFT transfers',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x4c1dFFd1F59A01Ff7FBe5dabFA4484F3CD50E9CD',
                    id: 32
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { block_hash: { type: 'string' }, block_number: { type: 'number' }, from: { type: 'object' }, log_index: { type: 'number' }, method: { type: 'string' }, timestamp: { type: 'string' }, to: { type: 'object' }, token: { type: 'object' }, token_type: { type: 'string' }, total: { type: 'number', nullable: true }, transaction_hash: { type: 'string' }, type: { type: 'string' } } } },
                        next_page_params: { type: 'string', nullable: true }
                    }
                }
            },
        },
        getNFTInstanceHolders: {
            method: 'GET',
            path: '/tokens/:address_hash/instances/:id/holders',
            description: 'Get holders of an NFT instance via LUKSO BlockScout — query by address hash and id.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get NFT holders',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x4c1dFFd1F59A01Ff7FBe5dabFA4484F3CD50E9CD',
                    id: 32
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { address: { type: 'object' }, token_id: { type: 'string' }, value: { type: 'string' } } } },
                        next_page_params: { type: 'string', nullable: true }
                    }
                }
            },
        },
        getNFTInstanceTransfersCount: {
            method: 'GET',
            path: '/tokens/:address_hash/instances/:id/transfers-count',
            description: 'Count transfers of an NFT instance via LUKSO BlockScout — query by address hash and id.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(LUKSO_MAINNET,LUKSO_TESTNET)', options: [] } },
                { position: { key: 'address_hash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                {
                    _description: 'Get NFT transfer count',
                    chainName: 'LUKSO_MAINNET',
                    address_hash: '0x4c1dFFd1F59A01Ff7FBe5dabFA4484F3CD50E9CD',
                    id: 32
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        transfers_count: { type: 'number' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getNFTsByAddress: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            return { response }
        }
    },
    getNFTCollectionsByAddress: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            return { response }
        }
    },
    getNFTInstancesByContract: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            return { response }
        }
    },
    getNFTInstanceById: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            return { response }
        }
    },
    getNFTInstanceTransfers: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            return { response }
        }
    },
    getNFTInstanceHolders: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            return { response }
        }
    },
    getNFTInstanceTransfersCount: {
        preRequest: async ( { struct, payload } ) => {
            const alias = { LUKSO_MAINNET: "mainnet", LUKSO_TESTNET: "testnet" }
            struct.url = struct.url.replace("--chain--", alias[payload.chainName])
            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            return { response }
        }
    }
} )
