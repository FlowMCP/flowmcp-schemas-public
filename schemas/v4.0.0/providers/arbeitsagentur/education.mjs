// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'arbeitsagentur',
    name: 'Arbeitsagentur Ausbildungssuche API',
    description: 'German Federal Employment Agency apprenticeship and training search API providing access to vocational training offers across Germany with filtering options',
    version: '4.0.0',
    docs: ['https://ausbildungssuche.api.bund.dev/'],
    tags: ['education', 'germany', 'apprenticeship', 'training', 'cacheTtlDaily'],
    root: 'https://rest.arbeitsagentur.de/infosysbub/absuche',
    headers: {
        'X-API-Key': 'infosysbub-absuche'
    },
    tools: {
        searchApprenticeships: {
            method: 'GET',
            path: '/pc/v1/ausbildungsangebot?spipiinaktiv=0',
            description: 'Search for apprenticeship and vocational training offers in Germany. Returns training title, provider, location, duration, and content description.',
            parameters: [
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)', 'optional()'], description: 'Page number for pagination, starting at 0' } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(25)', 'optional()'], description: 'Number of results per page, between 1 and 100' } }
            ],
            tests: [
                { _description: 'Get first page of apprenticeships', size: 5 },
                { _description: 'Get second page of apprenticeships', page: 1, size: 5 },
                { _description: 'Get larger batch of apprenticeships', size: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        apprenticeshipCount: { type: 'number' },
                        apprenticeships: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, title: { type: 'string' }, provider: { type: 'string' }, teachingFormat: { type: 'string' }, duration: { type: 'string' } } } }
                    }
                }
            },
        },
        // BLOCKED: API returns HTTP 403 Forbidden — requires authentication not available via public X-API-Key
        searchStudyPrograms: {
            method: 'GET',
            path: '/studiensuche',
            description: 'Search for university study programs in Germany by subject keyword. Uses the Studiensuche API. Returns program name, university, location, degree type, and study format. NOTE: Currently blocked — API requires authentication.',
            parameters: [
                { position: { key: 'sw', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'], description: 'Search keyword for study subject, e.g. informatik, medizin, jura' } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)', 'optional()'], description: 'Page number for pagination, starting at 0' } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(25)', 'optional()'], description: 'Number of results per page, between 1 and 100' } }
            ],
            tests: [
                { _description: 'Search for computer science programs', sw: 'informatik', size: 5 },
                { _description: 'Search for medicine programs', sw: 'medizin', size: 5 },
                { _description: 'Search for law programs', sw: 'jura', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        programCount: { type: 'number' },
                        programs: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, university: { type: 'string' }, city: { type: 'string' }, degree: { type: 'string' }, format: { type: 'string' }, type: { type: 'string' }, start: { type: 'string' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    searchApprenticeships: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            const list = raw?._embedded?.termine
            if( !Array.isArray( list ) ) { return { response }}

            const apprenticeships = list
            .map( ( item ) => {
            const offer = item.angebot || {}
            const result = {
            id: item.id || null,
            title: offer.titel || null,
            provider: offer.anbieter?.name || null,
            teachingFormat: item.unterrichtsform?.bezeichnung || null,
            duration: item.dauer?.bezeichnung || null
            }

            return result
            } )

            response = {
            apprenticeshipCount: apprenticeships.length,
            apprenticeships
            }

            return { response }
        }
    },
    searchStudyPrograms: {
        executeRequest: async ( { struct, payload } ) => {
            const { userParams } = payload
            const { sw, page, size } = userParams
            const params = new URLSearchParams()
            params.set( 'sw', sw )
            if( page !== undefined ) { params.set( 'page', String( page ) ) }
            if( size !== undefined ) { params.set( 'size', String( size ) ) }

            const url = `https://rest.arbeitsagentur.de/infosysbub/studisu/pc/v1/studienangebote?${params.toString()}`
            const response = await fetch( url, {
            headers: { 'X-API-Key': 'infosysbub-studisu' }
            } )

            if( !response.ok ) {
            struct.status = false
            struct.messages.push( `Studiensuche API error: ${response.status}` )

            return { struct }}

            struct.data = await response.json()

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.items ) { return { response }}

            const programs = raw.items
            .map( ( item ) => {
            const offer = item.studienangebot || {}
            const result = {
            id: offer.id || null,
            name: offer.studiBezeichnung || null,
            university: offer.studienanbieter?.name || null,
            city: offer.studienort?.ort || null,
            degree: offer.abschlussgrad?.label || null,
            format: offer.studienform?.label || null,
            type: offer.hochschulart?.label || null,
            start: offer.studiBeginn || null
            }

            return result
            } )

            response = {
            programCount: programs.length,
            programs
            }

            return { response }
        }
    }
} )
