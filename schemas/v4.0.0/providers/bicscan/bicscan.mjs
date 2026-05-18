// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'bicscan',
    name: 'BICScan API',
    description: 'Assess blockchain address risk scores and scan held assets via BICScan — get compliance risk ratings and token portfolio details for any wallet address.',
    version: '4.0.0',
    docs: ['https://api.bicscan.io/docs'],
    tags: ['security', 'risk', 'scanning', 'cacheTtlDaily'],
    root: 'https://api.bicscan.io/v1/scan',
    requiredServerParams: ['BICSCAN_API_KEY'],
    headers: {
        'X-Api-Key': '{{BICSCAN_API_KEY}}'
    },
    tools: {
        getRiskScore: {
            method: 'POST',
            path: '/',
            description: 'Retrieves a risk score from 0 (safe) to 100 (high risk) for a given crypto address or domain.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['min(3)'] } }
            ],
            tests: [
                { _description: 'Test risk score lookup for ENS name', query: 'vitalik.eth' },
                { _description: 'Test risk score lookup for crypto address', query: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        query: { type: 'string' },
                        status: { type: 'string' },
                        type: { type: 'string' },
                        premium: { type: 'boolean' },
                        timestamp: { type: 'string' },
                        networks: { type: 'array', items: { type: 'string' } },
                        summary: { type: 'object', properties: { bicscan_score: { type: 'string', nullable: true }, detected_engines: { type: 'string', nullable: true }, total_engines: { type: 'number', nullable: true } } },
                        category: { type: 'array', items: { type: 'string' } },
                        assets: { type: 'array', items: { type: 'string' } },
                        transactions: { type: 'string', nullable: true },
                        nfts: { type: 'string', nullable: true },
                        scan_metadata: { type: 'object', properties: { plan: { type: 'string' }, web3_dns: { type: 'array', items: { type: 'string' } }, domain_info: { type: 'string', nullable: true }, token_info: { type: 'string', nullable: true }, query_options: { type: 'object', properties: { sync: { type: 'boolean' }, assets: { type: 'boolean' }, engines: { type: 'array', items: { type: 'string' } } } }, engines: { type: 'array', items: { type: 'string' } } } },
                        results: { type: 'array', items: { type: 'string' } }
                    }
                }
            },
        },
        getAssets: {
            method: 'POST',
            path: '/',
            description: 'Fetches the asset holdings of a given crypto address using OFAC engine. Required: query, engines.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['min(3)'] } },
                { position: { key: 'engines', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'array()', options: ['default(["ofac"])'] } }
            ],
            tests: [
                {
                    _description: 'Test asset scan for wallet address',
                    query: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                    engines: ['ofac']
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        query: { type: 'string' },
                        status: { type: 'string' },
                        type: { type: 'string' },
                        premium: { type: 'boolean' },
                        timestamp: { type: 'string' },
                        networks: { type: 'array', items: { type: 'string' } },
                        summary: { type: 'object', properties: { bicscan_score: { type: 'string', nullable: true }, detected_engines: { type: 'number' }, total_engines: { type: 'number' } } },
                        category: { type: 'array', items: { type: 'string' } },
                        assets: { type: 'array', items: { type: 'object', properties: { network: { type: 'string' }, status: { type: 'string' }, results: { type: 'array', items: { type: 'object' } } } } },
                        transactions: { type: 'string', nullable: true },
                        nfts: { type: 'string', nullable: true },
                        scan_metadata: { type: 'object', properties: { plan: { type: 'string' }, web3_dns: { type: 'array', items: { type: 'string' } }, domain_info: { type: 'string', nullable: true }, token_info: { type: 'string', nullable: true }, query_options: { type: 'object', properties: { sync: { type: 'boolean' }, assets: { type: 'boolean' }, engines: { type: 'array', items: { type: 'string' } } } }, engines: { type: 'array', items: { type: 'string' } } } },
                        results: { type: 'array', items: { type: 'object', properties: { vendor: { type: 'string' }, detected: { type: 'boolean' }, status: { type: 'string' }, score: { type: 'string', nullable: true }, source: { type: 'string' }, category: { type: 'string', nullable: true }, networks: { type: 'string', nullable: true }, rawdata: { type: 'string', nullable: true }, premium: { type: 'boolean' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getRiskScore: {
        preRequest: async ( { struct, payload } ) => {
            const { query } = payload;
            struct.body = { query, sync: true, assets: false };
            return { struct }
        }
    },
    getAssets: {
        preRequest: async ( { struct, payload } ) => {
            const { query, engines } = payload;
            struct.body = { query, sync: true, assets: true, engines };
            return { struct }
        }
    }
} )
