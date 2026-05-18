// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'solsniffer',
    name: 'SolSniffer',
    description: 'Analyze Solana token security via SolSniffer — assess contract risks, detect rug-pull indicators, check mint authority, and retrieve token safety scores.',
    version: '4.0.0',
    docs: ['https://solsniffer.gitbook.io/solsniffer-user-guide'],
    tags: ['solana', 'security', 'analysis', 'cacheTtlFrequent'],
    root: 'https://solsniffer.com/api/v2/token',
    requiredServerParams: ['SOLSNIFFER_API_KEY'],
    headers: {
        'X-API-KEY': '{{SOLSNIFFER_API_KEY}}',
        accept: 'application/json'
    },
    tools: {
        analysisToken: {
            method: 'GET',
            path: '/:token_address',
            description: 'Analyze a Solana token using its address and return risk and token metadata. Required: token_address.',
            parameters: [
                { position: { key: 'token_address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(32)'] } }
            ],
            output: {mimeType:'application/json',schema:{type:'object',properties:{score:{type:'number'},risks:{type:'array',items:{type:'object'}},tokenData:{type:'object'}}}},
            tests: [
                { _description: 'Analyze USDC on Solana', token_address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' }
            ],
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    analysisToken: {
        postRequest: async ( { response, struct, payload } ) => {
            struct.analysis = payload?.content?.[0]?.json || {};
            return { response }
        }
    }
} )
