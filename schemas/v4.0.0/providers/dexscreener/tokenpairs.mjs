// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'dexscreener',
    name: 'DexScreener Token Pairs API',
    description: 'Access token pair data, price information, and trading metrics from DexScreener across multiple DEX platforms',
    version: '4.0.0',
    docs: ['https://docs.dexscreener.com/api/reference'],
    tags: ['dex', 'trading', 'pairs', 'cacheTtlFrequent'],
    root: 'https://api.dexscreener.com',
    tools: {
        getTokenPairs: {
            method: 'GET',
            path: '/latest/dex/tokens/:tokenAddress',
            description: 'Get token pairs by token address on specific blockchain via DexScreener — query by tokenAddress.',
            parameters: [
                { position: { key: 'tokenAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Token contract address to look up pairs for' }
            ],
            tests: [
                { _description: 'Get pairs for WETH token', tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
                { _description: 'Get pairs for USDC token', tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
                { _description: 'Get pairs for USDT token', tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        schemaVersion: { type: 'string', description: 'API schema version identifier' },
                        pairs: { type: 'array', description: 'Array of trading pair objects', items: { type: 'object', properties: { chainId: { type: 'string', description: 'Blockchain chain identifier' }, dexId: { type: 'string', description: 'DEX protocol identifier' }, url: { type: 'string', description: 'DexScreener URL for this pair' }, pairAddress: { type: 'string', description: 'Pair contract address' }, labels: { type: 'array', description: 'Classification labels', items: { type: 'string' } }, baseToken: { type: 'object', description: 'Base token details' }, quoteToken: { type: 'object', description: 'Quote token details' }, priceNative: { type: 'string', description: 'Price in native token terms' }, priceUsd: { type: 'string', description: 'Price in USD' }, txns: { type: 'object', description: 'Transaction counts by time period' }, volume: { type: 'object', description: 'Trading volume by time period' }, priceChange: { type: 'object', description: 'Price change percentages by time period' }, liquidity: { type: 'object', description: 'Pool liquidity data' }, fdv: { type: 'number', description: 'Fully diluted valuation in USD' }, marketCap: { type: 'number', description: 'Market capitalization in USD' }, pairCreatedAt: { type: 'number', description: 'Unix timestamp when pair was created' } } } }
                    }
                }
            },
        },
        getLatestPairs: {
            method: 'GET',
            path: '/latest/dex/pairs/:chainId/:pairId',
            description: 'Get specific token pair by chain and pair address via DexScreener — query by chainId and pairId.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(ethereum,bsc,polygon,avalanche,fantom,cronos,arbitrum,optimism,base,solana)', options: [] }, description: 'Blockchain chain to query' },
                { position: { key: 'pairId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Pair contract address on the specified chain' }
            ],
            tests: [
                { _description: 'Get specific pair on Ethereum', chainId: 'ethereum', pairId: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640' },
                { _description: 'Get specific pair on BSC', chainId: 'bsc', pairId: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16' },
                { _description: 'Get specific pair on Polygon', chainId: 'polygon', pairId: '0x45dDa9cb7c25131DF268515131f647d726f50608' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        schemaVersion: { type: 'string', description: 'API schema version identifier' },
                        pairs: { type: 'array', description: 'Array of matching pair objects', items: { type: 'object', properties: { chainId: { type: 'string', description: 'Blockchain chain identifier' }, dexId: { type: 'string', description: 'DEX protocol identifier' }, url: { type: 'string', description: 'DexScreener URL for this pair' }, pairAddress: { type: 'string', description: 'Pair contract address' }, labels: { type: 'array', description: 'Classification labels', items: { type: 'string' } }, baseToken: { type: 'object', description: 'Base token details' }, quoteToken: { type: 'object', description: 'Quote token details' }, priceNative: { type: 'string', description: 'Price in native token terms' }, priceUsd: { type: 'string', description: 'Price in USD' }, txns: { type: 'object', description: 'Transaction counts by time period' }, volume: { type: 'object', description: 'Trading volume by time period' }, priceChange: { type: 'object', description: 'Price change percentages' }, liquidity: { type: 'object', description: 'Pool liquidity data' }, fdv: { type: 'number', description: 'Fully diluted valuation in USD' }, marketCap: { type: 'number', description: 'Market capitalization in USD' }, pairCreatedAt: { type: 'number', description: 'Unix timestamp when pair was created' }, info: { type: 'object', description: 'Additional token info' } } } },
                        pair: { type: 'object', description: 'Single pair detail object', properties: { chainId: { type: 'string', description: 'Blockchain chain identifier' }, dexId: { type: 'string', description: 'DEX protocol identifier' }, url: { type: 'string', description: 'DexScreener URL' }, pairAddress: { type: 'string', description: 'Pair contract address' }, labels: { type: 'array', description: 'Classification labels', items: { type: 'string' } }, baseToken: { type: 'object', description: 'Base token details', properties: { address: { type: 'string', description: 'Token contract address' }, name: { type: 'string', description: 'Token name' }, symbol: { type: 'string', description: 'Token ticker symbol' } } }, quoteToken: { type: 'object', description: 'Quote token details', properties: { address: { type: 'string', description: 'Token contract address' }, name: { type: 'string', description: 'Token name' }, symbol: { type: 'string', description: 'Token ticker symbol' } } }, priceNative: { type: 'string', description: 'Price in native token terms' }, priceUsd: { type: 'string', description: 'Price in USD' }, txns: { type: 'object', description: 'Transaction counts by time period', properties: { m5: { type: 'object', description: '5-minute data' }, h1: { type: 'object', description: '1-hour data' }, h6: { type: 'object', description: '6-hour data' }, h24: { type: 'object', description: '24-hour data' } } }, volume: { type: 'object', description: 'Trading volume in USD', properties: { h24: { type: 'number', description: '24-hour volume' }, h6: { type: 'number', description: '6-hour volume' }, h1: { type: 'number', description: '1-hour volume' }, m5: { type: 'number', description: '5-minute volume' } } }, priceChange: { type: 'object', description: 'Price change percentages', properties: { m5: { type: 'number', description: '5-minute change' }, h1: { type: 'number', description: '1-hour change' }, h6: { type: 'number', description: '6-hour change' }, h24: { type: 'number', description: '24-hour change' } } }, liquidity: { type: 'object', description: 'Pool liquidity data', properties: { usd: { type: 'number', description: 'Liquidity in USD' }, base: { type: 'number', description: 'Base token liquidity' }, quote: { type: 'number', description: 'Quote token liquidity' } } }, fdv: { type: 'number', description: 'Fully diluted valuation in USD' }, marketCap: { type: 'number', description: 'Market capitalization in USD' }, pairCreatedAt: { type: 'number', description: 'Unix timestamp when pair was created' }, info: { type: 'object', description: 'Additional info including images and socials', properties: { imageUrl: { type: 'string', description: 'Token image URL' }, openGraph: { type: 'string', description: 'Open Graph image URL' }, websites: { type: 'array', description: 'Project websites', items: { type: 'string' } }, socials: { type: 'array', description: 'Social media links', items: { type: 'string' } } } } } }
                    }
                }
            },
        },
        getPairsByChain: {
            method: 'GET',
            path: '/orders/v1/:chainId/:sortBy',
            description: 'Get trending token pairs by chain via DexScreener — query by chainId and sortBy.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(ethereum,bsc,polygon,avalanche,fantom,cronos,arbitrum,optimism,base,solana)', options: [] }, description: 'Blockchain chain to query' },
                { position: { key: 'sortBy', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(volume,gainers,losers)', options: ['default(volume)'] }, description: 'Sort criteria: volume, gainers, or losers' }
            ],
            tests: [
                { _description: 'Get trending pairs on Ethereum by volume', chainId: 'ethereum', sortBy: 'volume' },
                { _description: 'Get top gainers on BSC', chainId: 'bsc', sortBy: 'gainers' },
                { _description: 'Get trending pairs on Polygon', chainId: 'polygon', sortBy: 'volume' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        orders: { type: 'array', description: 'Array of order identifiers', items: { type: 'string' } },
                        boosts: { type: 'array', description: 'Array of boost identifiers', items: { type: 'string' } }
                    }
                }
            },
        },
        getSpecificPair: {
            method: 'GET',
            path: '/latest/dex/pairs/:chainId/:pairAddress',
            description: 'Get detailed information about a specific token pair by chain and address. Required: chainId, pairAddress.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(ethereum,bsc,polygon,avalanche,fantom,cronos,arbitrum,optimism,base,solana)', options: [] }, description: 'Blockchain chain to query' },
                { position: { key: 'pairAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Pair contract address on the specified chain' }
            ],
            tests: [
                { _description: 'Get specific pair on Ethereum', chainId: 'ethereum', pairAddress: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640' },
                { _description: 'Get specific pair on BSC', chainId: 'bsc', pairAddress: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16' },
                { _description: 'Get specific pair on Polygon', chainId: 'polygon', pairAddress: '0x45dDa9cb7c25131DF268515131f647d726f50608' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        schemaVersion: { type: 'string', description: 'API schema version identifier' },
                        pairs: { type: 'array', description: 'Array of matching pair objects', items: { type: 'object', properties: { chainId: { type: 'string', description: 'Blockchain chain identifier' }, dexId: { type: 'string', description: 'DEX protocol identifier' }, url: { type: 'string', description: 'DexScreener URL' }, pairAddress: { type: 'string', description: 'Pair contract address' }, labels: { type: 'array', description: 'Classification labels', items: { type: 'string' } }, baseToken: { type: 'object', description: 'Base token details' }, quoteToken: { type: 'object', description: 'Quote token details' }, priceNative: { type: 'string', description: 'Price in native token terms' }, priceUsd: { type: 'string', description: 'Price in USD' }, txns: { type: 'object', description: 'Transaction counts' }, volume: { type: 'object', description: 'Trading volume' }, priceChange: { type: 'object', description: 'Price change percentages' }, liquidity: { type: 'object', description: 'Pool liquidity data' }, fdv: { type: 'number', description: 'Fully diluted valuation' }, marketCap: { type: 'number', description: 'Market capitalization' }, pairCreatedAt: { type: 'number', description: 'Unix creation timestamp' }, info: { type: 'object', description: 'Additional info' } } } },
                        pair: { type: 'object', description: 'Single pair detail object', properties: { chainId: { type: 'string', description: 'Blockchain chain identifier' }, dexId: { type: 'string', description: 'DEX protocol identifier' }, url: { type: 'string', description: 'DexScreener URL' }, pairAddress: { type: 'string', description: 'Pair contract address' }, labels: { type: 'array', description: 'Classification labels', items: { type: 'string' } }, baseToken: { type: 'object', description: 'Base token details', properties: { address: { type: 'string', description: 'Token contract address' }, name: { type: 'string', description: 'Token name' }, symbol: { type: 'string', description: 'Token ticker symbol' } } }, quoteToken: { type: 'object', description: 'Quote token details', properties: { address: { type: 'string', description: 'Token contract address' }, name: { type: 'string', description: 'Token name' }, symbol: { type: 'string', description: 'Token ticker symbol' } } }, priceNative: { type: 'string', description: 'Price in native terms' }, priceUsd: { type: 'string', description: 'Price in USD' }, txns: { type: 'object', description: 'Transaction counts', properties: { m5: { type: 'object', description: '5-minute data' }, h1: { type: 'object', description: '1-hour data' }, h6: { type: 'object', description: '6-hour data' }, h24: { type: 'object', description: '24-hour data' } } }, volume: { type: 'object', description: 'Trading volume in USD', properties: { h24: { type: 'number', description: '24-hour volume' }, h6: { type: 'number', description: '6-hour volume' }, h1: { type: 'number', description: '1-hour volume' }, m5: { type: 'number', description: '5-minute volume' } } }, priceChange: { type: 'object', description: 'Price change percentages', properties: { m5: { type: 'number', description: '5-minute change' }, h1: { type: 'number', description: '1-hour change' }, h6: { type: 'number', description: '6-hour change' }, h24: { type: 'number', description: '24-hour change' } } }, liquidity: { type: 'object', description: 'Pool liquidity data', properties: { usd: { type: 'number', description: 'Liquidity in USD' }, base: { type: 'number', description: 'Base token liquidity' }, quote: { type: 'number', description: 'Quote token liquidity' } } }, fdv: { type: 'number', description: 'Fully diluted valuation' }, marketCap: { type: 'number', description: 'Market capitalization' }, pairCreatedAt: { type: 'number', description: 'Unix creation timestamp' }, info: { type: 'object', description: 'Additional info', properties: { imageUrl: { type: 'string', description: 'Token image URL' }, openGraph: { type: 'string', description: 'Open Graph image URL' }, websites: { type: 'array', description: 'Project websites', items: { type: 'string' } }, socials: { type: 'array', description: 'Social media links', items: { type: 'string' } } } } } }
                    }
                }
            },
        }
    }
}
