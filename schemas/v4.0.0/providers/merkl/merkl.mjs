// Migrated from v1.2.0 -> v3.0.0

export const main = {
    namespace: 'merkl',
    name: 'Merkl Rewards API',
    description: 'DeFi rewards distribution and opportunity discovery across 50+ chains. Query active reward campaigns with APR/TVL, user rewards, supported chains, and token metadata. Used by Uniswap, Aave, Velodrome and others.',
    version: '4.0.0',
    docs: ['https://docs.merkl.xyz'],
    tags: ['defi', 'rewards', 'yield', 'multichain'],
    root: 'https://api.merkl.xyz/v4',
    requiredServerParams: [],
    headers: {},
    tools: {
        getOpportunities: {
            method: 'GET',
            path: '/opportunities',
            description: 'Search active reward campaigns (opportunities) with APR, TVL, daily rewards, and token details. Filter by chain, action type, status, or protocol. Use getChains to find valid chain IDs.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'action', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(POOL,HOLD,LEND,BORROW)', options: ['optional()'] } },
                { position: { key: 'status', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(LIVE,SOON,PAST)', options: ['optional()'] } },
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'items', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(50)'] } }
            ],
            tests: [
                { _description: 'Get live lending opportunities on Ethereum', chainId: 1, status: 'LIVE', action: 'LEND', items: 3 },
                { _description: 'Get live pool opportunities on Arbitrum', chainId: 42161, status: 'LIVE', action: 'POOL', items: 3 },
                { _description: 'Search for Aave opportunities', name: 'Aave', status: 'LIVE', items: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'List of DeFi reward opportunities matching the filter criteria',
                    items: {
                        type: 'object',
                        description: 'A single reward campaign opportunity',
                        properties: {
                            id: { type: 'string', description: 'Unique opportunity identifier' },
                            name: { type: 'string', description: 'Opportunity display name (e.g., Aave USDC Lending)' },
                            status: { type: 'string', description: 'Campaign status: LIVE, SOON, or PAST' },
                            action: { type: 'string', description: 'Required action type: POOL, HOLD, LEND, or BORROW' },
                            chainId: { type: 'number', description: 'Blockchain chain ID where the opportunity exists' },
                            apr: { type: 'number', description: 'Annual percentage rate for the opportunity' },
                            tvl: { type: 'number', description: 'Total value locked in USD' },
                            dailyRewards: { type: 'number', description: 'Daily reward distribution amount in USD' }
                        }
                    }
                }
            }
        },
        getUserRewards: {
            method: 'GET',
            path: '/users/:address/rewards',
            description: 'Get all reward data for a wallet address on a specific chain, including earned amounts, pending rewards, claimed totals, and merkle proofs for claiming. Use getOpportunities to find reward campaigns first.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(/^0x[0-9a-f]{40}$/)'] } },
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get rewards for a wallet on Ethereum', address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045', chainId: 1 },
                { _description: 'Get rewards for a wallet on Arbitrum', address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045', chainId: 42161 },
                { _description: 'Get all rewards across chains for a wallet', address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Reward data for the queried wallet including earned, pending, and claimable amounts per token',
                    properties: {
                        tokenAddress: { type: 'string', description: 'Reward token contract address' },
                        symbol: { type: 'string', description: 'Reward token symbol (e.g., MERKL, ARB)' },
                        accumulated: { type: 'string', description: 'Total accumulated rewards in token smallest unit' },
                        unclaimed: { type: 'string', description: 'Unclaimed rewards available for claiming' },
                        proof: { type: 'array', description: 'Merkle proof array for on-chain reward claiming' }
                    }
                }
            }
        },
        getChains: {
            method: 'GET',
            path: '/chains',
            description: 'Get all blockchain networks supported by Merkl with chain IDs, names, icons, and active campaign counts. Use returned chain IDs to filter getOpportunities and getUserRewards.',
            parameters: [],
            tests: [
                { _description: 'Get all supported chains with metadata' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'List of all blockchain networks supported by the Merkl protocol',
                    items: {
                        type: 'object',
                        description: 'A supported blockchain network',
                        properties: {
                            id: { type: 'number', description: 'Chain ID (e.g., 1 for Ethereum, 42161 for Arbitrum)' },
                            name: { type: 'string', description: 'Chain display name (e.g., Ethereum, Arbitrum One)' },
                            icon: { type: 'string', description: 'URL to chain icon image' }
                        }
                    }
                }
            }
        }
    }
}
