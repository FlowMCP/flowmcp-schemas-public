export const main = {
    namespace: 'zerox',
    name: '0x Swap API',
    description: 'DEX aggregator for EVM token swaps via 0x Protocol v2. Provides indicative prices and executable quotes across 100+ liquidity sources on 20+ chains using Allowance Holder and Permit2 approval flows.',
    docs: ['https://0x.org/docs/api'],
    tags: ['defi', 'dex', 'swap', 'aggregator', 'cacheTtlRealtime'],
    version: '4.0.0',
    root: 'https://api.0x.org',
    requiredServerParams: ['ZEROX_API_KEY'],
    headers: {
        '0x-api-key': '{{ZEROX_API_KEY}}',
        '0x-version': 'v2'
    },
    tools: {
        getPrice: {
            method: 'GET',
            description: 'Get an indicative swap price using Allowance Holder pattern. Returns estimated output amount, gas, fees, and routing without executable transaction data.',
            path: '/swap/allowance-holder/price',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'sellToken', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'buyToken', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'sellAmount', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'taker', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'slippageBps', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(0)', 'max(10000)', 'default(100)'] } },
                { position: { key: 'excludedSources', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Price for selling 1 WETH to USDC on Ethereum', chainId: 1, sellToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', buyToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', sellAmount: '1000000000000000000' },
                { _description: 'Price for selling 1 USDC to WETH on Polygon', chainId: 137, sellToken: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', buyToken: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', sellAmount: '1000000' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Indicative swap price from 0x Allowance Holder',
                schema: { type: 'object', properties: { buyAmount: { type: 'string', description: 'Estimated buy amount in smallest unit' }, sellAmount: { type: 'string', description: 'Sell amount in smallest unit' }, gasEstimate: { type: 'string', description: 'Estimated gas' }, route: { type: 'object', description: 'Routing details through liquidity sources' }, fees: { type: 'object', description: 'Fee breakdown' } } }
            },
        },
        getQuote: {
            method: 'GET',
            description: 'Get a firm swap quote using Allowance Holder pattern. Returns executable unsigned transaction data including calldata, gas estimate, and routing details.',
            path: '/swap/allowance-holder/quote',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'sellToken', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'buyToken', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'sellAmount', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'taker', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'slippageBps', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(0)', 'max(10000)', 'default(100)'] } },
                { position: { key: 'excludedSources', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Quote for selling 1 WETH to USDC on Ethereum', chainId: 1, sellToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', buyToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', sellAmount: '1000000000000000000', taker: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
                { _description: 'Quote for selling 1 USDC to WETH on Polygon', chainId: 137, sellToken: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', buyToken: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', sellAmount: '1000000', taker: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Firm swap quote with executable unsigned transaction data',
                schema: { type: 'object', properties: { buyAmount: { type: 'string', description: 'Guaranteed buy amount' }, sellAmount: { type: 'string', description: 'Sell amount' }, transaction: { type: 'object', description: 'Unsigned transaction data including to, data, gas, value' }, route: { type: 'object', description: 'Routing through liquidity sources' } } }
            },
        },
        getPermitPrice: {
            method: 'GET',
            description: 'Get an indicative swap price using Permit2 approval flow. Same pricing as Allowance Holder but uses Permit2 for gasless token approvals with time-limited signatures.',
            path: '/swap/permit2/price',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'sellToken', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'buyToken', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'sellAmount', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'taker', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'slippageBps', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(0)', 'max(10000)', 'default(100)'] } },
                { position: { key: 'excludedSources', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Permit2 price for selling 1 WETH to USDC on Ethereum', chainId: 1, sellToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', buyToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', sellAmount: '1000000000000000000' },
                { _description: 'Permit2 price for selling USDC to WETH on Base', chainId: 8453, sellToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', buyToken: '0x4200000000000000000000000000000000000006', sellAmount: '1000000' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Indicative swap price using Permit2 approval flow',
                schema: { type: 'object', properties: { buyAmount: { type: 'string', description: 'Estimated buy amount' }, sellAmount: { type: 'string', description: 'Sell amount' }, gasEstimate: { type: 'string', description: 'Estimated gas' }, route: { type: 'object', description: 'Routing details' } } }
            },
        },
        getPermitQuote: {
            method: 'GET',
            description: 'Get a firm swap quote using Permit2 approval flow. Returns transaction data and EIP-712 signature payload for gasless token approvals.',
            path: '/swap/permit2/quote',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'sellToken', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'buyToken', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'sellAmount', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'taker', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'slippageBps', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(0)', 'max(10000)', 'default(100)'] } },
                { position: { key: 'excludedSources', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Permit2 quote for selling 1 WETH to USDC on Ethereum', chainId: 1, sellToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', buyToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', sellAmount: '1000000000000000000', taker: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
                { _description: 'Permit2 quote for selling USDC to WETH on Arbitrum', chainId: 42161, sellToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', buyToken: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', sellAmount: '1000000', taker: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Firm swap quote with Permit2 EIP-712 signature payload',
                schema: { type: 'object', properties: { buyAmount: { type: 'string', description: 'Guaranteed buy amount' }, sellAmount: { type: 'string', description: 'Sell amount' }, transaction: { type: 'object', description: 'Unsigned transaction data' }, permit2: { type: 'object', description: 'EIP-712 signature payload for Permit2' } } }
            },
        }
    },
    handlers: {}
}
