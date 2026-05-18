export const main = {
    namespace: 'greix',
    name: 'GREIX German Real Estate Index',
    description: 'Access the German Real Estate Index (GREIX) by ECONtribute. Query residential property price data spanning 60+ years (1963-2024) across 27 major German cities. Covers single-family houses, multi-family houses, and apartments with annual and quarterly price indices, inflation adjustment, and neighborhood-level granularity. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://greix.de/'],
    tags: ['real-estate', 'germany', 'economics', 'opendata', 'cacheTtlDaily'],
    root: 'https://api.greixx.net/api-v1',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        listCities: {
            method: 'GET',
            path: '/cities/',
            description: 'List all 27+ German cities in the GREIX database. Returns city IDs, names, and short codes. Use city IDs with getCity, getCityMetrics, and getCityPricePeriod.',
            parameters: [],
            tests: [
                { _description: 'List all GREIX cities' },
                { _description: 'List available cities for property search' },
                { _description: 'Get city directory' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', description: 'Array of all cities in the GREIX database', items: { type: 'object', properties: { id: { type: 'number', description: 'Numeric city ID, use with getCity and getCityMetrics' }, name: { type: 'string', description: 'Full city name (e.g. Berlin, Frankfurt am Main)' }, short_name: { type: 'string', description: 'Short city code (e.g. BER, FRA)' } } } }
            }
        },
        getCity: {
            method: 'GET',
            path: '/cities/:cityId/',
            description: 'Get details for a specific city by ID. Use listCities to find city IDs (Berlin=1, Frankfurt=2, Dortmund=3, Cologne=4).',
            parameters: [
                { position: { key: 'cityId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get Berlin details', cityId: 1 },
                { _description: 'Get Frankfurt details', cityId: 2 },
                { _description: 'Get Dortmund details', cityId: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'City details from the GREIX database', properties: { id: { type: 'number', description: 'Numeric city ID' }, name: { type: 'string', description: 'Full city name' }, short_name: { type: 'string', description: 'Short city code' } } }
            }
        },
        listPropertyTypes: {
            method: 'GET',
            path: '/property-types/',
            description: 'List available property types: Single-family house (EFH, id=1), Multi-family house (MFH, id=2), Apartment (ETW, id=3). Use these IDs in getCityMetrics and getCityPricePeriod.',
            parameters: [],
            tests: [
                { _description: 'List all property types' },
                { _description: 'Get property type categories' },
                { _description: 'Get available housing types' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', description: 'Array of property type categories (EFH, MFH, ETW)', items: { type: 'object', properties: { id: { type: 'number', description: 'Property type ID, use in prop_types parameter (1=EFH, 2=MFH, 3=ETW)' }, name: { type: 'string', description: 'Full property type name in German' }, short_name: { type: 'string', description: 'Abbreviated property type code (EFH, MFH, ETW)' } } } }
            }
        },
        listNeighborhoods: {
            method: 'GET',
            path: '/neighborhoods/',
            description: 'List all neighborhoods across all cities. Returns 200+ neighborhoods with UUIDs, names, and parent city data. Use neighborhood IDs with getNeighborhoodMetricsMap.',
            parameters: [],
            tests: [
                { _description: 'List all neighborhoods' },
                { _description: 'Get neighborhood directory' },
                { _description: 'List all available neighborhoods' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', description: 'Array of all neighborhoods across all GREIX cities', items: { type: 'object', properties: { id: { type: 'string', description: 'UUID of the neighborhood' }, name: { type: 'string', description: 'Neighborhood name' }, short_name: { type: 'string', description: 'Abbreviated neighborhood code' }, city: { type: 'object', description: 'Parent city this neighborhood belongs to', properties: { id: { type: 'number', description: 'City ID' }, name: { type: 'string', description: 'City name' }, short_name: { type: 'string', description: 'City code' } } } } } }
            }
        },
        getCityPricePeriod: {
            method: 'GET',
            path: '/cities/period/',
            description: 'Get price data time range for selected cities and property types. Returns min/max years of available data. Use listCities for city IDs and listPropertyTypes for prop_type IDs.',
            parameters: [
                { position: { key: 'cities', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'prop_types', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'from_year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(2015)'] } },
                { position: { key: 'to_year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(2024)'] } },
                { position: { key: 'inflation', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'data_index', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(sqm,absolute)', options: ['optional()', 'default(sqm)'] } },
                { position: { key: 'per_year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(true)'] } }
            ],
            tests: [
                { _description: 'Berlin + Frankfurt price period for houses', cities: '1,2', prop_types: '1', from_year: 2015, to_year: 2024, inflation: false, data_index: 'sqm', per_year: true },
                { _description: 'Munich apartment price period', cities: '5', prop_types: '3', from_year: 2000, to_year: 2024 },
                { _description: 'Cologne multi-family house period', cities: '4', prop_types: '2', from_year: 1990, to_year: 2024 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Available data time range for the selected cities and property types', properties: { year_min: { type: 'number', description: 'Earliest year with available price data' }, year_max: { type: 'number', description: 'Latest year with available price data' } } }
            }
        },
        getCityMetrics: {
            method: 'GET',
            path: '/cities/metrics/',
            description: 'Get detailed price metrics for cities over time. Returns chart data with price indices per sqm, optional inflation adjustment. Use listCities for IDs, comma-separated for comparison. Data spans 1963-2024.',
            parameters: [
                { position: { key: 'cities', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'prop_types', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'from_year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(2015)'] } },
                { position: { key: 'to_year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(2024)'] } },
                { position: { key: 'inflation', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'data_index', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(sqm,absolute)', options: ['optional()', 'default(sqm)'] } },
                { position: { key: 'per_year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(true)'] } }
            ],
            tests: [
                { _description: 'Berlin + Frankfurt apartment prices 2015-2024', cities: '1,2', prop_types: '3', from_year: 2015, to_year: 2024, inflation: false, data_index: 'sqm', per_year: true },
                { _description: 'Munich house prices with inflation 2000-2024', cities: '5', prop_types: '1', from_year: 2000, to_year: 2024, inflation: true, data_index: 'sqm', per_year: true },
                { _description: 'Hamburg multi-family houses absolute prices', cities: '6', prop_types: '2', from_year: 2010, to_year: 2024, data_index: 'absolute', per_year: true }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Price metric time series with chart-ready data for selected cities and property types', properties: { period: { type: 'object', description: 'Actual data time range', properties: { year_min: { type: 'number', description: 'Earliest year in the data' }, year_max: { type: 'number', description: 'Latest year in the data' } } }, chart_line_keys: { type: 'object', description: 'Mapping of line keys to city/property combinations for chart rendering' }, chart_legend: { type: 'object', description: 'Legend labels for each chart line' }, data: { type: 'object', description: 'Time-series price data keyed by year or quarter' }, additional_data: { type: 'object', description: 'Supplementary metrics (transaction counts, confidence intervals)' } } }
            }
        },
        getNeighborhoodMetricsMap: {
            method: 'GET',
            path: '/neighborhoods/metrics-map/',
            description: 'Get neighborhood-level price metrics for a city, suitable for map visualization. Returns time-series data for all neighborhoods. Use listNeighborhoods to explore available areas.',
            parameters: [
                { position: { key: 'city', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'prop_types', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'from_year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(2015)'] } },
                { position: { key: 'to_year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(2024)'] } },
                { position: { key: 'inflation', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'data_index', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(sqm,absolute)', options: ['optional()', 'default(sqm)'] } }
            ],
            tests: [
                { _description: 'Berlin neighborhood price map data', city: 1, prop_types: '1', from_year: 2015, to_year: 2024, inflation: false, data_index: 'sqm' },
                { _description: 'Frankfurt apartment neighborhood map', city: 2, prop_types: '3', from_year: 2010, to_year: 2024, data_index: 'sqm' },
                { _description: 'Munich neighborhood map with inflation', city: 5, prop_types: '1', from_year: 2015, to_year: 2024, inflation: true, data_index: 'sqm' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Neighborhood-level price data for map visualization', properties: { year_min: { type: 'number', description: 'Earliest year in the data' }, year_max: { type: 'number', description: 'Latest year in the data' }, chart_legend: { type: 'object', description: 'Legend labels for each neighborhood line' }, chart_line_keys: { type: 'array', description: 'Array of neighborhood keys for chart rendering' }, data: { type: 'array', description: 'Time-series price data for each neighborhood' }, additional_data: { type: 'array', description: 'Supplementary metrics per neighborhood' } } }
            }
        }
    }
}
