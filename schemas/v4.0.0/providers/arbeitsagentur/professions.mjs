// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'arbeitsagentur',
    name: 'Arbeitsagentur Berufenet API',
    description: 'German Federal Employment Agency BERUFENET encyclopedia providing comprehensive information on over 3500 professions in Germany with classification and grouping',
    version: '4.0.0',
    docs: ['https://berufenet.api.bund.dev/'],
    tags: ['professions', 'germany', 'employment', 'education', 'cacheTtlDaily'],
    root: 'https://rest.arbeitsagentur.de/infosysbub/bnet',
    headers: {
        'X-API-Key': 'infosysbub-berufenet',
        'Accept': '*/*'
    },
    tools: {
        searchProfessions: {
            method: 'GET',
            path: '/pc/v1/berufe?spipiinaktiv=0',
            description: 'Search and browse all professions in Germany\'s BERUFENET database. Returns profession names with IDs and classification groups. Supports pagination.',
            parameters: [
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)', 'optional()'] }, description: 'Zero-based page index for pagination' },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(25)', 'optional()'] }, description: 'Number of professions per page (1-100)' }
            ],
            tests: [
                { _description: 'Get first page of professions', size: 10 },
                { _description: 'Get second page with small page size', page: 1, size: 5 },
                { _description: 'Get professions with default pagination', page: 0 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        _embedded: { type: 'object', properties: { berufSucheList: { type: 'array', items: { type: 'object' } } } },
                        _links: { type: 'object', properties: { first: { type: 'object', properties: { href: { type: 'string' } } }, self: { type: 'object', properties: { href: { type: 'string' } } }, next: { type: 'object', properties: { href: { type: 'string' } } }, last: { type: 'object', properties: { href: { type: 'string' } } } } },
                        page: { type: 'object', properties: { size: { type: 'number' }, totalElements: { type: 'number' }, totalPages: { type: 'number' }, number: { type: 'number' } } },
                        aggregations: { type: 'object', properties: { BERUFSGRUPPEN: { type: 'array', items: { type: 'object' } } } }
                    }
                }
            },
        },
        getProfessionDetail: {
            method: 'GET',
            path: '/pc/v1/berufe/:id',
            description: 'Get detailed information about a specific profession by its BERUFENET ID. Use IDs from searchProfessions results.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)'] }, description: 'BERUFENET profession ID from search results' }
            ],
            tests: [
                { _description: 'Get profession detail for 3-D-Artist', id: 27272 },
                { _description: 'Get profession detail for 3-D-Druck-Spezialist', id: 134612 },
                { _description: 'Get profession detail for Account-Manager', id: 14475 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            kldb2010: { type: 'string' },
                            kurzBezeichnungNeutral: { type: 'string' },
                            bezeichnungNeutral: { type: 'string' },
                            codenr: { type: 'string' },
                            bilder: { type: 'array', items: { type: 'object' } },
                            bkgr: { type: 'object', properties: { id: { type: 'number' }, typ: { type: 'object' } } },
                            beschreibungszustand: { type: 'object', properties: { id: { type: 'string' } } },
                            infofelder: { type: 'array', items: { type: 'object' } },
                            steckbrief: { type: 'string', nullable: true },
                            aufstiegsweiterbildungen: { type: 'array', items: { type: 'object' } },
                            anpassungsweiterbildungen: { type: 'array', items: { type: 'object' } },
                            fachrichtungen: { type: 'array', items: { type: 'string' } },
                            metaFachrichtung: { type: 'string', nullable: true },
                            taetigkeitsfelder: { type: 'array', items: { type: 'object' } },
                            atEinsatzmoeglichkeiten: { type: 'array', items: { type: 'string' } },
                            berufDossier: { type: 'object', properties: { text: { type: 'string' }, filename: { type: 'string' } } },
                            metaeinheit: { type: 'boolean' }
                        }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    searchProfessions: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            const list = raw?._embedded?.berufSucheList
            if( !Array.isArray( list ) ) { return { response }}

            const professions = list
            .map( ( item ) => {
            const result = {
            id: item.id || null,
            name: item.kurzBezeichnungNeutral || null,
            groupId: item.bkgr?.id || null,
            type: item.bkgr?.typ?.id || null
            }

            return result
            } )

            response = {
            totalProfessions: raw.page?.totalElements || professions.length,
            page: raw.page?.number || 0,
            totalPages: raw.page?.totalPages || 1,
            professionCount: professions.length,
            professions
            }

            return { response }
        }
    },
    getProfessionDetail: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw ) { return { response }}

            const item = Array.isArray( raw ) ? raw[ 0 ] : raw
            if( !item ) { return { response }}

            response = {
            id: item.id || null,
            name: item.kurzBezeichnungNeutral || item.bezeichnungNeutral || null,
            classificationCode: item.kldb2010 || null,
            codeNumber: item.codenr || null
            }

            return { response }
        }
    }
} )
