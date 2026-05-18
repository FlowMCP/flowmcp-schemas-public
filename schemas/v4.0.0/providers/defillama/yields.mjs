// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'defillama',
    name: 'DeFi Llama Liquidity Pools',
    description: 'Access DeFi Llama liquidity pool analytics — query current pool yields (APY, TVL, rewards) and historical TVL chart data for individual pools.',
    version: '4.0.0',
    docs: ['https://docs.llama.fi'],
    tags: ['defi', 'yields', 'farming', 'cacheTtlFrequent'],
    root: 'https://yields.llama.fi',
    tools: {
        getPools: {
            method: 'GET',
            path: '/pools',
            description: 'Retrieve a list of all liquidity pools from DeFi Llama (first 30) via defillama.',
            parameters: [],
            tests: [
                { _description: 'Test fetching pools' },
                { _description: 'List all DeFi yield farming pools' },
                { _description: 'Get liquidity pool APY rankings' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status indicator' },
                        data: { type: 'array', description: 'Array of liquidity pool objects with yield and TVL data', items: { type: 'object', properties: { chain: { type: 'string', description: 'Blockchain network name' }, project: { type: 'string', description: 'DeFi project or protocol name' }, symbol: { type: 'string', description: 'Token pair symbol' }, tvlUsd: { type: 'number', description: 'Total value locked in USD' }, apyBase: { type: 'number', description: 'Base APY from trading fees' }, apyReward: { type: 'string', nullable: true, description: 'Reward APY from token incentives' }, apy: { type: 'number', description: 'Total combined APY (base + reward)' }, rewardTokens: { type: 'string', nullable: true, description: 'Addresses of reward tokens' }, pool: { type: 'string', description: 'Unique pool identifier (UUID)' }, apyPct1D: { type: 'number', description: 'APY percentage change over 1 day' }, apyPct7D: { type: 'number', description: 'APY percentage change over 7 days' }, apyPct30D: { type: 'number', description: 'APY percentage change over 30 days' }, stablecoin: { type: 'boolean', description: 'Whether the pool contains stablecoins' }, ilRisk: { type: 'string', description: 'Impermanent loss risk level' }, exposure: { type: 'string', description: 'Exposure type (single or multi asset)' }, predictions: { type: 'object', description: 'ML-based yield predictions' }, poolMeta: { type: 'string', nullable: true, description: 'Additional pool metadata' }, mu: { type: 'number', description: 'Statistical mean of returns' }, sigma: { type: 'number', description: 'Statistical standard deviation of returns' }, count: { type: 'number', description: 'Number of data points used in calculations' }, outlier: { type: 'boolean', description: 'Whether the pool yield is flagged as an outlier' }, underlyingTokens: { type: 'array', items: { type: 'string' }, description: 'Contract addresses of underlying tokens' }, il7d: { type: 'string', nullable: true, description: 'Impermanent loss over 7 days' }, apyBase7d: { type: 'string', nullable: true, description: 'Base APY averaged over 7 days' }, apyMean30d: { type: 'number', description: 'Mean APY over 30 days' }, volumeUsd1d: { type: 'number', nullable: true, description: 'Trading volume in USD over 1 day' }, volumeUsd7d: { type: 'number', nullable: true, description: 'Trading volume in USD over 7 days' }, apyBaseInception: { type: 'string', nullable: true, description: 'Base APY since pool inception' } } } }
                    }
                }
            },
        },
        getPoolTvl: {
            method: 'GET',
            path: '/chart/:pool',
            description: 'Get detailed information about a specific liquidity pool by its ID. Required: pool.',
            parameters: [
                { position: { key: 'pool', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Pool UUID from DeFi Llama, e.g. 747c1d2a-c668-4682-b9f9-296708a3dd90' }
            ],
            tests: [
                { _description: 'Test pool chart data', pool: '747c1d2a-c668-4682-b9f9-296708a3dd90' },
                { _description: 'Get TVL history for Aave USDC pool', pool: 'aa70b331-40c8-45ba-a11e-efcdf3e64162' },
                { _description: 'Get TVL chart for Lido stETH pool', pool: '4d556b96-5c1c-4837-a80a-1e3d5d0c89e5' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status indicator' },
                        data: { type: 'array', description: 'Array of historical TVL and APY data points for the pool', items: { type: 'object', properties: { timestamp: { type: 'string', description: 'ISO timestamp of the data point' }, tvlUsd: { type: 'number', description: 'Total value locked in USD at this timestamp' }, apy: { type: 'number', description: 'Total APY at this timestamp' }, apyBase: { type: 'number', description: 'Base APY from trading fees' }, apyReward: { type: 'string', nullable: true, description: 'Reward APY from token incentives' }, il7d: { type: 'string', nullable: true, description: 'Impermanent loss over trailing 7 days' }, apyBase7d: { type: 'string', nullable: true, description: 'Base APY averaged over trailing 7 days' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getPoolTvl: {
        postRequest: async ( { response, struct, payload } ) => {
            if( response['status'] === 'success' ) {
            response = response['data']
            } else {
            throw new Error( `Fetch Error` )
            }

            return { response }
        }
    }
} )
