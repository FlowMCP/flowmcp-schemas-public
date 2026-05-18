// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'pflanzenschutzmittel',
    name: 'BVL Pflanzenschutzmittel API',
    description: 'German Federal Office of Consumer Protection (BVL) pesticide registration database with approved products, active ingredients, companies, and usage restrictions',
    version: '4.0.0',
    docs: ['https://pflanzenschutzmittelzulassung.api.bund.dev/'],
    tags: ['agriculture', 'germany', 'pesticides', 'regulation', 'cacheTtlDaily'],
    root: 'https://psm-api.bvl.bund.de/ords/psm/api-v1',
    tools: {
        getProducts: {
            method: 'GET',
            path: '/mittel/',
            description: 'Get approved pesticide products with registration number, name, formulation type, and approval dates. Use kennr for specific lookup. Cross-reference with getActiveIngredients for ingredients and getRestrictions for usage conditions.',
            parameters: [
                { position: { key: 'kennr', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get all approved pesticide products' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { m_row$$: { type: 'string' }, kennr: { type: 'string' }, versuchsbez: { type: 'string' }, zul_erstmalig_am: { type: 'string' }, mittelname: { type: 'string' }, formulierung_art: { type: 'string' }, zul_ende: { type: 'string' }, mittel_mit_geringem_risiko: { type: 'string', nullable: true } } } },
                        hasMore: { type: 'boolean' },
                        limit: { type: 'number' },
                        offset: { type: 'number' },
                        count: { type: 'number' },
                        links: { type: 'array', items: { type: 'object', properties: { rel: { type: 'string' }, href: { type: 'string' } } } }
                    }
                }
            },
        },
        getActiveIngredients: {
            method: 'GET',
            path: '/wirkstoff/',
            description: 'Get all active ingredients (Wirkstoffe) used in pesticides with approval status and English names. Cross-reference with getProducts for products containing specific ingredients.',
            parameters: [
                { position: { key: 'wirknr', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get all active ingredients' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { m_row$$: { type: 'string' }, wirknr: { type: 'string' }, wirkstoffname: { type: 'string' }, wirkstoffname_en: { type: 'string' }, kategorie: { type: 'string' }, genehmigt: { type: 'string' } } } },
                        hasMore: { type: 'boolean' },
                        limit: { type: 'number' },
                        offset: { type: 'number' },
                        count: { type: 'number' },
                        links: { type: 'array', items: { type: 'object', properties: { rel: { type: 'string' }, href: { type: 'string' } } } }
                    }
                }
            },
        },
        getCompanies: {
            method: 'GET',
            path: '/adresse/',
            description: 'Get pesticide distribution companies, applicants, and importers with addresses and contact details.',
            parameters: [
                { position: { key: 'adresse_nr', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get all pesticide companies' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { firma: { type: 'string', nullable: true }, firmenname: { type: 'string' }, ansprechpartner: { type: 'string', nullable: true }, anschrift_1: { type: 'string' }, anschrift_2: { type: 'string', nullable: true }, anschrift_3: { type: 'string', nullable: true }, anschrift_4: { type: 'string', nullable: true }, anschrift_5: { type: 'string' }, anschrift_6: { type: 'string' }, e_mail: { type: 'string', nullable: true }, fax: { type: 'string' }, telefon: { type: 'string' }, land: { type: 'string' }, adresse_nr: { type: 'number' } } } },
                        hasMore: { type: 'boolean' },
                        limit: { type: 'number' },
                        offset: { type: 'number' },
                        count: { type: 'number' },
                        links: { type: 'array', items: { type: 'object', properties: { rel: { type: 'string' }, href: { type: 'string' } } } }
                    }
                }
            },
        },
        getRestrictions: {
            method: 'GET',
            path: '/auflagen/',
            description: 'Get usage restrictions and conditions (Auflagen) for approved pesticide products.',
            parameters: [],
            tests: [
                { _description: 'Get all pesticide restrictions' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object', properties: { m_row$$: { type: 'string' }, auflage: { type: 'string' }, weitere_bedingung: { type: 'string', nullable: true }, ebene: { type: 'string' }, kultur: { type: 'string', nullable: true }, anwendungstechnik: { type: 'string', nullable: true }, abstand: { type: 'string', nullable: true }, anwendbest: { type: 'string' }, redu_abstand: { type: 'string', nullable: true }, auflagenr: { type: 'number' } } } },
                        hasMore: { type: 'boolean' },
                        limit: { type: 'number' },
                        offset: { type: 'number' },
                        count: { type: 'number' },
                        links: { type: 'array', items: { type: 'object', properties: { rel: { type: 'string' }, href: { type: 'string' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getProducts: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.items ) { return { response }}

            const products = raw.items
            .slice( 0, 200 )
            .map( ( item ) => {
            const result = {
            registrationNumber: item.kennr || null,
            name: item.mittelname || null,
            formulationType: item.formulierung_art || null,
            approvedSince: item.zul_erstmalig_am || null,
            approvalEnd: item.zul_ende || null,
            lowRisk: item.mittel_mit_geringem_risiko || null
            }

            return result
            } )

            response = {
            totalProducts: raw.items.length,
            productCount: products.length,
            products
            }

            return { response }
        }
    },
    getActiveIngredients: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.items ) { return { response }}

            const ingredients = raw.items
            .slice( 0, 200 )
            .map( ( item ) => {
            const result = {
            id: item.wirknr || null,
            name: item.wirkstoffname || null,
            nameEn: item.wirkstoffname_en || null,
            category: item.kategorie || null,
            approved: item.genehmigt || null
            }

            return result
            } )

            response = {
            totalIngredients: raw.items.length,
            ingredientCount: ingredients.length,
            ingredients
            }

            return { response }
        }
    },
    getCompanies: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.items ) { return { response }}

            const companies = raw.items
            .slice( 0, 200 )
            .map( ( item ) => {
            const result = {
            id: item.adresse_nr || null,
            company: item.firma || null,
            companyName: item.firmenname || null,
            country: item.land || null,
            address: item.anschrift_5 || null,
            city: item.anschrift_6 || null
            }

            return result
            } )

            response = {
            totalCompanies: raw.items.length,
            companyCount: companies.length,
            companies
            }

            return { response }
        }
    },
    getRestrictions: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.items ) { return { response }}

            const restrictions = raw.items
            .slice( 0, 200 )
            .map( ( item ) => {
            const result = {
            restriction: item.auflage || null,
            level: item.ebene || null,
            usageCondition: item.anwendbest || null,
            id: item.auflagenr || null
            }

            return result
            } )

            response = {
            totalRestrictions: raw.items.length,
            restrictionCount: restrictions.length,
            restrictions
            }

            return { response }
        }
    }
} )
