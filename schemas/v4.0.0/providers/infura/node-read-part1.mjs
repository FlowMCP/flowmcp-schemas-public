// Split from infura/node-read.mjs
// Part 1 of 2
// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// 9 routes (v2 max: 8) — needs splitting
// requiredLibraries: ethers
// Import: import { ethers } from 'ethers'
// Import: import { EVM_CHAINS } from '../_shared/evmChains.mjs'
// Module-level code: 8 lines

export const main = {
    namespace: 'infura',
    name: 'Infura Node Read (Part 1)',
    description: 'Read blockchain data from EVM mainnets via JSON-RPC through Infura. Supports Ethereum, Polygon, Arbitrum, Optimism, Base, BSC, Avalanche, Linea, Scroll, zkSync, Mantle, and Celo. Query blocks, balances, transactions, receipts, contract code, gas prices, and event logs.',
    version: '4.0.0',
    docs: ['https://docs.infura.io/api/networks', 'https://ethereum.org/en/developers/docs/apis/json-rpc/'],
    tags: ['blockchain', 'evm', 'rpc', 'multichain', 'infura', 'cacheTtlRealtime'],
    sharedLists: [
        { ref: 'evmChains', version: '3.1.0', filter: { key: 'isTestnet', value: false } }
    ],
    root: 'https://--infura-subdomain--.infura.io/v3/{{INFURA_API_KEY}}',
    requiredServerParams: ['INFURA_API_KEY'],
    tools: {
        getBlockNumber: {
            method: 'GET',
            path: '/',
            description: 'Get the latest block number and timestamp for a selected EVM chain.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum({{evmChains:infuraSubdomain}})', options: [] } }
            ],
            tests: [
                { _description: 'Get latest block on Ethereum via Infura', chain: 'mainnet' }
            ],
        },
        getBalance: {
            method: 'GET',
            path: '/',
            description: 'Get the native token balance (ETH, POL, BNB, etc.) for an address on the selected chain.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum({{evmChains:infuraSubdomain}})', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{40}$)'] } }
            ],
            tests: [
                {
                    _description: 'Get ETH balance of USDC contract via Infura',
                    chain: 'mainnet',
                    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
                }
            ],
        },
        getGasPrice: {
            method: 'GET',
            path: '/',
            description: 'Get the current gas price in wei and gwei for the selected chain, including EIP-1559 maxFeePerGas when available.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum({{evmChains:infuraSubdomain}})', options: [] } }
            ],
            tests: [
                { _description: 'Get gas price on Ethereum via Infura', chain: 'mainnet' }
            ],
        },
        getBlock: {
            method: 'GET',
            path: '/',
            description: 'Get block details by block number, including hash, parentHash, timestamp, gasUsed, transaction count, and miner.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum({{evmChains:infuraSubdomain}})', options: [] } },
                { position: { key: 'blockNumber', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)'] } }
            ],
            tests: [
                { _description: 'Get block 17000000 via Infura', chain: 'mainnet', blockNumber: 17000000 }
            ],
        },
        getCode: {
            method: 'GET',
            path: '/',
            description: 'Get the bytecode deployed at an address. Returns whether the address is a contract and the bytecode length.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum({{evmChains:infuraSubdomain}})', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{40}$)'] } }
            ],
            tests: [
                {
                    _description: 'Check USDC bytecode via Infura',
                    chain: 'mainnet',
                    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
                }
            ],
        },
        getTransactionCount: {
            method: 'GET',
            path: '/',
            description: 'Get the transaction count (nonce) for an address on the selected chain.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum({{evmChains:infuraSubdomain}})', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{40}$)'] } }
            ],
            tests: [
                {
                    _description: 'Get USDC nonce via Infura',
                    chain: 'mainnet',
                    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
                }
            ],
        },
        getTransactionByHash: {
            method: 'GET',
            path: '/',
            description: 'Get transaction details by transaction hash, including from, to, value, gasPrice, blockNumber, and input data.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum({{evmChains:infuraSubdomain}})', options: [] } },
                { position: { key: 'txHash', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{64}$)'] } }
            ],
            tests: [
                {
                    _description: 'Get transaction details via Infura',
                    chain: 'mainnet',
                    txHash: '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060'
                }
            ],
        },
        getTransactionReceipt: {
            method: 'GET',
            path: '/',
            description: 'Get the transaction receipt by hash, including status, gasUsed, logs count, and created contract address if applicable.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum({{evmChains:infuraSubdomain}})', options: [] } },
                { position: { key: 'txHash', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{64}$)'] } }
            ],
            tests: [
                {
                    _description: 'Get transaction receipt via Infura',
                    chain: 'mainnet',
                    txHash: '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060'
                }
            ],
        }
    },
    requiredLibraries: ['ethers']
}


export const handlers = ( { sharedLists, libraries } ) => {
    const ethers = libraries['ethers']
    const EVM_CHAINS = sharedLists['evmChains']

    const validSubdomains = new Set(
        EVM_CHAINS
            .filter( ( c ) => c.infuraSubdomain !== undefined )
            .map( ( c ) => c.infuraSubdomain )
    )

    return {
        getBlockNumber: {
            preRequest: async ( { struct, payload } ) => {
                const { chain } = payload
                if( !validSubdomains.has( chain ) ) {
                    throw new Error( `Unsupported chain: ${chain}` )
                }
                struct.url = struct.url.replace( '--infura-subdomain--', chain )
                return { struct }
            },
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { chain } = userParams
                try {
                const provider = new ethers.JsonRpcProvider( payload.url )
                const block = await provider.getBlock( 'latest' )
                if( !block ) {
                struct.status = false
                struct.messages.push( `Failed to fetch latest block on ${chain}` )
                return { struct }}
                const timestamp = Number( block.timestamp ) * 1000
                struct.data = {
                chain,
                blockNumber: block.number,
                timestamp: block.timestamp.toString(),
                timestampISO: new Date( timestamp ).toISOString()
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || `Failed to get block number on ${chain}` )
                }
                return { struct }
            }
        },
        getBalance: {
            preRequest: async ( { struct, payload } ) => {
                const { chain } = payload
                if( !validSubdomains.has( chain ) ) {
                    throw new Error( `Unsupported chain: ${chain}` )
                }
                struct.url = struct.url.replace( '--infura-subdomain--', chain )
                return { struct }
            },
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { chain, address } = userParams
                try {
                const provider = new ethers.JsonRpcProvider( payload.url )
                const balanceWei = await provider.getBalance( address )
                const chainInfo = EVM_CHAINS.find( ( c ) => c.infuraSubdomain === chain )
                struct.data = {
                chain,
                address,
                balanceWei: balanceWei.toString(),
                balanceFormatted: ethers.formatEther( balanceWei ),
                nativeCurrency: chainInfo?.nativeCurrency || 'ETH'
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || `Failed to get balance on ${chain}` )
                }
                return { struct }
            }
        },
        getGasPrice: {
            preRequest: async ( { struct, payload } ) => {
                const { chain } = payload
                if( !validSubdomains.has( chain ) ) {
                    throw new Error( `Unsupported chain: ${chain}` )
                }
                struct.url = struct.url.replace( '--infura-subdomain--', chain )
                return { struct }
            },
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { chain } = userParams
                try {
                const provider = new ethers.JsonRpcProvider( payload.url )
                const feeData = await provider.getFeeData()
                struct.data = {
                chain,
                gasPriceWei: feeData.gasPrice ? feeData.gasPrice.toString() : null,
                gasPriceGwei: feeData.gasPrice ? ethers.formatUnits( feeData.gasPrice, 'gwei' ) : null,
                maxFeePerGas: feeData.maxFeePerGas ? feeData.maxFeePerGas.toString() : null,
                maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? feeData.maxPriorityFeePerGas.toString() : null
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || `Failed to get gas price on ${chain}` )
                }
                return { struct }
            }
        },
        getBlock: {
            preRequest: async ( { struct, payload } ) => {
                const { chain } = payload
                if( !validSubdomains.has( chain ) ) {
                    throw new Error( `Unsupported chain: ${chain}` )
                }
                struct.url = struct.url.replace( '--infura-subdomain--', chain )
                return { struct }
            },
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { chain, blockNumber } = userParams
                try {
                const provider = new ethers.JsonRpcProvider( payload.url )
                const block = await provider.getBlock( Number( blockNumber ) )
                if( !block ) {
                struct.status = false
                struct.messages.push( `Block ${blockNumber} not found on ${chain}` )
                return { struct }}
                const timestamp = Number( block.timestamp ) * 1000
                struct.data = {
                chain,
                blockNumber: block.number,
                hash: block.hash,
                parentHash: block.parentHash,
                timestamp: block.timestamp.toString(),
                timestampISO: new Date( timestamp ).toISOString(),
                gasUsed: block.gasUsed.toString(),
                gasLimit: block.gasLimit.toString(),
                txCount: block.transactions.length,
                miner: block.miner
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || `Failed to get block ${blockNumber} on ${chain}` )
                }
                return { struct }
            }
        },
        getCode: {
            preRequest: async ( { struct, payload } ) => {
                const { chain } = payload
                if( !validSubdomains.has( chain ) ) {
                    throw new Error( `Unsupported chain: ${chain}` )
                }
                struct.url = struct.url.replace( '--infura-subdomain--', chain )
                return { struct }
            },
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { chain, address } = userParams
                try {
                const provider = new ethers.JsonRpcProvider( payload.url )
                const code = await provider.getCode( address )
                const isContract = code !== '0x'
                struct.data = {
                chain,
                address,
                isContract,
                bytecodeLength: isContract ? ( code.length - 2 ) / 2 : 0,
                bytecode: code
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || `Failed to get code for ${address} on ${chain}` )
                }
                return { struct }
            }
        },
        getTransactionCount: {
            preRequest: async ( { struct, payload } ) => {
                const { chain } = payload
                if( !validSubdomains.has( chain ) ) {
                    throw new Error( `Unsupported chain: ${chain}` )
                }
                struct.url = struct.url.replace( '--infura-subdomain--', chain )
                return { struct }
            },
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { chain, address } = userParams
                try {
                const provider = new ethers.JsonRpcProvider( payload.url )
                const nonce = await provider.getTransactionCount( address )
                struct.data = {
                chain,
                address,
                nonce
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || `Failed to get transaction count for ${address} on ${chain}` )
                }
                return { struct }
            }
        },
        getTransactionByHash: {
            preRequest: async ( { struct, payload } ) => {
                const { chain } = payload
                if( !validSubdomains.has( chain ) ) {
                    throw new Error( `Unsupported chain: ${chain}` )
                }
                struct.url = struct.url.replace( '--infura-subdomain--', chain )
                return { struct }
            },
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { chain, txHash } = userParams
                try {
                const provider = new ethers.JsonRpcProvider( payload.url )
                const tx = await provider.getTransaction( txHash )
                if( !tx ) {
                struct.status = false
                struct.messages.push( `Transaction ${txHash} not found on ${chain}` )
                return { struct }}
                struct.data = {
                chain,
                txHash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: tx.value.toString(),
                valueFormatted: ethers.formatEther( tx.value ),
                gasPrice: tx.gasPrice ? tx.gasPrice.toString() : null,
                gasLimit: tx.gasLimit.toString(),
                nonce: tx.nonce,
                blockNumber: tx.blockNumber,
                blockHash: tx.blockHash,
                data: tx.data
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || `Failed to get transaction ${txHash} on ${chain}` )
                }
                return { struct }
            }
        },
        getTransactionReceipt: {
            preRequest: async ( { struct, payload } ) => {
                const { chain } = payload
                if( !validSubdomains.has( chain ) ) {
                    throw new Error( `Unsupported chain: ${chain}` )
                }
                struct.url = struct.url.replace( '--infura-subdomain--', chain )
                return { struct }
            },
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { chain, txHash } = userParams
                try {
                const provider = new ethers.JsonRpcProvider( payload.url )
                const receipt = await provider.getTransactionReceipt( txHash )
                if( !receipt ) {
                struct.status = false
                struct.messages.push( `Receipt for ${txHash} not found on ${chain}` )
                return { struct }}
                struct.data = {
                chain,
                txHash: receipt.hash,
                status: receipt.status === 1 ? 'success' : 'reverted',
                from: receipt.from,
                to: receipt.to,
                contractAddress: receipt.contractAddress,
                gasUsed: receipt.gasUsed.toString(),
                cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
                blockNumber: receipt.blockNumber,
                logsCount: receipt.logs.length
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || `Failed to get receipt for ${txHash} on ${chain}` )
                }
                return { struct }
            }
        }
    }
}
