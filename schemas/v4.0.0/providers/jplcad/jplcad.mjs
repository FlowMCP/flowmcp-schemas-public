export const main = {
    namespace: 'jplcad',
    name: 'JplCad',
    description: 'Query the JPL Close Approach Data (CAD) API for near-Earth object close approaches to Earth — filter by date range, maximum distance, object type (PHA, NEO, comet), specific designation, or absolute magnitude.',
    docs: ['https://ssd-api.jpl.nasa.gov/doc/cad.html', 'https://ssd.jpl.nasa.gov/tools/cad.html'],
    tags: ['jpl', 'nasa', 'asteroids', 'closeapproach', 'planetarydefense', 'science', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://ssd-api.jpl.nasa.gov',
    requiredServerParams: [],
    headers: {},
    tools: {
        getCloseApproaches: {
            method: 'GET',
            description: 'Get near-Earth object close approaches to Earth within a date range. Returns fields array and data records with designation, closest approach date, distance (AU, LD), relative velocity, and magnitude. Use getByObject to look up a specific asteroid, or getPotentiallyHazardous for PHA-only results.',
            path: '/cad.api',
            parameters: [
                { position: { key: 'date-min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Start date in YYYY-MM-DD format for close approach date range' },
                { position: { key: 'date-max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'End date in YYYY-MM-DD format for close approach date range' },
                { position: { key: 'dist-max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Maximum close approach distance in AU (e.g. 0.05) or with LD suffix for lunar distances (e.g. 10LD)' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'min(1)', 'max(500)'] }, description: 'Maximum number of results to return (max 500)' }
            ],
            tests: [
                { _description: 'Get close approaches to Earth in January 2024 within 0.05 AU', 'date-min': '2024-01-01', 'date-max': '2024-01-31', 'dist-max': '0.05' },
                { _description: 'Get all close approaches within 1 lunar distance in a week', 'date-min': '2024-06-01', 'date-max': '2024-06-07', 'dist-max': '0.0025' },
                { _description: 'Get the 100 closest approaches in all of 2024', 'date-min': '2024-01-01', 'date-max': '2024-12-31', limit: 100 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Close approach dataset with field definitions and tabular data records',
                    properties: {
                        signature: { type: 'object', description: 'API response signature with source and version', properties: { source: { type: 'string', description: 'Data source (NASA JPL)' }, version: { type: 'string', description: 'API version number' } } },
                        count: { type: 'string', description: 'Total number of close approach records returned' },
                        fields: { type: 'array', description: 'Array of field names for the data columns (des, orbit_id, jd, cd, dist, dist_min, dist_max, v_rel, v_inf, t_sigma_f, h)', items: { type: 'string', description: 'Column name' } },
                        data: { type: 'array', description: 'Array of close approach records, each an array of values in fields order', items: { type: 'array', description: 'Single close approach record [designation, orbit_id, julian_date, calendar_date, distance_AU, min_dist, max_dist, relative_velocity_km/s, ...]' } }
                    }
                }
            },
        },
        getPotentiallyHazardous: {
            method: 'GET',
            description: 'Get close approaches for potentially hazardous asteroids (PHAs) only. PHAs have an absolute magnitude of 22 or brighter and approach within 0.05 AU of Earth\'s orbit. Use getCloseApproaches for all NEOs or getByObject for a specific asteroid.',
            path: '/cad.api',
            parameters: [
                { position: { key: 'date-min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Start date in YYYY-MM-DD format' },
                { position: { key: 'date-max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'End date in YYYY-MM-DD format' },
                { position: { key: 'pha', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(true)'] }, description: 'Filter to potentially hazardous asteroids only (default true)' },
                { position: { key: 'dist-max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Maximum close approach distance in AU' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'min(1)', 'max(500)'] }, description: 'Maximum number of results (max 500)' }
            ],
            tests: [
                { _description: 'Get PHA close approaches in 2024 within 0.1 AU', 'date-min': '2024-01-01', 'date-max': '2024-12-31', pha: true, 'dist-max': '0.1' },
                { _description: 'Get PHA close approaches over the next decade', 'date-min': '2024-01-01', 'date-max': '2034-12-31', pha: true, limit: 100 },
                { _description: 'Get PHA close approaches in 2025', 'date-min': '2025-01-01', 'date-max': '2025-12-31', pha: true, limit: 50 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Close approach dataset filtered to potentially hazardous asteroids only',
                    properties: {
                        signature: { type: 'object', description: 'API response signature', properties: { source: { type: 'string', description: 'Data source (NASA JPL)' }, version: { type: 'string', description: 'API version' } } },
                        count: { type: 'string', description: 'Number of PHA close approach records' },
                        fields: { type: 'array', description: 'Column name definitions for data records', items: { type: 'string', description: 'Column name' } },
                        data: { type: 'array', description: 'Array of PHA close approach records as value arrays', items: { type: 'array', description: 'Single PHA close approach record' } }
                    }
                }
            },
        },
        getByObject: {
            method: 'GET',
            description: 'Get all close approaches for a specific small body identified by its designation. Optionally include the full object name in results. Use getCloseApproaches to discover designations, or look up details in the JPL SBDB.',
            path: '/cad.api',
            parameters: [
                { position: { key: 'des', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Object designation: asteroid number (e.g. 99942), provisional designation (e.g. 2023 BU), or comet designation' },
                { position: { key: 'date-min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Start date in YYYY-MM-DD format' },
                { position: { key: 'date-max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'End date in YYYY-MM-DD format' },
                { position: { key: 'fullname', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] }, description: 'Include full object name/designation in results instead of just number' }
            ],
            tests: [
                { _description: 'Get all close approaches for Apophis (99942) with full name', des: '99942', fullname: true },
                { _description: 'Get close approaches for Bennu through the 21st century', des: '101955', 'date-min': '2000-01-01', 'date-max': '2100-12-31' },
                { _description: 'Get close approaches for 2023 BU that flew very close to Earth', des: '2023 BU', fullname: true }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'All close approach records for a specific small body',
                    properties: {
                        signature: { type: 'object', description: 'API response signature', properties: { source: { type: 'string', description: 'Data source (NASA JPL)' }, version: { type: 'string', description: 'API version' } } },
                        count: { type: 'string', description: 'Number of close approach records for this object' },
                        fields: { type: 'array', description: 'Column name definitions for data records', items: { type: 'string', description: 'Column name' } },
                        data: { type: 'array', description: 'Array of close approach records for the specified object', items: { type: 'array', description: 'Single close approach record as value array' } }
                    }
                }
            },
        },
        getByMagnitude: {
            method: 'GET',
            description: 'Get close approaches filtered by absolute magnitude range (H). Lower H values mean larger objects. H<=22 is roughly 140m+, H<=18 is roughly 1km+. Use getPotentiallyHazardous for PHA-classified objects specifically.',
            path: '/cad.api',
            parameters: [
                { position: { key: 'date-min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Start date in YYYY-MM-DD format' },
                { position: { key: 'date-max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'End date in YYYY-MM-DD format' },
                { position: { key: 'h-min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Minimum absolute magnitude H (higher H = smaller objects)' },
                { position: { key: 'h-max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Maximum absolute magnitude H (lower H = larger objects, H<=22 is ~140m+, H<=18 is ~1km+)' },
                { position: { key: 'dist-max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Maximum close approach distance in AU' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'min(1)', 'max(500)'] }, description: 'Maximum number of results (max 500)' }
            ],
            tests: [
                { _description: 'Get large asteroid close approaches (H <= 22, 140m+) in 2024 within 0.2 AU', 'date-min': '2024-01-01', 'date-max': '2024-12-31', 'h-max': 22, 'dist-max': '0.2' },
                { _description: 'Get 1km+ asteroid approaches (H <= 18) through 2030', 'date-min': '2024-01-01', 'date-max': '2030-12-31', 'h-max': 18 },
                { _description: 'Get medium-sized asteroid approaches (H 22-26) in 2025', 'date-min': '2025-01-01', 'date-max': '2025-12-31', 'h-min': 22, 'h-max': 26, 'dist-max': '0.05' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Close approach dataset filtered by absolute magnitude (object size) range',
                    properties: {
                        signature: { type: 'object', description: 'API response signature', properties: { source: { type: 'string', description: 'Data source (NASA JPL)' }, version: { type: 'string', description: 'API version' } } },
                        count: { type: 'string', description: 'Number of close approach records matching magnitude filter' },
                        fields: { type: 'array', description: 'Column name definitions for data records', items: { type: 'string', description: 'Column name' } },
                        data: { type: 'array', description: 'Array of magnitude-filtered close approach records as value arrays', items: { type: 'array', description: 'Single close approach record' } }
                    }
                }
            },
        }
    },
}
