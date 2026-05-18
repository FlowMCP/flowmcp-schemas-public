// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'honeypot',
    name: 'Honeypot Detector',
    description: 'Detect honeypot token contracts using the honeypot.is API — checks buy/sell tax, liquidity locks, and contract risks for any EVM token address.',
    version: '4.0.0',
    docs: ['https://honeypot.is'],
    tags: ['production', 'security', 'token', 'validation', 'cacheTtlFrequent'],
    root: 'https://api.honeypot.is/v2',
    tools: {
        check: {
            method: 'GET',
            path: '/IsHoneypot',
            description: 'Checks if a token address is a honeypot on Ethereum, BSC, or Base. Returns buy/sell tax, risk level, and contract audit data. Required: EVM address.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{40}$)'] } }
            ],
            tests: [
                { _description: 'Check USDC token', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
                { _description: 'Check USDT token', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
                { _description: 'Check WETH token', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Honeypot detection result with tax simulation, contract audit, and risk assessment',
                    properties: {
                        token: { type: 'object', description: 'Target token metadata', properties: { name: { type: 'string', description: 'Token name (e.g. USD Coin)' }, symbol: { type: 'string', description: 'Token symbol (e.g. USDC)' }, decimals: { type: 'number', description: 'Token decimals (e.g. 18, 6)' }, address: { type: 'string', description: 'Token contract address' }, totalHolders: { type: 'number', description: 'Total number of token holders' } } },
                        withToken: { type: 'object', description: 'Paired token used for simulation (usually WETH or stablecoin)', properties: { name: { type: 'string', description: 'Paired token name' }, symbol: { type: 'string', description: 'Paired token symbol' }, decimals: { type: 'number', description: 'Paired token decimals' }, address: { type: 'string', description: 'Paired token contract address' }, totalHolders: { type: 'number', description: 'Paired token holder count' } } },
                        summary: { type: 'object', description: 'Overall risk assessment summary', properties: { risk: { type: 'string', description: 'Risk level label (low, medium, high, very_high)' }, riskLevel: { type: 'number', description: 'Numeric risk level (0=safe, higher=riskier)' }, flags: { type: 'array', items: { type: 'string' }, description: 'Specific risk flags detected' } } },
                        simulationSuccess: { type: 'boolean', description: 'Whether buy/sell simulation completed successfully' },
                        honeypotResult: { type: 'object', description: 'Core honeypot detection result', properties: { isHoneypot: { type: 'boolean', description: 'True if token is detected as a honeypot (cannot sell)' } } },
                        simulationResult: { type: 'object', description: 'Tax and gas simulation results from buy/sell test', properties: { buyTax: { type: 'number', description: 'Percentage tax on buy transactions (0-100)' }, sellTax: { type: 'number', description: 'Percentage tax on sell transactions (0-100)' }, transferTax: { type: 'number', description: 'Percentage tax on transfer transactions (0-100)' }, buyGas: { type: 'string', description: 'Gas used for buy transaction' }, sellGas: { type: 'string', description: 'Gas used for sell transaction' } } },
                        flags: { type: 'array', items: { type: 'string' }, description: 'Detailed list of all detected risk flags' },
                        contractCode: { type: 'object', description: 'Smart contract source code audit', properties: { openSource: { type: 'boolean', description: 'Whether contract source code is verified/open' }, rootOpenSource: { type: 'boolean', description: 'Whether root implementation is open source' }, isProxy: { type: 'boolean', description: 'Whether contract uses proxy pattern (upgradeable)' }, hasProxyCalls: { type: 'boolean', description: 'Whether contract makes delegatecall to other contracts' } } },
                        chain: { type: 'object', description: 'Blockchain network information', properties: { id: { type: 'string', description: 'Chain ID (e.g. 1 for Ethereum)' }, name: { type: 'string', description: 'Chain name (e.g. Ethereum)' }, shortName: { type: 'string', description: 'Short chain name (e.g. eth)' }, currency: { type: 'string', description: 'Native currency symbol (e.g. ETH)' } } },
                        router: { type: 'string', description: 'DEX router address used for simulation' },
                        pair: { type: 'object', description: 'Trading pair information with liquidity data', properties: { pair: { type: 'object', description: 'Pair contract details', properties: { name: { type: 'string', description: 'Pair name (e.g. USDC/WETH)' }, address: { type: 'string', description: 'Pair contract address' }, token0: { type: 'string', description: 'First token address in the pair' }, token1: { type: 'string', description: 'Second token address in the pair' }, type: { type: 'string', description: 'DEX type (e.g. UniswapV2, UniswapV3)' } } }, chainId: { type: 'string', description: 'Chain ID for this pair' }, reserves0: { type: 'string', description: 'Reserve amount of token0 in the pool' }, reserves1: { type: 'string', description: 'Reserve amount of token1 in the pool' }, liquidity: { type: 'number', description: 'Total liquidity in USD' }, router: { type: 'string', description: 'DEX router contract address' }, createdAtTimestamp: { type: 'string', description: 'Pair creation timestamp' }, creationTxHash: { type: 'string', description: 'Pair creation transaction hash' } } },
                        pairAddress: { type: 'string', description: 'Address of the primary trading pair contract' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    check: {
        postRequest: async ( { response, struct, payload } ) => {
            const data = response || {};
            const isHoneypot = data?.honeypotResult?.isHoneypot ?? false;
            const tokenName = data?.token?.name || "Unknown";
            const risk = data?.summary?.risk || "unknown";
            const buyTax = data?.simulationResult?.buyTax ?? "N/A";
            const sellTax = data?.simulationResult?.sellTax ?? "N/A";
            const transferTax = data?.simulationResult?.transferTax ?? "N/A";
            const openSource = data?.contractCode?.openSource ?? "Unknown";

            response = {
            tokenName,
            isHoneypot,
            risk,
            buyTax,
            sellTax,
            transferTax,
            openSource
            };

            return { response }
        }
    }
} )
