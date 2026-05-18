// Migrated from v1.2.0 -> v2.0.0
// Category: simple
// Import: import { EVM_CHAINS } from '../_shared/evmChains.mjs'
// Module-level code: 13 lines

export const main = {
    namespace: 'simdune',
    name: 'Sim by Dune - Token Holders',
    description: 'Discover token distribution across ERC20 or ERC721 holders, ranked by wallet value.',
    version: '4.0.0',
    docs: ['https://docs.sim.dune.com/evm/token-holders'],
    tags: ['production', 'token', 'analytics', 'holders', 'cacheTtlDaily'],
    root: 'https://api.sim.dune.com/v1',
    requiredServerParams: ['DUNE_SIM_API_KEY'],
    headers: {
        'X-Sim-Api-Key': '{{DUNE_SIM_API_KEY}}'
    },
    tools: {
        getTokenHoldersEVM: {
            method: 'GET',
            path: '/evm/token-holders/:chain_id/:token_address',
            description: 'Get token holders for ERC20 or ERC721 tokens, ranked by wallet value with balance details.',
            parameters: [
                { position: { key: 'chain_id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(1,137,42161,10,8453,56,43114,59144,5000,42220,100,250,42170,81457,80094,33139,2741,1135,34443,1088,288,185,666666666,888888888,8217,204,60808,14,7560,70700,999,57073,166,21000000,5112,2911,84532,43113)', options: [] } },
                { position: { key: 'token_address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{40}$)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(500)'] } }
            ],
            tests: [
                {
                    _description: 'Get USDC holders on Base',
                    chain_id: '8453',
                    token_address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
                    limit: '10'
                },
                {
                    _description: 'Get USDC holders on Ethereum mainnet',
                    chain_id: '1',
                    token_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                    limit: '5'
                }
            ,
                { _description: 'Get WETH holders on Ethereum', chain_id: '1', token_address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', limit: '10' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        token_address: { type: 'string' },
                        chain_id: { type: 'number' },
                        holders: { type: 'array', items: { type: 'object', properties: { wallet_address: { type: 'string' }, balance: { type: 'string' }, first_acquired: { type: 'string' }, has_initiated_transfer: { type: 'boolean' } } } },
                        next_offset: { type: 'string' }
                    }
                }
            },
        }
    }
}
