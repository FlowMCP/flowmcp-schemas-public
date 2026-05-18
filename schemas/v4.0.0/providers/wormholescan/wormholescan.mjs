// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'wormholescan',
    name: 'Wormhole Metrics API',
    description: 'Query cross-chain bridge metrics from Wormholescan — activity stats, money flow, top assets by volume, top chain pairs, top corridors, and KPI summaries.',
    version: '4.0.0',
    docs: ['https://wormholescan.io', 'https://docs.wormholescan.io'],
    tags: ['data', 'api', 'cacheTtlFrequent'],
    root: 'https://api.wormholescan.io',
    tools: {
        getCrossChainActivity: {
            method: 'GET',
            path: '/api/v1/x-chain-activity',
            description: 'Returns cross-chain volume between source and destination chains. Required: timeSpan, by. Optional filters: apps.. Use getKpiList first to find valid IDs',
            parameters: [
                { position: { key: 'timeSpan', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(7d,30d,90d,1y,all-time)', options: ['default(7d)'] } },
                { position: { key: 'by', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(notional,motional)', options: ['default(notional)'] } },
                { position: { key: 'apps', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Default query with 7d and notional', timeSpan: '7d', by: 'notional' },
                { _description: 'Query with notional', timeSpan: '7d', by: 'notional' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        txs: { type: 'array', items: { type: 'object', properties: { chain: { type: 'number' }, volume: { type: 'string' }, percentage: { type: 'number' }, destinations: { type: 'array', items: { type: 'object' } } } } }
                    }
                }
            },
        },
        getMoneyFlow: {
            method: 'GET',
            path: '/api/v1/x-chain-activity/tops',
            description: 'Returns top money flow data by chain and volume via Wormholescan. Supports from, to, appId filters.. Use getKpiList first to find valid IDs',
            parameters: [
                { position: { key: 'timespan', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(1h,1d,1mo,1y)', options: ['default(1d)'] } },
                { position: { key: 'from', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'to', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'appId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'sourceChain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'targetChain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Money flow last day', timespan: '1d', from: '2026-02-16T00:00:00Z', to: '2026-02-17T00:00:00Z' },
                { _description: 'Money flow last month', timespan: '1mo', from: '2026-01-17T00:00:00Z', to: '2026-02-17T00:00:00Z', sourceChain: '2', targetChain: '5' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            from: { type: 'string' },
                            to: { type: 'string' },
                            emitter_chain: { type: 'string' },
                            volume: { type: 'number' },
                            count: { type: 'number' }
                        }
                    }
                }
            },
        },
        getTopAssetsByVolume: {
            method: 'GET',
            path: '/api/v1/top-assets-by-volume',
            description: 'Returns top assets by transfer volume via Wormholescan. Returns structured JSON response data.. Use getKpiList first to find valid IDs',
            parameters: [
                { position: { key: 'timeSpan', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(7d,15d,30d)', options: ['default(7d)'] } }
            ],
            tests: [
                { _description: 'Top assets by volume for 7d', timeSpan: '7d' },
                { _description: 'Top assets by volume for 30d', timeSpan: '30d' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        assets: { type: 'array', items: { type: 'object', properties: { emitterChain: { type: 'number' }, symbol: { type: 'string' }, tokenChain: { type: 'number' }, tokenAddress: { type: 'string' }, volume: { type: 'string' } } } }
                    }
                }
            },
        },
        getTopChainPairsByNumTransfers: {
            method: 'GET',
            path: '/api/v1/top-chain-pairs-by-num-transfers',
            description: 'Returns top chain pairs by number of transfers via Wormholescan. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'timeSpan', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(7d,15d,30d)', options: ['default(7d)'] } }
            ],
            tests: [
                { _description: 'Top chain pairs for 7d', timeSpan: '7d' },
                { _description: 'Top chain pairs for 15d', timeSpan: '15d' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        chainPairs: { type: 'array', items: { type: 'object', properties: { emitterChain: { type: 'number' }, destinationChain: { type: 'number' }, numberOfTransfers: { type: 'string' } } } }
                    }
                }
            },
        },
        getTopSymbolsByVolume: {
            method: 'GET',
            path: '/api/v1/top-symbols-by-volume',
            description: 'Returns top transferred token symbols by volume via Wormholescan. Returns structured JSON response data.. Use getKpiList first to find valid IDs',
            parameters: [
                { position: { key: 'timeSpan', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(7d,15d,30d)', options: ['default(7d)'] } }
            ],
            tests: [
                { _description: 'Top symbols for 7d', timeSpan: '7d' },
                { _description: 'Top symbols for 30d', timeSpan: '30d' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        symbols: { type: 'array', items: { type: 'object', properties: { symbol: { type: 'string' }, volume: { type: 'string' }, txs: { type: 'string' }, tokens: { type: 'array', items: { type: 'object' } } } } }
                    }
                }
            },
        },
        getTopCorridors: {
            method: 'GET',
            path: '/api/v1/top-100-corridors',
            description: 'Returns top 100 token corridors by number of transfers via Wormholescan. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'timeSpan', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(2d,7d)', options: ['default(2d)'] } }
            ],
            tests: [
                { _description: 'Top corridors for 2d', timeSpan: '2d' },
                { _description: 'Top corridors for 7d', timeSpan: '7d' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        corridors: { type: 'array', items: { type: 'object', properties: { emitter_chain: { type: 'number' }, target_chain: { type: 'number' }, token_chain: { type: 'number' }, token_address: { type: 'string' }, txs: { type: 'number' } } } }
                    }
                }
            },
        },
        getKpiList: {
            method: 'GET',
            path: '/api/v1/scorecards',
            description: 'Returns Wormhole KPIs including volume, message count, and TVL. via Wormholescan.',
            parameters: [],
            tests: [
                { _description: 'Get general KPI stats' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        '24h_messages': { type: 'string' },
                        '7d_messages': { type: 'string' },
                        '30d_messages': { type: 'string' },
                        '90d_messages': { type: 'string' },
                        '1y_messages': { type: 'string' },
                        total_messages: { type: 'string' },
                        total_tx_count: { type: 'string' },
                        total_volume: { type: 'string' },
                        tvl: { type: 'string' },
                        '24h_volume': { type: 'string' },
                        '7d_volume': { type: 'string' },
                        '30d_volume': { type: 'string' },
                        '90d_volume': { type: 'string' },
                        '1y_volume': { type: 'string' }
                    }
                }
            },
        }
    }
}
