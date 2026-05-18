// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "safeGlobal" -> "safeglobal"

export const main = {
    namespace: 'safeglobal',
    name: 'Safe Transaction Service',
    description: 'Query Gnosis Safe multisig wallets including balances, transactions, owners and modules on Ethereum mainnet',
    version: '4.0.0',
    docs: ['https://docs.safe.global/core-api/transaction-service-overview', 'https://safe.global/'],
    tags: ['ethereum', 'multisig', 'defi', 'wallet', 'cacheTtlFrequent'],
    root: 'https://safe-transaction-mainnet.safe.global/api/v1',
    tools: {
        getSafeInfo: {
            method: 'GET',
            path: '/safes/:address/',
            description: 'Get Safe multisig wallet information including owners, threshold, nonce and modules. Use getSafeBalances first to find valid IDs',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['length(42)'] } }
            ],
            tests: [
                { _description: 'Get Safe info', address: '0x4F2083f5fBede34C2714aFfb3105539775f7FE64' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        address: { type: 'string' },
                        nonce: { type: 'string' },
                        threshold: { type: 'number' },
                        owners: { type: 'array', items: { type: 'string' } },
                        masterCopy: { type: 'string' },
                        modules: { type: 'array', items: { type: 'string' } },
                        fallbackHandler: { type: 'string' },
                        guard: { type: 'string' },
                        moduleGuard: { type: 'string' },
                        version: { type: 'string' }
                    }
                }
            },
        },
        getSafeBalances: {
            method: 'GET',
            path: '/safes/:address/balances/',
            description: 'Get token balances of a Safe multisig wallet including ETH and ERC-20 tokens. Required: address. Optional filters: trusted, exclude_spam.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['length(42)'] } },
                { position: { key: 'trusted', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['default(true)', 'optional()'] } },
                { position: { key: 'exclude_spam', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['default(true)', 'optional()'] } }
            ],
            tests: [
                {
                    _description: 'Get Safe balances',
                    address: '0x4F2083f5fBede34C2714aFfb3105539775f7FE64',
                    trusted: true,
                    exclude_spam: true
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            tokenAddress: { type: 'string', nullable: true },
                            token: { type: 'string', nullable: true },
                            balance: { type: 'string' }
                        }
                    }
                }
            },
        },
        getMultisigTransactions: {
            method: 'GET',
            path: '/safes/:address/multisig-transactions/',
            description: 'Get multisig transactions of a Safe wallet with execution status and confirmations',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['length(42)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(20)', 'optional()'] } },
                { position: { key: 'executed', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'nonce__gte', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get recent transactions', address: '0x4F2083f5fBede34C2714aFfb3105539775f7FE64', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number' },
                        next: { type: 'string' },
                        previous: { type: 'string', nullable: true },
                        results: { type: 'array', items: { type: 'object', properties: { safe: { type: 'string' }, to: { type: 'string' }, value: { type: 'string' }, data: { type: 'string' }, operation: { type: 'number' }, gasToken: { type: 'string' }, safeTxGas: { type: 'number' }, baseGas: { type: 'number' }, gasPrice: { type: 'string' }, refundReceiver: { type: 'string' }, nonce: { type: 'number' }, executionDate: { type: 'string' }, submissionDate: { type: 'string' }, modified: { type: 'string' }, blockNumber: { type: 'number' }, transactionHash: { type: 'string' }, safeTxHash: { type: 'string' }, proposer: { type: 'string', nullable: true }, proposedByDelegate: { type: 'string', nullable: true }, executor: { type: 'string' }, isExecuted: { type: 'boolean' }, isSuccessful: { type: 'boolean' }, ethGasPrice: { type: 'string' }, maxFeePerGas: { type: 'string' }, maxPriorityFeePerGas: { type: 'string' }, gasUsed: { type: 'number' }, fee: { type: 'string' }, origin: { type: 'string' }, dataDecoded: { type: 'object' }, confirmationsRequired: { type: 'number' }, confirmations: { type: 'array', items: { type: 'object' } }, trusted: { type: 'boolean' }, signatures: { type: 'string' } } } },
                        countUniqueNonce: { type: 'number' }
                    }
                }
            },
        },
        getIncomingTransfers: {
            method: 'GET',
            path: '/safes/:address/incoming-transfers/',
            description: 'Get incoming token transfers to a Safe wallet via safeGlobal — query by address. Supports limit filters.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['length(42)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(20)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get incoming transfers', address: '0x4F2083f5fBede34C2714aFfb3105539775f7FE64', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number' },
                        next: { type: 'string' },
                        previous: { type: 'string', nullable: true },
                        results: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, executionDate: { type: 'string' }, blockNumber: { type: 'number' }, transactionHash: { type: 'string' }, to: { type: 'string' }, value: { type: 'string' }, tokenId: { type: 'string', nullable: true }, tokenAddress: { type: 'string' }, transferId: { type: 'string' }, tokenInfo: { type: 'object' }, from: { type: 'string' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getSafeBalances: {
        postRequest: async ( { response, struct, payload } ) => {
            try {
            const raw = response
            if( !Array.isArray( raw ) ) {
            return { response }}

            const balances = raw
            .filter( ( b ) => {
            const balance = BigInt( b.balance || '0' )

            return balance > 0n
            } )
            .map( ( b ) => {
            const token = b.token || {}
            const decimals = token.decimals || 18
            const rawBalance = b.balance || '0'

            const result = {
            tokenAddress: b.tokenAddress || 'native',
            name: token.name || 'Ether',
            symbol: token.symbol || 'ETH',
            decimals,
            rawBalance
            }

            return result
            } )

            response = {
            source: "Safe Transaction Service",
            tokenCount: balances.length,
            balances
            }
            } catch( error ) {
            struct.status = false
            struct.messages.push( `Error formatting balances: ${error.message}` )
            }

            return { response }
        }
    },
    getMultisigTransactions: {
        postRequest: async ( { response, struct, payload } ) => {
            try {
            const raw = response
            if( !raw || !raw.results ) {
            return { response }}

            const transactions = raw.results
            .map( ( tx ) => {
            const result = {
            safeTxHash: tx.safeTxHash,
            to: tx.to,
            value: tx.value,
            nonce: tx.nonce,
            isExecuted: tx.isExecuted,
            isSuccessful: tx.isSuccessful,
            executionDate: tx.executionDate,
            submissionDate: tx.submissionDate,
            confirmationsRequired: tx.confirmationsRequired,
            confirmations: tx.confirmations ? tx.confirmations.length : 0,
            transactionHash: tx.transactionHash,
            dataDecoded: tx.dataDecoded
            }

            return result
            } )

            response = {
            source: "Safe Transaction Service",
            totalCount: raw.count,
            transactionCount: transactions.length,
            transactions
            }
            } catch( error ) {
            struct.status = false
            struct.messages.push( `Error formatting transactions: ${error.message}` )
            }

            return { response }
        }
    }
} )
