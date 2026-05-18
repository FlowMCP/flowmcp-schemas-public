// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'solscan',
    name: 'SolscanChainInfo',
    description: 'Fetch general Solana blockchain information via Solscan — current block height, transaction count, TPS, total supply, and network health metrics.',
    version: '4.0.0',
    docs: ['https://docs.solscan.io/api-access/pro-api-endpoints'],
    tags: ['solana', 'explorer', 'blocks', 'cacheTtlFrequent'],
    root: 'https://public-api.solscan.io',
    requiredServerParams: ['SOLSCAN_API_KEY'],
    headers: {
        token: '{{SOLSCAN_API_KEY}}'
    },
    tools: {
        chainInfo: {
            method: 'GET',
            path: '/chaininfo',
            description: 'Returns Solana blockchain information such as block height and transaction count.',
            parameters: [],
            output: {mimeType:'application/json',schema:{type:'object',properties:{success:{type:'boolean'},data:{type:'object',properties:{blockHeight:{type:'number'},currentEpoch:{type:'number'},absoluteSlot:{type:'number'},transactionCount:{type:'number'}}}}}},
            tests: [
                { _description: 'Basic test to fetch chain information' }
            ],
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    chainInfo: {
        postRequest: async ( { response, struct, payload } ) => {
            if( !response['success'] ) {
                throw new Error( response?.message || 'Request failed' )
            }
            response = response['data']

            return { response }
        }
    }
} )
