// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "coinbaseBazaar" -> "coinbasebazaar"

export const main = {
    namespace: 'coinbasebazaar',
    name: 'Coinbase Bazaar x402 Discovery',
    description: 'Discover x402-compatible paid resources and services available on the Coinbase Bazaar marketplace',
    version: '4.0.0',
    docs: ['https://docs.cdp.coinbase.com/x402/bazaar', 'https://www.x402.org/'],
    tags: ['payments', 'marketplace', 'crypto', 'cacheTtlDaily'],
    root: 'https://api.cdp.coinbase.com/platform/v2/x402/discovery',
    tools: {
        listResources: {
            method: 'GET',
            path: '/resources',
            description: 'List all x402-compatible paid resources registered on Coinbase Bazaar. Optional filters: limit, offset.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(20)', 'optional()'] }, description: 'Maximum number of resources to return per page (1-100)' },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)', 'optional()'] }, description: 'Number of resources to skip for pagination' }
            ],
            tests: [
                { _description: 'List first 5 resources', limit: 5 },
                { _description: 'List resources with default pagination', limit: 5 },
                { _description: 'List resources with offset', limit: 10, offset: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { accepts: { type: 'array', items: { type: 'object' } }, lastUpdated: { type: 'string' }, metadata: { type: 'object' }, resource: { type: 'string' }, type: { type: 'string' }, x402Version: { type: 'number' } } } },
                        pagination: { type: 'object', properties: { limit: { type: 'number' }, offset: { type: 'number' }, total: { type: 'number' } } },
                        x402Version: { type: 'number' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    listResources: {
        postRequest: async ( { response, struct, payload } ) => {
            try {
            const raw = response
            if( !raw || !raw.items ) {
            return { response }}

            const { items, pagination, x402Version } = raw

            const resources = items
            .map( ( item ) => {
            const accepts = ( item.accepts || [] )
            .map( ( a ) => {
            const result = {
            resource: a.resource,
            description: a.description,
            network: a.network,
            scheme: a.scheme,
            asset: a.asset,
            assetName: a.extra && a.extra.name,
            maxAmount: a.maxAmountRequired,
            payTo: a.payTo,
            mimeType: a.mimeType,
            maxTimeoutSeconds: a.maxTimeoutSeconds
            }

            return result
            } )

            const result = {
            resource: item.resource,
            type: item.type,
            x402Version: item.x402Version,
            lastUpdated: item.lastUpdated,
            paymentOptions: accepts
            }

            return result
            } )

            response = {
            source: "Coinbase Bazaar",
            x402Version,
            total: pagination && pagination.total,
            limit: pagination && pagination.limit,
            offset: pagination && pagination.offset,
            resourceCount: resources.length,
            resources
            }
            } catch( error ) {
            struct.status = false
            struct.messages.push( `Error formatting resource list: ${error.message}` )
            }

            return { response }
        }
    }
} )
