// DeBridge DLN — Cross-Chain Bridge
// Free public API, no auth required

export const main = {
    namespace: 'debridge',
    name: 'DeBridge DLN API',
    description: 'Cross-chain bridge quotes, supported chains, token lists, and order tracking via DeBridge Liquidity Network (DLN)',
    version: '4.0.0',
    docs: ['https://docs.debridge.com'],
    tags: ['bridge', 'crosschain', 'defi', 'cacheTtlFrequent'],
    root: 'https://api.dln.trade/v1.0',
    requiredServerParams: [],
    headers: {},
    tools: {
        getSupportedChains: {
            method: 'GET',
            path: '/supported-chains-info',
            description: 'Get all blockchain networks supported by DeBridge DLN with chain IDs and names.',
            parameters: [],
            tests: [
                { _description: 'Get all supported chains with IDs and names' },
                { _description: 'List all DeBridge supported networks' },
                { _description: 'Fetch blockchain chain info for bridging' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        chains: { type: 'array', items: { type: 'object', properties: { chainId: { type: 'number' }, chainName: { type: 'string' } } } }
                    }
                }
            }
        },
        getTokenList: {
            method: 'GET',
            path: '/token-list',
            description: 'Get all tokens available for bridging on a specific blockchain network.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] }, description: 'Blockchain chain ID, e.g. 1 for Ethereum, 137 for Polygon, 56 for BSC' }
            ],
            tests: [
                { _description: 'Get tokens available on Ethereum', chainId: 1 },
                { _description: 'Get tokens available on Polygon', chainId: 137 },
                { _description: 'Get tokens available on BSC', chainId: 56 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        tokens: { type: 'object' }
                    }
                }
            }
        },
        getBridgeQuote: {
            method: 'GET',
            path: '/dln/order/quote',
            description: 'Get a cross-chain bridge quote including estimated output amount, fees, and cost breakdown. Does not generate transaction data.',
            parameters: [
                { position: { key: 'srcChainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] }, description: 'Source blockchain chain ID, e.g. 1 for Ethereum' },
                { position: { key: 'srcChainTokenIn', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Source token contract address (use 0x0000...0000 for native token)' },
                { position: { key: 'srcChainTokenInAmount', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Amount to bridge in smallest token unit (wei), e.g. 1000000000000000000 for 1 ETH' },
                { position: { key: 'dstChainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] }, description: 'Destination blockchain chain ID, e.g. 137 for Polygon' },
                { position: { key: 'dstChainTokenOut', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Destination token contract address (use 0x0000...0000 for native token)' },
                { position: { key: 'prependOperatingExpenses', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(true)'] }, description: 'Include operating expenses in the quote breakdown (default true)' }
            ],
            tests: [
                { _description: 'Quote ETH from Ethereum to MATIC on Polygon', srcChainId: 1, srcChainTokenIn: '0x0000000000000000000000000000000000000000', srcChainTokenInAmount: '1000000000000000000', dstChainId: 137, dstChainTokenOut: '0x0000000000000000000000000000000000000000' },
                { _description: 'Quote ETH from Ethereum to BNB on BSC', srcChainId: 1, srcChainTokenIn: '0x0000000000000000000000000000000000000000', srcChainTokenInAmount: '1000000000000000000', dstChainId: 56, dstChainTokenOut: '0x0000000000000000000000000000000000000000' },
                { _description: 'Quote ETH from Ethereum to native on Arbitrum', srcChainId: 1, srcChainTokenIn: '0x0000000000000000000000000000000000000000', srcChainTokenInAmount: '500000000000000000', dstChainId: 42161, dstChainTokenOut: '0x0000000000000000000000000000000000000000' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        estimation: { type: 'object', properties: { srcChainTokenIn: { type: 'object' }, srcChainTokenOut: { type: 'object' }, dstChainTokenOut: { type: 'object' }, costsDetails: { type: 'array', items: { type: 'object' } } } },
                        tx: { type: 'object' },
                        order: { type: 'object' },
                        fixFee: { type: 'string' },
                        prependedOperatingExpenseCost: { type: 'string' }
                    }
                }
            }
        },
        getOrderById: {
            method: 'GET',
            path: '/dln/order/:orderId',
            description: 'Get detailed data of a DLN cross-chain order by its order ID (0x-prefixed 64-char hex).',
            parameters: [
                { position: { key: 'orderId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(/^0x[0-9a-fA-F]{64}$/)'] }, description: 'DLN order ID as 0x-prefixed 64-character hex string' }
            ],
            tests: [
                { _description: 'Get order details by ID (returns error for unknown order)', orderId: '0x0000000000000000000000000000000000000000000000000000000000000001' },
                { _description: 'Query non-existent order by ID', orderId: '0x0000000000000000000000000000000000000000000000000000000000000002' },
                { _description: 'Fetch order with zeroed ID', orderId: '0x0000000000000000000000000000000000000000000000000000000000000003' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        orderId: { type: 'string' },
                        status: { type: 'string' },
                        srcChainId: { type: 'number' },
                        dstChainId: { type: 'number' },
                        srcChainTokenIn: { type: 'object' },
                        dstChainTokenOut: { type: 'object' }
                    }
                }
            }
        },
        getOrderStatus: {
            method: 'GET',
            path: '/dln/order/:orderId/status',
            description: 'Get the fulfillment status of a DLN cross-chain order by its order ID (0x-prefixed 64-char hex).',
            parameters: [
                { position: { key: 'orderId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(/^0x[0-9a-fA-F]{64}$/)'] }, description: 'DLN order ID as 0x-prefixed 64-character hex string' }
            ],
            tests: [
                { _description: 'Get order status by ID (returns error for unknown order)', orderId: '0x0000000000000000000000000000000000000000000000000000000000000001' },
                { _description: 'Check fulfillment status for order', orderId: '0x0000000000000000000000000000000000000000000000000000000000000002' },
                { _description: 'Query order completion status', orderId: '0x0000000000000000000000000000000000000000000000000000000000000003' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        orderId: { type: 'string' },
                        status: { type: 'string' },
                        percentFilled: { type: 'number' }
                    }
                }
            }
        },
        getOrderIdsByTxHash: {
            method: 'GET',
            path: '/dln/tx/:txHash/order-ids',
            description: 'Get all DLN order IDs that were created in a specific transaction. Requires the creation transaction hash and source chain ID.',
            parameters: [
                { position: { key: 'txHash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(/^0x[0-9a-fA-F]{64}$/)'] }, description: 'Transaction hash (0x-prefixed 64-char hex) that created the bridge order' },
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] }, description: 'Source blockchain chain ID where the transaction was submitted, e.g. 1 for Ethereum' }
            ],
            tests: [
                { _description: 'Get order IDs from a tx hash on Ethereum (returns empty for unknown tx)', txHash: '0x0000000000000000000000000000000000000000000000000000000000000001', chainId: 1 },
                { _description: 'Query order IDs from tx on Polygon', txHash: '0x0000000000000000000000000000000000000000000000000000000000000002', chainId: 137 },
                { _description: 'Look up order IDs from BSC transaction', txHash: '0x0000000000000000000000000000000000000000000000000000000000000003', chainId: 56 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        orderIds: { type: 'array', items: { type: 'string' } }
                    }
                }
            }
        }
    }
}
