export const main = {
    namespace: 'pangaea',
    name: 'PANGAEA',
    description: 'Search and access earth and environmental science datasets from PANGAEA — 400K+ georeferenced datasets for climate, ocean, and geoscience research.',
    version: '4.0.0',
    docs: ['https://wiki.pangaea.de/wiki/PANGAEA_search'],
    tags: ['earth-science', 'environment', 'climate', 'ocean', 'geoscience', 'research', 'cacheTtlDaily'],
    root: 'https://www.pangaea.de',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchDatasets: {
            method: 'GET',
            path: '/advanced/search.php',
            description: 'Search the PANGAEA data repository for earth and environmental science datasets. Supports keyword query, date range, topic filtering, and pagination.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'count', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(500)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } },
                { position: { key: 'mindate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'maxdate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'topic', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(Oceans,Atmosphere,Biosphere,Cryosphere,Land Surface,Paleontology,Terrestrial Hydrosphere)', options: ['optional()'] } },
                { position: { key: 'env', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(All,aquatic,terrestrial)', options: ['optional()', 'default(All)'] } }
            ],
            tests: [
                { _description: 'Search for ocean temperature datasets', q: 'ocean temperature', count: 5 },
                { _description: 'Search for Arctic ice core datasets in Cryosphere topic', q: 'Arctic ice core', count: 5, topic: 'Cryosphere' },
                { _description: 'Search for coral reef data from 2020-2024', q: 'coral reef', count: 5, mindate: '2020-01-01', maxdate: '2024-12-31' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        totalCount: { type: 'number', description: 'Total number of matching datasets' },
                        offset: { type: 'number', description: 'Pagination offset' },
                        maxScore: { type: 'number', description: 'Highest relevancy score' },
                        timeInDatabase: { type: 'number', description: 'Query execution time in milliseconds' },
                        results: {
                            type: 'array',
                            description: 'Array of matching datasets',
                            items: {
                                type: 'object',
                                properties: {
                                    URI: { type: 'string', description: 'Dataset DOI identifier' },
                                    score: { type: 'number', description: 'Relevancy score' },
                                    html: { type: 'string', description: 'Formatted citation HTML' }
                                }
                            }
                        },
                        htmlSummary: { type: 'string', description: 'Human-readable result summary' }
                    }
                }
            }
        },
        elasticSearch: {
            method: 'GET',
            path: '/es/pangaea/panmd/_search',
            description: 'Search PANGAEA datasets via Elasticsearch API. Returns structured metadata including geographic coverage, temporal extent, authors, and parameters.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(100)'] } },
                { position: { key: 'from', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Elasticsearch for deep sea sediment data', q: 'deep sea sediment', size: 3 },
                { _description: 'Elasticsearch for Antarctic temperature records', q: 'Antarctic temperature', size: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        took: { type: 'number', description: 'Query time in milliseconds' },
                        timed_out: { type: 'boolean' },
                        hits: {
                            type: 'object',
                            properties: {
                                total: { type: 'number', description: 'Total matching documents' },
                                max_score: { type: 'number' },
                                hits: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            _id: { type: 'string', description: 'Internal document ID' },
                                            _score: { type: 'number' },
                                            _source: {
                                                type: 'object',
                                                description: 'Dataset metadata',
                                                properties: {
                                                    citation: { type: 'string' },
                                                    URI: { type: 'string', description: 'Dataset DOI' },
                                                    title: { type: 'string' },
                                                    citation_author: { type: 'array', items: { type: 'string' } },
                                                    citation_year: { type: 'number' },
                                                    dataCenter: { type: 'string' },
                                                    minLatitude: { type: 'number' },
                                                    maxLatitude: { type: 'number' },
                                                    minLongitude: { type: 'number' },
                                                    maxLongitude: { type: 'number' },
                                                    minDateTime: { type: 'string' },
                                                    maxDateTime: { type: 'string' },
                                                    loginstatus: { type: 'string' },
                                                    supplementTo: { type: 'string' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        getDatasetMetadata: {
            method: 'GET',
            path: '/es/pangaea/panmd/:datasetId',
            description: 'Retrieve full Elasticsearch metadata for a specific PANGAEA dataset by its internal ID. Returns complete structured metadata with geographic and temporal extent.',
            parameters: [
                { position: { key: 'datasetId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get metadata for dataset 726855', datasetId: '726855' },
                { _description: 'Get metadata for dataset 100052', datasetId: '100052' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        _source: {
                            type: 'object',
                            properties: {
                                citation: { type: 'string' },
                                URI: { type: 'string', description: 'Dataset DOI' },
                                title: { type: 'string' },
                                citation_author: { type: 'array', items: { type: 'string' } },
                                citation_year: { type: 'number' },
                                dataCenter: { type: 'string' },
                                minLatitude: { type: 'number' },
                                maxLatitude: { type: 'number' },
                                minLongitude: { type: 'number' },
                                maxLongitude: { type: 'number' },
                                minDateTime: { type: 'string' },
                                maxDateTime: { type: 'string' },
                                loginstatus: { type: 'string' },
                                supplementTo: { type: 'string' },
                                keywords: { type: 'array', items: { type: 'string' } },
                                type: { type: 'string' },
                                size: { type: 'number' }
                            }
                        }
                    }
                }
            }
        },
        downloadDatasetTab: {
            method: 'GET',
            path: '/tab/search',
            description: 'Search and download PANGAEA dataset content in tab-delimited format. Useful for direct data access and analysis.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'count', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Search for salinity datasets in tab format', q: 'salinity', count: 3 }
            ],
            output: {
                mimeType: 'text/plain',
                schema: {
                    type: 'string',
                    description: 'Tab-separated dataset listing with DOI, citation, and metadata columns'
                }
            }
        },
        getDatasetJsonLd: {
            method: 'GET',
            path: '/:doiPath',
            description: 'Retrieve dataset metadata in JSON-LD (schema.org) format via the PANGAEA DOI resolver. Returns structured linked data with creators, spatial/temporal coverage, and licensing.',
            parameters: [
                { position: { key: 'doiPath', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'metadata_jsonld', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get JSON-LD metadata for a PANGAEA dataset', doiPath: '10.1594/PANGAEA.726855' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        '@context': { type: 'string' },
                        '@id': { type: 'string' },
                        '@type': { type: 'string' },
                        name: { type: 'string', description: 'Dataset title' },
                        description: { type: 'string' },
                        creator: { type: 'array', description: 'Dataset authors with name and ORCID' },
                        datePublished: { type: 'string' },
                        publisher: { type: 'object' },
                        spatialCoverage: { type: 'object', description: 'Geographic bounding box' },
                        temporalCoverage: { type: 'string', description: 'ISO 8601 date range' },
                        license: { type: 'string' },
                        distribution: { type: 'array', description: 'Download links and formats' },
                        isAccessibleForFree: { type: 'boolean' }
                    }
                }
            }
        }
    }
}
