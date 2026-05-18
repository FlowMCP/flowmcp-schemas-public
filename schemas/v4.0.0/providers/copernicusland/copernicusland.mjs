export const main = {
    namespace: 'copernicusland',
    name: 'Copernicus Land Monitoring Service',
    description: 'Search the Copernicus Land Monitoring Service (CLMS) dataset catalog. Access datasets covering Urban Atlas, imperviousness, tree cover density, CORINE land cover, vegetation, water bodies, and more across Europe. Free catalog search, no API key required. Use listProducts to discover product categories, then datasetsByProduct to browse datasets within a product, and getDatasetDetail for full metadata.',
    version: '4.0.0',
    docs: ['https://land.copernicus.eu/en', 'https://eea.github.io/clms-api-docs/download.html'],
    tags: ['geospatial', 'environment', 'europe', 'opendata', 'cacheTtlDaily'],
    root: 'https://land.copernicus.eu',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        searchDatasets: {
            method: 'GET',
            path: '/api/@search',
            description: 'Search the CLMS dataset catalog by keyword. Returns datasets with UID, title, description, and review state. Results are paginated. The portal_type and metadata_fields parameters are fixed to ensure correct dataset results with UIDs.',
            parameters: [
                { position: { key: 'portal_type', value: 'DataSet', location: 'query' }, z: { primitive: 'string()', options: [], description: 'Plone content type filter — fixed to DataSet to return only dataset entries (not products or pages)' } },
                { position: { key: 'SearchableText', value: '{{SEARCH_TEXT}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'], description: 'Free-text search query to match against dataset titles and descriptions' } },
                { position: { key: 'metadata_fields', value: 'UID', location: 'query' }, z: { primitive: 'string()', options: [], description: 'Additional metadata fields to include — fixed to UID so each result includes its unique identifier' } },
                { position: { key: 'b_size', value: '{{PAGE_SIZE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(100)'], description: 'Number of results per page (1-100)' } },
                { position: { key: 'b_start', value: '{{START}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'], description: 'Pagination offset (0-based index of the first result)' } }
            ],
            tests: [
                { _description: 'Search for Urban Atlas datasets', SearchableText: 'urban atlas', b_size: 5 },
                { _description: 'Search for imperviousness datasets', SearchableText: 'imperviousness', b_size: 3 },
                { _description: 'Search for CORINE land cover', SearchableText: 'corine', b_size: 5 }
            ],
            output: {
                description: 'Paginated search results of CLMS datasets matching the query with UIDs for identification',
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Plone search API response with total count and array of matching dataset items', properties: { items_total: { type: 'number', description: 'Total number of datasets matching the search query (for pagination)' }, items: { type: 'array', description: 'Array of dataset result objects matching the search criteria', items: { type: 'object', properties: { UID: { type: 'string', description: 'Unique identifier for this dataset within the CLMS catalog' }, title: { type: 'string', description: 'Dataset title (e.g. Urban Atlas 2021, Imperviousness Density 2018)' }, description: { type: 'string', description: 'Brief text description of the dataset content and coverage' } } } } } }
            }
        },
        listProducts: {
            method: 'GET',
            path: '/api/@search',
            description: 'List all CLMS product categories such as Urban Atlas, CORINE Land Cover, Imperviousness, Tree Cover, Vegetation, Water Bodies, and more. Product paths from these results can be used in datasetsByProduct to browse datasets within a specific product.',
            parameters: [
                { position: { key: 'portal_type', value: 'Product', location: 'query' }, z: { primitive: 'string()', options: [], description: 'Plone content type filter — fixed to Product to return only product category entries' } },
                { position: { key: 'b_size', value: '{{PAGE_SIZE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'min(1)', 'max(100)'], description: 'Number of results per page (1-100)' } }
            ],
            tests: [
                { _description: 'List all CLMS product categories', b_size: 50 },
                { _description: 'List first 10 CLMS products', b_size: 10 },
                { _description: 'List products with small page size', b_size: 5 }
            ],
            output: {
                description: 'List of CLMS product categories available for dataset browsing',
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Plone search API response with total count and array of product category items', properties: { items_total: { type: 'number', description: 'Total number of product categories in the CLMS catalog' }, items: { type: 'array', description: 'Array of product category objects. Extract the URL path slug to use in datasetsByProduct.', items: { type: 'object', properties: { title: { type: 'string', description: 'Product category name (e.g. Urban Atlas, CORINE Land Cover)' }, description: { type: 'string', description: 'Brief description of what this product category covers' } } } } } }
            }
        },
        datasetsByProduct: {
            method: 'GET',
            path: '/api/@search',
            description: 'List datasets within a specific product category. Use product paths from listProducts. Common paths: /en/products/urban-atlas, /en/products/high-resolution-layer-imperviousness, /en/products/corine-land-cover, /en/products/vegetation, /en/products/water-bodies.',
            parameters: [
                { position: { key: 'portal_type', value: 'DataSet', location: 'query' }, z: { primitive: 'string()', options: [], description: 'Plone content type filter — fixed to DataSet to return only dataset entries within the product' } },
                { position: { key: 'path.query', value: '{{PRODUCT_PATH}}', location: 'query' }, z: { primitive: 'string()', options: [], description: 'Product path to filter datasets (e.g. /en/products/urban-atlas or /en/products/corine-land-cover)' } },
                { position: { key: 'metadata_fields', value: 'UID', location: 'query' }, z: { primitive: 'string()', options: [], description: 'Additional metadata fields to include — fixed to UID for dataset identification' } },
                { position: { key: 'b_size', value: '{{PAGE_SIZE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(100)'], description: 'Number of results per page (1-100)' } }
            ],
            tests: [
                { _description: 'List Urban Atlas datasets', 'path.query': '/en/products/urban-atlas', b_size: 10 },
                { _description: 'List imperviousness datasets', 'path.query': '/en/products/high-resolution-layer-imperviousness', b_size: 10 },
                { _description: 'List CORINE land cover datasets', 'path.query': '/en/products/corine-land-cover', b_size: 10 }
            ],
            output: {
                description: 'Datasets belonging to the specified product category with UIDs and descriptions',
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Plone search API response filtered to datasets within the specified product path', properties: { items_total: { type: 'number', description: 'Total number of datasets within this product category' }, items: { type: 'array', description: 'Array of dataset objects within the product. Use the dataset slug in getDatasetDetail.', items: { type: 'object', properties: { UID: { type: 'string', description: 'Unique identifier for this dataset' }, title: { type: 'string', description: 'Dataset title (e.g. Urban Atlas 2021)' }, description: { type: 'string', description: 'Brief description of the dataset content' } } } } } }
            }
        },
        getDatasetDetail: {
            method: 'GET',
            path: '/api/en/products/:productSlug/:datasetSlug',
            description: 'Get full metadata for a specific dataset including spatial coverage, temporal extent, coordinate reference systems, resolution, and download information. Use product and dataset slugs from listProducts and datasetsByProduct.',
            parameters: [
                { position: { key: 'productSlug', value: '{{PRODUCT_SLUG}}', location: 'insert' }, z: { primitive: 'string()', options: [], description: 'Product category slug (e.g. urban-atlas, corine-land-cover, high-resolution-layer-imperviousness)' } },
                { position: { key: 'datasetSlug', value: '{{DATASET_SLUG}}', location: 'insert' }, z: { primitive: 'string()', options: [], description: 'Dataset slug within the product (e.g. urban-atlas-2021, imperviousness-density-2018)' } }
            ],
            tests: [
                { _description: 'Get Urban Atlas 2021 detail', productSlug: 'urban-atlas', datasetSlug: 'urban-atlas-2021' },
                { _description: 'Get Imperviousness Density 2018 detail', productSlug: 'high-resolution-layer-imperviousness', datasetSlug: 'imperviousness-density-2018' },
                { _description: 'Get CORINE Land Cover 2018 detail', productSlug: 'corine-land-cover', datasetSlug: 'clc-2018' }
            ],
            output: {
                description: 'Full dataset metadata including spatial resolution, coverage, temporal extent, CRS list, and update frequency',
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Detailed dataset metadata from the CLMS Plone CMS with spatial and temporal characteristics', properties: { UID: { type: 'string', description: 'Unique identifier for this dataset' }, title: { type: 'string', description: 'Dataset title' }, description: { type: 'string', description: 'Full description of the dataset' }, characteristics_spatial_resolution: { type: 'string', description: 'Spatial resolution (e.g. 10m, 100m, 1:10000)' }, characteristics_spatial_coverage: { type: 'string', description: 'Geographic area covered (e.g. EEA-38+UK, EU27+UK)' }, characteristics_temporal_extent: { type: 'string', description: 'Time period covered by the dataset (e.g. 2018, 2006-2018)' }, characteristics_update_frequency: { type: 'string', description: 'How often the dataset is updated (e.g. every 6 years, annually)' }, coordinateReferenceSystemList: { type: 'array', description: 'List of coordinate reference systems available for download (e.g. EPSG:3035, EPSG:4326)', items: { type: 'string' } } } }
            }
        }
    }
}
