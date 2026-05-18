// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// requiredLibraries: ethers, @thanpolas/univ3prices
// Import: import { ethers } from "ethers"
// Import: import univ3prices from "@thanpolas/univ3prices"
// Module-level code: 85 lines

export const main = {
    namespace: 'uniswap',
    name: 'Uniswap V3 Price Server',
    description: 'Exposes tools for price discovery via Uniswap V3 pools, with fallback to CryptoCompare',
    version: '4.0.0',
    docs: ['https://uniswap.org/docs', 'https://min-api.cryptocompare.com/documentation'],
    tags: ['production', 'dex', 'trading', 'defi', 'cacheTtlRealtime'],
    root: 'https://uniswap-rpc-resolver.local?_ak={{ALCHEMY_API_KEY}}',
    requiredServerParams: ['ALCHEMY_API_KEY'],
    tools: {
        getSupportedChains: {
            method: 'GET',
            path: '/',
            description: 'Returns a Markdown-formatted list of supported chain IDs and names Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Fetch list of supported chains' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: { type: 'object', properties: { chainId: { type: 'number' }, name: { type: 'string' } } }
                }
            },
        },
        getTokenPrice: {
            method: 'GET',
            path: '/',
            description: 'Fetches the token\'s USD price from a Uniswap V3 pool (with 0.3% fee tier) on the specified chain, using fallback to CryptoCompare',
            parameters: [
                { position: { key: 'tokenAddress', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'chainAlias', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(ETHEREUM_MAINNET,POLYGON_MAINNET,ARBITRUM_MAINNET,OPTIMISM_MAINNET)', options: ['default(ETHEREUM_MAINNET)'] } }
            ],
            tests: [
                {
                    _description: 'Fetch token price for DAI on Ethereum',
                    tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                    chainAlias: 'ETHEREUM_MAINNET'
                },
                {
                    _description: 'Fetch token price for USDC on Polygon',
                    tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
                    chainAlias: 'POLYGON_MAINNET'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', description: 'Token address' },
                        priceUSD: { type: 'string', description: 'Price in USD' },
                        pool: { type: 'string', description: 'Pool address' }
                    }
                }
            },
        }
    },
    requiredLibraries: ['ethers', '@thanpolas/univ3prices']
}


export const handlers = ( { sharedLists, libraries } ) => {
    const ethers = libraries['ethers']
    const univ3prices = libraries['@thanpolas/univ3prices']

    const chainConfig = {
        ETHEREUM_MAINNET: {
            chainId: 1,
            name: "Ethereum Mainnet",
            rpcUrlBase: "https://eth-mainnet.g.alchemy.com/v2/",
            factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
            multicall3: "0xca11bde05977b3631167028862be2a173976ca11",
            quoteTokens: [
                { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT", decimals: 6 },
                { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", decimals: 6 },
                { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", symbol: "WETH", decimals: 18 }
            ]
        },
        POLYGON_MAINNET: {
            chainId: 137,
            name: "Polygon",
            rpcUrlBase: "https://polygon-mainnet.g.alchemy.com/v2/",
            factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
            multicall3: "0xca11bde05977b3631167028862be2a173976ca11",
            quoteTokens: [
                { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", symbol: "USDT", decimals: 6 },
                { address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", symbol: "USDC", decimals: 6 },
                { address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", symbol: "WETH", decimals: 18 }
            ]
        },
        ARBITRUM_MAINNET: {
            chainId: 42161,
            name: "Arbitrum",
            rpcUrlBase: "https://arb-mainnet.g.alchemy.com/v2/",
            factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
            multicall3: "0xca11bde05977b3631167028862be2a173976ca11",
            quoteTokens: [
                { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", symbol: "USDT", decimals: 6 },
                { address: "0xaf88d065e77c8cC2239327C5EFb3A432268e5831", symbol: "USDC", decimals: 6 },
                { address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", symbol: "WETH", decimals: 18 }
            ]
        },
        OPTIMISM_MAINNET: {
            chainId: 10,
            name: "Optimism",
            rpcUrlBase: "https://opt-mainnet.g.alchemy.com/v2/",
            factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
            multicall3: "0xca11bde05977b3631167028862be2a173976ca11",
            quoteTokens: [
                { address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", symbol: "USDT", decimals: 6 },
                { address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", symbol: "USDC", decimals: 6 },
                { address: "0x4200000000000000000000000000000000000006", symbol: "WETH", decimals: 18 }
            ]
        }
    }
    const availableProviders = {}
    const multicall3Abi = [{
        name: 'aggregate3',
        inputs: [{
            components: [
                { name: 'target', type: 'address' },
                { name: 'allowFailure', type: 'bool' },
                { name: 'callData', type: 'bytes' }
            ],
            name: 'calls',
            type: 'tuple[]'
        }],
        outputs: [{
            components: [
                { name: 'success', type: 'bool' },
                { name: 'returnData', type: 'bytes' }
            ],
            name: 'returnData',
            type: 'tuple[]'
        }],
        stateMutability: 'view',
        type: 'function'
    }]
    const TOKEN_ABI = [
        "function decimals() external view returns (uint8)",
        "function symbol() external view returns (string)"
    ]
    const POOL_ABI = [
        "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
        "function token0() external view returns (address)",
        "function token1() external view returns (address)"
    ]
    const FACTORY_ABI = [
        "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)"
    ]

    return {
        getSupportedChains: {
            preRequest: async ( { struct, payload } ) => {
                if( Object.keys(availableProviders).length !== 0 ) { return { struct } }
                // REV-15: ALCHEMY_API_KEY arrives interpolated into struct.url (FlowMCP v3 pattern)
                const parsed = new URL( struct.url )
                const alchemyKey = parsed.searchParams.get( '_ak' )
                if( !alchemyKey ) {
                struct.status = false
                struct.messages.push('ALCHEMY_API_KEY not found in struct.url query (_ak)')
                return { struct }
                }

                for( const [ alias, cfg ] of Object.entries(chainConfig) ) {
                const url = `${cfg.rpcUrlBase}${alchemyKey}`
                const provider = new ethers.JsonRpcProvider(url)
                availableProviders[ alias ] = {
                provider: provider,
                config: cfg
                }
                }

                return { struct }
            },
            executeRequest: async ( { struct, payload } ) => {
                const table = "| Chain Alias | Chain ID | Chain Name | Available |\n|-------------|----------|------------|----------|\n" + Object.entries(chainConfig)
                .map(([alias, cfg]) => {
                const available = availableProviders[alias] ? "✅" : "❌"
                return `| ${alias} | ${cfg.chainId} | ${cfg.name} | ${available} |`
                })
                .join("\n")
                struct.data = {
                markdown: table,
                availableChains: Object.keys(availableProviders),
                supportedAliases: Object.keys(chainConfig)
                }
                return { struct }
            }
        },
        getTokenPrice: {
            preRequest: async ( { struct, payload } ) => {
                if( Object.keys(availableProviders).length !== 0 ) { return { struct } }
                // REV-15: ALCHEMY_API_KEY arrives interpolated into struct.url (FlowMCP v3 pattern)
                const parsed = new URL( struct.url )
                const alchemyKey = parsed.searchParams.get( '_ak' )
                if( !alchemyKey ) {
                struct.status = false
                struct.messages.push('ALCHEMY_API_KEY not found in struct.url query (_ak)')
                return { struct }
                }

                for( const [ alias, cfg ] of Object.entries(chainConfig) ) {
                const url = `${cfg.rpcUrlBase}${alchemyKey}`
                const provider = new ethers.JsonRpcProvider(url)
                availableProviders[ alias ] = {
                provider: provider,
                config: cfg
                }
                }

                return { struct }
            },
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { chainAlias, tokenAddress } = userParams

                if( !availableProviders[chainAlias] ) {
                struct.status = false
                struct.messages.push(`Chain ${chainAlias} not available - missing RPC endpoint`)
                return { struct }}

                const { provider, config } = availableProviders[chainAlias]
                const multicallContract = new ethers.Contract(config.multicall3, multicall3Abi, provider)
                const tokenInterface = new ethers.Interface(TOKEN_ABI)
                const factoryInterface = new ethers.Interface(FACTORY_ABI)
                const poolInterface = new ethers.Interface(POOL_ABI)

                try {
                // Step 1: Get token info (decimals, symbol) using multicall
                const tokenCalls = [
                {
                target: tokenAddress,
                allowFailure: false,
                callData: tokenInterface.encodeFunctionData('decimals', [])
                },
                {
                target: tokenAddress,
                allowFailure: false,
                callData: tokenInterface.encodeFunctionData('symbol', [])
                }
                ]

                const tokenResults = await multicallContract.aggregate3(tokenCalls)
                const decimals0 = tokenInterface.decodeFunctionResult('decimals', tokenResults[0].returnData)[0]
                const symbol0 = tokenInterface.decodeFunctionResult('symbol', tokenResults[1].returnData)[0]

                // Step 2: Get all pool addresses using multicall
                const fee = 3000
                const poolCalls = config.quoteTokens.map( ( quote ) => {
                const [a, b] = tokenAddress.toLowerCase() < quote.address.toLowerCase()
                ? [tokenAddress, quote.address]
                : [quote.address, tokenAddress]
                return {
                target: config.factory,
                allowFailure: true,
                callData: factoryInterface.encodeFunctionData('getPool', [a, b, fee])
                }
                })

                const poolResults = await multicallContract.aggregate3(poolCalls)

                // Step 3: Get pool slot0 data for existing pools using multicall
                const validPools = []
                const slot0Calls = []

                for( let i = 0; i < poolResults.length; i++ ) {
                if( poolResults[i].success ) {
                const poolAddress = factoryInterface.decodeFunctionResult('getPool', poolResults[i].returnData)[0]
                if( poolAddress !== ethers.ZeroAddress ) {
                validPools.push({
                poolAddress,
                quote: config.quoteTokens[i],
                reverse: tokenAddress.toLowerCase() > config.quoteTokens[i].address.toLowerCase()
                })
                slot0Calls.push({
                target: poolAddress,
                allowFailure: true,
                callData: poolInterface.encodeFunctionData('slot0', [])
                })
                }
                }
                }

                if( slot0Calls.length === 0 ) {
                struct.status = false
                struct.messages.push(`No pools found for token ${symbol0}`)
                return { struct }}

                const slot0Results = await multicallContract.aggregate3(slot0Calls)

                // Step 4: Calculate prices from all successful pools
                const prices = []
                for( let i = 0; i < slot0Results.length; i++ ) {
                if( slot0Results[i].success ) {
                const pool = validPools[i]
                const { sqrtPriceX96 } = poolInterface.decodeFunctionResult('slot0', slot0Results[i].returnData)

                const priceObj = univ3prices(
                [Number(decimals0), pool.quote.decimals],
                sqrtPriceX96.toString()
                ).toAuto({ reverse: pool.reverse })

                const price = parseFloat(priceObj.toString())
                let usdPrice = price
                if( pool.quote.symbol === "USDT" || pool.quote.symbol === "USDC" ) {
                usdPrice = price // Already in USD
                } else if( pool.quote.symbol === "WETH" ) {
                usdPrice = price * 3000 // Rough ETH price estimate
                }

                prices.push({
                quote: pool.quote.symbol,
                price: parseFloat(price.toFixed(6)),
                priceUSD: parseFloat(usdPrice.toFixed(2)),
                poolAddress: pool.poolAddress
                })
                }
                }

                if( prices.length === 0 ) {
                struct.status = false
                struct.messages.push(`No valid pool data found for token ${symbol0}`)
                return { struct }}

                struct.data = {
                token: symbol0,
                tokenAddress,
                chainAlias,
                chainId: config.chainId,
                chainName: config.name,
                decimals: Number(decimals0),
                prices: prices,
                multicallOptimized: true
                }

                } catch( e ) {
                struct.status = false
                struct.messages.push(`Error: ${e.message}`)
                }

                return { struct }
            }
        }
    }
}
