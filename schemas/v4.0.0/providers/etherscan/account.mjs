// Enhancement for #155 — Etherscan Account, Transaction & Event Log Routes

export const main = {
    namespace: 'etherscan',
    name: 'Etherscan Account & Transactions',
    description: 'Query Ethereum account balances, transaction history, internal transactions, ERC20 transfers, and event logs via Etherscan V2 API',
    version: '4.0.0',
    docs: ['https://docs.etherscan.io/v2/api-endpoints/accounts', 'https://docs.etherscan.io/v2/api-endpoints/logs'],
    tags: ['ethereum', 'explorer', 'transactions', 'cacheTtlFrequent'],
    root: 'https://api.etherscan.io/v2/api',
    requiredServerParams: ['ETHERSCAN_API_KEY'],
    tools: {
        getAccountBalance: {
            method: 'GET',
            path: '/?chainid=1&module=account&action=balance&tag=latest&apikey={{ETHERSCAN_API_KEY}}',
            description: 'Get the ETH balance of a single address in wei. Returns the current balance at the latest block. Use getTransactionList or getTokenTransfers to see activity for the same address.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(42)', 'max(42)'] } }
            ],
            tests: [
                { _description: 'Vitalik ETH balance', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
                { _description: 'Ethereum Foundation balance', address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe' },
                { _description: 'Uniswap V2 Router balance', address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Etherscan API response containing the ETH balance in wei',
                    properties: {
                        status: { type: 'string', description: 'API status code, 1 for success, 0 for error' },
                        message: { type: 'string', description: 'Status message, typically OK or NOTOK' },
                        result: { type: 'string', description: 'ETH balance in wei as a decimal string' }
                    }
                }
            },
        },
        getTransactionList: {
            method: 'GET',
            path: '/?chainid=1&module=account&action=txlist&apikey={{ETHERSCAN_API_KEY}}',
            description: 'Get a list of normal (external) transactions for an address, sorted by block number. Supports pagination and block range filtering. Use getInternalTransactions for contract-initiated transfers.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(42)', 'max(42)'] } },
                { position: { key: 'startblock', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'endblock', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(99999999)'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(asc,desc)', options: ['optional()', 'default(desc)'] } }
            ],
            tests: [
                { _description: 'Latest 3 transactions for Vitalik', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', page: 1, offset: 3, sort: 'desc' },
                { _description: 'Earliest transactions for Ethereum Foundation', address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', page: 1, offset: 3, sort: 'asc' },
                { _description: 'Uniswap Router transactions', address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', page: 1, offset: 3, sort: 'desc' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of normal Ethereum transactions for the queried address',
                    properties: {
                        status: { type: 'string', description: 'API status code, 1 for success, 0 for error' },
                        message: { type: 'string', description: 'Status message, typically OK or NOTOK' },
                        result: {
                            type: 'array',
                            description: 'Array of transaction objects sorted by block number',
                            items: {
                                type: 'object',
                                properties: {
                                    blockNumber: { type: 'string', description: 'Block number where the transaction was included' },
                                    timeStamp: { type: 'string', description: 'Unix timestamp of the block' },
                                    hash: { type: 'string', description: 'Transaction hash (unique identifier)' },
                                    from: { type: 'string', description: 'Sender address (0x-prefixed)' },
                                    to: { type: 'string', description: 'Recipient address (0x-prefixed), empty for contract creation' },
                                    value: { type: 'string', description: 'Amount transferred in wei' },
                                    gas: { type: 'string', description: 'Gas limit set by the sender' },
                                    gasPrice: { type: 'string', description: 'Gas price in wei' },
                                    isError: { type: 'string', description: 'Execution error flag, 0 for success, 1 for failure' },
                                    input: { type: 'string', description: 'Encoded input data (function call data)' },
                                    contractAddress: { type: 'string', description: 'Contract address created, empty if not a contract creation tx' },
                                    functionName: { type: 'string', description: 'Decoded function name if available' }
                                }
                            }
                        }
                    }
                }
            },
        },
        getInternalTransactions: {
            method: 'GET',
            path: '/?chainid=1&module=account&action=txlistinternal&apikey={{ETHERSCAN_API_KEY}}',
            description: 'Get internal transactions (message calls) for an address. Useful for tracking ETH transfers made by smart contracts. Use getTransactionList for normal external transactions.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(42)', 'max(42)'] } },
                { position: { key: 'startblock', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'endblock', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(99999999)'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(asc,desc)', options: ['optional()', 'default(desc)'] } }
            ],
            tests: [
                { _description: 'Internal txs for Vitalik', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', page: 1, offset: 3, sort: 'desc' },
                { _description: 'Internal txs for Ethereum Foundation', address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', page: 1, offset: 3, sort: 'desc' },
                { _description: 'Internal txs for Uniswap Router', address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', page: 1, offset: 3, sort: 'desc' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of internal (contract-initiated) ETH transfers',
                    properties: {
                        status: { type: 'string', description: 'API status code, 1 for success, 0 for error' },
                        message: { type: 'string', description: 'Status message, typically OK or NOTOK' },
                        result: {
                            type: 'array',
                            description: 'Array of internal transaction objects',
                            items: {
                                type: 'object',
                                properties: {
                                    blockNumber: { type: 'string', description: 'Block number where the internal tx occurred' },
                                    timeStamp: { type: 'string', description: 'Unix timestamp of the block' },
                                    hash: { type: 'string', description: 'Parent transaction hash' },
                                    from: { type: 'string', description: 'Sender contract or address' },
                                    to: { type: 'string', description: 'Recipient address' },
                                    value: { type: 'string', description: 'Amount transferred in wei' },
                                    contractAddress: { type: 'string', description: 'Contract address involved in the call' },
                                    type: { type: 'string', description: 'Internal transaction type (call, create, delegatecall, etc.)' },
                                    gas: { type: 'string', description: 'Gas provided for this internal call' },
                                    gasUsed: { type: 'string', description: 'Actual gas consumed by this internal call' },
                                    isError: { type: 'string', description: 'Error flag, 0 for success, 1 for failure' }
                                }
                            }
                        }
                    }
                }
            },
        },
        getTokenTransfers: {
            method: 'GET',
            path: '/?chainid=1&module=account&action=tokentx&apikey={{ETHERSCAN_API_KEY}}',
            description: 'Get ERC20 token transfer events for an address. Optionally filter by contract address to track a specific token. Use getNftTransfers for ERC721 NFT transfers.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(42)', 'max(42)'] } },
                { position: { key: 'contractaddress', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(asc,desc)', options: ['optional()', 'default(desc)'] } }
            ],
            tests: [
                { _description: 'ERC20 transfers for Vitalik', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', page: 1, offset: 3, sort: 'desc' },
                { _description: 'USDT transfers for Ethereum Foundation', address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', contractaddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', page: 1, offset: 3, sort: 'desc' },
                { _description: 'All ERC20 transfers for Uniswap Router', address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', page: 1, offset: 3, sort: 'desc' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of ERC20 token transfer events for the queried address',
                    properties: {
                        status: { type: 'string', description: 'API status code, 1 for success, 0 for error' },
                        message: { type: 'string', description: 'Status message, typically OK or NOTOK' },
                        result: {
                            type: 'array',
                            description: 'Array of ERC20 transfer event objects',
                            items: {
                                type: 'object',
                                properties: {
                                    blockNumber: { type: 'string', description: 'Block number of the transfer event' },
                                    timeStamp: { type: 'string', description: 'Unix timestamp of the block' },
                                    hash: { type: 'string', description: 'Transaction hash containing this transfer' },
                                    from: { type: 'string', description: 'Sender address of the token transfer' },
                                    to: { type: 'string', description: 'Recipient address of the token transfer' },
                                    value: { type: 'string', description: 'Token amount transferred in smallest unit (divide by 10^tokenDecimal)' },
                                    tokenName: { type: 'string', description: 'Human-readable token name (e.g., Tether USD)' },
                                    tokenSymbol: { type: 'string', description: 'Token ticker symbol (e.g., USDT)' },
                                    tokenDecimal: { type: 'string', description: 'Number of decimal places for the token' },
                                    contractAddress: { type: 'string', description: 'ERC20 token contract address' }
                                }
                            }
                        }
                    }
                }
            },
        },
        getNftTransfers: {
            method: 'GET',
            path: '/?chainid=1&module=account&action=tokennfttx&apikey={{ETHERSCAN_API_KEY}}',
            description: 'Get ERC721 NFT transfer events for an address. Optionally filter by NFT contract address. Use getTokenTransfers for ERC20 fungible token transfers.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(42)', 'max(42)'] } },
                { position: { key: 'contractaddress', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(asc,desc)', options: ['optional()', 'default(desc)'] } }
            ],
            tests: [
                { _description: 'NFT transfers for Vitalik', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', page: 1, offset: 3, sort: 'desc' },
                { _description: 'NFT transfers for Ethereum Foundation', address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', page: 1, offset: 3, sort: 'desc' },
                { _description: 'BAYC NFT transfers for any holder', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', contractaddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', page: 1, offset: 3, sort: 'desc' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of ERC721 NFT transfer events for the queried address',
                    properties: {
                        status: { type: 'string', description: 'API status code, 1 for success, 0 for error' },
                        message: { type: 'string', description: 'Status message, typically OK or NOTOK' },
                        result: {
                            type: 'array',
                            description: 'Array of ERC721 NFT transfer event objects',
                            items: {
                                type: 'object',
                                properties: {
                                    blockNumber: { type: 'string', description: 'Block number of the NFT transfer event' },
                                    timeStamp: { type: 'string', description: 'Unix timestamp of the block' },
                                    hash: { type: 'string', description: 'Transaction hash containing this NFT transfer' },
                                    from: { type: 'string', description: 'Sender address (0x0 for mints)' },
                                    to: { type: 'string', description: 'Recipient address of the NFT' },
                                    tokenID: { type: 'string', description: 'Unique token ID within the NFT collection' },
                                    tokenName: { type: 'string', description: 'NFT collection name (e.g., BoredApeYachtClub)' },
                                    tokenSymbol: { type: 'string', description: 'NFT collection symbol (e.g., BAYC)' },
                                    contractAddress: { type: 'string', description: 'ERC721 NFT contract address' }
                                }
                            }
                        }
                    }
                }
            },
        },
        getTxStatus: {
            method: 'GET',
            path: '/?chainid=1&module=transaction&action=getstatus&apikey={{ETHERSCAN_API_KEY}}',
            description: 'Check the execution status of a transaction. Returns isError=0 for success, isError=1 for failure with error description. Use getTxReceiptStatus for the simpler receipt-level check.',
            parameters: [
                { position: { key: 'txhash', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['length(66)'] } }
            ],
            tests: [
                { _description: 'Check tx execution status (successful)', txhash: '0x15f8e5ea1079d9a0bb04a4c58ae5fe7654b5b2b4463375ff7ffb490aa0032f3a' },
                { _description: 'Check a known Uniswap swap tx', txhash: '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060' },
                { _description: 'Check early Ethereum tx', txhash: '0xe1c6e60d3e4c2834ed8e2e87b7bfb76a4e9c0438b0cc72dbfe81e0fad3149003' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Transaction execution status with error details if the transaction failed',
                    properties: {
                        status: { type: 'string', description: 'API status code, 1 for success, 0 for error' },
                        message: { type: 'string', description: 'Status message, typically OK or NOTOK' },
                        result: {
                            type: 'object',
                            description: 'Execution status details for the queried transaction',
                            properties: {
                                isError: { type: 'string', description: 'Error flag, 0 for successful execution, 1 for failed execution' },
                                errDescription: { type: 'string', description: 'Error description if the transaction failed, empty string on success' }
                            }
                        }
                    }
                }
            },
        },
        getTxReceiptStatus: {
            method: 'GET',
            path: '/?chainid=1&module=transaction&action=gettxreceiptstatus&apikey={{ETHERSCAN_API_KEY}}',
            description: 'Check the receipt status of a transaction. Returns status=1 for success, status=0 for failure. Use getTxStatus for more detailed error information.',
            parameters: [
                { position: { key: 'txhash', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['length(66)'] } }
            ],
            tests: [
                { _description: 'Check tx receipt status (successful)', txhash: '0x15f8e5ea1079d9a0bb04a4c58ae5fe7654b5b2b4463375ff7ffb490aa0032f3a' },
                { _description: 'Check Uniswap tx receipt', txhash: '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060' },
                { _description: 'Check early Ethereum tx receipt', txhash: '0xe1c6e60d3e4c2834ed8e2e87b7bfb76a4e9c0438b0cc72dbfe81e0fad3149003' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Transaction receipt status indicating success or failure at the EVM level',
                    properties: {
                        status: { type: 'string', description: 'API status code, 1 for success, 0 for error' },
                        message: { type: 'string', description: 'Status message, typically OK or NOTOK' },
                        result: {
                            type: 'object',
                            description: 'Receipt status for the queried transaction',
                            properties: {
                                status: { type: 'string', description: 'Receipt status, 1 for successful execution, 0 for failed execution' }
                            }
                        }
                    }
                }
            },
        }
    }
}
