// Migrated from v1.2.0 -> v3.0.0
// Category: handlers-clean

export const main = {
    namespace: 'bonfida',
    name: 'Bonfida SNS API',
    description: 'Resolves Solana Name Service (.sol) domains to wallet addresses, retrieves favorite domains, and lists all domains owned by a wallet via the SNS SDK proxy.',
    version: '4.0.0',
    docs: ['https://docs.sns.id', 'https://github.com/Bonfida/sns-sdk'],
    tags: ['solana', 'naming', 'identity', 'domains'],
    root: 'https://sns-sdk-proxy.bonfida.workers.dev',
    requiredServerParams: [],
    headers: {},
    tools: {
        resolveDomain: {
            method: 'GET',
            path: '/resolve/:domain',
            description: 'Resolve a .sol domain name to its current owner wallet address. Returns the Solana public key that owns the given domain.',
            parameters: [
                { position: { key: 'domain', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)', 'max(64)'] }, description: 'Solana Name Service domain to resolve (without .sol suffix), e.g. bonfida' }
            ],
            tests: [
                { _description: 'Resolve bonfida.sol to owner address', domain: 'bonfida' },
                { _description: 'Resolve toly.sol to owner address', domain: 'toly' },
                { _description: 'Resolve wallet.sol domain', domain: 'wallet' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        s: { type: 'string' },
                        result: { type: 'string' }
                    }
                }
            }
        },
        getFavoriteDomain: {
            method: 'GET',
            path: '/favorite-domain/:owner',
            description: 'Get the favorite .sol domain for a given Solana wallet address. Returns the domain name and its account public key, or null if none is set.',
            parameters: [
                { position: { key: 'owner', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(32)', 'max(44)'] }, description: 'Solana wallet address (Base58 encoded, 32-44 characters) to look up the favorite domain for' }
            ],
            tests: [
                { _description: 'Get favorite domain for Bonfida wallet', owner: 'HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA' },
                { _description: 'Get favorite domain for toly wallet', owner: 'toly.sol' },
                { _description: 'Get favorite domain for Solana Foundation', owner: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        s: { type: 'string' },
                        result: { type: 'object', properties: { domain: { type: 'string' }, reverse: { type: 'string' } }, nullable: true }
                    }
                }
            }
        },
        getDomainsByOwner: {
            method: 'GET',
            path: '/domains/:owner',
            description: 'List all .sol domain account public keys owned by a given Solana wallet address. Returns an array of domain account keys.',
            parameters: [
                { position: { key: 'owner', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(32)', 'max(44)'] }, description: 'Solana wallet address (Base58 encoded, 32-44 characters) to list owned domains for' }
            ],
            tests: [
                { _description: 'Get all domains owned by Bonfida wallet', owner: 'HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA' },
                { _description: 'Get domains for Solana Foundation', owner: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM' },
                { _description: 'Get domains for known collector', owner: 'GJQjnyhSG9jN1AdMHTSyTxUR44hJHEGCmNzkidw9z3y8' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        s: { type: 'string' },
                        result: { type: 'array', items: { type: 'object', properties: { key: { type: 'string' }, domain: { type: 'string' } } } }
                    }
                }
            }
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    resolveDomain: {
        postRequest: async ( { response, struct, payload } ) => {
            if( !response || response.s !== 'ok' ) {
                struct.status = false
                struct.messages.push( `SNS resolve failed: ${response?.result || 'unknown error'}` )
                return { response }
            }

            response = { owner: response.result }
            return { response }
        }
    },
    getFavoriteDomain: {
        postRequest: async ( { response, struct, payload } ) => {
            if( !response || response.s !== 'ok' ) {
                struct.status = false
                struct.messages.push( `SNS favorite-domain failed: ${response?.result || 'unknown error'}` )
                return { response }
            }

            if( response.result === null ) {
                response = { domain: null, domainKey: null }
                return { response }
            }

            response = {
                domain: response.result['reverse'] || null,
                domainKey: response.result['domain'] || null
            }
            return { response }
        }
    }
} )
