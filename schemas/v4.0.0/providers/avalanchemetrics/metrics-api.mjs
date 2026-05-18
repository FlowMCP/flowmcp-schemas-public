// Migrated from v1.2.0 -> v2.0.0
// Category: simple
// Namespace: "avalancheMetrics" -> "avalanchemetrics"

export const main = {
    namespace: 'avalanchemetrics',
    name: 'Avalanche Metrics API',
    description: 'Avalanche Metrics API for on-chain analytics including staking, throughput, gas, TPS, and validator metrics',
    version: '4.0.0',
    docs: ['https://metrics.avax.network'],
    tags: ['blockchain', 'avalanche', 'metrics', 'staking', 'analytics', 'cacheTtlDaily'],
    root: 'https://metrics.avax.network/v2',
    tools: {
        listChains: {
            method: 'GET',
            path: '/chains',
            description: 'Get a list of all supported EVM blockchains with their chain IDs. via avalancheMetrics.',
            parameters: [],
            tests: [
                { _description: 'List supported chains' },
                { _description: 'List all available Avalanche chains' },
                { _description: 'Verify chain listing endpoint' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        chains: { type: 'array', items: { type: 'object', properties: { evmChainId: { type: 'number' }, subnetId: { type: 'string' }, chainName: { type: 'string' }, blockchainId: { type: 'string' }, network: { type: 'string' } } } }
                    }
                }
            },
        },
        getChainInfo: {
            method: 'GET',
            path: '/chains/:chainId',
            description: 'Get chain information for a specific supported blockchain via avalancheMetrics -- query by chainId.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['default("43114")'] }, description: 'EVM chain ID of the Avalanche blockchain (e.g. 43114 for C-Chain, 43113 for Fuji)' }
            ],
            tests: [
                { _description: 'Get C-Chain info', chainId: '43114' },
                { _description: 'Get Fuji testnet info', chainId: '43113' },
                { _description: 'Get C-Chain info with default', }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        evmChainId: { type: 'number' },
                        subnetId: { type: 'string' },
                        chainName: { type: 'string' },
                        blockchainId: { type: 'string' },
                        network: { type: 'string' }
                    }
                }
            },
        },
        getChainMetrics: {
            method: 'GET',
            path: '/chains/:chainId/metrics/:metric',
            description: 'Get metrics for an EVM chain (activeAddresses, activeSenders, cumulativeTxCount, cumulativeAddresses, cumulativeContracts, gasUsed, txCount, deployedContracts, etc.).',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['default("43114")'] }, description: 'EVM chain ID of the Avalanche blockchain (e.g. 43114 for C-Chain)' },
                { position: { key: 'metric', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Metric name to query (e.g. gasUsed, activeAddresses, txCount, deployedContracts)' },
                { position: { key: 'startTimestamp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Start of time range as Unix timestamp in seconds (e.g. 1704067200)' },
                { position: { key: 'endTimestamp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'End of time range as Unix timestamp in seconds (e.g. 1706745600)' },
                { position: { key: 'timeInterval', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Aggregation interval for data points (e.g. daily, weekly, monthly)' }
            ],
            tests: [
                { _description: 'Get C-Chain gas usage', chainId: '43114', metric: 'gasUsed' },
                { _description: 'Get C-Chain active addresses', chainId: '43114', metric: 'activeAddresses' },
                { _description: 'Get C-Chain transaction count', chainId: '43114', metric: 'txCount' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        results: { type: 'array', items: { type: 'object', properties: { value: { type: 'number' }, timestamp: { type: 'number' } } } },
                        nextPageToken: { type: 'string' }
                    }
                }
            },
        },
        getRollingWindowMetrics: {
            method: 'GET',
            path: '/chains/:chainId/rollingWindowMetrics/:metric',
            description: 'Get rolling window metrics for an EVM chain for short-term and long-term trend analysis.',
            parameters: [
                { position: { key: 'chainId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['default("43114")'] }, description: 'EVM chain ID of the Avalanche blockchain (e.g. 43114 for C-Chain)' },
                { position: { key: 'metric', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Metric name to query rolling windows for (e.g. gasUsed, txCount)' },
                { position: { key: 'startTimestamp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Start of time range as Unix timestamp in seconds' },
                { position: { key: 'endTimestamp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'End of time range as Unix timestamp in seconds' }
            ],
            tests: [
                { _description: 'Get rolling gas usage', chainId: '43114', metric: 'gasUsed' },
                { _description: 'Get rolling tx count', chainId: '43114', metric: 'txCount' },
                { _description: 'Get rolling active addresses', chainId: '43114', metric: 'activeAddresses' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        result: { type: 'object', properties: { lastHour: { type: 'number' }, lastDay: { type: 'number' }, lastWeek: { type: 'number' }, lastMonth: { type: 'number' }, last90Days: { type: 'number' }, lastYear: { type: 'number' }, allTime: { type: 'number' } } }
                    }
                }
            },
        },
        getStakingMetrics: {
            method: 'GET',
            path: '/networks/:network/metrics/:metric',
            description: 'Get staking metrics for a given network/subnet including total stake weight and delegation data.',
            parameters: [
                { position: { key: 'network', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['default("mainnet")'] }, description: 'Network identifier (e.g. mainnet, fuji)' },
                { position: { key: 'metric', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Staking metric name (e.g. delegatorCount, totalStakeWeight, validatorCount)' },
                { position: { key: 'startTimestamp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Start of time range as Unix timestamp in seconds' },
                { position: { key: 'endTimestamp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'End of time range as Unix timestamp in seconds' }
            ],
            tests: [
                { _description: 'Get mainnet delegator count', network: 'mainnet', metric: 'delegatorCount' },
                { _description: 'Get mainnet total stake weight', network: 'mainnet', metric: 'totalStakeWeight' },
                { _description: 'Get mainnet validator count', network: 'mainnet', metric: 'validatorCount' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        results: { type: 'array', items: { type: 'object', properties: { value: { type: 'number' }, timestamp: { type: 'number' } } } },
                        nextPageToken: { type: 'string' }
                    }
                }
            },
        },
        getValidatorMetrics: {
            method: 'GET',
            path: '/validators/metrics/:metric',
            description: 'Get metrics for all L1 validators including uptime, stake weight, and delegation info.',
            parameters: [
                { position: { key: 'metric', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Validator metric name (e.g. totalValidatorFeesDaily, uptimePercentage)' },
                { position: { key: 'startTimestamp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Start of time range as Unix timestamp in seconds' },
                { position: { key: 'endTimestamp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'End of time range as Unix timestamp in seconds' }
            ],
            tests: [
                { _description: 'Get total validator fees daily', metric: 'totalValidatorFeesDaily' },
                { _description: 'Get validator uptime percentage', metric: 'uptimePercentage' },
                { _description: 'Get active validators count', metric: 'activeValidators' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        results: { type: 'array', items: { type: 'object', properties: { timestamp: { type: 'number' }, value: { type: 'number' } } } }
                    }
                }
            },
        },
        getICMSummary: {
            method: 'GET',
            path: '/icm/summary',
            description: 'Get Interchain Messaging (ICM) summary metrics including message count and volume. Requires at least one filter.',
            parameters: [
                { position: { key: 'network', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default("mainnet")'] }, description: 'Network identifier to filter ICM messages (e.g. mainnet, fuji)' }
            ],
            tests: [
                { _description: 'Get ICM summary for mainnet', network: 'mainnet' },
                { _description: 'Get ICM summary for fuji', network: 'fuji' },
                { _description: 'Get ICM summary with default network', network: 'mainnet' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        result: { type: 'array', items: { type: 'object', properties: { lastHour: { type: 'number' }, lastDay: { type: 'number' }, lastWeek: { type: 'number' }, lastMonth: { type: 'number' }, last90Days: { type: 'number' }, lastYear: { type: 'number' }, allTime: { type: 'number' } } } }
                    }
                }
            },
        },
        getICMTimeseries: {
            method: 'GET',
            path: '/icm/timeseries',
            description: 'Get Interchain Messaging (ICM) timeseries metrics for cross-chain message analytics. Requires at least one filter.',
            parameters: [
                { position: { key: 'network', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default("mainnet")'] }, description: 'Network identifier to filter ICM timeseries (e.g. mainnet, fuji)' },
                { position: { key: 'startTimestamp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Start of time range as Unix timestamp in seconds' },
                { position: { key: 'endTimestamp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'End of time range as Unix timestamp in seconds' }
            ],
            tests: [
                { _description: 'Get ICM timeseries for mainnet', network: 'mainnet' },
                { _description: 'Get ICM timeseries for fuji', network: 'fuji' },
                { _description: 'Get ICM timeseries with default network', network: 'mainnet' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        results: { type: 'array', items: { type: 'object', properties: { value: { type: 'number' }, timestamp: { type: 'number' } } } },
                        nextPageToken: { type: 'string' }
                    }
                }
            },
        }
    }
}
