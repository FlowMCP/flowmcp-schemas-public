// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Module-level code: 3 lines

export const main = {
    namespace: 'defillama',
    name: 'DeFi Llama Token Prices',
    description: 'Fetch current token prices across multiple chains via DeFi Llama — batch query ERC20 and native token prices by contract address with USD values.',
    version: '4.0.0',
    docs: ['https://docs.llama.fi'],
    tags: ['defi', 'prices', 'tokens', 'cacheTtlFrequent'],
    root: 'https://coins.llama.fi',
    tools: {
        getTokenPrices: {
            method: 'GET',
            path: '/prices/current/_tokenName_',
            description: 'Get current price information for a specific token via defillama. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'source', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(coingecko)', options: [] }, description: 'Price data source — currently only coingecko is supported' },
                { position: { key: 'token', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Token identifier matching the source, e.g. ethereum, bitcoin, solana for coingecko IDs' }
            ],
            tests: [
                { _description: 'Test price for Ethereum via CoinGecko ID', source: 'coingecko', token: 'ethereum' },
                { _description: 'Get Bitcoin price via CoinGecko', source: 'coingecko', token: 'bitcoin' },
                { _description: 'Get Solana price via CoinGecko', source: 'coingecko', token: 'solana' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        coins: { type: 'object', description: 'Map of token identifiers to price data objects containing price, symbol, timestamp, and confidence' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {

    const sources = [
        "coingecko", /*"cmc", "defillama"*/
    ]

    return {
        getTokenPrices: {
            preRequest: async ( { struct, payload } ) => {
                const { source, token } = payload
                const tokenName = `${source}:${token}`
                struct['url'] = struct['url']
                .replace( '_tokenName_', tokenName )
                return { struct }
            }
        }
    }
}
