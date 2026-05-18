export const main = {
    namespace: 'inaturalist',
    name: 'Inaturalist',
    description: 'Access iNaturalist nature observation data — search species observations, browse taxa, look up places, and retrieve species counts from the world\'s largest citizen science platform.',
    docs: ['https://api.inaturalist.org/v1/docs/', 'https://www.inaturalist.org/pages/api+reference'],
    tags: ['nature', 'biodiversity', 'species', 'citizenscience', 'observations', 'ecology', 'cacheTtlFrequent'],
    version: '4.0.0',
    root: 'https://api.inaturalist.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        getObservations: {
            method: 'GET',
            path: '/v1/observations',
            description: 'Search nature observations filtered by taxon, location, date range, quality grade, and user. Returns geolocated sightings with photos and identifications. Use searchTaxa to find taxon_id values and getPlacesAutocomplete to find place_id values.',
            parameters: [
                { position: { key: 'taxon_name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Scientific or common species name to filter by (e.g. Danaus plexippus)' },
                { position: { key: 'taxon_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'iNaturalist taxon ID from searchTaxa or getTaxonById' },
                { position: { key: 'place_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Place ID from getPlacesAutocomplete to filter by location' },
                { position: { key: 'quality_grade', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Observation quality: research (community verified), needs_id, or casual' },
                { position: { key: 'photos', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] }, description: 'Filter to observations with photos (true) or without (false)' },
                { position: { key: 'identified', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] }, description: 'Filter to observations with species identification (true) or unidentified (false)' },
                { position: { key: 'd1', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Start date in YYYY-MM-DD format for date range filter' },
                { position: { key: 'd2', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'End date in YYYY-MM-DD format for date range filter' },
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Latitude for geographic circle search (use with lng and radius)' },
                { position: { key: 'lng', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Longitude for geographic circle search (use with lat and radius)' },
                { position: { key: 'radius', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Search radius in kilometers around lat/lng point' },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(200)'] }, description: 'Number of results per page (max 200)' },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] }, description: 'Page number for pagination' },
                { position: { key: 'order_by', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Sort field: created_at, observed_on, species_guess, votes, id' }
            ],
            tests: [
                { _description: 'Search research-grade monarch butterfly observations', taxon_name: 'Danaus plexippus', quality_grade: 'research', per_page: 10 },
                { _description: 'Search observations near San Francisco with photos', lat: 37.7749, lng: -122.4194, radius: 10, photos: true, per_page: 10 },
                { _description: 'Search wolf observations in 2024', taxon_name: 'Canis lupus', d1: '2024-01-01', d2: '2024-12-31', per_page: 10 },
                { _description: 'Search recent bird observations with identification', taxon_name: 'Falco peregrinus', quality_grade: 'research', per_page: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of nature observations with species, location, and photo data',
                    properties: {
                        total_results: { type: 'number', description: 'Total number of observations matching the query' },
                        page: { type: 'number', description: 'Current page number' },
                        per_page: { type: 'number', description: 'Number of results per page' },
                        results: { type: 'array', description: 'Array of observation records', items: { type: 'object', properties: { id: { type: 'number', description: 'Unique observation ID' }, species_guess: { type: 'string', description: 'Observer species identification guess' }, quality_grade: { type: 'string', description: 'Quality grade: research, needs_id, or casual' }, location: { type: 'string', description: 'Latitude,longitude coordinate pair' }, place_guess: { type: 'string', description: 'Human-readable location name' }, observed_on: { type: 'string', description: 'Date the observation was made (YYYY-MM-DD)' }, taxon: { type: 'object', description: 'Taxonomic classification of the observed species' }, photos: { type: 'array', description: 'Array of observation photo objects with URLs' } } } }
                    }
                }
            },
        },
        getSpeciesCounts: {
            method: 'GET',
            path: '/v1/observations/species_counts',
            description: 'Get a ranked list of species (taxa) observed, ordered by observation count. Supports same filters as getObservations. Use getPlacesAutocomplete to find place_id values.',
            parameters: [
                { position: { key: 'taxon_name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Scientific or common taxon name to filter by' },
                { position: { key: 'place_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Place ID from getPlacesAutocomplete to filter by location' },
                { position: { key: 'quality_grade', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Observation quality: research, needs_id, or casual' },
                { position: { key: 'd1', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Start date in YYYY-MM-DD format' },
                { position: { key: 'd2', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'End date in YYYY-MM-DD format' },
                { position: { key: 'iconic_taxa', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Iconic taxon group: Aves, Mammalia, Reptilia, Amphibia, Plantae, Fungi, Insecta, etc.' },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(500)'] }, description: 'Number of species per page (max 500)' }
            ],
            tests: [
                { _description: 'Top observed bird species in California (place_id 14)', place_id: 14, iconic_taxa: 'Aves', quality_grade: 'research', per_page: 10 },
                { _description: 'Top observed plant species globally in 2024', iconic_taxa: 'Plantae', d1: '2024-01-01', d2: '2024-12-31', per_page: 10 },
                { _description: 'Top observed reptile species', iconic_taxa: 'Reptilia', quality_grade: 'research', per_page: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Ranked list of species by observation count matching the filters',
                    properties: {
                        total_results: { type: 'number', description: 'Total number of distinct species matching the query' },
                        page: { type: 'number', description: 'Current page number' },
                        per_page: { type: 'number', description: 'Number of results per page' },
                        results: { type: 'array', description: 'Array of species count records', items: { type: 'object', properties: { count: { type: 'number', description: 'Number of observations for this species' }, taxon: { type: 'object', description: 'Taxonomic details including name, rank, and photos' } } } }
                    }
                }
            },
        },
        searchTaxa: {
            method: 'GET',
            path: '/v1/taxa',
            description: 'Search the iNaturalist taxonomic database for species and higher taxa. Returns taxonomy details, common names, conservation status, and Wikipedia links. Use taxon IDs from results with getObservations or getTaxonById.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Search query for taxon name (scientific or common)' },
                { position: { key: 'rank', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Taxonomic rank filter: species, genus, family, order, class, phylum, kingdom' },
                { position: { key: 'taxon_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Filter by parent taxon ID to find child taxa' },
                { position: { key: 'is_active', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] }, description: 'Filter to currently accepted (true) or synonymized (false) taxa' },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(200)'] }, description: 'Number of results per page (max 200)' }
            ],
            tests: [
                { _description: 'Search for wolf taxa', q: 'Canis lupus', rank: 'species', per_page: 5 },
                { _description: 'Search for oak tree species', q: 'Quercus', rank: 'genus', per_page: 10 },
                { _description: 'Search for eagle taxa at species rank', q: 'eagle', rank: 'species', per_page: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of taxonomic records matching the search query',
                    properties: {
                        total_results: { type: 'number', description: 'Total number of taxa matching the query' },
                        page: { type: 'number', description: 'Current page number' },
                        per_page: { type: 'number', description: 'Number of results per page' },
                        results: { type: 'array', description: 'Array of taxon records', items: { type: 'object', properties: { id: { type: 'number', description: 'iNaturalist taxon ID (use with getTaxonById or getObservations taxon_id)' }, name: { type: 'string', description: 'Scientific name of the taxon' }, preferred_common_name: { type: 'string', description: 'Most common vernacular name' }, rank: { type: 'string', description: 'Taxonomic rank (species, genus, family, etc.)' }, observations_count: { type: 'number', description: 'Total number of observations of this taxon' }, wikipedia_url: { type: 'string', description: 'Link to the Wikipedia article' }, conservation_status: { type: 'object', description: 'IUCN or local conservation status if available' } } } }
                    }
                }
            },
        },
        getTaxonById: {
            method: 'GET',
            path: '/v1/taxa/:id',
            description: 'Get detailed taxonomy information for a specific taxon by its iNaturalist ID, including classification, conservation status, and photos. Use searchTaxa to find taxon IDs.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)'] }, description: 'iNaturalist taxon ID (find via searchTaxa)' }
            ],
            tests: [
                { _description: 'Get taxon details for Homo sapiens (taxon ID 43584)', id: 43584 },
                { _description: 'Get taxon details for Panthera leo (lion, taxon ID 41944)', id: 41944 },
                { _description: 'Get taxon details for Gray Wolf (taxon ID 42048)', id: 42048 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Complete taxonomic record for the requested taxon',
                    properties: {
                        total_results: { type: 'number', description: 'Number of results (always 1 for ID lookup)' },
                        results: { type: 'array', description: 'Array containing the single taxon record', items: { type: 'object', properties: { id: { type: 'number', description: 'iNaturalist taxon ID' }, name: { type: 'string', description: 'Scientific name' }, preferred_common_name: { type: 'string', description: 'Most common vernacular name' }, rank: { type: 'string', description: 'Taxonomic rank' }, ancestors: { type: 'array', description: 'Full taxonomic lineage from kingdom to parent' }, conservation_status: { type: 'object', description: 'IUCN or local conservation status' }, default_photo: { type: 'object', description: 'Primary photo with URL and attribution' } } } }
                    }
                }
            },
        },
        getPlacesAutocomplete: {
            method: 'GET',
            path: '/v1/places/autocomplete',
            description: 'Search iNaturalist places by name for use in filtering observations. Returns place IDs needed for the getObservations and getSpeciesCounts place_id parameter.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Place name search query' },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(5)', 'min(1)', 'max(20)'] }, description: 'Number of results per page (max 20)' }
            ],
            tests: [
                { _description: 'Search for places named California', q: 'California', per_page: 5 },
                { _description: 'Search for places named Amazon', q: 'Amazon', per_page: 5 },
                { _description: 'Search for places named Yellowstone', q: 'Yellowstone', per_page: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'List of places matching the name query with IDs for use in observation filters',
                    properties: {
                        total_results: { type: 'number', description: 'Total number of matching places' },
                        results: { type: 'array', description: 'Array of place records', items: { type: 'object', properties: { id: { type: 'number', description: 'Place ID for use with getObservations and getSpeciesCounts place_id parameter' }, display_name: { type: 'string', description: 'Full display name of the place' }, place_type: { type: 'number', description: 'Place type code (e.g. 8=state, 12=country, 9=county)' }, bbox_area: { type: 'number', description: 'Bounding box area of the place in square degrees' } } } }
                    }
                }
            },
        }
    },
}
