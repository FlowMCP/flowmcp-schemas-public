export const main = {
    namespace: 'rxnorm',
    name: 'RxNorm',
    description: 'Access NLM RxNorm drug nomenclature data — look up drug concepts, find RxCUI identifiers, retrieve NDC codes, drug properties, and related medications.',
    version: '4.0.0',
    docs: ['https://lhncbc.nlm.nih.gov/RxNav/APIs/RxNormAPIs.html'],
    tags: ['health', 'drugs', 'medicine', 'pharmacy', 'nomenclature', 'cacheTtlDaily'],
    root: 'https://rxnav.nlm.nih.gov',
    requiredServerParams: [],
    headers: {},
    tools: {
        getDrugs: {
            method: 'GET',
            path: '/REST/drugs.json',
            description: 'Get drug products associated with a specified name. The name can be an ingredient, brand name, or dose form.',
            parameters: [
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for Cymbalta drug products', name: 'cymbalta' },
                { _description: 'Search for aspirin drug products', name: 'aspirin' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        drugGroup: {
                            type: 'object',
                            description: 'Drug group containing name and array of conceptGroup entries with rxcui, name, and tty'
                        }
                    }
                }
            }
        },
        findRxcuiByString: {
            method: 'GET',
            path: '/REST/rxcui.json',
            description: 'Find RxNorm concept identifiers (RxCUI) by drug name string, with configurable search precision from exact to approximate matching.',
            parameters: [
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(0,1,2,9)', options: ['optional()', 'default(0)'] } },
                { position: { key: 'allsrc', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(0,1)', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'Exact search for Lipitor 10 mg Tab', name: 'Lipitor 10 mg Tab', search: 1 },
                { _description: 'Approximate search for cabenuva', name: 'cabenuva', search: 9 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        idGroup: {
                            type: 'object',
                            description: 'ID group containing name and array of rxnormId values'
                        }
                    }
                }
            }
        },
        getRxNormName: {
            method: 'GET',
            path: '/REST/rxcui/:rxcui.json',
            description: 'Get the name of an RxNorm concept by its RxCUI identifier.',
            parameters: [
                { position: { key: 'rxcui', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get the name for RxCUI 131725', rxcui: '131725' },
                { _description: 'Get the name for RxCUI 213269', rxcui: '213269' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        idGroup: {
                            type: 'object',
                            description: 'ID group with name field containing the concept name'
                        }
                    }
                }
            }
        },
        getNDCs: {
            method: 'GET',
            path: '/REST/rxcui/:rxcui/ndcs.json',
            description: 'Retrieve active National Drug Codes (NDCs) for a specified RxNorm drug product concept.',
            parameters: [
                { position: { key: 'rxcui', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get NDCs for RxCUI 213269', rxcui: '213269' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        ndcGroup: {
                            type: 'object',
                            description: 'NDC group with rxcui and ndcList array in CMS 11-digit format'
                        }
                    }
                }
            }
        },
        getAllProperties: {
            method: 'GET',
            path: '/REST/rxcui/:rxcui/allProperties.json',
            description: 'Retrieve property categories (names, codes, attributes, sources) for an RxNorm concept.',
            parameters: [
                { position: { key: 'rxcui', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'prop', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get names and codes for aspirin (RxCUI 18600)', rxcui: '18600', prop: 'names' },
                { _description: 'Get all properties for acetaminophen (RxCUI 161)', rxcui: '161', prop: 'ALL' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        propConceptGroup: {
                            type: 'object',
                            description: 'Property concept group with arrays of propConcept entries containing propCategory, propName, and propValue'
                        }
                    }
                }
            }
        },
        getRelatedByRelationship: {
            method: 'GET',
            path: '/REST/rxcui/:rxcui/related.json',
            description: 'Find concepts directly related to a specified concept by relationship type (e.g., tradename_of, has_ingredient).',
            parameters: [
                { position: { key: 'rxcui', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'rela', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get tradenames for RxCUI 174742', rxcui: '174742', rela: 'tradename_of' },
                { _description: 'Get dose form relationships for acetaminophen', rxcui: '161', rela: 'has_dose_form' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        relatedGroup: {
                            type: 'object',
                            description: 'Related group with conceptGroup array containing related concepts by term type'
                        }
                    }
                }
            }
        },
        getRxNormVersion: {
            method: 'GET',
            path: '/REST/version.json',
            description: 'Get the current RxNorm data version and API version information.',
            parameters: [],
            tests: [
                { _description: 'Get current RxNorm version info' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        version: { type: 'string', description: 'Current RxNorm data version' }
                    }
                }
            }
        }
    }
}
