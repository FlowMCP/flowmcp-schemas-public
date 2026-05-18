export const main = {
    namespace: 'smithsonian',
    name: 'SmithsonianOpenAccess',
    description: 'Search the Smithsonian Institution Open Access collection — 11M+ museum objects, artworks, specimens, and artifacts across all Smithsonian museums.',
    version: '4.0.0',
    docs: ['https://www.si.edu/openaccess/devtools', 'https://edan.si.edu/openaccess/docs/'],
    tags: ['museum', 'art', 'culture', 'science', 'history', 'cacheTtlDaily'],
    root: 'https://api.si.edu',
    requiredServerParams: ['API_DATA_GOV_KEY'],
    headers: {},
    tools: {
        searchCollection: {
            method: 'GET',
            path: '/openaccess/api/v1.0/search',
            description: 'Full-text search across all Smithsonian Open Access collections. Returns museum objects, artworks, specimens, and artifacts matching the query.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } },
                { position: { key: 'rows', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(relevancy,id,newest,updated,random)', options: ['optional()'] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(edanmdm,ead_collection,ead_component,sova_collection,sova_series)', options: ['optional()'] } },
                { position: { key: 'row_group', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for dinosaur fossils', q: 'dinosaur fossil', rows: 10 },
                { _description: 'Search for Apollo space mission artifacts', q: 'Apollo space mission', rows: 5, sort: 'relevancy' },
                { _description: 'Search for Monet paintings', q: 'Monet painting', rows: 10, type: 'edanmdm' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'number', description: 'Response status code' },
                        rowCount: { type: 'number', description: 'Total matching records' },
                        rows: {
                            type: 'array',
                            description: 'Array of collection objects',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', description: 'Unique object identifier' },
                                    title: { type: 'string', description: 'Object title' },
                                    unitCode: { type: 'string', description: 'Smithsonian unit code (e.g. NASM, NMNH)' },
                                    type: { type: 'string', description: 'Record type' },
                                    url: { type: 'string', description: 'URL to object detail page' },
                                    content: {
                                        type: 'object',
                                        description: 'Full metadata including descriptive notes, dates, topics'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        searchByCategory: {
            method: 'GET',
            path: '/openaccess/api/v1.0/category/:category/search',
            description: 'Search within a specific Smithsonian category. Categories: art_design (art and design), history_culture (history and culture), science_technology (science and technology).',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'category', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(art_design,history_culture,science_technology)', options: [] } },
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } },
                { position: { key: 'rows', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(relevancy,id,newest,updated,random)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for impressionist art', category: 'art_design', q: 'impressionist', rows: 10 },
                { _description: 'Search for Civil War history artifacts', category: 'history_culture', q: 'Civil War', rows: 10 },
                { _description: 'Search for meteorite specimens', category: 'science_technology', q: 'meteorite', rows: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'number' },
                        rowCount: { type: 'number' },
                        rows: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    title: { type: 'string' },
                                    unitCode: { type: 'string' },
                                    type: { type: 'string' },
                                    content: { type: 'object' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getContent: {
            method: 'GET',
            path: '/openaccess/api/v1.0/content/:id',
            description: 'Retrieve full metadata for a specific Smithsonian collection object by its unique identifier. Returns complete descriptive data, media links, and provenance.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get details for Wright Brothers flyer (NASM)', id: 'nasm_A19610048000' },
                { _description: 'Get details for Hope Diamond (NMNH)', id: 'nmnh_G10010' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'number' },
                        response: {
                            type: 'object',
                            description: 'Full object metadata',
                            properties: {
                                id: { type: 'string' },
                                title: { type: 'string' },
                                unitCode: { type: 'string' },
                                linkedId: { type: 'string' },
                                type: { type: 'string' },
                                content: {
                                    type: 'object',
                                    description: 'Complete metadata including descriptive notes, dates, places, topics, media'
                                }
                            }
                        }
                    }
                }
            }
        },
        getTerms: {
            method: 'GET',
            path: '/openaccess/api/v1.0/terms/:category',
            description: 'Get available terms for a given term category. Useful for discovering filter values and understanding the taxonomy.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'category', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(culture,data_source,date,object_type,online_media_type,place,set_name,topic,unit_code)', options: [] } },
                { position: { key: 'starts_with', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get all unit codes (museum identifiers)', category: 'unit_code' },
                { _description: 'Get object types starting with P', category: 'object_type', starts_with: 'P' },
                { _description: 'Get available culture terms', category: 'culture' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'number' },
                        terms: {
                            type: 'array',
                            description: 'Array of term strings for the given category',
                            items: { type: 'string' }
                        }
                    }
                }
            }
        },
        getStats: {
            method: 'GET',
            path: '/openaccess/api/v1.0/stats',
            description: 'Get aggregate statistics about the Smithsonian Open Access collection including total CC0 objects and media counts.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get current Open Access collection statistics' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'number' },
                        stats: {
                            type: 'object',
                            description: 'Collection statistics',
                            properties: {
                                total_cc0: { type: 'number', description: 'Total CC0-licensed objects' },
                                total_media: { type: 'number', description: 'Total media files' }
                            }
                        }
                    }
                }
            }
        }
    }
}
