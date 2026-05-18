export const main = {
    namespace: 'jplsbdb',
    name: 'JplSbdb',
    description: 'Query the JPL Small-Body Database (SBDB) for detailed data on asteroids and comets — orbital elements, physical parameters, close approach records, and alternate designations.',
    docs: ['https://ssd-api.jpl.nasa.gov/doc/sbdb.html', 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html'],
    tags: ['jpl', 'nasa', 'asteroids', 'comets', 'space', 'planetarydefense', 'science', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://ssd-api.jpl.nasa.gov',
    requiredServerParams: [],
    headers: {},
    tools: {
        lookupBody: {
            method: 'GET',
            description: 'Look up a small body (asteroid or comet) by name, designation, or SPK-ID. Returns orbital elements, object classification, NEO/PHA status, and observation arc. Use lookupBodyWithPhysics for physical parameters or lookupBodyWithCloseApproaches for approach records.',
            path: '/sbdb.api',
            parameters: [
                { position: { key: 'sstr', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Search string: asteroid name (Apophis), number (433), provisional designation (2023 BU), or comet name (Halley)' }
            ],
            tests: [
                { _description: 'Look up asteroid 433 Eros by number', sstr: '433' },
                { _description: 'Look up Halley\'s Comet by name', sstr: 'Halley' },
                { _description: 'Look up the Apophis asteroid by name', sstr: 'Apophis' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Small body database record with orbital elements and classification data',
                    properties: {
                        signature: { type: 'object', description: 'API response signature', properties: { source: { type: 'string', description: 'Data source (NASA JPL SSD)' }, version: { type: 'string', description: 'API version number' } } },
                        object: { type: 'object', description: 'Object identification data', properties: { fullname: { type: 'string', description: 'Full name including number and name (e.g. 433 Eros)' }, des: { type: 'string', description: 'Primary designation' }, kind: { type: 'string', description: 'Object kind (a=asteroid, c=comet)' }, orbit_class: { type: 'object', description: 'Orbital classification (Apollo, Aten, Amor, etc.)' }, pha: { type: 'boolean', description: 'Whether classified as potentially hazardous asteroid' }, neo: { type: 'boolean', description: 'Whether classified as near-Earth object' }, spkid: { type: 'string', description: 'JPL SPK-ID for ephemeris computations' } } },
                        orbit: { type: 'object', description: 'Orbital elements including semi-major axis, eccentricity, inclination, epoch, and data arc' }
                    }
                }
            },
        },
        lookupBodyWithPhysics: {
            method: 'GET',
            description: 'Look up a small body and include physical parameters such as diameter, albedo, rotation period, and spectral type. Use lookupBody for orbital data only or lookupBodyWithCloseApproaches for approach records.',
            path: '/sbdb.api',
            parameters: [
                { position: { key: 'sstr', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Search string: asteroid/comet name, number, or designation' },
                { position: { key: 'phys-par', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(true)'] }, description: 'Include physical parameters in response (diameter, albedo, rotation, spectral type)' }
            ],
            tests: [
                { _description: 'Look up dwarf planet Ceres with physical parameters', sstr: 'Ceres', 'phys-par': true },
                { _description: 'Look up Vesta with physical data', sstr: 'Vesta', 'phys-par': true },
                { _description: 'Look up mission target Bennu with physical parameters', sstr: 'Bennu', 'phys-par': true }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Small body record with orbital elements and physical parameter measurements',
                    properties: {
                        signature: { type: 'object', description: 'API response signature', properties: { source: { type: 'string', description: 'Data source' }, version: { type: 'string', description: 'API version' } } },
                        object: { type: 'object', description: 'Object identification data (name, designation, kind, orbit class, NEO/PHA flags)' },
                        orbit: { type: 'object', description: 'Orbital elements (semi-major axis, eccentricity, inclination, etc.)' },
                        phys_par: { type: 'array', description: 'Array of physical parameter measurements', items: { type: 'object', properties: { name: { type: 'string', description: 'Parameter name (diameter, albedo, rot_per, spec_T, etc.)' }, value: { type: 'string', description: 'Measured value' }, sigma: { type: 'string', description: 'Uncertainty/error margin' }, units: { type: 'string', description: 'Unit of measurement (km, h, etc.)' }, ref: { type: 'string', description: 'Publication reference for the measurement' } } } }
                    }
                }
            },
        },
        lookupBodyWithCloseApproaches: {
            method: 'GET',
            description: 'Look up a small body and include its historical and future close approach records to Earth and other planets. Use lookupBody for basic orbital data or lookupBodyWithPhysics for physical measurements.',
            path: '/sbdb.api',
            parameters: [
                { position: { key: 'sstr', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Search string: asteroid/comet name, number, or designation' },
                { position: { key: 'ca-data', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(true)'] }, description: 'Include close approach data in response' }
            ],
            tests: [
                { _description: 'Look up Apophis with its 2029 close approach record', sstr: 'Apophis', 'ca-data': true },
                { _description: 'Look up 2023 BU with close approach records', sstr: '2023 BU', 'ca-data': true },
                { _description: 'Look up Bennu with close approach history', sstr: 'Bennu', 'ca-data': true }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Small body record with orbital elements and close approach history',
                    properties: {
                        signature: { type: 'object', description: 'API response signature', properties: { source: { type: 'string', description: 'Data source' }, version: { type: 'string', description: 'API version' } } },
                        object: { type: 'object', description: 'Object identification data (name, designation, kind, orbit class, NEO/PHA flags)' },
                        orbit: { type: 'object', description: 'Orbital elements' },
                        ca_data: { type: 'array', description: 'Array of close approach records to Earth and other planets', items: { type: 'object', properties: { cd: { type: 'string', description: 'Close approach date in YYYY-MMM-DD HH:MM format' }, dist: { type: 'string', description: 'Nominal close approach distance in AU' }, dist_min: { type: 'string', description: 'Minimum possible distance in AU (3-sigma)' }, v_rel: { type: 'string', description: 'Relative velocity at close approach in km/s' }, body: { type: 'string', description: 'Planetary body for this approach (Earth, Mars, etc.)' } } } }
                    }
                }
            },
        },
        searchByDesignation: {
            method: 'GET',
            description: 'Search for a small body using its precise designation (numbered or provisional) with optional alternate designation listing. Use lookupBody for name-based searches instead.',
            path: '/sbdb.api',
            parameters: [
                { position: { key: 'des', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Precise object designation: asteroid number (99942), provisional (2015 AB), or comet (67P)' },
                { position: { key: 'alt-des', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] }, description: 'Include alternate designations and historical names in response' }
            ],
            tests: [
                { _description: 'Search by number for asteroid 99942 Apophis', des: '99942' },
                { _description: 'Search for asteroid with provisional designation and alternate names', des: '2015 AB', 'alt-des': true },
                { _description: 'Search for comet 67P with alternate designations', des: '67P', 'alt-des': true }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Small body record looked up by precise designation with optional alternate names',
                    properties: {
                        signature: { type: 'object', description: 'API response signature', properties: { source: { type: 'string', description: 'Data source' }, version: { type: 'string', description: 'API version' } } },
                        object: { type: 'object', description: 'Object identification data (name, designation, kind, orbit class, NEO/PHA flags)' },
                        orbit: { type: 'object', description: 'Orbital elements' },
                        alt_des: { type: 'array', description: 'Alternate designations and historical names for this object (only present when alt-des=true)', items: { type: 'string', description: 'Alternate designation string' } }
                    }
                }
            },
        }
    },
}
