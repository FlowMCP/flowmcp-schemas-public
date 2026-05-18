// Migrated from v1.2.0 -> v2.0.0
// Category: simple
// Namespace: "bridgeRates" -> "bridgerates"

export const main = {
    namespace: 'bridgerates',
    name: 'LiFi Bridge API',
    description: 'Fetches bridge quotes, supported chains, tools, and cross-chain transfer data from LiFi API',
    version: '4.0.0',
    docs: ['https://docs.li.fi/', 'https://li.quest/v1'],
    tags: ['bridge', 'crosschain', 'defi', 'cacheTtlRealtime'],
    root: 'https://li.quest/v1',
    tools: {
        getSupportedChains: {
            method: 'GET',
            path: '/chains',
            description: 'Get information about all currently supported chains for cross-chain transfers. via bridgeRates.',
            parameters: [],
            tests: [
                { _description: 'Get all supported blockchains' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        chains: { type: 'array', items: { type: 'object', properties: { key: { type: 'string' }, chainType: { type: 'string' }, name: { type: 'string' }, coin: { type: 'string' }, id: { type: 'number' }, mainnet: { type: 'boolean' }, logoURI: { type: 'string' }, tokenlistUrl: { type: 'string' }, multicallAddress: { type: 'string' }, relayerSupported: { type: 'boolean' }, metamask: { type: 'object' }, nativeToken: { type: 'object' }, diamondAddress: { type: 'string' }, permit2: { type: 'string' }, permit2Proxy: { type: 'string' } } } }
                    }
                }
            },
        },
        getSupportedTools: {
            method: 'GET',
            path: '/tools',
            description: 'Get information about the bridges and exchanges available through LiFi service. via bridgeRates.',
            parameters: [],
            tests: [
                { _description: 'Get all available bridges and exchanges' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        bridges: { type: 'array', items: { type: 'object', properties: { key: { type: 'string' }, name: { type: 'string' }, logoURI: { type: 'string' }, supportedChains: { type: 'array', items: { type: 'object' } } } } },
                        exchanges: { type: 'array', items: { type: 'object', properties: { key: { type: 'string' }, name: { type: 'string' }, logoURI: { type: 'string' }, supportedChains: { type: 'array', items: { type: 'number' } } } } }
                    }
                }
            },
        },
        getConnections: {
            method: 'GET',
            path: '/connections',
            description: 'Returns all possible connections based on chain filters. At least one filter parameter is required.',
            parameters: [
                { position: { key: 'fromChain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'toChain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'fromToken', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'toToken', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get connections from Ethereum', fromChain: '1' },
                { _description: 'Get connections to Optimism', toChain: '10' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        connections: { type: 'array', items: { type: 'object', properties: { fromChainId: { type: 'number' }, toChainId: { type: 'number' }, fromTokens: { type: 'array', items: { type: 'object' } }, toTokens: { type: 'array', items: { type: 'object' } } } } }
                    }
                }
            },
        },
        getTransferStatus: {
            method: 'GET',
            path: '/status',
            description: 'Check the status of a cross-chain transfer by transaction hash. Required: txHash. Optional filters: fromChain, toChain, bridge.',
            parameters: [
                { position: { key: 'txHash', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['length(66)'] } },
                { position: { key: 'fromChain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'toChain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'bridge', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            output: {mimeType:'application/json',schema:{type:'object',properties:{status:{type:'string'},substatus:{type:'string'},sending:{type:'object'},receiving:{type:'object'},tool:{type:'string'}}}},
            tests: [
                {
                    _description: 'Check transfer status with example hash',
                    txHash: '0xd0c1ef948c2061e36e17e152e14f82bff6c04840445b9e0276c08bd3bce18f08',
                    fromChain: '1'
                }
            ],
        },
        getQuote: {
            method: 'GET',
            path: '/quote',
            description: 'Get a concrete bridge route recommendation with fees, estimated duration, and ready-to-sign transaction data for a cross-chain transfer.',
            parameters: [
                { position: { key: 'fromChain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'toChain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fromToken', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'toToken', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fromAmount', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fromAddress', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(42)', 'max(42)'] } }
            ],
            output: {mimeType:'application/json',schema:{type:'object',properties:{id:{type:'string'},type:{type:'string'},tool:{type:'string'},toolDetails:{type:'object',properties:{key:{type:'string'},name:{type:'string'},logoURI:{type:'string'}}},action:{type:'object',properties:{fromChainId:{type:'number'},fromAmount:{type:'string'},fromToken:{type:'object'},toChainId:{type:'number'},toToken:{type:'object'},slippage:{type:'number'}}},estimate:{type:'object',properties:{tool:{type:'string'},approvalAddress:{type:'string'},toAmountMin:{type:'string'},toAmount:{type:'string'},fromAmount:{type:'string'},feeCosts:{type:'array'},gasCosts:{type:'array'},executionDuration:{type:'number'}}}}}},
            tests: [
                {
                    _description: 'Bridge 10 USDC from Ethereum to Polygon',
                    fromChain: '1',
                    toChain: '137',
                    fromToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                    toToken: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
                    fromAmount: '10000000',
                    fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
                }
            ],
        },
        getTokenInfo: {
            method: 'GET',
            path: '/token',
            description: 'Get token details including contract address, decimals, price in USD, market cap, and volume for a specific token on a given chain.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'token', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            output: {mimeType:'application/json',schema:{type:'object',properties:{address:{type:'string'},chainId:{type:'number'},symbol:{type:'string'},decimals:{type:'number'},name:{type:'string'},coinKey:{type:'string'},logoURI:{type:'string'},priceUSD:{type:'string'},marketCapUSD:{type:'string'},volumeUSD24H:{type:'string'},tags:{type:'array',items:{type:'string'}}}}},
            tests: [
                { _description: 'Get USDC info on Ethereum', chain: '1', token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
                { _description: 'Get WETH info on Arbitrum', chain: '42161', token: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' }
            ],
        }
    }
}
