// Curve Finance — Analytics & Gauges
// Free public API, no auth required

export const main = {
    namespace: 'curve',
    name: 'Curve Finance Analytics',
    description: 'Curve Finance analytics — 24h trading volumes, base APYs, gauge CRV rewards, lending vault rates, gas prices, and weekly protocol fees. Use getVolumes for per-pool volume and APY data, getTotalVolume for aggregate chain volume, and getAllGauges for CRV reward details. Pool addresses from getVolumes correspond to gauge pools in getAllGauges.',
    version: '4.0.0',
    docs: ['https://api.curve.finance/v1/documentation'],
    tags: ['defi', 'dex', 'analytics', 'volume', 'apy', 'lending', 'cacheTtlFrequent'],
    root: 'https://api.curve.finance/v1',
    requiredServerParams: [],
    tools: {
        getVolumes: {
            method: 'GET',
            path: '/getVolumes/:blockchainId',
            description: 'Get 24h trading volumes and base APYs per pool on a chain. Preferred endpoint for volume and APY data. Pool addresses can be cross-referenced with getAllGauges for CRV reward info.',
            parameters: [
                { position: { key: 'blockchainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(ethereum,polygon,arbitrum,base,optimism,fantom)'], description: 'Blockchain network to query volumes for' } }
            ],
            tests: [
                { _description: 'Get volumes on Ethereum', blockchainId: 'ethereum' },
                { _description: 'Get volumes on Arbitrum', blockchainId: 'arbitrum' },
                { _description: 'Get volumes on Polygon', blockchainId: 'polygon' }
            ],
            output: {
                description: 'Per-pool 24h trading volumes and base APY data for all Curve pools on the specified chain',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Curve API response wrapper with success flag, pool volume data, and generation timestamp',
                    properties: {
                        success: { type: 'boolean', description: 'Whether the API request was successful' },
                        data: {
                            type: 'object',
                            description: 'Volume and APY data container with pool array and aggregate totals',
                            properties: {
                                pools: { type: 'array', description: 'Array of pool objects with individual volume and APY metrics', items: { type: 'object', properties: { address: { type: 'string', description: 'Pool contract address (0x-prefixed). Cross-reference with getAllGauges.' }, type: { type: 'string', description: 'Pool type (e.g. stable, crypto, factory)' }, volumeUSD: { type: 'number', description: '24-hour trading volume in USD for this pool' }, latestDailyApyPcent: { type: 'number', description: 'Latest daily base APY as a percentage (annualized from 24h fees)' }, latestWeeklyApyPcent: { type: 'number', description: 'Latest weekly base APY as a percentage (annualized from 7d fees)' }, includedApyPcentFromLsts: { type: 'number', description: 'Additional APY percentage from liquid staking token yields included in the pool' }, virtualPrice: { type: 'number', description: 'Pool virtual price — tracks LP token value growth from fees over time' } } } },
                                totalVolumes: { type: 'object', description: 'Aggregate volume totals broken down by pool type (e.g. stable, crypto)' }
                            }
                        },
                        generatedTimeMs: { type: 'number', description: 'Unix timestamp in milliseconds when this data was generated (for cache freshness)' }
                    }
                }
            }
        },
        getTotalVolume: {
            method: 'GET',
            path: '/getAllPoolsVolume/:blockchainId',
            description: 'Get the total 24h trading volume and crypto pool share percentage for a chain. Use getVolumes instead if you need per-pool breakdown.',
            parameters: [
                { position: { key: 'blockchainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(ethereum,polygon,arbitrum,optimism,base,bsc,avalanche,fantom,celo,harmony,aurora,kava,moonbeam,fraxtal,mantle,xdai,zkevm,zksync,x-layer,sonic,hyperliquid)'], description: 'Blockchain network to query total volume for' } }
            ],
            tests: [
                { _description: 'Get total volume on Ethereum', blockchainId: 'ethereum' },
                { _description: 'Get total volume on Arbitrum', blockchainId: 'arbitrum' },
                { _description: 'Get total volume on Base', blockchainId: 'base' }
            ],
            output: {
                description: 'Aggregate 24h trading volume for all Curve pools on the specified chain',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Curve API response with aggregate volume and crypto pool share',
                    properties: {
                        success: { type: 'boolean', description: 'Whether the API request was successful' },
                        data: {
                            type: 'object',
                            description: 'Aggregate volume data for the chain',
                            properties: {
                                totalVolume: { type: 'number', description: 'Total 24-hour trading volume across all Curve pools on this chain in USD' },
                                cryptoShare: { type: 'number', description: 'Percentage of total volume from crypto pools (vs stable pools), as decimal (e.g. 0.65 = 65%)' }
                            }
                        },
                        generatedTimeMs: { type: 'number', description: 'Unix timestamp in milliseconds when this data was generated' }
                    }
                }
            }
        },
        getAllGauges: {
            method: 'GET',
            path: '/getAllGauges',
            description: 'Get all Curve gauges across all chains with CRV APY, gauge data, pool addresses, and reward info. Pool addresses correspond to pools in getVolumes. No parameters needed.',
            parameters: [],
            tests: [
                { _description: 'Get all gauges' },
                { _description: 'Fetch complete gauge data across chains' },
                { _description: 'Retrieve all Curve gauge information' }
            ],
            output: {
                description: 'All Curve gauges across chains with CRV reward APYs, gauge weights, and associated pool details',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Curve API response with gauge data keyed by gauge name/address',
                    properties: {
                        success: { type: 'boolean', description: 'Whether the API request was successful' },
                        data: { type: 'object', description: 'Map of gauge identifiers to gauge objects. Each gauge contains pool address, CRV APY, gauge weight, side chain info, and extra reward tokens.' },
                        generatedTimeMs: { type: 'number', description: 'Unix timestamp in milliseconds when this data was generated' }
                    }
                }
            }
        },
        getLendingVaults: {
            method: 'GET',
            path: '/getLendingVaults/all/:lendingBlockchainId',
            description: 'Get Curve lending vaults on a chain with borrow/lend APYs, utilization, collateral info, and TVL.',
            parameters: [
                { position: { key: 'lendingBlockchainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum()', options: ['values(ethereum,arbitrum,optimism,fraxtal,sonic)'], description: 'Blockchain network to query lending vaults for' } }
            ],
            tests: [
                { _description: 'Get lending vaults on Ethereum', lendingBlockchainId: 'ethereum' },
                { _description: 'Get lending vaults on Arbitrum', lendingBlockchainId: 'arbitrum' },
                { _description: 'Get lending vaults on Optimism', lendingBlockchainId: 'optimism' }
            ],
            output: {
                description: 'Curve lending vaults with borrow/lend APYs, utilization rates, and collateral details',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Curve API response with lending vault data array',
                    properties: {
                        success: { type: 'boolean', description: 'Whether the API request was successful' },
                        data: {
                            type: 'object',
                            description: 'Lending vault data container',
                            properties: {
                                lendingVaultData: { type: 'array', description: 'Array of lending vault objects with rates, collateral, and TVL info', items: { type: 'object', properties: { id: { type: 'string', description: 'Unique vault identifier string' }, name: { type: 'string', description: 'Vault display name (e.g. crvUSD/WETH)' }, address: { type: 'string', description: 'Vault contract address (0x-prefixed)' }, controllerAddress: { type: 'string', description: 'Controller contract address managing the vault logic' }, ammAddress: { type: 'string', description: 'AMM contract address for the lending pool' }, rates: { type: 'object', description: 'Current borrow and lend APY rates, utilization ratio, and fee structure' } } } }
                            }
                        },
                        generatedTimeMs: { type: 'number', description: 'Unix timestamp in milliseconds when this data was generated' }
                    }
                }
            }
        },
        getWeeklyFees: {
            method: 'GET',
            path: '/getWeeklyFees',
            description: 'Get historical weekly protocol fee data for Curve Finance. Returns a time series of weekly fee totals.',
            parameters: [],
            tests: [
                { _description: 'Get weekly fee history' },
                { _description: 'Fetch protocol fee time series' },
                { _description: 'Retrieve weekly fee table data' }
            ],
            output: {
                description: 'Historical weekly protocol fee time series for Curve Finance',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Curve API response with weekly fee history table',
                    properties: {
                        success: { type: 'boolean', description: 'Whether the API request was successful' },
                        data: {
                            type: 'object',
                            description: 'Weekly fee data container',
                            properties: {
                                weeklyFeesTable: { type: 'array', description: 'Array of weekly fee entries ordered chronologically', items: { type: 'object', properties: { date: { type: 'string', description: 'Week start date in human-readable format' }, ts: { type: 'number', description: 'Unix timestamp for the week start' }, rawFees: { type: 'number', description: 'Total protocol fees collected during this week in USD' } } } }
                            }
                        },
                        generatedTimeMs: { type: 'number', description: 'Unix timestamp in milliseconds when this data was generated' }
                    }
                }
            }
        },
        getGas: {
            method: 'GET',
            path: '/getGas',
            description: 'Get current Ethereum gas prices via Blocknative — rapid, fast, standard, slow, and EIP-1559 estimates.',
            parameters: [],
            tests: [
                { _description: 'Get current gas prices' },
                { _description: 'Fetch Ethereum gas price estimates' },
                { _description: 'Retrieve EIP-1559 gas data' }
            ],
            output: {
                description: 'Current Ethereum gas price estimates for different speed tiers and EIP-1559 parameters',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Curve API response with legacy and EIP-1559 gas price estimates',
                    properties: {
                        success: { type: 'boolean', description: 'Whether the API request was successful' },
                        data: {
                            type: 'object',
                            description: 'Gas price data with both legacy and EIP-1559 estimates',
                            properties: {
                                gas: { type: 'object', description: 'Legacy gas price estimates in gwei for different speed tiers', properties: { rapid: { type: 'number', description: 'Rapid confirmation gas price in gwei (typically < 15 seconds)' }, fast: { type: 'number', description: 'Fast confirmation gas price in gwei (typically < 1 minute)' }, standard: { type: 'number', description: 'Standard confirmation gas price in gwei (typically < 3 minutes)' }, slow: { type: 'number', description: 'Slow confirmation gas price in gwei (typically < 10 minutes)' } } },
                                eip1559Gas: { type: 'object', description: 'EIP-1559 gas price components for Type 2 transactions', properties: { base: { type: 'number', description: 'Current base fee in gwei (set by the network, burned)' }, prio: { type: 'array', description: 'Array of priority fee (tip) estimates in gwei for different speed tiers [slow, standard, fast, rapid]', items: { type: 'number' } }, max: { type: 'array', description: 'Array of max fee per gas estimates in gwei (base + priority) for different speed tiers', items: { type: 'number' } } } }
                            }
                        },
                        generatedTimeMs: { type: 'number', description: 'Unix timestamp in milliseconds when this data was generated' }
                    }
                }
            }
        }
    }
}
