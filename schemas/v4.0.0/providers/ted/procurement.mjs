// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'ted',
    name: 'TED EU Public Procurement API',
    description: 'Tenders Electronic Daily (TED) API providing access to EU public procurement notices with expert query search across all EU member states',
    version: '4.0.0',
    docs: ['https://docs.ted.europa.eu/api/latest/index.html'],
    tags: ['procurement', 'europe', 'tenders', 'government', 'cacheTtlDaily'],
    root: 'https://api.ted.europa.eu/v3/notices',
    tools: {
        searchNotices: {
            method: 'POST',
            path: '/search',
            description: 'Search EU public procurement notices using TED expert query syntax. Query examples: \'CY = DEU\' (German notices), \'CY = DEU AND PD >= 20260101\' (German from Jan 2026), \'ND = 123456-2026\' (by number). Country codes: DEU, FRA, ITA, ESP, etc.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(10)', 'optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['min(1)', 'default(1)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Search German procurement notices from 2026', query: 'CY = DEU AND PD >= 20260101', limit: 5 },
                { _description: 'Search all recent EU notices', query: 'PD >= 20260101', limit: 3 }
            ],
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    searchNotices: {
        executeRequest: async ( { struct, payload } ) => {
            const { userParams } = payload
            const { query, limit, page } = userParams
            const body = {
            query,
            scope: 'ALL',
            limit: limit || 10,
            page: page || 1,
            fields: [
            'notice-title',
            'publication-number',
            'publication-date',
            'notice-type',
            'buyer-name',
            'place-of-performance'
            ]
            }

            const response = await fetch( 'https://api.ted.europa.eu/v3/notices/search', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            body: JSON.stringify( body )
            } )

            if( !response.ok ) {
            struct.status = false
            struct.messages.push( `TED API error: ${response.status}` )

            return { struct }}

            struct.data = await response.json()

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.notices ) { return { response }}

            const notices = raw.notices
            .map( ( notice ) => {
            const buyerName = notice[ 'buyer-name' ]
            const firstLang = buyerName ? Object.keys( buyerName )[ 0 ] : null
            const buyers = firstLang ? buyerName[ firstLang ] : []

            const result = {
            publicationNumber: notice[ 'publication-number' ] || null,
            title: notice[ 'notice-title' ] || null,
            type: notice[ 'notice-type' ] || null,
            publicationDate: notice[ 'publication-date' ] || null,
            buyer: Array.isArray( buyers ) ? buyers[ 0 ] : null,
            placeOfPerformance: notice[ 'place-of-performance' ] || null,
            tedUrl: notice?.links?.html?.DEU || notice?.links?.html?.ENG || null
            }

            return result
            } )

            response = {
            noticeCount: notices.length,
            notices
            }

            return { response }
        }
    }
} )
