export const main = {
    namespace: 'gbif',
    name: 'GBIF',
    description: 'Access the Global Biodiversity Information Facility (GBIF) database with 2+ billion occurrence records and species information. Search species, match scientific names to the GBIF backbone taxonomy, and retrieve biodiversity occurrence data worldwide.',
    docs: ['https://www.gbif.org/developer/summary', 'https://techdocs.gbif.org/en/openapi/'],
    tags: ['biodiversity', 'species', 'ecology', 'science', 'opendata', 'taxonomy', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://api.gbif.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        matchSpeciesName: {
            method: 'GET',
            path: '/v1/species/match',
            description: 'Match a scientific or common name to the GBIF backbone taxonomy. Returns the best matching taxon with its GBIF key, rank, status, and classification. Use the returned usageKey as taxonKey in searchOccurrences or as key in getSpeciesById.',
            parameters: [
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'rank', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(KINGDOM,PHYLUM,CLASS,ORDER,FAMILY,GENUS,SPECIES)', options: ['optional()'] } },
                { position: { key: 'kingdom', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'phylum', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'class', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'order', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'family', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'genus', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'verbose', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(false)'] } }
            ],
            tests: [
                { _description: 'Match house sparrow by scientific name', name: 'Passer domesticus' },
                { _description: 'Match polar bear with higher taxonomy context', name: 'Ursus maritimus', kingdom: 'Animalia', order: 'Carnivora' },
                { _description: 'Match a plant species name', name: 'Quercus robur', rank: 'SPECIES' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Best matching taxon from the GBIF backbone taxonomy',
                    properties: {
                        usageKey: { type: 'number', description: 'GBIF taxon key — use as key in getSpeciesById or taxonKey in searchOccurrences' },
                        scientificName: { type: 'string', description: 'Full scientific name including author' },
                        canonicalName: { type: 'string', description: 'Scientific name without author' },
                        rank: { type: 'string', description: 'Taxonomic rank (KINGDOM, PHYLUM, CLASS, ORDER, FAMILY, GENUS, SPECIES)' },
                        status: { type: 'string', description: 'Taxonomic status (ACCEPTED, SYNONYM, DOUBTFUL)' },
                        matchType: { type: 'string', description: 'Type of match (EXACT, FUZZY, HIGHERRANK, NONE)' },
                        confidence: { type: 'number', description: 'Match confidence score (0-100)' },
                        kingdom: { type: 'string', description: 'Kingdom name' },
                        phylum: { type: 'string', description: 'Phylum name' },
                        class: { type: 'string', description: 'Class name' },
                        order: { type: 'string', description: 'Order name' },
                        family: { type: 'string', description: 'Family name' },
                        genus: { type: 'string', description: 'Genus name' },
                        species: { type: 'string', description: 'Species name (if rank is SPECIES)' }
                    }
                }
            },
        },
        searchSpecies: {
            method: 'GET',
            path: '/v1/species/search',
            description: 'Search species in the GBIF backbone taxonomy by name, rank, or higher taxon key. Returns paginated list of matching taxa with their classification. Use returned keys with getSpeciesById for details or searchOccurrences for sightings.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'rank', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(KINGDOM,PHYLUM,CLASS,ORDER,FAMILY,GENUS,SPECIES)', options: ['optional()'] } },
                { position: { key: 'highertaxon_key', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'status', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(ACCEPTED,SYNONYM,DOUBTFUL)', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(1000)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Search for eagle species', q: 'eagle', rank: 'SPECIES', limit: 10 },
                { _description: 'Search for Panthera genus species', q: 'Panthera', rank: 'SPECIES', limit: 10 },
                { _description: 'Search for accepted oak species', q: 'Quercus', rank: 'SPECIES', status: 'ACCEPTED', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of taxa matching the search criteria',
                    properties: {
                        offset: { type: 'number', description: 'Current page offset' },
                        limit: { type: 'number', description: 'Maximum results per page' },
                        endOfRecords: { type: 'boolean', description: 'True if this is the last page' },
                        count: { type: 'number', description: 'Total number of matching taxa' },
                        results: {
                            type: 'array',
                            description: 'Array of taxon records',
                            items: {
                                type: 'object',
                                properties: {
                                    key: { type: 'number', description: 'GBIF taxon key — use with getSpeciesById' },
                                    scientificName: { type: 'string', description: 'Full scientific name' },
                                    canonicalName: { type: 'string', description: 'Scientific name without author' },
                                    rank: { type: 'string', description: 'Taxonomic rank' },
                                    taxonomicStatus: { type: 'string', description: 'ACCEPTED, SYNONYM, or DOUBTFUL' },
                                    kingdom: { type: 'string', description: 'Kingdom name' },
                                    phylum: { type: 'string', description: 'Phylum name' },
                                    family: { type: 'string', description: 'Family name' }
                                }
                            }
                        }
                    }
                }
            },
        },
        searchOccurrences: {
            method: 'GET',
            path: '/v1/occurrence/search',
            description: 'Search biodiversity occurrence records in GBIF. Find where species have been observed, with location, date, and observer information. Returns paginated results.',
            parameters: [
                { position: { key: 'scientificName', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'taxonKey', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'country', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'basisOfRecord', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(HUMAN_OBSERVATION,MACHINE_OBSERVATION,PRESERVED_SPECIMEN,FOSSIL_SPECIMEN,OBSERVATION)', options: ['optional()'] } },
                { position: { key: 'hasCoordinate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(true)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(300)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Find wolf occurrences in Germany with coordinates', scientificName: 'Canis lupus', country: 'DE', hasCoordinate: 'true', limit: 10 },
                { _description: 'Find polar bear observations in recent years', scientificName: 'Ursus maritimus', basisOfRecord: 'HUMAN_OBSERVATION', limit: 10 },
                { _description: 'Find giant panda occurrences in China', scientificName: 'Ailuropoda melanoleuca', country: 'CN', hasCoordinate: 'true', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of biodiversity occurrence records',
                    properties: {
                        offset: { type: 'number', description: 'Current page offset' },
                        limit: { type: 'number', description: 'Maximum results per page' },
                        endOfRecords: { type: 'boolean', description: 'True if this is the last page' },
                        count: { type: 'number', description: 'Total number of matching occurrences' },
                        results: {
                            type: 'array',
                            description: 'Array of occurrence records',
                            items: {
                                type: 'object',
                                properties: {
                                    key: { type: 'number', description: 'Unique occurrence record key' },
                                    scientificName: { type: 'string', description: 'Scientific name of the observed species' },
                                    decimalLatitude: { type: 'number', description: 'Latitude coordinate of observation' },
                                    decimalLongitude: { type: 'number', description: 'Longitude coordinate of observation' },
                                    country: { type: 'string', description: 'Country where observation was made' },
                                    year: { type: 'number', description: 'Year of observation' },
                                    basisOfRecord: { type: 'string', description: 'Type of record (HUMAN_OBSERVATION, PRESERVED_SPECIMEN, etc.)' },
                                    datasetName: { type: 'string', description: 'Name of the dataset this record belongs to' }
                                }
                            }
                        }
                    }
                }
            },
        },
        getSpeciesById: {
            method: 'GET',
            path: '/v1/species/:key',
            description: 'Get detailed information about a species using its GBIF taxon key. Returns full taxonomic classification, synonyms, vernacular names, and links to related information. Get the key from matchSpeciesName or searchSpecies. Use getSpeciesVernacularNames for common names.',
            parameters: [
                { position: { key: 'key', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get species info for house sparrow (key: 5231190)', key: 5231190 },
                { _description: 'Get species info for common chimpanzee (key: 2436436)', key: 2436436 },
                { _description: 'Get species info for giant panda (key: 5219645)', key: 5219645 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Detailed species record from the GBIF backbone taxonomy',
                    properties: {
                        key: { type: 'number', description: 'GBIF taxon key' },
                        scientificName: { type: 'string', description: 'Full scientific name with author' },
                        canonicalName: { type: 'string', description: 'Scientific name without author' },
                        vernacularName: { type: 'string', description: 'Primary common name (if available)' },
                        rank: { type: 'string', description: 'Taxonomic rank' },
                        taxonomicStatus: { type: 'string', description: 'ACCEPTED, SYNONYM, or DOUBTFUL' },
                        kingdom: { type: 'string', description: 'Kingdom name' },
                        phylum: { type: 'string', description: 'Phylum name' },
                        class: { type: 'string', description: 'Class name' },
                        order: { type: 'string', description: 'Order name' },
                        family: { type: 'string', description: 'Family name' },
                        genus: { type: 'string', description: 'Genus name' },
                        numDescendants: { type: 'number', description: 'Number of descendant taxa' },
                        extinct: { type: 'boolean', description: 'Whether the species is extinct' }
                    }
                }
            },
        },
        getSpeciesVernacularNames: {
            method: 'GET',
            path: '/v1/species/:key/vernacularNames',
            description: 'Get all vernacular (common) names for a species from the GBIF backbone. Returns names in multiple languages with their sources.',
            parameters: [
                { position: { key: 'key', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Get all common names for the house sparrow', key: 5231190, limit: 20 },
                { _description: 'Get common names for common chimpanzee', key: 2436436, limit: 20 },
                { _description: 'Get common names for European robin', key: 5787060, limit: 20 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of vernacular (common) names for a species',
                    properties: {
                        offset: { type: 'number', description: 'Current page offset' },
                        limit: { type: 'number', description: 'Maximum results per page' },
                        endOfRecords: { type: 'boolean', description: 'True if this is the last page' },
                        results: {
                            type: 'array',
                            description: 'Array of vernacular name records',
                            items: {
                                type: 'object',
                                properties: {
                                    vernacularName: { type: 'string', description: 'Common name in the given language' },
                                    language: { type: 'string', description: 'ISO language code (e.g. eng, deu, fra)' },
                                    source: { type: 'string', description: 'Data source for this name' }
                                }
                            }
                        }
                    }
                }
            },
        }
    },
}