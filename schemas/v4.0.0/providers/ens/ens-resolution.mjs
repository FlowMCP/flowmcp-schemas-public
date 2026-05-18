// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// requiredLibraries: ethers
// Import: import { ethers } from 'ethers'
// Import: import { EVM_CHAINS } from '../_shared/evmChains.mjs'
// Module-level code: 15 lines

export const main = {
    namespace: 'ens',
    name: 'ENS & EVM Name Resolution',
    description: 'Resolve ENS (and some EVM name services supported by ethers.js) to addresses and perform reverse lookups from addresses to ENS names.',
    version: '4.0.0',
    docs: ['https://docs.ethers.org/v6/api/providers/#Provider-resolveName', 'https://docs.ethers.org/v6/api/providers/#Provider-lookupAddress', 'https://docs.ens.domains/'],
    tags: ['production', 'domain', 'identity', 'ethereum', 'cacheTtlDaily'],
    sharedLists: [
        { ref: 'evmChains', version: '3.1.0' }
    ],
    root: 'https://--infura-subdomain--.infura.io/v3/{{INFURA_API_KEY}}',
    requiredServerParams: ['INFURA_API_KEY'],
    tools: {
        resolveName: {
            method: 'GET',
            path: '/',
            description: 'Resolves a human-readable name (e.g., vitalik.eth) to a checksummed address on the selected chain.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(ETHEREUM_MAINNET,SEPOLIA_TESTNET,ARBITRUM_ONE_MAINNET,AVALANCHE_MAINNET,BASE_MAINNET,BINANCE_MAINNET,CELO_MAINNET,LINEA_MAINNET,MANTLE_MAINNET,SCROLL_MAINNET,OPTIMISM_MAINNET,POLYGON_MAINNET,ZKSYNC_MAINNET)', options: [] }, description: 'EVM chain to resolve on, e.g. ETHEREUM_MAINNET or SEPOLIA_TESTNET' },
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(3)'] }, description: 'ENS name to resolve, e.g. vitalik.eth, nick.eth' }
            ],
            tests: [
                { _description: 'Resolve vitalik.eth on Ethereum mainnet', chainName: 'ETHEREUM_MAINNET', name: 'vitalik.eth' },
                { _description: 'Resolve andr3a5.eth on Ethereum mainnet', chainName: 'ETHEREUM_MAINNET', name: 'andr3a5.eth' },
                { _description: 'Resolve nick.eth on Ethereum mainnet', chainName: 'ETHEREUM_MAINNET', name: 'nick.eth' }
            ],
        },
        lookupAddress: {
            method: 'GET',
            path: '/',
            description: 'Looks up the primary ENS name for a given address (reverse record) on the selected chain.',
            parameters: [
                { position: { key: 'chainName', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(ETHEREUM_MAINNET,SEPOLIA_TESTNET,ARBITRUM_ONE_MAINNET,AVALANCHE_MAINNET,BASE_MAINNET,BINANCE_MAINNET,CELO_MAINNET,LINEA_MAINNET,MANTLE_MAINNET,SCROLL_MAINNET,OPTIMISM_MAINNET,POLYGON_MAINNET,ZKSYNC_MAINNET)', options: [] }, description: 'EVM chain to perform reverse lookup on, e.g. ETHEREUM_MAINNET' },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['length(42)', 'regex(^0x[a-fA-F0-9]{40}$)'] }, description: 'Ethereum address (0x-prefixed, 42 chars) to reverse-resolve to an ENS name' }
            ],
            tests: [
                { _description: 'Reverse lookup Vitalik on mainnet', chainName: 'ETHEREUM_MAINNET', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
                { _description: 'Reverse lookup Nick Johnson on mainnet', chainName: 'ETHEREUM_MAINNET', address: '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5' },
                { _description: 'Reverse lookup ENS deployer on mainnet', chainName: 'ETHEREUM_MAINNET', address: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' }
            ],
        },
        supportMatrix: {
            method: 'GET',
            path: '/support',
            description: 'Returns the supported networks for ENS resolution and whether SEI is supported. Required: includeAll.',
            parameters: [
                { position: { key: 'includeAll', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: [] }, description: 'When true, return full matrix including all EVM chains via Infura; when false, only native ENS and SEI status' }
            ],
            tests: [
                { _description: 'List support matrix (default)', includeAll: false },
                { _description: 'List support matrix (verbose)', includeAll: true },
                { _description: 'List support matrix (compact)', includeAll: false }
            ],
        }
    },
    requiredLibraries: ['ethers']
}


export const handlers = ( { sharedLists, libraries } ) => {
    const ethers = libraries['ethers']
    const EVM_CHAINS = sharedLists['evmChains']

    const ensChainAliases = [
        'ETHEREUM_MAINNET', 'SEPOLIA_TESTNET', 'ARBITRUM_ONE_MAINNET',
        'AVALANCHE_MAINNET', 'BASE_MAINNET', 'BINANCE_MAINNET',
        'CELO_MAINNET', 'LINEA_MAINNET', 'MANTLE_MAINNET',
        'SCROLL_MAINNET', 'OPTIMISM_MAINNET', 'POLYGON_MAINNET',
        'ZKSYNC_MAINNET'
    ]
    const infuraSubDomain = EVM_CHAINS
        .filter( ( c ) => ensChainAliases.includes( c.alias ) && c.infuraSubdomain !== undefined )
        .reduce( ( acc, chain ) => {
            acc[ chain.alias ] = chain.infuraSubdomain
            return acc
        }, {} )
    const ENS_SUPPORTED_NATIVE = ["ETHEREUM_MAINNET", "SEPOLIA_TESTNET"]
    const SEI_SUPPORT = { supported: false, reason: "Sei is not natively supported by ENS via ethers.js; use a Cosmos/ICNS-style resolver instead." }

    return {
        resolveName: {
            preRequest: async ( { struct, payload } ) => {
                const chain = infuraSubDomain[payload.chainName]
                if (!chain) {
                throw new Error( `Unsupported or unknown chain: ${payload.chainName}.` )

                }
                struct.url = struct.url.replace("--infura-subdomain--", chain)
                return { struct }
            },
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { name, chainName } = userParams
                // Quick guard for SEI explicitly
                if (String(chainName).toUpperCase() === "SEI" || String(chainName).toUpperCase() === "SEI_MAINNET") {
                struct.status = false
                struct.messages.push(SEI_SUPPORT.reason)
                return { struct }}
                try {
                const provider = new ethers.JsonRpcProvider(payload.url)
                const address = await provider.resolveName(String(name).trim())
                if (!address) {
                struct.status = false
                struct.messages.push(`No address found for name "${name}" on ${chainName}. Note: many L2s do not natively support ENS.`)
                return { struct }}
                struct.data = { name, address, chainName, ensNative: ENS_SUPPORTED_NATIVE.includes(chainName) }
                struct.status = true
                } catch (e) {
                struct.status = false
                struct.messages.push(e?.message || `Resolution failed on ${chainName}. If this is an L2, ENS may not be supported natively.`)
                }
                return { struct }
            }
        },
        lookupAddress: {
            preRequest: async ( { struct, payload } ) => {
                const chain = infuraSubDomain[payload.chainName]
                if (!chain) {
                throw new Error( `Unsupported or unknown chain: ${payload.chainName}.` )

                }
                struct.url = struct.url.replace("--infura-subdomain--", chain)
                return { struct }
            },
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { address, chainName } = userParams
                if (String(chainName).toUpperCase() === "SEI" || String(chainName).toUpperCase() === "SEI_MAINNET") {
                struct.status = false
                struct.messages.push(SEI_SUPPORT.reason)
                return { struct }}
                try {
                const provider = new ethers.JsonRpcProvider(payload.url)
                const ensName = await provider.lookupAddress(address)
                if (!ensName) {
                struct.status = false
                struct.messages.push(`No ENS name set for address "${address}" on ${chainName}.`)
                return { struct }}
                struct.data = { address: ethers.getAddress(address), name: ensName, chainName, ensNative: ENS_SUPPORTED_NATIVE.includes(chainName) }
                struct.status = true
                } catch (e) {
                struct.status = false
                struct.messages.push(e?.message || `Reverse lookup failed on ${chainName}. If this is an L2, ENS may not be supported natively.`)
                }
                return { struct }
            }
        },
        supportMatrix: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const includeAll = Boolean(userParams.includeAll)
                const evmViaInfura = Object.keys(infuraSubDomain)
                const matrix = {
                ensNative: ENS_SUPPORTED_NATIVE,
                evmViaInfura,
                sei: SEI_SUPPORT,
                notes: [
                "ENS is Ethereum-native. Some L2s may resolve via CCIP-read/gateways but are not guaranteed.",
                "SEI is a Cosmos-based chain; use ICNS or a chain-specific naming service for name->address."
                ]
                }
                struct.data = includeAll ? matrix : { ensNative: matrix.ensNative, sei: matrix.sei }
                struct.status = true
                return { struct }
            }
        }
    }
}
