export const main = {
    namespace: 'iucnredlist',
    name: 'IUCN Red List',
    description: 'Access the IUCN Red List of Threatened Species v4 API. Query species assessments by taxonomy, country, habitat, threat category, and conservation status for 150,000+ assessed species worldwide.',
    version: '4.0.0',
    docs: ['https://api.iucnredlist.org/api-docs/index.html'],
    tags: ['science', 'conservation', 'biodiversity', 'species', 'environment', 'cacheTtlDaily'],
    root: 'https://api.iucnredlist.org',
    requiredServerParams: ['IUCN_API_TOKEN'],
    headers: {
        'Authorization': '{{IUCN_API_TOKEN}}'
    },
    tools: {
        getAssessment: {
            method: 'GET',
            path: '/api/v4/assessment/:assessmentId',
            description: 'Retrieve full assessment data for a specific assessment ID. Returns species name, Red List category, population trend, habitats, threats, and conservation actions.',
            parameters: [
                { position: { key: 'assessmentId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get assessment for African Elephant', assessmentId: 181008073 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        assessment_id: { type: 'number' },
                        sis_taxon_id: { type: 'number' },
                        scientific_name: { type: 'string' },
                        red_list_category: { type: 'object', properties: { code: { type: 'string' }, description: { type: 'string' } } },
                        population_trend: { type: 'object', properties: { code: { type: 'string' }, description: { type: 'string' } } },
                        year_published: { type: 'number' }
                    }
                }
            },
        },
        getSpeciesByName: {
            method: 'GET',
            path: '/api/v4/taxa/scientific_name',
            description: 'Search for species assessments by scientific name (Latin binomial or trinomial). Returns all matching assessment records.',
            parameters: [
                { position: { key: 'genus_name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'species_name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'infra_name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get assessments for Panthera tigris (Tiger)', genus_name: 'Panthera', species_name: 'tigris' },
                { _description: 'Get assessments for Gorilla gorilla (Western Gorilla)', genus_name: 'Gorilla', species_name: 'gorilla' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        assessments: { type: 'array', items: { type: 'object', properties: { assessment_id: { type: 'number' }, sis_taxon_id: { type: 'number' }, scientific_name: { type: 'string' }, red_list_category: { type: 'object' }, year_published: { type: 'number' } } } }
                    }
                }
            },
        },
        getSpeciesByCountry: {
            method: 'GET',
            path: '/api/v4/countries/:code',
            description: 'Get all species assessments for a specific country by ISO alpha-2 code. Returns paginated list of assessed species present in that country.',
            parameters: [
                { position: { key: 'code', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'year_published', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'latest', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get species assessed in Brazil', code: 'BR', page: 0 },
                { _description: 'Get species assessed in Madagascar', code: 'MG', page: 0 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        assessments: { type: 'array', items: { type: 'object', properties: { assessment_id: { type: 'number' }, scientific_name: { type: 'string' }, red_list_category: { type: 'object' } } } },
                        page: { type: 'number' }
                    }
                }
            },
        },
        getSpeciesByCategory: {
            method: 'GET',
            path: '/api/v4/red_list_categories/:code',
            description: 'Get all species assessments for a specific Red List category. Categories include CR (Critically Endangered), EN (Endangered), VU (Vulnerable), NT (Near Threatened), LC (Least Concern), DD (Data Deficient), EW (Extinct in the Wild), EX (Extinct).',
            parameters: [
                { position: { key: 'code', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(CR,EN,VU,NT,LC,DD,EW,EX,NE)', options: [] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'year_published', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'latest', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get all Critically Endangered species', code: 'CR', page: 0 },
                { _description: 'Get all Extinct in the Wild species', code: 'EW', page: 0 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        assessments: { type: 'array', items: { type: 'object', properties: { assessment_id: { type: 'number' }, scientific_name: { type: 'string' }, red_list_category: { type: 'object' }, population_trend: { type: 'object' } } } },
                        page: { type: 'number' }
                    }
                }
            },
        },
        getSpeciesByHabitat: {
            method: 'GET',
            path: '/api/v4/habitats/:code',
            description: 'Get species assessments for a specific habitat type per IUCN Habitats Classification Scheme v3.1. Examples: 1 (Forest), 2 (Savanna), 3 (Shrubland), 4 (Grassland), 5 (Wetlands).',
            parameters: [
                { position: { key: 'code', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'latest', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get species in Forest habitat', code: '1', page: 0 },
                { _description: 'Get species in Wetlands (Inland)', code: '5', page: 0 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        assessments: { type: 'array', items: { type: 'object', properties: { assessment_id: { type: 'number' }, scientific_name: { type: 'string' }, red_list_category: { type: 'object' } } } },
                        page: { type: 'number' }
                    }
                }
            },
        },
        getSpeciesByThreat: {
            method: 'GET',
            path: '/api/v4/threats/:code',
            description: 'Get species assessments affected by a specific threat type. Examples: 1 (Residential/Commercial Development), 2 (Agriculture/Aquaculture), 5 (Biological Resource Use), 11 (Climate Change).',
            parameters: [
                { position: { key: 'code', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'latest', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get species threatened by Climate Change', code: '11', page: 0 },
                { _description: 'Get species threatened by Biological Resource Use', code: '5', page: 0 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        assessments: { type: 'array', items: { type: 'object', properties: { assessment_id: { type: 'number' }, scientific_name: { type: 'string' }, red_list_category: { type: 'object' } } } },
                        page: { type: 'number' }
                    }
                }
            },
        },
        getSpeciesCount: {
            method: 'GET',
            path: '/api/v4/statistics/count',
            description: 'Get the total count of species with assessments on the IUCN Red List.',
            parameters: [],
            tests: [
                { _description: 'Get total species count' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number' }
                    }
                }
            },
        },
        listCountries: {
            method: 'GET',
            path: '/api/v4/countries/',
            description: 'List all countries available in the IUCN Red List with their ISO alpha-2 codes.',
            parameters: [],
            tests: [
                { _description: 'Get list of all countries' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        countries: { type: 'array', items: { type: 'object', properties: { code: { type: 'string' }, name: { type: 'string' } } } }
                    }
                }
            },
        }
    }
}
