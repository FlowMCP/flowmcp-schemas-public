// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'blockberry',
    name: 'Blockberry Mina Mainnet API',
    description: 'Mina blockchain data API for blocks, accounts, and ZkApps (working endpoints only)',
    version: '4.0.0',
    docs: ['https://docs.blockberry.one/', 'https://docs.blockberry.one/reference/mina-mainnet-quickstart'],
    tags: ['production', 'blockchain', 'explorer', 'mina', 'cacheTtlDaily'],
    root: 'https://api.blockberry.one/mina-mainnet/v1',
    requiredServerParams: ['BLOCKBERRY_API_KEY'],
    headers: {
        accept: 'application/json',
        'x-api-key': '{{BLOCKBERRY_API_KEY}}'
    },
    tools: {
        getDashboardInfo: {
            method: 'GET',
            path: '/info',
            description: 'Get key Mina blockchain parameters including price, supply, block height, and validator count',
            parameters: [],
            tests: [
                { _description: 'Get Mina blockchain dashboard info' },
                { _description: 'Get Mina dashboard stats (duplicate for coverage)' },
                { _description: 'Fetch Mina network overview' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        accountsCount: { type: 'number' },
                        accountsCountDay: { type: 'number' },
                        activeValidatorsCount: { type: 'number' },
                        validatorsCount: { type: 'number' },
                        txsCount: { type: 'number' },
                        zkappTxsCount: { type: 'number' },
                        blockHeight: { type: 'number' },
                        blockHeightDay: { type: 'number' },
                        paymentsCount: { type: 'number' },
                        paymentsCountDay: { type: 'number' },
                        avgFee: { type: 'number' },
                        avgFeeDay: { type: 'number' },
                        avgSnarkFee: { type: 'number' },
                        zkappsCount: { type: 'number' },
                        zkappsCountDay: { type: 'number' },
                        snarkersCount: { type: 'number' },
                        activeSnarkersCount: { type: 'number' },
                        minTxFee: { type: 'number' },
                        maxTxFee: { type: 'number' },
                        txsCountDay: { type: 'number' },
                        zkappTxsCountDay: { type: 'number' },
                        epoch: { type: 'number' },
                        slot: { type: 'number' },
                        snarkersCountDay: { type: 'number' },
                        zkAppAccountsCount: { type: 'number' },
                        tokensCount: { type: 'number' },
                        collectionsCount: { type: 'number' },
                        nftsCount: { type: 'number' }
                    }
                }
            },
        },
        getAccountByHash: {
            method: 'GET',
            path: '/accounts/{publicKeyHash}',
            description: 'Get detailed account information by public key hash via Blockberry. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'publicKeyHash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Mina account public key hash (Base58 encoded, starts with B62q)' }
            ],
            tests: [
                { _description: 'Get account details', publicKeyHash: 'B62qrAWZFqvgJbfU95t1owLAMKtsDTAGgSZzsBJYUzeQZ7Xwh9CWsEY' },
                { _description: 'Get Mina Foundation account', publicKeyHash: 'B62qobAXQBMECKGRJx6K2AyRDMPGMHEgJCVfNsvjUMqLBKTXvRMoy4W' },
                { _description: 'Get validator account info', publicKeyHash: 'B62qpge4uMq4Vv5Rvc8Gw9qSquUYd6xoW1pz7HQkMSHm6h1o7pvLPAN' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        receiptChainHash: { type: 'string', nullable: true },
                        votingFor: { type: 'string', nullable: true },
                        firstSeen: { type: 'string', nullable: true },
                        lastSeen: { type: 'string', nullable: true },
                        nonce: { type: 'string', nullable: true },
                        isVerified: { type: 'boolean', nullable: true },
                        accountName: { type: 'number', nullable: true },
                        accountAddress: { type: 'number', nullable: true },
                        accountImg: { type: 'number', nullable: true },
                        isNotActivated: { type: 'boolean', nullable: true },
                        balance: { type: 'number', nullable: true },
                        website: { type: 'string', nullable: true },
                        socialDiscord: { type: 'string', nullable: true },
                        discordNicknames: { type: 'string', nullable: true },
                        socialTelegram: { type: 'string', nullable: true },
                        socialTwitter: { type: 'string', nullable: true },
                        socialEmail: { type: 'string', nullable: true },
                        socialGitHub: { type: 'string', nullable: true },
                        description: { type: 'string', nullable: true },
                        isZkappAccount: { type: 'number', nullable: true },
                        accountScam: { type: 'number', nullable: true }
                    }
                }
            },
        },
        getAccountBalance: {
            method: 'GET',
            path: '/accounts/{publicKeyHash}/balance',
            description: 'Get current balance for a specific Mina account via Blockberry. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'publicKeyHash', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Mina account public key hash (Base58 encoded, starts with B62q)' }
            ],
            tests: [
                { _description: 'Get account balance', publicKeyHash: 'B62qrAWZFqvgJbfU95t1owLAMKtsDTAGgSZzsBJYUzeQZ7Xwh9CWsEY' },
                { _description: 'Get Mina Foundation balance', publicKeyHash: 'B62qobAXQBMECKGRJx6K2AyRDMPGMHEgJCVfNsvjUMqLBKTXvRMoy4W' },
                { _description: 'Get validator balance', publicKeyHash: 'B62qpge4uMq4Vv5Rvc8Gw9qSquUYd6xoW1pz7HQkMSHm6h1o7pvLPAN' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        balance: { type: 'number' },
                        balanceUsd: { type: 'number' }
                    }
                }
            },
        },
        getBlocks: {
            method: 'GET',
            path: '/blocks',
            description: 'Get list of Mina blocks (canonical and orphaned) with pagination. Optional filters: page, size, orderBy, sortBy, type.',
            parameters: [
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)', 'optional()'] }, description: 'Page number for pagination, starting at 0' },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(20)', 'optional()'] }, description: 'Number of blocks per page (1-100, default 20)' },
                { position: { key: 'orderBy', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(ASC,DESC)', options: ['default(DESC)', 'optional()'] }, description: 'Sort direction: ASC for oldest first, DESC for newest first' },
                { position: { key: 'sortBy', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(HEIGHT,TIMESTAMP)', options: ['default(HEIGHT)', 'optional()'] }, description: 'Field to sort by: HEIGHT (block number) or TIMESTAMP (block time)' },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(ALL,CANONICAL,ORPHANED)', options: ['default(ALL)', 'optional()'] }, description: 'Block type filter: ALL, CANONICAL (finalized), or ORPHANED (non-canonical)' }
            ],
            tests: [
                { _description: 'Get latest 10 blocks', page: 0, size: 10, orderBy: 'DESC', sortBy: 'HEIGHT', type: 'ALL' },
                { _description: 'Get 5 canonical blocks ascending', page: 0, size: 5, orderBy: 'ASC', sortBy: 'HEIGHT', type: 'CANONICAL' },
                { _description: 'Get blocks sorted by timestamp', page: 0, size: 10, orderBy: 'DESC', sortBy: 'TIMESTAMP', type: 'ALL' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: { type: 'array', items: { type: 'object', properties: { stateHash: { type: 'string' }, parentHash: { type: 'string', nullable: true }, ledgerHash: { type: 'string', nullable: true }, blockHeight: { type: 'number' }, slot: { type: 'number' }, epoch: { type: 'number' }, globalSlotSinceGenesis: { type: 'number' }, timestamp: { type: 'number' }, accountAddress: { type: 'string' }, accountName: { type: 'string' }, accountImg: { type: 'string' }, transactionsCount: { type: 'number' }, zkappTransactionsCount: { type: 'number' }, coinbase: { type: 'number' }, isCanonical: { type: 'boolean' }, snarkersCount: { type: 'number' }, snarkJobsCount: { type: 'number' } } } },
                        size: { type: 'number' },
                        totalPages: { type: 'number' },
                        totalCount: { type: 'number' },
                        pageable: { type: 'object', properties: { sort: { type: 'object', properties: { sorted: { type: 'boolean' }, empty: { type: 'boolean' }, unsorted: { type: 'boolean' } } }, pageNumber: { type: 'number' }, pageSize: { type: 'number' }, offset: { type: 'number' }, paged: { type: 'boolean' }, unpaged: { type: 'boolean' } } },
                        last: { type: 'boolean' },
                        totalElements: { type: 'number' },
                        number: { type: 'number' },
                        sort: { type: 'object', properties: { sorted: { type: 'boolean' }, empty: { type: 'boolean' }, unsorted: { type: 'boolean' } } },
                        first: { type: 'boolean' },
                        numberOfElements: { type: 'number' },
                        empty: { type: 'boolean' }
                    }
                }
            },
        },
        getZkAppTransactions: {
            method: 'GET',
            path: '/zkapps/transactions',
            description: 'Get list of ZkApp transactions with filtering options via Blockberry. Supports page, size filters.',
            parameters: [
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)', 'optional()'] }, description: 'Page number for pagination, starting at 0' },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(20)', 'optional()'] }, description: 'Number of transactions per page (1-100, default 20)' }
            ],
            tests: [
                { _description: 'Get 15 ZkApp transactions', page: 0, size: 15 },
                { _description: 'Get first 5 ZkApp transactions', page: 0, size: 5 },
                { _description: 'Get second page of ZkApp transactions', page: 1, size: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        permissions: { type: 'string', nullable: true },
                        actionState: { type: 'string', nullable: true },
                        zkAppState: { type: 'string', nullable: true },
                        zkAppURI: { type: 'string', nullable: true },
                        verificationKey: { type: 'string', nullable: true },
                        verificationKeyHash: { type: 'string', nullable: true },
                        isZkappAccount: { type: 'boolean' },
                        accountScam: { type: 'number', nullable: true }
                    }
                }
            },
        },
        getZkAppByAddress: {
            method: 'GET',
            path: '/zkapps/{address}',
            description: 'Get ZkApp information by account address via Blockberry. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Mina ZkApp account address (Base58 encoded, starts with B62q)' }
            ],
            tests: [
                { _description: 'Get ZkApp details', address: 'B62qrAWZFqvgJbfU95t1owLAMKtsDTAGgSZzsBJYUzeQZ7Xwh9CWsEY' },
                { _description: 'Get ZkApp by Mina Foundation address', address: 'B62qobAXQBMECKGRJx6K2AyRDMPGMHEgJCVfNsvjUMqLBKTXvRMoy4W' },
                { _description: 'Get ZkApp by validator address', address: 'B62qpge4uMq4Vv5Rvc8Gw9qSquUYd6xoW1pz7HQkMSHm6h1o7pvLPAN' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        permissions: { type: 'string', nullable: true },
                        actionState: { type: 'string', nullable: true },
                        zkAppState: { type: 'string', nullable: true },
                        zkAppURI: { type: 'string', nullable: true },
                        verificationKey: { type: 'string', nullable: true },
                        verificationKeyHash: { type: 'string', nullable: true },
                        isZkappAccount: { type: 'boolean' },
                        accountScam: { type: 'number', nullable: true }
                    }
                }
            },
        }
    }
}
