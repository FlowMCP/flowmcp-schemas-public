export const main = {
    namespace: 'unescoworldheritage',
    name: 'UNESCO World Heritage',
    description: 'Query 1,200+ UNESCO World Heritage Sites with filters for country, category, danger status, and year of inscription. Free public API.',
    version: '4.0.0',
    docs: ['https://data.unesco.org/explore/dataset/whc001/api/'],
    tags: ['culture', 'heritage', 'geography', 'tourism', 'unesco', 'cacheTtlStatic'],
    root: 'https://data.unesco.org/api/explore/v2.1',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchSites: {
            method: 'GET',
            path: '/catalog/datasets/whc001/records',
            description: 'Search UNESCO World Heritage Sites with free-text queries, geographical filters, and category filters. Returns site details, coordinates, descriptions, and images.',
            parameters: [
                { position: { key: 'where', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'order_by', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'select', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get first 5 World Heritage Sites', limit: 5 },
                { _description: 'Search for sites in Germany', where: 'states_names="Germany"', limit: 10 },
                { _description: 'Search for natural heritage sites', where: 'category="Natural"', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        total_count: { type: 'number' },
                        results: { type: 'array', items: { type: 'object', properties: { name_en: { type: 'string' }, category: { type: 'string' }, states_names: { type: 'array' }, date_inscribed: { type: 'string' }, coordinates: { type: 'object' }, danger: { type: 'boolean' }, short_description_en: { type: 'string' }, area_hectares: { type: 'number' } } } }
                    }
                }
            },
        },
        getSitesByCountry: {
            method: 'GET',
            path: '/catalog/datasets/whc001/records',
            description: 'Get all World Heritage Sites for a specific country using ISO code filter.',
            parameters: [
                { position: { key: 'where', value: 'iso_codes="{{USER_PARAM}}"', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'Get World Heritage Sites in Italy', where: 'iso_codes="it"', limit: 10 },
                { _description: 'Get World Heritage Sites in France', where: 'iso_codes="fr"', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        total_count: { type: 'number' },
                        results: { type: 'array', items: { type: 'object', properties: { name_en: { type: 'string' }, category: { type: 'string' }, date_inscribed: { type: 'string' }, coordinates: { type: 'object' } } } }
                    }
                }
            },
        },
        getDangerSites: {
            method: 'GET',
            path: '/catalog/datasets/whc001/records',
            description: 'Get World Heritage Sites currently on the List of World Heritage in Danger.',
            parameters: [
                { position: { key: 'where', value: 'danger=true', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'Get all endangered World Heritage Sites', where: 'danger=true', limit: 20 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        total_count: { type: 'number' },
                        results: { type: 'array', items: { type: 'object', properties: { name_en: { type: 'string' }, states_names: { type: 'array' }, category: { type: 'string' }, danger: { type: 'boolean' }, danger_list: { type: 'string' } } } }
                    }
                }
            },
        },
        getDatasetInfo: {
            method: 'GET',
            path: '/catalog/datasets/whc001',
            description: 'Get metadata about the UNESCO World Heritage Sites dataset including field definitions, total record count, and last update date.',
            parameters: [],
            tests: [
                { _description: 'Get World Heritage dataset metadata' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        dataset: { type: 'object', properties: { dataset_id: { type: 'string' }, metas: { type: 'object' }, fields: { type: 'array' } } }
                    }
                }
            },
        }
    }
}
