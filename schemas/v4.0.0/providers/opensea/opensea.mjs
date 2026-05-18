export const main = {
    namespace: 'opensea',
    name: 'OpenSea NFT Marketplace API',
    description: 'NFT marketplace data including collection stats, listings, offers, events, and NFT metadata from OpenSea v2 API. Use getCollection for metadata and getCollectionStats for floor price and volume.',
    version: '4.0.0',
    docs: ['https://docs.opensea.io/reference/api-overview'],
    tags: ['nft', 'marketplace', 'ethereum', 'cacheTtlFrequent'],
    root: 'https://api.opensea.io/api/v2',
    requiredServerParams: ['OPENSEA_API_KEY'],
    headers: {
        'x-api-key': '{{OPENSEA_API_KEY}}'
    },
    tools: {
        getCollectionStats: {
            method: 'GET',
            description: 'Get collection statistics including floor price, total volume, number of owners, and sales count for a given collection slug. For collection metadata use getCollection.',
            path: '/collections/:collectionSlug/stats',
            parameters: [
                { position: { key: 'collectionSlug', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Get stats for Bored Ape Yacht Club', collectionSlug: 'boredapeyachtclub' },
                { _description: 'Get stats for CryptoPunks', collectionSlug: 'cryptopunks' }
            ],
        },
        getCollection: {
            method: 'GET',
            description: 'Get detailed collection information including name, description, image URLs, fees, social links, and associated contracts.',
            path: '/collections/:collectionSlug',
            parameters: [
                { position: { key: 'collectionSlug', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Get collection details for Bored Ape Yacht Club', collectionSlug: 'boredapeyachtclub' },
                { _description: 'Get collection details for Azuki', collectionSlug: 'azuki' }
            ],
        },
        getNft: {
            method: 'GET',
            description: 'Get metadata, traits, ownership information, and rarity for a single NFT by chain, contract address, and token identifier. Use getEventsByCollection to find recent NFT activity.',
            path: '/chain/:chain/contract/:address/nfts/:identifier',
            parameters: [
                { position: { key: 'chain', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(ethereum,polygon,arbitrum,optimism,base,avalanche,zora)', options: ['default(ethereum)'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'identifier', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Get BAYC #1 on Ethereum', chain: 'ethereum', address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', identifier: '1' },
                { _description: 'Get CryptoPunk #0 on Ethereum', chain: 'ethereum', address: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB', identifier: '0' }
            ],
        },
        getEventsByCollection: {
            method: 'GET',
            description: 'Get events for a collection including sales, transfers, listings, and offers with optional filtering by event type.',
            path: '/events/collection/:collectionSlug',
            parameters: [
                { position: { key: 'collectionSlug', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'event_type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(sale,transfer,listing,offer,cancel,redemption)', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(1)', 'max(200)', 'default(20)'] } },
                { position: { key: 'next', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get recent sales for BAYC', collectionSlug: 'boredapeyachtclub', event_type: 'sale', limit: 5 },
                { _description: 'Get recent listings for CryptoPunks', collectionSlug: 'cryptopunks', event_type: 'listing', limit: 5 }
            ],
        },
        getListingsByCollection: {
            method: 'GET',
            description: 'Get active listings for a collection sorted by price or date with optional pagination.',
            path: '/listings/collection/:collectionSlug/all',
            parameters: [
                { position: { key: 'collectionSlug', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(1)', 'max(100)', 'default(20)'] } },
                { position: { key: 'next', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get active listings for BAYC', collectionSlug: 'boredapeyachtclub', limit: 5 },
                { _description: 'Get active listings for Azuki', collectionSlug: 'azuki', limit: 5 }
            ],
        }
    }
}
