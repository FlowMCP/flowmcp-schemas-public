// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Module-level code: 7 lines

export const main = {
    namespace: 'simdune',
    name: 'Sim by Dune - SVM Transactions',
    description: 'Retrieve detailed transaction history for SVM addresses including block information, ordered by descending block time.',
    version: '4.0.0',
    docs: ['https://docs.sim.dune.com/svm/transactions'],
    tags: ['production', 'transactions', 'analytics', 'history', 'svm', 'solana', 'cacheTtlDaily'],
    root: 'https://api.sim.dune.com/beta',
    requiredServerParams: ['DUNE_SIM_API_KEY'],
    headers: {
        'X-Sim-Api-Key': '{{DUNE_SIM_API_KEY}}'
    },
    tools: {
        getTransactionsSVM: {
            method: 'GET',
            path: '/svm/transactions/:walletAddress',
            description: 'Get detailed transaction history for an SVM address, ordered by descending block time with pagination support.',
            parameters: [
                { position: { key: 'walletAddress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['regex(^[1-9A-HJ-NP-Za-km-z]{32,44}$)'] } },
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(SOLANA)', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(1000)'] } }
            ],
            tests: [
                {
                    _description: 'Get transactions on Solana with default limit',
                    walletAddress: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
                    chainName: 'SOLANA',
                    limit: '10'
                },
                {
                    _description: 'Get recent transactions on Solana with small limit',
                    walletAddress: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
                    chainName: 'SOLANA',
                    limit: '5'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        transactions: { type: 'array', items: { type: 'string' } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {

    const SUPPORTED_CHAINS = [
        { alias: "SOLANA", id: "solana", name: "solana" }
    ]
    let chainAliasEnum
    chainAliasEnum = 'enum('
    chainAliasEnum += SUPPORTED_CHAINS.map( ( { alias } ) => alias ).join( ',' )
    chainAliasEnum += ')'

    return {
        getTransactionsSVM: {
            preRequest: async ( { struct, payload } ) => {
                const { chainName } = payload
                const chainValue = SUPPORTED_CHAINS.find( ( { alias } ) => alias === chainName )?.id
                // For transactions API, we don't actually need to add chains parameter
                // since only Solana is supported, but we keep it for consistency
                // The API will work without the chains parameter for Solana-only

                return { struct }
            }
        }
    }
}
