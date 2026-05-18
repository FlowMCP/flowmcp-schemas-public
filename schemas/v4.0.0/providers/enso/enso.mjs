export const main = {
    namespace: 'enso',
    name: 'Enso Finance DeFi Routing',
    description: 'Access Enso Finance intent-based DeFi routing API — find optimal swap routes across protocols, query supported protocols and networks, fetch token data and prices, and check chain volume. Use getNetworks for valid chainId values, getProtocols slugs feed into getTokens protocolSlug filter.',
    version: '4.0.0',
    docs: ['https://docs.enso.build'],
    tags: ['defi', 'routing', 'swap', 'multichain', 'cacheTtlFrequent'],
    root: 'https://api.enso.build',
    requiredServerParams: ['ENSO_API_KEY'],
    headers: {
        'Authorization': 'Bearer {{ENSO_API_KEY}}',
        'Content-Type': 'application/json'
    },
    tools: {
        getRoute: {
            method: 'GET',
            path: '/api/v1/shortcuts/route',
            description: 'Find the optimal swap route between two tokens on a given chain. Returns a ready-to-sign transaction object with amountOut, gas estimate, and route path. Use getNetworks to find valid chainId values and getTokens to look up token addresses.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [], description: 'EVM chain ID for the swap (e.g. 1 for Ethereum, 42161 for Arbitrum). Use getNetworks to list supported chains.' } },
                { position: { key: 'fromAddress', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(42)', 'max(42)'], description: 'Sender wallet address (0x-prefixed, 42 characters). The transaction will be constructed for this address.' } },
                { position: { key: 'tokenIn', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [], description: 'Contract address of the input token to swap from (e.g. 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 for USDC)' } },
                { position: { key: 'tokenOut', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [], description: 'Contract address of the output token to swap to (e.g. 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 for WETH)' } },
                { position: { key: 'amountIn', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [], description: 'Amount of input token in smallest unit (wei). For USDC (6 decimals): 1000000 = 1 USDC.' } },
                { position: { key: 'slippage', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(50)'], description: 'Maximum slippage tolerance in basis points (50 = 0.5%). Default is 50 bps.' } },
                { position: { key: 'routingStrategy', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(router,delegate)', options: ['optional()', 'default(router)'], description: 'Routing strategy: router (standard routing) or delegate (delegated routing via Enso smart contract)' } }
            ],
            tests: [
                { _description: 'Route 1 USDC to WETH on Ethereum', chainId: 1, fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', tokenIn: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', tokenOut: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', amountIn: '1000000' }
            ],
            output: {
                description: 'Optimal swap route with ready-to-sign transaction data including gas estimate and output amount',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Swap route response containing transaction calldata, gas estimate, and routing details',
                    properties: {
                        tx: { type: 'object', description: 'Ready-to-sign EVM transaction object with to, data, value, and gas fields' },
                        amountOut: { type: 'string', description: 'Expected output token amount in smallest unit (wei)' },
                        gas: { type: 'string', description: 'Estimated gas cost for the transaction in wei' },
                        route: { type: 'array', description: 'Ordered list of protocol hops describing the swap path taken', items: { type: 'object' } },
                        priceImpact: { type: 'number', description: 'Estimated price impact of the swap as a decimal (e.g. 0.005 = 0.5%)' }
                    }
                }
            }
        },
        getProtocols: {
            method: 'GET',
            path: '/api/v1/protocols',
            description: 'Retrieve all DeFi protocols supported by Enso, optionally filtered by chain ID or protocol slug. Protocol slugs from this endpoint can be used as protocolSlug filter in getTokens.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'], description: 'Filter protocols by EVM chain ID (e.g. 1 for Ethereum). Omit to get protocols across all chains.' } },
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Filter by protocol slug (e.g. aave, uniswap-v3, compound)' } }
            ],
            tests: [
                { _description: 'Get all protocols on Ethereum', chainId: 1 },
                { _description: 'Get Aave protocol info', slug: 'aave' }
            ],
            output: {
                description: 'List of DeFi protocols with their metadata including name, slug, supported chains, and TVL',
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of protocol objects with metadata about each supported DeFi protocol',
                    items: {
                        type: 'object',
                        properties: {
                            slug: { type: 'string', description: 'Unique protocol identifier slug (e.g. aave, compound). Use as protocolSlug in getTokens.' },
                            name: { type: 'string', description: 'Human-readable protocol name (e.g. Aave V3, Compound)' },
                            chains: { type: 'array', description: 'List of chain IDs where this protocol is deployed', items: { type: 'number' } },
                            url: { type: 'string', description: 'Protocol website URL' },
                            logo: { type: 'string', description: 'URL to the protocol logo image' }
                        }
                    }
                }
            }
        },
        getNetworks: {
            method: 'GET',
            path: '/api/v1/networks',
            description: 'List all blockchain networks supported by Enso, with optional filtering by name or chain ID. Use the returned chainId values in getRoute, getProtocols, getTokens, getTokenPrice, and getAggregators.',
            parameters: [
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Filter networks by name (e.g. Ethereum, Arbitrum, Polygon)' } },
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Filter by specific chain ID as string (e.g. 1, 42161, 137)' } }
            ],
            tests: [
                { _description: 'Get all supported networks' }
            ],
            output: {
                description: 'List of supported blockchain networks with chain IDs and metadata',
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of network objects describing each supported blockchain',
                    items: {
                        type: 'object',
                        properties: {
                            chainId: { type: 'number', description: 'EVM chain ID (e.g. 1 for Ethereum, 42161 for Arbitrum). Use this value in other Enso tools.' },
                            name: { type: 'string', description: 'Human-readable network name (e.g. Ethereum Mainnet)' },
                            nativeCurrency: { type: 'object', description: 'Native currency details (name, symbol, decimals) for this chain' },
                            blockExplorer: { type: 'string', description: 'Block explorer URL for this network (e.g. https://etherscan.io)' }
                        }
                    }
                }
            }
        },
        getTokens: {
            method: 'GET',
            path: '/api/v1/tokens',
            description: 'Search for tokens with optional filters for chain, project, protocol, type, APY range, and TVL range. Supports cursor-based pagination. Use getProtocols to find valid protocolSlug values.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'], description: 'Filter tokens by EVM chain ID (e.g. 1 for Ethereum, 42161 for Arbitrum)' } },
                { position: { key: 'protocolSlug', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Filter by protocol slug from getProtocols (e.g. aave, uniswap-v3)' } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(defi,base)', options: ['optional()'], description: 'Token type filter: defi (yield-bearing/LP tokens) or base (standard ERC-20 tokens)' } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'], description: 'Pagination page number (1-based). Each page returns a fixed number of results.' } }
            ],
            tests: [
                { _description: 'Get DeFi tokens on Ethereum', chainId: 1, type: 'defi' },
                { _description: 'Get base tokens on Arbitrum', chainId: 42161, type: 'base' }
            ],
            output: {
                description: 'Paginated list of tokens with metadata including address, price, APY, TVL, and protocol info',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated token list response with token details and pagination cursor',
                    properties: {
                        data: { type: 'array', description: 'Array of token objects matching the filter criteria', items: { type: 'object', properties: { address: { type: 'string', description: 'Token contract address (0x-prefixed). Use in getTokenPrice or getRoute.' }, chainId: { type: 'number', description: 'Chain ID where this token is deployed' }, symbol: { type: 'string', description: 'Token ticker symbol (e.g. USDC, WETH, aDAI)' }, name: { type: 'string', description: 'Full token name' }, decimals: { type: 'number', description: 'Token decimal places (e.g. 18 for ETH, 6 for USDC)' }, type: { type: 'string', description: 'Token type: defi (yield-bearing) or base (standard ERC-20)' }, protocolSlug: { type: 'string', description: 'Protocol that manages this token (for defi type)' }, apy: { type: 'number', description: 'Current annual percentage yield as decimal (for defi tokens)' }, tvl: { type: 'number', description: 'Total value locked in USD (for defi tokens)' } } } },
                        cursor: { type: 'string', description: 'Pagination cursor for the next page of results' }
                    }
                }
            }
        },
        getTokenPrice: {
            method: 'GET',
            path: '/api/v1/prices/:chainId/:address',
            description: 'Get the current USD price of a token by its address and chain ID. Use getTokens to find token addresses, and getNetworks for valid chain IDs.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [], description: 'EVM chain ID where the token is deployed (e.g. 1 for Ethereum)' } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(42)', 'max(42)'], description: 'Token contract address (0x-prefixed, 42 characters)' } }
            ],
            tests: [
                { _description: 'Get USDC price on Ethereum', chainId: 1, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
                { _description: 'Get WETH price on Ethereum', chainId: 1, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }
            ],
            output: {
                description: 'Current USD price for the requested token',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Token price response with USD value and metadata',
                    properties: {
                        price: { type: 'number', description: 'Current token price in USD' },
                        decimals: { type: 'number', description: 'Token decimal places used for amount conversions' },
                        symbol: { type: 'string', description: 'Token ticker symbol' },
                        address: { type: 'string', description: 'Token contract address that was queried' },
                        chainId: { type: 'number', description: 'Chain ID where the token is deployed' }
                    }
                }
            }
        },
        getAggregators: {
            method: 'GET',
            path: '/api/v1/aggregators',
            description: 'List all DEX aggregators supported by Enso, optionally filtered by chain ID. These aggregators are used internally by getRoute to find optimal swap paths.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'], description: 'Filter aggregators by EVM chain ID (e.g. 1 for Ethereum). Omit to get aggregators across all chains.' } }
            ],
            tests: [
                { _description: 'Get all aggregators', chainId: 1 },
                { _description: 'Get aggregators on Ethereum', chainId: 1 }
            ],
            output: {
                description: 'List of DEX aggregators available for routing on the specified chain or all chains',
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of aggregator objects describing each supported DEX aggregator',
                    items: {
                        type: 'object',
                        properties: {
                            slug: { type: 'string', description: 'Unique aggregator identifier slug' },
                            name: { type: 'string', description: 'Human-readable aggregator name (e.g. 1inch, Paraswap)' },
                            chains: { type: 'array', description: 'List of chain IDs where this aggregator is available', items: { type: 'number' } }
                        }
                    }
                }
            }
        }
    }
}
