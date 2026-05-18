export const main = {
    namespace: 'obis',
    name: 'OBIS',
    description: 'Query the Ocean Biodiversity Information System for marine species occurrences, taxonomy, checklists, and dataset metadata across 100M+ records worldwide.',
    version: '4.0.0',
    docs: ['https://api.obis.org/', 'https://manual.obis.org/access'],
    tags: ['biodiversity', 'ocean', 'marine', 'species', 'ecology', 'cacheTtlDaily'],
    root: 'https://api.obis.org/v3',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchOccurrences: {
            method: 'GET',
            path: '/occurrence',
            description: 'Search marine species occurrence records with filters for taxonomy, geography, time range, and dataset. Use taxonIDs from getChecklist or getTaxon to filter precisely.',
            parameters: [
                { position: { key: 'scientificname', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'taxonid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'startdate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'enddate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'geometry', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(10000)'] } },
                { position: { key: 'after', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for dolphin occurrences', scientificname: 'Delphinidae', size: 5 },
                { _description: 'Search for blue whale sightings', scientificname: 'Balaenoptera musculus', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        total: { type: 'number', description: 'Total number of matching occurrence records' },
                        results: { type: 'array', description: 'Array of marine species occurrence records', items: { type: 'object', properties: { scientificName: { type: 'string', description: 'Scientific name of the observed species' }, decimalLatitude: { type: 'number', description: 'Latitude of the observation' }, decimalLongitude: { type: 'number', description: 'Longitude of the observation' }, eventDate: { type: 'string', description: 'Date of the observation' }, datasetName: { type: 'string', description: 'Name of the contributing dataset' } } } }
                    }
                }
            },
        },
        getChecklist: {
            method: 'GET',
            path: '/checklist',
            description: 'Get a taxonomic checklist of marine species matching the given filters. Use returned taxonIDs in getTaxon for detailed info or searchOccurrences for sightings.',
            parameters: [
                { position: { key: 'scientificname', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'taxonid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'areaid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'max(10000)'] } }
            ],
            tests: [
                { _description: 'Get checklist for sea turtles', scientificname: 'Cheloniidae', size: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        results: { type: 'array', items: { type: 'object', properties: { taxonID: { type: 'number' }, scientificName: { type: 'string' }, kingdom: { type: 'string' }, phylum: { type: 'string' }, class: { type: 'string' }, order: { type: 'string' }, family: { type: 'string' }, records: { type: 'number' } } } }
                    }
                }
            },
        },
        getTaxon: {
            method: 'GET',
            path: '/taxon/:taxonId',
            description: 'Get detailed taxonomic information for a species by its WoRMS AphiaID, including classification, common names, and record counts. Use taxonIDs from getChecklist or searchOccurrences.',
            parameters: [
                { position: { key: 'taxonId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get taxon info for bottlenose dolphin (AphiaID 137111)', taxonId: 137111 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        taxonID: { type: 'number' },
                        scientificName: { type: 'string' },
                        taxonRank: { type: 'string' },
                        kingdom: { type: 'string' },
                        phylum: { type: 'string' },
                        class: { type: 'string' },
                        records: { type: 'number' }
                    }
                }
            },
        },
        listDatasets: {
            method: 'GET',
            path: '/dataset',
            description: 'List marine biodiversity datasets registered in OBIS. Use listNodes to find node IDs for filtering. Dataset IDs can be used to filter searchOccurrences.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'nodeid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(1000)'] } }
            ],
            tests: [
                { _description: 'Search for coral reef datasets', q: 'coral reef', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, title: { type: 'string' }, records: { type: 'number' } } } }
                    }
                }
            },
        },
        listNodes: {
            method: 'GET',
            path: '/node',
            description: 'List OBIS regional nodes that contribute marine biodiversity data.',
            parameters: [],
            tests: [
                { _description: 'List all OBIS nodes' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, country: { type: 'string' } } } }
                    }
                }
            },
        }
    }
}
