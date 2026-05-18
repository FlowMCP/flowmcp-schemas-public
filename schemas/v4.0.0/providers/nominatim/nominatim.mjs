export const main = {
    namespace: 'nominatim',
    name: 'Nominatim',
    description: 'Geocode addresses and place names to coordinates, and reverse geocode coordinates to human-readable addresses using OpenStreetMap data.',
    docs: ['https://nominatim.org/release-docs/latest/'],
    tags: ['geocoding', 'maps', 'openstreetmap', 'address', 'geolocation', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://nominatim.openstreetmap.org',
    requiredServerParams: [],
    headers: {
        'User-Agent': 'FlowMCP/1.0 (https://flowmcp.com)'
    },
    tools: {
        search: {
            method: 'GET',
            path: '/search',
            description: 'Search for places by free-form query or structured address components. Returns geocoded results with coordinates and metadata.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'street', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'city', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'state', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'country', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'postalcode', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'addressdetails', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(5)'] } },
                { position: { key: 'countrycodes', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'accept-language', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for Berlin, Germany', q: 'Berlin, Germany', limit: 3 },
                { _description: 'Search for Eiffel Tower Paris', q: 'Eiffel Tower, Paris', limit: 2 },
                { _description: 'Structured search for a street address', street: '10 Downing Street', city: 'London', country: 'GB', limit: 2 }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Array of geocoded places matching the search query, ordered by relevance',
                schema: { type: 'array', items: { type: 'object', properties: { place_id: { type: 'number', description: 'Nominatim internal place identifier' }, licence: { type: 'string', description: 'Data licence attribution' }, osm_type: { type: 'string', description: 'OpenStreetMap element type (node, way, relation)' }, osm_id: { type: 'number', description: 'OpenStreetMap element ID — use with lookup tool as N/W/R prefix + ID' }, lat: { type: 'string', description: 'Latitude of the place centroid' }, lon: { type: 'string', description: 'Longitude of the place centroid' }, display_name: { type: 'string', description: 'Full human-readable address string' }, type: { type: 'string', description: 'Place type (city, administrative, etc.)' }, importance: { type: 'number', description: 'Search relevance score (0-1)' }, address: { type: 'object', description: 'Structured address components (when addressdetails=1)' }, boundingbox: { type: 'array', description: 'Bounding box [south, north, west, east]', items: { type: 'string' } } } } }
            }
        },
        reverse: {
            method: 'GET',
            path: '/reverse',
            description: 'Convert geographic coordinates (latitude and longitude) to a human-readable address using reverse geocoding. Use search tool to go in the opposite direction (address to coordinates).',
            parameters: [
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'addressdetails', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'zoom', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'accept-language', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Reverse geocode coordinates of the Eiffel Tower', lat: 48.8584, lon: 2.2945 },
                { _description: 'Reverse geocode coordinates of Times Square', lat: 40.758, lon: -73.9855 },
                { _description: 'Reverse geocode coordinates of Sydney Opera House', lat: -33.8568, lon: 151.2153 }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Single geocoded place result for the given coordinates',
                schema: { type: 'object', properties: { place_id: { type: 'number', description: 'Nominatim internal place identifier' }, osm_type: { type: 'string', description: 'OpenStreetMap element type' }, osm_id: { type: 'number', description: 'OpenStreetMap element ID' }, lat: { type: 'string', description: 'Latitude' }, lon: { type: 'string', description: 'Longitude' }, display_name: { type: 'string', description: 'Full human-readable address' }, address: { type: 'object', description: 'Structured address components' }, boundingbox: { type: 'array', items: { type: 'string' } } } }
            }
        },
        lookup: {
            method: 'GET',
            path: '/lookup',
            description: 'Look up address details for one or more OpenStreetMap objects by their OSM type and ID. Use osm_type and osm_id from search or reverse results.',
            parameters: [
                { position: { key: 'osm_ids', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'addressdetails', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'accept-language', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Lookup OSM relation for Germany', osm_ids: 'R51477' },
                { _description: 'Lookup OSM node for the Eiffel Tower', osm_ids: 'N5013364405' },
                { _description: 'Lookup multiple OSM objects', osm_ids: 'R51477,R51701' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Array of place records for the requested OSM objects',
                schema: { type: 'array', items: { type: 'object', properties: { place_id: { type: 'number', description: 'Nominatim internal place identifier' }, osm_type: { type: 'string', description: 'OpenStreetMap element type' }, osm_id: { type: 'number', description: 'OpenStreetMap element ID' }, lat: { type: 'string', description: 'Latitude' }, lon: { type: 'string', description: 'Longitude' }, display_name: { type: 'string', description: 'Full human-readable address' }, address: { type: 'object', description: 'Structured address components' } } } }
            }
        }
    },
}