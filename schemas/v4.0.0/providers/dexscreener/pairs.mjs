// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'dexscreener',
    name: 'Dexscreener Pairs',
    description: 'Retrieve DEX trading pair data from DexScreener — pair details by chain and address, plus token buy/sell order checks across supported chains.',
    version: '4.0.0',
    docs: ['https://docs.dexscreener.com/api/reference'],
    tags: ['defi', 'trading', 'pairs', 'cacheTtlFrequent'],
    root: 'https://api.dexscreener.com',
    tools: {
        getPairByChainAndAddress: {
            method: 'GET',
            path: '/latest/dex/pairs/:chainId/:pairAddress',
            description: 'Get pair by chain and pair address via DexScreener — query by chainId and pairAddress.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Blockchain chain identifier, e.g. ethereum, bsc, solana' },
                { position: { key: 'pairAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'DEX pair contract address' }
            ],
            tests: [
                { _description: 'Get pair data on BSC', chainId: 'bsc', pairAddress: '0x0FCeAc6f12dF0c11f4534534fc4ae68751B5862D' },
                { _description: 'Get pair on Ethereum', chainId: 'ethereum', pairAddress: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640' },
                { _description: 'Get pair on Polygon', chainId: 'polygon', pairAddress: '0x45dDa9cb7c25131DF268515131f647d726f50608' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        schemaVersion: { type: 'string', description: 'API schema version identifier' },
                        pairs: { type: 'string', nullable: true, description: 'Array of matching pair objects or null' },
                        pair: { type: 'string', nullable: true, description: 'Single pair object or null' }
                    }
                }
            },
        },
        checkTokenOrders: {
            method: 'GET',
            path: '/orders/v1/:chainId/:tokenAddress',
            description: 'Check token orders by chain and token address via DexScreener — query by chainId and tokenAddress.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Blockchain chain identifier, e.g. ethereum, bsc, solana' },
                { position: { key: 'tokenAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Token contract address to check orders for' }
            ],
            tests: [
                { _description: 'Check token orders on Solana', chainId: 'solana', tokenAddress: '5i3WMss2Ldnkw3CnrBoGrkPiVwpAKuGoHULPdbaxpump' },
                { _description: 'Check PEPE token orders on Ethereum', chainId: 'ethereum', tokenAddress: '0x6982508145454Ce325dDbE47a25d4ec3d2311933' },
                { _description: 'Check token orders on BSC', chainId: 'bsc', tokenAddress: '0xD279E8f1fE8F893e4b1CB18fAAeb4fc2a0d14444' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        orders: { type: 'array', description: 'Array of token order objects', items: { type: 'object', properties: { chainId: { type: 'string', description: 'Blockchain chain identifier' }, tokenAddress: { type: 'string', description: 'Token contract address' }, type: { type: 'string', description: 'Order type' }, status: { type: 'string', description: 'Order status' }, paymentTimestamp: { type: 'number', description: 'Unix timestamp of payment' } } } },
                        boosts: { type: 'array', description: 'Array of token boost objects', items: { type: 'object', properties: { chainId: { type: 'string', description: 'Blockchain chain identifier' }, tokenAddress: { type: 'string', description: 'Token contract address' }, id: { type: 'string', description: 'Boost identifier' }, amount: { type: 'number', description: 'Boost amount' }, paymentTimestamp: { type: 'number', description: 'Unix timestamp of payment' } } } }
                    }
                }
            },
        }
    }
}
