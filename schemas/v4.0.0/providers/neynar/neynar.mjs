export const main = {
    namespace: 'neynar',
    name: 'Neynar Farcaster API',
    description: 'Query Farcaster social protocol data — lookup users by username, FID or ETH address, fetch individual casts, and browse user cast feeds via Neynar REST API',
    version: '4.0.0',
    docs: ['https://docs.neynar.com'],
    tags: ['social', 'farcaster', 'crypto', 'cacheTtlFrequent'],
    root: 'https://api.neynar.com/v2/farcaster',
    requiredServerParams: ['NEYNAR_API_KEY'],
    headers: {
        'accept': 'application/json',
        'x-api-key': '{{NEYNAR_API_KEY}}'
    },
    tools: {
        getUserByUsername: {
            method: 'GET',
            path: '/user/by_username',
            description: 'Fetch a hydrated Farcaster user profile by username including bio, follower counts, verified addresses, and active status. Use getUsersByFid for lookup by numeric FID or getUsersByAddress for ETH address lookup.',
            parameters: [
                { position: { key: 'username', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'viewer_fid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(1)'] } }
            ],
            tests: [
                { _description: 'Lookup user profile for vitalik', username: 'vitalik.eth' },
                { _description: 'Lookup user profile for Dan Romero', username: 'dwr' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Hydrated Farcaster user profile with social metrics and verified addresses'
                }
            }
        },
        getUsersByFid: {
            method: 'GET',
            path: '/user/bulk',
            description: 'Bulk lookup Farcaster user profiles by their FID numbers. Returns hydrated profiles with bio, follower counts, and verified addresses. Accepts comma-separated FIDs. Use getUserCasts with a FID to get their posts.',
            parameters: [
                { position: { key: 'fids', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'viewer_fid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(1)'] } }
            ],
            tests: [
                { _description: 'Lookup Dan Romero (FID 3) and dwr.eth (FID 5650)', fids: '3,5650' },
                { _description: 'Lookup single user by FID', fids: '3' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Bulk user profile response with array of hydrated Farcaster profiles'
                }
            }
        },
        getUsersByAddress: {
            method: 'GET',
            path: '/user/bulk-by-address',
            description: 'Lookup Farcaster user profiles by their verified Ethereum addresses. Supports multiple comma-separated addresses. Useful for mapping on-chain activity to Farcaster identities.',
            parameters: [
                { position: { key: 'addresses', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'viewer_fid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(1)'] } }
            ],
            tests: [
                { _description: 'Lookup Farcaster user by Vitalik ETH address', addresses: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Address-keyed map of Farcaster user profiles associated with the queried ETH addresses'
                }
            }
        },
        getCast: {
            method: 'GET',
            path: '/cast',
            description: 'Fetch a single Farcaster cast by its hash or Warpcast URL, including author details, reactions, replies count, and embedded content. Use type parameter to specify whether identifier is a hash or URL.',
            parameters: [
                { position: { key: 'identifier', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(hash,url)', options: [] } },
                { position: { key: 'viewer_fid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(1)'] } }
            ],
            tests: [
                { _description: 'Get cast by hash', identifier: '0xa896906a5e397b4fec247c3ee0e9e4d4990b8004', type: 'hash' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Single Farcaster cast with author details, reactions, replies, and embeds'
                }
            }
        },
        getUserCasts: {
            method: 'GET',
            path: '/feed/user/casts',
            description: 'Fetch a paginated feed of casts authored by a specific Farcaster user, identified by their FID. Supports cursor-based pagination and optional reply inclusion. Use getUsersByFid or getUserByUsername to find a user FID first.',
            parameters: [
                { position: { key: 'fid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(1)', 'max(100)', 'default(25)'] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'include_replies', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'viewer_fid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(1)'] } }
            ],
            tests: [
                { _description: 'Get latest casts from Dan Romero (FID 3)', fid: 3, limit: 5 },
                { _description: 'Get latest casts from dwr.eth (FID 5650) with replies', fid: 5650, limit: 5, include_replies: true }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated feed of casts from a specific user with cursor for next page'
                }
            }
        }
    }
}
