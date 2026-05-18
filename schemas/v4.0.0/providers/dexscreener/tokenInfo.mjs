// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'dexscreener',
    name: 'dexscreener-tokeninfo',
    description: 'Search tokens and retrieve profile data from DexScreener — latest token profiles, pair search, token-to-pair lookups, and pool listings across all DEX chains.',
    version: '4.0.0',
    docs: ['https://docs.dexscreener.com/api/reference'],
    tags: ['defi', 'tokens', 'discovery', 'cacheTtlFrequent'],
    root: 'https://api.dexscreener.com',
    tools: {
        getLatestTokenProfiles: {
            method: 'GET',
            path: '/token-profiles/latest/v1',
            description: 'Get the latest token profiles via DexScreener. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Fetch latest token profiles' },
                { _description: 'Get newest token profile listings' },
                { _description: 'List recently updated token profiles' }
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
                            icon: { type: 'string', description: 'Token icon image URL' },
                            header: { type: 'string', description: 'Token header image URL' },
                            openGraph: { type: 'string', description: 'Open Graph image URL for social sharing' },
                            description: { type: 'string', description: 'Token description text' },
                            cto: { type: 'boolean', description: 'Whether the token is community takeover' }
                        }
                    }
                }
            },
        },
        searchPairs: {
            method: 'GET',
            path: '/latest/dex/search',
            description: 'Search pairs by query string via DexScreener. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Search query string for pair name, token symbol, or address' }
            ],
            tests: [
                { _description: 'Search pairs for SOL/USDC', q: 'SOL/USDC' },
                { _description: 'Search pairs for PEPE token', q: 'PEPE' },
                { _description: 'Search pairs for ETH/USDT', q: 'ETH/USDT' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        schemaVersion: { type: 'string', description: 'API schema version identifier' },
                        pairs: { type: 'array', description: 'Array of matching pair objects', items: { type: 'object', properties: { chainId: { type: 'string', description: 'Blockchain chain identifier' }, dexId: { type: 'string', description: 'DEX protocol identifier' }, url: { type: 'string', description: 'DexScreener URL for this pair' }, pairAddress: { type: 'string', description: 'Pair contract address' }, labels: { type: 'array', description: 'Classification labels', items: { type: 'string' } }, baseToken: { type: 'object', description: 'Base token details' }, quoteToken: { type: 'object', description: 'Quote token details' }, priceNative: { type: 'string', description: 'Price in native token terms' }, priceUsd: { type: 'string', description: 'Price in USD' }, txns: { type: 'object', description: 'Transaction counts by time period' }, volume: { type: 'object', description: 'Trading volume by time period' }, priceChange: { type: 'object', description: 'Price change percentages by time period' }, liquidity: { type: 'object', description: 'Pool liquidity in USD, base, and quote' }, fdv: { type: 'number', description: 'Fully diluted valuation in USD' }, marketCap: { type: 'number', description: 'Market capitalization in USD' }, pairCreatedAt: { type: 'number', description: 'Unix timestamp when pair was created' }, info: { type: 'object', description: 'Additional token info including images and socials' } } } }
                    }
                }
            },
        },
        getPairsByToken: {
            method: 'GET',
            path: '/tokens/v1/:chainId/:tokenAddress',
            description: 'Get pairs by token address via DexScreener — query by chainId and tokenAddress. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Blockchain chain identifier, e.g. ethereum, bsc, solana' },
                { position: { key: 'tokenAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Token contract address to find pairs for' }
            ],
            tests: [
                { _description: 'Get PEPE token pairs on Ethereum', chainId: 'ethereum', tokenAddress: '0x6982508145454Ce325dDbE47a25d4ec3d2311933' },
                { _description: 'Get WETH pairs on Ethereum', chainId: 'ethereum', tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
                { _description: 'Get USDC pairs on Ethereum', chainId: 'ethereum', tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            chainId: { type: 'string', description: 'Blockchain chain identifier' },
                            dexId: { type: 'string', description: 'DEX protocol identifier' },
                            url: { type: 'string', description: 'DexScreener URL for this pair' },
                            pairAddress: { type: 'string', description: 'Pair contract address' },
                            labels: { type: 'array', description: 'Classification labels', items: { type: 'string' } },
                            baseToken: { type: 'object', description: 'Base token details', properties: { address: { type: 'string', description: 'Token contract address' }, name: { type: 'string', description: 'Token name' }, symbol: { type: 'string', description: 'Token ticker symbol' } } },
                            quoteToken: { type: 'object', description: 'Quote token details', properties: { address: { type: 'string', description: 'Token contract address' }, name: { type: 'string', description: 'Token name' }, symbol: { type: 'string', description: 'Token ticker symbol' } } },
                            priceNative: { type: 'string', description: 'Price in native token terms' },
                            priceUsd: { type: 'string', description: 'Price in USD' },
                            txns: { type: 'object', description: 'Transaction counts by time period', properties: { m5: { type: 'object', description: '5-minute transaction data' }, h1: { type: 'object', description: '1-hour transaction data' }, h6: { type: 'object', description: '6-hour transaction data' }, h24: { type: 'object', description: '24-hour transaction data' } } },
                            volume: { type: 'object', description: 'Trading volume by time period in USD', properties: { h24: { type: 'number', description: '24-hour volume' }, h6: { type: 'number', description: '6-hour volume' }, h1: { type: 'number', description: '1-hour volume' }, m5: { type: 'number', description: '5-minute volume' } } },
                            priceChange: { type: 'object', description: 'Price change percentages', properties: { m5: { type: 'number', description: '5-minute price change' }, h1: { type: 'number', description: '1-hour price change' }, h6: { type: 'number', description: '6-hour price change' }, h24: { type: 'number', description: '24-hour price change' } } },
                            liquidity: { type: 'object', description: 'Pool liquidity data', properties: { usd: { type: 'number', description: 'Liquidity in USD' }, base: { type: 'number', description: 'Base token liquidity' }, quote: { type: 'number', description: 'Quote token liquidity' } } },
                            fdv: { type: 'number', description: 'Fully diluted valuation in USD' },
                            marketCap: { type: 'number', description: 'Market capitalization in USD' },
                            pairCreatedAt: { type: 'number', description: 'Unix timestamp when pair was created' },
                            info: { type: 'object', description: 'Additional token info', properties: { imageUrl: { type: 'string', description: 'Token image URL' }, header: { type: 'string', description: 'Token header image URL' }, openGraph: { type: 'string', description: 'Open Graph image URL' }, websites: { type: 'array', description: 'Token project websites', items: { type: 'object' } }, socials: { type: 'array', description: 'Social media links', items: { type: 'object' } } } }
                        }
                    }
                }
            },
        },
        getTokenPools: {
            method: 'GET',
            path: '/token-pairs/v1/:chainId/:tokenAddress',
            description: 'Get token pools by chain and address via DexScreener — query by chainId and tokenAddress.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Blockchain chain identifier, e.g. ethereum, bsc, solana' },
                { position: { key: 'tokenAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Token contract address to find pools for' }
            ],
            tests: [
                { _description: 'Get token pools on BSC', chainId: 'bsc', tokenAddress: '0xD279E8f1fE8F893e4b1CB18fAAeb4fc2a0d14444' },
                { _description: 'Get WETH pools on Ethereum', chainId: 'ethereum', tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
                { _description: 'Get USDC pools on Ethereum', chainId: 'ethereum', tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: { type: 'string' }
                }
            },
        }
    }
}
