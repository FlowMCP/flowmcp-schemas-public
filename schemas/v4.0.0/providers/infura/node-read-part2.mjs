// Split from infura/node-read.mjs
// Part 2 of 2
// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// 9 routes (v2 max: 8) — needs splitting
// requiredLibraries: ethers
// Import: import { ethers } from 'ethers'
// Import: import { EVM_CHAINS } from '../_shared/evmChains.mjs'
// Module-level code: 8 lines

export const main = {
    namespace: 'infura',
    name: 'Infura Node Read (Part 2)',
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
        getLogs: {
            method: 'GET',
            path: '/',
            description: 'Get event logs for a contract address within a block range (max 10000 blocks). Returns topics, data, and transaction hash per log entry.',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum({{evmChains:infuraSubdomain}})', options: [] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['regex(^0x[a-fA-F0-9]{40}$)'] } },
                { position: { key: 'fromBlock', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)'] } },
                { position: { key: 'toBlock', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)'] } }
            ],
            tests: [
                {
                    _description: 'Get USDC logs in 10-block range via Infura',
                    chain: 'mainnet',
                    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                    fromBlock: 17000000,
                    toBlock: 17000010
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
        getLogs: {
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
                const { chain, address, fromBlock, toBlock } = userParams
                const range = Number( toBlock ) - Number( fromBlock )
                if( range > 10000 ) {
                struct.status = false
                struct.messages.push( `Block range too large: ${range}. Maximum allowed is 10000 blocks.` )
                return { struct }}
                if( range < 0 ) {
                struct.status = false
                struct.messages.push( `Invalid block range: fromBlock (${fromBlock}) must be <= toBlock (${toBlock}).` )
                return { struct }}
                try {
                const provider = new ethers.JsonRpcProvider( payload.url )
                const logs = await provider.getLogs( {
                address,
                fromBlock: Number( fromBlock ),
                toBlock: Number( toBlock )
                } )
                struct.data = {
                chain,
                address,
                fromBlock: Number( fromBlock ),
                toBlock: Number( toBlock ),
                logsCount: logs.length,
                logs: logs.map( ( log ) => {
                return {
                blockNumber: log.blockNumber,
                txHash: log.transactionHash,
                logIndex: log.index,
                topics: log.topics,
                data: log.data
                }
                } )
                }
                struct.status = true
                } catch( e ) {
                struct.status = false
                struct.messages.push( e?.message || `Failed to get logs for ${address} on ${chain}` )
                }
                return { struct }
            }
        }
    }
}
