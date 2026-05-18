// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'dexscreener',
    name: 'dexscreener-boosted',
    description: 'Discover trending boosted tokens on DexScreener — latest and most actively boosted token listings across all DEX chains.',
    version: '4.0.0',
    docs: ['https://docs.dexscreener.com/api/reference'],
    tags: ['defi', 'trading', 'boosted', 'cacheTtlFrequent'],
    root: 'https://api.dexscreener.com',
    tools: {
        getLatestBoostedTokens: {
            method: 'GET',
            path: '/token-boosts/latest/v1',
            description: 'Get the latest boosted tokens via DexScreener. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Fetch latest boosted tokens' },
                { _description: 'Get recently boosted token listings' },
                { _description: 'List newest token boosts across all chains' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            url: { type: 'string', description: 'DexScreener URL for the token page' },
                            chainId: { type: 'string', description: 'Blockchain chain identifier' },
                            tokenAddress: { type: 'string', description: 'Token contract address' },
                            description: { type: 'string', description: 'Token description text' },
                            icon: { type: 'string', description: 'Token icon image URL' },
                            header: { type: 'string', description: 'Token header image URL' },
                            openGraph: { type: 'string', description: 'Open Graph image URL for social sharing' },
                            links: { type: 'array', description: 'External links associated with the token', items: { type: 'object' } },
                            totalAmount: { type: 'number', description: 'Total boost amount received' },
                            amount: { type: 'number', description: 'Current boost amount' }
                        }
                    }
                }
            },
        },
        getMostActiveBoostedTokens: {
            method: 'GET',
            path: '/token-boosts/top/v1',
            description: 'Get tokens with most active boosts via DexScreener. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Fetch most active boosted tokens' },
                { _description: 'Get top boosted tokens by amount' },
                { _description: 'List tokens with highest boost activity' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            url: { type: 'string', description: 'DexScreener URL for the token page' },
                            chainId: { type: 'string', description: 'Blockchain chain identifier' },
                            tokenAddress: { type: 'string', description: 'Token contract address' },
                            description: { type: 'string', description: 'Token description text' },
                            icon: { type: 'string', description: 'Token icon image URL' },
                            header: { type: 'string', description: 'Token header image URL' },
                            openGraph: { type: 'string', description: 'Open Graph image URL for social sharing' },
                            links: { type: 'array', description: 'External links associated with the token', items: { type: 'object' } },
                            totalAmount: { type: 'number', description: 'Total boost amount received' }
                        }
                    }
                }
            },
        }
    }
}
