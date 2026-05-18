export const main = {
    namespace: 'vanda',
    name: 'VandaMuseum',
    description: 'Search and retrieve records from the Victoria and Albert Museum collection — over 1 million objects spanning 5,000 years of art and design.',
    version: '4.0.0',
    docs: ['https://developers.vam.ac.uk/guide/v2/'],
    tags: ['museum', 'art', 'culture', 'design', 'history', 'cacheTtlStatic'],
    root: 'https://api.vam.ac.uk',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchObjects: {
            method: 'GET',
            path: '/v2/objects/search',
            description: 'Search the V&A collection by keyword, material, technique, place, date range or maker.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'q_object_type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'q_actor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'q_place_name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'q_material_technique', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'made_after_year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'made_before_year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'images_exist', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] } },
                { position: { key: 'page_size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'order_by', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(location,artist,place,date,fields_populated)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for ceramic objects with images', q: 'ceramics', images_exist: true, page_size: 10 },
                { _description: 'Search for William Morris designed objects', q_actor: 'William Morris', page_size: 5 },
                { _description: 'Search for Japanese prints made between 1800 and 1900', q: 'print', q_place_name: 'Japan', made_after_year: 1800, made_before_year: 1900, page_size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        info: { type: 'object', description: 'Pagination info including record_count, page_count' },
                        records: { type: 'array', description: 'Array of collection object records' }
                    }
                }
            }
        },
        getObject: {
            method: 'GET',
            path: '/v2/museumobject/:systemNumber',
            description: 'Retrieve full metadata for a single V&A collection object by its system number.',
            parameters: [
                { position: { key: 'systemNumber', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get details for a known V&A object (a famous Tipu Sultan tiger)', systemNumber: 'O9' },
                { _description: 'Get details for a V&A textile object', systemNumber: 'O74241' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        record: { type: 'object', description: 'Full object metadata including title, maker, date, materials, images' },
                        meta: { type: 'object', description: 'API metadata about the response' }
                    }
                }
            }
        },
        clusterSearch: {
            method: 'GET',
            path: '/v2/objects/clusters/search',
            description: 'Search the V&A collection and return clustered facet counts for exploration across controlled vocabulary fields.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'q_actor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get cluster overview for furniture collection', q: 'furniture' },
                { _description: 'Get clusters for Picasso works', q_actor: 'Picasso' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        clusters: { type: 'object', description: 'Facet cluster counts per controlled vocabulary field' }
                    }
                }
            }
        },
        searchByMaterial: {
            method: 'GET',
            path: '/v2/objects/search',
            description: 'Search V&A collection objects filtered by material or technique using controlled vocabulary identifiers.',
            parameters: [
                { position: { key: 'id_material', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'id_technique', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'images_exist', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(true)'] } },
                { position: { key: 'page_size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] } }
            ],
            tests: [
                { _description: 'Search objects made of silk fabric', id_material: 'SILKF', page_size: 10 },
                { _description: 'Search objects using etching technique', id_technique: 'ETCH', page_size: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        info: { type: 'object', description: 'Pagination info' },
                        records: { type: 'array', description: 'Array of matching collection objects' }
                    }
                }
            }
        }
    }
}
