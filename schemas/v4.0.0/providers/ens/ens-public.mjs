// Enhancement for #162 — ENS Public RPC (No API Key Required)
// Uses public Ethereum RPC endpoints — zero configuration needed
// requiredLibraries: ethers
// Import: import { ethers } from 'ethers'

export const main = {
    namespace: 'ens',
    name: 'ENS Public Resolution',
    description: 'Resolve ENS names, reverse lookups, text records, avatars and content hashes via public Ethereum RPC — no API key required.',
    version: '4.0.0',
    docs: ['https://docs.ens.domains/', 'https://docs.ethers.org/v6/api/providers/#Provider-resolveName'],
    tags: ['ethereum', 'domain', 'identity', 'ens', 'cacheTtlDaily'],
    root: 'https://ethereum-rpc.publicnode.com',
    tools: {
        resolveName: {
            method: 'GET',
            path: '/',
            description: 'Resolve an ENS name (e.g. vitalik.eth) to its Ethereum address via public RPC. Use lookupAddress for the reverse operation. No API key needed.',
            parameters: [
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(3)'] }, description: 'ENS name to resolve, e.g. vitalik.eth, nick.eth' }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', description: 'ENS forward resolution result', properties: { name: { type: 'string', description: 'The ENS name that was resolved' }, address: { type: 'string', description: 'Ethereum address (0x-prefixed, 42 chars) or null if name has no address set' } } } },
            tests: [
                { _description: 'Resolve vitalik.eth', name: 'vitalik.eth' },
                { _description: 'Resolve andr3a5.eth', name: 'andr3a5.eth' },
                { _description: 'Resolve nick.eth', name: 'nick.eth' }
            ],
        },
        lookupAddress: {
            method: 'GET',
            path: '/',
            description: 'Reverse-resolve an Ethereum address to its primary ENS name via public RPC. The address must have a primary name set. Use resolveName for the forward operation.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['length(42)', 'regex(^0x[a-fA-F0-9]{40}$)'] }, description: 'Ethereum address (0x-prefixed, 42 chars) to reverse-resolve to an ENS name' }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', description: 'ENS reverse resolution result', properties: { address: { type: 'string', description: 'The Ethereum address that was looked up (checksummed 0x format)' }, name: { type: 'string', description: 'Primary ENS name for this address, or null if no reverse record is set' } } } },
            tests: [
                { _description: 'Reverse lookup Vitalik address', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
                { _description: 'Reverse lookup Nick Johnson address', address: '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5' },
                { _description: 'Reverse lookup ENS deployer', address: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' }
            ],
        },
        getTextRecords: {
            method: 'GET',
            path: '/',
            description: 'Get all common ENS text records for a name: twitter, github, url, email, avatar, description. Returns null for unset fields. Use getAvatar for just the avatar URL.',
            parameters: [
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(3)'] }, description: 'ENS name to fetch text records for, e.g. vitalik.eth' }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', description: 'ENS text records for the specified name', properties: { name: { type: 'string', description: 'The ENS name queried' }, records: { type: 'object', description: 'Key-value pairs of common text record fields', properties: { twitter: { type: 'string', nullable: true, description: 'Twitter/X handle (without @) or null if not set' }, github: { type: 'string', nullable: true, description: 'GitHub username or null if not set' }, url: { type: 'string', nullable: true, description: 'Personal or project website URL or null if not set' }, email: { type: 'string', nullable: true, description: 'Contact email address or null if not set' }, avatar: { type: 'string', nullable: true, description: 'Avatar URL (HTTPS, IPFS, or NFT URI) or null if not set' }, description: { type: 'string', nullable: true, description: 'Free-text profile description or null if not set' } } } } } },
            tests: [
                { _description: 'Text records for vitalik.eth', name: 'vitalik.eth' },
                { _description: 'Text records for andr3a5.eth', name: 'andr3a5.eth' },
                { _description: 'Text records for nick.eth', name: 'nick.eth' }
            ],
        },
        getAvatar: {
            method: 'GET',
            path: '/',
            description: 'Get the avatar URL for an ENS name. Returns the avatar text record if set, null otherwise. For all text records, use getTextRecords instead.',
            parameters: [
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(3)'] }, description: 'ENS name to fetch avatar for, e.g. vitalik.eth' }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', description: 'ENS avatar resolution result', properties: { name: { type: 'string', description: 'The ENS name queried' }, avatar: { type: 'string', nullable: true, description: 'Avatar URL (HTTPS, IPFS, or NFT URI like eip155:1/erc721:...) or null if not set' } } } },
            tests: [
                { _description: 'Avatar for vitalik.eth', name: 'vitalik.eth' },
                { _description: 'Avatar for nick.eth', name: 'nick.eth' },
                { _description: 'Avatar for andr3a5.eth', name: 'andr3a5.eth' }
            ],
        },
        getContentHash: {
            method: 'GET',
            path: '/',
            description: 'Get the content hash (IPFS or Swarm) stored for an ENS name. Used for decentralized website hosting via ENS. Returns null if no content hash is set.',
            parameters: [
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(3)'] }, description: 'ENS name to fetch content hash for, e.g. vitalik.eth' }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', description: 'ENS content hash resolution result', properties: { name: { type: 'string', description: 'The ENS name queried' }, contentHash: { type: 'string', nullable: true, description: 'Content hash URI (e.g. ipfs://Qm... or bzz://...) or null if not set' } } } },
            tests: [
                { _description: 'Content hash for vitalik.eth', name: 'vitalik.eth' },
                { _description: 'Content hash for nick.eth', name: 'nick.eth' },
                { _description: 'Content hash for andr3a5.eth', name: 'andr3a5.eth' }
            ],
        }
    },
    requiredLibraries: ['ethers']
}


export const handlers = ( { sharedLists, libraries } ) => {
    const ethers = libraries['ethers']
    const PUBLIC_RPC = 'https://ethereum-rpc.publicnode.com'

    return {
        resolveName: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { name } = userParams
                try {
                    const provider = new ethers.JsonRpcProvider( PUBLIC_RPC )
                    const address = await provider.resolveName( String( name ).trim() )
                    if( !address ) {
                        struct.status = false
                        struct.messages.push( `No address found for "${name}". Name may not exist or has no ETH address set.` )
                        return { struct }
                    }
                    struct.data = { name, address }
                    struct.status = true
                } catch( e ) {
                    struct.status = false
                    struct.messages.push( e?.message || `Resolution failed for "${name}".` )
                }
                return { struct }
            }
        },
        lookupAddress: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { address } = userParams
                try {
                    const provider = new ethers.JsonRpcProvider( PUBLIC_RPC )
                    const name = await provider.lookupAddress( address )
                    if( !name ) {
                        struct.status = false
                        struct.messages.push( `No ENS name set for address "${address}".` )
                        return { struct }
                    }
                    struct.data = { address: ethers.getAddress( address ), name }
                    struct.status = true
                } catch( e ) {
                    struct.status = false
                    struct.messages.push( e?.message || `Reverse lookup failed for "${address}".` )
                }
                return { struct }
            }
        },
        getTextRecords: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { name } = userParams
                try {
                    const provider = new ethers.JsonRpcProvider( PUBLIC_RPC )
                    const resolver = await provider.getResolver( String( name ).trim() )
                    if( !resolver ) {
                        struct.status = false
                        struct.messages.push( `No resolver found for "${name}". Name may not exist.` )
                        return { struct }
                    }
                    const keys = ['com.twitter', 'com.github', 'url', 'email', 'avatar', 'description']
                    const entries = await Promise.all(
                        keys.map( async ( key ) => {
                            const value = await resolver.getText( key )
                            return [key.replace( 'com.', '' ), value || null]
                        } )
                    )
                    const records = Object.fromEntries( entries )
                    struct.data = { name, records }
                    struct.status = true
                } catch( e ) {
                    struct.status = false
                    struct.messages.push( e?.message || `Failed to fetch text records for "${name}".` )
                }
                return { struct }
            }
        },
        getAvatar: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { name } = userParams
                try {
                    const provider = new ethers.JsonRpcProvider( PUBLIC_RPC )
                    const resolver = await provider.getResolver( String( name ).trim() )
                    if( !resolver ) {
                        struct.status = false
                        struct.messages.push( `No resolver found for "${name}". Name may not exist.` )
                        return { struct }
                    }
                    const avatar = await resolver.getText( 'avatar' )
                    struct.data = { name, avatar: avatar || null }
                    struct.status = true
                } catch( e ) {
                    struct.status = false
                    struct.messages.push( e?.message || `Failed to fetch avatar for "${name}".` )
                }
                return { struct }
            }
        },
        getContentHash: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { name } = userParams
                try {
                    const provider = new ethers.JsonRpcProvider( PUBLIC_RPC )
                    const resolver = await provider.getResolver( String( name ).trim() )
                    if( !resolver ) {
                        struct.status = false
                        struct.messages.push( `No resolver found for "${name}". Name may not exist.` )
                        return { struct }
                    }
                    const contentHash = await resolver.getContentHash()
                    struct.data = { name, contentHash: contentHash || null }
                    struct.status = true
                } catch( e ) {
                    struct.status = false
                    struct.messages.push( e?.message || `Failed to fetch content hash for "${name}".` )
                }
                return { struct }
            }
        }
    }
}
